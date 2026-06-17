import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CatDef {
  slug: string; name_en: string; name_zh: string
  name_ja?: string; name_ar?: string; name_de?: string; name_es?: string
  name_fr?: string; name_pt?: string; name_ru?: string
  sub_en: string; sub_zh: string
  sub_ja?: string; sub_ar?: string; sub_de?: string; sub_es?: string
  sub_fr?: string; sub_pt?: string; sub_ru?: string
  sort_order?: number
}
interface SpecDef { l: string; v: string; o: number }
interface ImgDef { url: string; alt: string; sortOrder: number; isPrimary: boolean }
interface RevDef {
  author: string; company?: string; country?: string
  rating: number; content: string; createdAt: string
}

interface ProdDef {
  slug: string; cat: string; order: number
  en_name: string; zh_name: string
  ja_name?: string; ar_name?: string; de_name?: string
  es_name?: string; fr_name?: string; pt_name?: string; ru_name?: string
  sku?: string
  features_all?: string[]
  zh_features?: string[]
  ja_features?: string[]; ar_features?: string[]; de_features?: string[]
  es_features?: string[]; fr_features?: string[]; pt_features?: string[]; ru_features?: string[]
  en_description?: string; zh_description?: string
  ja_description?: string; ar_description?: string; de_description?: string
  es_description?: string; fr_description?: string; pt_description?: string; ru_description?: string
  en_specs: SpecDef[]; zh_specs: SpecDef[]
  ja_specs?: SpecDef[]; ar_specs?: SpecDef[]; de_specs?: SpecDef[]
  es_specs?: SpecDef[]; fr_specs?: SpecDef[]; pt_specs?: SpecDef[]; ru_specs?: SpecDef[]
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
    const catLocaleData: [string, string | undefined, string | undefined][] = [
      ['en', cat.name_en, cat.sub_en],
      ['zh', cat.name_zh, cat.sub_zh],
      ['ja', cat.name_ja, cat.sub_ja],
      ['ar', cat.name_ar, cat.sub_ar],
      ['de', cat.name_de, cat.sub_de],
      ['es', cat.name_es, cat.sub_es],
      ['fr', cat.name_fr, cat.sub_fr],
      ['pt', cat.name_pt, cat.sub_pt],
      ['ru', cat.name_ru, cat.sub_ru],
    ]
    for (const [locale, name, subtitle] of catLocaleData) {
      const locName = name || cat.name_en
      const locSub = subtitle || cat.sub_en
      await prisma.productCategoryTranslation.upsert({
        where: { slug_locale: { slug: cat.slug, locale } },
        update: { name: locName, subtitle: locSub },
        create: { slug: cat.slug, locale, name: locName, subtitle: locSub },
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

    const localeData: [string, string | undefined, string | undefined, string[] | undefined, SpecDef[] | undefined][] = [
      ['en', p.en_name, p.en_description, p.features_all, p.en_specs],
      ['zh', p.zh_name, p.zh_description, p.zh_features || p.features_all, p.zh_specs],
      ['ja', p.ja_name, p.ja_description, p.ja_features, p.ja_specs],
      ['ar', p.ar_name, p.ar_description, p.ar_features, p.ar_specs],
      ['de', p.de_name, p.de_description, p.de_features, p.de_specs],
      ['es', p.es_name, p.es_description, p.es_features, p.es_specs],
      ['fr', p.fr_name, p.fr_description, p.fr_features, p.fr_specs],
      ['pt', p.pt_name, p.pt_description, p.pt_features, p.pt_specs],
      ['ru', p.ru_name, p.ru_description, p.ru_features, p.ru_specs],
    ]

    for (const [locale, name, desc, features, specs] of localeData) {
      if (!name && !specs) continue
      const locFeatJson = features ? JSON.stringify(features) : featJson
      const locName = name || p.en_name
      const locDesc = desc || p.en_description || (locName + ' - RisunicPower')
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale } },
        update: { name: locName, subtitle: '', description: locDesc, features: locFeatJson },
        create: { productId: product.id, locale, name: locName, subtitle: '', description: locDesc, features: locFeatJson },
      })
      if (specs && specs.length > 0) {
        await prisma.productSpec.deleteMany({ where: { productId: product.id, locale } })
        for (const spec of specs) {
          await prisma.productSpec.create({
            data: { productId: product.id, locale, label: spec.l, value: spec.v, sortOrder: spec.o },
          })
        }
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
