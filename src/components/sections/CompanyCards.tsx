'use client'

import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp, Send, Award, ShieldCheck, Globe, Zap, Clock } from 'lucide-react'

type Lang = 'en'|'zh'|'ja'|'es'|'de'|'fr'|'pt'|'ar'|'ru'
const L: Lang[] = ['en','zh','ja','es','de','fr','pt','ar','ru']

function pick(r: Record<string, string>, l: string): string {
  return r[l] || r.en
}

// ── TABS ──────────────────────────────────────────
const TABS: Record<string, Record<Lang, string>> = {
  profile: { en:'Company Profile', zh:'公司简介', ja:'会社概要', es:'Perfil de la Empresa', de:'Unternehmensprofil', fr:'Profil de l\'Entreprise', pt:'Perfil da Empresa', ar:'ملف الشركة', ru:'Профиль компании' },
  history: { en:'History', zh:'发展历程', ja:'沿革', es:'Historia', de:'Geschichte', fr:'Histoire', pt:'História', ar:'التاريخ', ru:'История' },
  quality: { en:'Quality Promise', zh:'质量承诺', ja:'品質保証', es:'Compromiso de Calidad', de:'Qualitätsversprechen', fr:'Engagement Qualité', pt:'Compromisso de Qualidade', ar:'التزام الجودة', ru:'Обязательства по качеству' },
  partners:{ en:'Global Partners', zh:'合作伙伴', ja:'パートナー', es:'Socios Globales', de:'Globale Partner', fr:'Partenaires Mondiaux', pt:'Parceiros Globais', ar:'شركاء عالميون', ru:'Глобальные партнёры' },
  careers: { en:'Careers', zh:'人才招聘', ja:'採用情報', es:'Carreras', de:'Karriere', fr:'Carrières', pt:'Carreiras', ar:'وظائف', ru:'Карьера' },
}

// ── MILESTONES ────────────────────────────────────
const MILESTONES = [
  {year:'2014', en:'Founded in Shenzhen, focused on POE power supply R&D', zh:'深圳光明总部成立，专注POE电源研发', ja:'深セン光明本社設立、POE電源研究開発に注力', es:'Fundada en Shenzhen, enfocada en I+D de fuentes de alimentación POE', de:'In Shenzhen gegründet, Fokus auf POE-Netzteil-F&E', fr:'Fondée à Shenzhen, axée sur la R&D en alimentation POE', pt:'Fundada em Shenzhen, focada em P&D de fontes POE', ar:'تأسست في شنتشن، مع التركيز على البحث والتطوير في مصادر طاقة POE', ru:'Основана в Шэньчжэне, специализация на НИОКР POE-источников'},
  {year:'2016', en:'ISO 9001:2015 certified', zh:'通过ISO 9001质量管理体系认证', ja:'ISO 9001:2015認証取得', es:'Certificación ISO 9001:2015', de:'ISO 9001:2015 zertifiziert', fr:'Certifié ISO 9001:2015', pt:'Certificação ISO 9001:2015', ar:'حاصلة على شهادة ISO 9001:2015', ru:'Сертифицирована по ISO 9001:2015'},
  {year:'2018', en:'Huizhou factory opened, capacity exceeded 1M units/year', zh:'惠州生产基地投产，年产能突破100万台', ja:'惠州生産拠点稼働開始、年間生産能力100万台突破', es:'Fábrica de Huizhou inaugurada, capacidad superior a 1M unidades/año', de:'Werk in Huizhou eröffnet, Kapazität über 1 Mio. Einheiten/Jahr', fr:'Usine de Huizhou inaugurée, capacité dépassant 1M d\'unités/an', pt:'Fábrica de Huizhou inaugurada, capacidade superior a 1M unidades/ano', ar:'افتتاح مصنع هويتشو، بطاقة تتجاوز مليون وحدة سنويًا', ru:'Завод в Хуэйчжоу запущен, мощность более 1 млн единиц/год'},
  {year:'2020', en:'Recognized as National High-Tech Enterprise', zh:'通过国家高新技术企业认定', ja:'国家ハイテク企業認定取得', es:'Reconocida como Empresa Nacional de Alta Tecnología', de:'Als nationales Hightech-Unternehmen anerkannt', fr:'Reconnue comme Entreprise Nationale de Haute Technologie', pt:'Reconhecida como Empresa Nacional de Alta Tecnologia', ar:'مُعترف بها كمؤسسة وطنية للتكنولوجيا الفائقة', ru:'Признана национальным высокотехнологичным предприятием'},
  {year:'2021', en:'Expanded into UPS, inverter, energy storage', zh:'产品线扩展至UPS、逆变器、储能', ja:'UPS、インバーター、蓄電システムへ製品ライン拡大', es:'Expansión a UPS, inversores, almacenamiento de energía', de:'Erweiterung auf USV, Wechselrichter, Energiespeicher', fr:'Expansion vers UPS, onduleurs, stockage d\'énergie', pt:'Expansão para UPS, inversores, armazenamento de energia', ar:'التوسع في UPS والمحولات وتخزين الطاقة', ru:'Расширение на ИБП, инверторы, накопители энергии'},
  {year:'2022', en:'Recognized as SRDI enterprise; R&D team 50+', zh:'获专精特新企业认定，研发团队突破50人', ja:'専精特新企業認定、研究開発チーム50名突破', es:'Reconocida como empresa SRDI; equipo de I+D 50+', de:'Als SRDI-Unternehmen anerkannt; F&E-Team 50+', fr:'Reconnue comme entreprise SRDI; équipe R&D 50+', pt:'Reconhecida como empresa SRDI; equipe de P&D 50+', ar:'مُعترف بها كمؤسسة SRDI؛ فريق بحث وتطوير 50+', ru:'Признана предприятием SRDI; команда НИОКР 50+'},
  {year:'2023', en:'Vietnam factory launched; 3M+ annual capacity', zh:'越南生产基地投产，年产能突破300万台', ja:'ベトナム生産拠点稼働、年間生産能力300万台突破', es:'Fábrica de Vietnam lanzada; capacidad anual de 3M+', de:'Werk in Vietnam gestartet; 3 Mio.+ Jahreskapazität', fr:'Usine au Vietnam lancée; capacité annuelle de 3M+', pt:'Fábrica no Vietnã lançada; capacidade anual de 3M+', ar:'إطلاق مصنع فيتنام؛ بطاقة سنوية تتجاوز 3 ملايين', ru:'Завод во Вьетнаме запущен; мощность 3 млн+/год'},
  {year:'2024', en:'80+ R&D engineers; 300+ global customers', zh:'研发团队80+人，全球服务300+客户', ja:'研究開発チーム80名以上、世界300社以上にサービス提供', es:'80+ ingenieros de I+D; 300+ clientes globales', de:'80+ F&E-Ingenieure; 300+ globale Kunden', fr:'80+ ingénieurs R&D; 300+ clients mondiaux', pt:'80+ engenheiros de P&D; 300+ clientes globais', ar:'80+ مهندس بحث وتطوير؛ 300+ عميل عالمي', ru:'80+ инженеров НИОКР; 300+ клиентов в мире'},
  {year:'2025', en:'RMB 510M revenue; serving 10+ Fortune 500', zh:'年销售额5.1亿元，服务10+世界500强企业', ja:'年間売上高5.1億元、フォーチュン500企業10社以上と取引', es:'Ingresos de 510M RMB; sirviendo a 10+ Fortune 500', de:'510 Mio. RMB Umsatz; 10+ Fortune 500 Kunden', fr:'510M RMB de revenus; service à 10+ Fortune 500', pt:'Receita de 510M RMB; atendendo 10+ Fortune 500', ar:'إيرادات 510 مليون يوان؛ خدمة 10+ من فورتشن 500', ru:'Выручка 510 млн юаней; обслуживание 10+ Fortune 500'},
]

