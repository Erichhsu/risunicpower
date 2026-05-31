'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, Star } from 'lucide-react'

const certs = [
  { name: 'CE', desc: 'European Conformity', icon: <Shield size={24} /> },
  { name: 'FCC', desc: 'USA Standards', icon: <Shield size={24} /> },
  { name: 'UL', desc: 'Underwriters Laboratories', icon: <Shield size={24} /> },
  { name: 'RoHS', desc: 'Restriction of Hazardous Substances', icon: <CheckCircle size={24} /> },
  { name: 'ISO 9001', desc: 'Quality Management', icon: <CheckCircle size={24} /> },
  { name: 'CB', desc: 'IECEE International', icon: <CheckCircle size={24} /> },
]

const testimonials = [
  { name: 'Thomas Müller', company: 'SolarTech GmbH, Germany', text: 'Reliable partner for 5+ years. Their inverters consistently exceed our quality expectations.', stars: 5 },
  { name: 'James Chen', company: 'Pacific Electronics, Taiwan', text: 'Quick turnaround on custom POE designs. Excellent engineering support throughout.', stars: 5 },
  { name: 'Sarah Johnson', company: 'GreenBuild Systems, UK', text: 'The UPS units are rock-solid. We\'ve deployed over 200 units with zero field failures.', stars: 5 },
]

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1">{[...Array(count)].map((_, i) => <Star key={i} size={14} className="fill-[#c44a2b] text-[#c44a2b]" />)}</div>
)

export default function Certifications({ locale }: { locale?: string }) {
  const t = locale === 'zh'
    ? { certTitle: '全球认证', certDesc: '我们的产品通过国际权威认证', testTitle: '客户评价' }
    : locale === 'ja'
    ? { certTitle: 'グローバル認証', certDesc: '国際認証を取得した製品', testTitle: 'お客様の声' }
    : { certTitle: 'Global Certifications', certDesc: 'Our products meet international standards', testTitle: 'What Our Clients Say' }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center text-[2.8rem] font-bold text-[#0f2a44] mb-2">{t.certTitle}</h2>
          <p className="text-center text-[1.3rem] text-[#6b7a8f] mb-10">{t.certDesc}</p>
        </motion.div>
        <div className="mb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {certs.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-6 text-center hover:border-[#c44a2b]/30 hover:shadow-md transition-all"
            >
              <div className="text-[#c44a2b]">{c.icon}</div>
              <div className="font-bold text-[1.4rem] text-[#0f2a44]">{c.name}</div>
              <div className="text-[1.1rem] text-[#6b7a8f]">{c.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[2.8rem] font-bold text-[#0f2a44] mb-10"
        >{t.testTitle}</motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
            >
              <StarRating count={t.stars} />
              <p className="mt-4 text-[1.3rem] leading-relaxed text-[#2c3e50] italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="font-semibold text-[1.3rem] text-[#0f2a44]">{t.name}</div>
                <div className="text-[1.2rem] text-[#6b7a8f]">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
