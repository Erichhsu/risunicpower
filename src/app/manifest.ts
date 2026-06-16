import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RisunicPower — Industrial Power Supply Solutions',
    short_name: 'RisunicPower',
    description: 'POE power supplies, adapters, UPS, inverters, portable power stations, and solar energy storage systems. Serving 600+ clients across 50+ countries since 2014.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f2a44',
    orientation: 'any',
    icons: [
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
    categories: ['business', 'utilities', 'shopping'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
  }
}
