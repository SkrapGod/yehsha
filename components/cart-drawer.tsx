'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { FLAT_RATE_DELIVERY } from '@/lib/products'

export function CartDrawer() {
  const {
    lines,
    isOpen,
    itemCount,
    subtotal,
    bulkDiscount,
    bulkDiscountLabel,
    delivery,
    hst,
    total,
    remainingForFreeDelivery,
    freeDeliveryProgress,
    updateQuantity,
    removeItem,
    closeCart,
  } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-mono text-[13.8px] font-bold tracking-[0.25em] uppercase">
            Your Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free delivery tracker */}
        <div className="border-b border-border px-6 py-5">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            {remainingForFreeDelivery > 0 ? (
              <>
                You&apos;re{' '}
                <span className="font-bold text-foreground">
                  ${remainingForFreeDelivery.toFixed(2)}
                </span>{' '}
                away from free local delivery — flat rate ${FLAT_RATE_DELIVERY.toFixed(2)} until then
              </>
            ) : (
              <span className="font-bold text-foreground">
                You&apos;ve unlocked free local delivery
              </span>
            )}
          </p>
          <div className="mt-3 h-1.5 w-full bg-muted">
            <div
              className="h-full bg-foreground transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-lg font-bold">Your cart is empty</p>
              <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                Add hydration to get started
              </p>
            </div>
          ) : (
            <ul>
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="flex gap-4 border-b border-border px-6 py-5"
                >
                  <div className="relative h-20 w-20 shrink-0 border border-border bg-muted">
                    <Image
                      src={line.product.image || '/placeholder.svg'}
                      alt={`${line.product.name} — ${line.product.flavor}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className="font-mono text-[10px] tracking-[0.09em] uppercase text-muted-foreground"
                          style={{ wordSpacing: '-0.21em' }}
                        >
                          {line.product.name}
                        </p>
                        <p
                          className="whitespace-pre-line text-[15px] leading-tight tracking-[-0.01em]"
                          style={{
                            fontFamily: 'var(--font-google-sans-flex)',
                            fontVariationSettings: "'wght' 500, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 16",
                          }}
                        >
                          {line.product.flavor}
                        </p>
                        <p
                          className="mt-0.5 ml-0.5 text-[10px] tracking-[0.2em] text-foreground"
                          style={{
                            fontFamily: 'var(--font-google-sans-flex)',
                            fontVariationSettings: "'wght' 600, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 14",
                          }}
                        >
                          {line.quantity * (line.product.packSize ?? 1)} Bottles
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.product.id)}
                        className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
                          aria-label={`Decrease ${line.product.flavor}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center font-mono text-xs tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
                          aria-label={`Increase ${line.product.flavor}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold tabular-nums">
                        ${(line.product.price * line.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="flex flex-col border-t border-border md:px-6 md:py-5">
            <dl className="order-1 flex flex-col gap-2 px-6 pt-5 font-mono text-xs tracking-[0.1em] uppercase md:p-0">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
              </div>
              {bulkDiscount > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">{bulkDiscountLabel}</dt>
                  <dd className="tabular-nums">-${bulkDiscount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="tabular-nums">
                  {delivery === 0 ? 'Free' : `$${FLAT_RATE_DELIVERY.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">HST (13%)</dt>
                <dd className="tabular-nums">${hst.toFixed(2)}</dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                <dt>Total</dt>
                <dd className="tabular-nums">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="order-3 w-full bg-foreground py-4 font-mono text-[13.8px] font-bold tracking-[0.25em] uppercase text-background transition-transform hover:-translate-y-0.5 md:order-2 md:mt-5"
            >
              Proceed to Checkout
            </button>
            <p className="order-2 px-6 pb-4 pt-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground md:order-3 md:mt-3 md:p-0">
              Secure checkout — powered by Stripe
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
