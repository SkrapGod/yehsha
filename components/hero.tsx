export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[88vh] overflow-hidden bg-background text-foreground">
      {/* Background video — replace /hero.mp4 in the public folder with your upload */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        aria-hidden="true"
        style={{ animation: 'hero-image-fade 0.3s ease-out' }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* Light scrim keeps the dark corner labels + headline legible over any footage */}
      <div className="absolute inset-0 -z-10 bg-background/40" aria-hidden="true" />

      <div className="mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-between px-4 py-10 md:px-8">
        {/* Top corner labels — pinned to the outer edges and stay justified on wrap */}
        <div className="flex items-start justify-between gap-6 font-mono text-[11px] tracking-[0.25em] uppercase text-foreground/60">
          <span className="max-w-[45%] text-left text-balance">Est. — Ontario</span>
          <span className="max-w-[45%] text-right text-balance">High-Grade Hydration</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
          <p className="mb-[342px] font-mono text-xs tracking-[0.3em] uppercase text-foreground/60">
            Electrolytes / Wellness Shots
          </p>
        </div>
      </div>
    </section>
  )
}
