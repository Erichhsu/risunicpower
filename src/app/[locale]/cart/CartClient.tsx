'use client'

import Link from 'next/link'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Shopping Cart', empty: 'Your cart is empty', browse: 'Browse Products', product: 'Product', quantity: 'Qty', total: 'Total', subtotal: 'Subtotal', checkout: 'Proceed to Checkout', inquiry: 'Need wholesale pricing?', continue: 'Continue Shopping', remove: 'Remove', clear: 'Clear Cart', shipping: 'Shipping & taxes calculated at checkout' },
  zh: { title: '\u8D2D\u7269\u8F66', empty: '\u8D2D\u7269\u8F66\u662F\u7A7A\u7684', browse: '\u53BB\u901B\u901B', product: '\u5546\u54C1', quantity: '\u6570\u91CF', total: '\u5408\u8BA1', subtotal: '\u5C0F\u8BA1', checkout: '\u53BB\u7ED3\u7B97', inquiry: '\u9700\u8981\u6279\u91CF\u62A5\u4EF7\uFF1F', continue: '\u7EE7\u7EED\u8D2D\u7269', remove: '\u5220\u9664', clear: '\u6E05\u7A7A\u8D2D\u7269\u8F66', shipping: '\u8FD0\u8D39\u53CA\u7A0E\u8D39\u5728\u7ED3\u7B97\u65F6\u8BA1\u7B97' },
  ja: { title: '\u30AB\u30FC\u30C8', empty: '\u30AB\u30FC\u30C8\u306F\u7A7A\u3067\u3059', browse: '\u88FD\u54C1\u3092\u898B\u308B', product: '\u5546\u54C1', quantity: '\u6570\u91CF', total: '\u5408\u8A08', subtotal: '\u5C0F\u8A08', checkout: '\u30EC\u30B8\u306B\u9032\u3080', inquiry: '\u5378\u58F2\u308A\u4FA1\u683C\u304C\u5FC5\u8981\u3067\u3059\u304B\uFF1F', continue: '\u8CB7\u3044\u7269\u3092\u7D9A\u3051\u308B', remove: '\u524A\u9664', clear: '\u30AB\u30FC\u30C8\u3092\u7A7A\u306B\u3059\u308B', shipping: '\u9001\u6599\u30FB\u7A0E\u91D1\u306F\u30EC\u30B8\u3067\u8A08\u7B97' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

function formatPrice(cents: number, loc: string = 'en'): string {
  const cur = loc === 'zh' ? 'CNY' : loc === 'ja' ? 'JPY' : 'USD'
  const code = loc === 'zh' ? 'zh-CN' : loc === 'ja' ? 'ja-JP' : 'en-US'
  return new Intl.NumberFormat(code, { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(cents / 100)
}

export default function CartClient({ locale }: { locale: string }) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore()

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44]">{lbl(locale, 'title')}</h1>
          {items.length > 0 && (
            <button onClick={() => { if (window.confirm(lbl(locale, 'clear') + '?')) clearCart() }}
              className="text-[1.3rem] text-[#6b7a8f] hover:text-[#e74c3c] transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} /> {lbl(locale, 'clear')}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-[#e2e8ef] mb-6" />
            <p className="text-[1.8rem] text-[#6b7a8f] mb-6">{lbl(locale, 'empty')}</p>
            <Link href={`/${locale}/products`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all"
            >
              <ArrowLeft size={16} /> {lbl(locale, 'browse')}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.slug} className="flex gap-6 p-5 bg-white rounded-2xl border border-[#e2e8ef]">
                  <div className="w-24 h-24 rounded-xl bg-[#f7f8fa] flex items-center justify-center shrink-0">
                    <span className="text-[3rem] opacity-30">{'\uD83D\uDCF7'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${locale}/products/${item.categorySlug}/${item.slug}`}
                      className="font-medium text-[1.6rem] text-[#1a2332] hover:text-[#F7D142] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[1.6rem] font-bold text-[#F7D142] mt-2">{formatPrice(item.price, locale)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-[#f7f8fa] rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="p-2 rounded-lg bg-white border border-[#e2e8ef] hover:bg-[#f7f8fa] transition-colors"
                          aria-label="Decrease"><Minus size={14} /></button>
                        <span className="w-10 text-center text-[1.4rem] font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="p-2 rounded-lg bg-white border border-[#e2e8ef] hover:bg-[#f7f8fa] transition-colors"
                          aria-label="Increase"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.slug)}
                        className="text-[1.3rem] text-[#6b7a8f] hover:text-[#e74c3c] transition-colors"
                      >
                        {lbl(locale, 'remove')}
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[1.6rem] font-bold text-[#0f2a44]">{formatPrice(item.price * item.quantity, locale)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-white rounded-2xl border border-[#e2e8ef] p-6 space-y-4">
                <h3 className="font-bold text-[1.8rem] text-[#0f2a44]">{lbl(locale, 'total')} ({totalItems()} {lbl(locale, 'quantity').toLowerCase()})</h3>
                <div className="flex justify-between items-baseline">
                  <span className="text-[1.4rem] text-[#6b7a8f]">{lbl(locale, 'subtotal')}</span>
                  <span className="text-[2.4rem] font-bold text-[#F7D142]">{formatPrice(totalPrice(), locale)}</span>
                </div>
                <div className="divider-washi my-2" />
                <p className="text-[1.2rem] text-[#6b7a8f]">{lbl(locale, 'shipping')}</p>
                <Link href={`/${locale}/contact?type=wholesale`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full border-2 border-[#F7D142] text-[#F7D142] font-semibold text-[1.4rem] hover:bg-[#F7D142] hover:text-white transition-colors"
                >
                  <span>{lbl(locale, 'inquiry')}</span><ArrowRight size={16} />
                </Link>
                <Link href={`/${locale}/products`}
                  className="block w-full text-center text-[1.3rem] text-[#6b7a8f] hover:text-[#F7D142] transition-colors pt-2"
                >
                  {lbl(locale, 'continue')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
