'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Send, Loader2, Building, User, Mail, Phone, Package, Hash, MessageSquare } from 'lucide-react'
import SocialLinks from '@/components/ui/SocialLinks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

const sidebarInfo: Record<string, { company: string; rdLabel: string; rdAddr: string; factoryLabel: string; factoryAddr: string; twLabel: string; twAddr: string; tagline: string; whyTitle: string; whyItems: string[] }> = {
  en: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: 'R&D Center', rdAddr: '12F, Building A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: 'Factory', factoryAddr: 'No. 1 Hongchuan Road, Huicheng District, Huizhou City, Guangdong Province, China',
    twLabel: 'Taiwan Office', twAddr: '2F, No. 5, Lane 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · Global Shipping · Certified',
    whyTitle: '\uD83D\uDCA1 Why Work With Us?',
    whyItems: ['\u2713 12+ years of power supply R&D', '\u2713 600+ satisfied clients worldwide', '\u2713 CE, FCC, UL, RoHS certified', '\u2713 OEM/ODM welcome', '\u2713 Global shipping available'],
  },
  zh: {
    company: '\u6DF1\u5733\u5E02\u6668\u65ED\u901A\u79D1\u6280\u80A1\u4EFD\u6709\u9650\u516C\u53F8',
    rdLabel: '\u7814\u53D1\u4E2D\u5FC3', rdAddr: '\u6DF1\u5733\u5E02\u5149\u660E\u533A\u7389\u5858\u8857\u9053\u7530\u5BEE\u793E\u533A\u540C\u4EC1\u8DEF\u76DB\u835F\u7EA2\u661F\u521B\u667A\u5E7F\u573AA\u5EA712F',
    factoryLabel: '\u5DE5\u5382', factoryAddr: '\u5E7F\u4E1C\u7701\u60E0\u5DDE\u5E02\u60E0\u57CE\u533A\u5B8F\u5DDD\u8DEF1\u53F7',
    twLabel: '\u53F0\u5317\u529E\u4E8B\u5904', twAddr: '\u53F0\u5317\u5E02\u5185\u6E56\u533A\u9633\u5149\u8857345\u5DF75\u53F72F',
    tagline: 'OEM/ODM \u00b7 \u5168\u7403\u53D1\u8D27 \u00b7 \u8D44\u8D28\u8BA4\u8BC1',
    whyTitle: '\uD83D\uDCA1 \u4E3A\u4EC0\u4E48\u9009\u62E9\u6211\u4EEC\uFF1F',
    whyItems: ['\u2713 12\u5E74\u4EE5\u4E0A\u7535\u6E90\u7814\u53D1\u7ECF\u9A8C', '\u2713 \u5168\u7403600+\u6EE1\u610F\u5BA2\u6237', '\u2713 CE\u3001FCC\u3001UL\u3001RoHS \u8BA4\u8BC1', '\u2713 \u6B22\u8FCEOEM/ODM\u5408\u4F5C', '\u2713 \u652F\u6301\u5168\u7403\u53D1\u8D27'],
  },
  ja: {
    company: '\u6DF1\u30BB\u30F3\u5E02\u6668\u65ED\u901A\u79D1\u6280\u80A1\u4EFD\u6709\u9650\u516C\u53F8',
    rdLabel: '\u7814\u7A76\u958B\u767A\u30BB\u30F3\u30BF\u30FC', rdAddr: '\u6DF1\u5733\u5E02\u5149\u660E\u533A\u7389\u5858\u8857\u9053\u7530\u5BEE\u793E\u533A\u540C\u4EC1\u8DEF\u76DB\u835F\u7D05\u661F\u5275\u667A\u5E83\u5834A\u68DF12F',
    factoryLabel: '\u5DE5\u5834', factoryAddr: '\u5E83\u6771\u7701\u60E0\u5DDE\u5E02\u60E0\u57CE\u533A\u5B8F\u5DDD\u8DEF1\u53F7',
    twLabel: '\u53F0\u6E7E\u30AA\u30D5\u30A3\u30B9', twAddr: '\u53F0\u5317\u5E02\u5185\u6E56\u533A\u967D\u5149\u8857345\u5DF75\u53F72F',
    tagline: 'OEM/ODM \u00b7 \u30B0\u30ED\u30FC\u30D0\u30EB\u914D\u9001 \u00b7 \u8A8D\u8A3C\u53D6\u5F97\u6E08',
    whyTitle: '\uD83D\uDCA1 \u5F53\u793E\u3092\u9078\u3076\u7406\u7531',
    whyItems: ['\u2713 12\u5E74\u4EE5\u4E0A\u306E\u96FB\u6E90\u958B\u767A\u7D4C\u9A13', '\u2713 \u4E16\u754C600\u793E\u4EE5\u4E0A\u306E\u304A\u5BA2\u69D8', '\u2713 CE\u3001FCC\u3001UL\u3001RoHS\u8A8D\u8A3C', '\u2713 OEM/ODM\u6B53\u8FCE', '\u2713 \u30B0\u30ED\u30FC\u30D0\u30EB\u914D\u9001\u5BFE\u5FDC'],
  },
}
const si = (locale: string) => {
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'
  return sidebarInfo[l] || sidebarInfo.en
}

