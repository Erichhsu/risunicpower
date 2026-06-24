import type { Metadata } from 'next'
import VisitForm from './VisitForm'

export const metadata: Metadata = {
  title: '访客登记 · Risunic',
  description: '深圳市晨旭通科技股份有限公司访客登记系统',
  robots: 'noindex, nofollow',
}

export default function VisitPage() {
  return <VisitForm />
}
