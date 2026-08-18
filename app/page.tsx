import { CartProvider } from '@/components/cart-context'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProductShowcase } from '@/components/product-showcase'
import { AboutSection } from '@/components/about-section'
import { SiteFooter } from '@/components/site-footer'
import { CartDrawer } from '@/components/cart-drawer'

export default function Page() {
  return (
    <CartProvider>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <ProductShowcase />
        <AboutSection />
      </main>
      <SiteFooter />
      <CartDrawer />
    </CartProvider>
  )
}
