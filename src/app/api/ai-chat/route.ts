import { NextRequest, NextResponse } from 'next/server'

type Msg = { role: 'user' | 'bot'; text: string }

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(req: NextRequest) {
  if (!DEEPSEEK_KEY) {
    return NextResponse.json({
      reply: 'AI chat is not configured yet. Please email info@risunicpower.com for product inquiries.'
    })
  }

  try {
    const { message, history } = await req.json()

    const system = `You are a professional B2B sales assistant for RisunicPower (Shenzhen Risunic Technology Co., Ltd).
Answer questions about our products: POE power supplies, power adapters, open-frame power supplies, UPS systems,
inverters, portable power stations, micro-inverters, industrial power supplies, and all-in-one solar systems.
Be concise, helpful, and direct customers to the inquiry form for quotes.`

    const msgs = [
      { role: 'system', content: system },
      ...(history || []).slice(-10).map((m: Msg) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
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
      return NextResponse.json({ reply: 'AI service temporarily unavailable.' })
    }

    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'No response.' })
  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ reply: 'An error occurred. Please try again.' })
  }
}
