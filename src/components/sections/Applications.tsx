'use client'

import Image from 'next/image'
const apps = [
  { key: 'building', zh: '智能建筑', ja: 'スマートビル', en: 'Smart Building', img: '/images/applications/智能建筑.webp',
    zhDesc: '门禁、监控、IoT设备POE集中供电', jaDesc: 'アクセス制御、監視、IoTデバイス向けPOE集中給電', enDesc: 'POE centralized power for access control, surveillance, IoT' },
  { key: 'new-energy', zh: '新能源', ja: '新エネルギー', en: 'New Energy', img: '/images/applications/新能源.webp',
    zhDesc: '光伏储能、微电网、新能源发电系统', jaDesc: '太陽光蓄電、マイクログリッド、再生可能エネルギー発電システム', enDesc: 'Solar storage, micro-grid, renewable power systems' },
  { key: 'data', zh: '数据中心', ja: 'データセンター', en: 'Data Center', img: '/images/applications/数据中心.webp',
    zhDesc: 'UPS后备电源保障关键业务不中断', jaDesc: 'UPSバックアップ電源で重要な業務の中断を防止', enDesc: 'UPS backup power for critical infrastructure' },
  { key: 'outdoor', zh: '户外作业', ja: '屋外作業', en: 'Outdoor Operations', img: '/images/applications/户外作业.webp',
    zhDesc: '便携储能电源，随时随地供电', jaDesc: 'ポータブル電源でどこでも給電可能', enDesc: 'Portable power stations for any location' },
]

const tData: Record<string, { title: string; sub: string }> = {
  zh: { title: '应用场景', sub: 'Applications' },
  ja: { title: '応用シーン', sub: 'Applications' },
  en: { title: 'Applications', sub: 'Applications' },
}

export default function Applications({ locale }: { locale?: string }) {
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? (locale || 'en') : 'en'
  const t = tData[l] || tData.en

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle">{t.sub}</p>
          <h2 className="section-title">{t.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app, i) => {
            const appAny = app as Record<string, unknown>
            const name = (appAny[l] as string) || app.en
            const desc = (l === 'zh' ? app.zhDesc : l === 'ja' ? app.jaDesc : app.enDesc)
            return (
              <div key={app.key}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#E5ECF4]"
              >
                <Image src={app.img} alt={name} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-[1.8rem] font-bold mb-2">{name}</h3>
                  <p className="text-[1.3rem] text-white/80">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
