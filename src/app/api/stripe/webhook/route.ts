import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/config'
import { prisma } from '@/lib/db/prisma'
import nodemailer from 'nodemailer'

function createTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' },
  })
}

function esc(s: string | null | undefined): string {
  if (!s) return ''
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function orderConfirmationEmail(data: {
  email: string; name: string; total: number; currency: string
  items: { name?: string; quantity?: number; amount?: number }[]
}) {
  const itemsHtml = data.items.map(item =>
    `<tr><td style="padding:8px;border:1px solid #e2e8ef;">${esc(item.name)}</td>`
    + `<td style="padding:8px;border:1px solid #e2e8ef;text-align:center;">${item.quantity ?? 1}</td>`
    + `<td style="padding:8px;border:1px solid #e2e8ef;text-align:right;">${((item.amount ?? 0) / 100).toFixed(2)} ${data.currency.toUpperCase()}</td></tr>`
  ).join('')

  const totalFormatted = (data.total / 100).toFixed(2)
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#c44a2b;">&#x2705; Order Confirmed</h2>
  <p>Thank you for your order, ${esc(data.name)}!</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <tr style="background:#f7f8fa;"><th style="padding:8px;border:1px solid #e2e8ef;text-align:left;">Item</th><th style="padding:8px;border:1px solid #e2e8ef;">Qty</th><th style="padding:8px;border:1px solid #e2e8ef;text-align:right;">Total</th></tr>
    ${itemsHtml}
    <tr><td colspan="2" style="padding:8px;border:1px solid #e2e8ef;text-align:right;font-weight:bold;">Total</td><td style="padding:8px;border:1px solid #e2e8ef;text-align:right;font-weight:bold;">${totalFormatted} ${data.currency.toUpperCase()}</td></tr>
  </table>
  <hr style="margin:20px 0;border-color:#e2e8ef;" />
  <p style="color:#6b7a8f;font-size:12px;">A receipt has been sent to ${esc(data.email)}</p>
  <p style="color:#6b7a8f;font-size:12px;">Shenzhen Risunic Technology Co., Ltd.</p>
</div>`
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET || !stripe) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

    const event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_details?.email || ''
      const customerName = session.customer_details?.name || ''

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      })
      if (existing) return NextResponse.json({ received: true })

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const orderItems = lineItems.data.map(item => ({
        name: item.description || undefined,
        quantity: item.quantity || undefined,
        amount: item.amount_total,
      }))

      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || '',
          email: customerEmail,
          name: customerName,
          total: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'paid',
          items: JSON.stringify(orderItems),
        },
      })

      const transport = createTransport()
      if (transport && customerEmail) {
        try {
          await transport.sendMail({
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `Order Confirmed - RisunicPower (#${order.id.slice(0, 8)})`,
            html: orderConfirmationEmail({
              email: customerEmail, name: customerName,
              total: session.amount_total || 0, currency: session.currency || 'usd',
              items: orderItems,
            }),
          })
        } catch (mailErr) {
          console.warn('Order confirmation email failed:', mailErr)
        }
      }
    } else if (event.type === 'checkout.session.expired') {
      console.warn('Stripe session expired:', (event.data.object as Stripe.Checkout.Session).id)
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', pi.id, pi.last_payment_error?.message)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
