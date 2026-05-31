import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/ui/CookieConsent'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import AIChat from '@/components/ai/AIChat'
import SearchDialog from '@/components/ui/SearchDialog'
import '../globals.css'

export const metadata: Metadata = {
  title: 'RisunicPower - Industrial Power Supply Manufacturer',
  description: 'POE power supplies, adapters, UPS, inverters, portable power stations. 18+ years R&D, serving 600+ clients globally.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <GoogleAnalytics />
          <AIChat />
          <SearchDialog locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
