'use client'

import Link from 'next/link'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Shopping Cart', empty: 'Your cart is empty', browse: 'Browse Products', product: 'Product', quantity: 'Qty', total: 'Total', subtotal: 'Subtotal', checkout: 'Proceed to Checkout', inquiry: 'Need wholesale pricing?', continue: 'Continue Shopping', remove: 'Remove', clear: 'Clear Cart' },
  zh: { title: '购物车', empty: '购物车是空的', browse: '去逛逛', product: '商品', quantity: '数量', total: '合计', subtotal: '小计', checkout: '去结算', inquiry: '需要批量报价？', continue: '继续购物', remove: '删除', clear: '清空购物车' },
  ja: { title: 'ショッピングカート', empty: 'カートは空です', browse: '製品を見る', product: '商品', quantity: '数量', total: '合計', subtotal: '小計', checkout: 'レジに進む', inquiry: '卸売り価格が必要ですか？', continue: '買い物を続ける', remove: '削除', clear: 'カートを空にする' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100)
}

export default function CartClient({ locale }: { locale: string }) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore()

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[clamp(2.4rem,3vw,3.6rem)] font-bold text-[#0f2a44]">{lbl(locale, 'title')}</h1>
          {items.length > 0 && (
            <button onClick={clearCart}
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all"
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
                    <span className="text-[3rem] opacity-30">📷</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${locale}/products/${item.slug}`}
                      className="font-medium text-[1.6rem] text-[#1a2332] hover:text-[#c44a2b] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[1.6rem] font-bold text-[#c44a2b] mt-2">{formatPrice(item.price)}</p>
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
                    <p className="text-[1.6rem] font-bold text-[#0f2a44]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-white rounded-2xl border border-[#e2e8ef] p-6 space-y-4">
                <h3 className="font-bold text-[1.8rem] text-[#0f2a44]">{lbl(locale, 'total')} ({totalItems()} {lbl(locale, 'quantity').toLowerCase()})</h3>
                <div className="flex justify-between items-baseline">
                  <span className="text-[1.4rem] text-[#6b7a8f]">{lbl(locale, 'subtotal')}</span>
                  <span className="text-[2.4rem] font-bold text-[#c44a2b]">{formatPrice(totalPrice())}</span>
                </div>
                <div className="divider-washi my-2" />
                <p className="text-[1.2rem] text-[#6b7a8f]">Shipping & taxes calculated at checkout</p>
                <Link href={`/${locale}/contact?type=wholesale`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full border-2 border-[#c44a2b] text-[#c44a2b] font-semibold text-[1.4rem] hover:bg-[#c44a2b] hover:text-white transition-colors"
                >
                  <span>{lbl(locale, 'inquiry')}</span><ArrowRight size={16} />
                </Link>
                <Link href={`/${locale}/products`}
                  className="block w-full text-center text-[1.3rem] text-[#6b7a8f] hover:text-[#c44a2b] transition-colors pt-2"
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
