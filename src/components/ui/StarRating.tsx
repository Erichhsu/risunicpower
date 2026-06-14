'use client'

import { Star } from 'lucide-react'

export default function StarRating({ rating, count, showCount }: { rating: number; count?: number; showCount?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={16}
            className={i <= Math.round(rating) ? 'fill-[#F7D142] text-[#F7D142]' : 'text-[#d0d8e0]'}
          />
        ))}
      </div>
      <span className="text-[1.3rem] font-medium text-[#0f2a44]">{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-[1.2rem] text-[#6b7a8f]">({count} reviews)</span>
      )}
    </div>
  )
}
