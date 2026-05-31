'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, ShoppingCart, Search } from 'lucide-react'

const navItems = [
  { key: 'products', href: '/products' },
  { key: 'solutions', href: '/solutions' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
]

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('Header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8">
              <svg viewBox="0 0 32 28" className="w-full h-full">
                <polygon points="16,1 30,8 30,20 16,27 2,20 2,8"
                  fill={scrolled ? '#c44a2b' : '#c44a2b'} opacity="0.8" />
              </svg>
            </div>
            <span className={`font-bold text-[1.8rem] tracking-tight ${scrolled ? 'text-[#0f2a44]' : 'text-white'}`}>
              RisunicPower
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={`text-[1.3rem] font-medium tracking-wide hover:text-[#c44a2b] transition-colors ${
                  scrolled ? 'text-[#1a2332]' : 'text-white/80'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-[#f7f8fa]' : 'hover:bg-white/10'}`}
              aria-label={t('search')}>
              <Search size={20} className={scrolled ? 'text-[#6b7a8f]' : 'text-white/70'} />
            </button>
            <button className={`p-2 rounded-lg transition-colors relative ${scrolled ? 'hover:bg-[#f7f8fa]' : 'hover:bg-white/10'}`}
              aria-label="Cart">
              <ShoppingCart size={20} className={scrolled ? 'text-[#6b7a8f]' : 'text-white/70'} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c44a2b] text-white text-[1rem] flex items-center justify-center font-bold">0</span>
            </button>
            {/* Mobile menu */}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen
                ? <X size={22} className={scrolled ? 'text-[#1a2332]' : 'text-white'} />
                : <Menu size={22} className={scrolled ? 'text-[#1a2332]' : 'text-white'} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#e2e8ef] py-4 px-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className="block text-[1.5rem] text-[#1a2332] font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
