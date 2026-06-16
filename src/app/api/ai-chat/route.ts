import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

type Msg = { role: 'user' | 'bot'; text: string }

const systemPrompts: Record<string, string> = {
  en: 'You are a professional B2B sales assistant for RisunicPower (Shenzhen Risunic Technology Co., Ltd). Answer questions about our products: POE power supplies, power adapters, open-frame power supplies, UPS systems, inverters, portable power stations, micro-inverters, industrial power supplies, and all-in-one solar systems. Be concise, helpful, and direct customers to the inquiry form for quotes.',
  zh: '你是 RisunicPower（深圳市晨旭通科技股份有限公司）的专业B2B销售助手。回答关于我们产品的问题：POE电源、电源适配器、裸板电源、UPS不间断电源、逆变器、便携储能电源、微型逆变器、工业电源和一体机太阳能系统。简洁专业，引导客户通过询价表单获取报价。',
  ja: 'あなたはRisunicPower（深セン市晨旭通科技股份有限公司）のB2B営業アシスタントです。当社の製品（POE電源、電源アダプター、オープンフレーム電源、UPS、インバーター、ポータブル電源、マイクロインバーター、産業用電源、オールインワン太陽光システム）についての質問に答えます。簡潔で役立つ回答を心がけ、見積もりが必要な場合はお問い合わせフォームをご案内してください。',
  es: 'Eres un asistente de ventas B2B profesional de RisunicPower (Shenzhen Risunic Technology Co., Ltd). Responde preguntas sobre nuestros productos: fuentes de alimentación POE, adaptadores de corriente, fuentes de marco abierto, sistemas UPS, inversores, estaciones de energía portátiles, microinversores, fuentes industriales y sistemas solares todo en uno. Sé conciso, útil y dirige a los clientes al formulario de consulta para cotizaciones.',
  de: 'Sie sind ein professioneller B2B-Vertriebsassistent für RisunicPower (Shenzhen Risunic Technology Co., Ltd). Beantworten Sie Fragen zu unseren Produkten: POE-Netzteile, Netzteile, Open-Frame-Netzteile, UPS-Systeme, Wechselrichter, tragbare Stromversorgungen, Mikro-Wechselrichter, Industrienetzteile und All-in-One-Solarsysteme. Seien Sie präzise und hilfreich und leiten Sie Kunden für Angebote an das Anfrageformular weiter.',
  fr: 'Vous êtes un assistant commercial B2B professionnel pour RisunicPower (Shenzhen Risunic Technology Co., Ltd). Répondez aux questions sur nos produits : alimentations POE, adaptateurs secteur, alimentations à cadre ouvert, systèmes UPS, onduleurs, stations d\'énergie portables, micro-onduleurs, alimentations industrielles et systèmes solaires tout-en-un. Soyez concis, utile et dirigez les clients vers le formulaire de demande de devis.',
  pt: 'Você é um assistente de vendas B2B profissional da RisunicPower (Shenzhen Risunic Technology Co., Ltd). Responda perguntas sobre nossos produtos: fontes de alimentação POE, adaptadores de energia, fontes de quadro aberto, sistemas UPS, inversores, estações de energia portáteis, microinversores, fontes industriais e sistemas solares tudo-em-um. Seja conciso, útil e direcione os clientes para o formulário de consulta de orçamentos.',
  ar: 'أنت مساعد مبيعات B2B محترف لشركة RisunicPower (Shenzhen Risunic Technology Co., Ltd). أجب عن الأسئلة المتعلقة بمنتجاتنا: مصادر طاقة POE، محولات الطاقة، مصادر الطاقة المفتوحة، أنظمة UPS، العاكسات، محطات الطاقة المحمولة، العاكسات الدقيقة، مصادر الطاقة الصناعية، وأنظمة الطاقة الشمسية المتكاملة. كن موجزًا ومفيدًا ووجه العملاء إلى نموذج الاستفسار للحصول على عروض الأسعار.',
  ru: 'Вы профессиональный B2B-ассистент по продажам компании RisunicPower (Shenzhen Risunic Technology Co., Ltd). Отвечайте на вопросы о нашей продукции: POE-источники питания, адаптеры питания, источники питания открытого типа, ИБП, инверторы, портативные электростанции, микроинверторы, промышленные источники питания и солнечные системы «все в одном». Будьте краткими и полезными, направляйте клиентов в форму запроса для получения коммерческих предложений.',
}

const supportedLocales = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

const noKeyReplies: Record<string, string> = {
  en: 'AI chat is not configured yet. Please email erich.hsu@risunicpower.com for product inquiries.',
  zh: 'AI 客服尚未配置，请发送邮件至 erich.hsu@risunicpower.com 咨询产品信息。',
  ja: 'AIチャットはまだ設定されていません。製品のお問い合わせは erich.hsu@risunicpower.com までメールをお送りください。',
  es: 'El chat AI aún no está configurado. Envíe un correo a erich.hsu@risunicpower.com para consultas sobre productos.',
  de: 'Der KI-Chat ist noch nicht konfiguriert. Bitte senden Sie eine E-Mail an erich.hsu@risunicpower.com für Produktanfragen.',
  fr: "Le chat IA n'est pas encore configuré. Veuillez envoyer un e-mail à erich.hsu@risunicpower.com pour toute demande de produit.",
  pt: 'O chat de IA ainda não está configurado. Envie um e-mail para erich.hsu@risunicpower.com para consultas sobre produtos.',
  ar: 'لم يتم تكوين الدردشة الذكية بعد. يرجى إرسال بريد إلكتروني إلى erich.hsu@risunicpower.com للاستفسارات عن المنتجات.',
  ru: 'ИИ-чат еще не настроен. Пожалуйста, отправьте запрос на erich.hsu@risunicpower.com для получения информации о продукции.',
}

const unavailableReplies: Record<string, string> = {
  en: 'AI service temporarily unavailable.',
  zh: 'AI 服务暂时不可用。',
  ja: 'AIサービスが一時的に利用できません。',
  es: 'Servicio de IA temporalmente no disponible.',
  de: 'KI-Dienst vorübergehend nicht verfügbar.',
  fr: 'Service IA temporairement indisponible.',
  pt: 'Serviço de IA temporariamente indisponível.',
  ar: 'خدمة الذكاء الاصطناعي غير متاحة مؤقتًا.',
  ru: 'ИИ-сервис временно недоступен.',
}

export async function POST(req: NextRequest) {
  const { message, history, locale } = await req.json()
  const l = supportedLocales.includes(locale) ? locale : 'en'

  const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY

  if (!DEEPSEEK_KEY) {
    return NextResponse.json({ reply: noKeyReplies[l] })
  }

  try {
    const system = systemPrompts[l]

    const msgs = [
      { role: 'system' as const, content: system },
      ...(history || []).slice(-10).map((m: Msg) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      })),
      { role: 'user' as const, content: message },
    ]

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: msgs,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      logger.error('DeepSeek API error:', res.status, err)
      return NextResponse.json({ reply: unavailableReplies[l] })
    }

    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'No response.' })
  } catch (err) {
    logger.error('AI chat error:', err)
    return NextResponse.json({ reply: unavailableReplies[l] })
  }
}
