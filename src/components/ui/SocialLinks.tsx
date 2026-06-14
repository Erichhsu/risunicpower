'use client'

import { useLocale } from 'next-intl'

interface SocialLink {
  name: string
  href: string
  label: string
  /** WeChat-style: show ID instead of link */
  showId?: string
}

const SOCIAL_LINKS: Record<string, SocialLink[]> = {
  international: [
    { name: 'linkedin', href: 'https://www.linkedin.com/company/risunicpower', label: 'LinkedIn' },
    { name: 'facebook', href: 'https://www.facebook.com/RisunicPower', label: 'Facebook' },
    { name: 'youtube', href: 'https://www.youtube.com/@RisunicPower', label: 'YouTube' },
    { name: 'twitter', href: 'https://twitter.com/RisunicPower', label: 'X (Twitter)' },
    { name: 'whatsapp', href: 'https://wa.me/867552350205', label: 'WhatsApp' },
  ],
  china: [
    { name: 'wechat', href: '#', label: '微信', showId: 'RisunicPower' },
    { name: 'wechatmp', href: '#', label: '公众号', showId: 'RisunicPower' },
  ],
}

const IconSvgs: Record<string, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  wechat: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.261 4.626c-3.429 0-6.235 2.425-6.235 5.426 0 3.002 2.806 5.426 6.235 5.426.354 0 .697-.03 1.03-.085a.996.996 0 01.829.112l2.18 1.277a.384.384 0 00.193.063c.184 0 .333-.152.333-.338a.433.433 0 00-.055-.244l-.446-1.693a.678.678 0 01.247-.761c2.091-1.542 3.133-3.462 3.133-5.428 0-3.002-2.807-5.426-6.235-5.426zm-2.544 2.04a.928.928 0 110 1.856.928.928 0 010-1.855zm5.087 0a.928.928 0 110 1.857.928.928 0 010-1.857z" />
    </svg>
  ),
  wechatmp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15l-4.5-3 7-4-2.5 7 4.5 3-7 4 2.5-7z" />
    </svg>
  ),
}

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  const isZh = locale === 'zh'

  const links = [...SOCIAL_LINKS.international, ...SOCIAL_LINKS.china]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.showId ? undefined : link.href}
          title={link.showId || link.label}
          target={link.showId ? undefined : '_blank'}
          rel={link.showId ? undefined : 'noopener noreferrer'}
          className={`
            inline-flex items-center justify-center w-10 h-10 rounded-lg
            bg-white/10 hover:bg-white/20
            text-white/70 hover:text-white
            transition-all duration-300 hover:scale-110 hover:-translate-y-0.5
            ${link.showId ? 'cursor-default' : ''}
          `}
          {...(link.showId ? { 'data-wechat-id': link.showId } : {})}
        >
          {IconSvgs[link.name]}
        </a>
      ))}
    </div>
  )
}
