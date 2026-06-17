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
  de: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: 'F&E-Zentrum', rdAddr: '12. Stock, Gebäude A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: 'Fabrik', factoryAddr: 'Nr. 1 Hongchuan Road, Huicheng District, Huizhou City, Provinz Guangdong, China',
    twLabel: 'Taiwan-Büro', twAddr: '2. Stock, Nr. 5, Gasse 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · Weltweiter Versand · Zertifiziert',
    whyTitle: '\uD83D\uDCA1 Warum mit uns zusammenarbeiten?',
    whyItems: ['\u2713 Über 12 Jahre Erfahrung in der Netzteil-F&E', '\u2713 Über 600 zufriedene Kunden weltweit', '\u2713 CE-, FCC-, UL- und RoHS-zertifiziert', '\u2713 OEM/ODM willkommen', '\u2713 Weltweiter Versand verfügbar'],
  },
  es: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: 'Centro de I+D', rdAddr: '12.º Piso, Edificio A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: 'Fábrica', factoryAddr: 'No. 1 Hongchuan Road, Huicheng District, Huizhou City, Guangdong Province, China',
    twLabel: 'Oficina en Taiwán', twAddr: '2.º Piso, No. 5, Callejón 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · Envíos globales · Certificado',
    whyTitle: '\uD83D\uDCA1 ¿Por qué trabajar con nosotros?',
    whyItems: ['\u2713 Más de 12 años de I+D en fuentes de alimentación', '\u2713 Más de 600 clientes satisfechos en todo el mundo', '\u2713 Certificado CE, FCC, UL, RoHS', '\u2713 OEM/ODM bienvenidos', '\u2713 Envíos globales disponibles'],
  },
  fr: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: 'Centre de R&D', rdAddr: '12e étage, Bâtiment A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: 'Usine', factoryAddr: 'No. 1 Hongchuan Road, Huicheng District, Huizhou City, Guangdong Province, China',
    twLabel: 'Bureau de Taïwan', twAddr: '2e étage, No. 5, Lane 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · Expédition mondiale · Certifié',
    whyTitle: '\uD83D\uDCA1 Pourquoi travailler avec nous ?',
    whyItems: ['\u2713 Plus de 12 ans de R&D en alimentations électriques', '\u2713 Plus de 600 clients satisfaits dans le monde', '\u2713 Certifié CE, FCC, UL, RoHS', '\u2713 OEM/ODM bienvenus', '\u2713 Expédition mondiale disponible'],
  },
  pt: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: 'Centro de P&D', rdAddr: '12.º Andar, Edifício A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: 'Fábrica', factoryAddr: 'No. 1 Hongchuan Road, Huicheng District, Huizhou City, Guangdong Province, China',
    twLabel: 'Escritório em Taiwan', twAddr: '2.º Andar, No. 5, Beco 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · Envio Global · Certificado',
    whyTitle: '\uD83D\uDCA1 Por que trabalhar conosco?',
    whyItems: ['\u2713 Mais de 12 anos de P&D em fontes de alimentação', '\u2713 Mais de 600 clientes satisfeitos no mundo todo', '\u2713 Certificado CE, FCC, UL, RoHS', '\u2713 OEM/ODM são bem-vindos', '\u2713 Envio global disponível'],
  },
  ar: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0628\u062D\u062B \u0648\u0627\u0644\u062A\u0637\u0648\u064A\u0631', rdAddr: '\u0627\u0644\u0637\u0627\u0628\u0642 12\u060C \u0627\u0644\u0645\u0628\u0646\u0649 A\u060C Shenghui Hongxing Chuangzhi Plaza\u060C \u0637\u0631\u064A\u0642 Tongren\u060C \u0645\u062C\u062A\u0645\u0639 Tianliao\u060C \u0634\u0627\u0631\u0639 Yutang\u060C \u0645\u0646\u0637\u0642\u0629 Guangming\u060C \u0634\u0646\u062A\u0634\u0646\u060C \u0627\u0644\u0635\u064A\u0646',
    factoryLabel: '\u0627\u0644\u0645\u0635\u0646\u0639', factoryAddr: '\u0631\u0642\u0645 1 \u0637\u0631\u064A\u0642 Hongchuan\u060C \u0645\u0646\u0637\u0642\u0629 Huicheng\u060C \u0645\u062F\u064A\u0646\u0629 Huizhou\u060C \u0645\u0642\u0627\u0637\u0639\u0629 Guangdong\u060C \u0627\u0644\u0635\u064A\u0646',
    twLabel: '\u0645\u0643\u062A\u0628 \u062A\u0627\u064A\u0648\u0627\u0646', twAddr: '\u0627\u0644\u0637\u0627\u0628\u0642 2\u060C \u0631\u0642\u0645 5\u060C \u0632\u0642\u0627\u0642 345\u060C \u0634\u0627\u0631\u0639 Yangguang\u060C \u0645\u0646\u0637\u0642\u0629 Neihu\u060C \u0645\u062F\u064A\u0646\u0629 Taipei\u060C Taiwan',
    tagline: 'OEM/ODM · \u0634\u062D\u0646 \u0639\u0627\u0644\u0645\u064A · \u0645\u0639\u062A\u0645\u062F',
    whyTitle: '\uD83D\uDCA1 \u0644\u0645\u0627\u0630\u0627 \u0627\u0644\u0639\u0645\u0644 \u0645\u0639\u0646\u0627\u061F',
    whyItems: ['\u2713 \u0623\u0643\u062B\u0631 \u0645\u0646 12 \u0639\u0627\u0645\u064B\u0627 \u0641\u064A \u0627\u0644\u0628\u062D\u062B \u0648\u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0637\u0627\u0642\u0629', '\u2713 \u0623\u0643\u062B\u0631 \u0645\u0646 600 \u0639\u0645\u064A\u0644 \u0631\u0627\u0636\u064D \u062D\u0648\u0644 \u0627\u0644\u0639\u0627\u0644\u0645', '\u2713 \u062D\u0627\u0635\u0644 \u0639\u0644\u0649 \u0634\u0647\u0627\u062F\u0627\u062A CE, FCC, UL, RoHS', '\u2713 \u0645\u0631\u062D\u0628\u064B\u0627 \u0628\u0637\u0644\u0628\u0627\u062A OEM/ODM', '\u2713 \u0634\u062D\u0646 \u0639\u0627\u0644\u0645\u064A \u0645\u062A\u0627\u062D'],
  },
  ru: {
    company: 'Shenzhen Risunic Technology Co., Ltd.',
    rdLabel: '\u0426\u0435\u043D\u0442\u0440 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0439 \u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043E\u043A', rdAddr: '12 \u044D\u0442\u0430\u0436, \u0421\u0442\u0440\u043E\u0435\u043D\u0438\u0435 A, Shenghui Hongxing Chuangzhi Plaza, Tongren Road, Tianliao Community, Yutang Street, Guangming District, Shenzhen, China',
    factoryLabel: '\u0417\u0430\u0432\u043E\u0434', factoryAddr: '\u2116 1 Hongchuan Road, Huicheng District, Huizhou City, Guangdong Province, China',
    twLabel: '\u041E\u0444\u0438\u0441 \u043D\u0430 \u0422\u0430\u0439\u0432\u0430\u043D\u0435', twAddr: '2 \u044D\u0442\u0430\u0436, \u2116 5, \u043F\u0435\u0440\u0435\u0443\u043B\u043E\u043A 345, Yangguang Street, Neihu District, Taipei City, Taiwan',
    tagline: 'OEM/ODM · \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u043C\u0438\u0440\u0443 · \u0421\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043E',
    whyTitle: '\uD83D\uDCA1 \u041F\u043E\u0447\u0435\u043C\u0443 \u0441\u0442\u043E\u0438\u0442 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u0441 \u043D\u0430\u043C\u0438?',
    whyItems: ['\u2713 \u0411\u043E\u043B\u0435\u0435 12 \u043B\u0435\u0442 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0431\u043B\u043E\u043A\u043E\u0432 \u043F\u0438\u0442\u0430\u043D\u0438\u044F', '\u2713 \u0411\u043E\u043B\u0435\u0435 600 \u0434\u043E\u0432\u043E\u043B\u044C\u043D\u044B\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u043C\u0438\u0440\u0443', '\u2713 \u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B CE, FCC, UL, RoHS', '\u2713 OEM/ODM \u043F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442\u0441\u044F', '\u2713 \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u043C\u0438\u0440\u0443'],
  },
}
const siLabels: Record<string, { rdLabel?: string; factoryLabel?: string; twLabel?: string }> = {es:{rdLabel:'Centro de I+D',factoryLabel:'Fábrica',twLabel:'Oficina de Taiwán'},de:{rdLabel:'F&E-Zentrum',factoryLabel:'Fabrik',twLabel:'Taiwan-Büro'},fr:{rdLabel:'Centre R&D',factoryLabel:'Usine',twLabel:'Bureau de Taïwan'},pt:{rdLabel:'Centro de P&D',factoryLabel:'Fábrica',twLabel:'Escritório de Taiwan'},ar:{rdLabel:'مركز البحث والتطوير',factoryLabel:'المصنع',twLabel:'مكتب تايوان'},ru:{rdLabel:'Центр НИОКР',factoryLabel:'Завод',twLabel:'Офис на Тайване'}}
const si = (locale: string) => {
  const base = sidebarInfo[locale] || sidebarInfo.en
  const extra = siLabels[locale]
  return extra ? { ...base, ...extra } : base
}

