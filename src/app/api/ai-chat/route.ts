import { NextRequest, NextResponse } from 'next/server'

type Msg = { role: 'user' | 'bot'; text: string }

const systemPrompts: Record<string, string> = {
  en: 'You are a professional B2B sales assistant for RisunicPower (Shenzhen Risunic Technology Co., Ltd). Answer questions about our products: POE power supplies, power adapters, open-frame power supplies, UPS systems, inverters, portable power stations, micro-inverters, industrial power supplies, and all-in-one solar systems. Be concise, helpful, and direct customers to the inquiry form for quotes.',
  zh: '你是 RisunicPower（深圳市晨旭通科技股份有限公司）的专业B2B销售助手。回答关于我们产品的问题：POE电源、电源适配器、裸板电源、UPS不间断电源、逆变器、便携储能电源、微型逆变器、工业电源和一体机太阳能系统。简洁专业，引导客户通过询价表单获取报价。',
  ja: 'あなたはRisunicPower（深セン市晨旭通科技股份有限公司）のB2B営業アシスタントです。当社の製品（POE電源、電源アダプター、オープンフレーム電源、UPS、インバーター、ポータブル電源、マイクロインバーター、産業用電源、オールインワン太陽光システム）についての質問に答えます。簡潔で役立つ回答を心がけ、見積もりが必要な場合はお問い合わせフォームをご案内してください。',
}

const noKeyReplies: Record<string, string> = {
  en: 'AI chat is not configured yet. Please email erich.hsu@risunicpower.com for product inquiries.',
  zh: 'AI 客服尚未配置，请发送邮件至 erich.hsu@risunicpower.com 咨询产品信息。',
  ja: 'AIチャットはまだ設定されていません。製品のお問い合わせは erich.hsu@risunicpower.com までメールをお送りください。',
}

const unavailableReplies: Record<string, string> = {
  en: 'AI service temporarily unavailable.',
  zh: 'AI 服务暂时不可用。',
  ja: 'AIサービスが一時的に利用できません。',
}

export async function POST(req: NextRequest) {
  const { message, history, locale } = await req.json()
  const l = ['en', 'zh', 'ja'].includes(locale) ? locale : 'en'

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
      console.error('DeepSeek API error:', res.status, err)
      return NextResponse.json({ reply: unavailableReplies[l] })
    }

    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'No response.' })
  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ reply: unavailableReplies[l] })
  }
}
