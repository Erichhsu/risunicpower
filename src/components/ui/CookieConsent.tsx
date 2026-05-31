'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const COOKIE_KEY = 'risunic_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [accepted, setAccepted] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
    setAccepted(saved)
  }, [])

  function accept(v: 'all' | 'necessary') {
    setAccepted(v)
    setVisible(false)
    localStorage.setItem(COOKIE_KEY, v)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-[#0f2a44] px-6 py-4 text-white shadow-2xl">
            <p className="flex-1 text-[1.3rem] leading-relaxed">
              We use cookies to improve your experience. By continuing, you agree to our{' '}
              <a href="/en/privacy" className="underline underline-offset-2 text-[#c44a2b]">Privacy Policy</a>.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => accept('necessary')}
                className="px-4 py-2 text-[1.3rem] rounded-full border border-white/30 hover:bg-white/10 transition-colors"
              >Necessary Only</button>
              <button
                onClick={() => accept('all')}
                className="px-5 py-2 text-[1.3rem] rounded-full bg-[#c44a2b] text-white font-semibold hover:bg-[#9a3a1e] transition-colors"
              >Accept All</button>
              <button
                onClick={() => accept('necessary')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              ><X size={18} /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
