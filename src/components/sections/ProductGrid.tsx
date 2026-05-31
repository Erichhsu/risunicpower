'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

interface CategoryData {
  slug: string
  icon: string | null
  name: string
  subtitle: string | null
  count: number
}

export default function ProductGrid({ categories }: { categories: CategoryData[] }) {
  const locale = useLocale()
  const t = useTranslations('Home')

  return (
    <section className="py-[clamp(6rem,10vw,14rem)] bg-[#f7f8fa]">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4">
            {t('productGrid.title')}
          </h2>
          <div className="divider-washi" />
          <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mx-auto">
            {t('productGrid.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <Link href={`/${locale}/products/${cat.slug}`}
                className="hex-card block p-8 bg-white rounded-2xl border border-[#e2e8ef] hover:border-[#c44a2b]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-[3.6rem] mb-4 block">{cat.icon || '📦'}</span>
                <h3 className="font-brand text-[2rem] font-bold text-[#0f2a44] mb-1.5 group-hover:text-[#c44a2b] transition-colors">
                  {cat.name}
                </h3>
                {cat.subtitle && (
                  <p className="text-[1.3rem] text-[#6b7a8f] mb-4 tracking-wide uppercase">{cat.subtitle}</p>
                )}
                <p className="text-[1.2rem] text-[#6b7a8f] mb-6">{cat.count} {t('productGrid.items')}</p>
                <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-medium text-[#c44a2b] group-hover:gap-3 transition-all">
                  {t('productGrid.viewAll')} <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
