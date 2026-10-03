import type { ReactNode } from 'react'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { BulkBanner } from '@/components/bulk-banner'

function CollectionHeader({
  index,
  title,
  subtitle,
}: {
  index: string
  title: string
  subtitle: ReactNode
}) {
  return (
    <div className="mb-12 border-b-2 border-border pb-6 md:mb-16 lg:mb-[72px]">
      <p className="relative top-[2px] font-sans text-[12px] font-normal tracking-[calc(0.18em-1px)] uppercase text-muted-foreground md:text-[12.55px] md:tracking-[calc(0.3em-1px)]">
        Collection {index}
      </p>
      <div className="mt-[5.1px] flex flex-col gap-[10.2px] md:mt-2 md:flex-row md:items-start md:justify-between md:gap-4">
        <h2
          className="text-4xl tracking-tight md:text-5xl"
          style={{
            fontFamily: 'var(--font-google-sans-flex)',
            fontVariationSettings: "'wght' 650, 'wdth' 105, 'GRAD' 40, 'ROND' 0, 'slnt' 0, 'opsz' 40",
          }}
        >
          {title}
        </h2>
        <p className="max-w-sm text-[15.33px] leading-relaxed text-muted-foreground md:text-[16.33px]">{subtitle}</p>
      </div>
    </div>
  )
}

export function ProductShowcase() {
  const electrolytes = products.filter((p) => p.collection === 'electrolyte')
  const shots = products.filter((p) => p.collection === 'shots')

  return (
    <>
      <section id="store" className="mx-auto max-w-[1400px] scroll-mt-[-64px] px-4 pb-20 pt-20 md:scroll-mt-0 md:px-8 md:pb-32 md:pt-28">
        <CollectionHeader
          index="01"
          title="Pure Hydration"
          subtitle={
            <>
              No synthetics. Nothing artificial. All natural <br className="hidden md:block" />
              electrolytes, built to restore your baseline.
            </>
          }
        />
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {electrolytes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <BulkBanner />

      <section id="shots" className="mx-auto max-w-[1400px] scroll-mt-[-64px] px-4 pb-20 pt-20 md:scroll-mt-0 md:px-8 md:pb-32 md:pt-28">
        <CollectionHeader
          index="02"
          title="Solace Shots"
          subtitle="Functional 2oz wellness shots — targeted support for immunity, recovery, and energy."
        />
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {shots.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}
