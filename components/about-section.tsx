import type { ReactNode } from 'react'

const facts: { value: ReactNode; label: string }[] = [
  { value: '130mg', label: 'Clean electrolytes' },
  { value: '0', label: 'Artificial ingredients' },
  {
    value: (
      <span className="flex flex-col">
        <span className="mb-1 text-base font-normal leading-none tracking-normal">Under</span>
        <span className="leading-none">35</span>
      </span>
    ),
    label: 'Calories per bottle',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="border-b border-t-2 border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
        <div className="grid gap-4 md:gap-7 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div>
            <p className="relative top-[2px] font-sans text-[12px] font-normal tracking-[calc(0.18em-1px)] uppercase text-muted-foreground md:text-[12.55px] md:tracking-[calc(0.3em-1px)]">
              The Purpose
            </p>
            <h2
              className="mt-[5.1px] text-4xl md:mt-2 md:leading-[calc(1em+2px)] tracking-tight md:text-balance md:text-6xl lg:text-5xl"
              style={{
                fontFamily: 'var(--font-google-sans-flex)',
                fontVariationSettings: "'wght' 650, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 40",
              }}
            >
              Stop Overthinking Health.<br className="hidden lg:inline" /> Fix Your Hydration.
            </h2>
          </div>

          <div className="flex flex-col justify-start gap-2.5 lg:max-w-[584px] lg:justify-self-end text-base leading-[1.45] text-muted-foreground md:text-lg">
            <p className="md:text-pretty">
              <span className="font-medium text-foreground">YEHSHA — means to rescue.</span> From the synthetic dyes, the artificial sweeteners, the chemical
              fillers. And from the flat, foggy days that{' '}
              <span className="whitespace-nowrap">come from poor hydration.</span>
            </p>
            <p className="md:text-pretty">
              Crafted in small batches for people who read the label. Delivering{' '}
              <span className="whitespace-nowrap">pure, uncompromised</span> recovery when you need it most.
              <span className="mt-1.5 block font-medium text-foreground">Come to Life.</span>
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
