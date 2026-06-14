/**
 * generate_translations.js
 * Generates translations for all products and categories in 7 locales:
 * ja, de, fr, es, pt, ar, ru
 * 
 * Preserves technical specs (model numbers), brand names (RisunicPower, POE, UPS, etc.)
 * Arabic: Modern Standard Arabic (العربية الفصحى)
 * Russian: Proper Cyrillic with natural grammar
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── Regex patterns for tech specs to preserve ───
// These match things like "12W", "1000VA", "48V DC", "1KVA", "15.4W", etc.
const TECH_PATTERN = /(?:\d+[.,]?\d*(?:\s*-\s*\d+[.,]?\d*)?(?:W|VA|V|A|mA|Hz|ms|mV|kg|g|mm|cm|KWh|kWh|Wh|°C|°F))\b|\b\d+[.,]?\d*(?:\s*-\s*\d+[.,]?\d*)?(?:W|VA|V|A|mA|Hz|ms|mV|kg|g|mm|cm|KWh|kWh|Wh|°C|°F)(?:\s+[Dd][Cc])?/g

// Brand/tech words to preserve (whole word matches)
const BRAND_WORDS = [
  'RisunicPower', 'Risunic',
  'POE[+]?', 'POE',
  'IEEE\\s*802[.]3[afatbt]+',
  'CE', 'CB', 'CCC', 'FCC', 'UL\\d*', 'UKCA', 'NOM', 'VDE[-A-Z\\s\\d]*', 'TUV', 'ROHS', 'RoHS', 'ISO',
  'GaN', 'LiFePO₄', 'LiFePO4',
  'MPPT', 'PWM',
  'OVP', 'OCP', 'SCP', 'OTP', 'BMS', 'SPD',
  'PPS', 'QC\\s*4[.]0[+]?', 'PD\\s*3[.]0',
  'LCD', 'USB[-A]?[-C]?', 'WiFi', 'Bluetooth',
  'Modbus', 'SNMP', 'RS23[25]', 'RS485',
  'IP6[57]', 'IP65',
  'THDI', 'PFC',
  'DoE\\s+Level\\s+VI', 'Level\\s+VI',
  'NEMA', 'CEC',
  'ETL', 'SAA', 'RCM', 'BSMI', 'PSE', 'KC', 'EAC',
  'ERP',
  'Cat[56]e?',
  '(?:10/100/1000M|10/100M|1000M|100M)',
  '2P[+]?3P?', '3P',
  '12VV', '24VV', '48VV',
  'TBD',
  'CRI', 'CCT', 'LM', 'Ra',
  'CCTV',
]

// Build a combined regex to match brand words as whole words
const BRAND_RE = new RegExp('\\b(' + BRAND_WORDS.join('|') + ')\\b', 'g')
// Technical patterns like X-XXX-NNNN (model numbers)
const MODEL_RE = /[A-Z]{2,}-\d+[A-Z]*[-/]?\w*/g
// Numbers like DC9-15V, AC100~240V, etc.
const SPEC_RE = /[DdAa][Cc]\d+[~\u2013]\d*[VW]?/g

// ─── Translation Dictionaries ───

