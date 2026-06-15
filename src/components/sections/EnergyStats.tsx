'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Zap, Globe, Users, Award } from 'lucide-react'

interface StatItem {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return

    const animate = () => {
      if (started.current) return
      started.current = true
      const startTime = performance.now()
      const step = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(step)
        else setCount(target)
      }
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate()
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    observer.observe(el)

    // Fallback: if observer doesn't fire within 3s, animate anyway
    const fallback = setTimeout(() => {
      if (!started.current) {
        animate()
        observer.disconnect()
      }
    }, 3000)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [target, duration])

  return { count, ref }
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} className="text-[3.6rem] font-bold text-white leading-none mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export default function EnergyStats() {
  const t = useTranslations('Stats')

  const stats: StatItem[] = [
    { icon: <Zap size={28} />, value: 500, suffix: '+', label: t('skus') },
    { icon: <Globe size={28} />, value: 30, suffix: '+', label: t('countries') },
    { icon: <Users size={28} />, value: 600, suffix: '+', label: t('clients') },
    { icon: <Award size={28} />, value: 12, suffix: '+', label: t('years') },
  ]

  return (
    <section className="relative py-20 overflow-hidden bg-[#2C5D7E]">
      {/* Washi pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <h2
          className="text-center text-[2.8rem] font-bold text-white mb-2"
        >{t('title')}</h2>
        <p
          className="text-center text-[1.3rem] text-white/60 mb-12"
        >{t('subtitle')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#F7D142]">
                {s.icon}
              </div>
              <StatCounter value={s.value} suffix={s.suffix} />
              <div className="text-[1.3rem] text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