// ── QUALITY_ITEMS ────────────────────────────────
const QUALITY_ITEMS = [
  { en:'ISO 9001:2015 Quality Management', zh:'ISO 9001:2015质量管理体系', ja:'ISO 9001:2015 品質マネジメントシステム', es:'Gestión de Calidad ISO 9001:2015', de:'ISO 9001:2015 Qualitätsmanagement', fr:'Management de la Qualité ISO 9001:2015', pt:'Gestão da Qualidade ISO 9001:2015', ar:'إدارة الجودة ISO 9001:2015', ru:'Менеджмент качества ISO 9001:2015', icon:<CheckCircle size={20}/> },
  { en:'ISO 14001:2015 Environmental Management', zh:'ISO 14001:2015环境管理体系', ja:'ISO 14001:2015 環境マネジメントシステム', es:'Gestión Ambiental ISO 14001:2015', de:'ISO 14001:2015 Umweltmanagement', fr:'Management Environnemental ISO 14001:2015', pt:'Gestão Ambiental ISO 14001:2015', ar:'الإدارة البيئية ISO 14001:2015', ru:'Экологический менеджмент ISO 14001:2015', icon:<CheckCircle size={20}/> },
  { en:'National High-Tech Enterprise', zh:'国家高新技术企业', ja:'国家ハイテク企業', es:'Empresa Nacional de Alta Tecnología', de:'Nationales Hightech-Unternehmen', fr:'Entreprise Nationale de Haute Technologie', pt:'Empresa Nacional de Alta Tecnologia', ar:'مؤسسة وطنية للتكنولوجيا الفائقة', ru:'Национальное высокотехнологичное предприятие', icon:<Award size={20}/> },
  { en:'Specialized & Innovative Enterprise', zh:'专精特新企业', ja:'専精特新企業', es:'Empresa Especializada e Innovadora', de:'Spezialisiertes & Innovatives Unternehmen', fr:'Entreprise Spécialisée et Innovante', pt:'Empresa Especializada e Inovadora', ar:'مؤسسة متخصصة ومبتكرة', ru:'Специализированное инновационное предприятие', icon:<Award size={20}/> },
  { en:'$2M product liability insurance per shipment', zh:'每批出货附200万美元产品责任险', ja:'出荷ごとに200万ドルの製造物責任保険付き', es:'Seguro de responsabilidad de $2M por envío', de:'2 Mio. $ Produkthaftpflicht pro Lieferung', fr:'Assurance responsabilité produit de 2M$ par expédition', pt:'Seguro de responsabilidade de $2M por remessa', ar:'تأمين مسؤولية المنتج بقيمة 2 مليون دولار لكل شحنة', ru:'Страхование ответственности $2M за партию', icon:<ShieldCheck size={20}/> },
  { en:'Certifications in 30+ countries', zh:'产品认证覆盖全球30+国家', ja:'世界30カ国以上で認証取得', es:'Certificaciones en más de 30 países', de:'Zertifizierungen in über 30 Ländern', fr:'Certifications dans plus de 30 pays', pt:'Certificações em mais de 30 países', ar:'شهادات في أكثر من 30 دولة', ru:'Сертификация в 30+ странах', icon:<Globe size={20}/> },
  { en:'Full DQA lab: EMC, safety, environmental, HALT', zh:'DQA实验室：EMC/安规/环境/HALT全能力', ja:'DQAラボ：EMC/安全規格/環境/HALT全対応', es:'Laboratorio DQA completo: EMC, seguridad, ambiental, HALT', de:'Volles DQA-Labor: EMV, Sicherheit, Umwelt, HALT', fr:'Laboratoire DQA complet: CEM, sécurité, environnement, HALT', pt:'Laboratório DQA completo: EMC, segurança, ambiental, HALT', ar:'مختبر DQA الكامل: EMC والسلامة والبيئة وHALT', ru:'Полная лаборатория DQA: ЭМС, безопасность, окруж. среда, HALT', icon:<Zap size={20}/> },
  { en:'Full NPI process with quality gate reviews', zh:'RFQ→EVT→DVT→PVT→MP全流程质量门控', ja:'RFQ→EVT→DVT→PVT→MP全工程品質ゲート管理', es:'Proceso NPI completo con revisiones de puerta de calidad', de:'Vollständiger NPI-Prozess mit Quality-Gate-Reviews', fr:'Processus NPI complet avec revues de portes qualité', pt:'Processo NPI completo com revisões de portão de qualidade', ar:'عملية NPI كاملة مع مراجعات بوابة الجودة', ru:'Полный процесс NPI с контрольными точками качества', icon:<Clock size={20}/> },
]

