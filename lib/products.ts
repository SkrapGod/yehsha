export type Product = {
  id: string
  name: string
  flavor: string
  description: string
  price: number
  packSize?: number
  image: string
  collection: 'electrolyte' | 'shots'
  batch: string
  available?: boolean
}

export const products: Product[] = [
  {
    id: 'elec-citrus',
    name: 'YEHSHA',
    flavor: 'ORIGINAL',
    description: 'Bright citrus with a mineral finish. 1000mg electrolyte blend, zero sugar.',
    price: 19.99,
    packSize: 4,
    image: '/products/electrolyte-citrus.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'elec-berry',
    name: 'YEHSHA',
    flavor: 'FOUNDERS',
    description: 'Deep berry profile balanced with sea salt. 1000mg electrolyte blend, zero sugar.',
    price: 19.99,
    packSize: 4,
    image: '/products/electrolyte-berry.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'elec-mint',
    name: 'YEHSHA',
    flavor: 'MOONLIGHT',
    description: 'Crisp mint with a clean electrolyte kick. 1000mg blend, zero sugar.',
    price: 19.99,
    packSize: 4,
    image: '/products/electrolyte-mint.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'shot-immunity',
    name: 'Solace Shot',
    flavor: 'STAMINA+\nRECOVERY',
    description: 'Ginger, turmeric & vitamin C. A daily defense in a 2oz pour.',
    price: 17.99,
    packSize: 4,
    image: '/products/shot-immunity.png',
    collection: 'shots',
    batch: 'BATCH 007',
  },
  {
    id: 'shot-recovery',
    name: 'Solace Shot',
    flavor: 'DEFENSE+\nDIGESTION',
    description: 'Tart cherry & magnesium to help you wind down and repair.',
    price: 17.99,
    packSize: 4,
    image: '/products/shot-recovery.png',
    collection: 'shots',
    batch: 'BATCH 007',
  },
  {
    id: 'shot-energy',
    name: 'Solace Shot',
    flavor: 'FOCUS+\nENERGY',
    description: 'Green tea caffeine & B-vitamins for a clean, jitter-free lift.',
    price: 17.99,
    packSize: 4,
    image: '/products/shot-energy.png',
    collection: 'shots',
    batch: 'BATCH 007',
    available: false,
  },
]

export const FREE_DELIVERY_THRESHOLD = 100
export const FLAT_RATE_DELIVERY = 10.99
export const HST_RATE = 0.13

export type BulkTier = { units: number; label: string; discount: number }

// Ordered lowest units first. Once an order reaches a tier's unit count, that
// discount stays applied — it doesn't increase again until the order reaches
// the next tier's threshold.
export const BULK_TIERS: BulkTier[] = [
  { units: 12, label: '12-PACK', discount: 0.05 },
  { units: 24, label: '24-PACK', discount: 0.08 },
  { units: 48, label: '48-PACK', discount: 0.1 },
]

export function getActiveBulkTier(totalUnits: number): BulkTier | null {
  for (let i = BULK_TIERS.length - 1; i >= 0; i--) {
    if (totalUnits >= BULK_TIERS[i].units) return BULK_TIERS[i]
  }
  return null
}


