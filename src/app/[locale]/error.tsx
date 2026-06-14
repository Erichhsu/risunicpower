'use client'

import Link from 'next/link'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <div className="text-[6rem] font-bold text-[#F7D142] mb-4 leading-none">500</div>
        <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-4">Something went wrong</h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or contact us.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset}
            className="px-8 py-4 rounded-full bg-[#0f2a44] text-white text-[1.4rem] font-semibold hover:bg-[#1e4a7a] transition-colors"
          >Try Again</button>
          <Link href="/"
            className="px-8 py-4 rounded-full border-2 border-[#0f2a44] text-[#0f2a44] text-[1.4rem] font-semibold hover:bg-[#0f2a44] hover:text-white transition-all"
          >Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
