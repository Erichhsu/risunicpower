'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { locales, localeNames } from '@/lib/i18n/config'
import { Menu, X, ShoppingCart, Search, Globe, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { useSearchStore } from '@/lib/store/search'
import CartDrawer from '@/components/cart/CartDrawer'

const navItems = [
  { key: 'products', href: '/products' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
]

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('Header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const cartCount = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0))
  const openCart = useCartStore(state => state.openCart)
  const openSearch = useSearchStore(state => state.open)

  // Homepage = /en or /en/ (no extra path segments)
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  // On non-home pages, always show solid header; on homepage, only on scroll
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <Image
              src="/images/logo/logo-07.png"
              alt="RisunicPower"
              width={36}
              height={36}
              className="w-9 h-auto transition-transform duration-300 group-hover:scale-110"
            />
            <span className={`font-bold text-[1.8rem] tracking-tight transition-colors duration-300 ${solid ? 'text-[#0E4071] group-hover:text-[#F7D142]' : 'text-white group-hover:text-[#F7D142]'}`}>
              RisunicPower
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={`relative text-[1.3rem] font-medium tracking-wide transition-colors duration-300 group ${
                  solid ? 'text-[#0E4071]' : 'text-white/80'
                }`}
              >
                <span className="relative">
                  {t(item.key)}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#F7D142] transition-all duration-300 ease-out group-hover:w-full" />
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openSearch}
              className={`p-2 rounded-lg transition-all duration-300 group ${solid ? 'hover:bg-[#F5F8FC]' : 'hover:bg-white/10 hover:scale-110'}`}
              aria-label={t('search')}
            >
              <Search size={20} className={`transition-transform duration-300 group-hover:rotate-12 ${solid ? 'text-[#5A6D80]' : 'text-white/70'}`} />
            </button>
            <button onClick={openCart}
              className={`p-2 rounded-lg transition-all duration-300 group relative ${solid ? 'hover:bg-[#F5F8FC]' : 'hover:bg-white/10 hover:scale-110'}`}
              aria-label="Cart"
            >
              <ShoppingCart size={20} className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${solid ? 'text-[#5A6D80]' : 'text-white/70'}`} />
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F7D142] text-white text-[1rem] flex items-center justify-center font-bold animate-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Switcher — Desktop */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[1.2rem] font-semibold transition-all duration-300 ${
                  solid ? 'text-[#5A6D80] hover:bg-[#F5F8FC]' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Globe size={16} className="transition-transform duration-300 hover:rotate-12" />
                <span className="min-w-[2ch]">{locale.toUpperCase()}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-[#E2E8EF] py-2 z-50 min-w-[12rem]">
                  {locales.map(lang => (
                    <Link
                      key={lang}
                      href={`/${lang}`}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center justify-between px-4 py-2 text-[1.3rem] hover:bg-[#F5F8FC] transition-colors ${
                        locale === lang ? 'text-[#0E4071] font-bold bg-[#F5F8FC]' : 'text-[#4A5D70]'
                      }`}
                    >
                      <span>{localeNames[lang]}</span>
                      <span className="text-[1.1rem] text-[#b0bccd]">{lang.toUpperCase()}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button className="lg:hidden p-2 transition-transform duration-300 hover:scale-110" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen
                ? <X size={22} className={solid ? 'text-[#0E4071]' : 'text-white'} />
                : <Menu size={22} className={solid ? 'text-[#0E4071]' : 'text-white'} />
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
                className="block text-[1.5rem] text-[#0E4071] font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#e2e8ef]">
              <p className="text-[1.2rem] text-[#b0bccd] mb-2">{t('language')}</p>
              <div className="grid grid-cols-3 gap-2">
                {locales.map(lang => (
                  <Link
                    key={lang}
                    href={`/${lang}`}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 text-[1.3rem] font-medium rounded text-center transition-colors ${
                      locale === lang
                        ? 'bg-[#F7D142] text-[#0E4071]'
                        : 'text-[#4A5D70] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <CartDrawer />
    </header>
  )
}
