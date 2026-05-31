import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale: localeParam }) => {
  const locale = localeParam ?? 'en'
  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Shanghai' as const,
    now: new Date(),
  }
})
