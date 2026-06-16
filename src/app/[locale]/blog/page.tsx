import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { zh: '博客 — RisunicPower', ja: 'ブログ — RisunicPower', es: 'Blog — RisunicPower', de: 'Blog — RisunicPower', fr: 'Blog — RisunicPower', pt: 'Blog — RisunicPower', ar: 'المدونة — RisunicPower', ru: 'Блог — RisunicPower' }
  return { title: titles[locale] || 'Blog — RisunicPower', description: 'Power industry insights, technology comparisons, and product guides from RisunicPower.' }
}

export default async function BlogListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'
  const dateLoc: Record<string, string> = { zh: 'zh-CN', ja: 'ja-JP', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', pt: 'pt-BR', ar: 'ar-SA', ru: 'ru-RU' }
  const dl = dateLoc[l] || 'en-US'

  // 当前语言博客，无则回退英文
  let posts = await prisma.blogPost.findMany({
    where: { locale: l, published: true },
    orderBy: { publishDate: 'desc' },
    select: { slug: true, title: true, excerpt: true, category: true, publishDate: true, coverImage: true },
  })
  if (posts.length === 0 && l !== 'en') {
    posts = await prisma.blogPost.findMany({
      where: { locale: 'en', published: true },
      orderBy: { publishDate: 'desc' },
      select: { slug: true, title: true, excerpt: true, category: true, publishDate: true, coverImage: true },
    })
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h1 className="text-[3.6rem] font-bold text-[#0f2a44] mb-4">
          {l === 'zh' ? '博客' : l === 'ja' ? 'ブログ' : 'Blog'}
        </h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-12">
          {l === 'zh' ? '电源行业洞察、技术对比与产品指南' : l === 'ja' ? '電源業界の洞察、技術比較、製品ガイド' : 'Power industry insights, technology comparisons, and product guides.'}
        </p>

        {posts.length === 0 ? (
          <div className="py-20 text-center text-[1.4rem] text-gray-400">
            {l === 'zh' ? '暂无博客文章' : l === 'ja' ? 'ブログ記事はまだありません' : 'No blog posts yet.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map(p => (
              <Link key={p.slug} href={`/${l}/blog/${p.slug}`}
                className="group rounded-2xl border border-gray-200 p-8 hover:border-[#F7D142]/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-[1.2rem] text-[#F7D142] mb-4">
                  <Calendar size={14} />
                  <span>{new Date(p.publishDate).toLocaleDateString(dl)}</span>
                  <span className="rounded-full bg-[#F7D142]/10 px-2 py-0.5 text-[1.1rem]">{p.category}</span>
                </div>
                <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-3 group-hover:text-[#F7D142] transition-colors">{p.title}</h2>
                <p className="text-[1.3rem] leading-relaxed text-[#6b7a8f] mb-4">{p.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-[1.3rem] font-semibold text-[#F7D142] group-hover:gap-2 transition-all">
                  {l === 'zh' ? '阅读更多' : l === 'ja' ? '続きを読む' : 'Read More'} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
