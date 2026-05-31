import type { Metadata } from 'next'
import SuccessClient from './SuccessClient'

export const metadata: Metadata = {
  title: 'Payment Successful | RisunicPower',
}

export default async function SuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <SuccessClient locale={locale} />
}
