'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Send, Loader2, Building, User, Mail, Phone, Package, Hash, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const localeLabels: Record<string, Record<string, string>> = {
  en: { title: 'Contact Us', desc: 'Send us a message and our team will get back to you within 24 hours.', company: 'Company Name', name: 'Your Name', email: 'Email Address', phone: 'Phone Number (optional)', product: 'Product Interested In (optional)', quantity: 'Estimated Quantity (optional)', msg: 'Your Message', submit: 'Send Inquiry', sending: 'Sending...', sent: 'Thank you! Your inquiry has been received. We\'ll respond within 24 hours.', error: 'Something went wrong. Please try again.', required: 'Required', invalidEmail: 'Invalid email address' },
  zh: { title: '联系我们', desc: '发送消息给我们，我们的团队将在24小时内回复您。', company: '公司名称', name: '您的姓名', email: '邮箱地址', phone: '电话（选填）', product: '感兴趣的产品（选填）', quantity: '预估数量（选填）', msg: '您的留言', submit: '发送询盘', sending: '发送中...', sent: '感谢您的询盘！我们将在24小时内回复。', error: '出错了，请重试。', required: '必填', invalidEmail: '邮箱格式不正确' },
  ja: { title: 'お問い合わせ', desc: 'メッセージをお送りください。24時間以内にご返信いたします。', company: '会社名', name: 'お名前', email: 'メールアドレス', phone: '電話番号（任意）', product: 'ご希望の製品（任意）', quantity: 'ご希望数量（任意）', msg: 'メッセージ', submit: '送信する', sending: '送信中...', sent: 'お問い合わせいただきありがとうございます。24時間以内にご返信いたします。', error: 'エラーが発生しました。もう一度お試しください。', required: '必須', invalidEmail: 'メールアドレスの形式が正しくありません' },
}
function lbl(locale: string, key: string): string {
  return (localeLabels[locale] || localeLabels.en)[key] || key
}

const phonePattern = /^[\d\s\-+()]{6,20}$/

export default function ContactForm({ locale }: { locale: string }) {
  const searchParams = useSearchParams()
  const defaultProduct = searchParams.get('product') || searchParams.get('type') === 'wholesale' ? 'Wholesale Inquiry' : ''

  const schema = z.object({
    company: z.string().min(1, lbl(locale, 'required')),
    name: z.string().min(1, lbl(locale, 'required')),
    email: z.string().email(lbl(locale, 'invalidEmail')),
    phone: z.string().regex(phonePattern, '').optional().or(z.literal('')),
    productName: z.string().optional(),
    quantity: z.string().optional(),
    message: z.string().min(10, lbl(locale, 'required')),
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
          <h1 className="text-[2.4rem] font-bold text-[#0f2a44] mb-4">{lbl(locale, 'sent')}</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-bold text-[#0f2a44] mb-4">{lbl(locale, 'title')}</h1>
          <div className="divider-washi" />
          <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mx-auto">{lbl(locale, 'desc')}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <motion.form onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#e2e8ef] p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Building size={16} />} label={lbl(locale, 'company')} error={errors.company?.message}>
                <input {...register('company')} className="input-field" placeholder="Shenzhen Risunic Technology Co., Ltd." />
              </Field>
              <Field icon={<User size={16} />} label={lbl(locale, 'name')} error={errors.name?.message}>
                <input {...register('name')} className="input-field" placeholder={lbl(locale, 'name')} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Mail size={16} />} label={lbl(locale, 'email')} error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder="email@company.com" />
              </Field>
              <Field icon={<Phone size={16} />} label={lbl(locale, 'phone')} error={errors.phone?.message}>
                <input {...register('phone')} className="input-field" placeholder="+86 755 8888 8888" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Package size={16} />} label={lbl(locale, 'product')}>
                <input {...register('productName')} className="input-field" placeholder="e.g., POE-60W" />
              </Field>
              <Field icon={<Hash size={16} />} label={lbl(locale, 'quantity')}>
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
            <Field icon={<MessageSquare size={16} />} label={lbl(locale, 'msg')} error={errors.message?.message}>
              <textarea {...register('message')} rows={5} className="input-field resize-y" placeholder="Tell us about your requirements..." />
            </Field>

            {status === 'error' && (
              <p className="text-[1.3rem] text-[#e74c3c] bg-red-50 p-3 rounded-lg">{lbl(locale, 'error')}</p>
            )}

            <button type="submit" disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.5rem] hover:bg-[#9a3a1e] transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
              {status === 'sending' ? lbl(locale, 'sending') : lbl(locale, 'submit')}
            </button>
          </motion.form>

          <div className="space-y-6">
            <div className="bg-[#0f2a44] text-white p-8 rounded-2xl">
              <h3 className="font-brand text-[2rem] font-bold mb-6">Risunic<span className="text-[#c44a2b]">Power</span></h3>
              <div className="space-y-4 text-[1.4rem] text-[#b0bccd]">
                <p>Shenzhen Risunic Technology Co., Ltd.</p>
                <p>Building 8, Yijing Technology Park, Longhua District, Shenzhen, China</p>
                <p><a href="mailto:info@risunic.com" className="text-white hover:text-[#c44a2b] transition-colors">info@risunic.com</a></p>
                <p>Tel: +86 755 8888 8888</p>
              </div>
            </div>
            <div className="bg-[#f7f8fa] p-6 rounded-2xl space-y-3">
              <h4 className="font-semibold text-[1.4rem] text-[#0f2a44]">💡 Why Work With Us?</h4>
              <ul className="space-y-2 text-[1.3rem] text-[#6b7a8f]">
                <li>✓ 18+ years of power supply R&D</li>
                <li>✓ 600+ satisfied clients worldwide</li>
                <li>✓ CE, FCC, UL, RoHS certified</li>
                <li>✓ OEM/ODM welcome</li>
                <li>✓ Global shipping available</li>
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
