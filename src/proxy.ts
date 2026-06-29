import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './lib/i18n/config'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
})

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /en/sitemap.xml → /sitemap.xml (where Next.js serves it)
  if (/^\/(en|zh|ja|es|de|fr|pt|ar|ru)\/sitemap\.xml$/.test(pathname)) {
    return NextResponse.rewrite(new URL('/sitemap.xml', request.url))
  }

  // Skip locale redirect entirely for static files
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt' || pathname === '/manifest.webmanifest' || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
