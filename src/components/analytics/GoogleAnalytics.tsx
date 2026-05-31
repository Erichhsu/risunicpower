'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
const COOKIE_KEY = 'risunic_cookie_consent'

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    setEnabled(saved === 'all')
  }, [])

  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX' || !enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
