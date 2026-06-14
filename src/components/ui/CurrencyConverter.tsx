'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface RateData {
  rates: Record<string, number>
  symbols: Record<string, string>
  names: Record<string, string>
}

const CURRENCIES = ['CNY', 'USD', 'EUR', 'JPY', 'GBP'] as const
type Currency = typeof CURRENCIES[number]

export default function CurrencyConverter({ priceCents }: { priceCents: number }) {
  const [rates, setRates] = useState<RateData | null>(null)
  const [currency, setCurrency] = useState<Currency>('CNY')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/exchange-rates')
      .then(r => r.json())
      .then(setRates)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const baseCNY = priceCents / 100
  const rate = rates?.rates[currency] ?? 1
  const converted = baseCNY * rate
  const symbol = rates?.symbols[currency] ?? '¥'

  const fmt = (v: number, c: Currency) => {
    if (c === 'JPY') return Math.round(v).toLocaleString()
    return v.toFixed(2)
  }

  return (
    <div className="relative inline-flex items-center gap-2" ref={ref}>
      <span className="text-[2.4rem] font-bold text-[#0E4071]">
        {symbol}{fmt(converted, currency)}
      </span>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#e2e8ef] hover:bg-[#F5F8FC] transition-colors text-[1.2rem] text-[#5A6D80]"
      >
        <span>{rates?.symbols[currency] || '¥'}</span>
        <span className="hidden sm:inline">{currency}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#E2E8EF] py-1 z-50 min-w-[16rem]">
          {CURRENCIES.map(c => {
            const v = baseCNY * (rates?.rates[c] ?? 1)
            return (
              <button
                key={c}
                onClick={() => { setCurrency(c); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-[1.3rem] hover:bg-[#F5F8FC] transition-colors flex items-center justify-between gap-4 ${
                  currency === c ? 'bg-[#F5F8FC] font-bold text-[#0E4071]' : 'text-[#4A5D70]'
                }`}
              >
                <span>{rates?.names[c] || c}</span>
                <span className="text-[1.2rem] tabular-nums">{rates?.symbols[c] || ''}{fmt(v, c)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
