'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchStore } from '@/lib/store/search'

interface SearchResult {
  slug: string
  categorySlug: string
  name: string
  categoryName: string
}

const localeLabels: Record<string, Record<string, string>> = {
  en: { placeholder: 'Search products...', noResults: 'No products found for', hint: 'Type to search across', hintSuffix: 'product categories', esc: 'to close', nav: 'navigate' },
  zh: { placeholder: '搜索产品…', noResults: '未找到产品：', hint: '可在', hintSuffix: '个产品品类中搜索', esc: '关闭', nav: '导航' },
  ja: { placeholder: '製品を検索…', noResults: '製品が見つかりません：', hint: '', hintSuffix: '製品カテゴリから検索', esc: '閉じる', nav: '移動' },
}

function lbl(locale: string, key: string): string {
  return localeLabels[locale]?.[key] || localeLabels.en[key] || key
}

export default function SearchDialog({ locale }: { locale?: string }) {
  const { isOpen, close } = useSearchStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const l = locale || 'en'

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIdx(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSelectedIdx(-1); return }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${l}`)
        const data = await res.json()
        setResults(data.results || [])
        setSelectedIdx(-1)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 250)
    return () => clearTimeout(t)
  }, [query, l])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      close()
      window.location.href = `/${l}/products/${results[selectedIdx].categorySlug}/${results[selectedIdx].slug}`
    }
  }, [results, selectedIdx, l, close])

  useEffect(() => {
    if (selectedIdx >= 0 && resultRefs.current[selectedIdx]) {
      resultRefs.current[selectedIdx]?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIdx])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full max-w-[600px] rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIdx(-1) }}
                onKeyDown={handleKeyDown}
                placeholder={lbl(l, 'placeholder')}
                className="flex-1 text-[1.6rem] outline-none bg-transparent"
              />
              {loading && <Loader2 size={18} className="animate-spin text-[#c44a2b]" />}
              <button onClick={close} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {results.length === 0 && query.trim() && !loading && (
                <div className="px-5 py-12 text-center text-[1.3rem] text-gray-400">
                  {lbl(l, 'noResults')} &ldquo;{query}&rdquo;
                </div>
              )}
              {results.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/${l}/products/${r.categorySlug}/${r.slug}`}
                  onClick={close}
                  ref={el => { resultRefs.current[i] = el }}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors group ${selectedIdx === i ? 'bg-[#e8edf5]' : 'hover:bg-[#f8f9fb]'}`}
                >
                  <Package size={18} className="text-[#c44a2b] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[1.4rem] font-medium text-[#0f2a44] truncate">{r.name}</div>
                    <div className="text-[1.2rem] text-gray-400">{r.categoryName}</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#c44a2b] transition-colors shrink-0" />
                </Link>
              ))}
              {results.length === 0 && !query.trim() && (
                <div className="px-5 py-8 text-center text-[1.3rem] text-gray-400">
                  {lbl(l, 'hint')} 9 {lbl(l, 'hintSuffix')}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-5 py-3 text-[1.1rem] text-gray-400 text-center">
              <kbd className="mx-1 rounded bg-gray-100 px-2 py-0.5 text-[1rem] font-mono">Esc</kbd> {lbl(l, 'esc')} ·{' '}
              <kbd className="mx-1 rounded bg-gray-100 px-2 py-0.5 text-[1rem] font-mono">↑↓</kbd> {lbl(l, 'nav')}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
