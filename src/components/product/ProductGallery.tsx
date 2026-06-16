'use client'

import { useState } from 'react'

interface ProductImage {
  id: number | string
  url: string
  alt?: string | null
  sortOrder: number
  isPrimary: boolean
}

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
  const [active, setActive] = useState(sorted[0]?.url || '')

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-2xl flex items-center justify-center border border-[#e2e8ef]">
        <span className="text-[8rem] opacity-20">📷</span>
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square bg-gradient-to-br from-[#f7f8fa] to-[#e2e8ef] rounded-2xl flex items-center justify-center border border-[#e2e8ef] overflow-hidden mb-4">
        <img
          src={active}
          alt={name}
          className="w-full h-full object-contain p-8 transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(img.url)}
              className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-[#f7f8fa] transition-all cursor-pointer ${
                img.url === active
                  ? 'border-[#F7D142] ring-2 ring-[#F7D142]/20'
                  : 'border-[#e2e8ef] hover:border-[#F7D142]/50'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${name} ${idx + 1}`}
                className="w-full h-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