const phonePattern = /^[\d\s\-+()]{6,20}$/

export default function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('Contact')
  const searchParams = useSearchParams()
  const defaultProduct = searchParams.get('product') || searchParams.get('type') === 'wholesale' ? 'Wholesale Inquiry' : ''

  const schema = z.object({
    company: z.string().min(1, t('required')),
    name: z.string().min(1, t('required')),
    email: z.string().email(t('invalidEmail')),
    phone: z.string().regex(phonePattern, '').optional().or(z.literal('')),
    productName: z.string().optional(),
    quantity: z.string().optional(),
    message: z.string().min(10, t('required')),
  })

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { productName: defaultProduct },
  })

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (data: FormData) => {
    setStatus('sending')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })
      if (!res.ok) throw new Error('API error')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-[600px] mx-auto px-[clamp(2rem,5vw,8rem)] text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[#0eb892]/10 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[#0eb892]" />
          </div>
          <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-4">{t('form.success')}</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4">{t('title')}</h1>
          <div className="divider-washi" />
          <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <motion.form onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#e2e8ef] p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Building size={16} />} label={t('form.company')} error={errors.company?.message}>
                <input {...register('company')} className="input-field" placeholder="Shenzhen Risunic Technology Co., Ltd." />
              </Field>
              <Field icon={<User size={16} />} label={t('form.name')} error={errors.name?.message}>
                <input {...register('name')} className="input-field" placeholder={t('form.name')} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Mail size={16} />} label={t('form.email')} error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder="email@company.com" />
              </Field>
              <Field icon={<Phone size={16} />} label={t('form.phone')} error={errors.phone?.message}>
                <input {...register('phone')} className="input-field" placeholder="+86 755 8888 8888" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Package size={16} />} label={t('form.product')}>
                <input {...register('productName')} className="input-field" placeholder="e.g., POE-60W" />
              </Field>
              <Field icon={<Hash size={16} />} label={t('form.quantity')}>
                <select {...register('quantity')} className="input-field">
                  <option value="">Select quantity</option>
                  <option value="1-10">1-10 pcs</option>
                  <option value="10-100">10-100 pcs</option>
                  <option value="100-1000">100-1,000 pcs</option>
                  <option value="1000-10000">1,000-10,000 pcs</option>
                  <option value="10000+">10,000+ pcs</option>
                </select>
              </Field>
            </div>
            <Field icon={<MessageSquare size={16} />} label={t('form.message')} error={errors.message?.message}>
              <textarea {...register('message')} rows={5} className="input-field resize-y" placeholder="Tell us about your requirements..." />
            </Field>

            {status === 'error' && (
              <p className="text-[1.3rem] text-[#e74c3c] bg-red-50 p-3 rounded-lg">{t('formError')}</p>
            )}

            <button type="submit" disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#F7D142] text-white font-semibold text-[1.5rem] hover:bg-[#9a3a1e] transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
              {status === 'sending' ? t('sending') : t('form.submit')}
            </button>
          </motion.form>

          <div className="space-y-6">
            <div className="bg-[#0f2a44] text-white p-8 rounded-2xl">
              <h3 className="font-brand text-[2rem] font-bold mb-6">Risunic<span className="text-[#F7D142]">Power</span></h3>
              <div className="space-y-5 text-[1.3rem] text-[#b0bccd]">
                <p className="font-semibold text-white text-[1.5rem]">{si(locale).company}</p>
                
                <div>
                  <p className="text-[1.1rem] uppercase tracking-wider text-white/50 mb-1">{si(locale).rdLabel}</p>
                  <p>{si(locale).rdAddr}</p>
                </div>

                <div>
                  <p className="text-[1.1rem] uppercase tracking-wider text-white/50 mb-1">{si(locale).factoryLabel}</p>
                  <p>{si(locale).factoryAddr}</p>
                </div>

                <div>
                  <p className="text-[1.1rem] uppercase tracking-wider text-white/50 mb-1">{si(locale).twLabel}</p>
                  <p>{si(locale).twAddr}</p>
                </div>

                <div className="pt-2 space-y-1.5">
                  <p><a href="mailto:erich.hsu@risunicpower.com" className="text-white hover:text-[#F7D142] transition-colors">{'\u2709'} erich.hsu@risunicpower.com</a></p>
                  <p>{'\uD83D\uDCDE'} +86 755 2350 0205</p>
                </div>
                
                <p className="text-[1.1rem] text-[#F7D142] pt-1">{si(locale).tagline}</p>
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <SocialLinks />
              </div>
            </div>
            <div className="bg-[#f7f8fa] p-6 rounded-2xl space-y-3">
              <h4 className="font-semibold text-[1.4rem] text-[#0f2a44]">{si(locale).whyTitle}</h4>
              <ul className="space-y-2 text-[1.3rem] text-[#6b7a8f]">
                {si(locale).whyItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ icon, label, error, children }: { icon: React.ReactNode; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[1.3rem] font-medium text-[#0f2a44] mb-1.5">
        {icon} {label}
      </label>
      {children}
      {error && <p className="text-[1.2rem] text-[#e74c3c] mt-1">{error}</p>}
    </div>
  )
}