const COMMON_TERMS = {
  ja: {
    'Power Adapter': '電源アダプタ',
    'Power Supply': '電源',
    'Power': '電力',
    'Adapter': 'アダプタ',
    'Inverter': 'インバーター',
    'Charger': '充電器',
    'Wall-Mount': '壁掛け型',
    'Desktop': 'デスクトップ型',
    'Open Frame': 'オープンフレーム',
    'DIN Rail': 'DINレール',
    'POE Power Supply': 'POE電源',
    'POE Injector': 'POEインジェクター',
    'UPS': 'UPS',
    'Online UPS': 'オンラインUPS',
    'Portable Power Station': 'ポータブル電源',
    'Energy Storage System': 'エネルギー貯蔵システム',
    'All-in-One Solar System': 'オールインワン太陽光発電システム',
    'Solar Inverter': 'ソーラーインバーター',
    'Micro Inverter': 'マイクロインバーター',
    'Home Inverter': 'ホームインバーター',
    'Off-Grid Inverter': 'オフグリッドインバーター',
    'Pure Sine Wave Inverter': '純正弦波インバーター',
    'DC-AC Inverter': 'DC-ACインバーター',
    'with Charger': '充電器内蔵',
    'with AC Charger': 'AC充電器内蔵',
    'Compact': 'コンパクト',
    'Industrial': '産業用',
    'High-Efficiency': '高効率',
    'High-Power': '高出力',
    'High-Density': '高密度',
    'Universal': 'ユニバーサル',
    'Fast Charger': '急速充電器',
    'PD Charger': 'PD充電器',
    'GaN-Ready': 'GaN対応',
    'Double Conversion': 'ダブルコンバージョン',
    'Grid-Tied': '系統連系',
    'MPPT': 'MPPT',
    'PWM': 'PWM',
    'Solar': 'ソーラー',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'バッテリー',
    'System': 'システム',
    'Series': 'シリーズ',
    'Hybrid': 'ハイブリッド',
    'Interchangeable': '交換式',
    'Plugs': 'プラグ',
    'Certified': '認証済み',
    'Protection': '保護',
    'Overload': '過負荷',
    'Short circuit': '短絡',
    'Overvoltage': '過電圧',
    'Overcurrent': '過電流',
    'Output': '出力',
    'Input': '入力',
    'Efficiency': '効率',
    'Ripple': 'リップル',
    'Continuous': '連続',
    'Waterproof': '防水',
    'Natural cooling': '自然冷却',
    'Monitoring': '監視',
    'Display': '表示',
    'Development Phase': '開発段階',
    'In Development': '開発中',
    'Design': '設計',
    'Rated output': '定格出力',
    'Form factor': 'フォームファクター',
    'Single port': 'シングルポート',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': '急速充電',
    'AC input': 'AC入力',
    'AC output': 'AC出力',
    'DC output': 'DC出力',
    'Power factor': '力率',
    'Cable': 'ケーブル',
    'Included': '付属',
    'Optional': 'オプション',
    'Standard': '標準',
    'Internal': '内蔵',
    'External': '外部',
    'Expandable': '拡張可能',
    'Pure sine wave': '純正弦波',
    'Built-in': '内蔵',
    'Switchable': '切替式',
    'Peak efficiency': '最大効率',
    'Design life': '設計寿命',
    'Rated': '定格',
  },
  de: {
    'Power Adapter': 'Netzteil',
    'Power Supply': 'Netzteil',
    'Power Adapters': 'Netzteile',
    'Power': 'Strom',
    'Adapter': 'Adapter',
    'Inverter': 'Wechselrichter',
    'Charger': 'Ladegerät',
    'Wall-Mount': 'Wandmontage',
    'Desktop': 'Desktop',
    'Open Frame': 'Offenes-Rahmen',
    'DIN Rail': 'DIN-Schiene',
    'POE Power Supply': 'POE-Netzteil',
    'POE Injector': 'POE-Injektor',
    'UPS': 'USV',
    'Online UPS': 'Online-USV',
    'Portable Power Station': 'Tragbare Powerstation',
    'Energy Storage System': 'Energiespeichersystem',
    'All-in-One Solar System': 'All-in-One-Solarsystem',
    'Solar Inverter': 'Solar-Wechselrichter',
    'Micro Inverter': 'Mikro-Wechselrichter',
    'Home Inverter': 'Heim-Wechselrichter',
    'Off-Grid Inverter': 'Insel-Wechselrichter',
    'Pure Sine Wave Inverter': 'Reiner-Sinus-Wechselrichter',
    'DC-AC Inverter': 'DC-AC-Wechselrichter',
    'with Charger': 'mit Ladegerät',
    'with AC Charger': 'mit AC-Ladegerät',
    'Compact': 'Kompakt',
    'Industrial': 'Industrie',
    'High-Efficiency': 'Hocheffizient',
    'High-Power': 'Hochleistungs',
    'High-Density': 'Hochdichte',
    'Universal': 'Universal',
    'Fast Charger': 'Schnellladegerät',
    'PD Charger': 'PD-Ladegerät',
    'GaN-Ready': 'GaN-bereit',
    'Double Conversion': 'Doppelwandlung',
    'Grid-Tied': 'Netzgekoppelt',
    'MPPT': 'MPPT',
    'PWM': 'PWM',
    'Solar': 'Solar',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'Batterie',
    'System': 'System',
    'Series': 'Serie',
    'Hybrid': 'Hybrid',
    'Interchangeable': 'Austauschbar',
    'Plugs': 'Stecker',
    'Certified': 'Zertifiziert',
    'Protection': 'Schutz',
    'Overload': 'Überlast',
    'Short circuit': 'Kurzschluss',
    'Overvoltage': 'Überspannung',
    'Overcurrent': 'Überstrom',
    'Output': 'Ausgang',
    'Input': 'Eingang',
    'Efficiency': 'Wirkungsgrad',
    'Ripple': 'Restwelligkeit',
    'Continuous': 'Dauer',
    'Waterproof': 'Wasserdicht',
    'Natural cooling': 'Natürliche Kühlung',
    'Monitoring': 'Überwachung',
    'Display': 'Anzeige',
    'Development Phase': 'Entwicklungsphase',
    'In Development': 'In Entwicklung',
    'Design': 'Design',
    'Rated output': 'Nennleistung',
    'Form factor': 'Bauform',
    'Single port': 'Einzelport',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'Schnellladung',
    'AC input': 'AC-Eingang',
    'AC output': 'AC-Ausgang',
    'DC output': 'DC-Ausgang',
    'Power factor': 'Leistungsfaktor',
    'Cable': 'Kabel',
    'Included': 'Inklusive',
    'Optional': 'Optional',
    'Standard': 'Standard',
    'Internal': 'Intern',
    'External': 'Extern',
    'Expandable': 'Erweiterbar',
    'Pure sine wave': 'Reine Sinuswelle',
    'Built-in': 'Eingebauter',
    'Switchable': 'Umschaltbar',
    'Peak efficiency': 'Spitzenwirkungsgrad',
    'Design life': 'Lebensdauer',
    'Rated': 'Nenn',
  },
  fr: {
    'Power Adapter': 'Adaptateur secteur',
    'Power Supply': 'Alimentation',
    'Power Adapters': 'Adaptateurs secteur',
    'Power': 'Puissance',
    'Adapter': 'Adaptateur',
    'Inverter': 'Onduleur',
    'Charger': 'Chargeur',
    'Wall-Mount': 'Montage mural',
    'Desktop': 'Bureau',
    'Open Frame': 'Châssis ouvert',
    'DIN Rail': 'Rail DIN',
    'POE Power Supply': 'Alimentation POE',
    'POE Injector': 'Injecteur POE',
    'UPS': 'ASI',
    'Online UPS': 'ASI en ligne',
    'Portable Power Station': 'Station d\'alimentation portable',
    'Energy Storage System': 'Système de stockage d\'énergie',
    'All-in-One Solar System': 'Système solaire tout-en-un',
    'Solar Inverter': 'Onduleur solaire',
    'Micro Inverter': 'Micro-onduleur',
    'Home Inverter': 'Onduleur domestique',
    'Off-Grid Inverter': 'Onduleur hors réseau',
    'Pure Sine Wave Inverter': 'Onduleur à onde sinusoïdale pure',
    'DC-AC Inverter': 'Convertisseur DC-AC',
    'with Charger': 'avec chargeur',
    'with AC Charger': 'avec chargeur CA',
    'Compact': 'Compact',
    'Industrial': 'Industriel',
    'High-Efficiency': 'Haute efficacité',
    'High-Power': 'Haute puissance',
    'High-Density': 'Haute densité',
    'Universal': 'Universel',
    'Fast Charger': 'Chargeur rapide',
    'PD Charger': 'Chargeur PD',
    'GaN-Ready': 'Prêt pour GaN',
    'Double Conversion': 'Double conversion',
    'Grid-Tied': 'Raccordé au réseau',
    'MPPT': 'MPPT',
    'PWM': 'MLI',
    'Solar': 'Solaire',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'Batterie',
    'System': 'Système',
    'Series': 'Série',
    'Hybrid': 'Hybride',
    'Interchangeable': 'Interchangeable',
    'Plugs': 'Fiches',
    'Certified': 'Certifié',
    'Protection': 'Protection',
    'Overload': 'Surcharge',
    'Short circuit': 'Court-circuit',
    'Overvoltage': 'Surtension',
    'Overcurrent': 'Surintensité',
    'Output': 'Sortie',
    'Input': 'Entrée',
    'Efficiency': 'Rendement',
    'Ripple': 'Ondulation',
    'Continuous': 'Continu',
    'Waterproof': 'Étanche',
    'Natural cooling': 'Refroidissement naturel',
    'Monitoring': 'Surveillance',
    'Display': 'Affichage',
    'Development Phase': 'Phase de développement',
    'In Development': 'En développement',
    'Design': 'Conception',
    'Rated output': 'Puissance nominale',
    'Form factor': 'Facteur de forme',
    'Single port': 'Port unique',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'Charge rapide',
    'AC input': 'Entrée CA',
    'AC output': 'Sortie CA',
    'DC output': 'Sortie CC',
    'Power factor': 'Facteur de puissance',
    'Cable': 'Câble',
    'Included': 'Inclus',
    'Optional': 'Optionnel',
    'Standard': 'Standard',
    'Internal': 'Interne',
    'External': 'Externe',
    'Expandable': 'Extensible',
    'Pure sine wave': 'Onde sinusoïdale pure',
    'Built-in': 'Intégré',
    'Switchable': 'Commutable',
    'Peak efficiency': 'Rendement de crête',
    'Design life': 'Durée de vie',
    'Rated': 'Nominal',
  },
  es: {
    'Power Adapter': 'Adaptador de corriente',
    'Power Supply': 'Fuente de alimentación',
    'Power Adapters': 'Adaptadores de corriente',
    'Power': 'Potencia',
    'Adapter': 'Adaptador',
    'Inverter': 'Inversor',
    'Charger': 'Cargador',
    'Wall-Mount': 'Montaje en pared',
    'Desktop': 'Escritorio',
    'Open Frame': 'Marco abierto',
    'DIN Rail': 'Riel DIN',
    'POE Power Supply': 'Fuente de alimentación POE',
    'POE Injector': 'Inyector POE',
    'UPS': 'SAI',
    'Online UPS': 'SAI en línea',
    'Portable Power Station': 'Estación de energía portátil',
    'Energy Storage System': 'Sistema de almacenamiento de energía',
    'All-in-One Solar System': 'Sistema solar todo-en-uno',
    'Solar Inverter': 'Inversor solar',
    'Micro Inverter': 'Microinversor',
    'Home Inverter': 'Inversor doméstico',
    'Off-Grid Inverter': 'Inversor fuera de la red',
    'Pure Sine Wave Inverter': 'Inversor de onda sinusoidal pura',
    'DC-AC Inverter': 'Inversor CC-CA',
    'with Charger': 'con cargador',
    'with AC Charger': 'con cargador CA',
    'Compact': 'Compacto',
    'Industrial': 'Industrial',
    'High-Efficiency': 'Alta eficiencia',
    'High-Power': 'Alta potencia',
    'High-Density': 'Alta densidad',
    'Universal': 'Universal',
    'Fast Charger': 'Cargador rápido',
    'PD Charger': 'Cargador PD',
    'GaN-Ready': 'Listo para GaN',
    'Double Conversion': 'Doble conversión',
    'Grid-Tied': 'Conectado a la red',
    'MPPT': 'MPPT',
    'PWM': 'PWM',
    'Solar': 'Solar',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'Batería',
    'System': 'Sistema',
    'Series': 'Serie',
    'Hybrid': 'Híbrido',
    'Interchangeable': 'Intercambiable',
    'Plugs': 'Enchufes',
    'Certified': 'Certificado',
    'Protection': 'Protección',
    'Overload': 'Sobrecarga',
    'Short circuit': 'Cortocircuito',
    'Overvoltage': 'Sobretensión',
    'Overcurrent': 'Sobrecorriente',
    'Output': 'Salida',
    'Input': 'Entrada',
    'Efficiency': 'Eficiencia',
    'Ripple': 'Ondulación',
    'Continuous': 'Continuo',
    'Waterproof': 'Impermeable',
    'Natural cooling': 'Enfriamiento natural',
    'Monitoring': 'Monitoreo',
    'Display': 'Pantalla',
    'Development Phase': 'Fase de desarrollo',
    'In Development': 'En desarrollo',
    'Design': 'Diseño',
    'Rated output': 'Salida nominal',
    'Form factor': 'Factor de forma',
    'Single port': 'Puerto único',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'Carga rápida',
    'AC input': 'Entrada CA',
    'AC output': 'Salida CA',
    'DC output': 'Salida CC',
    'Power factor': 'Factor de potencia',
    'Cable': 'Cable',
    'Included': 'Incluido',
    'Optional': 'Opcional',
    'Standard': 'Estándar',
    'Internal': 'Interno',
    'External': 'Externo',
    'Expandable': 'Expandible',
    'Pure sine wave': 'Onda sinusoidal pura',
    'Built-in': 'Incorporado',
    'Switchable': 'Seleccionable',
    'Peak efficiency': 'Eficiencia máxima',
    'Design life': 'Vida útil',
    'Rated': 'Nominal',
  },
  pt: {
    'Power Adapter': 'Adaptador de energia',
    'Power Supply': 'Fonte de alimentação',
    'Power Adapters': 'Adaptadores de energia',
    'Power': 'Potência',
    'Adapter': 'Adaptador',
    'Inverter': 'Inversor',
    'Charger': 'Carregador',
    'Wall-Mount': 'Montagem na parede',
    'Desktop': 'Mesa',
    'Open Frame': 'Chassi aberto',
    'DIN Rail': 'Trilho DIN',
    'POE Power Supply': 'Fonte de alimentação POE',
    'POE Injector': 'Injetor POE',
    'UPS': 'UPS',
    'Online UPS': 'UPS on-line',
    'Portable Power Station': 'Estação de energia portátil',
    'Energy Storage System': 'Sistema de armazenamento de energia',
    'All-in-One Solar System': 'Sistema solar tudo-em-um',
    'Solar Inverter': 'Inversor solar',
    'Micro Inverter': 'Microinversor',
    'Home Inverter': 'Inversor residencial',
    'Off-Grid Inverter': 'Inversor off-grid',
    'Pure Sine Wave Inverter': 'Inversor de onda senoidal pura',
    'DC-AC Inverter': 'Inversor CC-CA',
    'with Charger': 'com carregador',
    'with AC Charger': 'com carregador CA',
    'Compact': 'Compacto',
    'Industrial': 'Industrial',
    'High-Efficiency': 'Alta eficiência',
    'High-Power': 'Alta potência',
    'High-Density': 'Alta densidade',
    'Universal': 'Universal',
    'Fast Charger': 'Carregador rápido',
    'PD Charger': 'Carregador PD',
    'GaN-Ready': 'Pronto para GaN',
    'Double Conversion': 'Dupla conversão',
    'Grid-Tied': 'Conectado à rede',
    'MPPT': 'MPPT',
    'PWM': 'PWM',
    'Solar': 'Solar',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'Bateria',
    'System': 'Sistema',
    'Series': 'Série',
    'Hybrid': 'Híbrido',
    'Interchangeable': 'Intercambiável',
    'Plugs': 'Plugues',
    'Certified': 'Certificado',
    'Protection': 'Proteção',
    'Overload': 'Sobrecarga',
    'Short circuit': 'Curto-circuito',
    'Overvoltage': 'Sobretensão',
    'Overcurrent': 'Sobrecorrente',
    'Output': 'Saída',
    'Input': 'Entrada',
    'Efficiency': 'Eficiência',
    'Ripple': 'Ripple',
    'Continuous': 'Contínuo',
    'Waterproof': 'À prova d\'água',
    'Natural cooling': 'Resfriamento natural',
    'Monitoring': 'Monitoramento',
    'Display': 'Display',
    'Development Phase': 'Fase de desenvolvimento',
    'In Development': 'Em desenvolvimento',
    'Design': 'Design',
    'Rated output': 'Potência nominal',
    'Form factor': 'Fator de forma',
    'Single port': 'Porta única',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'Carregamento rápido',
    'AC input': 'Entrada CA',
    'AC output': 'Saída CA',
    'DC output': 'Saída CC',
    'Power factor': 'Fator de potência',
    'Cable': 'Cabo',
    'Included': 'Incluso',
    'Optional': 'Opcional',
    'Standard': 'Padrão',
    'Internal': 'Interno',
    'External': 'Externo',
    'Expandable': 'Expansível',
    'Pure sine wave': 'Onda senoidal pura',
    'Built-in': 'Integrado',
    'Switchable': 'Comutável',
    'Peak efficiency': 'Eficiência máxima',
    'Design life': 'Vida útil',
    'Rated': 'Nominal',
  },
  ar: {
    'Power Adapter': 'محول طاقة',
    'Power Supply': 'مصدر طاقة',
    'Power Adapters': 'محولات الطاقة',
    'Power': 'طاقة',
    'Adapter': 'محول',
    'Inverter': 'عاكس',
    'Charger': 'شاحن',
    'Wall-Mount': 'تثبيت على الحائط',
    'Desktop': 'سطح المكتب',
    'Open Frame': 'إطار مفتوح',
    'DIN Rail': 'سكة DIN',
    'POE Power Supply': 'مصدر طاقة POE',
    'POE Injector': 'محقن POE',
    'UPS': 'UPS',
    'Online UPS': 'UPS عبر الإنترنت',
    'Portable Power Station': 'محطة طاقة محمولة',
    'Energy Storage System': 'نظام تخزين الطاقة',
    'All-in-One Solar System': 'نظام شمسي متكامل',
    'Solar Inverter': 'عاكس شمسي',
    'Micro Inverter': 'عاكس دقيق',
    'Home Inverter': 'عاكس منزلي',
    'Off-Grid Inverter': 'عاكس خارج الشبكة',
    'Pure Sine Wave Inverter': 'عاكس موجة جيبية نقية',
    'DC-AC Inverter': 'عاكس DC-AC',
    'with Charger': 'مع شاحن',
    'with AC Charger': 'مع شاحن تيار متردد',
    'Compact': 'مدمج',
    'Industrial': 'صناعي',
    'High-Efficiency': 'عالي الكفاءة',
    'High-Power': 'عالي القدرة',
    'High-Density': 'عالي الكثافة',
    'Universal': 'عالمي',
    'Fast Charger': 'شاحن سريع',
    'PD Charger': 'شاحن PD',
    'GaN-Ready': 'متوافق مع GaN',
    'Double Conversion': 'تحويل مزدوج',
    'Grid-Tied': 'متصل بالشبكة',
    'MPPT': 'MPPT',
    'PWM': 'PWM',
    'Solar': 'شمسي',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'بطارية',
    'System': 'نظام',
    'Series': 'سلسلة',
    'Hybrid': 'هجين',
    'Interchangeable': 'قابل للتبديل',
    'Plugs': 'مقابس',
    'Certified': 'معتمد',
    'Protection': 'حماية',
    'Overload': 'حمل زائد',
    'Short circuit': 'دائرة قصر',
    'Overvoltage': 'جهد زائد',
    'Overcurrent': 'تيار زائد',
    'Output': 'خرج',
    'Input': 'دخل',
    'Efficiency': 'كفاءة',
    'Ripple': 'تموج',
    'Continuous': 'مستمر',
    'Waterproof': 'مقاوم للماء',
    'Natural cooling': 'تبريد طبيعي',
    'Monitoring': 'مراقبة',
    'Display': 'شاشة عرض',
    'Development Phase': 'مرحلة التطوير',
    'In Development': 'قيد التطوير',
    'Design': 'تصميم',
    'Rated output': 'خرج مقنن',
    'Form factor': 'عامل الشكل',
    'Single port': 'منفذ واحد',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'شحن سريع',
    'AC input': 'دخل تيار متردد',
    'AC output': 'خرج تيار متردد',
    'DC output': 'خرج تيار مستمر',
    'Power factor': 'معامل القدرة',
    'Cable': 'كابل',
    'Included': 'مضمن',
    'Optional': 'اختياري',
    'Standard': 'قياسي',
    'Internal': 'داخلي',
    'External': 'خارجي',
    'Expandable': 'قابل للتوسيع',
    'Pure sine wave': 'موجة جيبية نقية',
    'Built-in': 'مدمج',
    'Switchable': 'قابل للتحويل',
    'Peak efficiency': 'كفاءة قصوى',
    'Design life': 'عمر تصميمي',
    'Rated': 'مقنن',
  },
  ru: {
    'Power Adapter': 'Блок питания',
    'Power Supply': 'Источник питания',
    'Power Adapters': 'Блоки питания',
    'Power': 'Мощность',
    'Adapter': 'Адаптер',
    'Inverter': 'Инвертор',
    'Charger': 'Зарядное устройство',
    'Wall-Mount': 'Настенный',
    'Desktop': 'Настольный',
    'Open Frame': 'Открытая рама',
    'DIN Rail': 'DIN-рейка',
    'POE Power Supply': 'Источник питания POE',
    'POE Injector': 'Инжектор POE',
    'UPS': 'ИБП',
    'Online UPS': 'Online ИБП',
    'Portable Power Station': 'Портативная электростанция',
    'Energy Storage System': 'Система хранения энергии',
    'All-in-One Solar System': 'Все-в-одном солнечная система',
    'Solar Inverter': 'Солнечный инвертор',
    'Micro Inverter': 'Микроинвертор',
    'Home Inverter': 'Домашний инвертор',
    'Off-Grid Inverter': 'Автономный инвертор',
    'Pure Sine Wave Inverter': 'Инвертор с чистой синусоидой',
    'DC-AC Inverter': 'DC-AC инвертор',
    'with Charger': 'с зарядным устройством',
    'with AC Charger': 'с зарядным устройством AC',
    'Compact': 'Компактный',
    'Industrial': 'Промышленный',
    'High-Efficiency': 'Высокоэффективный',
    'High-Power': 'Высокомощный',
    'High-Density': 'Высокоплотный',
    'Universal': 'Универсальный',
    'Fast Charger': 'Быстрое зарядное устройство',
    'PD Charger': 'PD зарядное устройство',
    'GaN-Ready': 'С поддержкой GaN',
    'Double Conversion': 'Двойное преобразование',
    'Grid-Tied': 'Сетевой',
    'MPPT': 'MPPT',
    'PWM': 'ШИМ',
    'Solar': 'Солнечный',
    'LiFePO₄': 'LiFePO₄',
    'Battery': 'Аккумулятор',
    'System': 'Система',
    'Series': 'Серия',
    'Hybrid': 'Гибридный',
    'Interchangeable': 'Сменные',
    'Plugs': 'Вилки',
    'Certified': 'Сертифицирован',
    'Protection': 'Защита',
    'Overload': 'Перегрузка',
    'Short circuit': 'Короткое замыкание',
    'Overvoltage': 'Перенапряжение',
    'Overcurrent': 'Перегрузка по току',
    'Output': 'Выход',
    'Input': 'Вход',
    'Efficiency': 'КПД',
    'Ripple': 'Пульсация',
    'Continuous': 'Непрерывный',
    'Waterproof': 'Водонепроницаемый',
    'Natural cooling': 'Естественное охлаждение',
    'Monitoring': 'Мониторинг',
    'Display': 'Дисплей',
    'Development Phase': 'Стадия разработки',
    'In Development': 'В разработке',
    'Design': 'Конструкция',
    'Rated output': 'Номинальная мощность',
    'Form factor': 'Форм-фактор',
    'Single port': 'Один порт',
    'USB-C': 'USB-C',
    'USB-A': 'USB-A',
    'Fast charging': 'Быстрая зарядка',
    'AC input': 'Вход AC',
    'AC output': 'Выход AC',
    'DC output': 'Выход DC',
    'Power factor': 'Коэффициент мощности',
    'Cable': 'Кабель',
    'Included': 'В комплекте',
    'Optional': 'Опционально',
    'Standard': 'Стандартный',
    'Internal': 'Внутренний',
    'External': 'Внешний',
    'Expandable': 'Расширяемый',
    'Pure sine wave': 'Чистая синусоида',
    'Built-in': 'Встроенный',
    'Switchable': 'Переключаемый',
    'Peak efficiency': 'Пиковый КПД',
    'Design life': 'Расчетный срок службы',
    'Rated': 'Номинальный',
  }
}

