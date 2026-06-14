'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  alt?: string | null
  isPrimary?: boolean
}

export default function ProductImageGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [selected, setSelected] = useState(0)
  const pics = images.length > 0 ? images : [{ url: '/images/placeholder-product.webp', alt: 'No image' }]
  const current = pics[selected] || pics[0]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-br from-[#ECF1F7] to-[#e2e8ef] rounded-2xl flex items-center justify-center border border-[#e2e8ef] overflow-hidden relative">
        <Image
          src={current.url}
          alt={current.alt || name}
          fill
          className="object-contain p-4 transition-all duration-300 hover:scale-110 cursor-crosshair"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {/* Thumbnails */}
      {pics.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pics.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                idx === selected ? 'border-[#F7D142] ring-2 ring-[#F7D142]/20' : 'border-[#e2e8ef] hover:border-[#F7D142]/50'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${name} ${idx + 1}`}
                width={80}
                height={80}
                className="object-contain w-full h-full p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
