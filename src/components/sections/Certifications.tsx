'use client'

import { Shield, CheckCircle } from 'lucide-react'

const certs = [
  { name: 'CE', desc: 'European Conformity', icon: <Shield size={24} /> },
  { name: 'FCC', desc: 'USA Standards', icon: <Shield size={24} /> },
  { name: 'UL', desc: 'Underwriters Laboratories', icon: <Shield size={24} /> },
  { name: 'RoHS', desc: 'Restriction of Hazardous Substances', icon: <CheckCircle size={24} /> },
  { name: 'ISO 9001', desc: 'Quality Management', icon: <CheckCircle size={24} /> },
  { name: 'CB', desc: 'IECEE International', icon: <CheckCircle size={24} /> },
]

export default function Certifications({ locale }: { locale?: string }) {
  const t = locale === 'zh'
    ? { certTitle: '全球认证', certDesc: '我们的产品通过国际权威认证' }
    : locale === 'ja'
    ? { certTitle: 'グローバル認証', certDesc: '国際認証を取得した製品' }
    : { certTitle: 'Global Certifications', certDesc: 'Our products meet international standards' }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Certifications */}
        <div
        >
          <p className="section-subtitle text-center">{t.certDesc}</p>
          <h2 className="section-title text-center">{t.certTitle}</h2>
        </div>
        <div className="mb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {certs.map((c, i) => (
            <div
              key={c.name}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-6 text-center hover:border-[#F7D142]/30 hover:shadow-md transition-all"
            >
              <div className="text-[#F7D142]">{c.icon}</div>
              <div className="font-bold text-[1.4rem] text-[#0f2a44]">{c.name}</div>
              <div className="text-[1.1rem] text-[#6b7a8f]">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