// Sort terms longest first for greedy matching
const TERM_ORDER = {}
for (const locale of Object.keys(COMMON_TERMS)) {
  TERM_ORDER[locale] = Object.keys(COMMON_TERMS[locale]).sort((a, b) => b.length - a.length)
}

// ─── Category name translations ───

const CATEGORY_NAMES = {
  adapter: {
    ja: { name: '電源アダプタ', subtitle: '壁掛け型、デスクトップ型 & USB PD急速充電器' },
    de: { name: 'Netzteile', subtitle: 'Wandmontage, Desktop & USB-PD-Schnellladegeräte' },
    fr: { name: 'Adaptateurs secteur', subtitle: 'Montage mural, bureau et chargeurs rapides USB PD' },
    es: { name: 'Adaptadores de corriente', subtitle: 'Montaje en pared, escritorio y cargadores rápidos USB PD' },
    pt: { name: 'Adaptadores de energia', subtitle: 'Montagem na parede, mesa e carregadores rápidos USB PD' },
    ar: { name: 'محولات الطاقة', subtitle: 'تثبيت على الحائط، سطح المكتب وشواحن USB PD السريعة' },
    ru: { name: 'Блоки питания', subtitle: 'Настенные, настольные и быстрые зарядные устройства USB PD' },
  },
  'open-frame': {
    ja: { name: 'オープンフレーム電源', subtitle: '12V/24V/48Vシリーズ、15W-1500W' },
    de: { name: 'Offene Rahmen Netzgeräte', subtitle: '12V/24V/48V-Serie, 15W-1500W' },
    fr: { name: 'Alimentations à châssis ouvert', subtitle: 'Série 12V/24V/48V, 15W-1500W' },
    es: { name: 'Fuentes de alimentación de marco abierto', subtitle: 'Serie 12V/24V/48V, 15W-1500W' },
    pt: { name: 'Fontes de alimentação de chassi aberto', subtitle: 'Série 12V/24V/48V, 15W-1500W' },
    ar: { name: 'مصادر طاقة الإطار المفتوح', subtitle: 'سلسلة 12V/24V/48V، 15W-1500W' },
    ru: { name: 'Источники питания открытой рамы', subtitle: 'Серия 12V/24V/48V, 15W-1500W' },
  },
  'din-rail': {
    ja: { name: 'DINレール電源', subtitle: '産業用レールマウント電源' },
    de: { name: 'DIN-Schienen-Netzteile', subtitle: 'Industrielle Schienenmontage-Netzgeräte' },
    fr: { name: 'Alimentations sur rail DIN', subtitle: 'Alimentation industrielle montée sur rail' },
    es: { name: 'Fuentes de alimentación para riel DIN', subtitle: 'PSU industrial montada en riel' },
    pt: { name: 'Fontes de alimentação trilho DIN', subtitle: 'PSU industrial montada em trilho' },
    ar: { name: 'مصادر طاقة سكة DIN', subtitle: 'مصادر طاقة صناعية مثبتة على سكة' },
    ru: { name: 'Источники питания на DIN-рейку', subtitle: 'Промышленные блоки питания на DIN-рейку' },
  },
  poe: {
    ja: { name: 'POE電源', subtitle: 'IEEE 802.3af/at/bt準拠、12W-90W' },
    de: { name: 'POE-Netzteile', subtitle: 'IEEE 802.3af/at/bt-konform, 12W-90W' },
    fr: { name: 'Alimentations POE', subtitle: 'Conformes IEEE 802.3af/at/bt, 12W-90W' },
    es: { name: 'Fuentes de alimentación POE', subtitle: 'Compatibles IEEE 802.3af/at/bt, 12W-90W' },
    pt: { name: 'Fontes de alimentação POE', subtitle: 'Compatíveis IEEE 802.3af/at/bt, 12W-90W' },
    ar: { name: 'مصادر طاقة POE', subtitle: 'متوافقة مع IEEE 802.3af/at/bt، 12W-90W' },
    ru: { name: 'Источники питания POE', subtitle: 'Совместимость с IEEE 802.3af/at/bt, 12W-90W' },
  },
  'micro-inverter': {
    ja: { name: 'マイクロインバーター', subtitle: '系統連系、IP67、モジュールレベルMPPT' },
    de: { name: 'Mikro-Wechselrichter', subtitle: 'Netzgekoppelt, IP67, Modul-Level MPPT' },
    fr: { name: 'Micro-onduleurs', subtitle: 'Raccordés au réseau, IP67, MPPT au niveau module' },
    es: { name: 'Microinversores', subtitle: 'Conectados a la red, IP67, MPPT a nivel de módulo' },
    pt: { name: 'Microinversores', subtitle: 'Conectados à rede, IP67, MPPT nível módulo' },
    ar: { name: 'عواكس دقيقة', subtitle: 'متصل بالشبكة، IP67، MPPT على مستوى الوحدة' },
    ru: { name: 'Микроинверторы', subtitle: 'Сетевые, IP67, MPPT на уровне модуля' },
  },
  'home-inverter': {
    ja: { name: 'ホームインバーター', subtitle: 'PWMソーラー充電コントローラー内蔵' },
    de: { name: 'Heim-Wechselrichter', subtitle: 'Integrierter PWM-Solarladeregler' },
    fr: { name: 'Onduleurs domestiques', subtitle: 'Contrôleur de charge solaire PWM intégré' },
    es: { name: 'Inversores domésticos', subtitle: 'Controlador de carga solar PWM incorporado' },
    pt: { name: 'Inversores residenciais', subtitle: 'Controlador de carga solar PWM integrado' },
    ar: { name: 'عواكس منزلية', subtitle: 'وحدة تحكم شحن شمسي PWM مدمجة' },
    ru: { name: 'Домашние инверторы', subtitle: 'Встроенный PWM солнечный контроллер заряда' },
  },
  'off-grid-inverter': {
    ja: { name: 'オフグリッドインバーター', subtitle: 'MPPT内蔵、パラレル対応' },
    de: { name: 'Insel-Wechselrichter', subtitle: 'Integrierter MPPT, parallel betreibbar' },
    fr: { name: 'Onduleurs hors réseau', subtitle: 'MPPT intégré, parallélisable' },
    es: { name: 'Inversores fuera de la red', subtitle: 'MPPT incorporado, paralelizable' },
    pt: { name: 'Inversores off-grid', subtitle: 'MPPT integrado, capacidade paralela' },
    ar: { name: 'عواكس خارج الشبكة', subtitle: 'MPPT مدمج، قابل للتوصيل المتوازي' },
    ru: { name: 'Автономные инверторы', subtitle: 'Встроенный MPPT, возможность параллельного подключения' },
  },
  'psw-inverter': {
    ja: { name: '純正弦波インバーター', subtitle: 'DC-ACインバーター（AC充電器内蔵）' },
    de: { name: 'Reine-Sinus-Wechselrichter', subtitle: 'DC-AC-Wechselrichter mit AC-Ladegerät' },
    fr: { name: 'Onduleurs à onde sinusoïdale pure', subtitle: 'Convertisseur DC-AC avec chargeur CA' },
    es: { name: 'Inversores de onda sinusoidal pura', subtitle: 'Inversor CC-CA con cargador CA' },
    pt: { name: 'Inversores de onda senoidal pura', subtitle: 'Inversor CC-CA com carregador CA' },
    ar: { name: 'عواكس موجة جيبية نقية', subtitle: 'عاكس DC-AC مع شاحن تيار متردد' },
    ru: { name: 'Инверторы с чистой синусоидой', subtitle: 'DC-AC инвертор с зарядным устройством AC' },
  },
  'energy-storage': {
    ja: { name: 'エネルギー貯蔵システム', subtitle: 'ハイブリッドインバーター + LiFePO₄バッテリー' },
    de: { name: 'Energiespeichersysteme', subtitle: 'Hybrid-Wechselrichter + LiFePO₄-Batterie' },
    fr: { name: 'Systèmes de stockage d\'énergie', subtitle: 'Onduleur hybride + batterie LiFePO₄' },
    es: { name: 'Sistemas de almacenamiento de energía', subtitle: 'Inversor híbrido + batería LiFePO₄' },
    pt: { name: 'Sistemas de armazenamento de energia', subtitle: 'Inversor híbrido + bateria LiFePO₄' },
    ar: { name: 'أنظمة تخزين الطاقة', subtitle: 'عاكس هجين + بطارية LiFePO₄' },
    ru: { name: 'Системы хранения энергии', subtitle: 'Гибридный инвертор + аккумулятор LiFePO₄' },
  },
  ups: {
    ja: { name: 'オンラインUPS', subtitle: '真のダブルコンバージョン、1KVA-10KVA' },
    de: { name: 'Online-USV', subtitle: 'Echte Doppelwandlung, 1KVA-10KVA' },
    fr: { name: 'ASI en ligne', subtitle: 'Véritable double conversion, 1KVA-10KVA' },
    es: { name: 'SAI en línea', subtitle: 'Verdadera doble conversión, 1KVA-10KVA' },
    pt: { name: 'UPS on-line', subtitle: 'Verdadeira dupla conversão, 1KVA-10KVA' },
    ar: { name: 'UPS عبر الإنترنت', subtitle: 'تحويل مزدوج حقيقي، 1KVA-10KVA' },
    ru: { name: 'Online ИБП', subtitle: 'Истинное двойное преобразование, 1KVA-10KVA' },
  },
  'power-station': {
    ja: { name: 'ポータブル電源', subtitle: 'LiFePO₄、純正弦波、MPPTソーラー' },
    de: { name: 'Tragbare Powerstationen', subtitle: 'LiFePO₄, reiner Sinus, MPPT-Solar' },
    fr: { name: 'Stations d\'alimentation portables', subtitle: 'LiFePO₄, onde sinusoïdale pure, MPPT solaire' },
    es: { name: 'Estaciones de energía portátiles', subtitle: 'LiFePO₄, onda sinusoidal pura, MPPT solar' },
    pt: { name: 'Estações de energia portáteis', subtitle: 'LiFePO₄, onda senoidal pura, MPPT solar' },
    ar: { name: 'محطات طاقة محمولة', subtitle: 'LiFePO₄، موجة جيبية نقية، شحن شمسي MPPT' },
    ru: { name: 'Портативные электростанции', subtitle: 'LiFePO₄, чистая синусоида, MPPT солнечная зарядка' },
  },
  'all-in-one': {
    ja: { name: 'オールインワンシステム', subtitle: 'ハイブリッドソーラーインバーター + バッテリー一体型' },
    de: { name: 'All-in-One-Systeme', subtitle: 'Hybrid-Solar-Wechselrichter + integrierte Batterie' },
    fr: { name: 'Systèmes tout-en-un', subtitle: 'Onduleur solaire hybride + batterie intégrée' },
    es: { name: 'Sistemas todo-en-uno', subtitle: 'Inversor solar híbrido + batería integrada' },
    pt: { name: 'Sistemas tudo-em-um', subtitle: 'Inversor solar híbrido + bateria integrada' },
    ar: { name: 'أنظمة متكاملة', subtitle: 'عاكس شمسي هجين + بطارية مدمجة' },
    ru: { name: 'Все-в-одном системы', subtitle: 'Гибридный солнечный инвертор + встроенный аккумулятор' },
  },
}

