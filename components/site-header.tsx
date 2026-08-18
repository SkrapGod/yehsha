'use client'

import { useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/components/cart-context'

const links = [
  { label: 'Store', href: '#store' },
  { label: 'Solace Shots', href: '#shots' },
  { label: 'About', href: '#about' },
]

export function SiteHeader() {
  const { itemCount, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:bg-foreground hover:text-background md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <a
            href="#top"
            className="text-xl font-bold tracking-[0.35em] uppercase"
            aria-label="YEHSHA home"
          >
            Yehsha
          </a>
        </div>

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
          <span className="hidden font-mono text-xs tracking-[0.15em] uppercase sm:inline">
            Cart
          </span>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border border-background bg-foreground px-1 font-mono text-[10px] font-bold text-background">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile navigation panel */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`overflow-hidden border-border bg-background transition-[max-height] duration-300 md:hidden ${
          menuOpen ? 'max-h-64 border-t' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href} className="border-b border-border last:border-b-0">
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-4 font-mono text-sm tracking-[0.15em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
