'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Globe, Users, Award } from 'lucide-react'

interface StatItem {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { icon: <Zap size={28} />, value: 2000, suffix: '+', label: 'Power Products' },
  { icon: <Globe size={28} />, value: 60, suffix: '+', label: 'Countries Served' },
  { icon: <Users size={28} />, value: 600, suffix: '+', label: 'Global Clients' },
  { icon: <Award size={28} />, value: 18, suffix: '+', label: 'Years of Excellence' },
]

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(to / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function EnergyStats({ locale }: { locale?: string }) {
  const t = locale === 'zh'
    ? { title: '信赖源于数字', desc: '18年行业深耕，服务全球60+国家' }
    : locale === 'ja'
    ? { title: '数字が語る信頼', desc: '18年の業界経験、60カ国以上にサービス提供' }
    : { title: 'Trust in Numbers', desc: '18+ years of industry leadership across 60+ countries' }

  return (
    <section className="relative bg-[#0f2a44] py-20 overflow-hidden">
      {/* Washi pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[2.8rem] font-bold text-white mb-2"
        >{t.title}</motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[1.3rem] text-white/60 mb-12"
        >{t.desc}</motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#c44a2b]">
                {s.icon}
              </div>
              <div className="text-[3.6rem] font-bold text-white leading-none mb-2">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[1.3rem] text-white/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
