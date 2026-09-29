const tiers = [
  { qty: '12-PACK', save: 'SAVE 4%' },
  { qty: '24-PACK', save: 'SAVE 5%' },
  { qty: '48-PACK', save: 'SAVE 6%' },
]

export function BulkBanner() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-background/80">
              Stock Up
            </p>
            <h2 className="mt-1 text-4xl font-bold leading-[38px] tracking-tight text-balance md:text-5xl md:leading-none">
              Buy more. <br /> Save more.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-background/70 md:mt-2 md:text-[16.33px]">
              Bulk pricing scales with your order. Mix flavors freely — discounts apply at
              checkout.
            </p>
          </div>

          <div className="grid grid-cols-3 border border-background/25">
            {tiers.map((tier, i) => (
              <div
                key={tier.qty}
                className={`flex flex-col items-center gap-2 px-6 py-8 text-center md:px-10 ${
                  i < tiers.length - 1 ? 'border-r border-background/25' : ''
                }`}
              >
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-background/60">
                  {tier.qty}
                </span>
                <span className="text-2xl font-bold md:text-3xl">{tier.save}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
