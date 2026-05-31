'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

interface AddToCartButtonProps {
  product: {
    slug: string
    name: string
    image: string
  }
  label?: string
}

export default function AddToCartButton({ product, label = 'Add to Cart' }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <button
      onClick={() => addItem({
        slug: product.slug,
        name: product.name,
        price: 0,
        image: product.image,
      })}
      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/20"
      aria-label={label}
    >
      <ShoppingCart size={18} />
      <span>{label}</span>
    </button>
  )
}
