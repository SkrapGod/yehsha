'use client'

import { useEffect } from 'react'
import { STORAGE_KEY } from '@/components/cart-context'

export default function CheckoutSuccessPage() {
  // The cart is only cleared here, after Stripe sends the customer back, so a cancelled
  // payment leaves the cart intact.
  useEffect(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage unavailable: nothing to clear.
    }
  }, [])

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Order received</p>
      <h1
        className="mt-3 text-4xl tracking-tight md:text-5xl"
        style={{
          fontFamily: 'var(--font-google-sans-flex)',
          fontVariationSettings: "'wght' 650, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 40",
        }}
      >
        Thank you.
      </h1>
      <p className="mt-4 max-w-sm text-[15.33px] leading-relaxed text-muted-foreground">
        Your payment went through. A receipt is on its way to your email, and we&apos;ll be in touch about delivery.
      </p>
      <a
        href="/"
        className="mt-8 border border-foreground bg-foreground px-6 py-3 font-mono text-[13.33px] font-bold tracking-[0.12em] uppercase text-background transition-colors hover:bg-background hover:text-foreground"
      >
        Back to YEHSHA
      </a>
    </main>
  )
}
