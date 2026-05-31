import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function Footer() {
  const locale = useLocale()
  const t = useTranslations('Footer')

  return (
    <footer className="bg-[#0a1628] text-white/60">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)] py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 28" className="w-7 h-6">
                <polygon points="16,1 30,8 30,20 16,27 2,20 2,8" fill="#c44a2b" />
              </svg>
              <span className="font-bold text-[1.8rem] text-white">RisunicPower</span>
            </div>
            <p className="text-[1.3rem] leading-relaxed">
              Industrial power supply manufacturer since 2008. CE, FCC, UL certified.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-[1.4rem] mb-4">{t('products')}</h4>
            <ul className="space-y-2 text-[1.3rem]">
              {['POE Power Supplies', 'Power Adapters', 'UPS Systems', 'Power Inverters', 'Portable Power Stations'].map(p => (
                <li key={p}>
                  <Link href={`/${locale}/products`} className="hover:text-white transition-colors">{p}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-[1.4rem] mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-[1.3rem]">
              {[
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={`/${locale}${item.href}`} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-[1.4rem] mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-[1.3rem]">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[1.2rem]">
          <p>© {new Date().getFullYear()} RisunicPower. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}
