import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Product Categories', desc: 'Explore our full range of power solutions — from POE injectors and adapters to solar inverters and portable power stations.', view: 'View Products', count: '{n} products' },
  zh: { title: '产品中心', desc: '浏览我们的全系列电源解决方案——从POE供电器、适配器到太阳能逆变器和便携储能电源。', view: '查看全部产品', count: '{n} 个产品' },
  ja: { title: '製品一覧', desc: 'POEインジェクターからアダプター、UPS、インバーター、ポータブル電源までの全製品ラインをご覧ください。', view: 'すべて表示', count: '{n} 製品' },
}

function label(locale: string, key: string, n?: number): string {
  const l = localeLabels[locale] || localeLabels.en
  let v = l[key]
  if (n !== undefined) v = v.replace('{n}', String(n))
  return v
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const categories = await prisma.productCategory.findMany({
    where: { published: true },
    include: {
      translations: { where: { locale } },
      _count: { select: { products: { where: { published: true } } } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4 tracking-[-0.02em]">
          {label(locale, 'title')}
        </h1>
        <div className="divider-washi" />
        <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mb-16">
          {label(locale, 'desc')}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const ct = cat.translations[0]
            return (
              <Link key={cat.slug} href={`/${locale}/products/${cat.slug}`}
                className="hex-card block p-8 bg-white rounded-2xl border border-[#e2e8ef] hover:border-[#c44a2b]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-[3.6rem] mb-4 block">{cat.icon || '📦'}</span>
                <h2 className="font-brand text-[2rem] font-bold text-[#0f2a44] mb-1.5 group-hover:text-[#c44a2b] transition-colors">
                  {ct?.name || cat.slug}
                </h2>
                {ct?.subtitle && (
                  <p className="text-[1.3rem] text-[#6b7a8f] mb-2 uppercase tracking-wide">{ct.subtitle}</p>
                )}
                <p className="text-[1.3rem] text-[#6b7a8f] mb-6">{label(locale, 'count', cat._count.products)}</p>
                <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-medium text-[#c44a2b] group-hover:gap-3 transition-all">
                  {label(locale, 'view')} <ArrowRight size={14} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
