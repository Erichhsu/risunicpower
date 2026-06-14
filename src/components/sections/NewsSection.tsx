import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

interface Props { locale: string }

export default async function NewsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'Header' })
  const ft = await getTranslations({ locale, namespace: 'Home' })

  const l = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru'].includes(locale) ? locale : 'en'
  const posts = await prisma.blogPost.findMany({
    where: { locale: l, published: true },
    orderBy: { publishDate: 'desc' },
    take: 4,
    select: { slug: true, title: true, category: true, publishDate: true },
  })

  if (posts.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle">{t('blog')}</p>
          <h2 className="section-title">{t('blog')}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(p => (
            <Link key={p.slug} href={`/${l}/blog/${p.slug}`}
              className="card-ts group"
            >
              <div className="flex items-center gap-2 text-[1.2rem] text-[#F7D142] mb-3">
                <Calendar size={14} />
                <span>{new Date(p.publishDate).toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US')}</span>
              </div>
              <span className="inline-block rounded-full bg-[#F7D142]/10 px-3 py-1 text-[1.1rem] text-[#0E4071] mb-3">{p.category}</span>
              <h3 className="text-[1.5rem] font-bold text-[#0E4071] mb-3 group-hover:text-[#F7D142] transition-colors line-clamp-2">{p.title}</h3>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href={`/${l}/blog`}
            className="inline-flex items-center gap-2 text-[1.4rem] font-medium text-[#0E4071] hover:text-[#F7D142] transition-colors"
          >{ft('viewAll')} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}