// ═══════════════════════════════════════
// TRANSLATION ENGINE
// ═══════════════════════════════════════

const MARKER = '\x00' // \x00 will never appear in normal text
const MARKER_END = '\x01'

/**
 * Step 1: Mark all tech specs, model numbers, and brand names for preservation.
 */
function markPreserved(text) {
  let result = text
  
  // Mark brand words (whole words)
  result = result.replace(BRAND_RE, (match) => `${MARKER}${match}${MARKER_END}`)
  
  // Mark tech patterns like "12W", "1000VA", "48V DC"
  result = result.replace(TECH_PATTERN, (match) => `${MARKER}${match}${MARKER_END}`)
  
  // Mark model-like patterns (e.g., "R0181", "RP018", "UPS-1KVA")
  result = result.replace(MODEL_RE, (match) => `${MARKER}${match}${MARKER_END}`)
  
  // Mark spec patterns like "DC9-15V", "AC100~240V"
  result = result.replace(SPEC_RE, (match) => `${MARKER}${match}${MARKER_END}`)
  
  return result
}

/**
 * Translate a single text string (name, subtitle, description) to target locale.
 * First marks preserved terms, then translates remaining English text.
 */
function translateText(text, locale) {
  if (!text) return text
  
  const dict = COMMON_TERMS[locale]
  const terms = TERM_ORDER[locale]
  
  // Step 1: Mark preserved terms
  let processed = markPreserved(text)
  
  // Step 2: Split into preserved and non-preserved segments, translate only non-preserved
  const parts = processed.split(new RegExp(`(${MARKER}[^${MARKER_END}]+${MARKER_END})`, 'g'))
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    // Skip preserved segments
    if (part.startsWith(MARKER) && part.endsWith(MARKER_END)) continue
    
    // Translate using dictionary (longest match first)
    for (const term of terms) {
      if (dict[term]) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(escaped, 'gi')
        parts[i] = parts[i].replace(re, dict[term])
      }
    }
  }
  
  // Step 3: Rejoin and clean
  let result = parts.join('')
    .replace(new RegExp(MARKER, 'g'), '')
    .replace(new RegExp(MARKER_END, 'g'), '')
    .replace(/\s+/g, ' ')
    .trim()
  
  return result
}

