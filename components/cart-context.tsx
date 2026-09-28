'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Product } from '@/lib/products'
import { FLAT_RATE_DELIVERY, FREE_DELIVERY_THRESHOLD, HST_RATE } from '@/lib/products'

export type CartLine = {
  product: Product
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  itemCount: number
  subtotal: number
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
    setIsOpen(true)
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
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
    const qualifiesFree = subtotal >= FREE_DELIVERY_THRESHOLD
    const delivery = itemCount === 0 || qualifiesFree ? 0 : FLAT_RATE_DELIVERY
    const hst = Math.round((subtotal + delivery) * HST_RATE * 100) / 100
    const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
    const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

    return {
      lines,
      isOpen,
      itemCount,
      subtotal,
      delivery,
      hst,
      total: subtotal + delivery + hst,
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
