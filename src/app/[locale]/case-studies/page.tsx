import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { zh: '成功案例 — RisunicPower', ja: '導入事例 — RisunicPower', es: 'Casos de Éxito — RisunicPower', de: 'Fallstudien — RisunicPower', fr: 'Études de Cas — RisunicPower', pt: 'Estudos de Caso — RisunicPower', ar: 'دراسات الحالة — RisunicPower', ru: 'Кейсы — RisunicPower' }
  return { title: titles[locale] || 'Case Studies — RisunicPower' }
}

// 案例页 9语言字典
const CS_TITLE: Record<string, string> = { en: 'Case Studies', zh: '成功案例', ja: '導入事例', es: 'Casos de Éxito', de: 'Fallstudien', fr: 'Études de Cas', pt: 'Estudos de Caso', ar: 'دراسات الحالة', ru: 'Кейсы' }
const CS_DESC: Record<string, string> = { en: 'See how our products help clients solve real-world challenges.', zh: '了解我们的产品如何帮助全球客户解决实际挑战', ja: '当社の製品が世界中のお客様の課題をどのように解決しているかをご覧ください', es: 'Vea cómo nuestros productos ayudan a los clientes a resolver desafíos reales.', de: 'Sehen Sie, wie unsere Produkte Kunden bei der Lösung realer Herausforderungen helfen.', fr: 'Découvrez comment nos produits aident nos clients à résoudre des défis concrets.', pt: 'Veja como nossos produtos ajudam clientes a resolver desafios reais.', ar: 'تعرف على كيفية مساعدة منتجاتنا للعملاء في حل التحديات الواقعية.', ru: 'Узнайте, как наши продукты помогают клиентам решать реальные задачи.' }
const CS_EMPTY: Record<string, string> = { en: 'No case studies yet.', zh: '暂无成功案例', ja: '導入事例はまだありません', es: 'Aún no hay casos de éxito.', de: 'Noch keine Fallstudien.', fr: 'Pas encore d\'études de cas.', pt: 'Nenhum estudo de caso ainda.', ar: 'لا توجد دراسات حالة بعد.', ru: 'Кейсов пока нет.' }

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let cases = await prisma.caseStudy.findMany({
    where: { locale, published: true },
    orderBy: { publishDate: 'desc' },
    select: { slug: true, title: true, client: true, industry: true, result: true, publishDate: true },
  })
  if (cases.length === 0 && locale !== 'en') {
    cases = await prisma.caseStudy.findMany({
      where: { locale: 'en', published: true },
      orderBy: { publishDate: 'desc' },
      select: { slug: true, title: true, client: true, industry: true, result: true, publishDate: true },
    })
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h1 className="text-[3.6rem] font-bold text-[#0f2a44] mb-4">
          {CS_TITLE[locale] || CS_TITLE.en}
        </h1>
        <p className="text-[1.4rem] text-[#6b7a8f] mb-12">
          {CS_DESC[locale] || CS_DESC.en}
        </p>

        {cases.length === 0 ? (
          <div className="py-20 text-center text-[1.4rem] text-gray-400">{CS_EMPTY[locale] || CS_EMPTY.en}</div>
        ) : (
          <div className="space-y-6">
            {cases.map(c => (
              <Link key={c.slug} href={`/${locale}/case-studies/${c.slug}`}
                className="group flex flex-col md:flex-row md:items-center gap-6 rounded-2xl border border-gray-200 p-8 hover:border-[#F7D142]/30 hover:shadow-lg transition-all"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F7D142]/10">
                  <Building2 size={24} className="text-[#F7D142]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[1.8rem] font-bold text-[#0f2a44] mb-1 group-hover:text-[#F7D142] transition-colors">{c.title}</h2>
                  <p className="text-[1.3rem] text-[#6b7a8f]">{c.client} · {c.industry} · {new Date(c.publishDate).toLocaleDateString('en-US')}</p>
                  <p className="mt-2 text-[1.3rem] leading-relaxed text-[#2c3e50] line-clamp-2">{c.result}</p>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-[#F7D142] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
