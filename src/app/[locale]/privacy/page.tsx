import type { Metadata } from 'next'
import privacyContent from '@/lib/legal/privacy'

type Props = { params: Promise<{ locale: string }> }

const metaTitle: Record<string, string> = {
  en: 'Privacy Policy - RisunicPower', zh: '隐私政策 - RisunicPower', ja: 'プライバシーポリシー - RisunicPower',
  es: 'Política de Privacidad - RisunicPower', de: 'Datenschutzerklärung - RisunicPower',
  fr: 'Politique de Confidentialité - RisunicPower', pt: 'Política de Privacidade - RisunicPower',
  ar: 'سياسة الخصوصية - RisunicPower', ru: 'Политика Конфиденциальности - RisunicPower',
}
const metaDesc: Record<string, string> = {
  en: 'RisunicPower Privacy Policy. Learn how we collect, use, and protect your personal information.',
  zh: 'RisunicPower隐私政策。了解我们如何收集、使用和保护您的个人信息。',
  ja: 'RisunicPowerのプライバシーポリシー。お客様の個人情報の収集、利用、保護について説明します。',
  es: 'Política de Privacidad de RisunicPower. Conozca cómo recopilamos, utilizamos y protegemos su información personal.',
  de: 'Datenschutzerklärung von RisunicPower. Erfahren Sie, wie wir Ihre personenbezogenen Daten erfassen, nutzen und schützen.',
  fr: 'Politique de Confidentialité de RisunicPower. Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles.',
  pt: 'Política de Privacidade da RisunicPower. Saiba como coletamos, usamos e protegemos suas informações pessoais.',
  ar: 'سياسة خصوصية RisunicPower. تعرف على كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.',
  ru: 'Политика конфиденциальности RisunicPower. Узнайте, как мы собираем, используем и защищаем вашу личную информацию.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const l = supportedLocales.includes(locale) ? locale : 'en'
  return {
    title: metaTitle[l] || metaTitle.en,
    description: metaDesc[l] || metaDesc.en,
    robots: 'noindex, follow',
  }
}

const supportedLocales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const l = supportedLocales.includes(locale) ? locale : 'en'
  const content = privacyContent[l] || privacyContent.en

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
