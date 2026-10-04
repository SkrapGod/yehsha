import type { ReactNode } from 'react'

const facts: { value: ReactNode; label: string }[] = [
  { value: '130mg', label: 'Clean electrolytes' },
  { value: '0', label: 'Artificial ingredients' },
  {
    value: (
      <span className="flex flex-col items-center sm:relative sm:items-start">
        <span className="mb-1 font-mono text-[11px] font-normal leading-normal tracking-[0.15em] uppercase whitespace-nowrap text-muted-foreground sm:absolute sm:bottom-full sm:left-0">
          Less than
        </span>
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

          <div className="flex flex-col justify-start gap-2.5 lg:max-w-[566px] lg:justify-self-end text-[17px] leading-[1.45] text-muted-foreground md:text-lg">
            <p className="text-pretty">
              <span className="font-medium text-foreground">YEHSHA — means to rescue.</span> From the synthetic dyes, artificial sweeteners &amp; chemical
              fillers. And from the flat, foggy days that{' '}
              <span className="md:whitespace-nowrap">come with poor hydration.</span>
            </p>
            <p className="text-pretty">
              Crafted in small batches for people who read the label. Delivering{' '}
              <span className="md:whitespace-nowrap">pure, uncompromised</span> recovery when you{' '}
              <span className="whitespace-nowrap">need it most.</span>
              <span className="mt-1.5 block font-medium text-foreground">Come to Life.</span>
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border border-border sm:grid-cols-3">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`flex flex-col items-center gap-2 p-5 text-center sm:items-start sm:p-8 sm:text-left ${
                i < facts.length - 1 ? 'border-b border-border sm:border-b-0 sm:border-r' : ''
              }`}
            >
              <span className="text-3xl font-bold tracking-tight sm:text-5xl">{fact.value}</span>
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
