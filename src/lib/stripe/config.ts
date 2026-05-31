import Stripe from 'stripe'

function createStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-05-27.dahlia',
    typescript: true,
  })
}

export const stripe = createStripe()

// Region-based payment methods for Stripe Checkout
export const REGION_PAYMENT_METHODS: Record<string, string[]> = {
  us: ['card', 'paypal'],
  eu: ['card', 'paypal', 'ideal', 'sepa_debit'],
  gb: ['card', 'paypal'],
  jp: ['card', 'konbini'],
  cn: ['card', 'alipay', 'wechat_pay'],
  default: ['card', 'paypal'],
}

export function getPaymentMethods(locale: string): string[] {
  const regionMap: Record<string, string> = {
    en: 'us', zh: 'cn', ja: 'jp', es: 'eu', de: 'eu', fr: 'eu', pt: 'eu', ar: 'default', ru: 'default',
  }
  return REGION_PAYMENT_METHODS[regionMap[locale] || 'default']
}

export function mapStripeLocale(locale: string): Stripe.Checkout.SessionCreateParams.Locale {
  if (locale === 'zh') return 'zh' as Stripe.Checkout.SessionCreateParams.Locale
  if (locale === 'ja') return 'ja' as Stripe.Checkout.SessionCreateParams.Locale
  if (locale === 'es') return 'es' as Stripe.Checkout.SessionCreateParams.Locale
  if (locale === 'de') return 'de' as Stripe.Checkout.SessionCreateParams.Locale
  if (locale === 'fr') return 'fr' as Stripe.Checkout.SessionCreateParams.Locale
  return 'en' as Stripe.Checkout.SessionCreateParams.Locale
}
