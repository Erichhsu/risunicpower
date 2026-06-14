// Real-time exchange rates fetched 2026-06-05 from open.er-api.com
// Base: CNY (priceCents in database stores CNY cents)
const RATES: Record<string, number> = {
  CNY: 1,
  USD: 0.147302,
  EUR: 0.126881,
  JPY: 23.574412,
  RUB: 10.881393,
  BRL: 0.746157,
  AED: 0.540964,
}

// Locale → currency code mapping
const LOCALE_CURRENCY: Record<string, string> = {
  zh: 'CNY',
  en: 'USD',
  ja: 'JPY',
  es: 'EUR',
  de: 'EUR',
  fr: 'EUR',
  pt: 'USD',
  ar: 'USD',
  ru: 'RUB',
}

// Locale → Intl.NumberFormat locale
const LOCALE_FORMAT: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR',
  pt: 'pt-BR',
  ar: 'ar-SA',
  ru: 'ru-RU',
}

/** Convert CNY cents to locale-appropriate currency cents */
export function convertPrice(cnyCents: number, locale: string = 'en'): { cents: number; currency: string } {
  const currency = LOCALE_CURRENCY[locale] || 'USD'
  const rate = RATES[currency] || RATES.USD
  const converted = Math.round(cnyCents * rate)
  return { cents: converted, currency }
}

/** Format a price in cents to a locale-appropriate string */
export function formatPrice(cnyCents: number, locale: string = 'en'): string {
  const { cents, currency } = convertPrice(cnyCents, locale)
  const fmtLocale = LOCALE_FORMAT[locale] || 'en-US'
  return new Intl.NumberFormat(fmtLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

/** Get the currency code for a locale */
export function getCurrency(locale: string): string {
  return LOCALE_CURRENCY[locale] || 'USD'
}
