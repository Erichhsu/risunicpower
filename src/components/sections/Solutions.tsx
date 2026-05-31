'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Sailboat, TowerControl, Sun, Factory } from 'lucide-react'
import Link from 'next/link'

const solutions = [
  { icon: <Building2 size={28} />, en: { title: 'Smart Building', desc: 'POE-powered IoT devices, access control, and lighting systems for modern buildings.' }, zh: { title: '智能建筑', desc: '为现代建筑提供POE供电物联网设备、门禁和照明系统。' } },
  { icon: <Home size={28} />, en: { title: 'Residential Energy', desc: 'Home UPS, portable power stations, and solar backup solutions for reliable home energy.' }, zh: { title: '家庭能源', desc: '家用UPS、便携储能和太阳能备用电源方案，保障家庭用电。' } },
  { icon: <Sailboat size={28} />, en: { title: 'Marine & RV', desc: 'Ruggedized inverters and power converters designed for marine and recreational vehicles.' }, zh: { title: '船舶与房车', desc: '专为船舶和房车设计的加固型逆变器和电源转换器。' } },
  { icon: <TowerControl size={28} />, en: { title: 'Telecom Infrastructure', desc: 'Reliable rectifiers and backup power for base stations and network equipment.' }, zh: { title: '通信基础设施', desc: '为基站和网络设备提供可靠的整流器和备用电源。' } },
  { icon: <Sun size={28} />, en: { title: 'Solar Energy Storage', desc: 'Micro-inverters, all-in-one systems, and battery storage for commercial solar.' }, zh: { title: '太阳能储能', desc: '微型逆变器、一体机系统和电池储能的商业化方案。' } },
  { icon: <Factory size={28} />, en: { title: 'Industrial Automation', desc: 'Open-frame power supplies, DIN rail solutions for factory automation and control systems.' }, zh: { title: '工业自动化', desc: '裸板电源、导轨电源方案，适用于工厂自动化和控制系统。' } },
]

export default function Solutions({ locale }: { locale?: string }) {
  const t = locale === 'zh'
    ? { title: '行业解决方案', desc: '为六大行业提供定制电源方案', cta: '了解更多' }
    : locale === 'ja'
    ? { title: '業界ソリューション', desc: '6つの業界にカスタム電源ソリューションを提供', cta: '詳細を見る' }
    : { title: 'Industry Solutions', desc: 'Tailored power solutions across 6 key industries', cta: 'Learn More' }

  return (
    <section className="bg-[#f8f9fb] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[2.8rem] font-bold text-[#0f2a44] mb-2">{t.title}</h2>
          <p className="text-[1.3rem] text-[#6b7a8f]">{t.desc}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => {
            const data = locale === 'zh' ? s.zh : s.en
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl bg-white p-8 border border-gray-200 hover:border-[#c44a2b]/30 hover:shadow-lg transition-all"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0f2a44]/5 text-[#c44a2b] group-hover:bg-[#c44a2b] group-hover:text-white transition-all">
                  {s.icon}
                </div>
                <h3 className="text-[1.8rem] font-bold text-[#0f2a44] mb-2">{data.title}</h3>
                <p className="text-[1.3rem] leading-relaxed text-[#6b7a8f] mb-4">{data.desc}</p>
                <Link href={`/${locale || 'en'}/products`} className="text-[1.3rem] font-semibold text-[#c44a2b] hover:underline">
                  {t.cta} →
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
