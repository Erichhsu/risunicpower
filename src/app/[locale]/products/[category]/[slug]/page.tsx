import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Star } from 'lucide-react'
import AddToCartButton from '@/components/cart/AddToCartButton'
import StarRating from '@/components/ui/StarRating'
import CurrencyConverter from '@/components/ui/CurrencyConverter'
import ProductReviews from '@/components/reviews/ProductReviews'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { translations: true, category: { include: { translations: true } } },
  })
  if (!product) return { title: 'RisunicPower' }
  const pt = product.translations.find((t: { locale: string }) => t.locale === locale)
    || product.translations.find((t: { locale: string }) => t.locale === 'en')
    || product.translations[0]
  const catT = product.category.translations.find((t: { locale: string }) => t.locale === locale)
    || product.category.translations.find((t: { locale: string }) => t.locale === 'en')
    || product.category.translations[0]
  const name = pt?.name || slug
  const catName = catT?.name || product.categorySlug
  return {
    title: `${name} | ${catName} | RisunicPower`,
    description: pt?.description?.slice(0, 160) || `${name} — ${catName} product from RisunicPower.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }) {
  const { locale, category: catSlug, slug } = await params
  const t = await getTranslations({ locale, namespace: 'Product' })

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      translations: true,
      specs: { orderBy: { sortOrder: 'asc' } },
      certifications: true,
      images: true,
      reviews: { orderBy: { createdAt: 'desc' } },
      category: { include: { translations: true } },
    },
  })

  if (!product || !product.published) notFound()

  // 优先取当前语言翻译，无则回退英文
  const pt = product.translations.find(t => t.locale === locale)
    || product.translations.find(t => t.locale === 'en')
    || product.translations[0]
  const catT = product.category.translations.find(t => t.locale === locale)
    || product.category.translations.find(t => t.locale === 'en')
    || product.category.translations[0]

  // specs: 优先当前语言，回退英文
  const localeSpecs = product.specs.filter(s => s.locale === locale)
  const enSpecs = product.specs.filter(s => s.locale === 'en')
  const displaySpecs = localeSpecs.length > 0 ? localeSpecs : enSpecs

  const primaryImage = product.images?.[0]
  const imageUrl = primaryImage?.url || '/images/products/' + slug + '.png'
  const features: string[] = pt?.features ? JSON.parse(pt.features) : []

  const relatedProducts = await prisma.product.findMany({
    where: { categorySlug: catSlug, slug: { not: slug }, published: true },
    include: {
      translations: true,
      images: { take: 1 },
      category: { include: { translations: true } },
    },
    take: 3,
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <nav className="flex flex-wrap items-center gap-2 text-[1.3rem] text-[#6b7a8f] mb-8">
          <Link href={`/${locale}/products`} className="hover:text-[#F7D142] transition-colors">{t('breadcrumbProducts')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products/${catSlug}`} className="hover:text-[#F7D142] transition-colors">{catT?.name || catSlug}</Link>
          <span>/</span>
          <span className="text-[#1a2332] font-medium truncate max-w-[200px]">{pt?.name || slug}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="aspect-square bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-2xl flex items-center justify-center border border-[#e2e8ef] overflow-hidden">
            {primaryImage ? (
              <img src={imageUrl} alt={pt?.name || slug} className="w-full h-full object-contain p-8" />
            ) : (
              <span className="text-[8rem] opacity-20">&#x1F4F7;</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/category-icon.png" alt="" className="w-10 h-10 object-contain" />
              <span className="text-[1.2rem] uppercase tracking-wider text-[#F7D142] font-medium">{catT?.name || catSlug}</span>
            </div>
            <h1 className="font-brand text-[clamp(2.4rem,3.5vw,4rem)] font-bold leading-[1.1] text-[#0f2a44] mb-3">{pt?.name || slug}</h1>
            {pt?.subtitle && <p className="text-[1.6rem] text-[#6b7a8f] mb-4">{pt.subtitle}</p>}

            {/* SKU + Rating row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {product.sku && (
                <span className="text-[1.2rem] text-[#6b7a8f] bg-[#f7f8fa] px-3 py-1 rounded-lg font-mono">
                  {t('sku')}: {product.sku}
                </span>
              )}
              {product.reviews.length > 0 && (
                <StarRating
                  rating={product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length}
                  count={product.reviews.length}
                  showCount
                />
              )}
            </div>

            {/* Price + Currency Converter */}
            <div className="mb-8 p-5 bg-[#F5F8FC] rounded-2xl border border-[#e2e8ef]">
              <p className="text-[1.1rem] uppercase tracking-wider text-[#6b7a8f] mb-2">{t('price')}</p>
              <CurrencyConverter priceCents={product.priceCents} />
            </div>

            {pt?.description && <p className="text-[1.5rem] text-[#1a2332] leading-[1.8] mb-8">{pt.description}</p>}

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-[1.4rem] text-[#0f2a44] mb-3 uppercase tracking-wider">{t('keyFeatures')}</h3>
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
                product={{ slug, categorySlug: catSlug, name: pt?.name || slug, price: product.priceCents, image: imageUrl }}
                label={t('addToCart')}
              />
              <div>
                <Link href={`/${locale}/contact?product=${slug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#0E4071] text-[#0E4071] font-semibold text-[1.4rem] hover:bg-[#0E4071] hover:text-white transition-all"
                >
                  {t('requestQuote')}
                </Link>
                <p className="text-[1.1rem] text-[#6b7a8f] mt-1.5 ml-1">{t('moqOemOdm')}</p>
              </div>
            </div>

            {product.certifications.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[1.2rem] text-[#6b7a8f] mr-2">{t('certifications')}:</span>
                {product.certifications.map(c => (
                  <span key={c.name} className="px-3 py-1 rounded-full bg-[#fdf8f5] text-[#F7D142] text-[1.1rem] font-medium border border-[#F7D142]/10">{c.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {displaySpecs.length > 0 && (
          <section className="mb-20 max-w-3xl">
            <h2 className="text-[2.4rem] font-bold text-[#0f2a44] mb-6">{t('techSpecs')}</h2>
            <div className="bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden">
              <table className="w-full text-left">
                <tbody>
                  {displaySpecs.map((spec, i) => (
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
            <h2 className="text-[2.4rem] font-bold text-[#0f2a44] mb-6">{t('related')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map(rp => {
                const rt = rp.translations.find(t => t.locale === locale) || rp.translations.find(t => t.locale === 'en') || rp.translations[0]
                const rpCatT = rp.category.translations.find(t => t.locale === locale) || rp.category.translations.find(t => t.locale === 'en') || rp.category.translations[0]
                const rpImg = rp.images?.[0]?.url
                return (
                  <Link key={rp.slug} href={`/${locale}/products/${rp.categorySlug}/${rp.slug}`}
                    className="block bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {rpImg && (
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] flex items-center justify-center overflow-hidden p-3">
                        <img src={rpImg} alt={rt?.name || rp.slug} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-[1rem] uppercase tracking-wider text-[#F7D142] font-medium">{rpCatT?.name || rp.categorySlug}</span>
                      <h3 className="font-brand text-[1.5rem] font-bold text-[#0f2a44] mt-1 group-hover:text-[#F7D142] transition-colors">{rt?.name || rp.slug}</h3>
                      {rt?.subtitle && <p className="text-[1.2rem] text-[#6b7a8f] mt-1">{rt.subtitle}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className="mb-20 max-w-3xl">
          <ProductReviews productId={product.id} locale={locale} />
        </section>

        <div className="mt-16">
          <Link href={`/${locale}/products/${catSlug}`}
            className="inline-flex items-center gap-2 text-[1.4rem] font-medium text-[#6b7a8f] hover:text-[#F7D142] transition-colors"
          >
            <ArrowLeft size={16} /> {t('backTo', { name: catT?.name || catSlug })}
          </Link>
        </div>
      </div>
    </main>
  )
}
