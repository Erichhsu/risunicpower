import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await prisma.blogPost.findFirst({ where: { slug, locale }, select: { title: true, excerpt: true } })
  if (!post) return { title: 'RisunicPower' }
  return { title: post.title + ' — RisunicPower', description: post.excerpt || '' }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'Blog' })
  const p = await prisma.blogPost.findFirst({ where: { slug, locale } })
  if (!p) notFound()

  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'
  const dateLoc: Record<string, string> = { zh: 'zh-CN', ja: 'ja-JP', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', pt: 'pt-BR', ar: 'ar-SA', ru: 'ru-RU' }
  const dl = dateLoc[l] || 'en-US'

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <article className="mx-auto max-w-[800px] px-6">
        <Link href={`/${l}/blog`} className="inline-flex items-center gap-1 text-[1.3rem] text-[#F7D142] hover:underline mb-8">
          <ArrowLeft size={16} /> {t('backToBlog')}
        </Link>

        <div className="flex items-center gap-3 text-[1.2rem] text-[#6b7a8f] mb-4">
          <Calendar size={14} />
          <span>{new Date(p.publishDate).toLocaleDateString(dl)}</span>
          <span className="rounded-full bg-[#F7D142]/10 px-3 py-1 text-[1.1rem] text-[#F7D142]">{p.category}</span>
        </div>

        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] leading-tight mb-6">{p.title}</h1>

        <div
          className="prose prose-lg max-w-none text-[1.4rem] leading-relaxed text-[#2c3e50]"
          dangerouslySetInnerHTML={{ __html: p.content }}
        />

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link href={`/${l}/contact?subject=${encodeURIComponent(p.title)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f2a44] text-white text-[1.3rem] font-semibold hover:bg-[#1e4a7a] transition-colors"
          >
            {t('inquireProduct')}
          </Link>
        </div>
      </article>
    </main>
  )
}
