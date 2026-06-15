'use client'

import React, { useState } from 'react'
import { Building2, History, ShieldCheck, Globe, Briefcase, Users, Zap, Award, CheckCircle, Clock, ChevronDown, ChevronUp, Send } from 'lucide-react'

const TABS = [
  { key: 'profile', zh: '公司简介', en: 'Company Profile', ja: '会社概要' },
  { key: 'history', zh: '发展历程', en: 'History', ja: '沿革' },
  { key: 'quality', zh: '质量承诺', en: 'Quality Promise', ja: '品質保証' },
  { key: 'partners', zh: '合作伙伴', en: 'Global Partners', ja: 'パートナー' },
  { key: 'careers', zh: '人才招聘', en: 'Careers', ja: '採用情報' },
] as const

const MILESTONES = [
  { year: '2014', zh: '深圳光明总部成立，专注POE电源研发', en: 'Founded in Shenzhen, focused on POE power supply R&D', ja: '深セン光明本社設立、POE電源研究開発に注力' },
  { year: '2016', zh: '通过ISO 9001质量管理体系认证', en: 'ISO 9001:2015 certified', ja: 'ISO 9001:2015認証取得' },
  { year: '2018', zh: '惠州生产基地投产，年产能突破100万台', en: 'Huizhou factory opened, capacity exceeded 1M units/year', ja: '惠州生産拠点稼働開始、年間生産能力100万台突破' },
  { year: '2020', zh: '通过国家高新技术企业认定', en: 'Recognized as National High-Tech Enterprise', ja: '国家ハイテク企業認定取得' },
  { year: '2021', zh: '产品线扩展至UPS、逆变器、储能', en: 'Expanded into UPS, inverter, energy storage', ja: 'UPS、インバーター、蓄電システムへ製品ライン拡大' },
  { year: '2022', zh: '获专精特新企业认定，研发团队突破50人', en: 'Recognized as SRDI enterprise; R&D team 50+', ja: '専精特新企業認定、研究開発チーム50名突破' },
  { year: '2023', zh: '越南生产基地投产，年产能突破300万台', en: 'Vietnam factory launched; 3M+ annual capacity', ja: 'ベトナム生産拠点稼働、年間生産能力300万台突破' },
  { year: '2024', zh: '研发团队80+人，全球服务300+客户', en: '80+ R&D engineers; 300+ global customers', ja: '研究開発チーム80名以上、世界300社以上にサービス提供' },
  { year: '2025', zh: '年销售额5.1亿元，服务10+世界500强企业', en: 'RMB 510M revenue; serving 10+ Fortune 500', ja: '年間売上高5.1億元、フォーチュン500企業10社以上と取引' },
]

const QUALITY_ITEMS = [
  { zh: 'ISO 9001:2015质量管理体系', en: 'ISO 9001:2015 Quality Management', ja: 'ISO 9001:2015 品質マネジメントシステム', icon: <CheckCircle size={20} /> },
  { zh: 'ISO 14001:2015环境管理体系', en: 'ISO 14001:2015 Environmental Management', ja: 'ISO 14001:2015 環境マネジメントシステム', icon: <CheckCircle size={20} /> },
  { zh: '国家高新技术企业', en: 'National High-Tech Enterprise', ja: '国家ハイテク企業', icon: <Award size={20} /> },
  { zh: '专精特新企业', en: 'Specialized & Innovative Enterprise', ja: '専精特新企業', icon: <Award size={20} /> },
  { zh: '每批出货附200万美元产品责任险', en: '$2M product liability insurance per shipment', ja: '出荷ごとに200万ドルの製造物責任保険付き', icon: <ShieldCheck size={20} /> },
  { zh: '产品认证覆盖全球30+国家', en: 'Certifications in 30+ countries', ja: '世界30カ国以上で認証取得', icon: <Globe size={20} /> },
  { zh: 'DQA实验室：EMC/安规/环境/HALT全能力', en: 'Full DQA lab: EMC, safety, environmental, HALT', ja: 'DQAラボ：EMC/安全規格/環境/HALT全対応', icon: <Zap size={20} /> },
  { zh: 'RFQ→EVT→DVT→PVT→MP全流程质量门控', en: 'Full NPI process with quality gate reviews', ja: 'RFQ→EVT→DVT→PVT→MP全工程品質ゲート管理', icon: <Clock size={20} /> },
]

