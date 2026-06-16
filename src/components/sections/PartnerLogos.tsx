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

const tData: Record<string, { title: string; subtitle: string; footer: string }> = {
  zh: { title: '合作伙伴', subtitle: '全球知名企业信赖之选', footer: '与更多世界500强及行业领军企业建立长期合作关系' },
  ja: { title: 'パートナー', subtitle: '世界中のトップ企業から信頼されています', footer: 'さらなるグローバルリーダーとのパートナーシップを築いています' },
  es: { title: 'Socios de Confianza', subtitle: 'Con la confianza de empresas líderes en todo el mundo', footer: 'Construyendo alianzas a largo plazo con Fortune 500 y líderes de la industria' },
  de: { title: 'Vertrauenswürdige Partner', subtitle: 'Vertrauen führender Unternehmen weltweit', footer: 'Aufbau langfristiger Partnerschaften mit Fortune 500 und Branchenführern' },
  fr: { title: 'Partenaires de Confiance', subtitle: 'La confiance des grandes entreprises mondiales', footer: 'Établir des partenariats à long terme avec le Fortune 500 et les leaders de l\'industrie' },
  pt: { title: 'Parceiros de Confiança', subtitle: 'Confiável para empresas líderes em todo o mundo', footer: 'Construindo parcerias de longo prazo com Fortune 500 e líderes do setor' },
  ar: { title: 'شركاء موثوقون', subtitle: 'موثوق به من قبل الشركات الرائدة عالميًا', footer: 'بناء شراكات طويلة الأجل مع فورتشن 500 وقادة الصناعة' },
  ru: { title: 'Надёжные Партнёры', subtitle: 'Доверие ведущих предприятий по всему миру', footer: 'Построение долгосрочных партнёрств с Fortune 500 и лидерами отрасли' },
  en: { title: 'Trusted Partners', subtitle: 'Trusted by leading enterprises worldwide', footer: 'Building long-term partnerships with Fortune 500 & industry leaders' },
}

interface Props { locale?: string }

export default function PartnerLogos({ locale }: Props) {
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? (locale || 'en') : 'en'
  const t = tData[l] || tData.en

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-subtitle">{t.subtitle}</p>
          <h2 className="section-title">{t.title}</h2>
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
            {t.footer}
          </p>
        </div>
      </div>
    </section>
  )
}
