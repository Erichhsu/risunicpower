'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Mail } from 'lucide-react'
import SocialLinks from '@/components/ui/SocialLinks'

const productSlugs = ['poe', 'ups', 'inverter', 'split-phase-inverter', 'backup-power', 'power-station', 'all-in-one', 'micro-inverter', 'solar-controller']

const productLabels: Record<string, Record<string, string>> = {
  en: { poe: 'POE Power Supplies', ups: 'UPS Systems', inverter: 'Power Inverters', 'split-phase-inverter': 'Split Phase Inverters', 'backup-power': 'Backup Power', 'power-station': 'Portable Power Stations', 'all-in-one': 'All-in-One ESS', 'micro-inverter': 'Micro Inverters', 'solar-controller': 'MPPT Solar Controllers' },
  zh: { poe: 'POE电源', ups: 'UPS不间断电源', inverter: '逆变器整机', 'split-phase-inverter': '裂相机', 'backup-power': '后备机', 'power-station': '便携储能电源', 'all-in-one': '一体机', 'micro-inverter': '微型逆变器', 'solar-controller': 'MPPT太阳能控制器' },
  ja: { poe: 'POE電源', ups: 'UPSシステム', inverter: 'インバーター', 'split-phase-inverter': '分割相インバーター', 'backup-power': 'バックアップ電源', 'power-station': 'ポータブル電源', 'all-in-one': '一体型ESS', 'micro-inverter': 'マイクロインバーター', 'solar-controller': 'MPPTソーラーコントローラー' },
  es: { poe: 'Fuentes de Alimentación PoE', ups: 'Sistemas UPS', inverter: 'Inversores de Potencia', 'split-phase-inverter': 'Inversores de Fase Dividida', 'backup-power': 'Energía de Respaldo', 'power-station': 'Estaciones de Energía Portátiles', 'all-in-one': 'ESS Todo en Uno', 'micro-inverter': 'Microinversores', 'solar-controller': 'Controladores Solares MPPT' },
  de: { poe: 'POE-Stromversorgungen', ups: 'USV-Systeme', inverter: 'Stromrichter', 'split-phase-inverter': 'Split-Phasen-Wechselrichter', 'backup-power': 'Notstromversorgung', 'power-station': 'Tragbare Kraftwerke', 'all-in-one': 'All-in-One ESS', 'micro-inverter': 'Mikro-Wechselrichter', 'solar-controller': 'MPPT-Solarregler' },
  fr: { poe: 'Alimentations PoE', ups: 'Systèmes UPS', inverter: 'Onduleurs', 'split-phase-inverter': 'Onduleurs Split Phase', 'backup-power': 'Alimentation de Secours', 'power-station': 'Centrales Électriques Portables', 'all-in-one': 'ESS Tout-en-Un', 'micro-inverter': 'Micro-onduleurs', 'solar-controller': 'Contrôleurs Solaires MPPT' },
  pt: { poe: 'Fontes de Alimentação POE', ups: 'Sistemas UPS', inverter: 'Inversores de Energia', 'split-phase-inverter': 'Inversores Split Phase', 'backup-power': 'Energia de Reserva', 'power-station': 'Estações de Energia Portáteis', 'all-in-one': 'ESS Tudo-em-Um', 'micro-inverter': 'Microinversores', 'solar-controller': 'Controladores Solares MPPT' },
  ar: { poe: 'مزودات طاقة POE', ups: 'أنظمة UPS', inverter: 'محولات الطاقة (إنفرتر)', 'split-phase-inverter': 'عاكسات الطور المنفصل', 'backup-power': 'طاقة احتياطية', 'power-station': 'محطات طاقة محمولة', 'all-in-one': 'نظام تخزين طاقة متكامل', 'micro-inverter': 'عاكسات صغيرة', 'solar-controller': 'وحدات تحكم شمسية MPPT' },
  ru: { poe: 'Источники питания POE', ups: 'Системы UPS', inverter: 'Инверторы питания', 'split-phase-inverter': 'Инверторы с разделенной фазой', 'backup-power': 'Резервное питание', 'power-station': 'Портативные электростанции', 'all-in-one': 'Все-в-одном ESS', 'micro-inverter': 'Микроинверторы', 'solar-controller': 'MPPT солнечные контроллеры' },
}

