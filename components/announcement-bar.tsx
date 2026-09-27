'use client'

import { useEffect, useState } from 'react'

const messages = [
  '$10.99 FLAT-RATE DELIVERY — GTA TO TRI-CITIES, HAMILTON',
  'ORDER CUTOFF — WEDNESDAY 11:59PM',
  'FREE LOCAL DELIVERY ON ORDERS OVER $100',
]

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-foreground text-background">
      <div className="relative mx-auto flex h-9 max-w-[1400px] items-center justify-center overflow-hidden px-4">
        <p
          key={index}
          className="w-full text-center font-mono text-[11px] tracking-[0.25em] uppercase"
          style={{ animation: 'slide-in-right 0.5s ease-out' }}
          aria-live="polite"
        >
          {messages[index]}
        </p>
      </div>
    </div>
  )
}
