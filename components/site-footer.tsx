export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <img
              src="/yehsha-wordmark.png"
              alt="YEHSHA"
              width={700}
              height={148}
              className="h-7 w-auto brightness-0 invert"
            />
            <p className="mt-5 text-sm leading-relaxed text-background/60">
              High-grade hydration, delivered fresh across the GTA, Tri-Cities & Guelph.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 font-mono text-[11px] tracking-[0.15em] uppercase sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="text-background/40">Shop</span>
              <a href="#store" className="text-background/80 hover:text-background">
                Electrolytes
              </a>
              <a href="#shots" className="text-background/80 hover:text-background">
                Solace Shots
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-background/40">Company</span>
              <a href="#about" className="text-background/80 hover:text-background">
                About
              </a>
              <a href="#" className="text-background/80 hover:text-background">
                Delivery
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-background/40">Connect</span>
              <a href="#" className="text-background/80 hover:text-background">
                Instagram
              </a>
              <a href="#" className="text-background/80 hover:text-background">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-background/20 pt-6 font-mono text-[10px] tracking-[0.15em] uppercase text-background/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} YEHSHA. All rights reserved.</span>
          <span>Come to life.</span>
        </div>
      </div>
    </footer>
  )
}