const PARTNER_REGIONS = [
  { region_zh: '北美', region_en: 'North America', region_ja: '北米', flag: '🇺🇸' },
  { region_zh: '欧洲', region_en: 'Europe', region_ja: 'ヨーロッパ', flag: '🇪🇺' },
  { region_zh: '日韩', region_en: 'Japan & Korea', region_ja: '日本・韓国', flag: '🇯🇵' },
  { region_zh: '东南亚', region_en: 'Southeast Asia', region_ja: '東南アジア', flag: '🌏' },
  { region_zh: '中东', region_en: 'Middle East', region_ja: '中東', flag: '🌍' },
  { region_zh: '拉美', region_en: 'Latin America', region_ja: 'ラテンアメリカ', flag: '🌎' },
]

const JOB_LIST = [
  {
    zh: { title: '外贸业务经理', dept: '销售部', location: '深圳', type: '全职' },
    en: { title: 'Foreign Trade Manager', dept: 'Sales', location: 'Shenzhen', type: 'Full-time' },
    ja: { title: '海外営業マネージャー', dept: '営業部', location: '深セン', type: '正社員' },
  },
  {
    zh: { title: '电源研发工程师', dept: '研发一部', location: '深圳', type: '全职' },
    en: { title: 'Power R&D Engineer', dept: 'R&D Dept 1', location: 'Shenzhen', type: 'Full-time' },
    ja: { title: '電源研究開発エンジニア', dept: '研究開発第一部', location: '深セン', type: '正社員' },
  },
  {
    zh: { title: '储能系统工程师', dept: '研发四部', location: '深圳', type: '全职' },
    en: { title: 'Energy Storage Engineer', dept: 'R&D Dept 4', location: 'Shenzhen', type: 'Full-time' },
    ja: { title: '蓄電システムエンジニア', dept: '研究開発第四部', location: '深セン', type: '正社員' },
  },
  {
    zh: { title: '品质工程师 (QE)', dept: '品质部', location: '惠州', type: '全职' },
    en: { title: 'Quality Engineer (QE)', dept: 'Quality', location: 'Huizhou', type: 'Full-time' },
    ja: { title: '品質エンジニア (QE)', dept: '品質部', location: '恵州', type: '正社員' },
  },
  {
    zh: { title: '生产主管', dept: '生产部', location: '越南', type: '全职' },
    en: { title: 'Production Supervisor', dept: 'Production', location: 'Vietnam', type: 'Full-time' },
    ja: { title: '生産管理者', dept: '生産部', location: 'ベトナム', type: '正社員' },
  },
]

// Helper: pick the right translation from a zh/en/ja record
function t<K extends string>(record: Record<K, string>, l: 'zh' | 'en' | 'ja', fallbackKey: K): string {
  return (record as Record<string, string>)[l] || (record as Record<string, string>)[fallbackKey]
}

