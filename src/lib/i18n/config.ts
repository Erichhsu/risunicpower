// src/lib/i18n/config.ts
export const locales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const rtlLocales: Locale[] = ['ar']

export const localeNames: Record<Locale, string> = {
  en: 'English', zh: '中文', ja: '日本語',
  es: 'Español', de: 'Deutsch', fr: 'Français',
  pt: 'Português', ar: 'العربية', ru: 'Русский',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸', zh: '🇨🇳', ja: '🇯🇵',
  es: '🇪🇸', de: '🇩🇪', fr: '🇫🇷',
  pt: '🇧🇷', ar: '🇸🇦', ru: '🇷🇺',
}
