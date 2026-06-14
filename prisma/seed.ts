import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CatDef {
  slug: string; name_en: string; name_zh: string; sub_en: string; sub_zh: string; sort_order?: number
}
interface SpecDef { l: string; v: string; o: number }
interface ImgDef { url: string; alt: string; sortOrder: number; isPrimary: boolean }
interface RevDef {
  author: string; company?: string; country?: string
  rating: number; content: string; createdAt: string
}

interface ProdDef {
  slug: string; cat: string; order: number; en_name: string; zh_name: string
  sku?: string
  features_all?: string[]
  en_description?: string
  zh_description?: string
  en_specs: SpecDef[]; zh_specs: SpecDef[]
  images: ImgDef[]
  reviews?: RevDef[]
}

interface BlogDef {
  slug: string; locale: string; title: string; excerpt?: string
  content: string; category?: string; author?: string
  published: boolean; publishDate: string
}

interface CaseDef {
  slug: string; locale: string; title: string; client: string; industry: string
  challenge: string; solution: string; result: string
  published: boolean; publishDate: string
}

async function main() {
  console.log('Seeding database...')

  const dataPath = path.join(__dirname, 'seed_data.json')
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const data = JSON.parse(raw)

  const categories: CatDef[] = data.categories
  const products: ProdDef[] = data.products

  /* ───────── Blog Posts ───────── */
  const blogPosts: BlogDef[] = data.blog_posts || []
  for (const bp of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug_locale: { slug: bp.slug, locale: bp.locale } },
      update: {
        title: bp.title, excerpt: bp.excerpt || '', content: bp.content,
        category: bp.category || 'general', author: bp.author || 'RisunicPower',
        published: bp.published, publishDate: new Date(bp.publishDate),
      },
      create: {
        slug: bp.slug, locale: bp.locale, title: bp.title, excerpt: bp.excerpt || '',
        content: bp.content, category: bp.category || 'general',
        author: bp.author || 'RisunicPower',
        published: bp.published, publishDate: new Date(bp.publishDate),
      },
    })
  }
  console.log('  Synced ' + blogPosts.length + ' blog posts')

  /* ───────── Case Studies ───────── */
  const caseStudies: CaseDef[] = data.case_studies || []
  for (const cs of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { slug_locale: { slug: cs.slug, locale: cs.locale } },
      update: {
        title: cs.title, client: cs.client, industry: cs.industry,
        challenge: cs.challenge, solution: cs.solution, result: cs.result,
        published: cs.published, publishDate: new Date(cs.publishDate),
      },
      create: {
        slug: cs.slug, locale: cs.locale, title: cs.title, client: cs.client,
        industry: cs.industry, challenge: cs.challenge, solution: cs.solution,
        result: cs.result, published: cs.published, publishDate: new Date(cs.publishDate),
      },
    })
  }
  console.log('  Synced ' + caseStudies.length + ' case studies')

  // Clean up old categories not in current data
  const activeSlugs = new Set(categories.map(c => c.slug))
  const existingCats = await prisma.productCategory.findMany({ select: { slug: true } })
  for (const ec of existingCats) {
    if (!activeSlugs.has(ec.slug)) {
      await prisma.productCategory.delete({ where: { slug: ec.slug } })
      console.log('  Removed stale category: ' + ec.slug)
    }
  }

  // Create categories
  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { sortOrder: cat.sort_order ?? 0, icon: '', published: true },
      create: { slug: cat.slug, sortOrder: cat.sort_order ?? 0, icon: '', published: true },
    })
    for (const [locale, name, subtitle] of [['en', cat.name_en, cat.sub_en], ['zh', cat.name_zh, cat.sub_zh]] as const) {
      await prisma.productCategoryTranslation.upsert({
        where: { slug_locale: { slug: cat.slug, locale } },
        update: { name, subtitle },
        create: { slug: cat.slug, locale, name, subtitle },
      })
    }
  }

  // Create products
  for (const p of products) {
    const featJson = p.features_all ? JSON.stringify(p.features_all) : '[]'

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { categorySlug: p.cat, sortOrder: p.order, published: true, sku: p.sku || undefined },
      create: { slug: p.slug, categorySlug: p.cat, sortOrder: p.order, published: true, featured: false, priceCents: 0, sku: p.sku || undefined },
    })

    for (const [locale, name, desc] of [['en', p.en_name, p.en_description], ['zh', p.zh_name, p.zh_description]] as const) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale } },
        update: { name, subtitle: '', description: desc || (name + ' - RisunicPower'), features: featJson },
        create: { productId: product.id, locale, name, subtitle: '', description: desc || (name + ' - RisunicPower'), features: featJson },
      })
    }

    for (const [locale, specs] of [['en', p.en_specs], ['zh', p.zh_specs]] as const) {
      await prisma.productSpec.deleteMany({ where: { productId: product.id, locale } })
      for (const spec of specs) {
        await prisma.productSpec.create({
          data: { productId: product.id, locale, label: spec.l, value: spec.v, sortOrder: spec.o },
        })
      }
    }

    // Import images
    if (p.images && p.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of p.images) {
        await prisma.productImage.create({
          data: { productId: product.id, url: img.url, alt: img.alt, sortOrder: img.sortOrder, isPrimary: img.isPrimary },
        })
      }
    }

    // Import reviews
    if (p.reviews && p.reviews.length > 0) {
      await prisma.productReview.deleteMany({ where: { productId: product.id } })
      for (const rev of p.reviews) {
        await prisma.productReview.create({
          data: {
            productId: product.id,
            rating: rev.rating,
            author: rev.author,
            company: rev.company || null,
            country: rev.country || null,
            content: rev.content,
            createdAt: new Date(rev.createdAt),
          },
        })
      }
    }

    console.log('  ' + p.slug + ' (SKU: ' + (p.sku || 'N/A') + ', ' + p.en_specs.length + ' specs, ' + (p.images?.length || 0) + ' images, ' + (p.features_all?.length || 0) + ' features, ' + (p.reviews?.length || 0) + ' reviews)')
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
