import { NextRequest, NextResponse } from 'next/server'
import { stripe, mapStripeLocale, getPaymentMethods } from '@/lib/stripe/config'

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY in .env' }, { status: 503 })
    }

    const body = await req.json()
    const { items, locale, currency = 'usd', successUrl, cancelUrl } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const origin = req.nextUrl.origin
    const stripeLocale = mapStripeLocale(locale || 'en')

    const lineItems = items.map((item: { name: string; price: number; quantity: number; image?: string; spec?: string }) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          description: item.spec || undefined,
          images: item.image ? [`${origin}${item.image}`] : undefined,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${origin}/${locale}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/${locale}/cart`,
      locale: stripeLocale,
      payment_method_types: getPaymentMethods(locale || 'en'),
      shipping_address_collection: {
        allowed_countries: ['US', 'CN', 'JP', 'GB', 'DE', 'FR', 'AU', 'CA', 'KR', 'SG'],
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
