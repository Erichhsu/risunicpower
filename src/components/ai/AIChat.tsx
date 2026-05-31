'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

type Msg = { role: 'user' | 'bot'; text: string }

const WELCOME = 'Hi! I\'m Risunic AI assistant. Ask me about our power products, specifications, or customization options.'

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: WELCOME }])
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
        body: JSON.stringify({ message: q, history: msgs.slice(-10) }),
      })
      const data = await res.json()
      setMsgs(p => [...p, { role: 'bot', text: data.reply || 'Sorry, I couldn\'t process that.' }])
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: 'Service temporarily unavailable. Please email info@risunicpower.com.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#c44a2b] text-white shadow-lg hover:bg-[#9a3a1e] transition-all"
        aria-label="Open AI Chat"
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
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0f2a44] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <Bot size={22} />
                <span className="font-semibold text-[1.4rem]">Risunic AI</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-70"><X size={20} /></button>
            </div>

            {/* Messages */}
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
                    <Loader2 size={14} className="animate-spin text-[#c44a2b]" />
                    <span className="text-[1.3rem] text-[#6b7a8f]">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask about products..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-[1.3rem] outline-none focus:border-[#0f2a44] bg-[#f8f9fb]"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c44a2b] text-white disabled:opacity-40 hover:bg-[#9a3a1e] transition-colors"
                ><Send size={16} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
