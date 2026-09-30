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
  subtitle: string
}) {
  return (
    <div className="mb-10 border-b border-border pb-6">
      <p className="relative top-[2px] font-mono text-[11px] font-normal tracking-[0.18em] uppercase text-muted-foreground md:text-[11.55px] md:font-[450] md:tracking-[0.3em]">
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
      <section id="store" className="mx-auto max-w-[1400px] scroll-mt-[-64px] px-4 py-20 md:scroll-mt-0 md:px-8 md:py-28">
        <CollectionHeader
          index="01"
          title="Pure Hydration"
          subtitle="Zero sugar. 1000mg mineral blend. Bottled in small batches for peak freshness."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {electrolytes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <BulkBanner />

      <section id="shots" className="mx-auto max-w-[1400px] scroll-mt-[-64px] px-4 py-20 md:scroll-mt-0 md:px-8 md:py-28">
        <CollectionHeader
          index="02"
          title="Solace Shots"
          subtitle="Functional 2oz wellness shots — targeted support for immunity, recovery, and energy."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}
