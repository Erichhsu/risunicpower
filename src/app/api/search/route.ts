import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  const locale = req.nextUrl.searchParams.get('locale') || 'en'

  if (!q || q.length < 1) return NextResponse.json({ results: [] })

  try {
    const products = await prisma.product.findMany({
      where: {
        published: true,
        translations: {
          some: {
            locale,
            name: { contains: q },
          },
        },
      },
      select: {
        slug: true,
        categorySlug: true,
        translations: { where: { locale }, select: { name: true } },
      },
      take: 10,
    })

    // Get category names
    const catSlugs = [...new Set(products.map(p => p.categorySlug))]
    const categories = await prisma.productCategory.findMany({
      where: { slug: { in: catSlugs } },
      select: {
        slug: true,
        translations: { where: { locale }, select: { name: true } },
      },
    })
    const catMap = Object.fromEntries(
      categories.map(c => [c.slug, c.translations[0]?.name || c.slug])
    )

    const results = products.map(p => ({
      slug: p.slug,
      categorySlug: p.categorySlug,
      name: p.translations[0]?.name || p.slug,
      categoryName: catMap[p.categorySlug] || p.categorySlug,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ results: [] })
  }
}
