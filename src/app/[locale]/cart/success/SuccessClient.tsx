'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useTranslations } from 'next-intl'

export default function SuccessClient({ locale }: { locale: string }) {
  const t = useTranslations('Payment')
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
            <Loader2 size={48} className="mx-auto text-[#F7D142] animate-spin mb-6" />
            <p className="text-[1.8rem] text-[#6b7a8f]">{t('loading')}</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-24 h-24 rounded-full bg-[#0eb892]/10 flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-[#0eb892]" />
            </div>
            <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44] mb-4">{t('title')}</h1>
            <p className="text-[1.6rem] text-[#6b7a8f] mb-6">{t('desc')}</p>
            {orderId && (
              <div className="bg-[#f7f8fa] p-4 rounded-xl mb-8 inline-block">
                <span className="text-[1.2rem] text-[#6b7a8f]">{t('orderId')}: </span>
                <span className="text-[1.4rem] font-mono font-bold text-[#0f2a44]">{orderId}</span>
              </div>
            )}
            <hr className="border-t border-[#E2E8EF] my-6" />
            <Link href={`/${locale}/products`}
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#F7D142]/20"
            >
              {t('backToShop')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <div>
            <h1 className="text-[2.4rem] font-bold text-[#e74c3c] mb-4">404</h1>
            <p className="text-[1.6rem] text-[#6b7a8f]">{t('error')}</p>
            <Link href={`/${locale}/contact`}
              className="inline-block mt-6 text-[1.4rem] font-medium text-[#F7D142] hover:underline"
            >{t('contactSupport')}</Link>
          </div>
        )}
      </div>
    </main>
  )
}
