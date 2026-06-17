import { prisma } from '@/lib/db/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://risunicpower.com'
  const locales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']
  const today = new Date().toISOString().split('T')[0]

  // Static routes
  const staticRoutes = ['', '/products', '/contact', '/about', '/blog', '/case-studies', '/privacy', '/solutions']

  // Category listing pages
  const cats = await prisma.productCategory.findMany({ where: { slug: { not: '' } }, select: { slug: true } })
  const catPages = locales.flatMap(locale =>
    cats.map(c => ({
      url: `${baseUrl}/${locale}/products/${c.slug}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )
  const staticPages = locales.flatMap(locale =>
    staticRoutes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  // Product detail pages
  const products = await prisma.product.findMany({ where: { published: true }, select: { slug: true, categorySlug: true } })
  const productPages = locales.flatMap(locale =>
    products.map(p => ({
      url: `${baseUrl}/${locale}/products/${p.categorySlug}/${p.slug}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  // Blog posts
  const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, locale: true, updatedAt: true } })
  const blogPages = posts.map(p => ({
    url: `${baseUrl}/${p.locale}/blog/${p.slug}`,
    lastModified: p.updatedAt.toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Case studies
  const cases = await prisma.caseStudy.findMany({ where: { published: true }, select: { slug: true, locale: true, updatedAt: true } })
  const casePages = cases.map(c => ({
    url: `${baseUrl}/${c.locale}/case-studies/${c.slug}`,
    lastModified: c.updatedAt.toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...catPages, ...productPages, ...blogPages, ...casePages]
}
