import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { esc } from '@/lib/email/transport'
import { logger } from '@/lib/logger'
import nodemailer from 'nodemailer'

// ─── Config ───
const MAX_SLOTS = 14
const NOTIFY_EMAIL = process.env.VISIT_NOTIFY_EMAIL || 'hr-sz@risunic.com'

function createTransport() {
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

// ─── Helpers ───

function getThisWednesday(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 3 ? 0 : (3 - day + 7) % 7
  const wed = new Date(now)
  wed.setDate(now.getDate() + diff)
  return wed.toISOString().slice(0, 10)
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generatePairs(names: string[]): string[][] {
  if (names.length < 2) return []
  const shuffled = shuffleArray(names)
  const pairs: string[][] = []
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      pairs.push([shuffled[i], shuffled[i + 1]])
    } else {
      pairs[pairs.length - 1].push(shuffled[i])
    }
  }
  return pairs
}

function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} (${weekdays[d.getDay()]})`
}

const H = (s: string) => esc(s || '')

// ─── Email Templates ───

/** 周三 18:00 预报名名单 + 配对 → HR */
function buildRegistrationEmail(
  activity: { activityDate: string; venue: string; totalSlots: number },
  registrations: { memberName: string; regTime: Date }[],
) {
  const pairs = generatePairs(registrations.map((c) => c.memberName))
  const rows = registrations
    .map(
      (r, i) =>
        `<tr>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;text-align:center;">${i + 1}</td>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;">${H(r.memberName)}</td>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;text-align:center;font-size:13px;color:#666;">${new Date(r.regTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</td>
        </tr>`,
    ).join('')

  const pairRows = pairs
    .map(
      (p, i) =>
        `<tr>
          <td style="padding:6px 12px;border:1px solid #e0e4e8;text-align:center;font-weight:600;">第${i + 1}组</td>
          <td style="padding:6px 12px;border:1px solid #e0e4e8;">${p.map(H).join('  🆚  ')}${p.length === 3 ? '（三人组）' : ''}</td>
        </tr>`).join('')

  return `
<div style="font-family:Arial,'PingFang SC',sans-serif;max-width:640px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:24px 28px;border-radius:12px 12px 0 0;color:#fff;">
    <h2 style="margin:0;font-size:22px;">🏸 周三羽球 · 预报名名单 & 配对</h2>
  </div>
  <div style="background:#fff;padding:22px 28px 28px;border:1px solid #e0e4e8;border-top:none;border-radius:0 0 12px 12px;">
    <p style="margin:4px 0;"><strong>📅 日期：</strong>${formatDateCN(activity.activityDate)}</p>
    <p style="margin:4px 0;"><strong>📍 场地：</strong>${H(activity.venue)}</p>
    <p style="margin:4px 0;"><strong>📊 名额：</strong>${activity.totalSlots}人 &nbsp;|&nbsp; <strong>✍️ 预报名：</strong>${registrations.length}人</p>
    <hr style="border:none;border-top:2px dashed #e0e4e8;margin:18px 0;" />
    <h3 style="margin:0 0 12px;">📋 预报名名单</h3>
    ${registrations.length > 0
      ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead><tr style="background:#f0f4ff;"><th style="padding:8px 12px;border:1px solid #e0e4e8;">#</th><th style="padding:8px 12px;border:1px solid #e0e4e8;text-align:left;">姓名</th><th style="padding:8px 12px;border:1px solid #e0e4e8;">报名时间</th></tr></thead>
          <tbody>${rows}</tbody></table>`
      : '<p style="color:#999;text-align:center;padding:20px;">暂无预报名记录</p>'}
    ${pairs.length > 0
      ? `<hr style="border:none;border-top:2px dashed #e0e4e8;margin:18px 0;" />
        <h3 style="margin:0 0 12px;">🎲 随机双打配对</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead><tr style="background:#f0f4ff;"><th style="padding:6px 12px;border:1px solid #e0e4e8;width:30%;">组别</th><th style="padding:6px 12px;border:1px solid #e0e4e8;text-align:left;">配对</th></tr></thead>
          <tbody>${pairRows}</tbody></table>`
      : ''}
    <p style="color:#999;font-size:12px;margin-top:20px;text-align:center;">⏰ 自动发送 · 周三 18:00</p>
  </div>
</div>`
}

