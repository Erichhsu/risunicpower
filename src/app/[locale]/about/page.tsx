import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = locale === 'zh'
    ? { title: '关于我们 — RisunicPower', desc: '晨旭通科技 — 18年电源制造经验，服务全球60+国家' }
    : { title: 'About Us — RisunicPower', desc: 'Shenzhen Risunic Technology — 18+ years of power manufacturing excellence' }
  return { title: t.title, description: t.desc }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  const data = l === 'zh' ? {
    title: '关于晨旭通科技',
    subtitle: '18年专注电源研发与制造',
    sections: [
      { h: '公司简介', p: '深圳晨旭通科技有限公司（RisunicPower）成立于2008年，是一家专注于电源解决方案研发、生产和销售的科技企业。公司总部位于中国深圳，拥有12000㎡的生产基地，年产能超过200万台电源产品。' },
      { h: '核心能力', p: '我们拥有18年电源研发经验，30余名研发工程师团队，配备EMC实验室、环境试验室和自动化生产线。产品通过CE、FCC、UL、RoHS、ISO 9001等国际认证，远销全球60多个国家和地区。' },
      { h: '产品线', p: '公司产品涵盖POE电源适配器、消费类电源适配器、裸板电源、UPS不间断电源、逆变器、便携储能电源、微型逆变器、工业电源和一体机储能系统等九大品类，为全球600多家客户提供标准产品和ODM/OEM定制服务。' },
      { h: '质量承诺', p: '从物料选型到成品出货，我们执行全流程质量控制。所有产品均经过老化测试和可靠性验证，确保每台产品出厂前达到最佳性能状态。我们承诺24小时技术响应，为客户提供全生命周期的技术支持。' },
    ],
    cta: '联系我们获取产品目录和报价',
  } : l === 'ja' ? {
    title: '当社について',
    subtitle: '18年の電源研究開発と製造の専門知識',
    sections: [
      { h: '会社概要', p: '深セン晨旭通科技有限公司（RisunicPower）は2008年に設立され、電源ソリューションの研究開発、製造、販売に特化した企業です。本社は中国深センにあり、12,000㎡の生産拠点を有し、年間200万台以上の電源製品を生産しています。' },
      { h: 'コア技術', p: '18年の電源研究開発経験、30名以上の研究開発エンジニアチーム、EMCラボ、環境試験室、自動化生産ラインを完備。CE、FCC、UL、RoHS、ISO 9001などの国際認証を取得し、60カ国以上に製品を輸出しています。' },
      { h: '製品ライン', p: 'POE電源アダプター、民生用電源アダプター、オープンフレーム電源、UPS、インバーター、ポータブル電源、マイクロインバーター、産業用電源、オールインワン太陽光システムの9カテゴリーを展開。600社以上の顧客に標準製品とODM/OEMカスタマイズサービスを提供しています。' },
      { h: '品質への取り組み', p: '材料選定から出荷まで、全工程の品質管理を実施。すべての製品はエージングテストと信頼性検証を経て出荷されます。24時間の技術サポートを提供し、製品ライフサイクル全体にわたる技術支援を行っています。' },
    ],
    cta: '製品カタログと見積もりについてはお問い合わせください',
  } : {
    title: 'About RisunicPower',
    subtitle: '18+ Years of Power Electronics Excellence',
    sections: [
      { h: 'Our Story', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) was founded in 2008, specializing in the R&D, manufacturing, and sales of power solutions. Headquartered in Shenzhen, China, we operate a 12,000㎡ production facility with an annual capacity of over 2 million units.' },
      { h: 'Core Capabilities', p: 'With 18+ years of power supply R&D experience, a team of 30+ R&D engineers, and state-of-the-art facilities including EMC labs, environmental test chambers, and automated production lines, our products meet CE, FCC, UL, RoHS, and ISO 9001 standards. We export to 60+ countries worldwide.' },
      { h: 'Product Portfolio', p: 'Our product range spans 9 categories: POE power supplies, consumer adapters, open-frame power supplies, UPS systems, inverters, portable power stations, micro-inverters, industrial power supplies, and all-in-one solar systems. We serve 600+ global clients with both standard products and ODM/OEM customization.' },
      { h: 'Quality Promise', p: 'From component selection to final shipment, every product undergoes burn-in testing and reliability validation. We offer 24-hour technical response and lifecycle support for every product we deliver.' },
    ],
    cta: 'Contact us for a product catalog and quotation',
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[800px] px-6">
        <h1 className="text-[3.6rem] font-bold text-[#0f2a44] mb-2">{data.title}</h1>
        <p className="text-[1.5rem] text-[#c44a2b] font-medium mb-12">{data.subtitle}</p>

        <div className="space-y-12">
          {data.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[2.2rem] font-bold text-[#0f2a44] mb-4 border-b border-gray-200 pb-2">{s.h}</h2>
              <p className="text-[1.4rem] leading-relaxed text-[#2c3e50]">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link href={`/${l}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c44a2b] text-white text-[1.4rem] font-semibold hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/20"
          >
            {data.cta}
          </Link>
        </div>
      </div>
    </main>
  )
}
