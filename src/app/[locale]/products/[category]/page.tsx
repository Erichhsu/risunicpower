import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category: catSlug } = await params
  const cat = await prisma.productCategory.findUnique({
    where: { slug: catSlug },
    include: { translations: true },
  })
  const ct = cat?.translations.find((t: { locale: string }) => t.locale === locale)
    || cat?.translations.find((t: { locale: string }) => t.locale === 'en')
    || cat?.translations[0]
  const name = ct?.name || catSlug
  return {
    title: `${name} | RisunicPower`,
    description: ct?.subtitle
      ? `${ct.subtitle} — RisunicPower industrial power supply manufacturer.`
      : `${name} products from RisunicPower — POE, adapters, UPS, inverters, and more.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: catSlug } = await params
  const t = await getTranslations({ locale, namespace: 'Product' })

  const cat = await prisma.productCategory.findUnique({
    where: { slug: catSlug },
    include: {
      translations: true,
      products: {
        where: { published: true },
        include: {
          translations: true,
          certifications: true,
          images: { take: 1 },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!cat || !cat.published) notFound()

  const catT = cat.translations.find(t => t.locale === locale) || cat.translations.find(t => t.locale === 'en') || cat.translations[0]

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <nav className="flex items-center gap-2 text-[1.3rem] text-[#6b7a8f] mb-8">
          <Link href={`/${locale}/products`} className="hover:text-[#F7D142] transition-colors">{t('breadcrumbProducts')}</Link>
          <span>/</span>
          <span className="text-[#1a2332] font-medium">{catT?.name || catSlug}</span>
        </nav>
        <div className="mb-16">
          <img src="/images/category-icon.png" alt="" className="w-14 h-14 object-contain mb-2" />
          <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4">{catT?.name || catSlug}</h1>
          {catT?.subtitle && <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl uppercase tracking-wide">{catT.subtitle}</p>}
        </div>
        {cat.products.length === 0 ? (
          <p className="text-[1.6rem] text-[#6b7a8f]">{t('noProducts')}</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cat.products.map((prod) => {
              const pt = prod.translations.find(t => t.locale === locale) || prod.translations.find(t => t.locale === 'en') || prod.translations[0]
              const features: string[] = pt?.features ? JSON.parse(pt.features) : []
              const imgUrl = prod.images?.[0]?.url
              return (
                <Link key={prod.slug} href={`/${locale}/products/${catSlug}/${prod.slug}`}
                  className="group bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] flex items-center justify-center overflow-hidden p-4">
                    {imgUrl ? (
                      <img src={imgUrl} alt={pt?.name || prod.slug} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[4rem] opacity-30">{'\uD83D\uDCF7'}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-brand text-[1.8rem] font-bold text-[#0f2a44] mb-2 group-hover:text-[#F7D142] transition-colors">
                      {pt?.name || prod.slug}
                    </h2>
                    {pt?.subtitle && <p className="text-[1.3rem] text-[#6b7a8f] mb-3">{pt.subtitle}</p>}
                    {prod.sku && (
                      <p className="text-[1.1rem] font-mono text-[#b0bccd] mb-3">{t('sku')}: {prod.sku}</p>
                    )}
                    {features.length > 0 && (
                      <ul className="mb-4 space-y-1">
                        {features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[1.2rem] text-[#6b7a8f] flex items-start gap-2">
                            <span className="text-[#0eb892] mt-1">{'\u25B8'}</span>
                            <span>{f}</span>
                          </li>
                        ))}
                        {features.length > 3 && <li className="text-[1.2rem] text-[#F7D142]">{t('more', { n: features.length - 3 })}</li>}
                      </ul>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {prod.certifications.map(c => (
                          <span key={c.name} className="px-2 py-0.5 bg-[#fdf8f5] text-[#F7D142] text-[1rem] font-medium border border-[#F7D142]/10 rounded">{c.name}</span>
                        ))}
                      </div>
                      <ArrowRight size={16} className="text-[#F7D142] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
