'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Product } from '@/lib/products'
import {
  FLAT_RATE_DELIVERY,
  FREE_DELIVERY_THRESHOLD,
  HST_RATE,
  getActiveBulkTier,
  products,
} from '@/lib/products'

export type CartLine = {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'yehsha-cart-v1'
const CART_TTL_MS = 24 * 60 * 60 * 1000 // expires 24h after the last change
const MAX_QUANTITY = 999

type StoredCart = {
  savedAt: number
  lines: { id: string; quantity: number }[]
  postalCode: string
}

// Rebuilds the cart from storage against the current product list, so stale prices,
// removed products and sold-out items can never come back from an old save.
function readStoredCart(): { lines: CartLine[]; postalCode: string } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<StoredCart>
    const age = typeof data.savedAt === 'number' ? Date.now() - data.savedAt : Infinity
    if (age < 0 || age > CART_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const lines: CartLine[] = []
    for (const item of Array.isArray(data.lines) ? data.lines : []) {
      const product = products.find((p) => p.id === item?.id)
      const quantity = Math.floor(Number(item?.quantity))
      if (!product || product.available === false || !(quantity >= 1)) continue
      if (lines.some((line) => line.product.id === product.id)) continue
      lines.push({ product, quantity: Math.min(quantity, MAX_QUANTITY) })
    }
    const postalCode =
      typeof data.postalCode === 'string' && /^[A-Z0-9]{0,3}( [A-Z0-9]{1,3})?$/.test(data.postalCode)
        ? data.postalCode
        : ''
    return { lines, postalCode }
  } catch {
    return null
  }
}

function serializeCart(lines: CartLine[], postalCode: string) {
  return JSON.stringify({
    lines: lines.map((line) => ({ id: line.product.id, quantity: line.quantity })),
    postalCode,
  })
}

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  postalCode: string
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
  clearCart: () => void
  setPostalCode: (postalCode: string) => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const lastSaved = useRef('')

  // Restore after the first render so server and browser markup match.
  useEffect(() => {
    const stored = readStoredCart()
    if (stored) {
      setLines(stored.lines)
      setPostalCode(stored.postalCode)
    }
    lastSaved.current = serializeCart(stored?.lines ?? [], stored?.postalCode ?? '')
    setHydrated(true)
  }, [])

  // Only writes when the cart actually changed, so just visiting the site never
  // extends the 24h expiry.
  useEffect(() => {
    if (!hydrated) return
    const content = serializeCart(lines, postalCode)
    if (content === lastSaved.current) return
    lastSaved.current = content
    try {
      if (lines.length === 0 && !postalCode) {
        window.localStorage.removeItem(STORAGE_KEY)
      } else {
        const stored: StoredCart = {
          savedAt: Date.now(),
          lines: lines.map((line) => ({ id: line.product.id, quantity: line.quantity })),
          postalCode,
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
      }
    } catch {
      // Storage unavailable (private mode, quota): the cart just won't persist.
    }
  }, [lines, postalCode, hydrated])

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

  const clearCart = useCallback(() => {
    setLines([])
    setPostalCode('')
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
      postalCode,
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
      clearCart,
      setPostalCode,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }
  }, [lines, isOpen, postalCode, addItem, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
