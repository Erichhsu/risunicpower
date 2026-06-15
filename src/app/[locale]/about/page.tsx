import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = locale === 'zh'
    ? { title: '关于我们 — RisunicPower', desc: '晨旭通科技 — 12年电源制造经验，服务全球60+国家' }
    : { title: 'About Us — RisunicPower', desc: 'Shenzhen Risunic Technology — 12+ years of power manufacturing excellence' }
  return { title: t.title, description: t.desc }
}

interface PhotoItem {
  src: string
  caption_en: string
  caption_zh: string
  caption_ja: string
}

const photos: PhotoItem[] = [
  { src: '/images/factory/huizhou-factory.jpg', caption_en: 'Huizhou Manufacturing Base', caption_zh: '惠州生产基地', caption_ja: '恵州製造拠点' },
  { src: '/images/factory/vietnam-factory-2.webp', caption_en: 'Vietnam Production Facility', caption_zh: '越南生产工厂', caption_ja: 'ベトナム生産拠点' },
  { src: '/images/factory/factory-showroom.jpg', caption_en: 'Factory Showroom', caption_zh: '工厂展厅', caption_ja: '工場ショールーム' },
  { src: '/images/why-us/定制电源设计.webp', caption_en: 'Custom Power Design', caption_zh: '定制电源设计', caption_ja: 'カスタム電源設計' },
  { src: '/images/why-us/全球认证合规.jpg', caption_en: 'Global Certifications', caption_zh: '全球认证合规', caption_ja: 'グローバル認証' },
  { src: '/images/why-us/快速交付体系.jpg', caption_en: 'Fast Delivery System', caption_zh: '快速交付体系', caption_ja: '迅速な納品体制' },
]

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  const data = l === 'zh' ? {
    title: '关于晨旭通科技',
    subtitle: '12年专注电源研发与制造 · 服务全球600+客户',
    story: { h: '我们的故事', p: '深圳市晨旭通科技股份有限公司（RisunicPower）成立于2014年，是一家专注于电源解决方案研发、生产和销售的科技企业。公司总部位于中国深圳，拥有12000㎡的生产基地和越南海外工厂，年产能超过500万台电源产品。产品通过CE、FCC、UL、RoHS、ISO 9001等国际认证，远销全球30多个国家和地区。' },
    capability: { h: '核心能力', p: '80+研发工程师 | EMC实验室 + 环境试验室 | 自动化SMT产线 | 全流程质量管控 | 24小时技术响应' },
    portfolio: { h: '九大产品线', p: 'PoE电源 · UPS · 逆变器整机 · 裂相机 · 后备机 · 便携储能 · 一体机 · 微型逆变器 · MPPT控制器' },
    quality: { h: '质量承诺', p: '从物料选型到成品出货全流程控制。所有产品经老化测试和可靠性验证。提供全生命周期技术支持。' },
    cta: '联系我们获取产品目录和报价',
    timeline: [
      { year: '2014', text: '深圳公司成立，专注电源研发' },
      { year: '2016', text: '通过ISO 9001质量管理体系认证' },
      { year: '2016', text: '惠州生产基地投产，产能翻倍' },
      { year: '2020', text: '产品线扩展至储能和逆变器领域' },
      { year: '2024', text: '越南工厂投产，全球化布局加速' },
      { year: '2026', text: '推出RisunicPower全球品牌' },
    ],
  } : l === 'ja' ? {
    title: '当社について',
    subtitle: '12年の電源開発・製造実績 · 世界600社以上に提供',
    story: { h: '私たちのストーリー', p: '深セン市晨旭通科技股份有限公司（RisunicPower）は2014年に設立され、電源ソリューションの研究開発、製造、販売に特化した企業です。本社は中国深セン、12,000㎡の生産拠点とベトナム工場を有し、年間500万台以上を生産。CE、FCC、UL、RoHS、ISO 9001等の認証を取得し、世界30カ国以上に輸出しています。' },
    capability: { h: 'コア技術', p: '80名以上の研究開発エンジニア | EMCラボ + 環境試験室 | 自動化SMTライン | 全工程品質管理 | 24時間技術サポート' },
    portfolio: { h: '9つの製品ライン', p: 'PoE電源 · UPS · インバーター · 分割相 · バックアップ · ポータブル電源 · 一体型 · マイクロインバーター · MPPT' },
    quality: { h: '品質への取り組み', p: '材料選定から出荷まで全工程の品質管理。全製品エージングテストと信頼性検証実施。製品ライフサイクル全体の技術サポートを提供。' },
    cta: '製品カタログと見積もりについてはお問い合わせください',
    timeline: [
      { year: '2014', text: '深センに創業、電源開発に特化' },
      { year: '2016', text: 'ISO 9001品質マネジメント認証取得' },
      { year: '2016', text: '恵州生産拠点稼働、生産能力倍増' },
      { year: '2020', text: '蓄電・インバーター分野に製品拡大' },
      { year: '2024', text: 'ベトナム工場稼働、グローバル展開加速' },
      { year: '2026', text: 'RisunicPowerグローバルブランド発表' },
    ],
  } : {
    title: 'About RisunicPower',
    subtitle: '12+ Years of Power Electronics Excellence · Serving 600+ Clients Worldwide',
    story: { h: 'Our Story', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) was founded in 2014, specializing in R&D, manufacturing, and sales of power solutions. Headquartered in Shenzhen with a 12,000m² production base and a Vietnam facility, we produce over 5 million units annually. Certified to CE, FCC, UL, RoHS, and ISO 9001, we export to 30+ countries worldwide.' },
    capability: { h: 'Core Capabilities', p: '80+ R&D Engineers | EMC Lab + Environmental Test Chambers | Automated SMT Lines | Full-Process QC | 24-Hour Tech Response' },
    portfolio: { h: 'Nine Product Lines', p: 'PoE电源 · UPS · 逆变器整机 · 裂相机 · 后备机 · 便携储能 · 一体机 · 微型逆变器 · MPPT控制器' },
    quality: { h: 'Quality Promise', p: 'Full-process quality control from component selection to shipment. Every product undergoes burn-in testing and reliability validation. Lifecycle technical support included.' },
    cta: 'Contact us for a product catalog and quotation',
    timeline: [
      { year: '2014', text: 'Founded in Shenzhen, focused on power supply R&D' },
      { year: '2016', text: 'ISO 9001 quality management certification' },
      { year: '2016', text: 'Huizhou manufacturing base begins operations' },
      { year: '2020', text: 'Expanded into energy storage and inverters' },
      { year: '2024', text: 'Vietnam factory launched for global expansion' },
      { year: '2026', text: 'RisunicPower global brand unveiled' },
    ],
  }

  return (
    <main className="min-h-screen">
      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#0E4071] via-[#1a5a8a] to-[#0A2D52] overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-[clamp(2.8rem,5vw,5rem)] font-bold text-white mb-4 tracking-tight">{data.title}</h1>
          <p className="text-[clamp(1.3rem,2vw,1.6rem)] text-white/70 max-w-2xl mx-auto">{data.subtitle}</p>
        </div>
      </section>

      {/* ── 3×2 Photo Grid ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {photos.map((photo, i) => {
              const caption = l === 'zh' ? photo.caption_zh : l === 'ja' ? photo.caption_ja : photo.caption_en
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl bg-[#f5f8fc]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={photo.src}
                      alt={caption}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E4071]/90 via-[#0E4071]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                    <span className="text-white text-[1.2rem] md:text-[1.4rem] font-semibold">{caption}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline Road ── */}
      <section className="py-16 md:py-24 bg-[#F5F8FC]">
        <div className="max-w-[1000px] mx-auto px-6">
          <h2 className="text-center text-[2.4rem] font-bold text-[#0E4071] mb-12">Milestones</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#d0d8e0] -translate-x-1/2" />
            <div className="space-y-8 md:space-y-12">
              {data.timeline.map((item, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-4 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e2e8ef]">
                      <span className="inline-block text-[#F7D142] font-bold text-[2rem] mb-1">{item.year}</span>
                      <p className="text-[1.3rem] text-[#4A5D70]">{item.text}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-[#F7D142] border-4 border-[#F5F8FC] shrink-0 relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story Cards (2×2) ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[data.story, data.capability].map((card, i) => (
              <div key={i} className="group bg-[#F5F8FC] rounded-2xl p-8 border border-[#e2e8ef] hover:border-[#F7D142]/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F7D142]/20 flex items-center justify-center text-[#F7D142] text-[1.8rem] font-bold mb-4">{i + 1}</div>
                <h3 className="text-[2rem] font-bold text-[#0E4071] mb-3">{card.h}</h3>
                <p className="text-[1.4rem] leading-relaxed text-[#4A5D70]">{card.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Lines + Quality ── */}
      <section className="py-16 md:py-24 bg-[#0E4071]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[2rem] font-bold text-white mb-4">{data.portfolio.h}</h3>
              <p className="text-[1.4rem] leading-relaxed text-white/80">{data.portfolio.p}</p>
            </div>
            <div>
              <h3 className="text-[2rem] font-bold text-white mb-4">{data.quality.h}</h3>
              <p className="text-[1.4rem] leading-relaxed text-white/80">{data.quality.p}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white text-center">
        <Link href={`/${l}/contact`}
          className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[#F7D142] text-white text-[1.5rem] font-bold hover:bg-[#D4B838] transition-all shadow-lg shadow-[#F7D142]/30"
        >
          {data.cta}
        </Link>
      </section>
    </main>
  )
}
