'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/risunicpower',
    color: 'hover:text-[#1877f2]',
    icon: (h: number) => (
      <svg viewBox="0 0 24 24" fill="currentColor" height={h}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/risunicpower',
    color: 'hover:text-white',
    icon: (h: number) => (
      <svg viewBox="0 0 24 24" fill="currentColor" height={h}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/risunicpower',
    color: 'hover:text-[#0a66c2]',
    icon: (h: number) => (
      <svg viewBox="0 0 24 24" fill="currentColor" height={h}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'WeChat',
    href: '#wechat',
    color: 'hover:text-[#07c160]',
    icon: (h: number) => (
      <svg viewBox="0 0 24 24" fill="currentColor" height={h}>
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.046c.134 0 .24-.112.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .177-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.123zm-2.18 3.385c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.36 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
      </svg>
    ),
    modal: true,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/8675523500205',
    color: 'hover:text-[#25d366]',
    icon: (h: number) => (
      <svg viewBox="0 0 24 24" fill="currentColor" height={h}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

export default function SocialLinks({ size = 20, className = '' }: { size?: number; className?: string }) {
  const t = useTranslations('Footer')
  const [showWechat, setShowWechat] = useState(false)

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {socials.map((s) =>
          s.modal ? (
            <button
              key={s.name}
              onClick={() => setShowWechat(true)}
              className={`text-[#b0bccd] ${s.color} transition-all hover:scale-110`}
              title={s.name}
              aria-label={s.name}
            >
              {s.icon(size)}
            </button>
          ) : (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[#b0bccd] ${s.color} transition-all hover:scale-110`}
              title={s.name}
              aria-label={s.name}
            >
              {s.icon(size)}
            </a>
          )
        )}
      </div>

      {showWechat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowWechat(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-[320px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[1.6rem] font-bold text-[#0E4071] mb-4">WeChat</h3>
            <div className="bg-gray-100 rounded-xl p-4 mb-4 aspect-square flex items-center justify-center">
              <p className="text-gray-400 text-[1.2rem]">RisunicPower</p>
            </div>
            <p className="text-[1.3rem] text-[#4A5D70] mb-2">{t('social.wechatScan')}</p>
            <p className="text-[1.1rem] text-gray-400 mb-4">ID: RisunicPower</p>
            <button
              onClick={() => setShowWechat(false)}
              className="px-6 py-2 rounded-full bg-[#0E4071] text-white text-[1.2rem] hover:bg-[#1a3a5c] transition-colors"
            >
              {t('social.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
