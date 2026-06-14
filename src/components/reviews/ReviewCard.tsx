'use client'

import StarRating from './StarRating'

interface ReviewCardProps {
  rating: number
  content: string
  reviewer: string
  company?: string | null
  country?: string | null
  createdAt: string
}

function countryToFlag(code: string): string {
  if (!code || code.length !== 2) return ''
  const base = 0x1F1E6
  return String.fromCodePoint(base + code.charCodeAt(0) - 65, base + code.charCodeAt(1) - 65)
}

export default function ReviewCard({ rating, content, reviewer, company, country, createdAt }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8ef] p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={rating} />
        <span className="text-[1.1rem] text-[#4A5D70] ml-1">{rating}/5</span>
      </div>
      <p className="text-[1.4rem] text-[#4A5D70] leading-relaxed mb-3">{content}</p>
      <div className="flex items-center gap-2 text-[1.2rem] text-[#4A5D70]">
        <span className="font-semibold text-[#0E4071]">{reviewer}</span>
        {company && <span>· {company}</span>}
        {country && <span>{countryToFlag(country)}</span>}
        <span className="ml-auto text-[1.1rem]">
          {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}