/** 周三 22:00 实际签到结果 → HR */
function buildCheckinEmail(
  activity: { activityDate: string; venue: string; totalSlots: number },
  registrations: { memberName: string; regTime: Date }[],
  checkins: { memberName: string; checkinTime: Date }[],
) {
  const regNames = new Set(registrations.map((r) => r.memberName))
  const checkedNames = new Set(checkins.map((c) => c.memberName))
  const absent = registrations.filter((r) => !checkedNames.has(r.memberName))

  const checkinRows = checkins
    .map(
      (c, i) =>
        `<tr>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;text-align:center;">${i + 1}</td>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;">${regNames.has(c.memberName) ? '✅ ' : '🆕 '}${H(c.memberName)}</td>
          <td style="padding:8px 12px;border:1px solid #e0e4e8;text-align:center;font-size:13px;color:#666;">${new Date(c.checkinTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</td>
        </tr>`).join('')

  const absentRows = absent
    .map((r) => `<tr><td style="padding:6px 12px;border:1px solid #e0e4e8;color:#ff8a80;">${H(r.memberName)}</td></tr>`).join('')

  return `
<div style="font-family:Arial,'PingFang SC',sans-serif;max-width:640px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:24px 28px;border-radius:12px 12px 0 0;color:#fff;">
    <h2 style="margin:0;font-size:22px;">🏸 周三羽球 · 签到汇总</h2>
  </div>
  <div style="background:#fff;padding:22px 28px 28px;border:1px solid #e0e4e8;border-top:none;border-radius:0 0 12px 12px;">
    <p style="margin:4px 0;"><strong>📅 日期：</strong>${formatDateCN(activity.activityDate)}</p>
    <p style="margin:4px 0;"><strong>✍️ 预报名：</strong>${registrations.length}人 &nbsp;|&nbsp; <strong>✅ 实到签到：</strong>${checkins.length}人 &nbsp;|&nbsp; <strong>❌ 未到：</strong>${absent.length}人</p>
    <hr style="border:none;border-top:2px dashed #e0e4e8;margin:18px 0;" />
    <h3 style="margin:0 0 12px;">✅ 签到名单</h3>
    ${checkins.length > 0
      ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead><tr style="background:#f0f4ff;"><th style="padding:8px 12px;border:1px solid #e0e4e8;">#</th><th style="padding:8px 12px;border:1px solid #e0e4e8;text-align:left;">姓名</th><th style="padding:8px 12px;border:1px solid #e0e4e8;">签到时间</th></tr></thead>
          <tbody>${checkinRows}</tbody></table>`
      : '<p style="color:#999;text-align:center;padding:20px;">无人签到</p>'}
    ${absent.length > 0
      ? `<hr style="border:none;border-top:2px dashed #e0e4e8;margin:18px 0;" />
        <h3 style="margin:0 0 12px;">❌ 预报名未到场</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tbody>${absentRows}</tbody></table>`
      : ''}
    <p style="color:#999;font-size:12px;margin-top:20px;text-align:center;">⏰ 自动发送 · 周三 22:00</p>
  </div>
