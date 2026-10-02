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

  const goTo = (i: number) => setSlide(((i % 3) + 3) % 3)

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="flex max-h-full w-full max-w-md flex-col overflow-hidden border-[2px] border-[#121110] bg-[#121110] text-[#f7f5f1]"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — ${product.flavor}`}
        >
          <div
            className="relative aspect-square max-h-[42dvh] shrink-0 touch-pan-y overflow-hidden border-b border-[#121110] bg-muted"
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

            <span className="absolute left-0 top-0 bg-[#121110] px-3 py-1.5 font-sans text-[11px] tracking-[0.2em] uppercase text-[#f7f5f1]">
              {product.batch}
            </span>
            {!available && (
              <span className="absolute right-0 top-0 bg-[#121110] px-3 py-1.5 font-sans text-[11px] tracking-[0.2em] uppercase text-[#f7f5f1]">
                Sold Out
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-[#121110] bg-[#121110] text-[#f7f5f1] transition-colors hover:bg-[#f7f5f1] hover:text-[#121110]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => goTo(slide - 1)}
              className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#121110] bg-[#121110]/90 text-[#f7f5f1] transition-colors lg:flex hover:bg-[#f7f5f1] hover:text-[#121110]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(slide + 1)}
              className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#121110] bg-[#121110]/90 text-[#f7f5f1] transition-colors lg:flex hover:bg-[#f7f5f1] hover:text-[#121110]"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 gap-2 lg:flex">
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
              <p className="-mt-[6px] font-sans md:-mt-[4px] lg:-mt-px lg:mr-px text-[14.67px] font-bold whitespace-nowrap lg:text-[16px]">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="mt-2 font-sans text-[15.33px] leading-snug text-white/95">
              {product.description}
            </p>

            <p className="mt-[7.2px] font-sans text-sm leading-relaxed text-white/70">
              {product.extendedDescription || product.description}
            </p>

            <div className="mt-auto flex items-stretch gap-3 pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="my-px mr-px flex items-center border border-white text-white lg:shrink-0 lg:basis-[35.7%]">
                <button
                  type="button"
                  onClick={() => (available ? setQuantity((q) => Math.max(1, q - 1)) : revealSoldOut())}
                  className="flex h-[42px] w-9 items-center justify-center transition-colors md:w-10 lg:w-auto lg:flex-1 hover:bg-[#f7f5f1] hover:text-[#121110]"
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
                  className="flex h-[42px] w-9 items-center justify-center transition-colors md:w-10 lg:w-auto lg:flex-1 hover:bg-[#f7f5f1] hover:text-[#121110]"
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
        </div>
      </div>
    </>
  )
}
