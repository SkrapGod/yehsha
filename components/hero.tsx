'use client'

import { useEffect, useState } from 'react'

const phrases = ['YEHSHA', 'COME TO LIFE', 'PURE HYDRATION']

export function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative isolate min-h-[88vh] overflow-hidden bg-foreground text-background">
      {/* Background video placeholder — drop a src on the <video> when ready */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster=""
        aria-hidden="true"
      >
        {/* <source src="/hero.mp4" type="video/mp4" /> */}
      </video>
      <div className="absolute inset-0 -z-10 bg-foreground" aria-hidden="true" />

      <div className="mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-between px-4 py-10 md:px-8">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.25em] uppercase text-background/60">
          <span>Est. — Ontario</span>
          <span>High-Grade Hydration</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-6 font-mono text-xs tracking-[0.3em] uppercase text-background/60">
            Electrolytes / Wellness Shots
          </p>
          <h1 className="min-h-[1.1em] text-balance text-[18vw] font-bold leading-none tracking-tight md:text-[10rem]">
            {phrases.map((phrase, i) => (
              <span
                key={phrase}
                aria-hidden={i !== index}
                className={i === index ? 'block' : 'hidden'}
                style={i === index ? { animation: 'marquee-in 0.6s ease-out' } : undefined}
              >
                {phrase}
              </span>
            ))}
          </h1>
          <div className="mt-10">
            <a
              href="#store"
              className="inline-block bg-background px-10 py-4 font-mono text-xs font-bold tracking-[0.25em] uppercase text-foreground transition-transform hover:-translate-y-0.5"
            >
              Shop Hydration
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {phrases.map((phrase, i) => (
            <span
              key={phrase}
              className={`h-[2px] w-10 transition-colors ${i === index ? 'bg-background' : 'bg-background/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