// ── PARTNER_REGIONS ──────────────────────────────
const PARTNER_REGIONS = [
  { flag:'🇺🇸', en:'North America', zh:'北美', ja:'北米', es:'Norteamérica', de:'Nordamerika', fr:'Amérique du Nord', pt:'América do Norte', ar:'أمريكا الشمالية', ru:'Северная Америка' },
  { flag:'🇪🇺', en:'Europe', zh:'欧洲', ja:'ヨーロッパ', es:'Europa', de:'Europa', fr:'Europe', pt:'Europa', ar:'أوروبا', ru:'Европа' },
  { flag:'🇯🇵', en:'Japan & Korea', zh:'日韩', ja:'日本・韓国', es:'Japón y Corea', de:'Japan & Korea', fr:'Japon & Corée', pt:'Japão e Coreia', ar:'اليابان وكوريا', ru:'Япония и Корея' },
  { flag:'🌏', en:'Southeast Asia', zh:'东南亚', ja:'東南アジア', es:'Sudeste Asiático', de:'Südostasien', fr:'Asie du Sud-Est', pt:'Sudeste Asiático', ar:'جنوب شرق آسيا', ru:'Юго-Восточная Азия' },
  { flag:'🌍', en:'Middle East', zh:'中东', ja:'中東', es:'Oriente Medio', de:'Naher Osten', fr:'Moyen-Orient', pt:'Oriente Médio', ar:'الشرق الأوسط', ru:'Ближний Восток' },
  { flag:'🌎', en:'Latin America', zh:'拉美', ja:'ラテンアメリカ', es:'Latinoamérica', de:'Lateinamerika', fr:'Amérique Latine', pt:'América Latina', ar:'أمريكا اللاتينية', ru:'Латинская Америка' },
]

