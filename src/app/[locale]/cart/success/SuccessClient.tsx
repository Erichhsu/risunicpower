'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Payment Successful!', desc: 'Thank you for your order. You will receive a confirmation email shortly.', orderId: 'Order ID', back: 'Continue Shopping', error: 'Unable to verify payment. Please contact support.', loading: 'Verifying payment...' },
  zh: { title: '\u652F\u4ED8\u6210\u529F\uFF01', desc: '\u8C22\u8C22\u60A8\u7684\u8BA2\u8D2D\uFF0C\u60A8\u5C06\u77ED\u4FE1\u6536\u5230\u786E\u8BA4\u90AE\u4EF6\u3002', orderId: '\u8BA2\u5355\u7F16\u53F7', back: '\u7EE7\u7EED\u8D2D\u7269', error: '\u65E0\u6CD5\u9A8C\u8BC1\u652F\u4ED8\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u3002', loading: '\u6B63\u5728\u9A8C\u8BC1\u652F\u4ED8...' },
  ja: { title: '\u652F\u6255\u3044\u6210\u529F\uFF01', desc: '\u3054\u8A3B\u6587\u3042\u308A\u304C\u3068\u3046\u3054\u3044\u307E\u3059\u3002\u78BA\u8A8D\u30E1\u30FC\u30EB\u3092\u304A\u9001\u308A\u3057\u307E\u3059\u3002', orderId: '\u8A3B\u6587\u756A\u53F7', back: '\u8CB7\u3044\u7269\u3092\u7D9A\u3051\u308B', error: '\u652F\u6255\u3044\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30B5\u30DD\u30FC\u30C8\u306B\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002', loading: '\u652F\u6255\u3044\u3092\u78BA\u8A8D\u4E2D...' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

export default function SuccessClient({ locale }: { locale: string }) {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [orderId, setOrderId] = useState('')
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          clearCart()
          setOrderId(data.id || sessionId.slice(0, 8))
          setStatus('success')
        } else {
          setStatus('success')
          setOrderId(sessionId.slice(0, 8))
        }
      } catch {
        clearCart()
        setStatus('success')
        setOrderId(sessionId.slice(0, 8))
      }
    }
    verify()
  }, [sessionId, clearCart])

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[600px] mx-auto px-[clamp(2rem,5vw,8rem)] text-center py-20">
        {status === 'loading' && (
          <div>
            <Loader2 size={48} className="mx-auto text-[#c44a2b] animate-spin mb-6" />
            <p className="text-[1.8rem] text-[#6b7a8f]">{lbl(locale, 'loading')}</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-24 h-24 rounded-full bg-[#0eb892]/10 flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-[#0eb892]" />
            </div>
            <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44] mb-4">{lbl(locale, 'title')}</h1>
            <p className="text-[1.6rem] text-[#6b7a8f] mb-6">{lbl(locale, 'desc')}</p>
            {orderId && (
              <div className="bg-[#f7f8fa] p-4 rounded-xl mb-8 inline-block">
                <span className="text-[1.2rem] text-[#6b7a8f]">{lbl(locale, 'orderId')}: </span>
                <span className="text-[1.4rem] font-mono font-bold text-[#0f2a44]">{orderId}</span>
              </div>
            )}
            <div className="divider-washi" />
            <Link href={`/${locale}/products`}
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/20"
            >
              {lbl(locale, 'back')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <div>
            <h1 className="text-[2.4rem] font-bold text-[#e74c3c] mb-4">404</h1>
            <p className="text-[1.6rem] text-[#6b7a8f]">{lbl(locale, 'error')}</p>
            <Link href={`/${locale}/contact`}
              className="inline-block mt-6 text-[1.4rem] font-medium text-[#c44a2b] hover:underline"
            >Contact Support</Link>
          </div>
        )}
      </div>
    </main>
  )
}