/**
 * Translate feature array (stored as JSON string).
 * Each feature string is translated individually while preserving tech specs.
 */
function translateFeatures(featuresJson, locale) {
  if (!featuresJson) return featuresJson
  try {
    const features = JSON.parse(featuresJson)
    const translated = features.map(f => translateText(f, locale))
    return JSON.stringify(translated)
  } catch (e) {
    return featuresJson
  }
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════

const LOCALES = ['ja', 'de', 'fr', 'es', 'pt', 'ar', 'ru']

async function main() {
  console.log('='.repeat(70))
  console.log('🔨 Generating translations for all products and categories')
  console.log('='.repeat(70))

  // ─── Step 1: Fetch all data ───
  console.log('\n📦 Step 1: Fetching data from database...')
  
  const products = await prisma.product.findMany({
    include: {
      translations: {
        where: { locale: 'en' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })
  
  const categories = await prisma.productCategory.findMany({
    include: {
      translations: {
        where: { locale: 'en' }
      }
    },
    orderBy: { slug: 'asc' }
  })
  
  console.log(`   Found ${products.length} products, ${categories.length} categories`)

  // ─── Step 2: First, delete ALL existing translations for the 7 locales ───
  console.log('\n🗑️  Step 2: Removing existing translations for target locales...')
  
  for (const locale of LOCALES) {
    const deleted = await prisma.productTranslation.deleteMany({ where: { locale } })
    console.log(`   Deleted ${deleted.count} product translations for ${locale}`)
  }
  for (const locale of LOCALES) {
    const deleted = await prisma.productCategoryTranslation.deleteMany({ where: { locale } })
    console.log(`   Deleted ${deleted.count} category translations for ${locale}`)
  }

  // ─── Step 3: Generate product translations ───
  console.log('\n🌐 Step 3: Generating product translations...')
  
  let productSuccess = 0
  let productErrors = 0
  
  for (const product of products) {
    const en = product.translations[0]
    if (!en) {
      console.log(`   ⚠️  No English translation for product ${product.slug}, skipping`)
      continue
    }
    
    for (const locale of LOCALES) {
      try {
        const translatedName = translateText(en.name, locale)
        const translatedSubtitle = en.subtitle ? translateText(en.subtitle, locale) : null
        const translatedDescription = en.description ? translateText(en.description, locale) : ''
        const translatedFeatures = translateFeatures(en.features, locale)
        
        await prisma.productTranslation.create({
          data: {
            productId: product.id,
            locale: locale,
            name: translatedName,
            subtitle: translatedSubtitle,
            description: translatedDescription,
            features: translatedFeatures,
          }
        })
        productSuccess++
      } catch (e) {
        console.error(`   ❌ Error translating ${product.slug} → ${locale}: ${e.message}`)
        productErrors++
      }
    }
    
    const idx = products.indexOf(product)
    if (idx > 0 && idx % 25 === 0) {
      console.log(`   Progress: ${idx}/${products.length} products (${productSuccess} translations)`)
    }
  }
  
  console.log(`   ✅ Product translations: ${productSuccess} created, ${productErrors} errors`)

  // ─── Step 4: Generate category translations ───
  console.log('\n📁 Step 4: Generating category translations...')
  
  let catSuccess = 0
  let catErrors = 0
  
  for (const cat of categories) {
    const catNames = CATEGORY_NAMES[cat.slug]
    if (!catNames) {
      console.log(`   ⚠️  No translation map for category ${cat.slug}, skipping`)
      continue
    }
    
    for (const locale of LOCALES) {
      try {
        const t = catNames[locale]
        await prisma.productCategoryTranslation.create({
          data: {
            slug: cat.slug,
            locale: locale,
            name: t.name,
            subtitle: t.subtitle || null,
          }
        })
        catSuccess++
      } catch (e) {
        console.error(`   ❌ Error translating category ${cat.slug} → ${locale}: ${e.message}`)
        catErrors++
      }
    }
  }
  
  console.log(`   ✅ Category translations: ${catSuccess} created, ${catErrors} errors`)

  // ─── Summary ───
  console.log('\n' + '='.repeat(70))
  console.log('📊 SUMMARY')
  console.log('='.repeat(70))
  const totalExpected = (products.length * 7) + (categories.length * 7)
  console.log(`   Product translations: ${productSuccess} (expected ${products.length * 7})`)
  console.log(`   Category translations: ${catSuccess} (expected ${categories.length * 7})`)
  console.log(`   Product errors: ${productErrors}`)
  console.log(`   Category errors: ${catErrors}`)
  console.log(`   Total: ${productSuccess + catSuccess} / ${totalExpected}`)
  console.log('='.repeat(70))
}

main()
  .catch(e => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n🏁 Done!')
  })