// ── JOB_LIST ─────────────────────────────────────
const JOB_LIST = [
  { en:{title:'Foreign Trade Manager',dept:'Sales',location:'Shenzhen',type:'Full-time'}, zh:{title:'外贸业务经理',dept:'销售部',location:'深圳',type:'全职'}, ja:{title:'海外営業マネージャー',dept:'営業部',location:'深セン',type:'正社員'}, es:{title:'Gerente de Comercio Exterior',dept:'Ventas',location:'Shenzhen',type:'Tiempo completo'}, de:{title:'Außenhandelsmanager',dept:'Vertrieb',location:'Shenzhen',type:'Vollzeit'}, fr:{title:'Responsable Commerce Extérieur',dept:'Ventes',location:'Shenzhen',type:'Temps plein'}, pt:{title:'Gerente de Comércio Exterior',dept:'Vendas',location:'Shenzhen',type:'Tempo integral'}, ar:{title:'مدير التجارة الخارجية',dept:'المبيعات',location:'شنتشن',type:'دوام كامل'}, ru:{title:'Менеджер по внешней торговле',dept:'Продажи',location:'Шэньчжэнь',type:'Полная занятость'} },
  { en:{title:'Power R&D Engineer',dept:'R&D Dept 1',location:'Shenzhen',type:'Full-time'}, zh:{title:'电源研发工程师',dept:'研发一部',location:'深圳',type:'全职'}, ja:{title:'電源研究開発エンジニア',dept:'研究開発第一部',location:'深セン',type:'正社員'}, es:{title:'Ingeniero de I+D de Energía',dept:'I+D Depto 1',location:'Shenzhen',type:'Tiempo completo'}, de:{title:'F&E-Ingenieur Stromversorgung',dept:'F&E Abt. 1',location:'Shenzhen',type:'Vollzeit'}, fr:{title:'Ingénieur R&D Énergie',dept:'R&D Dép. 1',location:'Shenzhen',type:'Temps plein'}, pt:{title:'Engenheiro de P&D de Energia',dept:'P&D Depto 1',location:'Shenzhen',type:'Tempo integral'}, ar:{title:'مهندس بحث وتطوير الطاقة',dept:'قسم البحث والتطوير 1',location:'شنتشن',type:'دوام كامل'}, ru:{title:'Инженер НИОКР по электропитанию',dept:'Отдел НИОКР 1',location:'Шэньчжэнь',type:'Полная занятость'} },
  { en:{title:'Energy Storage Engineer',dept:'R&D Dept 4',location:'Shenzhen',type:'Full-time'}, zh:{title:'储能系统工程师',dept:'研发四部',location:'深圳',type:'全职'}, ja:{title:'蓄電システムエンジニア',dept:'研究開発第四部',location:'深セン',type:'正社員'}, es:{title:'Ingeniero de Almacenamiento de Energía',dept:'I+D Depto 4',location:'Shenzhen',type:'Tiempo completo'}, de:{title:'Energiespeicher-Ingenieur',dept:'F&E Abt. 4',location:'Shenzhen',type:'Vollzeit'}, fr:{title:'Ingénieur Stockage d\'Énergie',dept:'R&D Dép. 4',location:'Shenzhen',type:'Temps plein'}, pt:{title:'Engenheiro de Armazenamento de Energia',dept:'P&D Depto 4',location:'Shenzhen',type:'Tempo integral'}, ar:{title:'مهندس تخزين الطاقة',dept:'قسم البحث والتطوير 4',location:'شنتشن',type:'دوام كامل'}, ru:{title:'Инженер по накопителям энергии',dept:'Отдел НИОКР 4',location:'Шэньчжэнь',type:'Полная занятость'} },
  { en:{title:'Quality Engineer (QE)',dept:'Quality',location:'Huizhou',type:'Full-time'}, zh:{title:'品质工程师 (QE)',dept:'品质部',location:'惠州',type:'全职'}, ja:{title:'品質エンジニア (QE)',dept:'品質部',location:'恵州',type:'正社員'}, es:{title:'Ingeniero de Calidad (QE)',dept:'Calidad',location:'Huizhou',type:'Tiempo completo'}, de:{title:'Qualitätsingenieur (QE)',dept:'Qualität',location:'Huizhou',type:'Vollzeit'}, fr:{title:'Ingénieur Qualité (QE)',dept:'Qualité',location:'Huizhou',type:'Temps plein'}, pt:{title:'Engenheiro de Qualidade (QE)',dept:'Qualidade',location:'Huizhou',type:'Tempo integral'}, ar:{title:'مهندس الجودة (QE)',dept:'الجودة',location:'هويتشو',type:'دوام كامل'}, ru:{title:'Инженер по качеству (QE)',dept:'Качество',location:'Хуэйчжоу',type:'Полная занятость'} },
  { en:{title:'Production Supervisor',dept:'Production',location:'Vietnam',type:'Full-time'}, zh:{title:'生产主管',dept:'生产部',location:'越南',type:'全职'}, ja:{title:'生産管理者',dept:'生産部',location:'ベトナム',type:'正社員'}, es:{title:'Supervisor de Producción',dept:'Producción',location:'Vietnam',type:'Tiempo completo'}, de:{title:'Produktionsleiter',dept:'Produktion',location:'Vietnam',type:'Vollzeit'}, fr:{title:'Superviseur de Production',dept:'Production',location:'Vietnam',type:'Temps plein'}, pt:{title:'Supervisor de Produção',dept:'Produção',location:'Vietnã',type:'Tempo integral'}, ar:{title:'مشرف الإنتاج',dept:'الإنتاج',location:'فيتنام',type:'دوام كامل'}, ru:{title:'Начальник производства',dept:'Производство',location:'Вьетнам',type:'Полная занятость'} },
]

