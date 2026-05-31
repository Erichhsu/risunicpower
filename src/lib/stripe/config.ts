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

export function getPaymentMethods(locale: string): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  const regionMap: Record<string, string> = {
    en: 'us', zh: 'cn', ja: 'jp', es: 'eu', de: 'eu', fr: 'eu', pt: 'eu', ar: 'default', ru: 'default',
  }
  return (REGION_PAYMENT_METHODS[regionMap[locale] || 'default'] || ['card']) as Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
}

const stripeLocaleMap: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  zh: 'zh' as Stripe.Checkout.SessionCreateParams.Locale,
  ja: 'ja' as Stripe.Checkout.SessionCreateParams.Locale,
  es: 'es' as Stripe.Checkout.SessionCreateParams.Locale,
  de: 'de' as Stripe.Checkout.SessionCreateParams.Locale,
  fr: 'fr' as Stripe.Checkout.SessionCreateParams.Locale,
}

export function mapStripeLocale(locale: string): Stripe.Checkout.SessionCreateParams.Locale {
  return (stripeLocaleMap[locale] || 'en') as Stripe.Checkout.SessionCreateParams.Locale
}
