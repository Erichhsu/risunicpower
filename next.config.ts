import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts')

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.111.144', '172.19.224.1'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [85],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  output: 'standalone',
  outputFileTracingIncludes: {
    // sharp 图片优化依赖（standalone 打包时强制包含原生二进制，否则 next/image 无法转 WebP）
    '/': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
    // hls.js 客户端依赖（standalone 打包时强制包含，否则视频页无法播放）
    '/video': ['./node_modules/hls.js/**/*'],
  },
  serverExternalPackages: ['nodemailer'],
}

export default withNextIntl(nextConfig)
