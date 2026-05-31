// src/proxy.ts — Next.js 16 migration: middleware → proxy
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

const SUSPICIOUS_PATTERNS = [/\.env/, /\.git/, /wp-admin/, /phpmyadmin/, /\.sql/, /vendor/, /\.asp/, /xmlrpc/, /\.cgi/]

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (SUSPICIOUS_PATTERNS.some(p => p.test(path))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|images|fonts|icons|manifest|sw|robots).*)'],
}
