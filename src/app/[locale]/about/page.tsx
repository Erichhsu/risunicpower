import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

const metadataMap: Record<string, { title: string; desc: string }> = {
  en: { title: 'About Us — RisunicPower', desc: 'Shenzhen Risunic Technology — 12+ years of power manufacturing excellence' },
  zh: { title: '关于我们 — RisunicPower', desc: '晨旭通科技 — 12年电源制造经验，服务全球60+国家' },
  ja: { title: '当社について — RisunicPower', desc: '晨旭通科技 — 12年の電源製造実績、世界60カ国以上にサービス提供' },
  es: { title: 'Acerca de — RisunicPower', desc: 'Shenzhen Risunic Technology — Más de 12 años de excelencia en fabricación de fuentes de alimentación' },
  de: { title: 'Über uns — RisunicPower', desc: 'Shenzhen Risunic Technology — Über 12 Jahre Exzellenz in der Stromversorgungsfertigung' },
  fr: { title: 'À Propos — RisunicPower', desc: 'Shenzhen Risunic Technology — Plus de 12 ans d\'excellence dans la fabrication d\'alimentations' },
  pt: { title: 'Sobre — RisunicPower', desc: 'Shenzhen Risunic Technology — Mais de 12 anos de excelência em fabricação de fontes de alimentação' },
  ar: { title: 'عن — RisunicPower', desc: 'Shenzhen Risunic Technology — أكثر من 12 عامًا من التميز في تصنيع مصادر الطاقة' },
  ru: { title: 'О компании — RisunicPower', desc: 'Shenzhen Risunic Technology — Более 12 лет совершенства в производстве источников питания' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = SUPPORTED_LOCALES.includes(locale) ? locale : 'en'
  const t = metadataMap[l]
  return { title: t.title, description: t.desc }
}

interface PhotoItem {
  src: string
  caption_en: string
  caption_zh: string
  caption_ja: string
  caption_es: string
  caption_de: string
  caption_fr: string
  caption_pt: string
  caption_ar: string
  caption_ru: string
}

const photos: PhotoItem[] = [
  { src: '/images/factory/huizhou-factory.jpg', caption_en: 'Huizhou Manufacturing Base', caption_zh: '惠州生产基地', caption_ja: '恵州製造拠点', caption_es: 'Huizhou Manufacturing Base', caption_de: 'Huizhou Manufacturing Base', caption_fr: 'Huizhou Manufacturing Base', caption_pt: 'Huizhou Manufacturing Base', caption_ar: 'Huizhou Manufacturing Base', caption_ru: 'Huizhou Manufacturing Base' },
  { src: '/images/factory/vietnam-factory-2.webp', caption_en: 'Vietnam Production Facility', caption_zh: '越南生产工厂', caption_ja: 'ベトナム生産拠点', caption_es: 'Vietnam Production Facility', caption_de: 'Vietnam Production Facility', caption_fr: 'Vietnam Production Facility', caption_pt: 'Vietnam Production Facility', caption_ar: 'Vietnam Production Facility', caption_ru: 'Vietnam Production Facility' },
  { src: '/images/factory/factory-showroom.jpg', caption_en: 'Factory Showroom', caption_zh: '工厂展厅', caption_ja: '工場ショールーム', caption_es: 'Factory Showroom', caption_de: 'Factory Showroom', caption_fr: 'Factory Showroom', caption_pt: 'Factory Showroom', caption_ar: 'Factory Showroom', caption_ru: 'Factory Showroom' },
  { src: '/images/why-us/custom-power-design.webp', caption_en: 'Custom Power Design', caption_zh: '定制电源设计', caption_ja: 'カスタム電源設計', caption_es: 'Custom Power Design', caption_de: 'Custom Power Design', caption_fr: 'Custom Power Design', caption_pt: 'Custom Power Design', caption_ar: 'Custom Power Design', caption_ru: 'Custom Power Design' },
  { src: '/images/why-us/global-certifications.jpg', caption_en: 'Global Certifications', caption_zh: '全球认证合规', caption_ja: 'グローバル認証', caption_es: 'Global Certifications', caption_de: 'Global Certifications', caption_fr: 'Global Certifications', caption_pt: 'Global Certifications', caption_ar: 'Global Certifications', caption_ru: 'Global Certifications' },
  { src: '/images/why-us/fast-delivery-system.jpg', caption_en: 'Fast Delivery System', caption_zh: '快速交付体系', caption_ja: '迅速な納品体制', caption_es: 'Fast Delivery System', caption_de: 'Fast Delivery System', caption_fr: 'Fast Delivery System', caption_pt: 'Fast Delivery System', caption_ar: 'Fast Delivery System', caption_ru: 'Fast Delivery System' },
]

const dataMap: Record<string, {
  title: string
  subtitle: string
  story: { h: string; p: string }
  capability: { h: string; p: string }
  portfolio: { h: string; p: string }
  quality: { h: string; p: string }
  cta: string
  timelineHeading: string
  timeline: { year: string; text: string }[]
}> = {
  en: {
    title: 'About RisunicPower',
    subtitle: '12+ Years of Power Electronics Excellence · Serving 600+ Clients Worldwide',
    story: { h: 'Our Story', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) was founded in 2014, specializing in R&D, manufacturing, and sales of power solutions. Headquartered in Shenzhen with a 12,000m² production base and a Vietnam facility, we produce over 5 million units annually. Certified to CE, FCC, UL, RoHS, and ISO 9001, we export to 30+ countries worldwide.' },
    capability: { h: 'Core Capabilities', p: '80+ R&D Engineers | EMC Lab + Environmental Test Chambers | Automated SMT Lines | Full-Process QC | 24-Hour Tech Response' },
    portfolio: { h: 'Nine Product Lines', p: 'PoE Power Supplies · Adapters · Bare Board Power · UPS · Inverters · Portable Power · All-in-One ESS · Micro Inverters · MPPT Controllers' },
    quality: { h: 'Quality Promise', p: 'Full-process quality control from component selection to shipment. Every product undergoes burn-in testing and reliability validation. Lifecycle technical support included.' },
    cta: 'Contact us for a product catalog and quotation',
    timelineHeading: 'Milestones',
    timeline: [
      { year: '2014', text: 'Founded in Shenzhen, focused on power supply R&D' },
      { year: '2016', text: 'ISO 9001 quality management certification' },
      { year: '2016', text: 'Huizhou manufacturing base begins operations' },
      { year: '2020', text: 'Expanded into energy storage and inverters' },
      { year: '2024', text: 'Vietnam factory launched for global expansion' },
      { year: '2026', text: 'RisunicPower global brand unveiled' },
    ],
  },
  zh: {
    title: '关于晨旭通科技',
    subtitle: '12年专注电源研发与制造 · 服务全球600+客户',
    story: { h: '我们的故事', p: '深圳市晨旭通科技股份有限公司（RisunicPower）成立于2014年，是一家专注于电源解决方案研发、生产和销售的科技企业。公司总部位于中国深圳，拥有12000㎡的生产基地和越南海外工厂，年产能超过500万台电源产品。产品通过CE、FCC、UL、RoHS、ISO 9001等国际认证，远销全球30多个国家和地区。' },
    capability: { h: '核心能力', p: '80+研发工程师 | EMC实验室 + 环境试验室 | 自动化SMT产线 | 全流程质量管控 | 24小时技术响应' },
    portfolio: { h: '九大产品线', p: 'PoE电源 · UPS · 逆变器整机 · 裂相机 · 后备机 · 便携储能 · 一体机 · 微型逆变器 · MPPT控制器' },
    quality: { h: '质量承诺', p: '从物料选型到成品出货全流程控制。所有产品经老化测试和可靠性验证。提供全生命周期技术支持。' },
    cta: '联系我们获取产品目录和报价',
    timelineHeading: '发展里程碑',
    timeline: [
      { year: '2014', text: '深圳公司成立，专注电源研发' },
      { year: '2016', text: '通过ISO 9001质量管理体系认证' },
      { year: '2016', text: '惠州生产基地投产，产能翻倍' },
      { year: '2020', text: '产品线扩展至储能和逆变器领域' },
      { year: '2024', text: '越南工厂投产，全球化布局加速' },
      { year: '2026', text: '推出RisunicPower全球品牌' },
    ],
  },
  ja: {
    title: '当社について',
    subtitle: '12年の電源開発・製造実績 · 世界600社以上に提供',
    story: { h: '私たちのストーリー', p: '深セン市晨旭通科技股份有限公司（RisunicPower）は2014年に設立され、電源ソリューションの研究開発、製造、販売に特化した企業です。本社は中国深セン、12,000㎡の生産拠点とベトナム工場を有し、年間500万台以上を生産。CE、FCC、UL、RoHS、ISO 9001等の認証を取得し、世界30カ国以上に輸出しています。' },
    capability: { h: 'コア技術', p: '80名以上の研究開発エンジニア | EMCラボ + 環境試験室 | 自動化SMTライン | 全工程品質管理 | 24時間技術サポート' },
    portfolio: { h: '9つの製品ライン', p: 'PoE電源 · UPS · インバーター · 分割相 · バックアップ · ポータブル電源 · 一体型 · マイクロインバーター · MPPT' },
    quality: { h: '品質への取り組み', p: '材料選定から出荷まで全工程の品質管理。全製品エージングテストと信頼性検証実施。製品ライフサイクル全体の技術サポートを提供。' },
    cta: '製品カタログと見積もりについてはお問い合わせください',
    timelineHeading: '沿革',
    timeline: [
      { year: '2014', text: '深センに創業、電源開発に特化' },
      { year: '2016', text: 'ISO 9001品質マネジメント認証取得' },
      { year: '2016', text: '恵州生産拠点稼働、生産能力倍増' },
      { year: '2020', text: '蓄電・インバーター分野に製品拡大' },
      { year: '2024', text: 'ベトナム工場稼働、グローバル展開加速' },
      { year: '2026', text: 'RisunicPowerグローバルブランド発表' },
    ],
  },
  es: {
    title: 'Acerca de RisunicPower',
    subtitle: 'Más de 12 años de excelencia en electrónica de potencia · 600+ clientes en todo el mundo',
    story: { h: 'Nuestra Historia', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) se fundó en 2014, especializándose en I+D, fabricación y venta de soluciones de alimentación. Con sede en Shenzhen, contamos con una base de producción de 12.000 m² y una fábrica en Vietnam, produciendo más de 5 millones de unidades al año. Certificados CE, FCC, UL, RoHS e ISO 9001, exportamos a más de 30 países.' },
    capability: { h: 'Capacidades Clave', p: 'Más de 80 ingenieros de I+D | Laboratorio EMC + Cámaras de pruebas ambientales | Líneas SMT automatizadas | Control de calidad integral | Soporte técnico 24 horas' },
    portfolio: { h: 'Nueve Líneas de Productos', p: 'Fuentes PoE · Adaptadores · Fuentes de bastidor abierto · UPS · Inversores · Energía portátil · ESS todo en uno · Microinversores · Controladores MPPT' },
    quality: { h: 'Compromiso de Calidad', p: 'Control de calidad integral desde la selección de componentes hasta el envío. Cada producto se somete a pruebas de envejecimiento y validación de fiabilidad. Soporte técnico de por vida incluido.' },
    cta: 'Contáctenos para obtener un catálogo de productos y cotización',
    timelineHeading: 'Hitos',
    timeline: [
      { year: '2014', text: 'Fundada en Shenzhen, enfocada en I+D de fuentes de alimentación' },
      { year: '2016', text: 'Certificación de gestión de calidad ISO 9001' },
      { year: '2016', text: 'Inicio de operaciones de la base de fabricación de Huizhou' },
      { year: '2020', text: 'Expansión a almacenamiento de energía e inversores' },
      { year: '2024', text: 'Lanzamiento de la fábrica en Vietnam para expansión global' },
      { year: '2026', text: 'Presentación de la marca global RisunicPower' },
    ],
  },
  de: {
    title: 'Über RisunicPower',
    subtitle: 'Über 12 Jahre Exzellenz in Leistungselektronik · 600+ Kunden weltweit',
    story: { h: 'Unsere Geschichte', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) wurde 2014 gegründet und ist auf F&E, Herstellung und Vertrieb von Stromversorgungslösungen spezialisiert. Mit Hauptsitz in Shenzhen, einer 12.000 m² großen Produktionsstätte und einem Werk in Vietnam produzieren wir über 5 Millionen Einheiten pro Jahr. Zertifiziert nach CE, FCC, UL, RoHS und ISO 9001 exportieren wir in über 30 Länder.' },
    capability: { h: 'Kernkompetenzen', p: 'Über 80 F&E-Ingenieure | EMV-Labor + Umweltprüfkammern | Automatisierte SMT-Linien | Vollständige Qualitätskontrolle | 24-Stunden technischer Support' },
    portfolio: { h: 'Neun Produktlinien', p: 'PoE-Netzteile · Adapter · Open-Frame-Netzteile · USV · Wechselrichter · Portable Stromversorgung · All-in-One ESS · Mikro-Wechselrichter · MPPT-Controller' },
    quality: { h: 'Qualitätsversprechen', p: 'Vollständige Qualitätskontrolle von der Komponentenauswahl bis zur Auslieferung. Jedes Produkt durchläuft Einbrenntests und Zuverlässigkeitsvalidierung. Lebenslanger technischer Support inklusive.' },
    cta: 'Kontaktieren Sie uns für einen Produktkatalog und ein Angebot',
    timelineHeading: 'Meilensteine',
    timeline: [
      { year: '2014', text: 'In Shenzhen gegründet, Fokus auf F&E für Stromversorgungen' },
      { year: '2016', text: 'ISO 9001 Qualitätsmanagement-Zertifizierung' },
      { year: '2016', text: 'Produktionsstätte in Huizhou nimmt Betrieb auf' },
      { year: '2020', text: 'Erweiterung auf Energiespeicher und Wechselrichter' },
      { year: '2024', text: 'Werk in Vietnam für globale Expansion eröffnet' },
      { year: '2026', text: 'Globale Marke RisunicPower vorgestellt' },
    ],
  },
  fr: {
    title: 'À Propos de RisunicPower',
    subtitle: 'Plus de 12 ans d\'excellence en électronique de puissance · Plus de 600 clients dans le monde',
    story: { h: 'Notre Histoire', p: 'Shenzhen Risunic Technology Co., Ltd. (RisunicPower) a été fondée en 2014, spécialisée dans la R&D, la fabrication et la vente de solutions d\'alimentation. Basée à Shenzhen avec une usine de 12 000 m² et une installation au Vietnam, nous produisons plus de 5 millions d\'unités par an. Certifiés CE, FCC, UL, RoHS et ISO 9001, nous exportons dans plus de 30 pays.' },
    capability: { h: 'Compétences Clés', p: 'Plus de 80 ingénieurs R&D | Laboratoire CEM + Chambres d\'essais environnementaux | Lignes SMT automatisées | Contrôle qualité intégral | Support technique 24h/24' },
    portfolio: { h: 'Neuf Gammes de Produits', p: 'Alimentations PoE · Adaptateurs · Alimentations cadre ouvert · UPS · Onduleurs · Énergie portable · ESS tout-en-un · Micro-onduleurs · Contrôleurs MPPT' },
    quality: { h: 'Engagement Qualité', p: 'Contrôle qualité complet de la sélection des composants à l\'expédition. Chaque produit subit des tests de rodage et de validation de fiabilité. Support technique à vie inclus.' },
    cta: 'Contactez-nous pour un catalogue produit et un devis',
    timelineHeading: 'Jalons',
    timeline: [
      { year: '2014', text: 'Fondée à Shenzhen, axée sur la R&D en alimentation' },
      { year: '2016', text: 'Certification de management de la qualité ISO 9001' },
      { year: '2016', text: 'Démarrage de la base de fabrication de Huizhou' },
      { year: '2020', text: 'Expansion vers le stockage d\'énergie et les onduleurs' },
      { year: '2024', text: 'Lancement de l\'usine au Vietnam pour l\'expansion mondiale' },
      { year: '2026', text: 'Dévoilement de la marque mondiale RisunicPower' },
    ],
  },
  pt: {
    title: 'Sobre a RisunicPower',
    subtitle: 'Mais de 12 anos de excelência em eletrônica de potência · Mais de 600 clientes no mundo',
    story: { h: 'Nossa História', p: 'A Shenzhen Risunic Technology Co., Ltd. (RisunicPower) foi fundada em 2014, especializada em P&D, fabricação e venda de soluções de energia. Com sede em Shenzhen, uma base de produção de 12.000 m² e uma fábrica no Vietnã, produzimos mais de 5 milhões de unidades por ano. Certificados CE, FCC, UL, RoHS e ISO 9001, exportamos para mais de 30 países.' },
    capability: { h: 'Competências Chave', p: 'Mais de 80 engenheiros de P&D | Laboratório EMC + Câmaras de teste ambiental | Linhas SMT automatizadas | Controle de qualidade completo | Suporte técnico 24 horas' },
    portfolio: { h: 'Nove Linhas de Produtos', p: 'Fontes PoE · Adaptadores · Fontes de quadro aberto · UPS · Inversores · Energia portátil · ESS tudo-em-um · Microinversores · Controladores MPPT' },
    quality: { h: 'Compromisso de Qualidade', p: 'Controle de qualidade completo da seleção de componentes ao envio. Cada produto passa por testes de burn-in e validação de confiabilidade. Suporte técnico vitalício incluído.' },
    cta: 'Entre em contato para catálogo de produtos e cotação',
    timelineHeading: 'Marcos',
    timeline: [
      { year: '2014', text: 'Fundada em Shenzhen, focada em P&D de fontes de alimentação' },
      { year: '2016', text: 'Certificação de gestão de qualidade ISO 9001' },
      { year: '2016', text: 'Início das operações da base de fabricação de Huizhou' },
      { year: '2020', text: 'Expansão para armazenamento de energia e inversores' },
      { year: '2024', text: 'Fábrica no Vietnã lançada para expansão global' },
      { year: '2026', text: 'Marca global RisunicPower revelada' },
    ],
  },
  ar: {
    title: 'عن RisunicPower',
    subtitle: 'أكثر من 12 عامًا من التميز في إلكترونيات الطاقة · أكثر من 600 عميل حول العالم',
    story: { h: 'قصتنا', p: 'تأسست شركة Shenzhen Risunic Technology Co., Ltd. (RisunicPower) في عام 2014، وهي متخصصة في البحث والتطوير والتصنيع والمبيعات لحلول الطاقة. يقع مقرنا الرئيسي في شنتشن مع قاعدة إنتاج تبلغ مساحتها 12,000 متر مربع ومصنع في فيتنام، وننتج أكثر من 5 ملايين وحدة سنويًا. حاصلون على شهادات CE وFCC وUL وRoHS وISO 9001، ونصدر إلى أكثر من 30 دولة.' },
    capability: { h: 'القدرات الأساسية', p: 'أكثر من 80 مهندس بحث وتطوير | مختبر EMC + غرف اختبار بيئي | خطوط SMT آلية | مراقبة جودة شاملة | دعم فني على مدار الساعة' },
    portfolio: { h: 'تسع خطوط إنتاج', p: 'مزودات طاقة PoE · محولات · مزودات طاقة مفتوحة الإطار · UPS · محولات · طاقة محمولة · أنظمة شاملة · محولات دقيقة · متحكمات MPPT' },
    quality: { h: 'التزام الجودة', p: 'مراقبة جودة شاملة من اختيار المكونات إلى الشحن. يخضع كل منتج لاختبارات التقادم والتحقق من الموثوقية. دعم فني مدى الحياة مشمول.' },
    cta: 'اتصل بنا للحصول على كتالوج المنتجات وعرض الأسعار',
    timelineHeading: 'المعالم',
    timeline: [
      { year: '2014', text: 'تأسست في شنتشن، مع التركيز على البحث والتطوير في مجال مصادر الطاقة' },
      { year: '2016', text: 'شهادة إدارة الجودة ISO 9001' },
      { year: '2016', text: 'بدء تشغيل قاعدة التصنيع في هويتشو' },
      { year: '2020', text: 'التوسع في تخزين الطاقة والمحولات' },
      { year: '2024', text: 'إطلاق مصنع فيتنام للتوسع العالمي' },
      { year: '2026', text: 'الكشف عن العلامة التجارية العالمية RisunicPower' },
    ],
  },
  ru: {
    title: 'О RisunicPower',
    subtitle: 'Более 12 лет совершенства в силовой электронике · Более 600 клиентов по всему миру',
    story: { h: 'Наша История', p: 'Компания Shenzhen Risunic Technology Co., Ltd. (RisunicPower) основана в 2014 году и специализируется на исследованиях, разработке, производстве и продаже решений в области электропитания. Штаб-квартира в Шэньчжэне, производственная база площадью 12 000 м² и завод во Вьетнаме позволяют выпускать более 5 миллионов единиц продукции в год. Сертифицированы по CE, FCC, UL, RoHS и ISO 9001, экспортируем в более чем 30 стран.' },
    capability: { h: 'Ключевые Возможности', p: 'Более 80 инженеров-разработчиков | Лаборатория ЭМС + камеры экологических испытаний | Автоматизированные линии SMT | Комплексный контроль качества | Техподдержка 24/7' },
    portfolio: { h: 'Девять Линеек Продукции', p: 'Источники питания PoE · Адаптеры · Открытые источники питания · ИБП · Инверторы · Портативные источники · Комплексные системы · Микроинверторы · MPPT-контроллеры' },
    quality: { h: 'Обязательства по Качеству', p: 'Комплексный контроль качества от выбора компонентов до отгрузки. Каждый продукт проходит испытания на приработку и проверку надёжности. Пожизненная техническая поддержка включена.' },
    cta: 'Свяжитесь с нами для получения каталога продукции и коммерческого предложения',
    timelineHeading: 'Вехи',
    timeline: [
      { year: '2014', text: 'Основана в Шэньчжэне, специализация на НИОКР источников питания' },
      { year: '2016', text: 'Сертификация системы менеджмента качества ISO 9001' },
      { year: '2016', text: 'Начало работы производственной базы в Хуэйчжоу' },
      { year: '2020', text: 'Расширение в области накопления энергии и инверторов' },
      { year: '2024', text: 'Запуск завода во Вьетнаме для глобальной экспансии' },
      { year: '2026', text: 'Представление глобального бренда RisunicPower' },
    ],
  },
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
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

      {/* ── 3×2 Photo Grid ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {photos.map((photo, i) => {
              const captionKey = `caption_${l}` as keyof PhotoItem
              const caption = (photo[captionKey] as string) || photo.caption_en
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
          <h2 className="text-center text-[2.4rem] font-bold text-[#0E4071] mb-12">{data.timelineHeading}</h2>
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
