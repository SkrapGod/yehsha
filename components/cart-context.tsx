'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Product } from '@/lib/products'
import {
  FLAT_RATE_DELIVERY,
  FREE_DELIVERY_THRESHOLD,
  HST_RATE,
  getActiveBulkTier,
} from '@/lib/products'

export type CartLine = {
  product: Product
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  bulkDiscount: number
  bulkDiscountLabel: string | null
  delivery: number
  hst: number
  total: number
  remainingForFreeDelivery: number
  freeDeliveryProgress: number
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.product.id === product.id)
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      }
      return [...prev, { product, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((line) => (line.product.id === id ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.product.id !== id))
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
    const totalUnits = lines.reduce(
      (sum, line) => sum + line.quantity * (line.product.packSize ?? 1),
      0,
    )
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
    const bulkTier = getActiveBulkTier(totalUnits)
    // Discount is pinned to the value of exactly the tier's unit count (at the
    // order's average per-unit price), not the whole current subtotal — so
    // units beyond the active tier (e.g. the 4th/5th pack after the 3-pack
    // tier) don't grow the discount until the next tier is reached.
    const pricePerUnit = totalUnits > 0 ? subtotal / totalUnits : 0
    const bulkDiscount = bulkTier
      ? Math.round(pricePerUnit * bulkTier.units * bulkTier.discount * 100) / 100
      : 0
    const bulkDiscountLabel = bulkTier ? `Bulk Discount (${bulkTier.label})` : null
    const discountedSubtotal = subtotal - bulkDiscount
    const qualifiesFree = discountedSubtotal >= FREE_DELIVERY_THRESHOLD
    const delivery = itemCount === 0 || qualifiesFree ? 0 : FLAT_RATE_DELIVERY
    const hst = Math.round((discountedSubtotal + delivery) * HST_RATE * 100) / 100
    const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - discountedSubtotal)
    const freeDeliveryProgress = Math.min(100, (discountedSubtotal / FREE_DELIVERY_THRESHOLD) * 100)

    return {
      lines,
      isOpen,
      itemCount,
      subtotal,
      bulkDiscount,
      bulkDiscountLabel,
      delivery,
      hst,
      total: discountedSubtotal + delivery + hst,
      remainingForFreeDelivery,
      freeDeliveryProgress,
      addItem,
      updateQuantity,
      removeItem,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }
  }, [lines, isOpen, addItem, updateQuantity, removeItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
