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
        OR: [
          { translations: { some: { locale, name: { contains: q } } } },
          ...(locale !== 'en' ? [{ translations: { some: { locale: 'en', name: { contains: q } } } }] : []),
        ],
      },
      select: {
        slug: true,
        categorySlug: true,
        translations: { select: { locale: true, name: true } },
      },
      take: 10,
    })

    // 去重
    const seen = new Set<string>()
    const unique = products.filter(p => { const k = p.slug; if (seen.has(k)) return false; seen.add(k); return true }).slice(0, 10)

    // 取翻译：优先当前语言，回退英文
    const results = unique.map(p => {
      const t = p.translations.find(t => t.locale === locale) || p.translations.find(t => t.locale === 'en') || p.translations[0]
      return {
        slug: p.slug,
        categorySlug: p.categorySlug,
        name: t?.name || p.slug,
      }
    })

    // Get category names
    const catSlugs = [...new Set(results.map(p => p.categorySlug))]
    const categories = await prisma.productCategory.findMany({
      where: { slug: { in: catSlugs } },
      select: { slug: true, translations: { select: { locale: true, name: true } } },
    })
    const catMap: Record<string, string> = {}
    for (const c of categories) {
      const ct = c.translations.find(t => t.locale === locale) || c.translations.find(t => t.locale === 'en') || c.translations[0]
      catMap[c.slug] = ct?.name || c.slug
    }

    const final = results.map(p => ({ ...p, categoryName: catMap[p.categorySlug] || p.categorySlug }))

    return NextResponse.json({ results: final })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ results: [] })
  }
}
