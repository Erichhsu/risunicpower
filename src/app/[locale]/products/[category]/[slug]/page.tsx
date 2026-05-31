import type { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import AddToCartButton from '@/components/cart/AddToCartButton'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { published: true }, select: { slug: true, categorySlug: true } })
  const locales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']
  return products.flatMap(p => locales.map(locale => ({ locale, category: p.categorySlug, slug: p.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { translations: { where: { locale } }, category: { include: { translations: { where: { locale } } } } },
  })
  if (!product) return { title: 'RisunicPower' }
  const pt = product.translations[0]
  const catT = product.category.translations[0]
  const name = pt?.name || slug
  const catName = catT?.name || product.categorySlug
  return {
    title: `${name} | ${catName} | RisunicPower`,
    description: pt?.description?.slice(0, 160) || `${name} — ${catName} product from RisunicPower.`,
  }
}

const localeLabels: Record<string, Record<string, string>> = {
  en: { bp: 'Products', kf: 'Key Features', ts: 'Technical Specifications', cert: 'Certifications', rel: 'Related Products', rq: 'Request Quote', back: 'Back to {name}', atc: 'Add to Cart' },
  zh: { bp: '\u4EA7\u54C1\u4E2D\u5FC3', kf: '\u5173\u952E\u7279\u6027', ts: '\u6280\u672F\u89C4\u683C', cert: '\u8BA4\u8BC1\u8D44\u8D28', rel: '\u76F8\u5173\u4EA7\u54C1', rq: '\u83B7\u53D6\u62A5\u4EF7', back: '\u8FD4\u56DE {name}', atc: '\u52A0\u5165\u8D2D\u7269\u8F66' },
  ja: { bp: '\u88FD\u54C1\u4E00\u89A7', kf: '\u4E3B\u306A\u7279\u9577', ts: '\u6280\u8853\u4ED5\u69D8', cert: '\u8A8D\u8A3C', rel: '\u95A2\u9023\u88FD\u54C1', rq: '\u898B\u7A4D\u3082\u308A\u4F9D\u983C', back: '{name} \u306B\u623B\u308B', atc: '\u30AB\u30FC\u30C8\u306B\u5165\u308C\u308B' },
}
function lbl(locale: string, key: string, vars?: Record<string, string>): string {
  const l = localeLabels[locale] || localeLabels.en
  let v = l[key]
  if (vars) Object.entries(vars).forEach(([k, val]) => { v = v.replace(`{${k}}`, val) })
  return v
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }) {
  const { locale, category: catSlug, slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      specs: { where: { locale }, orderBy: { sortOrder: 'asc' } },
      certifications: true,
      category: { include: { translations: { where: { locale } } } },
    },
  })

  if (!product || !product.published) notFound()

  const pt = product.translations[0]
  const catT = product.category.translations[0]
  const features: string[] = pt?.features ? JSON.parse(pt.features) : []

  const relatedProducts = await prisma.product.findMany({
    where: { categorySlug: catSlug, slug: { not: slug }, published: true },
    include: { translations: { where: { locale } } },
    take: 3,
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <nav className="flex flex-wrap items-center gap-2 text-[1.3rem] text-[#6b7a8f] mb-8">
          <Link href={`/${locale}/products`} className="hover:text-[#c44a2b] transition-colors">{lbl(locale, 'bp')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products/${catSlug}`} className="hover:text-[#c44a2b] transition-colors">{catT?.name || catSlug}</Link>
          <span>/</span>
          <span className="text-[#1a2332] font-medium truncate max-w-[200px]">{pt?.name || slug}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="aspect-square bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-2xl flex items-center justify-center border border-[#e2e8ef]">
            <span className="text-[8rem] opacity-20">&#x1F4F7;</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[2.4rem]">{product.category.icon || '&#x1F4E6;'}</span>
              <span className="text-[1.2rem] uppercase tracking-wider text-[#c44a2b] font-medium">{catT?.name || catSlug}</span>
            </div>
            <h1 className="font-brand text-[clamp(2.4rem,3.5vw,4rem)] font-bold leading-[1.1] text-[#0f2a44] mb-3">{pt?.name || slug}</h1>
            {pt?.subtitle && <p className="text-[1.6rem] text-[#6b7a8f] mb-6">{pt.subtitle}</p>}
            {pt?.description && <p className="text-[1.5rem] text-[#1a2332] leading-[1.8] mb-8">{pt.description}</p>}

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-[1.4rem] text-[#0f2a44] mb-3 uppercase tracking-wider">{lbl(locale, 'kf')}</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-[1.4rem] text-[#1a2332]">
                      <Check size={16} className="text-[#0eb892] mt-1 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <AddToCartButton
                product={{ slug, categorySlug: catSlug, name: pt?.name || slug, image: '/images/products/' + slug + '.jpg' }}
                label={lbl(locale, 'atc')}
              />
              <Link href={`/${locale}/contact?product=${slug}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#0f2a44] text-[#0f2a44] font-semibold text-[1.4rem] hover:bg-[#0f2a44] hover:text-white transition-all"
              >
                {lbl(locale, 'rq')}
              </Link>
            </div>

            {product.certifications.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[1.2rem] text-[#6b7a8f] mr-2">{lbl(locale, 'cert')}:</span>
                {product.certifications.map(c => (
                  <span key={c.name} className="px-3 py-1 rounded-full bg-[#fdf8f5] text-[#c44a2b] text-[1.1rem] font-medium border border-[#c44a2b]/10">{c.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {product.specs.length > 0 && (
          <section className="mb-20 max-w-3xl">
            <h2 className="text-[2.4rem] font-bold text-[#0f2a44] mb-6">{lbl(locale, 'ts')}</h2>
            <div className="bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden">
              <table className="w-full text-left">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={spec.id} className={i % 2 === 0 ? 'bg-[#f7f8fa]' : 'bg-white'}>
                      <td className="px-6 py-4 text-[1.4rem] font-medium text-[#0f2a44] min-w-[120px] sm:w-[220px] border-b border-[#e2e8ef]">{spec.label}</td>
                      <td className="px-6 py-4 text-[1.4rem] text-[#1a2332] border-b border-[#e2e8ef]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-[2.4rem] font-bold text-[#0f2a44] mb-6">{lbl(locale, 'rel')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map(rp => {
                const rt = rp.translations[0]
                return (
                  <Link key={rp.slug} href={`/${locale}/products/${catSlug}/${rp.slug}`}
                    className="block p-6 bg-white rounded-2xl border border-[#e2e8ef] hover:shadow-lg transition-all group"
                  >
                    <h3 className="font-brand text-[1.6rem] font-bold text-[#0f2a44] group-hover:text-[#c44a2b] transition-colors">{rt?.name || rp.slug}</h3>
                    {rt?.subtitle && <p className="text-[1.2rem] text-[#6b7a8f] mt-1">{rt.subtitle}</p>}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <div className="mt-16">
          <Link href={`/${locale}/products/${catSlug}`}
            className="inline-flex items-center gap-2 text-[1.4rem] font-medium text-[#6b7a8f] hover:text-[#c44a2b] transition-colors"
          >
            <ArrowLeft size={16} /> {lbl(locale, 'back', { name: catT?.name || catSlug })}
          </Link>
        </div>
      </div>
    </main>
  )
}
