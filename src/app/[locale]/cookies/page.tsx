import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Cookies' })
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[800px] px-6">
        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] mb-6">{t('title')}</h1>
        <p className="text-[1.4rem] leading-relaxed text-[#6b7a8f] mb-8">{t('desc')}</p>
        <Link href={`/${l}`} className="inline-flex px-6 py-3 rounded-full bg-[#0f2a44] text-white text-[1.3rem] font-semibold hover:bg-[#1e4a7a] transition-colors">{t('backHome')}</Link>
      </div>
    </main>
  )
}