const siWhyItems: Record<string, string[]> = {
  es: ['\u2713 Más de 12 años de I+D en fuentes de alimentación', '\u2713 Más de 600 clientes satisfechos en todo el mundo', '\u2713 Certificado CE, FCC, UL, RoHS', '\u2713 OEM/ODM bienvenido', '\u2713 Envío global disponible'],
  de: ['\u2713 Über 12 Jahre F&E in der Stromversorgung', '\u2713 Über 600 zufriedene Kunden weltweit', '\u2713 CE, FCC, UL, RoHS zertifiziert', '\u2713 OEM/ODM willkommen', '\u2713 Weltweiter Versand verfügbar'],
  fr: ['\u2713 Plus de 12 ans de R&D en alimentation électrique', '\u2713 Plus de 600 clients satisfaits dans le monde', '\u2713 Certifié CE, FCC, UL, RoHS', '\u2713 OEM/ODM bienvenu', '\u2713 Expédition internationale disponible'],
  pt: ['\u2713 Mais de 12 anos de P&D em fontes de alimentação', '\u2713 Mais de 600 clientes satisfeitos no mundo', '\u2713 Certificado CE, FCC, UL, RoHS', '\u2713 OEM/ODM bem-vindo', '\u2713 Envio global disponível'],
  ar: ['\u2713 أكثر من 12 عامًا من البحث والتطوير في إمدادات الطاقة', '\u2713 أكثر من 600 عميل راضٍ حول العالم', '\u2713 معتمد CE وFCC وUL وRoHS', '\u2713 نرحب بـ OEM/ODM', '\u2713 الشحن العالمي متاح'],
  ru: ['\u2713 Более 12 лет НИОКР в области источников питания', '\u2713 Более 600 довольных клиентов по всему миру', '\u2713 Сертифицировано CE, FCC, UL, RoHS', '\u2713 Приветствуется OEM/ODM', '\u2713 Доступна международная доставка'],
}

