import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Product' })

  const categories = await prisma.productCategory.findMany({
    where: { published: true },
    include: {
      translations: true,
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

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4 tracking-[-0.02em]">
          {t('productsTitle')}
        </h1>
        <div className="divider-washi" />
        <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mb-16">
          {t('productsDesc')}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const ct = cat.translations.find(t => t.locale === locale) || cat.translations.find(t => t.locale === 'en') || cat.translations[0]
            const imgUrl = cat.products[0]?.images[0]?.url || null
            return (
              <Link key={cat.slug} href={`/${locale}/products/${cat.slug}`}
                className="hex-card block bg-white rounded-2xl border border-[#e2e8ef] hover:border-[#F7D142]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <div className="w-[80%] mx-auto mt-8 aspect-[4/3] bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-xl flex items-center justify-center overflow-hidden">
                  {imgUrl ? (
                    <img src={imgUrl} alt={ct?.name || cat.slug} className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="text-[3.6rem] opacity-30">{cat.icon || '\uD83D\uDCE6'}</span>
                  )}
                </div>
                <div className="p-6 pt-5">
                  <h2 className="font-brand text-[2rem] font-bold text-[#0f2a44] mb-1.5 group-hover:text-[#F7D142] transition-colors">
                    {ct?.name || cat.slug}
                  </h2>
                  {ct?.subtitle && (
                    <p className="text-[1.3rem] text-[#6b7a8f] mb-2 uppercase tracking-wide">{ct.subtitle}</p>
                  )}
                  <p className="text-[1.3rem] text-[#6b7a8f] mb-6">{t('productCount', { n: cat._count.products })}</p>
                  <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-medium text-[#F7D142] group-hover:gap-3 transition-all">
                    {t('viewProducts')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
