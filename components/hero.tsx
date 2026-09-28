const shopButtonStyle = {
  fontFamily: 'var(--font-google-sans-flex)',
  fontVariationSettings: "'wght' 600, 'wdth' 105, 'GRAD' 62, 'ROND' 0, 'slnt' 0, 'opsz' 24",
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex h-[calc(100svh-42px)] flex-col overflow-hidden bg-background text-foreground md:block md:h-auto md:min-h-[75vh] lg:min-h-[88vh]"
    >
      {/* Background video (tablet and up) — replace /hero.mp4 in the public folder with your upload */}
      <video
        className="absolute inset-0 -z-20 hidden h-full w-full object-contain md:block lg:object-cover"
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
      <div className="mx-auto hidden max-w-[1400px] flex-col justify-between px-4 md:flex md:min-h-[75vh] md:px-8 md:py-10 lg:min-h-[88vh]">
        {/* Top corner labels — tablet and up only */}
        <div className="flex items-start justify-between gap-6 font-mono text-[11px] tracking-[0.25em] uppercase text-foreground/80 md:text-sm lg:text-[14.08px]">
          <span className="max-w-[45%] text-left text-balance">CRAFTED —ON </span>
          <span className="max-w-[45%] text-right text-balance">High-Grade Hydration</span>
        </div>

        <div className="hidden flex-1 flex-col items-center justify-start overflow-hidden text-center md:flex md:pt-[49vh] lg:pt-[63vh]">
          <a
            href="#store"
            className="hidden bg-black p-2.5 text-xs uppercase tracking-[0.1256em] text-white md:mt-[56px] md:block md:p-[12px] md:text-[14.8px] lg:tracking-[0.1548em] lg:px-[17.8px] lg:py-[13.8px] lg:text-[16.1px]"
            style={shopButtonStyle}
          >
            <span className="-mr-[0.1256em] whitespace-nowrap lg:-mr-[0.1548em]">Shop Yehsha</span>
          </a>
        </div>
      </div>

      {/* Mobile hero image + button — replace the video below md */}
      <img src="/hero-mobile.jpg" alt="YEHSHA" className="min-h-0 w-full flex-1 scale-[1.12] object-contain md:hidden" />
      <a
        href="#store"
        className="relative z-10 w-full shrink-0 bg-black p-3 text-center text-[16.6px] uppercase tracking-[0.1548em] text-white md:hidden"
        style={shopButtonStyle}
      >
        Shop Yehsha
      </a>
    </section>
  )
}
