'use client'

import Link from 'next/link'
import { Package, Cog, Wrench } from 'lucide-react'

const entries = [
  { key: 'product', icon: <Package size={32} />, zh: '产品询价', ja: '製品見積り', en: 'Product Inquiry', zhDesc: '获取产品报价和规格书', jaDesc: '製品の見積もりと仕様書を入手', enDesc: 'Get product quotes and datasheets', href: '/contact?type=product' },
  { key: 'oem', icon: <Cog size={32} />, zh: 'OEM/ODM 定制', ja: 'OEM/ODMカスタム', en: 'OEM/ODM Customization', zhDesc: '定制化电源方案咨询', jaDesc: 'カスタム電源ソリューションのご相談', enDesc: 'Custom power solution consultation', href: '/contact?type=oem' },
  { key: 'support', icon: <Wrench size={32} />, zh: '技术支持', ja: 'テクニカルサポート', en: 'Technical Support', zhDesc: '产品安装、调试和售后服务', jaDesc: '製品の設置、調整、アフターサービス', enDesc: 'Installation, debugging and after-sales', href: '/contact?type=support' },
]

export default function ContactCards({ locale }: { locale?: string }) {
  const l = locale || 'en'
  const t = l === 'zh' ? { title: '联系我们', sub: 'Contact' }
    : l === 'ja' ? { title: 'お問い合わせ', sub: 'Contact' }
    : { title: 'Contact Us', sub: 'Contact' }

  return (
    <section className="py-20 md:py-28 bg-[#224B6B]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle !text-[#F7D142]">{t.sub}</p>
          <h2 className="section-title !text-white">{t.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {entries.map((entry, i) => (
            <div key={entry.key} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <Link href={`/${l}${entry.href}`}
                className="card-ts flex flex-col items-center text-center py-12"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7D142]/10 text-[#F7D142]">
                  {entry.icon}
                </div>
                <h3 className="text-[1.8rem] font-bold text-[#0E4071] mb-3">{entry[l as 'zh' | 'ja' | 'en']}</h3>
                <p className="text-[1.3rem] text-[#4A5D70]">{entry[l === 'en' ? 'enDesc' : l === 'ja' ? 'jaDesc' : 'zhDesc']}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
