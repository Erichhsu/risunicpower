import { prisma } from '@/lib/db/prisma'
import Hero from '@/components/sections/Hero'
import CompanyCards from '@/components/sections/CompanyCards'
import Certifications from '@/components/sections/Certifications'
import EnergyStats from '@/components/sections/EnergyStats'
import Testimonials from '@/components/sections/Testimonials'
import ProductGrid from '@/components/sections/ProductGrid'
import Applications from '@/components/sections/Applications'
import PartnerLogos from '@/components/sections/PartnerLogos'
import Solutions from '@/components/sections/Solutions'
import NewsSection from '@/components/sections/NewsSection'
import ContactCards from '@/components/sections/ContactCards'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const categories = await prisma.productCategory.findMany({
    where: { published: true },
    include: {
      translations: { where: { locale } },
      _count: { select: { products: { where: { published: true } } } },
      products: {
        where: { published: true },
        include: { images: { take: 1 } },
        take: 1,
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  const gridData = categories.map(cat => ({
    slug: cat.slug,
    icon: cat.icon,
    image: cat.products[0]?.images[0]?.url || null,
    name: cat.translations[0]?.name || cat.slug,
    subtitle: cat.translations[0]?.subtitle || null,
    count: cat._count.products,
  }))

  return (
    <main>
      {/* 1. Hero — deep blue #0E4071 */}
      <Hero />

      {/* 2. CompanyCards — light blue #ECF1F7 */}
      <CompanyCards locale={locale} />

      {/* 3. Certifications — white */}
      <Certifications />

      {/* 4. EnergyStats — dark teal #2C5D7E */}
      <EnergyStats />

      {/* 5. Testimonials — light blue #E5ECF4 */}
      <Testimonials locale={locale} />

      {/* 6. ProductGrid — dark grey #2D3947 */}
      <ProductGrid categories={gridData} />

      {/* 7. PartnerLogos — white */}
      <PartnerLogos locale={locale} />

      {/* 8. ContactCards — deep blue #224B6B */}
      <ContactCards locale={locale} />

      {/* 9. Applications — white */}
      <Applications locale={locale} />

      {/* 10. Solutions — blue #0073AA */}
      <Solutions locale={locale} />

      {/* 11. NewsSection — white */}
      <NewsSection locale={locale} />
    </main>
  )
}
