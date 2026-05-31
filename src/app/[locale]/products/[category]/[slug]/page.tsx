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

const localeLabels: Record<string, Record<string, string>> = {
  en: { bp: 'Products', kf: 'Key Features', ts: 'Technical Specifications', cert: 'Certifications', rel: 'Related Products', rq: 'Request Quote', back: 'Back to {name}' },
  zh: { bp: '产品中心', kf: '关键特性', ts: '技术规格', cert: '认证资质', rel: '相关产品', rq: '获取报价', back: '返回 {name}' },
  ja: { bp: '製品一覧', kf: '主な特長', ts: '技術仕様', cert: '認証', rel: '関連製品', rq: '見積もり依頼', back: '{name} に戻る' },
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
            <span className="text-[8rem] opacity-20">📷</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[2.4rem]">{product.category.icon || '📦'}</span>
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
              <AddToCartButton product={{ slug, name: pt?.name || slug, image: '/images/products/' + slug + '.jpg' }} />
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
                      <td className="px-6 py-4 text-[1.4rem] font-medium text-[#0f2a44] w-[180px] min-w-[120px] sm:w-[220px] border-b border-[#e2e8ef]">{spec.label}</td>
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
