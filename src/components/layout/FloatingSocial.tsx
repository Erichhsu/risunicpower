'use client'

import { useState } from 'react'
import SocialLinks from './SocialLinks'

export default function FloatingSocial() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Expanded panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-32 right-6 z-50 flex flex-col gap-3 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-bottom-4">
            <SocialLinks size={28} className="flex-col" />
          </div>
        </>
      )}

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/8675523500205"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all hover:shadow-[#25d366]/40 hover:shadow-2xl animate-bounce-gentle"
        title="WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Social expand toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-[5.5rem] z-50 w-12 h-12 rounded-full bg-[#0E4071] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"
        title="More social"
        aria-label="More social channels"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </>
          )}
        </svg>
      </button>
    </>
  )
}
