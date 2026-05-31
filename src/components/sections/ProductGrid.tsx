'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

const categories = [
  { slug: 'poe', emoji: '🔌', name: 'POE Power Supplies', subtitle: 'IEEE 802.3af/at/bt', tags: ['30W-90W', 'Overload Protection', 'Compact'] },
  { slug: 'adapter', emoji: '🔋', name: 'Power Adapters', subtitle: 'Global Certifications', tags: ['5W-120W', 'CE/FCC/UL/CCC', 'Interchangeable'] },
  { slug: 'open-frame', emoji: '📦', name: 'Open Frame PSU', subtitle: 'Industrial Grade', tags: ['15W-600W', 'Compact', 'Coating Option'] },
  { slug: 'ups', emoji: '⚡', name: 'UPS Systems', subtitle: 'Uninterruptible Power', tags: ['500VA-10kVA', 'Pure Sine Wave', 'LCD Display'] },
  { slug: 'inverter', emoji: '🔄', name: 'Power Inverters', subtitle: 'Solar & Off-Grid', tags: ['300W-5000W', 'Pure Sine Wave', 'MPPT Ready'] },
  { slug: 'power-station', emoji: '🔋', name: 'Portable Power Stations', subtitle: 'Clean Energy Anywhere', tags: ['256Wh-2048Wh', 'LiFePO₄', 'Solar Ready'] },
  { slug: 'all-in-one', emoji: '🏠', name: 'All-in-One Solar', subtitle: 'Complete Home Energy', tags: ['3kW-10kW', 'Hybrid', 'Battery Ready'] },
  { slug: 'micro-inverter', emoji: '☀️', name: 'Micro Inverters', subtitle: 'Per-Panel MPPT', tags: ['300W-2000W', 'Module-Level', 'IP67'] },
  { slug: 'industrial', emoji: '🏭', name: 'Industrial PSU', subtitle: 'Heavy-Duty DIN Rail', tags: ['35W-960W', 'DIN Rail', '-25°C~70°C'] },
]

export default function ProductGrid() {
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
                <span className="text-[3.6rem] mb-4 block">{cat.emoji}</span>
                <h3 className="font-brand text-[2rem] font-bold text-[#0f2a44] mb-1.5 group-hover:text-[#c44a2b] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[1.3rem] text-[#6b7a8f] mb-4 tracking-wide uppercase">{cat.subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#fdf8f5] text-[#c44a2b] text-[1.1rem] font-medium border border-[#c44a2b]/10">
                      {tag}
                    </span>
                  ))}
                </div>
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
