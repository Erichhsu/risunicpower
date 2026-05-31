import type { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export async function generateStaticParams() {
  const categories = await prisma.productCategory.findMany({ where: { published: true } })
  const locales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']
  return categories.flatMap(cat => locales.map(locale => ({ locale, category: cat.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category: catSlug } = await params
  const cat = await prisma.productCategory.findUnique({
    where: { slug: catSlug },
    include: { translations: { where: { locale } } },
  })
  const name = cat?.translations[0]?.name || catSlug
  return {
    title: `${name} | RisunicPower`,
    description: cat?.translations[0]?.subtitle
      ? `${cat.translations[0].subtitle} — RisunicPower industrial power supply manufacturer.`
      : `${name} products from RisunicPower — POE, adapters, UPS, inverters, and more.`,
  }
}

const localeLabels: Record<string, Record<string, string>> = {
  en: { bp: 'Products', c: '{n} products', v: 'View Products', m: '+{n} more', e: 'No products in this category yet.' },
  zh: { bp: '产品中心', c: '{n} 个产品', v: '查看全部', m: '还有 {n} 项', e: '该品类暂无产品' },
  ja: { bp: '製品一覧', c: '{n} 製品', v: 'すべて表示', m: 'あと {n} 件', e: 'このカテゴリーに製品はまだありません' },
}
function lbl(locale: string, key: string, n?: number): string {
  const l = localeLabels[locale] || localeLabels.en
  let v = l[key]
  if (n !== undefined) v = v.replace('{n}', String(n))
  return v
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: catSlug } = await params

  const cat = await prisma.productCategory.findUnique({
    where: { slug: catSlug },
    include: {
      translations: { where: { locale } },
      products: {
        where: { published: true },
        include: {
          translations: { where: { locale } },
          certifications: true,
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!cat || !cat.published) notFound()

  const catT = cat.translations[0]

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <nav className="flex items-center gap-2 text-[1.3rem] text-[#6b7a8f] mb-8">
          <Link href={`/${locale}/products`} className="hover:text-[#c44a2b] transition-colors">{lbl(locale, 'bp')}</Link>
          <span>/</span>
          <span className="text-[#1a2332] font-medium">{catT?.name || catSlug}</span>
        </nav>
        <div className="mb-16">
          <span className="text-[3.6rem] mb-2 block">{cat.icon || '📦'}</span>
          <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4">{catT?.name || catSlug}</h1>
          {catT?.subtitle && <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl uppercase tracking-wide">{catT.subtitle}</p>}
        </div>
        {cat.products.length === 0 ? (
          <p className="text-[1.6rem] text-[#6b7a8f]">{lbl(locale, 'e')}</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cat.products.map((prod) => {
              const pt = prod.translations[0]
              const features: string[] = pt?.features ? JSON.parse(pt.features) : []
              return (
                <Link key={prod.slug} href={`/${locale}/products/${catSlug}/${prod.slug}`}
                  className="group bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] flex items-center justify-center">
                    <span className="text-[4rem] opacity-30">📷</span>
                  </div>
                  <div className="p-6">
                    <h2 className="font-brand text-[1.8rem] font-bold text-[#0f2a44] mb-2 group-hover:text-[#c44a2b] transition-colors">
                      {pt?.name || prod.slug}
                    </h2>
                    {pt?.subtitle && <p className="text-[1.3rem] text-[#6b7a8f] mb-3">{pt.subtitle}</p>}
                    {features.length > 0 && (
                      <ul className="mb-4 space-y-1">
                        {features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[1.2rem] text-[#6b7a8f] flex items-start gap-2">
                            <span className="text-[#0eb892] mt-1">▸</span>
                            <span>{f}</span>
                          </li>
                        ))}
                        {features.length > 3 && <li className="text-[1.2rem] text-[#c44a2b]">{lbl(locale, 'm', features.length - 3)}</li>}
                      </ul>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {prod.certifications.map(c => (
                          <span key={c.name} className="px-2 py-0.5 bg-[#fdf8f5] text-[#c44a2b] text-[1rem] font-medium border border-[#c44a2b]/10 rounded">{c.name}</span>
                        ))}
                      </div>
                      <ArrowRight size={16} className="text-[#c44a2b] group-hover:translate-x-1 transition-transform" />
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
