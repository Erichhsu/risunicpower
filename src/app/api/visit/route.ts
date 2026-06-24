import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db/prisma'
import { esc } from '@/lib/email/transport'
import { logger } from '@/lib/logger'

function createVisitTransport() {
  // Use visit-specific SMTP if configured, otherwise fall back to default
  const host = process.env.VISIT_SMTP_HOST || process.env.SMTP_HOST
  const user = process.env.VISIT_SMTP_USER || process.env.SMTP_USER
  if (!host || !user) return null
  return nodemailer.createTransport({
    host,
    port: Number(process.env.VISIT_SMTP_PORT || process.env.SMTP_PORT || '465'),
    secure: true,
    auth: { user, pass: process.env.VISIT_SMTP_PASS || process.env.SMTP_PASS || '' },
  })
}

function generateRefId(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `VIS-${date}-${seq}`
}

function createVisitEmail(d: {
  refId: string
  hostName: string
  hostTitle?: string
  visitorName: string
  company: string
  visitorTitle?: string
  contact: string
  purpose: string
  visitDate?: string
  notes?: string
}) {
  const h = (s: string) => esc(s || '')
  const purposeMap: Record<string, string> = {
    procurement: '采购洽谈',
    cooperation: '商务合作',
    factory: '工厂参观',
    technical: '技术交流',
    other: '其他',
  }
  return `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
  <h2 style="color:#00D4AA;">📋 访客登记通知</h2>
  <p style="color:#555;">登记编号：<strong style="color:#00D4AA;font-size:16px;">${h(d.refId)}</strong></p>
  <table style="width:100%; border-collapse:collapse; margin-top:16px;">
    <tr style="background:#f0faf6;"><td colspan="2" style="padding:10px;font-weight:bold;color:#00D4AA;">被拜访人</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;width:30%;">姓名</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.hostName)}</td></tr>
    ${d.hostTitle ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">职务</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.hostTitle)}</td></tr>` : ''}
    <tr style="background:#f0faf6;"><td colspan="2" style="padding:10px;font-weight:bold;color:#00D4AA;">来访人信息</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">姓名</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.visitorName)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">公司</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.company)}</td></tr>
    ${d.visitorTitle ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">职位</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.visitorTitle)}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">联系方式</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.contact)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">来访目的</td><td style="padding:8px;border:1px solid #e2e8ef;">${purposeMap[d.purpose] || h(d.purpose)}</td></tr>
    ${d.visitDate ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">到访日期</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.visitDate)}</td></tr>` : ''}
    ${d.notes ? `<tr><td style="padding:8px;border:1px solid #e2e8ef;font-weight:bold;">备注</td><td style="padding:8px;border:1px solid #e2e8ef;">${h(d.notes)}</td></tr>` : ''}
  </table>
  <hr style="margin:20px 0;border-color:#e2e8ef;" />
  <p style="color:#6b7a8f;font-size:12px;">来自 RisunicPower 访客登记系统 · ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
</div>`
}

const VALID_PURPOSES = ['procurement', 'cooperation', 'factory', 'technical', 'other']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      hostName,
      hostTitle,
      visitorName,
      company,
      visitorTitle,
      contact,
      purpose,
      visitDate,
      notes,
    } = body

    // Validate required fields
    if (!hostName || !visitorName || !company || !contact || !purpose) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    if (!VALID_PURPOSES.includes(purpose)) {
      return NextResponse.json({ error: '无效的来访目的' }, { status: 400 })
    }

    // Generate unique refId
    let refId = generateRefId()
    let retries = 0
    while (retries < 3) {
      const existing = await prisma.visitorRegistration.findUnique({ where: { refId } })
      if (!existing) break
      refId = generateRefId()
      retries++
    }

    const registration = await prisma.visitorRegistration.create({
      data: {
        refId,
        hostName,
        hostTitle: hostTitle || null,
        visitorName,
        company,
        visitorTitle: visitorTitle || null,
        contact,
        purpose,
        visitDate: visitDate || null,
        notes: notes || null,
      },
    })

    // Send email notification (non-blocking, don't fail on email errors)
    const visitTransport = createVisitTransport()
    if (visitTransport) {
      try {
        const notifyEmail = process.env.VISIT_NOTIFY_EMAIL || 'hr-sz@risunic.com'
        const fromAddr = process.env.VISIT_SMTP_USER || process.env.SMTP_USER || ''
        await visitTransport.sendMail({
          from: fromAddr,
          to: notifyEmail,
          subject: `[访客登记] ${company} - ${visitorName} 来访`,
          html: createVisitEmail({
            refId,
            hostName,
            hostTitle,
            visitorName,
            company,
            visitorTitle,
            contact,
            purpose,
            visitDate,
            notes,
          }),
        })
        logger.info(`Visit notification email sent to ${notifyEmail}`)
      } catch (mailErr) {
        logger.warn('Visit notification email failed:', mailErr)
      }
    }

    return NextResponse.json({ success: true, refId: registration.refId })
  } catch (err) {
    logger.error('Visitor registration error:', err)
    return NextResponse.json({ error: '服务器内部错误，请稍后重试' }, { status: 500 })
  }
}