const siTagline: Record<string, string> = {
  es: 'OEM/ODM · Envío Global · Certificado',
  de: 'OEM/ODM · Weltweiter Versand · Zertifiziert',
  fr: 'OEM/ODM · Expédition Internationale · Certifié',
  pt: 'OEM/ODM · Envio Global · Certificado',
  ar: 'OEM/ODM · شحن عالمي · معتمد',
  ru: 'OEM/ODM · Международная доставка · Сертифицировано',
}

const siWhyTitle: Record<string, string> = {
  es: '\uD83D\uDCA1 ¿Por Qué Trabajar Con Nosotros?',
  de: '\uD83D\uDCA1 Warum Mit Uns Arbeiten?',
  fr: '\uD83D\uDCA1 Pourquoi Travailler Avec Nous ?',
  pt: '\uD83D\uDCA1 Por Que Trabalhar Conosco?',
  ar: '\uD83D\uDCA1 لماذا العمل معنا؟',
  ru: '\uD83D\uDCA1 Почему Стоит Работать С Нами?',
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
          <hr className="border-t border-[#E2E8EF] my-6" />
          <p className="text-[1.6rem] text-[#6b7a8f] max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <motion.form onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#e2e8ef] p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Building size={16} />} label={t('form.company')} error={errors.company?.message}>
                <input {...register('company')} className="input-field" placeholder={t('form.company')} />
              </Field>
              <Field icon={<User size={16} />} label={t('form.name')} error={errors.name?.message}>
                <input {...register('name')} className="input-field" placeholder={t('form.name')} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Mail size={16} />} label={t('form.email')} error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder={t('form.email')} />
              </Field>
              <Field icon={<Phone size={16} />} label={t('form.phone')} error={errors.phone?.message}>
                <input {...register('phone')} className="input-field" placeholder="+86 755 8888 8888" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field icon={<Package size={16} />} label={t('form.product')}>
                <input {...register('productName')} className="input-field" placeholder={t('form.product')} />
              </Field>
              <Field icon={<Hash size={16} />} label={t('form.quantity')}>
                <select {...register('quantity')} className="input-field">
                  <option value="">{t('form.quantity')}</option>
                  <option value="1-10">1-10 pcs</option>
                  <option value="10-100">10-100 pcs</option>
                  <option value="100-1000">100-1,000 pcs</option>
                  <option value="1000-10000">1,000-10,000 pcs</option>
                  <option value="10000+">10,000+ pcs</option>
                </select>
              </Field>
            </div>
            <Field icon={<MessageSquare size={16} />} label={t('form.message')} error={errors.message?.message}>
              <textarea {...register('message')} rows={5} className="input-field resize-y" placeholder={t('form.message')} />
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
                
                <p className="text-[1.1rem] text-[#F7D142] pt-1">{siTagline[locale] || si(locale).tagline}</p>
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <SocialLinks />
              </div>
            </div>
            <div className="bg-[#f7f8fa] p-6 rounded-2xl space-y-3">
              <h4 className="font-semibold text-[1.4rem] text-[#0f2a44]">{siWhyTitle[locale] || si(locale).whyTitle}</h4>
              <ul className="space-y-2 text-[1.3rem] text-[#6b7a8f]">
                {(siWhyItems[locale] || si(locale).whyItems).map((item, i) => <li key={i}>{item}</li>)}
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
