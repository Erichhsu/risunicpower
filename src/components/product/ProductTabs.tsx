'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Spec {
  id: string
  locale: string
  label: string
  value: string
  sortOrder: number
}

export default function ProductTabs({
  specs,
  locale,
  t_techSpecs: techSpecsLabel,
  pt,
  features,
  t_description,
  t_keyFeatures,
}: {
  specs: Spec[]
  locale: string
  t_techSpecs: string
  pt: { description?: string | null; features?: string | null } | null
  features: string[]
  t_description?: string
  t_keyFeatures?: string
}) {
  const t = useTranslations('Product')
  const [activeTab, setActiveTab] = useState(0)

  // Filter specs by locale
  const filteredSpecs =
    specs.filter((s) => s.locale === locale).length > 0
      ? specs.filter((s) => s.locale === locale)
      : specs.filter((s) => s.locale === 'en')

  const tabs = [
    { label: techSpecsLabel, content: 'specs' },
    { label: t_description || t('features'), content: 'desc' },
  ] as const

  return (
    <section className="mb-20">
      {/* Tab Headers */}
      <div className="flex border-b border-[#e2e8ef] mb-8">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-4 text-[1.5rem] font-medium transition-all border-b-2 -mb-[1px] ${
              activeTab === idx
                ? 'border-[#F7D142] text-[#0E4071]'
                : 'border-transparent text-[#4A5D70] hover:text-[#0E4071]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && filteredSpecs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden">
          <table className="w-full text-left">
            <tbody>
              {filteredSpecs.map((spec, i) => (
                <tr key={spec.id} className={i % 2 === 0 ? 'bg-[#ECF1F7]' : 'bg-white'}>
                  <td className="px-6 py-4 text-[1.4rem] font-medium text-[#0E4071] min-w-[120px] sm:w-[220px] border-b border-[#e2e8ef]">
                    {spec.label}
                  </td>
                  <td className="px-6 py-4 text-[1.4rem] text-[#4A5D70] border-b border-[#e2e8ef]">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="prose max-w-none">
          {pt?.description && (
            <div className="text-[1.5rem] text-[#4A5D70] leading-[1.8] mb-6">{pt.description}</div>
          )}
          {features.length > 0 && (
            <div>
              <h3 className="text-[1.8rem] font-bold text-[#0E4071] mb-4">{t_keyFeatures || t('keyFeatures')}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[1.4rem] text-[#4A5D70]">
                    <Check size={16} className="text-[#0eb892] mt-1 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