// ── ProfileTab data ──────────────────────────────
const profileData: Record<string, {intro:string;factory:string;revenue:string;stats:string[]}> = {
  zh:{intro:'深圳市晨旭通科技股份有限公司（品牌：Risunic）成立于2014年，总部位于中国深圳，是一家集研发、生产、销售于一体的国家高新技术企业、专精特新企业。十余年深耕电源与电力电子领域，已成为全球客户信赖的OEM/ODM制造商与解决方案提供商。',factory:'公司拥有两大现代化生产基地——广东惠州和越南，年产能超500万台。深圳总部设有研发中心、销售中心和管理中枢。',revenue:'2025年销售额达5.1亿元人民币，2026年目标5.6亿元。全球服务600+家客户，其中10余家为世界500强/百强企业。',stats:['80+ 研发工程师','500+ 产品型号','500万+ 年产能','30+ 出口国家']},
  ja:{intro:'深セン市晨旭通科技股份有限公司（ブランド：Risunic）は2014年に設立され、中国深センに本社を置く、研究開発・製造・販売を一体化した国家ハイテク企業です。10年以上にわたり電源とパワーエレクトロニクス分野に特化し、世界中の顧客から信頼されるOEM/ODMメーカーとなっています。',factory:'広東省惠州とベトナムに2つの最新鋭生産拠点を持ち、年間生産能力は500万台以上です。',revenue:'2025年の売上高は5.1億元、2026年の目標は5.6億元です。世界600社以上の顧客にサービスを提供し、うち10社以上がフォーチュン500/トップ100企業です。',stats:['80名以上のR&Dエンジニア','500以上のSKU','500万台以上の年間生産能力','30カ国以上に輸出']},
  es:{intro:'Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) fue fundada en 2014, especializándose en I+D, fabricación y venta de soluciones de alimentación. Con sede en Shenzhen y más de una década de experiencia, somos un fabricante OEM/ODM de confianza para clientes globales.',factory:'Operamos dos modernas bases de fabricación — en Huizhou, China y Vietnam — con una capacidad de producción combinada de más de 5 millones de unidades al año.',revenue:'En 2025, nuestros ingresos alcanzaron los 510 millones de RMB, con un objetivo de 560 millones para 2026. Atendemos a más de 600 clientes activos en todo el mundo.',stats:['80+ Ingenieros de I+D','500+ SKUs de Productos','5M+ Capacidad Anual','30+ Países de Exportación']},
  de:{intro:'Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) wurde 2014 gegründet und ist auf F&E, Herstellung und Vertrieb von Stromversorgungslösungen spezialisiert. Mit Sitz in Shenzhen und über einem Jahrzehnt Erfahrung sind wir ein vertrauenswürdiger OEM/ODM-Hersteller für globale Kunden.',factory:'Wir betreiben zwei moderne Produktionsstätten — in Huizhou, China und Vietnam — mit einer kombinierten Jahreskapazität von über 5 Millionen Einheiten.',revenue:'2025 erreichten wir einen Umsatz von 510 Mio. RMB, mit einem Ziel von 560 Mio. für 2026. Wir betreuen über 600 aktive Kunden weltweit.',stats:['80+ F&E-Ingenieure','500+ Produkt-SKUs','5M+ Jahreskapazität','30+ Exportländer']},
  fr:{intro:'Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) a été fondée en 2014, spécialisée dans la R&D, la fabrication et la vente de solutions d\'alimentation. Basée à Shenzhen avec plus d\'une décennie d\'expérience, nous sommes un fabricant OEM/ODM de confiance pour nos clients mondiaux.',factory:'Nous exploitons deux sites de production modernes — à Huizhou, en Chine et au Vietnam — avec une capacité de production combinée de plus de 5 millions d\'unités par an.',revenue:'En 2025, notre chiffre d\'affaires a atteint 510 millions de RMB, avec un objectif de 560 millions pour 2026. Nous servons plus de 600 clients actifs dans le monde.',stats:['80+ Ingénieurs R&D','500+ Références Produits','5M+ Capacité Annuelle','30+ Pays d\'Exportation']},
  pt:{intro:'A Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) foi fundada em 2014, especializada em P&D, fabricação e venda de soluções de energia. Com sede em Shenzhen e mais de uma década de experiência, somos um fabricante OEM/ODM confiável para clientes globais.',factory:'Operamos duas bases de fabricação modernas — em Huizhou, China e Vietnã — com uma capacidade de produção combinada de mais de 5 milhões de unidades por ano.',revenue:'Em 2025, nossa receita atingiu 510 milhões de RMB, com meta de 560 milhões para 2026. Atendemos mais de 600 clientes ativos globalmente.',stats:['80+ Engenheiros de P&D','500+ SKUs de Produtos','5M+ Capacidade Anual','30+ Países de Exportação']},
  ar:{intro:'تأسست شركة Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) في عام 2014، وهي متخصصة في البحث والتطوير والتصنيع والمبيعات لحلول الطاقة. يقع مقرها في شنتشن مع أكثر من عقد من الخبرة، ونحن مصنع OEM/ODM موثوق للعملاء العالميين.',factory:'ندير قاعدتي تصنيع حديثتين — في هويتشو بالصين وفيتنام — بطاقة إنتاجية مجمعة تزيد عن 5 ملايين وحدة سنويًا.',revenue:'في عام 2025، بلغت إيراداتنا 510 مليون يوان، مع هدف 560 مليون لعام 2026. نخدم أكثر من 600 عميل نشط حول العالم.',stats:['80+ مهندس بحث وتطوير','500+ طراز منتج','5M+ طاقة سنوية','30+ دولة تصدير']},
  ru:{intro:'Компания Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) основана в 2014 году и специализируется на НИОКР, производстве и продаже решений электропитания. Базируясь в Шэньчжэне с более чем десятилетним опытом, мы являемся надёжным OEM/ODM-производителем для клиентов по всему миру.',factory:'Мы управляем двумя современными производственными базами — в Хуэйчжоу, Китай и во Вьетнаме — с совокупной мощностью более 5 миллионов единиц в год.',revenue:'В 2025 году наша выручка достигла 510 млн юаней, цель на 2026 год — 560 млн. Мы обслуживаем более 600 активных клиентов по всему миру.',stats:['80+ инженеров НИОКР','500+ SKU продукции','5M+ годовая мощность','30+ стран экспорта']},
}
const profileDataEn = {intro:'Risunic Technology (Shenzhen) Co., Ltd. (RisunicPower) was founded in 2014, specializing in R&D, manufacturing, and sales of power solutions. Headquartered in Shenzhen with over a decade of experience, we are a trusted OEM/ODM manufacturer for global customers.',factory:'We operate two modern manufacturing bases — in Huizhou, China and Vietnam — with a combined production capacity of over 5 million units annually.',revenue:'In 2025, our revenue reached RMB 510 million, with a 2026 target of RMB 560 million. We serve 600+ active customers globally.',stats:['80+ R&D Engineers','500+ Product SKUs','5M+ Annual Capacity','30+ Export Countries']}

