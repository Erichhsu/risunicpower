'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const locale = useLocale()
  const t = useTranslations('Home')

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#0a1628] via-[#0f2a44] to-[#081a2e] overflow-hidden">
      {/* Semi-transparent image overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/820.jpg"
          alt=""
          fill
          className="object-cover opacity-40"
          style={{ maskImage: 'linear-gradient(to right, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)' }}
          unoptimized
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#ECF1F7]" />

      <div className="relative w-full max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="text-left pt-8 lg:pt-0 max-w-[640px]">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-[2px] bg-[#F7D142]" />
            <span className="text-[1.1rem] tracking-[0.35em] uppercase text-[#F7D142] font-semibold">
              {t('hero.tag')}
            </span>
          </div>

          <h1 className="text-[clamp(3.2rem,5.5vw,5.6rem)] font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
            {t('hero.title')}
          </h1>

          <p className="text-[clamp(1.35rem,1.8vw,1.7rem)] text-white/55 leading-[1.8] mb-10">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 mb-14">
            <Link href={`/${locale}/products`}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#F7D142] text-[#0a1628] font-bold text-[1.4rem] hover:bg-[#FFF3B0] hover:shadow-[0_0_30px_rgba(247,209,66,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('hero.ctaPrimary')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-[1.4rem] hover:border-[#F7D142]/40 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/[0.08]">
            {[
              { icon: Shield, label: 'CE / FCC / UL / RoHS' },
              { icon: Zap, label: '12+ Years R&D' },
              { icon: Globe, label: '30+ Countries Served' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/35 text-[1.15rem] tracking-wide">
                <item.icon size={18} className="text-[#F7D142]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
