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

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
      <div className="text-center px-8">
        <div className="text-[8rem] font-bold text-[#0f2a44] leading-none mb-4 font-brand">404</div>
        <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-3">Page Not Found</h1>
        <p className="text-[1.6rem] text-[#6b7a8f] max-w-md mx-auto mb-10">
          The page you are looking for might have been moved or no longer exists.
        </p>
        <div className="divider-washi" />
        <Link href={`/${locale}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/20"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
