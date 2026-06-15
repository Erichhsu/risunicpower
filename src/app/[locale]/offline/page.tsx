import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export default async function OfflinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Offline' })
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <WifiOff size={48} className="mx-auto mb-6 text-[#F7D142]" />
        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] mb-4">
          {t('title')}
        </h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-8">
          {t('desc')}
        </p>
        <Link href={`/${l}`}
          className="inline-flex px-8 py-4 rounded-full bg-[#0f2a44] text-white text-[1.4rem] font-semibold hover:bg-[#1e4a7a] transition-colors"
        >
          {t('backHome')}
        </Link>
      </div>
    </main>
  )
}
