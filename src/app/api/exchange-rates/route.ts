// GET /api/exchange-rates — returns latest CNY-based rates (free tier, cached)
import { NextResponse } from 'next/server'

// Fallback rates updated periodically
const FALLBACK_RATES: Record<string, number> = {
  CNY: 1,
  USD: 0.139,
  EUR: 0.128,
  JPY: 20.85,
  GBP: 0.110,
}

const SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
}

const NAMES: Record<string, string> = {
  CNY: 'CNY 人民币',
  USD: 'USD US Dollar',
  EUR: 'EUR Euro',
  JPY: 'JPY 日本円',
  GBP: 'GBP Pound',
}

let cache: { rates: Record<string, number>; ts: number } | null = null
const TTL = 1000 * 60 * 60 // 1 hour

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json({ rates: cache.rates, symbols: SYMBOLS, names: NAMES })
  }

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/CNY', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    const rates: Record<string, number> = {}
    for (const c of ['CNY', 'USD', 'EUR', 'JPY', 'GBP']) {
      rates[c] = data.rates[c] || FALLBACK_RATES[c]
    }
    cache = { rates, ts: Date.now() }
    return NextResponse.json({ rates, symbols: SYMBOLS, names: NAMES })
  } catch {
    cache = { rates: FALLBACK_RATES, ts: Date.now() }
    return NextResponse.json({ rates: FALLBACK_RATES, symbols: SYMBOLS, names: NAMES })
  }
}
