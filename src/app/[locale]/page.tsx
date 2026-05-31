import { prisma } from '@/lib/db/prisma'
import Hero from '@/components/sections/Hero'
import ProductGrid from '@/components/sections/ProductGrid'
import EnergyStats from '@/components/sections/EnergyStats'
import Certifications from '@/components/sections/Certifications'
import Solutions from '@/components/sections/Solutions'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const categories = await prisma.productCategory.findMany({
    where: { published: true },
    include: {
      translations: { where: { locale } },
      _count: { select: { products: { where: { published: true } } } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  const gridData = categories.map(cat => ({
    slug: cat.slug,
    icon: cat.icon,
    name: cat.translations[0]?.name || cat.slug,
    subtitle: cat.translations[0]?.subtitle || null,
    count: cat._count.products,
  }))

  return (
    <>
      <Hero />
      <ProductGrid categories={gridData} />
      <EnergyStats locale={locale} />
      <Certifications locale={locale} />
      <Solutions locale={locale} />
    </>
  )
}
