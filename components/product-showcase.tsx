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
    <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
          Collection {index}
        </p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  )
}

export function ProductShowcase() {
  const electrolytes = products.filter((p) => p.collection === 'electrolyte')
  const shots = products.filter((p) => p.collection === 'shots')

  return (
    <>
      <section id="store" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <CollectionHeader
          index="01"
          title="Electrolyte Beverage"
          subtitle="Zero sugar. 1000mg mineral blend. Bottled in small batches for peak freshness."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {electrolytes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <BulkBanner />

      <section id="shots" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
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
