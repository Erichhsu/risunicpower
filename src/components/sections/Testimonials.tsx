'use client'

import { Star } from 'lucide-react'

const testimonials = [
  { name: 'James Mitchell', company: 'PowerTech Solutions', country: 'USA', avatar: '/images/avatars/avatar_james.webp', quote: 'RisunicPower delivered a custom POE solution that perfectly matched our smart building requirements. The CE/FCC certifications saved us months of compliance work.', rating: 5 },
  { name: 'Andreas Wagner', company: 'EuroTel GmbH', country: 'Germany', avatar: '/images/avatars/avatar_andreas.webp', quote: 'We needed 48V telecom power supplies with fast turnaround. RisunicPower prototyped in 3 weeks and the quality exceeded our expectations. Our go-to partner in China.', rating: 5 },
  { name: 'Sarah Okonkwo', company: 'GridPower Africa', country: 'Nigeria', avatar: '/images/avatars/avatar_sarah.webp', quote: 'Their off-grid inverter solutions are game-changers for our rural electrification projects. Reliable, cost-effective, and backed by great technical support.', rating: 5 },
  { name: 'Michael Chen', company: 'Datacom Systems', country: 'Australia', avatar: '/images/avatars/avatar_michael.webp', quote: 'Been sourcing UPS systems from RisunicPower for 3 years. Zero failures, on-time delivery every single order. That kind of consistency is rare in this industry.', rating: 5 },
  { name: 'Maria Santos', company: 'SolEnergy Brazil', country: 'Brazil', avatar: '/images/avatars/avatar_maria.webp', quote: 'Their portable power stations have been a hit in the Brazilian market. The OEM customization options let us differentiate our brand while maintaining quality.', rating: 5 },
  { name: 'Hiroshi Tanaka', company: 'Nippon Denki KK', country: 'Japan', avatar: '/images/avatars/avatar_hiroshi.png', quote: 'RisunicPowerの品質管理体制は非常に優れています。納期厳守、不良品ゼロ。日本市場向けのカスタマイズにも柔軟に対応してくれます。', rating: 5 },
]

const labels: Record<string, { title: string; sub: string }> = {
  en: { title: 'What Our Clients Say', sub: 'Testimonials' },
  zh: { title: '客户对我们说', sub: 'Testimonials' },
  ja: { title: 'お客様の声', sub: 'Testimonials' },
}

interface Props { locale?: string }

export default function Testimonials({ locale }: Props) {
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? (locale || 'en') : 'en'
  const t = labels[l] || labels.en

  return (
    <section className="py-20 md:py-28 bg-[#E5ECF4]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle">{t.sub}</p>
          <h2 className="section-title">{t.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.name} className="card-ts">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#F7D142" stroke="#F7D142" />
                ))}
              </div>
              <p className="text-[1.4rem] text-[#4A5D70] leading-relaxed mb-6 italic">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-4 pt-4 border-t border-[#E2E8EF]">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-[#0f2a44]" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div>
                  <div className="font-semibold text-[1.4rem] text-[#0E4071]">{item.name}</div>
                  <div className="text-[1.2rem] text-[#4A5D70]">{item.company} · {item.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
