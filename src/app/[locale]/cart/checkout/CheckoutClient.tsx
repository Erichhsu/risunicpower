'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2, ArrowLeft, CreditCard } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Checkout', desc: 'Review your order and proceed to payment', empty: 'Your cart is empty', browse: 'Continue Shopping', order: 'Order Summary', items: 'Items', total: 'Total', pay: 'Proceed to Payment', processing: 'Redirecting to payment...', error: 'Payment initiation failed. Please try again.', nogkey: 'Payment not configured yet' },
  zh: { title: '\u7ED3\u7B97', desc: '\u786E\u8BA4\u8BA2\u5355\u5E76\u8FDB\u884C\u652F\u4ED8', empty: '\u8D2D\u7269\u8F66\u662F\u7A7A\u7684', browse: '\u7EE7\u7EED\u8D2D\u7269', order: '\u8BA2\u5355\u6C47\u603B', items: '\u5546\u54C1', total: '\u5408\u8BA1', pay: '\u524D\u5F80\u652F\u4ED8', processing: '\u6B63\u5728\u8DF3\u8F6C\u652F\u4ED8...', error: '\u652F\u4ED8\u521D\u59CB\u5316\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002', nogkey: '\u652F\u4ED8\u5C1A\u672A\u914D\u7F6E' },
  ja: { title: '\u30EC\u30B8\u306B\u9032\u3080', desc: '\u8A3B\u6587\u3092\u78BA\u8A8D\u3057\u3066\u652F\u6255\u3044\u3078', empty: '\u30AB\u30FC\u30C8\u306F\u7A7A\u3067\u3059', browse: '\u8CB7\u3044\u7269\u3092\u7D9A\u3051\u308B', order: '\u8A3B\u6587\u6982\u8981', items: '\u5546\u54C1', total: '\u5408\u8A08', pay: '\u652F\u6255\u3044\u306B\u9032\u3080', processing: '\u652F\u6255\u3044\u30DA\u30FC\u30B8\u306B\u8EE2\u9001\u4E2D...', error: '\u652F\u6255\u3044\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F', nogkey: '\u652F\u6255\u3044\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100)
}

export default function CheckoutClient({ locale }: { locale: string }) {
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
        setError(lbl(locale, 'nogkey'))
      } else {
        setError(lbl(locale, 'error'))
      }
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-[800px] mx-auto px-[clamp(2rem,5vw,8rem)] text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-[#e2e8ef] mb-6" />
          <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-4">{lbl(locale, 'empty')}</h1>
          <Link href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all"
          ><ArrowLeft size={16} /> Cart</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[800px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44] mb-2">{lbl(locale, 'title')}</h1>
        <p className="text-[1.6rem] text-[#6b7a8f] mb-10">{lbl(locale, 'desc')}</p>

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
                    <span className="text-[1.3rem] text-[#6b7a8f]">Qty: {item.quantity}</span>
                    <span className="text-[1.4rem] font-semibold text-[#0f2a44]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 self-start">
            <motion.div layout className="bg-white rounded-2xl border border-[#e2e8ef] p-6 space-y-4">
              <h3 className="font-bold text-[1.6rem] text-[#0f2a44]">{lbl(locale, 'order')}</h3>
              <div className="flex justify-between text-[1.4rem]">
                <span className="text-[#6b7a8f]">{lbl(locale, 'items')} ({totalItems()})</span>
                <span className="font-medium">{formatPrice(totalPrice())}</span>
              </div>
              <div className="divider-washi my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-[1.4rem] text-[#6b7a8f]">{lbl(locale, 'total')}</span>
                <span className="text-[2.4rem] font-bold text-[#F7D142]">{formatPrice(totalPrice())}</span>
              </div>

              {error && (
                <p className="text-[1.3rem] text-[#e74c3c] bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <button onClick={handleCheckout} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.5rem] hover:bg-[#9a3a1e] transition-colors disabled:opacity-60 shadow-lg shadow-[#F7D142]/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={18} />}
                {loading ? lbl(locale, 'processing') : lbl(locale, 'pay')}
              </button>

              <Link href={`/${locale}/cart`}
                className="block w-full text-center text-[1.3rem] text-[#6b7a8f] hover:text-[#F7D142] transition-colors"
              >
                <ArrowLeft size={14} className="inline mr-1" /> Back to Cart
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
