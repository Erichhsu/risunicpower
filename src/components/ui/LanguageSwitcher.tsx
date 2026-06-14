'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'zh', label: '中文', native: '中文' },
  { code: 'ja', label: '日本語', native: '日本語' },
  { code: 'es', label: 'Español', native: 'Español' },
  { code: 'de', label: 'Deutsch', native: 'Deutsch' },
  { code: 'fr', label: 'Français', native: 'Français' },
  { code: 'pt', label: 'Português', native: 'Português' },
  { code: 'ar', label: 'العربية', native: 'العربية' },
  { code: 'ru', label: 'Русский', native: 'Русский' },
]

export default function LanguageSwitcher({ isTransparent }: { isTransparent: boolean }) {
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchTo = (newLocale: string) => {
    setOpen(false)
    // Replace the locale segment in the pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    window.location.href = newPath
  }

  const currentLocale = locales.find(l => l.code === locale) || locales[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
          isTransparent ? 'hover:bg-white/10' : 'hover:bg-[#ECF1F7]'
        }`}
        aria-label="Switch language"
      >
        <Globe size={18} className={isTransparent ? 'text-white/70' : 'text-[#4A5D70]'} />
        <span className={`text-[1.2rem] font-medium hidden sm:inline ${isTransparent ? 'text-white/80' : 'text-[#4A5D70]'}`}>
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#e2e8ef] py-2 z-50">
          {locales.map(l => (
            <button
              key={l.code}
              onClick={() => switchTo(l.code)}
              className={`w-full text-left px-4 py-2 text-[1.3rem] transition-colors hover:bg-[#ECF1F7] ${
                l.code === locale ? 'font-bold text-[#0E4071] bg-[#E5ECF4]' : 'text-[#4A5D70]'
              }`}
            >
              <span className="mr-2 text-[1.1rem] text-[#4A5D70] w-6 inline-block text-center">{l.code.toUpperCase()}</span>
              {l.native}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
