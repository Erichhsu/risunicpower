import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export default async function OfflinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <WifiOff size={48} className="mx-auto mb-6 text-[#F7D142]" />
        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] mb-4">
          {l === 'zh' ? '当前无网络连接' : l === 'ja' ? 'オフラインです' : 'You\'re Offline'}
        </h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-8">
          {l === 'zh' ? '请检查您的网络连接后重试' : l === 'ja' ? 'ネットワーク接続を確認してください' : 'Please check your internet connection and try again'}
        </p>
        <Link href={`/${l}`}
          className="inline-flex px-8 py-4 rounded-full bg-[#0f2a44] text-white text-[1.4rem] font-semibold hover:bg-[#1e4a7a] transition-colors"
        >
          {l === 'zh' ? '返回首页' : l === 'ja' ? 'ホームに戻る' : 'Back to Home'}
        </Link>
      </div>
    </main>
  )
}
