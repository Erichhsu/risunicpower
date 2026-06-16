import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function NotFound({ params }: { params?: Promise<{ locale: string }> }) {
  let locale = 'en'
  try {
    if (params) {
      const resolved = await params
      locale = resolved?.locale || 'en'
    }
  } catch {
    locale = 'en'
  }

  const t = await getTranslations({ locale, namespace: 'NotFound' })

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
      <div className="text-center px-8">
        <div className="text-[8rem] font-bold text-[#0f2a44] leading-none mb-4 font-brand">404</div>
        <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-3">{t('title')}</h1>
        <p className="text-[1.6rem] text-[#6b7a8f] max-w-md mx-auto mb-10">
          {t('desc')}
        </p>
        <hr className="border-t border-[#E2E8EF] my-6" />
        <Link href={`/${locale}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#F7D142]/20"
        >
          {t('backHome')}
        </Link>
      </div>
    </main>
  )
}