const companyLabels: Record<string, Record<string, string>> = {
  en: { about: 'About Us', blog: 'Blog', caseStudies: 'Case Studies', contact: 'Contact' },
  zh: { about: '关于我们', blog: '博客', caseStudies: '案例', contact: '联系我们' },
  ja: { about: '会社概要', blog: 'ブログ', caseStudies: '事例紹介', contact: 'お問い合わせ' },
  es: { about: 'Sobre Nosotros', blog: 'Blog', caseStudies: 'Casos de Estudio', contact: 'Contacto' },
  de: { about: 'Über uns', blog: 'Blog', caseStudies: 'Fallstudien', contact: 'Kontakt' },
  fr: { about: 'À propos', blog: 'Blog', caseStudies: 'Études de cas', contact: 'Contact' },
  pt: { about: 'Sobre Nós', blog: 'Blog', caseStudies: 'Estudos de Caso', contact: 'Contato' },
  ar: { about: 'من نحن', blog: 'المدونة', caseStudies: 'دراسات حالة', contact: 'اتصل بنا' },
  ru: { about: 'О нас', blog: 'Блог', caseStudies: 'Примеры внедрения', contact: 'Контакты' },
}

const legalLabels: Record<string, Record<string, string>> = {
  en: { privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookies: 'Cookie Policy' },
  zh: { privacy: '隐私政策', terms: '服务条款', cookies: 'Cookie政策' },
  ja: { privacy: 'プライバシーポリシー', terms: '利用規約', cookies: 'Cookieポリシー' },
  es: { privacy: 'Política de Privacidad', terms: 'Términos y Condiciones', cookies: 'Política de Cookies' },
  de: { privacy: 'Datenschutzerklärung', terms: 'Allgemeine Geschäftsbedingungen', cookies: 'Cookie-Richtlinie' },
  fr: { privacy: 'Politique de confidentialité', terms: 'Conditions générales', cookies: 'Politique relative aux cookies' },
  pt: { privacy: 'Política de Privacidade', terms: 'Termos e Condições', cookies: 'Política de Cookies' },
  ar: { privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام', cookies: 'سياسة ملفات تعريف الارتباط' },
  ru: { privacy: 'Политика конфиденциальности', terms: 'Условия и положения', cookies: 'Политика использования файлов cookie' },
}

export default function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()

  const pl = productLabels[locale] || productLabels.en
  const cl = companyLabels[locale] || companyLabels.en
  const ll = legalLabels[locale] || legalLabels.en

  return (
    <footer className="bg-[#0072A8] text-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)] py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href={`/${locale}`} className="text-[2rem] font-bold tracking-[-0.03em]">
              Risunic<span className="text-[#F7D142]">Power</span>
            </Link>
            <p className="text-[1.3rem] text-white/70 mt-4 leading-[1.8] max-w-[28rem]">
              {t('brandDescription')}
            </p>
            <div className="flex items-center gap-2 text-[1.3rem] text-white/70 mt-4">
              <Mail size={14} />
              <a href="mailto:erich.hsu@risunicpower.com" className="hover:text-[#F7D142] transition-colors">erich.hsu@risunicpower.com</a>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold text-[1.4rem] mb-3 uppercase tracking-wider">{t('connectWithUs')}</h4>
              <SocialLinks />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[1.4rem] mb-4 uppercase tracking-wider">{t('products')}</h4>
            <ul className="space-y-2">
              {productSlugs.map(slug => (
                <li key={slug}>
                  <Link href={`/${locale}/products/${slug}`}
                    className="text-[1.3rem] text-white/70 hover:text-white transition-colors"
                  >
                    {pl[slug] || slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[1.4rem] mb-4 uppercase tracking-wider">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/about`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{cl.about}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{cl.blog}</Link></li>
              <li><Link href={`/${locale}/case-studies`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{cl.caseStudies}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{cl.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[1.4rem] mb-4 uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/privacy`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{ll.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{ll.terms}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="text-[1.3rem] text-white/70 hover:text-white transition-colors">{ll.cookies}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-10 border-t border-white/20 text-[1.2rem] text-white/50">
          <p>&copy; {new Date().getFullYear()} Shenzhen Risunic Technology Co., Ltd. {t('rights')}</p>
          <p>{t('tagline')}</p>
        </div>
      </div>
    </footer>
  )
}
