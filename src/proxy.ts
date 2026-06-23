// src/proxy.ts — Next.js 16: proxy (merged middleware) with i18n + security
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

// ── Suspicious path blocking ──
const SUSPICIOUS_PATTERNS = [/\.env/, /\.git/, /wp-admin/, /phpmyadmin/, /\.sql/, /vendor/, /\.asp/, /xmlrpc/, /\.cgi/]

// ── Bot user-agent blocking ──
const BLOCKED_BOTS = [
  'GPTBot', 'ChatGPT-User', 'Claude-Web', 'ClaudeBot', 'anthropic-ai',
  'PerplexityBot', 'Amazonbot', 'Bytespider', 'CCBot', 'AhrefsBot',
  'SemrushBot', 'DotBot', 'MJ12bot', 'ZoominfoBot', 'BLEXBot',
  'DataForSeoBot', 'magpie-crawler', 'GrapeshotCrawler',
  'scrapy', 'python-requests', 'python-urllib',
]

function isBot(req: NextRequest): boolean {
  const ua = (req.headers.get('user-agent') || '').toLowerCase()
  return BLOCKED_BOTS.some(bot => ua.includes(bot.toLowerCase()))
}

// ── In-memory rate limiting ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '127.0.0.1'
}

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (record.count >= limit) return false
  record.count++
  return true
}

// Periodic cleanup of rate limit map (every 5 min)
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60_000)

// ── Security headers ──
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.exchangerate-api.com https://api.deepseek.com https://api.stripe.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://hooks.stripe.com",
].join('; ')

// ── Rate limit configs ──
function getRateLimit(pathname: string): { max: number; windowMs: number } {
  if (pathname.startsWith('/api/inquiry') || pathname.startsWith('/api/contact')) {
    return { max: 5, windowMs: 60_000 }
  }
  if (pathname.startsWith('/api/')) {
    return { max: 20, windowMs: 60_000 }
  }
  return { max: 120, windowMs: 30_000 }
}

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. Block suspicious paths
  if (SUSPICIOUS_PATTERNS.some(p => p.test(path))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // 2. Block bad bots
  if (isBot(req)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 3. Rate limiting
  const ip = getClientIp(req)
  const limit = getRateLimit(path)
  if (!checkRateLimit(ip, limit.max, limit.windowMs)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // 4. ⚠️ API routes MUST skip i18n middleware.
  //    next-intl would redirect /api/ai-chat → /en/api/ai-chat → 404.
  //    Security checks (rate limiting, bot blocking) still apply.
  //    DO NOT remove this block or apply intlMiddleware to /api/ paths.
  if (path.startsWith('/api/')) {
    const response = NextResponse.next()
    response.headers.set('Content-Security-Policy', CSP)
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value)
    }
    return response
  }

  // 5. Process i18n middleware for page routes
  const response = intlMiddleware(req)

  // 6. Apply security headers
  response.headers.set('Content-Security-Policy', CSP)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|fonts|icons|manifest|sw|robots).*)'],
}
