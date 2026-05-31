'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

function FusionHeroIllustration() {
  return (
    <svg viewBox="0 0 600 520" className="w-full max-w-xl" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0eb892" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#0eb892" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#0f2a44" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Outer hexagons */}
      <g opacity="0.12">
        <polygon points="300,20 530,132 530,388 300,500 70,388 70,132" fill="none" stroke="#c44a2b" strokeWidth="2"/>
        <polygon points="300,60 500,155 500,365 300,460 100,365 100,155" fill="none" stroke="#c44a2b" strokeWidth="1" opacity="0.5"/>
      </g>
      {/* Energy orb */}
      <circle cx="300" cy="260" r="100" fill="url(#glow)"/>
      <circle cx="300" cy="260" r="40" fill="#0eb892" opacity="0.4"/>
      <circle cx="300" cy="260" r="18" fill="#0eb892" opacity="0.8"/>
      {/* Orbiting trails */}
      <motion.ellipse cx="300" cy="260" rx="160" ry="55" fill="none" stroke="#c44a2b" strokeWidth="1.5" opacity="0.3"
        strokeDasharray="6 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '300px 260px' }}
      />
      <motion.ellipse cx="300" cy="260" rx="130" ry="40" fill="none" stroke="#1e4a7a" strokeWidth="1.5" opacity="0.2"
        strokeDasharray="4 4"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '300px 260px' }}
      />
      {/* Small hexagons on orbit */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 300 + 160 * Math.cos(rad)
        const cy = 260 + 55 * Math.sin(rad)
        return (
          <motion.polygon key={i}
            points={`${cx-8},${cy-14} ${cx+8},${cy-14} ${cx+14},${cy} ${cx+8},${cy+14} ${cx-8},${cy+14} ${cx-14},${cy}`}
            fill="#c44a2b" opacity="0.6"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          />
        )
      })}
    </svg>
  )
}

export default function Hero() {
  const locale = useLocale()
  const t = useTranslations('Home')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2a44] to-[#081a2e]">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,2 57,17 57,35 30,50 3,35 3,17' fill='none' stroke='%23c44a2b' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 52px'
      }} />

      <div className="relative w-full max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[2px] bg-[#c44a2b]" />
              <span className="text-[1.2rem] tracking-[0.3em] uppercase text-[#e07a5f] font-medium">
                {t('hero.tag')}
              </span>
              <span className="w-8 h-[2px] bg-[#c44a2b]" />
            </div>

            <h1 className="font-brand text-[clamp(3.6rem,6vw,8rem)] font-bold leading-[1.05] text-white mb-6 tracking-[-0.02em]">
              {t('hero.title')}
            </h1>

            <p className="text-[clamp(1.6rem,2vw,2rem)] text-white/60 max-w-[540px] leading-[1.8] mb-10">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/products`}
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.5rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/25"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full border border-white/20 text-white/90 font-semibold text-[1.5rem] hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10">
              {[
                { icon: Shield, label: 'CE / FCC / UL / RoHS' },
                { icon: Zap, label: '18+ Years R&D' },
                { icon: Globe, label: '50+ Countries Served' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/40 text-[1.2rem] tracking-wide">
                  <item.icon size={16} className="text-[#0eb892]" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <FusionHeroIllustration />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f7f8fa] to-transparent" />
    </section>
  )
}
