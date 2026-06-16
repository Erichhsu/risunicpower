'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

interface CategoryData {
  slug: string
  icon: string | null
  image: string | null
  name: string
  subtitle: string | null
  count: number
}

export default function ProductGrid({ categories }: { categories: CategoryData[] }) {
  const locale = useLocale()
  const t = useTranslations('Home')

  return (
    <section className="py-[clamp(6rem,10vw,14rem)] bg-[#2D3947]">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="text-center mb-16">
          <p className="section-subtitle !text-[#F7D142]">
            {t('productGrid.label')}
          </p>
          <h2 className="section-title !text-white !text-[clamp(2.4rem,4vw,3.6rem)] mb-4">
            {t('productGrid.title')}
          </h2>
          <p className="section-desc !text-white/60 !text-[clamp(1.2rem,2vw,1.5rem)] max-w-2xl mx-auto">
            {t('productGrid.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={cat.slug}>
              <Link href={`/${locale}/products/${cat.slug}`}
                className="block bg-white rounded-2xl border border-[#e2e8ef] hover:border-[#F7D142]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                {/* Product image — 80% of card width */}
                <div className="w-[80%] mx-auto mt-8 aspect-[4/3] bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-xl flex items-center justify-center overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-4" />
                  ) : (
                    <img src="/images/category-icon.png" alt="" className="w-14 h-14 object-contain opacity-30" />
                  )}
                </div>
                {/* Card text */}
                <div className="p-6 pt-5">
                  <h3 className="font-brand text-[2rem] font-bold text-[#0f2a44] mb-1.5 group-hover:text-[#F7D142] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-[1.3rem] text-[#6b7a8f] mb-4 tracking-wide uppercase">{cat.subtitle}</p>
                  )}
                  <p className="text-[1.2rem] text-[#6b7a8f] mb-6">{cat.count} {t('productGrid.items')}</p>
                  <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-medium text-[#F7D142] group-hover:gap-3 transition-all">
                    {t('productGrid.viewAll')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
