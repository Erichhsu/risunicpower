'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { useLocale } from 'next-intl'

type Msg = { role: 'user' | 'bot'; text: string }

const localeLabels: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Hi! I\'m Risunic AI assistant. Ask me about our power products, specifications, or customization options.',
    placeholder: 'Ask about products...',
    thinking: 'Thinking...',
    error: 'Service temporarily unavailable. Please email erich.hsu@risunicpower.com.',
    title: 'Risunic AI',
    notConfigured: 'AI chat is not configured yet. Please email erich.hsu@risunicpower.com for product inquiries.',
  },
  zh: {
    welcome: '你好！我是 Risunic AI 助手。欢迎咨询我们的电源产品、技术规格或定制方案。',
    placeholder: '咨询产品…',
    thinking: '思考中…',
    error: '服务暂时不可用，请发送邮件至 erich.hsu@risunicpower.com',
    title: 'Risunic AI',
    notConfigured: 'AI 客服尚未配置，请发送邮件至 erich.hsu@risunicpower.com 咨询产品信息。',
  },
  ja: {
    welcome: 'こんにちは！Risunic AIアシスタントです。電源製品、仕様、カスタマイズについてお気軽にお問い合わせください。',
    placeholder: '製品について質問…',
    thinking: '考え中…',
    error: 'サービスが一時的に利用できません。erich.hsu@risunicpower.com までメールをお送りください。',
    title: 'Risunic AI',
    notConfigured: 'AIチャットはまだ設定されていません。製品のお問い合わせは erich.hsu@risunicpower.com までメールをお送りください。',
  },

  ar: { welcome: 'مرحباً! أنا مساعدك الذكي للمنتجات. اسألني عن أي شيء يتعلق بمنتجاتنا أو مواصفاتها أو أسعارها.', placeholder: 'اسأل عن المنتجات...', thinking: 'جارٍ التفكير...', error: 'الخدمة غير متاحة مؤقتًا. يرجى إرسال بريد إلكتروني إلى erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'لم يتم تكوين الدردشة الذكية بعد. يرجى إرسال بريد إلكتروني إلى erich.hsu@risunicpower.com للاستفسار عن المنتجات.' },
  de: { welcome: 'Hallo! Ich bin Ihr KI-Produktassistent. Fragen Sie mich alles zu unseren Produkten, Spezifikationen oder Preisen.', placeholder: 'Fragen Sie zu Produkten...', thinking: 'Denke nach...', error: 'Dienst vorübergehend nicht verfügbar. Bitte senden Sie eine E-Mail an erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'KI-Chat ist noch nicht konfiguriert. Bitte senden Sie eine E-Mail an erich.hsu@risunicpower.com für Produktanfragen.' },
  es: { welcome: '¡Hola! Soy su asistente de productos con IA. Pregúnteme cualquier cosa sobre nuestros productos, especificaciones o precios.', placeholder: 'Pregunte sobre productos...', thinking: 'Pensando...', error: 'Servicio no disponible temporalmente. Envíe un correo a erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'El chat de IA aún no está configurado. Envíe un correo a erich.hsu@risunicpower.com para consultas sobre productos.' },
  fr: { welcome: 'Bonjour ! Je suis votre assistant IA produit. Posez-moi toutes vos questions sur nos produits, spécifications ou tarifs.', placeholder: 'Interrogez sur les produits...', thinking: 'Réflexion en cours...', error: 'Service temporairement indisponible. Veuillez envoyer un e-mail à erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'Le chat IA n\'est pas encore configuré. Veuillez envoyer un e-mail à erich.hsu@risunicpower.com pour toute demande concernant les produits.' },
  pt: { welcome: 'Olá! Sou seu assistente de produtos IA. Pergunte-me sobre nossos produtos, especificações ou preços.', placeholder: 'Pergunte sobre produtos...', thinking: 'Pensando...', error: 'Serviço temporariamente indisponível. Envie um e-mail para erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'O chat de IA ainda não está configurado. Envie um e-mail para erich.hsu@risunicpower.com para consultas sobre produtos.' },
  ru: { welcome: 'Здравствуйте! Я ваш ИИ-помощник по продукции. Спрашивайте о товарах, характеристиках или ценах.', placeholder: 'Спросить о товарах...', thinking: 'Думаю...', error: 'Сервис временно недоступен. Пожалуйста, напишите на erich.hsu@risunicpower.com.', title: 'Risunic AI', notConfigured: 'Чат с ИИ еще не настроен. Пожалуйста, отправляйте запросы по email: erich.hsu@risunicpower.com.' },
}

function lbl(locale: string, key: string): string {
  return localeLabels[locale]?.[key] || localeLabels.en[key] || key
}

export default function AIChat() {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: lbl(locale, 'welcome') }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send() {
    if (!input.trim() || loading) return
    const q = input.trim()
    setMsgs(p => [...p, { role: 'user', text: q }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: msgs.slice(-10), locale }),
      })
      const data = await res.json()
      setMsgs(p => [...p, { role: 'bot', text: data.reply || 'Sorry, I couldn\'t process that.' }])
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: lbl(locale, 'error') }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F7D142] text-white shadow-lg hover:bg-[#9a3a1e] transition-all"
        aria-label={lbl(locale, 'title')}
      ><MessageCircle size={24} /></button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className="flex items-center justify-between bg-[#0f2a44] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <Bot size={22} />
                <span className="font-semibold text-[1.4rem]">{lbl(locale, 'title')}</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-70"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 200, maxHeight: 400 }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-[#0f2a44]' : 'bg-[#f0f2f5]'}`}>
                      {m.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#0f2a44]" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 text-[1.3rem] leading-relaxed ${m.role === 'user' ? 'bg-[#0f2a44] text-white' : 'bg-[#f0f2f5] text-[#2c3e50]'}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-[#f0f2f5] px-4 py-2">
                    <Loader2 size={14} className="animate-spin text-[#F7D142]" />
                    <span className="text-[1.3rem] text-[#6b7a8f]">{lbl(locale, 'thinking')}</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={lbl(locale, 'placeholder')}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-[1.3rem] outline-none focus:border-[#0f2a44] bg-[#f8f9fb]"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7D142] text-white disabled:opacity-40 hover:bg-[#9a3a1e] transition-colors"
                ><Send size={16} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
