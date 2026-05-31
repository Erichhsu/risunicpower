import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://risunicpower.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/cart/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