</div>`
}

// ─── Cron ───

let cronInitialized = false

function initCronJobs() {
  if (cronInitialized) return
  cronInitialized = true

  async function maybeSend() {
    const now = new Date()
    const h = now.getHours()
    const m = now.getMinutes()
    const day = now.getDay()
    // Only Wednesday
    if (day !== 3) return

    const wedDate = getThisWednesday()
    const activity = await prisma.badmintonActivity.findUnique({ where: { activityDate: wedDate } })
    if (!activity) return

    const transport = createTransport()
    if (!transport) return
    const fromAddr = process.env.VISIT_SMTP_USER || process.env.SMTP_USER || ''

    // 18:00-18:30 → 预报名名单+配对
    if (h === 18 && m < 30) {
      const regs = await prisma.badmintonRegistration.findMany({
        where: { activityId: activity.id },
        orderBy: { regTime: 'asc' },
      })
      if (regs.length > 0) {
        await transport.sendMail({
          from: fromAddr, to: NOTIFY_EMAIL,
          subject: `🏸 羽毛球预报名 & 配对 - ${wedDate}`,
          html: buildRegistrationEmail(activity, regs),
        })
        logger.info(`Badminton registration email sent (18:00)`)
      }
    }

    // 22:00-22:30 → 签到汇总
    if (h === 22 && m < 30) {
      const regs = await prisma.badmintonRegistration.findMany({
        where: { activityId: activity.id },
        orderBy: { regTime: 'asc' },
      })
      const checkins = await prisma.badmintonCheckin.findMany({
        where: { activityId: activity.id },
        orderBy: { checkinTime: 'asc' },
      })
      await transport.sendMail({
        from: fromAddr, to: NOTIFY_EMAIL,
        subject: `🏸 羽毛球签到汇总 - ${wedDate}`,
        html: buildCheckinEmail(activity, regs, checkins),
      })
      logger.info(`Badminton checkin summary email sent (22:00)`)
    }
  }

  setInterval(maybeSend, 30 * 60 * 1000)
  logger.info('Badminton cron: Wed 18:00 (registration+pairs) + Wed 22:00 (checkin summary)')
}

// ─── API ───

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'health') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  // Registrations list
  if (action === 'registrations') {
    const wedDate = getThisWednesday()
    const activity = await prisma.badmintonActivity.findUnique({ where: { activityDate: wedDate } })
    if (!activity) return NextResponse.json({ code: 0, data: [] })
    const regs = await prisma.badmintonRegistration.findMany({
      where: { activityId: activity.id },
      orderBy: { regTime: 'asc' },
    })
    return NextResponse.json({ code: 0, data: regs })
  }

  // Checkin list
  if (action === 'checkins') {
    const wedDate = getThisWednesday()
    const activity = await prisma.badmintonActivity.findUnique({ where: { activityDate: wedDate } })
    if (!activity) return NextResponse.json({ code: 0, data: [] })
    const checkins = await prisma.badmintonCheckin.findMany({
      where: { activityId: activity.id },
      orderBy: { checkinTime: 'asc' },
    })
    return NextResponse.json({ code: 0, data: checkins })
  }

  // Current activity
  const wedDate = getThisWednesday()
  let activity = await prisma.badmintonActivity.findUnique({ where: { activityDate: wedDate } })
  if (!activity) {
    activity = await prisma.badmintonActivity.create({
      data: { activityDate: wedDate, venue: '公司羽毛球场', totalSlots: MAX_SLOTS, bookedSlots: 0 },
    })
  }
  return NextResponse.json({ code: 0, data: activity })
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  // Manual send-report (admin)
  if (action === 'send-report') {
    const token = req.headers.get('x-admin-token')
    if (token !== (process.env.ADMIN_TOKEN || 'badminton-admin-2024')) {
      return NextResponse.json({ error: '未授权' }, { status: 403 })
    }
    const wedDate = getThisWednesday()
    const activity = await prisma.badmintonActivity.findUnique({ where: { activityDate: wedDate } })
    if (!activity) return NextResponse.json({ error: '今天没有活动' }, { status: 404 })
    const regs = await prisma.badmintonRegistration.findMany({ where: { activityId: activity.id }, orderBy: { regTime: 'asc' } })
    const checkins = await prisma.badmintonCheckin.findMany({ where: { activityId: activity.id }, orderBy: { checkinTime: 'asc' } })
    const transport = createTransport()
    if (!transport) return NextResponse.json({ error: '邮件未配置' }, { status: 500 })
    const fromAddr = process.env.VISIT_SMTP_USER || process.env.SMTP_USER || ''
    await transport.sendMail({
      from: fromAddr, to: NOTIFY_EMAIL,
      subject: `🏸 羽毛球汇总 - ${wedDate}`,
      html: buildCheckinEmail(activity, regs, checkins),
    })
    return NextResponse.json({ success: true })
  }

  // Register or Checkin
  try {
    const body = await req.json()
    const { memberName, activityId, type } = body
    if (!memberName || !activityId) {
      return NextResponse.json({ code: -1, msg: '姓名和活动ID不能为空' }, { status: 400 })
    }
    const name = memberName.trim()
    if (name.length > 20) {
      return NextResponse.json({ code: -1, msg: '姓名不能超过20个字符' }, { status: 400 })
    }

    const isReg = type === 'register'
    const table = isReg ? 'registration' : 'checkin'

    await prisma.$transaction(async (tx) => {
      const activity = await tx.badmintonActivity.findUnique({ where: { id: activityId } })
      if (!activity) throw new Error('活动不存在')

      // Registration: check slots. Checkin: no slot limit (walk-ins allowed)
      if (isReg && activity.bookedSlots >= activity.totalSlots) {
        throw new Error('名额已满，下次请早！')
      }

      if (isReg) {
        await tx.badmintonRegistration.create({ data: { activityId, memberName: name } })
        await tx.badmintonActivity.update({
          where: { id: activityId },
          data: { bookedSlots: activity.bookedSlots + 1 },
        })
      } else {
        await tx.badmintonCheckin.create({ data: { activityId, memberName: name } })
      }
    })

    return NextResponse.json({ code: 0, msg: `${name} ${isReg ? '报名成功' : '签到成功'}！` })
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ code: -1, msg: '已经报过名/签过到了，请勿重复操作' }, { status: 409 })
    }
    logger.error('Badminton error:', err)
    return NextResponse.json({ code: -1, msg: err.message || '操作失败' }, { status: 500 })
  }
}

initCronJobs()