// ── Careers data ──────────────────────────────────
const careersData: Record<string, {title:string;why:string;why1:string;why2:string;why3:string;why4:string;formTitle:string;name:string;email:string;phone:string;position:string;message:string;submit:string;resume:string;deptLabel:string;locationLabel:string;typeLabel:string;applyNote:string}> = {
  zh:{title:'加入晨旭通',why:'为什么选择我们',why1:'行业领先的技术平台与研发投入',why2:'完善的培训体系与职业发展通道',why3:'全球化工作环境与跨国协作机会',why4:'有竞争力的薪酬福利与股权激励',formTitle:'投递简历',name:'姓名',email:'邮箱',phone:'电话',position:'应聘岗位',message:'自我介绍/附加信息',submit:'提交申请',resume:'上传简历',deptLabel:'部门：',locationLabel:'地点：',typeLabel:'类型：',applyNote:'请填写右侧表单提交申请，我们将在3个工作日内回复。'},
  ja:{title:'採用情報',why:'選ばれる理由',why1:'業界トップクラスの技術プラットフォーム',why2:'充実した研修制度とキャリア開発',why3:'グローバルな職場環境と国際協業',why4:'競争力のある報酬と福利厚生',formTitle:'履歴書を送る',name:'お名前',email:'メールアドレス',phone:'電話番号',position:'希望職種',message:'自己紹介・その他',submit:'送信',resume:'履歴書アップロード',deptLabel:'部署：',locationLabel:'勤務地：',typeLabel:'雇用形態：',applyNote:'右側のフォームからご応募ください。3営業日以内にご連絡いたします。'},
  es:{title:'Únase a Nosotros',why:'¿Por qué Risunic?',why1:'Plataforma tecnológica líder y inversión en I+D',why2:'Formación integral y desarrollo profesional',why3:'Entorno de trabajo global con colaboración transfronteriza',why4:'Compensación competitiva e incentivos en acciones',formTitle:'Enviar Solicitud',name:'Nombre',email:'Correo',phone:'Teléfono',position:'Puesto',message:'Sobre Usted / Información Adicional',submit:'Enviar Solicitud',resume:'Subir CV',deptLabel:'Depto: ',locationLabel:'Ubicación: ',typeLabel:'Tipo: ',applyNote:'Complete el formulario para postularse. Responderemos en 3 días hábiles.'},
  de:{title:'Werde Teil des Teams',why:'Warum Risunic?',why1:'Branchenführende Technologieplattform & F&E-Investitionen',why2:'Umfassende Weiterbildung & Karriereentwicklung',why3:'Globales Arbeitsumfeld mit grenzüberschreitender Zusammenarbeit',why4:'Wettbewerbsfähige Vergütung & Kapitalbeteiligung',formTitle:'Jetzt Bewerben',name:'Name',email:'E-Mail',phone:'Telefon',position:'Position',message:'Über Sie / Zusätzliche Infos',submit:'Bewerbung Absenden',resume:'Lebenslauf Hochladen',deptLabel:'Abt.: ',locationLabel:'Standort: ',typeLabel:'Typ: ',applyNote:'Bitte füllen Sie das Formular aus. Wir antworten innerhalb von 3 Werktagen.'},
  fr:{title:'Rejoignez-nous',why:'Pourquoi Risunic ?',why1:'Plateforme technologique de pointe et investissement R&D',why2:'Formation complète et développement de carrière',why3:'Environnement de travail mondial avec collaboration transfrontalière',why4:'Rémunération compétitive et participation au capital',formTitle:'Postuler',name:'Nom',email:'E-mail',phone:'Téléphone',position:'Poste',message:'À Propos de Vous / Infos Supplémentaires',submit:'Envoyer la Candidature',resume:'Télécharger le CV',deptLabel:'Dép. : ',locationLabel:'Lieu : ',typeLabel:'Type : ',applyNote:'Veuillez remplir le formulaire pour postuler. Nous répondrons sous 3 jours ouvrés.'},
  pt:{title:'Junte-se a Nós',why:'Por que a Risunic?',why1:'Plataforma tecnológica líder e investimento em P&D',why2:'Treinamento abrangente e desenvolvimento de carreira',why3:'Ambiente de trabalho global com colaboração transfronteiriça',why4:'Remuneração competitiva e participação acionária',formTitle:'Candidate-se',name:'Nome',email:'E-mail',phone:'Telefone',position:'Cargo',message:'Sobre Você / Informações Adicionais',submit:'Enviar Candidatura',resume:'Enviar Currículo',deptLabel:'Depto: ',locationLabel:'Local: ',typeLabel:'Tipo: ',applyNote:'Preencha o formulário para se candidatar. Responderemos em 3 dias úteis.'},
  ar:{title:'انضم إلينا',why:'لماذا Risunic؟',why1:'منصة تكنولوجية رائدة واستثمار في البحث والتطوير',why2:'تدريب شامل وتطوير مهني',why3:'بيئة عمل عالمية مع تعاون عبر الحدود',why4:'تعويضات تنافسية وحوافز أسهم',formTitle:'تقديم الطلب',name:'الاسم',email:'البريد الإلكتروني',phone:'الهاتف',position:'المنصب',message:'نبذة عنك / معلومات إضافية',submit:'إرسال الطلب',resume:'تحميل السيرة الذاتية',deptLabel:'القسم: ',locationLabel:'الموقع: ',typeLabel:'النوع: ',applyNote:'يرجى ملء النموذج للتقديم. سنرد خلال 3 أيام عمل.'},
  ru:{title:'Присоединяйтесь',why:'Почему Risunic?',why1:'Передовая технологическая платформа и инвестиции в НИОКР',why2:'Комплексное обучение и развитие карьеры',why3:'Глобальная рабочая среда с международным сотрудничеством',why4:'Конкурентная оплата и участие в капитале',formTitle:'Отправить Заявку',name:'Имя',email:'Эл. почта',phone:'Телефон',position:'Должность',message:'О Себе / Дополнительно',submit:'Отправить',resume:'Загрузить Резюме',deptLabel:'Отдел: ',locationLabel:'Место: ',typeLabel:'Тип: ',applyNote:'Заполните форму для подачи заявки. Мы ответим в течение 3 рабочих дней.'},
}
const careersDataEn = {title:'Join Our Team',why:'Why Risunic?',why1:'Industry-leading technology platform & R&D investment',why2:'Comprehensive training & career development',why3:'Global workplace with cross-border collaboration',why4:'Competitive compensation & equity incentives',formTitle:'Apply Now',name:'Name',email:'Email',phone:'Phone',position:'Position',message:'About You / Additional Info',submit:'Submit Application',resume:'Upload Resume',deptLabel:'Dept: ',locationLabel:'Location: ',typeLabel:'Type: ',applyNote:'Please fill in the form to apply. We will respond within 3 business days.'}

