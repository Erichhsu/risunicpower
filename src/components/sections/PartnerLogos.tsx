'use client'

import Image from 'next/image'

const partners = [
  { file: '比亚迪.webp', name: 'BYD', width: 90 },
  { file: '富士康.jpg', name: 'Foxconn', width: 110 },
  { file: '华三.jpg', name: 'H3C', width: 70 },
  { file: '台达.jpg', name: 'Delta', width: 90 },
  { file: '海康.jpg', name: 'Hikvision', width: 110 },
  { file: '大华.jpg', name: 'Dahua', width: 80 },
  { file: '锐捷.jpg', name: 'Ruijie', width: 90 },
  { file: '山克.webp', name: 'SANK', width: 90 },
  { file: '和硕.jpg', name: 'Pegatron', width: 100 },
  { file: '盟创.jpg', name: 'Mengchuang', width: 80 },
  { file: '迈腾.jpg', name: 'Maiteng', width: 70 },
  { file: '埃阔电气.webp', name: 'E&K', width: 80 },
  { file: '1_画板 1_画板 1.jpg', name: 'Partner', width: 70 },
  { file: '3_画板 1.jpg', name: 'Partner', width: 70 },
  { file: '19_画板 1.jpg', name: 'Partner', width: 70 },
  { file: '21_画板 1.jpg', name: 'Partner', width: 70 },
]

interface Props { locale?: string }

export default function PartnerLogos({ locale }: Props) {
  const title = locale === 'zh' ? '合作伙伴' : locale === 'ja' ? 'パートナー' : 'Trusted Partners'
  const subtitle = locale === 'zh' ? '全球知名企业信赖之选' : locale === 'ja' ? '世界中のトップ企業から信頼されています' : 'Trusted by leading enterprises worldwide'

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-subtitle">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center justify-items-center">
          {partners.map((p) => (
            <div
              key={p.file}
              className="w-full aspect-[3/2] flex items-center justify-center p-3 rounded-lg border border-[#E2E8EF] bg-white hover:border-[#F7D142]/30 hover:shadow-sm transition-all grayscale hover:grayscale-0"
              title={p.name}
            >
              <Image
                src={`/images/partners/${encodeURIComponent(p.file)}`}
                alt={p.name}
                width={p.width}
                height={40}
                className={`object-contain ${p.file === '山克.webp' ? 'w-[50%] h-[50%]' : 'w-[80%] h-[80%]'}`}
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[1.3rem] text-[#4A5D70]">
            {locale === 'zh'
              ? '与更多世界500强及行业领军企业建立长期合作关系'
              : locale === 'ja'
                ? 'さらなるグローバルリーダーとのパートナーシップを築いています'
                : 'Building long-term partnerships with Fortune 500 & industry leaders'}
          </p>
        </div>
      </div>
    </section>
  )
}
