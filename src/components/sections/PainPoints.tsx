'use client'

import { SearchX, Puzzle, ShieldX } from 'lucide-react'

const items = [
  { icon: <SearchX size={32} />, zh: '不知道该选什么电源？', ja: 'どの電源を選べばいいか分からない？', en: 'Not sure which power supply to choose?' },
  { icon: <Puzzle size={32} />, zh: '电源与设备不兼容？', ja: '電源と機器の互換性の問題？', en: 'Power supply incompatible with your device?' },
  { icon: <ShieldX size={32} />, zh: '找不到合适的认证？', ja: '適切な認証が見つからない？', en: "Can't find the right certification?" },
]

const tData: Record<string, { title: string; sub: string }> = {
  zh: { title: '你的挑战，我们的方案', sub: 'Pain Points' },
  ja: { title: 'あなたの課題、私たちの解決策', sub: 'Pain Points' },
  en: { title: 'Your Challenges, Our Solutions', sub: 'Pain Points' },
}

export default function PainPoints({ locale }: { locale?: string }) {
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? (locale || 'en') : 'en'
  const t = tData[l] || tData.en

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle">{t.sub}</p>
          <h2 className="section-title">{t.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const itemAny = item as Record<string, unknown>
            const text = (itemAny[l] as string) || item.en
            return (
              <div key={i} className="card-ts flex flex-col items-center text-center py-10">
                <div className="mb-5 text-[#F7D142]">{item.icon}</div>
                <p className="text-[1.5rem] font-medium text-[#0E4071]">{text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
