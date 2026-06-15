import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const c = await prisma.caseStudy.findFirst({ where: { slug, locale }, select: { title: true } })
  if (!c) return { title: 'RisunicPower' }
  return { title: c.title + ' — RisunicPower' }
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'CaseStudies' })
  const c = await prisma.caseStudy.findFirst({ where: { slug, locale } })
  if (!c) notFound()

  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[800px] px-6">
        <Link href={`/${l}/case-studies`} className="inline-flex items-center gap-1 text-[1.3rem] text-[#F7D142] hover:underline mb-8">
          <ArrowLeft size={16} /> {t('backToCaseStudies')}
        </Link>

        <div className="flex items-center gap-3 text-[1.2rem] text-[#6b7a8f] mb-4">
          <Building2 size={16} />
          <span>{c.client}</span>
          <span>·</span>
          <span>{c.industry}</span>
          <span>·</span>
          <Calendar size={14} />
          <span>{new Date(c.publishDate).toLocaleDateString(l === 'zh' ? 'zh-CN' : l === 'ja' ? 'ja-JP' : 'en-US')}</span>
        </div>

        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] leading-tight mb-12">{c.title}</h1>

        <div className="space-y-10">
          <section>
            <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-4 border-b border-gray-200 pb-2">
              {t('challenge')}
            </h2>
            <p className="text-[1.4rem] leading-relaxed text-[#2c3e50]">{c.challenge}</p>
          </section>

          <section>
            <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-4 border-b border-gray-200 pb-2">
              {t('solution')}
            </h2>
            <p className="text-[1.4rem] leading-relaxed text-[#2c3e50]">{c.solution}</p>
          </section>

          <section>
            <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-4 border-b border-gray-200 pb-2">
              {t('results')}
            </h2>
            <p className="text-[1.4rem] leading-relaxed text-[#2c3e50]">{c.result}</p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link href={`/${l}/contact?subject=${encodeURIComponent(c.title)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f2a44] text-white text-[1.3rem] font-semibold hover:bg-[#1e4a7a] transition-colors"
          >
            {t('getSimilar')}
          </Link>
        </div>
      </div>
    </main>
  )
}
