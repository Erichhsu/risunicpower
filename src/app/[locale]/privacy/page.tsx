import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = locale === 'zh'
    ? { title: '隐私政策 — RisunicPower', desc: '晨旭通科技隐私政策' }
    : locale === 'ja'
    ? { title: 'プライバシーポリシー — RisunicPower', desc: 'RisunicPowerのプライバシーポリシー' }
    : { title: 'Privacy Policy — RisunicPower', desc: 'RisunicPower Privacy Policy' }
  return { title: t.title, description: t.desc }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const content = locale === 'zh' ? {
    title: '隐私政策',
    updated: '最后更新：2026年5月',
    sections: [
      { h: '1. 信息收集', p: '我们收集您在使用本网站时主动提供的信息，包括姓名、公司名称、邮箱地址、电话号码以及在询价表单中提交的产品需求。我们还通过 Cookie 收集匿名浏览数据以优化用户体验。' },
      { h: '2. 信息使用', p: '收集的信息用于处理您的询价请求、提供产品报价、发送订单确认邮件以及改善网站服务。我们不会将您的个人信息出售给第三方。' },
      { h: '3. 数据存储', p: '您的数据存储在中国境内的安全服务器上。我们采取合理的技术措施保护您的个人信息，但无法保证绝对安全。' },
      { h: '4. 第三方服务', p: '我们使用 Stripe 处理支付，使用 Google Analytics 分析网站流量。这些服务提供商有其独立的隐私政策。' },
      { h: '5. 您的权利', p: '您有权访问、更正或删除您的个人信息。如需行使这些权利，请通过联系我们页面与我们取得联系。' },
      { h: '6. 联系我们', p: '邮箱：info@risunicpower.com | 地址：中国广东省深圳市宝安区' },
    ]
  } : locale === 'ja' ? {
    title: 'プライバシーポリシー',
    updated: '最終更新：2026年5月',
    sections: [
      { h: '1. 情報収集', p: 'お客様が本サイトで自主的に提供される情報（氏名、会社名、メールアドレス、電話番号、お問い合わせフォームの製品情報）を収集します。また、Cookieを通じて匿名の閲覧データを収集し、ユーザー体験を改善します。' },
      { h: '2. 情報の利用', p: '収集した情報は、お問い合わせ対応、製品見積もり、注文確認メールの送信、サイト改善に使用されます。お客様の個人情報を第三者に販売することはありません。' },
      { h: '3. データ保存', p: 'お客様のデータは中国国内の安全なサーバーに保存されます。合理的な技術的手段を用いて保護していますが、絶対的な安全性を保証するものではありません。' },
      { h: '4. 第三者サービス', p: '決済処理にStripe、アクセス解析にGoogle Analyticsを使用しています。各サービス提供者には独自のプライバシーポリシーがあります。' },
      { h: '5. お客様の権利', p: 'お客様はご自身の個人情報へのアクセス、訂正、削除を要求する権利があります。権利行使についてはお問い合わせページからご連絡ください。' },
      { h: '6. お問い合わせ', p: 'メール：info@risunicpower.com | 住所：中国広東省深圳市宝安区' },
    ]
  } : {
    title: 'Privacy Policy',
    updated: 'Last updated: May 2026',
    sections: [
      { h: '1. Information We Collect', p: 'We collect information you voluntarily provide when using this website, including name, company name, email address, phone number, and product interests submitted through inquiry forms. We also collect anonymous browsing data through cookies to improve user experience.' },
      { h: '2. How We Use Your Information', p: 'The collected information is used to process your inquiries, provide product quotations, send order confirmations, and improve our services. We do not sell your personal information to third parties.' },
      { h: '3. Data Storage', p: 'Your data is stored on secure servers within China. We employ reasonable technical measures to protect your personal information, though no method of transmission is 100% secure.' },
      { h: '4. Third-Party Services', p: 'We use Stripe for payment processing and Google Analytics for traffic analysis. These providers have their own privacy policies governing data handling.' },
      { h: '5. Your Rights', p: 'You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us through the Contact page.' },
      { h: '6. Contact Us', p: 'Email: info@risunicpower.com | Address: Bao\'an District, Shenzhen, Guangdong, China' },
    ]
  }

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-[800px] px-6">
        <h1 className="text-[3.2rem] font-bold text-[#0f2a44] mb-8">{content.title}</h1>
        <p className="text-[1.3rem] text-[#6b7a8f] mb-12">{content.updated}</p>

        <div className="space-y-10">
          {content.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[2rem] font-bold text-[#0f2a44] mb-3">{s.h}</h2>
              <p className="text-[1.4rem] leading-relaxed text-[#2c3e50]">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
