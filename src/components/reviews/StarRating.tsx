'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({ rating, max = 5, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = interactive ? starValue <= rating : starValue <= Math.round(rating)
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            aria-label={interactive ? `${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
          >
            <Star
              size={interactive ? 28 : 16}
              className={filled ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#d1d5db]'}
            />
          </button>
        )
      })}
    </div>
  )
}
