import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = locale === 'zh' ? '成功案例 — RisunicPower' : 'Case Studies — RisunicPower'
  return { title: t }
}

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

  const cases = await prisma.caseStudy.findMany({
    where: { locale: l, published: true },
    orderBy: { publishDate: 'desc' },
    select: { slug: true, title: true, client: true, industry: true, result: true, publishDate: true },
  })

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h1 className="text-[3.6rem] font-bold text-[#0f2a44] mb-4">
          {l === 'zh' ? '成功案例' : l === 'ja' ? '導入事例' : 'Case Studies'}
        </h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-12">
          {l === 'zh' ? '了解我们的产品如何帮助全球客户解决实际挑战' : 'See how our products help clients solve real-world challenges.'}
        </p>

        {cases.length === 0 ? (
          <div className="py-20 text-center text-[1.4rem] text-gray-400">No case studies yet.</div>
        ) : (
          <div className="space-y-6">
            {cases.map(c => (
              <Link key={c.slug} href={`/${l}/case-studies/${c.slug}`}
                className="group flex flex-col md:flex-row md:items-center gap-6 rounded-2xl border border-gray-200 p-8 hover:border-[#c44a2b]/30 hover:shadow-lg transition-all"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#c44a2b]/10">
                  <Building2 size={24} className="text-[#c44a2b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[1.8rem] font-bold text-[#0f2a44] mb-1 group-hover:text-[#c44a2b] transition-colors">{c.title}</h2>
                  <p className="text-[1.3rem] text-[#6b7a8f]">{c.client} · {c.industry} · {new Date(c.publishDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-[1.3rem] leading-relaxed text-[#2c3e50] line-clamp-2">{c.result}</p>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-[#c44a2b] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
