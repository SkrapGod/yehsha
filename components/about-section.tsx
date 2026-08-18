const facts = [
  { value: '1000mg', label: 'Electrolyte blend per bottle' },
  { value: '0g', label: 'Added sugar, ever' },
  { value: '48h', label: 'From batch to your door' },
]

export function AboutSection() {
  return (
    <section id="about" className="border-y border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
              Our Mission
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl">
              Hydration, <br /> stripped to what matters.
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              YEHSHA was built on a simple belief: your body deserves high-grade hydration without
              the noise. No dyes, no sugar, no filler — just a precise mineral blend that helps you
              come to life.
            </p>
            <p>
              Every bottle is produced locally in small batches and delivered fresh across the GTA,
              Tri-Cities, and Guelph. Solace Shots extend that same standard into targeted daily
              wellness.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border border-border sm:grid-cols-3">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`flex flex-col gap-2 p-8 ${
                i < facts.length - 1 ? 'border-b border-border sm:border-b-0 sm:border-r' : ''
              }`}
            >
              <span className="text-5xl font-bold tracking-tight">{fact.value}</span>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                {fact.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
