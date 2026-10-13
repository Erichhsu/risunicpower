import { Metadata } from 'next'
import Link from 'next/link'
import VideoPlayer from './VideoPlayer'

const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

const VIDEO_URL = 'https://1442780775.vod-qcloud.com/2ae5b997vodtranscq1442780775/f128c4105001834823874958655/adp.10.m3u8'
const VIDEO_POSTER = '/images/video/video-cover.jpg'

const metadataMap: Record<string, { title: string; desc: string }> = {
  en: { title: 'Company Video — RisunicPower', desc: 'Inside RisunicPower: two factories, automated production lines, and 80+ R&D engineers building power electronics for 160+ countries.' },
  zh: { title: '公司宣传片 — RisunicPower', desc: '走进晨旭通科技：双工厂、自动化产线、80+研发工程师，为全球160+国家打造电力电子。' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = SUPPORTED_LOCALES.includes(locale) ? locale : 'en'
  const t = metadataMap[l] || metadataMap.en
  return { title: t.title, description: t.desc }
}

const dataMap: Record<string, {
  title: string
  subtitle: string
  intro: string
  points: { h: string; p: string }[]
  cta: string
}> = {
  en: {
    title: 'Company Video',
    subtitle: 'Inside RisunicPower — Two Factories, One Standard',
    intro: 'Take a two-minute tour of our Huizhou and Vietnam campuses: automated SMT lines, burn-in testing, and the 80+ engineers behind every inverter, ESS, and power stage we ship.',
    points: [
      { h: '80,000 m² Owned Campus', p: 'Two fully-owned plants in Huizhou (China) and Vietnam, producing 300,000+ units monthly.' },
      { h: '75%+ Automation', p: 'Automated SMT lines with 180 million points/month and full-process quality control.' },
      { h: '80+ R&D Engineers', p: 'In-house DSP control, power stages, and firmware — 8%+ of revenue reinvested in R&D.' },
      { h: 'OEM / ODM Partner', p: 'From bare boards to 40 kW digital power, built to your spec with CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'Explore Our Products',
  },
  zh: {
    title: '公司宣传片',
    subtitle: '走进晨旭通 — 双工厂，同一标准',
    intro: '两分钟带你参观惠州与越南园区：自动化 SMT 产线、老化测试，以及每一台逆变器、储能与电源背后的 80+ 工程师团队。',
    points: [
      { h: '80,000㎡ 自有园区', p: '惠州（中国）+ 越南双工厂，月产能 300,000+ 台。' },
      { h: '75%+ 自动化', p: '自动化 SMT 产线，月贴片 1.8 亿点，全流程质量管控。' },
      { h: '80+ 研发工程师', p: '自研 DSP 控制、功率级与固件，研发投入占年销售 8%+。' },
      { h: 'OEM / ODM 伙伴', p: '从裸板到 40kW 数字电源，按需定制，CE/CB/UL/EN 50549-1 认证。' },
    ],
    cta: '浏览产品',
  },
}

export default async function VideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = SUPPORTED_LOCALES.includes(locale) ? locale : 'en'
  const data = dataMap[l] || dataMap.en

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

      {/* ── Video Player ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <VideoPlayer src={VIDEO_URL} poster={VIDEO_POSTER} title={data.title} />
          <p className="mt-6 text-center text-[1.4rem] text-[#4A5D70] max-w-3xl mx-auto leading-relaxed">
            {data.intro}
          </p>
        </div>
      </section>

      {/* ── Key Points (2×2) ── */}
      <section className="py-16 md:py-24 bg-[#F5F8FC]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {data.points.map((point, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#e2e8ef] hover:border-[#F7D142]/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F7D142]/20 flex items-center justify-center text-[#F7D142] text-[1.8rem] font-bold mb-4">{i + 1}</div>
                <h3 className="text-[2rem] font-bold text-[#0E4071] mb-3">{point.h}</h3>
                <p className="text-[1.4rem] leading-relaxed text-[#4A5D70]">{point.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white text-center">
        <Link href={`/${l}/products`}
          className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[#F7D142] text-white text-[1.5rem] font-bold hover:bg-[#D4B838] transition-all shadow-lg shadow-[#F7D142]/30"
        >
          {data.cta}
        </Link>
      </section>
    </main>
  )
}
