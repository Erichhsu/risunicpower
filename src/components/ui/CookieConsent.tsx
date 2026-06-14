'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const translations = {
  en: {
    message: 'We use essential cookies to ensure site functionality and analytics cookies to improve your experience.',
    accept: 'Accept All',
    decline: 'Decline',
    privacy: 'Privacy Policy',
    title: 'Cookie Preferences',
  },
  zh: {
    message: '我们使用必要的Cookie确保网站正常运行，并使用分析Cookie改善您的体验。',
    accept: '全部接受',
    decline: '拒绝',
    privacy: '隐私政策',
    title: 'Cookie偏好设置',
  },
}

export default function CookieConsent({ locale = 'en' }: { locale?: string }) {
  const [visible, setVisible] = useState(false)
  const t = locale === 'zh' ? translations.zh : translations.en

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  function acceptAll() {
    localStorage.setItem('cookie-consent', 'all')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#e2e8ef] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          {/* Message */}
          <div className="flex-1">
            <h3 className="text-[1.5rem] font-bold text-[#0f2a44] mb-1">{t.title}</h3>
            <p className="text-[1.3rem] text-[#4a5568] leading-relaxed">
              {t.message}{' '}
              <Link href={`/${locale}/privacy`} className="text-[#0f2a44] underline hover:text-[#F7D142] transition-colors">
                {t.privacy}
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={acceptAll}
              className="px-6 py-3 bg-[#0f2a44] text-white rounded-xl text-[1.3rem] font-medium hover:bg-[#1a3a5c] transition-colors whitespace-nowrap"
            >
              {t.accept}
            </button>
            <button
              onClick={decline}
              className="px-6 py-3 border-2 border-[#e2e8ef] text-[#4a5568] rounded-xl text-[1.3rem] font-medium hover:border-[#0f2a44] hover:text-[#0f2a44] transition-colors whitespace-nowrap"
            >
              {t.decline}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
