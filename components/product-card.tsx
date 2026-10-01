'use client'

import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/products'
import { useCart } from '@/components/cart-context'
import { ProductModal } from '@/components/product-modal'

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [justRevealed, setJustRevealed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { addItem } = useCart()
  const available = product.available !== false

  const revealSoldOut = () => {
    setJustRevealed(true)
    window.setTimeout(() => setJustRevealed(false), 1600)
  }

  return (
    <article
      className="group flex cursor-pointer flex-col border-[2px] border-[#121110] bg-[#121110] text-[#f7f5f1]"
      onClick={() => setModalOpen(true)}
    >
      <div className="relative aspect-square overflow-hidden border-b border-[#121110] bg-muted">
        {available ? (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={`${product.name} â€” ${product.flavor}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 md:group-hover:scale-105"
            style={product.imageBrightness ? { filter: `brightness(${product.imageBrightness})` } : undefined}
          />
        ) : (
          <div className="absolute inset-0 bg-[#f3f1ec]" />
        )}
        {available && product.collection === 'shots' && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${product.imageOverlay ?? 0.1})` }}
          />
        )}
        <span className="absolute left-0 top-0 bg-[#121110] px-3 py-1.5 font-sans text-[11px] tracking-[0.2em] uppercase text-[#f7f5f1]">
          {product.batch}
        </span>
        {!available && (
          <span className="absolute right-0 top-0 bg-[#121110] px-3 py-1.5 font-sans text-[11px] tracking-[0.2em] uppercase text-[#f7f5f1]">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`whitespace-pre-line text-[22.67px] tracking-[-0.04em] ${
                product.collection === 'shots' ? '-mt-0.5 leading-none' : '-mt-[5px] leading-tight'
              }`}
              style={{
                fontFamily: 'var(--font-google-sans-flex)',
                fontVariationSettings: `'wght' ${product.collection === 'electrolyte' ? 700 : 650}, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 24`,
              }}
            >
              {product.flavor}
            </h3>
            {product.packSize && (
              <p
                className={`ml-0.5 text-[10px] tracking-[0.2em] text-[#f7f5f1] ${
                  product.collection === 'shots' ? 'mt-px' : '-mt-[2px]'
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
            className="-mt-[6px] font-sans md:-mt-[4px] lg:-mt-px lg:mr-px text-[14.67px] font-bold whitespace-nowrap lg:text-[16px]"
          >
            ${product.price.toFixed(2)}
          </p>
        </div>

        <p className="mt-2 font-sans text-[15.33px] leading-snug text-white/95">
          {product.description}
        </p>

        <div className="mt-auto flex items-stretch gap-3 pt-6" onClick={(e) => e.stopPropagation()}>
          <div className="my-px mr-px flex items-center border border-white text-white lg:shrink-0 lg:basis-[35.7%]">
            <button
              type="button"
              onClick={() => (available ? setQuantity((q) => Math.max(1, q - 1)) : revealSoldOut())}
              className="flex h-[42px] w-10 items-center justify-center transition-colors lg:w-auto lg:flex-1 hover:bg-[#f7f5f1] hover:text-[#121110]"
              aria-label={`Decrease quantity of ${product.flavor}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="flex h-[42px] w-[38px] items-center justify-center text-[14px] tracking-[0.08em] tabular-nums"
              style={{
                fontFamily: 'var(--font-google-sans-flex)',
                fontVariationSettings: "'wght' 550, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 14",
              }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => (available ? setQuantity((q) => q + 1) : revealSoldOut())}
              className="flex h-[42px] w-10 items-center justify-center transition-colors lg:w-auto lg:flex-1 hover:bg-[#f7f5f1] hover:text-[#121110]"
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
            className="my-px ml-px flex-1 border border-white bg-white px-4 text-[13px] tracking-[0.06em] uppercase text-[#121110] transition-colors hover:border-white hover:bg-[#121110] hover:text-white"
            style={{
              fontFamily: 'var(--font-google-sans-flex)',
              fontVariationSettings: "'wght' 650, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 14",
            }}
          >
            {justRevealed ? (
  'Sold Out'
) : (
  <>
    Add to <span style={{ marginRight: '-0.04em' }}>C</span>
    <span style={{ marginRight: '-0.04em' }}>a</span>rt
  </>
)}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <ProductModal product={product} onClose={() => setModalOpen(false)} />
        </div>
      )}
    </article>
  )
}
