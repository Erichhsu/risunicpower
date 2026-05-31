'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { X, ShoppingCart, Trash2, Minus, Plus, Send } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Cart', empty: 'Your cart is empty', browse: 'Browse Products', total: 'Total', checkout: 'Checkout', inquiry: 'Wholesale Inquiry', clear: 'Clear Cart', remove: 'Remove' },
  zh: { title: '购物车', empty: '购物车是空的', browse: '浏览产品', total: '合计', checkout: '去结算', inquiry: '批量询价', clear: '清空购物车', remove: '删除' },
  ja: { title: 'カート', empty: 'カートは空です', browse: '製品を見る', total: '合計', checkout: 'レジに進む', inquiry: '卸売り問い合わせ', clear: 'カートを空にする', remove: '削除' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

function formatPrice(cents: number, loc: string = 'en'): string {
  const cur = loc === 'zh' ? 'CNY' : loc === 'ja' ? 'JPY' : 'USD';
  const code = loc === 'zh' ? 'zh-CN' : loc === 'ja' ? 'ja-JP' : 'en-US';
  return new Intl.NumberFormat(code, { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(cents / 100)
}

export default function CartDrawer() {
  const locale = useLocale()
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8ef]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#0f2a44]" />
                <span className="font-bold text-[1.6rem]">{lbl(locale, 'title')} ({totalItems()})</span>
              </div>
              <button onClick={closeCart} className="p-1 hover:bg-[#f7f8fa] rounded-lg" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-[#e2e8ef] mb-4" />
                  <p className="text-[1.6rem] text-[#6b7a8f]">{lbl(locale, 'empty')}</p>
                  <Link href={`/${locale}/products`} className="inline-block mt-4 text-[1.4rem] font-medium text-[#1e4a7a] hover:underline" onClick={closeCart}>
                    {lbl(locale, 'browse')}
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.slug} className="flex gap-4 p-3 bg-[#f7f8fa] rounded-xl">
                    <div className="w-20 h-20 rounded-lg bg-[#e2e8ef] flex items-center justify-center shrink-0">
                      <span className="text-[2rem] opacity-30">📷</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/${locale}/products/${item.categorySlug}/${item.slug}`}
                        className="font-medium text-[1.4rem] text-[#1a2332] hover:text-[#c44a2b] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[1.4rem] font-bold text-[#c44a2b] mt-1">{formatPrice(item.price, locale)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="p-1 rounded-md bg-white border border-[#e2e8ef] hover:bg-[#f7f8fa]"
                          aria-label="Decrease"><Minus size={14} /></button>
                        <span className="w-8 text-center text-[1.4rem] font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="p-1 rounded-md bg-white border border-[#e2e8ef] hover:bg-[#f7f8fa]"
                          aria-label="Increase"><Plus size={14} /></button>
                        <button onClick={() => removeItem(item.slug)}
                          className="ml-auto p-1 text-[#e74c3c]/60 hover:text-[#e74c3c]"
                          aria-label={lbl(locale, 'remove')}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#e2e8ef] px-6 py-4 space-y-3">
                <div className="flex justify-between text-[1.6rem] font-bold">
                  <span>{lbl(locale, 'total')}</span>
                  <span className="text-[#c44a2b]">{formatPrice(totalPrice(), locale)}</span>
                </div>
                <Link href={`/${locale}/cart`}
                  className="block w-full py-3 rounded-full bg-[#0f2a44] text-white text-center font-semibold text-[1.4rem] hover:bg-[#1e4a7a] transition-colors"
                  onClick={closeCart}
                >{lbl(locale, 'checkout')}</Link>
                <Link href={`/${locale}/contact?type=wholesale`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-[#c44a2b] text-[#c44a2b] font-semibold text-[1.4rem] hover:bg-[#c44a2b] hover:text-white transition-colors"
                  onClick={closeCart}
                >
                  <Send size={16} /> {lbl(locale, 'inquiry')}
                </Link>
                <button onClick={clearCart}
                  className="w-full text-center text-[1.2rem] text-[#6b7a8f] hover:text-[#e74c3c] transition-colors"
                >{lbl(locale, 'clear')}</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
