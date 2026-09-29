'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/lib/products'
import { useCart } from '@/components/cart-context'

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [justRevealed, setJustRevealed] = useState(false)
  const [slide, setSlide] = useState(0)
  const { addItem } = useCart()
  const available = product.available !== false
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const revealSoldOut = () => {
    setJustRevealed(true)
    window.setTimeout(() => setJustRevealed(false), 1600)
  }

  const goTo = (i: number) => setSlide(Math.max(0, Math.min(2, i)))

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="flex max-h-full w-full max-w-md flex-col overflow-y-auto border border-border bg-background"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — ${product.flavor}`}
        >
          <div
            className="relative aspect-square shrink-0 touch-pan-y overflow-hidden border-b border-border bg-muted"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const delta = e.changedTouches[0].clientX - touchStartX.current
              if (delta > 40) goTo(slide - 1)
              if (delta < -40) goTo(slide + 1)
              touchStartX.current = null
            }}
          >
            <div
              className="flex h-full transition-transform duration-300"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              <div className="relative h-full w-full shrink-0">
                {available ? (
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={`${product.name} — ${product.flavor}`}
                    fill
                    sizes="(max-width: 448px) 100vw, 448px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#f3f1ec]" />
                )}
              </div>
              <div className="relative h-full w-full shrink-0 bg-[#f3f1ec]">
                {product.secondaryImage && (
                  <Image
                    src={product.secondaryImage}
                    alt={`${product.name} — ${product.flavor}, alternate view`}
                    fill
                    sizes="(max-width: 448px) 100vw, 448px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="relative h-full w-full shrink-0 bg-[#f3f1ec]">
                {product.tertiaryImage && (
                  <Image
                    src={product.tertiaryImage}
                    alt={`${product.name} — ${product.flavor}, alternate view`}
                    fill
                    sizes="(max-width: 448px) 100vw, 448px"
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <span className="absolute left-0 top-0 bg-foreground px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase text-background">
              {product.batch}
            </span>
            {!available && (
              <span className="absolute right-0 top-0 bg-foreground px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase text-background">
                Sold Out
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-border bg-background transition-colors hover:bg-foreground hover:text-background"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => goTo(slide - 1)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border bg-background/90 transition-colors hover:bg-foreground hover:text-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(slide + 1)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border bg-background/90 transition-colors hover:bg-foreground hover:text-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full border border-background transition-colors ${
                    slide === i ? 'bg-background' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
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

            <p className="mt-2 font-sans text-[15.33px] leading-snug text-muted-foreground">
              {product.description}
            </p>

            <p className="mt-4 min-h-[110px] font-sans text-sm leading-relaxed text-muted-foreground">
              {product.extendedDescription || product.description}
            </p>

            <div className="mt-auto flex items-stretch gap-3 pt-6" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </div>
    </>
  )
}
