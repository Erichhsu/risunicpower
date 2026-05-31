import { NextRequest, NextResponse } from 'next/server'
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

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function createInquiryEmail(d: {
  company: string; name: string; email: string; phone?: string
  productName?: string; quantity?: string; message: string; locale?: string
}) {
  const h = (s: string) => escapeHtml(s || '')
  return `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
  <h2 style="color:#c44a2b;">🔔 New Inquiry Received</h2>
  <table style="width:100%; border-collapse:collapse;">
    ${d.productName ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Product</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.productName)}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Company</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.company)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.name)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #e2e8ef;"><a href="mailto:${h(d.email)}">${h(d.email)}</a></td></tr>
    ${d.phone ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.phone)}</td></tr>` : ''}
    ${d.quantity ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Quantity</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.quantity)}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.message)}</td></tr>
  </table>
  <hr style="margin:20px 0;border-color:#e2e8ef;" />
  <p style="color:#6b7a8f;font-size:12px;">Sent from RisunicPower contact form</p>
</div>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { locale, productName, company, name: senderName, email, phone, quantity, message } = body

    if (!company || !senderName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        locale: locale || 'en',
        productName: productName || null,
        company,
        name: senderName,
        email,
        phone: phone || null,
        quantity: quantity ? Number(quantity) : null,
        message,
      },
    })

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const t = createTransport()
        if (!t) throw new Error('SMTP not configured')
        await t.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.INQUIRY_EMAIL || 'sales@risunicpower.com',
          subject: `[Inquiry] ${company} - ${productName || 'General'}`,
          html: createInquiryEmail(body),
        })
      } catch (mailErr) {
        console.warn('Mail send failed (SMTP may not be configured yet):', mailErr)
      }
    }

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
