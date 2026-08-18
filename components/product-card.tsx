'use client'

import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/products'
import { useCart } from '@/components/cart-context'

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  return (
    <article className="group flex flex-col border border-border bg-card">
      <div className="relative aspect-square overflow-hidden border-b border-border bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={`${product.name} — ${product.flavor}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-0 top-0 bg-foreground px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-background">
          {product.batch}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {product.name}
            </p>
            <h3 className="mt-1 text-xl font-bold leading-tight">{product.flavor}</h3>
          </div>
          <p className="font-mono text-sm font-bold whitespace-nowrap">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-6 flex items-stretch gap-3">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-10 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
              aria-label={`Decrease quantity of ${product.flavor}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex h-11 w-10 items-center justify-center font-mono text-sm tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-10 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
              aria-label={`Increase quantity of ${product.flavor}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              addItem(product, quantity)
              setQuantity(1)
            }}
            className="flex-1 bg-foreground px-4 font-mono text-xs font-bold tracking-[0.2em] uppercase text-background transition-transform hover:-translate-y-0.5"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
