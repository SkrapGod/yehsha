'use client'

import { useState } from 'react'

const links = [
  { label: 'Store', href: '#store' },
  { label: 'Solace Shots', href: '#shots' },
  { label: 'About', href: '#about' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
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