// ── Partners labels ──────────────────────────────
const partnersTitle: Record<string, string> = { en:'Serving 30+ Countries & Regions', zh:'服务全球 30+ 国家和地区', ja:'世界30カ国以上にサービス提供', es:'Sirviendo a Más de 30 Países y Regiones', de:'Betreuung von über 30 Ländern & Regionen', fr:'Service dans Plus de 30 Pays et Régions', pt:'Atendendo Mais de 30 Países e Regiões', ar:'خدمة أكثر من 30 دولة ومنطقة', ru:'Обслуживание 30+ стран и регионов' }

// ── Section header labels ────────────────────────
const sectionTitle: Record<string, string> = { en:'About Us', zh:'关于晨旭通', ja:'会社概要', es:'Sobre Nosotros', de:'Über Uns', fr:'À Propos', pt:'Sobre Nós', ar:'معلومات عنا', ru:'О Компании' }
const sectionSub: Record<string, string> = { en:'Company', zh:'公司简介', ja:'概要', es:'Empresa', de:'Unternehmen', fr:'Entreprise', pt:'Empresa', ar:'الشركة', ru:'Компания' }

// ── Sub-components ────────────────────────────────
function ProfileTab({ l }: { l: string }) {
  const d = profileData[l] || profileDataEn
  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed mb-4">{d.intro}</p>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed mb-4">{d.factory}</p>
        <p className="text-[1.5rem] text-[#4A5D70] leading-relaxed">{d.revenue}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {d.stats.map((s, i) => (
          <div key={i} className="card-ts flex flex-col items-center justify-center text-center">
            <span className="text-[2.4rem] font-bold text-[#F7D142]">{s.split(' ')[0]}</span>
            <span className="text-[1.3rem] text-[#4A5D70] mt-1">{s.substring(s.indexOf(' ') + 1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryTab({ l }: { l: string }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-4 md:left-1/2 top-3 bottom-3 w-0.5 bg-[#E2E8EF] md:-translate-x-px" />
      <div className="space-y-8">
        {MILESTONES.map((m, i) => (
          <div key={m.year} className={`relative pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10 md:ml-0' : 'md:pl-10 md:ml-auto'}`}>
            <div className="absolute left-1 md:left-auto top-2 w-6 h-6 rounded-full border-2 border-[#F7D142] bg-white md:right-0 md:-mr-3" style={i % 2 === 0 ? { left: '0.25rem' } : { left: '0.25rem' }} />
            <div className="card-ts">
              <span className="text-[1.2rem] font-bold text-[#F7D142] mb-1 block">{m.year}</span>
              <p className="text-[1.3rem] text-[#4A5D70]">{pick(m, l)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QualityTab({ l }: { l: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {QUALITY_ITEMS.map((item, i) => (
        <div key={i} className="card-ts flex items-center gap-4">
          <div className="text-[#F7D142] shrink-0">{item.icon}</div>
          <span className="text-[1.3rem] text-[#0E4071] font-medium">{pick(item as any, l)}</span>
        </div>
      ))}
    </div>
  )
}

function PartnersTab({ l }: { l: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-[1.8rem] font-bold text-[#0E4071] mb-8">{partnersTitle[l] || partnersTitle.en}</p>
      <div className="grid grid-cols-3 gap-4">
        {PARTNER_REGIONS.map((r, i) => (
          <div key={i} className="card-ts flex flex-col items-center justify-center py-8">
            <span className="text-[3rem] block mb-2">{r.flag}</span>
            <span className="text-[1.3rem] font-medium text-[#0E4071]">{pick(r, l)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CareersTab({ l }: { l: string }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const labels = careersData[l] || careersDataEn

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
            const jd = (job as Record<string, {title:string;dept:string;location:string;type:string}>)[l] || job.en
            return (
              <div key={i}>
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all ${expanded === i ? 'border-[#F7D142] bg-[#F7D142]/5' : 'border-[#E2E8EF] bg-white'} hover:border-[#F7D142]/30`}>
                  <div>
                    <div className="font-semibold text-[1.4rem] text-[#0E4071]">{jd.title}</div>
                    <div className="text-[1.2rem] text-[#4A5D70]">{jd.dept} · {jd.location} · {jd.type}</div>
                  </div>
                  {expanded === i ? <ChevronUp size={18} className="text-[#F7D142]" /> : <ChevronDown size={18} className="text-[#4A5D70]" />}
                </button>
                {expanded === i && (
                  <div className="rounded-b-xl border border-t-0 border-[#E2E8EF] p-4 bg-white text-[1.3rem] text-[#4A5D70] leading-relaxed">
                    <p className="mb-2"><strong>{labels.deptLabel}</strong>{jd.dept}</p>
                    <p className="mb-2"><strong>{labels.locationLabel}</strong>{jd.location}</p>
                    <p className="mb-2"><strong>{labels.typeLabel}</strong>{jd.type}</p>
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
              const jd = (j as Record<string, {title:string}>)[l] || j.en
              return <option key={jd.title} value={jd.title}>{jd.title}</option>
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

// ── Main component ──────────────────────────────────
export default function CompanyCards({ locale }: { locale?: string }) {
  const [activeTab, setActiveTab] = useState('profile')
  const l = L.includes(locale as Lang) ? locale! : 'en'

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
          <p className="section-subtitle">{sectionSub[l] || sectionSub.en}</p>
          <h2 className="section-title">{sectionTitle[l] || sectionTitle.en}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(TABS).map(([key, tab]) => (
            <button key={key} type="button"
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full text-[1.3rem] font-medium transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-[#F7D142] text-[#0E4071] shadow-md'
                  : 'bg-white text-[#4A5D70] hover:bg-[#E2E8EF] border border-[#E2E8EF]'
              }`}
            >
              {tab[l as Lang]}
            </button>
          ))}
        </div>
        {tabContent[activeTab]}
      </div>
    </section>
  )
}
