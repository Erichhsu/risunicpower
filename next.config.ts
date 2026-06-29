import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.111.144', '172.19.224.1'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  output: 'standalone',
  serverExternalPackages: ['nodemailer'],
}

export default nextConfig
