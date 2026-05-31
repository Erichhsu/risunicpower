import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | RisunicPower',
  description: 'Get in touch with Shenzhen Risunic Technology Co., Ltd. Request a quote, inquire about bulk orders, or ask about custom power solutions.',
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ContactForm locale={locale} />
}
