'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Mail } from 'lucide-react'

const productSlugs = ['poe', 'adapter', 'open-frame', 'ups', 'inverter', 'power-station', 'micro-inverter', 'industrial', 'all-in-one']

const productLabels: Record<string, Record<string, string>> = {
  en: { poe: 'POE Power Supplies', adapter: 'Power Adapters', 'open-frame': 'Open Frame Power', ups: 'UPS Systems', inverter: 'Solar Inverters', 'power-station': 'Portable Power Stations', 'micro-inverter': 'Micro Inverters', industrial: 'Industrial Power', 'all-in-one': 'All-in-One Systems' },
  zh: { poe: 'POE电源', adapter: '电源适配器', 'open-frame': '裸板电源', ups: 'UPS不间断电源', inverter: '太阳能逆变器', 'power-station': '便携储能电源', 'micro-inverter': '微型逆变器', industrial: '工业电源', 'all-in-one': '一体机' },
}

const companyLabels: Record<string, Record<string, string>> = {
  en: { about: 'About Us', blog: 'Blog', solutions: 'Solutions', contact: 'Contact' },
  zh: { about: '关于我们', blog: '博客', solutions: '解决方案', contact: '联系我们' },
}

const legalLabels: Record<string, Record<string, string>> = {
  en: { privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookies: 'Cookie Policy' },
  zh: { privacy: '隐私政策', terms: '服务条款', cookies: 'Cookie政策' },
}

export default function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()

  const pl = productLabels[locale] || productLabels.en
  const cl = companyLabels[locale] || companyLabels.en
  const ll = legalLabels[locale] || legalLabels.en

  return (
    <footer className="bg-[#0f2a44] text-white">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)] py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href={`/${locale}`} className="font-brand text-[2rem] font-bold tracking-[-0.03em]">
              Risunic<span className="text-[#c44a2b]">Power</span>
            </Link>
            <p className="text-[1.3rem] text-[#b0bccd] mt-4 leading-[1.8] max-w-[28rem]">
              {t('brandDescription')}
            </p>
            <div className="flex items-center gap-2 text-[1.3rem] text-[#b0bccd] mt-4">
              <Mail size={14} />
              <a href="mailto:info@risunic.com" className="hover:text-[#c44a2b] transition-colors">info@risunic.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[1.4rem] mb-4 uppercase tracking-wider">{t('products')}</h4>
            <ul className="space-y-2">
              {productSlugs.map(slug => (
                <li key={slug}>
                  <Link href={`/${locale}/products/${slug}`}
                    className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors"
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
              <li><Link href={`/${locale}/about`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{cl.about}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{cl.blog}</Link></li>
              <li><Link href={`/${locale}/solutions`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{cl.solutions}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{cl.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[1.4rem] mb-4 uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/privacy`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{ll.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{ll.terms}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="text-[1.3rem] text-[#b0bccd] hover:text-white transition-colors">{ll.cookies}</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-washi my-10 opacity-30" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[1.2rem] text-[#6b7a8f]">
          <p>&copy; {new Date().getFullYear()} Shenzhen Risunic Technology Co., Ltd. All rights reserved.</p>
          <p>POE Power Supply | Adapter | UPS | Inverter | Power Station Manufacturer, China</p>
        </div>
      </div>
    </footer>
  )
}
