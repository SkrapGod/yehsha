export type Product = {
  id: string
  name: string
  flavor: string
  description: string
  price: number
  image: string
  collection: 'electrolyte' | 'shots'
  batch: string
}

export const products: Product[] = [
  {
    id: 'elec-citrus',
    name: 'YEHSHA Electrolyte',
    flavor: 'Citrus Salt',
    description: 'Bright citrus with a mineral finish. 1000mg electrolyte blend, zero sugar.',
    price: 4.5,
    image: '/products/electrolyte-citrus.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'elec-berry',
    name: 'YEHSHA Electrolyte',
    flavor: 'Wild Berry',
    description: 'Deep berry profile balanced with sea salt. 1000mg electrolyte blend, zero sugar.',
    price: 4.5,
    image: '/products/electrolyte-berry.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'elec-mint',
    name: 'YEHSHA Electrolyte',
    flavor: 'Cool Mint',
    description: 'Crisp mint with a clean electrolyte kick. 1000mg blend, zero sugar.',
    price: 4.5,
    image: '/products/electrolyte-mint.png',
    collection: 'electrolyte',
    batch: 'BATCH 014',
  },
  {
    id: 'shot-immunity',
    name: 'Solace Shot',
    flavor: 'Immunity',
    description: 'Ginger, turmeric & vitamin C. A daily defense in a 2oz pour.',
    price: 6.0,
    image: '/products/shot-immunity.png',
    collection: 'shots',
    batch: 'BATCH 007',
  },
  {
    id: 'shot-recovery',
    name: 'Solace Shot',
    flavor: 'Recovery',
    description: 'Tart cherry & magnesium to help you wind down and repair.',
    price: 6.0,
    image: '/products/shot-recovery.png',
    collection: 'shots',
    batch: 'BATCH 007',
  },
  {
    id: 'shot-energy',
    name: 'Solace Shot',
    flavor: 'Energy',
    description: 'Green tea caffeine & B-vitamins for a clean, jitter-free lift.',
    price: 6.0,
    image: '/products/shot-energy.png',
    collection: 'shots',
    batch: 'BATCH 007',
  },
]

export const FREE_DELIVERY_THRESHOLD = 100
export const FLAT_RATE_DELIVERY = 10.99
export const HST_RATE = 0.13
