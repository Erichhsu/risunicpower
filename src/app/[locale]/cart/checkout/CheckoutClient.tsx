'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2, ArrowLeft, CreditCard } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useTranslations } from 'next-intl'

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100)
}

export default function CheckoutClient({ locale }: { locale: string }) {
  const tChk = useTranslations('Checkout')
  const tCart = useTranslations('Cart')
  const { items, totalItems, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            name: i.name, price: i.price, quantity: i.quantity, image: i.image,
          })),
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      window.location.href = data.url
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('not configured') || msg.includes('STRIPE_SECRET_KEY')) {
        setError(tChk('nogkey'))
      } else {
        setError(tChk('error') || 'Payment initiation failed. Please try again.')
      }
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-[800px] mx-auto px-[clamp(2rem,5vw,8rem)] text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-[#e2e8ef] mb-6" />
          <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-4">{tChk('empty')}</h1>
          <Link href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all"
          ><ArrowLeft size={16} /> {tChk('cart')}</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[800px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44] mb-2">{tChk('title')}</h1>
        <p className="text-[1.6rem] text-[#6b7a8f] mb-10">{tChk('desc')}</p>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-4">
            {items.map(item => (
              <motion.div key={item.slug} layout
                className="flex gap-4 p-4 bg-white rounded-2xl border border-[#e2e8ef]"
              >
                <div className="w-16 h-16 rounded-xl bg-[#f7f8fa] flex items-center justify-center shrink-0">
                  <span className="text-[2rem] opacity-30">{'\uD83D\uDCF7'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[1.4rem] text-[#1a2332]">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[1.3rem] text-[#6b7a8f]">{tCart('quantity')}: {item.quantity}</span>
                    <span className="text-[1.4rem] font-semibold text-[#0f2a44]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 self-start">
            <motion.div layout className="bg-white rounded-2xl border border-[#e2e8ef] p-6 space-y-4">
              <h3 className="font-bold text-[1.6rem] text-[#0f2a44]">{tChk('orderSummary')}</h3>
              <div className="flex justify-between text-[1.4rem]">
                <span className="text-[#6b7a8f]">{tChk('items')} ({totalItems()})</span>
                <span className="font-medium">{formatPrice(totalPrice())}</span>
              </div>
              <hr className="border-t border-[#E2E8EF] my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-[1.4rem] text-[#6b7a8f]">{tChk('total')}</span>
                <span className="text-[2.4rem] font-bold text-[#F7D142]">{formatPrice(totalPrice())}</span>
              </div>

              {error && (
                <p className="text-[1.3rem] text-[#e74c3c] bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <button onClick={handleCheckout} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.5rem] hover:bg-[#9a3a1e] transition-colors disabled:opacity-60 shadow-lg shadow-[#F7D142]/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={18} />}
                {loading ? tChk('processing') : tChk('payWithStripe')}
              </button>

              <Link href={`/${locale}/cart`}
                className="block w-full text-center text-[1.3rem] text-[#6b7a8f] hover:text-[#F7D142] transition-colors"
              >
                <ArrowLeft size={14} className="inline mr-1" /> {tChk('backToCart')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
