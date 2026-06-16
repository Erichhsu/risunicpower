import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/ui/CookieConsent'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import AIChat from '@/components/ai/AIChat'
import SearchDialog from '@/components/ui/SearchDialog'
import LocaleAttributes from '@/components/ui/LocaleAttributes'

export const metadata: Metadata = {
  title: { default: 'RisunicPower - Industrial Power Supply Manufacturer', template: '%s — RisunicPower' },
  description: 'POE power supplies, adapters, UPS, inverters, portable power stations. 12+ years R&D, serving 600+ clients globally.',
  openGraph: {
    type: 'website', locale: 'en_US', siteName: 'RisunicPower',
    title: 'RisunicPower - Industrial Power Supply Manufacturer',
    description: 'POE power supplies, adapters, UPS, inverters, portable power stations. 12+ years R&D, serving 600+ clients globally.',
    url: 'https://risunicpower.com', images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'RisunicPower', description: 'Industrial power supply manufacturer since 2014.' },
  alternates: {
    canonical: 'https://risunicpower.com',
    languages: {
      en: 'https://risunicpower.com/en', zh: 'https://risunicpower.com/zh', ja: 'https://risunicpower.com/ja',
      es: 'https://risunicpower.com/es', de: 'https://risunicpower.com/de', fr: 'https://risunicpower.com/fr',
      pt: 'https://risunicpower.com/pt', ar: 'https://risunicpower.com/ar', ru: 'https://risunicpower.com/ru',
    },
  },
  icons: { icon: '/favicon.ico', apple: '/apple-icon.png' },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RisunicPower',
    alternateName: 'Shenzhen Risunic Technology Co., Ltd.',
    url: 'https://risunicpower.com',
    logo: 'https://risunicpower.com/logo.png',
    description: 'Industrial power supply manufacturer since 2014. OEM/ODM, global shipping, CE FCC UL RoHS certified.',
    contactPoint: { '@type': 'ContactPoint', telephone: '+86-755-23500205', contactType: 'sales', email: 'erich.hsu@risunicpower.com' },
    sameAs: ['https://linkedin.com/company/risunicpower'],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent locale={locale} />
        <GoogleAnalytics />
        <AIChat />
        <SearchDialog locale={locale} />
      </NextIntlClientProvider>
      <LocaleAttributes locale={locale} />
    </>
  )
}