function ProfileTab({ l }: { l: 'zh' | 'en' | 'ja' }) {
  const t = l === 'zh' ? {
    intro: '深圳市晨旭通科技股份有限公司（品牌：Risunic）成立于2014年，总部位于中国深圳，是一家集研发、生产、销售于一体的国家高新技术企业、专精特新企业。十余年深耕电源与电力电子领域，已成为全球客户信赖的OEM/ODM制造商与解决方案提供商。',
    factory: '公司拥有两大现代化生产基地——广东惠州和越南，年产能超500万台。深圳总部设有研发中心、销售中心和管理中枢。',
    revenue: '2025年销售额达5.1亿元人民币，2026年目标5.6亿元。全球服务600+家客户，其中10余家为世界500强/百强企业。',
    stats: ['80+ 研发工程师', '500+ 产品型号', '500万+ 年产能', '30+ 出口国家'],
  } : l === 'ja' ? {
    intro: '深セン市晨旭通科技股份有限公司（ブランド：Risunic）は2014年に設立され、中国深センに本社を置く、研究開発・製造・販売を一体化した国家ハイテク企業です。10年以上にわたり電源とパワーエレクトロニクス分野に特化し、世界中の顧客から信頼されるOEM/ODMメーカーとなっています。',
    factory: '広東省惠州とベトナムに2つの最新鋭生産拠点を持ち、年間生産能力は500万台以上です。',
    revenue: '2025年の売上高は5.1億元、2026年の目標は5.6億元です。世界600社以上の顧客にサービスを提供し、うち10社以上がフォーチュン500/トップ100企業です。',
    stats: ['80名以上のR&Dエンジニア', '500以上のSKU', '500万台以上の年間生産能力', '30カ国以上に輸出'],
  } : {
    intro: 'Risunic Technology (Shenzhen) Co., Ltd. was founded in 2014 and is headquartered in Shenzhen, China. Over a decade of industry experience has positioned us as a reliable OEM/ODM manufacturer and solution provider in the power supply, energy storage, and power electronics sectors.',
    factory: 'We operate two modern manufacturing bases — in Huizhou, China and Vietnam — with a combined production capacity of over 5 million units annually.',
    revenue: 'In 2025, our sales revenue reached RMB 510 million (~USD 70 million), with a 2026 target of RMB 560 million. We serve 600+ active customers globally, including 10+ Fortune 500 / Top 100 enterprises.',
    stats: ['80+ R&D Engineers', '500+ Product SKUs', '5M+ Annual Capacity', '30+ Export Countries'],
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed mb-4">{t.intro}</p>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed mb-4">{t.factory}</p>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed">{t.revenue}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {t.stats.map((s, i) => (
          <div key={i} className="card-ts flex flex-col items-center justify-center text-center">
            <span className="text-[2.4rem] font-bold text-[#F7D142]">{s.split(' ')[0]}</span>
            <span className="text-[1.3rem] text-[#4A5D70] mt-1">{s.substring(s.indexOf(' ') + 1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryTab({ l }: { l: 'zh' | 'en' | 'ja' }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-4 md:left-1/2 top-3 bottom-3 w-0.5 bg-[#E2E8EF] md:-translate-x-px" />
      <div className="space-y-8">
        {MILESTONES.map((m, i) => (
          <div key={m.year} className={`relative pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10 md:ml-0' : 'md:pl-10 md:ml-auto'}`}>
            <div className="absolute left-1 md:left-auto top-2 w-6 h-6 rounded-full border-2 border-[#F7D142] bg-white md:right-0 md:-mr-3" style={i % 2 === 0 ? { left: '0.25rem' } : { left: '0.25rem' }} />
            <div className="card-ts">
              <span className="text-[1.2rem] font-bold text-[#F7D142] mb-1 block">{m.year}</span>
              <p className="text-[1.3rem] text-[#4A5D70]">{m[l] || m.en}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QualityTab({ l }: { l: 'zh' | 'en' | 'ja' }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {QUALITY_ITEMS.map((item, i) => (
        <div key={i} className="card-ts flex items-center gap-4">
          <div className="text-[#F7D142] shrink-0">{item.icon}</div>
          <span className="text-[1.3rem] text-[#0E4071] font-medium">{item[l] || item.en}</span>
        </div>
      ))}
    </div>
  )
}

function PartnersTab({ l }: { l: 'zh' | 'en' | 'ja' }) {
  const labels = l === 'zh' ? { title: '服务全球 30+ 国家和地区' }
    : l === 'en' ? { title: 'Serving 30+ Countries & Regions' }
    : { title: '世界30カ国以上にサービス提供' }
  return (
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-[1.8rem] font-bold text-[#0E4071] mb-8">{labels.title}</p>
      <div className="grid grid-cols-3 gap-4">
        {PARTNER_REGIONS.map((r, i) => {
          const regionKey = `region_${l}` as keyof typeof r
          const regionName = (r[regionKey] as string) || r.region_en
          return (
            <div key={i} className="card-ts flex flex-col items-center justify-center py-8">
              <span className="text-[3rem] block mb-2">{r.flag}</span>
              <span className="text-[1.3rem] font-medium text-[#0E4071]">{regionName}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CareersTab({ l }: { l: 'zh' | 'en' | 'ja' }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const labels = l === 'zh' ? {
    title: '加入晨旭通', why: '为什么选择我们', why1: '行业领先的技术平台与研发投入', why2: '完善的培训体系与职业发展通道', why3: '全球化工作环境与跨国协作机会', why4: '有竞争力的薪酬福利与股权激励',
    formTitle: '投递简历', name: '姓名', email: '邮箱', phone: '电话', position: '应聘岗位', message: '自我介绍/附加信息', submit: '提交申请', resume: '上传简历',
    deptLabel: '部门：', locationLabel: '地点：', typeLabel: '类型：', applyNote: '请填写右侧表单提交申请，我们将在3个工作日内回复。',
  } : l === 'ja' ? {
    title: '採用情報', why: '選ばれる理由', why1: '業界トップクラスの技術プラットフォーム', why2: '充実した研修制度とキャリア開発', why3: 'グローバルな職場環境と国際協業', why4: '競争力のある報酬と福利厚生',
    formTitle: '履歴書を送る', name: 'お名前', email: 'メールアドレス', phone: '電話番号', position: '希望職種', message: '自己紹介・その他', submit: '送信', resume: '履歴書アップロード',
    deptLabel: '部署：', locationLabel: '勤務地：', typeLabel: '雇用形態：', applyNote: '右側のフォームからご応募ください。3営業日以内にご連絡いたします。',
  } : {
    title: 'Join Our Team', why: 'Why Risunic?', why1: 'Industry-leading technology platform & R&D investment', why2: 'Comprehensive training & career development', why3: 'Global workplace with cross-border collaboration', why4: 'Competitive compensation & equity incentives',
    formTitle: 'Apply Now', name: 'Name', email: 'Email', phone: 'Phone', position: 'Position', message: 'About You / Additional Info', submit: 'Submit Application', resume: 'Upload Resume',
    deptLabel: 'Dept: ', locationLabel: 'Location: ', typeLabel: 'Type: ', applyNote: 'Please fill in the form to apply. We will respond within 3 business days.',
  }

  return (
    <div className="grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-2">
        <h3 className="text-[1.8rem] font-bold text-[#0E4071] mb-6">{labels.title}</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[labels.why1, labels.why2, labels.why3, labels.why4].map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-[1.2rem] text-[#4A5D70]">
              <CheckCircle size={14} className="text-[#F7D142] mt-0.5 shrink-0" /><span>{w}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {JOB_LIST.map((job, i) => {
            const jobData = job[l] || job.en
            return (
              <div key={i}>
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all ${expanded === i ? 'border-[#F7D142] bg-[#F7D142]/5' : 'border-[#E2E8EF] bg-white'} hover:border-[#F7D142]/30`}>
                  <div>
                    <div className="font-semibold text-[1.4rem] text-[#0E4071]">{jobData.title}</div>
                    <div className="text-[1.2rem] text-[#4A5D70]">{jobData.dept} · {jobData.location} · {jobData.type}</div>
                  </div>
                  {expanded === i ? <ChevronUp size={18} className="text-[#F7D142]" /> : <ChevronDown size={18} className="text-[#4A5D70]" />}
                </button>
                {expanded === i && (
                  <div className="rounded-b-xl border border-t-0 border-[#E2E8EF] p-4 bg-white text-[1.3rem] text-[#4A5D70] leading-relaxed">
                    <p className="mb-2"><strong>{labels.deptLabel}</strong>{jobData.dept}</p>
                    <p className="mb-2"><strong>{labels.locationLabel}</strong>{jobData.location}</p>
                    <p className="mb-2"><strong>{labels.typeLabel}</strong>{jobData.type}</p>
                    <p>{labels.applyNote}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="lg:col-span-3">
        <h3 className="text-[1.8rem] font-bold text-[#0E4071] mb-6">{labels.formTitle}</h3>
        <form className="grid sm:grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder={labels.name} className="sm:col-span-2 input-field" />
          <input type="email" placeholder={labels.email} className="input-field" />
          <input type="tel" placeholder={labels.phone} className="input-field" />
          <select className="sm:col-span-2 input-field">
            <option value="">{labels.position}</option>
            {JOB_LIST.map(j => {
              const jobData = j[l] || j.en
              return <option key={jobData.title} value={jobData.title}>{jobData.title}</option>
            })}
          </select>
          <div className="sm:col-span-2 rounded-xl border border-dashed border-[#F7D142]/30 px-4 py-6 text-center text-[1.3rem] text-[#4A5D70] cursor-pointer hover:bg-[#F7D142]/5 transition-colors">
            📎 {labels.resume}
            <input type="file" className="hidden" />
          </div>
          <textarea placeholder={labels.message} rows={4} className="sm:col-span-2 input-field" />
          <button type="submit" className="sm:col-span-2 btn-primary justify-center text-[1.4rem] py-3">
            <Send size={16} /> {labels.submit}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CompanyCards({ locale }: { locale?: string }) {
  const [activeTab, setActiveTab] = useState('profile')
  const l = ['en', 'zh', 'ja'].includes(locale || 'en') ? locale as 'en' | 'zh' | 'ja' : 'en'

  const sectionTitle = l === 'zh' ? '关于晨旭通' : l === 'ja' ? '会社概要' : 'About Us'
  const sectionSub = l === 'zh' ? '公司简介' : l === 'ja' ? '概要' : 'Company'

  const tabContent: Record<string, React.ReactNode> = {
    profile: <ProfileTab l={l} />,
    history: <HistoryTab l={l} />,
    quality: <QualityTab l={l} />,
    partners: <PartnersTab l={l} />,
    careers: <CareersTab l={l} />,
  }

  return (
    <section className="py-20 md:py-28 bg-[#ECF1F7]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-subtitle">{sectionSub}</p>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map(tab => (
            <button key={tab.key} type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-full text-[1.3rem] font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#F7D142] text-[#0E4071] shadow-md'
                  : 'bg-white text-[#4A5D70] hover:bg-[#E2E8EF] border border-[#E2E8EF]'
              }`}
            >
              {tab[l]}
            </button>
          ))}
        </div>
        {tabContent[activeTab]}
      </div>
    </section>
  )
}
