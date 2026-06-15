'use client'

import { Building2, Home, Sailboat, TowerControl, Sun, Factory } from 'lucide-react'
import Link from 'next/link'

const solutions = [
  { icon: <Building2 size={28} />, en: { title: 'Smart Building', desc: 'POE-powered IoT devices, access control, and lighting systems for modern buildings.' }, zh: { title: '智能建筑', desc: '为现代建筑提供POE供电物联网设备、门禁和照明系统。' }, ja: { title: 'スマートビル', desc: 'スマートビル向けのPOE給電IoTデバイス、アクセス制御、照明システム。' } },
  { icon: <Home size={28} />, en: { title: 'Residential Energy', desc: 'Home UPS, portable power stations, and solar backup solutions for reliable home energy.' }, zh: { title: '家庭能源', desc: '家用UPS、便携储能和太阳能备用电源方案，保障家庭用电。' }, ja: { title: '住宅用エネルギー', desc: '家庭用UPS、ポータブル電源、ソーラーバックアップで信頼性の高い家庭用エネルギーを。' } },
  { icon: <Sailboat size={28} />, en: { title: 'Marine & RV', desc: 'Ruggedized inverters and power converters designed for marine and recreational vehicles.' }, zh: { title: '船舶与房车', desc: '专为船舶和房车设计的加固型逆变器和电源转换器。' }, ja: { title: '船舶・RV', desc: '船舶やレクリエーション車両向けの堅牢なインバーターと電源コンバーター。' } },
  { icon: <TowerControl size={28} />, en: { title: 'Telecom Infrastructure', desc: 'Reliable rectifiers and backup power for base stations and network equipment.' }, zh: { title: '通信基础设施', desc: '为基站和网络设备提供可靠的整流器和备用电源。' }, ja: { title: '通信インフラ', desc: '基地局やネットワーク機器向けの信頼性の高い整流器とバックアップ電源。' } },
  { icon: <Sun size={28} />, en: { title: 'Solar Energy Storage', desc: 'Micro-inverters, all-in-one systems, and battery storage for commercial solar.' }, zh: { title: '太阳能储能', desc: '微型逆变器、一体机系统和电池储能的商业化方案。' }, ja: { title: '太陽光エネルギー貯蔵', desc: 'マイクロインバーター、オールインワンシステム、商用太陽光発電向け蓄電池。' } },
  { icon: <Factory size={28} />, en: { title: 'Industrial Automation', desc: 'Open-frame power supplies, DIN rail solutions for factory automation and control systems.' }, zh: { title: '工业自动化', desc: '裸板电源、导轨电源方案，适用于工厂自动化和控制系统。' }, ja: { title: '産業オートメーション', desc: '工場自動化や制御システム向けのオープンフレーム電源、DINレールソリューション。' } },
]

const tData: Record<string, { title: string; desc: string; cta: string }> = {
  zh: { title: '行业解决方案', desc: '为六大行业提供定制电源方案', cta: '了解更多' },
  ja: { title: '業界ソリューション', desc: '6つの業界にカスタム電源ソリューションを提供', cta: '詳細を見る' },
  en: { title: 'Industry Solutions', desc: 'Tailored power solutions across 6 key industries', cta: 'Learn More' },
}

export default function Solutions({ locale }: { locale?: string }) {
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? (locale || 'en') : 'en'
  const t = tData[l] || tData.en

  return (
    <section className="py-20 bg-[#0073AA]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div
          className="text-center mb-14"
        >
          <h2 className="section-title !text-white">{t.title}</h2>
          <p className="section-subtitle !text-white/80">{t.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => {
            const data = (s as Record<string, unknown>)[l] as { title: string; desc: string } | undefined
              || s.en
            return (
              <div
                key={i}
                className="group rounded-2xl bg-white p-8 border border-gray-200 hover:border-[#F7D142]/30 hover:shadow-lg transition-all"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0f2a44]/5 text-[#F7D142] group-hover:bg-[#F7D142] group-hover:text-white transition-all">
                  {s.icon}
                </div>
                <h3 className="text-[1.8rem] font-bold text-[#0f2a44] mb-2">{data.title}</h3>
                <p className="text-[1.3rem] leading-relaxed text-[#6b7a8f] mb-4">{data.desc}</p>
                <Link href={`/${l}/products`} className="text-[1.3rem] font-semibold text-[#F7D142] hover:underline">
                  {t.cta} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
