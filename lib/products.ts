export type Product = {
  id: string
  name: string
  flavor: string
  description: string
  price: number
  packSize?: number
  image: string
  imageOverlay?: number
  imageBrightness?: number
  secondaryImage?: string
  tertiaryImage?: string
  extendedDescription?: string
  collection: 'electrolyte' | 'shots'
  batch: string
  available?: boolean
}

export const products: Product[] = [
  {
    id: 'elec-berry',
    name: 'YEHSHA',
    flavor: 'FOUNDERS',
    description: 'Deep berry profile balanced with sea salt. 1000mg electrolyte blend, zero sugar.',
    price: 21.99,
    packSize: 4,
    image: '/products/electrolyte-founders.jpg',
    imageBrightness: 1.01,
    collection: 'electrolyte',
    batch: 'BATCH 307',
  },
  {
    id: 'elec-mint',
    name: 'YEHSHA',
    flavor: 'MOONLIGHT',
    description: 'Crisp mint with a clean electrolyte kick. 1000mg blend, zero sugar.',
    price: 21.99,
    packSize: 4,
    image: '/products/electrolyte-moonlight-v3.jpg',
    imageBrightness: 1.06,
    collection: 'electrolyte',
    batch: 'BATCH 981',
  },
  {
    id: 'elec-citrus',
    name: 'YEHSHA',
    flavor: 'ORIGINAL',
    description: 'Bright citrus with a mineral finish. 1000mg electrolyte blend, zero sugar.',
    price: 21.99,
    packSize: 4,
    image: '/products/electrolyte-original.jpg',
    imageBrightness: 1.07,
    collection: 'electrolyte',
    batch: 'BATCH 268',
  },
  {
    id: 'shot-recovery',
    name: 'Solace Shot',
    flavor: 'DEFENSE+\nDIGESTION',
    description: 'Tart cherry & magnesium to help you wind down and repair.',
    price: 17.99,
    packSize: 4,
    image: '/products/shot-defense-digestion.jpg',
    imageOverlay: 0.04,
    collection: 'shots',
    batch: 'BATCH 428',
  },
  {
    id: 'shot-immunity',
    name: 'Solace Shot',
    flavor: 'STAMINA+\nRECOVERY',
    description: 'Ginger, turmeric & vitamin C. A daily defense in a 2oz pour.',
    price: 17.99,
    packSize: 4,
    image: '/products/shot-stamina-recovery-v2.jpg',
    imageOverlay: 0.06,
    imageBrightness: 1.05,
    collection: 'shots',
    batch: 'BATCH 612',
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
    batch: 'BATCH 789',
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
  { units: 12, label: '12-PACK', discount: 0.04 },
  { units: 24, label: '24-PACK', discount: 0.05 },
  { units: 48, label: '48-PACK', discount: 0.06 },
]

export function getActiveBulkTier(totalUnits: number): BulkTier | null {
  for (let i = BULK_TIERS.length - 1; i >= 0; i--) {
    if (totalUnits >= BULK_TIERS[i].units) return BULK_TIERS[i]
  }
  return null
}


