import type { Product } from '@/lib/products'
import {
  FLAT_RATE_DELIVERY,
  FREE_DELIVERY_THRESHOLD,
  HST_RATE,
  getActiveBulkTier,
} from '@/lib/products'

export type PricedLine = {
  product: Product
  quantity: number
}

// Single source of truth for order math. Used by the cart UI and by the server when it
// builds the Stripe session, so the two can never disagree.
export function computeOrder(lines: PricedLine[]) {
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
    itemCount,
    totalUnits,
    subtotal,
    bulkDiscount,
    bulkDiscountLabel,
    delivery,
    hst,
    total: discountedSubtotal + delivery + hst,
    remainingForFreeDelivery,
    freeDeliveryProgress,
  }
}

export const toCents = (dollars: number) => Math.round(dollars * 100)
