import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const categories = await prisma.productCategory.findMany({ where: { published: true } })
  const locales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']
  return categories.flatMap(cat => locales.map(locale => ({ locale, category: cat.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: catSlug } = await params
  const cat = await prisma.productCategory.findUnique({
    where: { slug: catSlug },
    include: { translations: { where: { locale } } },
  })
  if (!cat) return { title: 'Category Not Found' }
  const name = cat.translations[0]?.name || catSlug
  return { title: `${name} | RisunicPower`, description: cat.translations[0]?.subtitle || '' }
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
          images: { where: { isPrimary: true }, take: 1 },
          certifications: true,
          _count: { select: { certifications: true } },
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[1.3rem] text-[#6b7a8f] mb-8">
          <Link href={`/${locale}/products`} className="hover:text-[#c44a2b] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#1a2332] font-medium">{catT?.name || catSlug}</span>
        </nav>

        <div className="mb-16">
          <span className="text-[3.6rem] mb-2 block">{cat.icon || '📦'}</span>
          <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4 tracking-[-0.02em]">
            {catT?.name || catSlug}
          </h1>
          {catT?.subtitle && (
            <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl uppercase tracking-wide">{catT.subtitle}</p>
          )}
        </div>

        {cat.products.length === 0 ? (
          <p className="text-[1.6rem] text-[#6b7a8f]">No products in this category yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cat.products.map((prod) => {
              const t = prod.translations[0]
              const features: string[] = t?.features ? JSON.parse(t.features) : []
              return (
                <Link key={prod.slug} href={`/${locale}/products/${catSlug}/${prod.slug}`}
                  className="group bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] flex items-center justify-center">
                    <span className="text-[4rem] opacity-30">📷</span>
                  </div>
                  <div className="p-6">
                    <h2 className="font-brand text-[1.8rem] font-bold text-[#0f2a44] mb-2 group-hover:text-[#c44a2b] transition-colors">
                      {t?.name || prod.slug}
                    </h2>
                    {t?.subtitle && (
                      <p className="text-[1.3rem] text-[#6b7a8f] mb-3">{t.subtitle}</p>
                    )}
                    {features.length > 0 && (
                      <ul className="mb-4 space-y-1">
                        {features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[1.2rem] text-[#6b7a8f] flex items-start gap-2">
                            <span className="text-[#0eb892] mt-1">▸</span>
                            <span>{f}</span>
                          </li>
                        ))}
                        {features.length > 3 && (
                          <li className="text-[1.2rem] text-[#c44a2b]">+{features.length - 3} more</li>
                        )}
                      </ul>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {prod.certifications.map(c => (
                          <span key={c.name} className="px-2 py-0.5 bg-[#fdf8f5] text-[#c44a2b] text-[1rem] font-medium border border-[#c44a2b]/10 rounded">
                            {c.name}
                          </span>
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
