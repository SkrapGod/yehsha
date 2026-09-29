'use client'

import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/products'
import { useCart } from '@/components/cart-context'

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [justRevealed, setJustRevealed] = useState(false)
  const { addItem } = useCart()
  const available = product.available !== false

  const revealSoldOut = () => {
    setJustRevealed(true)
    window.setTimeout(() => setJustRevealed(false), 1600)
  }

  return (
    <article className="group flex flex-col border border-border bg-card">
      <div className="relative aspect-square overflow-hidden border-b border-border bg-muted">
        {available ? (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={`${product.name} — ${product.flavor}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f3f1ec]" />
        )}
        <span className="absolute left-0 top-0 bg-foreground px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase text-background">
          {product.batch}
        </span>
        {!available && (
          <span className="absolute right-0 top-0 bg-foreground px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase text-background">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.collection === 'electrolyte' && (
              <p
                className="font-mono text-[11.33px] tracking-[0.2em] uppercase"
                style={{ color: 'oklch(0.216 0 0)' }}
              >
                YEHSHA
              </p>
            )}
            <h3
              className={`-mt-0.5 whitespace-pre-line text-[22.67px] tracking-[-0.02em] ${
                product.collection === 'shots' ? 'leading-none' : 'leading-tight'
              }`}
              style={{
                fontFamily: 'var(--font-google-sans-flex)',
                fontVariationSettings: "'wght' 650, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 24",
              }}
            >
              {product.flavor}
            </h3>
            {product.packSize && (
              <p
                className={`ml-0.5 text-[10px] tracking-[0.2em] text-foreground ${
                  product.collection === 'shots' ? 'mt-0' : '-mt-1'
                }`}
                style={{
                  fontFamily: 'var(--font-google-sans-flex)',
                  fontVariationSettings: "'wght' 600, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 14",
                }}
              >
                {product.packSize}-PACK
              </p>
            )}
          </div>
          <p
            className={`font-mono text-[14.67px] font-bold whitespace-nowrap lg:text-[16px] ${
              product.collection === 'electrolyte' ? 'mt-1' : 'mt-0.5'
            }`}
          >
            ${product.price.toFixed(2)}
          </p>
        </div>

        <p
          className="mt-2 font-sans text-[15.33px] leading-snug text-muted-foreground"
        >
          {product.description}
        </p>

        <div className="mt-auto flex items-stretch gap-3 pt-6">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => (available ? setQuantity((q) => Math.max(1, q - 1)) : revealSoldOut())}
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
              onClick={() => (available ? setQuantity((q) => q + 1) : revealSoldOut())}
              className="flex h-11 w-10 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
              aria-label={`Increase quantity of ${product.flavor}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!available) {
                revealSoldOut()
                return
              }
              addItem(product, quantity)
              setQuantity(1)
            }}
            className="flex-1 bg-foreground px-4 font-mono text-[13.33px] font-bold tracking-[0.12em] uppercase text-background transition-transform hover:-translate-y-0.5"
          >
            {justRevealed ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
