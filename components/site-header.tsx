'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart-context'

const links = [
  { label: 'Store', href: '#store' },
  { label: 'Solace Shots', href: '#shots' },
  { label: 'About', href: '#about' },
]

export function SiteHeader() {
  const { itemCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <a
          href="#top"
          className="text-xl font-bold tracking-[0.35em] uppercase"
          aria-label="YEHSHA home"
        >
          Yehsha
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center gap-2 border border-border px-3 py-2 transition-colors hover:bg-foreground hover:text-background"
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="font-mono text-xs tracking-[0.15em] uppercase">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border border-background bg-foreground px-1 font-mono text-[10px] font-bold text-background">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
