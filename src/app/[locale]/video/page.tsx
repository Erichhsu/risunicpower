import { Metadata } from 'next'
import Link from 'next/link'
import VideoPlayer from './VideoPlayer'

const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

const VIDEO_URL = 'https://1442780775.vod-qcloud.com/2ae5b997vodtranscq1442780775/f128c4105001834823874958655/adp.10.m3u8'
const VIDEO_POSTER = '/images/video/video-cover.jpg'

const metadataMap: Record<string, { title: string; desc: string }> = {
  en: { title: 'Company Video — RisunicPower', desc: 'Inside RisunicPower: two factories, automated production lines, and 80+ R&D engineers building power electronics for 160+ countries.' },
  zh: { title: '公司视频 — RisunicPower', desc: '走进晨旭通科技：双工厂、自动化产线、80+研发工程师，为全球160+国家打造电力电子。' },
  ja: { title: '会社紹介動画 — RisunicPower', desc: 'RisunicPowerの舞台裏：2つの工場、自動化生産ライン、80名以上のR&Dエンジニアが160以上の国へ電源機器を供給。' },
  es: { title: 'Video corporativo — RisunicPower', desc: 'Dentro de RisunicPower: dos fábricas, líneas de producción automatizadas y más de 80 ingenieros de I+D que fabrican electrónica de potencia para más de 160 países.' },
  de: { title: 'Unternehmensvideo — RisunicPower', desc: 'Inside RisunicPower: zwei Werke, automatisierte Produktionslinien und über 80 F&E-Ingenieure, die Leistungselektronik für über 160 Länder bauen.' },
  fr: { title: "Vidéo d'entreprise — RisunicPower", desc: "Au cœur de RisunicPower : deux usines, des lignes de production automatisées et plus de 80 ingénieurs R&D qui conçoivent l'électronique de puissance pour plus de 160 pays." },
  pt: { title: 'Vídeo da Empresa — RisunicPower', desc: 'Por dentro da RisunicPower: duas fábricas, linhas de produção automatizadas e mais de 80 engenheiros de P&D que produzem eletrônica de potência para mais de 160 países.' },
  ar: { title: 'فيديو الشركة — RisunicPower', desc: 'داخل RisunicPower: مصنعان، خطوط إنتاج مؤتمتة، وأكثر من 80 مهندسًا للبحث والتطوير يصنعون إلكترونيات القدرة لأكثر من 160 دولة.' },
  ru: { title: 'Видео о компании — RisunicPower', desc: 'Внутри RisunicPower: два завода, автоматизированные производственные линии и более 80 инженеров R&D, создающих силовую электронику для более чем 160 стран.' },
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
    title: '公司视频',
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
  ja: {
    title: '会社紹介動画',
    subtitle: 'RisunicPowerの舞台裏 — 2つの工場、1つの基準',
    intro: '恵州およびベトナムの拠点を2分間でご案内します。自動化SMTライン、バーンイン試験、そして出荷するすべてのインバータ、ESS、パワーステージを支える80名以上のエンジニアをご紹介します。',
    points: [
      { h: '80,000 m²の自社所有キャンパス', p: '中国・恵州およびベトナムに2つの完全自社所有工場を構え、月間300,000+台を生産しています。' },
      { h: '75%+の自動化率', p: '月間1.8億点の実装能力を備えた自動化SMTラインと、全工程にわたる品質管理。' },
      { h: '80+名のR&Dエンジニア', p: 'DSP制御、パワーステージ、ファームウェアを内製 — 売上高の8%+をR&Dに再投資しています。' },
      { h: 'OEM / ODMパートナー', p: 'ベアボードから40 kWデジタル電源まで、CE/CB/UL/EN 50549-1に対応し、お客様の仕様に合わせて製造します。' },
    ],
    cta: '製品を見る',
  },
  es: {
    title: 'Video corporativo',
    subtitle: 'Dentro de RisunicPower — Dos fábricas, un mismo estándar',
    intro: 'Realice un recorrido de dos minutos por nuestras instalaciones en Huizhou y Vietnam: líneas SMT automatizadas, pruebas de burn-in y los más de 80 ingenieros detrás de cada inversor, ESS y etapa de potencia que enviamos.',
    points: [
      { h: 'Campus propio de 80,000 m²', p: 'Dos plantas de propiedad total en Huizhou (China) y Vietnam, con una producción mensual de más de 300,000 unidades.' },
      { h: 'Más del 75% de automatización', p: 'Líneas SMT automatizadas con 180 millones de puntos/mes y control de calidad durante todo el proceso.' },
      { h: 'Más de 80 ingenieros de I+D', p: 'Control DSP, etapas de potencia y firmware desarrollados internamente — más del 8% de los ingresos se reinvierte en I+D.' },
      { h: 'Socio OEM / ODM', p: 'Desde placas desnudas hasta potencia digital de 40 kW, fabricado según sus especificaciones con CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'Explore nuestros productos',
  },
  de: {
    title: 'Unternehmensvideo',
    subtitle: 'Inside RisunicPower — Zwei Werke, ein Standard',
    intro: 'Erleben Sie in zwei Minuten unsere Standorte in Huizhou und Vietnam: automatisierte SMT-Linien, Einbrenntests und die über 80 Ingenieure hinter jedem Wechselrichter, ESS und jeder Leistungsstufe, die wir ausliefern.',
    points: [
      { h: '80,000 m² firmeneigener Standort', p: 'Zwei vollständig firmeneigene Werke in Huizhou (China) und Vietnam mit einer monatlichen Produktion von 300,000+ Einheiten.' },
      { h: '75%+ Automatisierung', p: 'Automatisierte SMT-Linien mit 180 Millionen Punkten/Monat und Qualitätskontrolle über den gesamten Prozess.' },
      { h: '80+ F&E-Ingenieure', p: 'Eigene DSP-Regelung, Leistungsstufen und Firmware — 8%+ des Umsatzes werden wieder in F&E investiert.' },
      { h: 'OEM / ODM-Partner', p: 'Von unbestückten Leiterplatten bis zu 40 kW digitaler Leistungselektronik — gefertigt nach Ihren Spezifikationen mit CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'Entdecken Sie unsere Produkte',
  },
  fr: {
    title: "Vidéo d'entreprise",
    subtitle: 'Au cœur de RisunicPower — Deux usines, une même exigence',
    intro: "Découvrez en deux minutes nos sites de Huizhou et du Vietnam : lignes SMT automatisées, essais de vieillissement accéléré et les plus de 80 ingénieurs à l'origine de chaque onduleur, ESS et étage de puissance que nous expédions.",
    points: [
      { h: 'Site de 80,000 m² en propriété', p: 'Deux usines entièrement détenues à Huizhou (Chine) et au Vietnam, produisant plus de 300,000 unités par mois.' },
      { h: "Plus de 75 % d'automatisation", p: "Lignes SMT automatisées avec 180 millions de points/mois et contrôle qualité sur l'ensemble du processus." },
      { h: 'Plus de 80 ingénieurs R&D', p: "Contrôle DSP, étages de puissance et firmware développés en interne — plus de 8 % du chiffre d'affaires réinvesti en R&D." },
      { h: 'Partenaire OEM / ODM', p: "Des cartes nues à l'alimentation numérique 40 kW, conçues selon vos spécifications avec CE/CB/UL/EN 50549-1." },
    ],
    cta: 'Découvrez nos produits',
  },
  pt: {
    title: 'Vídeo da Empresa',
    subtitle: 'Por Dentro da RisunicPower — Duas Fábricas, Um Só Padrão',
    intro: 'Faça um tour de dois minutos pelas nossas instalações em Huizhou e no Vietnã: linhas SMT automatizadas, testes de burn-in e os mais de 80 engenheiros por trás de cada inversor, ESS e estágio de potência que fornecemos.',
    points: [
      { h: 'Instalações Próprias de 80,000 m²', p: 'Duas fábricas totalmente próprias em Huizhou (China) e no Vietnã, produzindo mais de 300,000 unidades mensalmente.' },
      { h: 'Mais de 75% de Automação', p: 'Linhas SMT automatizadas com 180 milhões de pontos/mês e controle de qualidade em todo o processo.' },
      { h: 'Mais de 80 Engenheiros de P&D', p: 'Controle DSP, estágios de potência e firmware desenvolvidos internamente — mais de 8% da receita reinvestida em P&D.' },
      { h: 'Parceiro OEM / ODM', p: 'De placas sem componentes a potência digital de 40 kW, fabricados conforme as suas especificações com CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'Explore Nossos Produtos',
  },
  ar: {
    title: 'فيديو الشركة',
    subtitle: 'داخل RisunicPower — مصنعان، معيار واحد',
    intro: 'انطلق في جولة لمدة دقيقتين داخل مجمعاتنا في Huizhou وفيتنام: خطوط SMT المؤتمتة، واختبارات التشغيل الإجهادي، وأكثر من 80 مهندسًا يقفون وراء كل عاكس، ونظام ESS، ومرحلة قدرة نقوم بشحنها.',
    points: [
      { h: 'مجمع مملوك بمساحة 80,000 m²', p: 'مصنعان مملوكان بالكامل في Huizhou (الصين) وفيتنام، بإنتاج شهري يتجاوز 300,000 وحدة.' },
      { h: 'أتمتة بنسبة 75%+', p: 'خطوط SMT مؤتمتة بسعة 180 مليون نقطة/شهر، مع مراقبة جودة شاملة لكامل العملية.' },
      { h: 'أكثر من 80 مهندسًا للبحث والتطوير', p: 'تحكم DSP، ومراحل قدرة، وبرامج ثابتة مطوّرة داخليًا — مع إعادة استثمار 8%+ من الإيرادات في البحث والتطوير.' },
      { h: 'شريك OEM / ODM', p: 'من اللوحات المجردة إلى القدرة الرقمية بقدرة 40 kW، نصنّع وفق مواصفاتك مع CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'استكشف منتجاتنا',
  },
  ru: {
    title: 'Видео о компании',
    subtitle: 'Внутри RisunicPower — два завода, единый стандарт',
    intro: 'Совершите двухминутную экскурсию по нашим производственным площадкам в Хуэйчжоу и Вьетнаме: автоматизированные SMT-линии, испытания на приработку и более 80 инженеров, стоящих за каждым поставляемым нами инвертором, ESS и силовым каскадом.',
    points: [
      { h: 'Собственная производственная площадка 80,000 m²', p: 'Два полностью принадлежащих компании завода в Хуэйчжоу (Китай) и Вьетнаме с ежемесячным выпуском более 300,000 единиц продукции.' },
      { h: 'Автоматизация более 75%', p: 'Автоматизированные SMT-линии с производительностью 180 миллионов точек/месяц и контролем качества на всех этапах производства.' },
      { h: 'Более 80 инженеров R&D', p: 'Собственные системы управления на базе DSP, силовые каскады и firmware — более 8% выручки реинвестируется в R&D.' },
      { h: 'OEM / ODM-партнёр', p: 'От неоснащённых печатных плат до цифровых систем электропитания 40 kW — производство по вашим спецификациям с CE/CB/UL/EN 50549-1.' },
    ],
    cta: 'Ознакомьтесь с нашей продукцией',
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
