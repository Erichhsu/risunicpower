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
    // ★ 超时保护：避免邮件发送慢拖垮登记响应（此前未设超时，SMTP 慢时前端卡 30 秒）
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
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

// ─── 每月汇总邮件（每月 1 号 09:00 发送上月的访客登记） ───

const PURPOSE_MAP: Record<string, string> = {
  procurement: '采购洽谈',
  cooperation: '商务合作',
  factory: '工厂参观',
  technical: '技术交流',
  other: '其他',
}

interface MonthlyReg {
  refId: string
  hostName: string
  visitorName: string
  company: string
  contact: string
  purpose: string
  visitDate: string | null
  createdAt: Date
}

function buildMonthlySummaryEmail(regs: MonthlyReg[], yearMonth: string) {
  const h = (s: string) => esc(s || '')
  const fmt = (d: Date) =>
    new Date(d).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })

  const rows = regs
    .map(
      (r, i) =>
        `<tr>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;text-align:center;">${i + 1}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;font-size:12px;color:#666;">${fmt(r.createdAt)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;">${h(r.visitorName)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;">${h(r.company)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;">${h(r.hostName)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;">${PURPOSE_MAP[r.purpose] || h(r.purpose)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;font-size:12px;">${h(r.contact)}</td>
          <td style="padding:6px 10px;border:1px solid #e0e4e8;font-size:12px;color:#666;">${h(r.refId)}</td>
        </tr>`,
    )
    .join('')

  const [yy, mm] = yearMonth.split('-')
  return `
<div style="font-family:Arial,'PingFang SC',sans-serif;max-width:900px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:20px 28px;border-radius:12px 12px 0 0;color:#fff;">
    <h2 style="margin:0;font-size:20px;">📋 访客登记月度汇总 — ${yy} 年 ${mm} 月</h2>
  </div>
  <div style="background:#fff;padding:20px 28px 24px;border:1px solid #e0e4e8;border-top:none;border-radius:0 0 12px 12px;">
    <p style="margin:4px 0;"><strong>📊 登记总数：</strong>${regs.length} 条</p>
    <hr style="border:none;border-top:2px dashed #e0e4e8;margin:16px 0;" />
    ${regs.length > 0
      ? `<table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead><tr style="background:#f0f4ff;">
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">#</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">登记时间</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">访客</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">公司</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">被拜访人</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">目的</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">联系方式</th>
            <th style="padding:6px 10px;border:1px solid #e0e4e8;">编号</th>
          </tr></thead>
          <tbody>${rows}</tbody></table>`
      : '<p style="color:#999;text-align:center;padding:20px;">本月无访客登记记录</p>'}
    <p style="color:#999;font-size:12px;margin-top:20px;text-align:center;">⏰ 自动发送 · 每月 1 号 09:00</p>
  </div>
</div>`
}

/**
 * 发送上月访客登记汇总。由外部调度器每月 1 号 09:00 调用一次。
 * 幂等：每次只发「上个月」一整月的数据，重复调用会重复发送（由外部计划任务保证每月只触一次）。
 */
async function sendMonthlySummary(): Promise<{ sent: boolean; count: number }> {
  const now = new Date()
  // 只有每月 1 号才发（外部计划任务也会定时触发，双保险）
  if (now.getDate() !== 1) return { sent: false, count: 0 }

  // 计算上个月的时间范围（当月 1 号 00:00 ~ 当月 1 号 00:00，即上个月整月）
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
  const monthEnd = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  const yearMonth = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`

  const regs = await prisma.visitorRegistration.findMany({
    where: {
      createdAt: { gte: monthStart, lt: monthEnd },
    },
    orderBy: { createdAt: 'asc' },
  })

  const transport = createVisitTransport()
  if (!transport) return { sent: false, count: regs.length }

  const notifyEmail = process.env.VISIT_NOTIFY_EMAIL || 'hr-sz@risunic.com'
  const fromAddr = process.env.VISIT_SMTP_USER || process.env.SMTP_USER || ''

  await transport.sendMail({
    from: fromAddr,
    to: notifyEmail,
    subject: `📋 访客登记月度汇总 - ${yearMonth}`,
    html: buildMonthlySummaryEmail(regs as MonthlyReg[], yearMonth),
  })
  logger.info(`Monthly visit summary sent for ${yearMonth}: ${regs.length} records`)
  return { sent: true, count: regs.length }
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

    // Send email notification (非阻塞：先返回 refId，邮件后台发，避免 SMTP 慢拖跨登记响应)
    const visitTransport = createVisitTransport()
    if (visitTransport) {
      const notifyEmail = process.env.VISIT_NOTIFY_EMAIL || 'hr-sz@risunic.com'
      const fromAddr = process.env.VISIT_SMTP_USER || process.env.SMTP_USER || ''
      const mailPayload = {
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
      }
      // fire-and-forget：不 await，让登记接口立即返回
      visitTransport.sendMail(mailPayload)
        .then(() => logger.info(`Visit notification email sent to ${notifyEmail}`))
        .catch((mailErr) => logger.warn('Visit notification email failed:', mailErr))
    }

    return NextResponse.json({ success: true, refId: registration.refId })
  } catch (err) {
    logger.error('Visitor registration error:', err)
    return NextResponse.json({ error: '服务器内部错误，请稍后重试' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'health') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  // 外部 cron 触发每月汇总（需 admin token）
  if (action === 'run-monthly') {
    const token = req.headers.get('x-admin-token') || searchParams.get('token')
    if (token !== (process.env.ADMIN_TOKEN || 'badminton-admin-2024')) {
      return NextResponse.json({ error: '未授权' }, { status: 403 })
    }
    const result = await sendMonthlySummary()
    return NextResponse.json({ code: 0, ...result })
  }

  return NextResponse.json({ error: '未知操作' }, { status: 400 })
}
