import type { Metadata } from 'next'
import privacyContent from '@/lib/legal/privacy'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  return {
    title: isZh ? '隐私政策 - RisunicPower' : 'Privacy Policy - RisunicPower',
    description: isZh
      ? 'RisunicPower隐私政策。了解我们如何收集、使用和保护您的个人信息。'
      : 'RisunicPower Privacy Policy. Learn how we collect, use, and protect your personal information.',
    robots: 'noindex, follow',
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'
  const content = privacyContent[l === 'zh' ? 'zh' : 'en']

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#f7f8fa]">
      <div className="max-w-[900px] mx-auto px-6">
        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] mb-2">{content.title}</h1>
        <p className="text-[1.3rem] text-[#6b7a8f] mb-12">{content.lastUpdated}</p>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-10">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-3">{section.heading}</h2>
              <p className="text-[1.4rem] text-[#4a5568] leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
