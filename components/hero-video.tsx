'use client'

import { useEffect, useState } from 'react'

export function HeroVideo() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setShow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!show) return null

  return (
    <video
      className="absolute inset-0 -z-20 h-full w-full object-contain lg:object-cover"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      style={{ animation: 'hero-image-fade 0.3s ease-out' }}
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  )
}
