import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

function createInquiryEmail(data: {
  company: string; name: string; email: string; phone?: string
  productName?: string; quantity?: string; message: string; locale?: string
}) {
  return `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
  <h2 style="color:#c44a2b;">🔔 New Inquiry Received</h2>
  <table style="width:100%; border-collapse:collapse;">
    ${data.productName ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Product</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.productName}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Company</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.company}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.name}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #e2e8ef;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
    ${data.phone ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.phone}</td></tr>` : ''}
    ${data.quantity ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Quantity</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.quantity}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #e2e8ef;">${data.message}</td></tr>
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
        await transporter.sendMail({
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
