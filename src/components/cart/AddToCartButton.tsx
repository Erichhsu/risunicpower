'use client'

import { ShoppingCart } from 'lucide-react'

export default function AddToCartButton({ product }: { product: { slug: string; name: string; image: string } }) {
  return (
    <button
      onClick={() => {
        // TODO: Connect to Zustand cart store
        alert(`Added "${product.name}" to cart`)
      }}
      className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#c44a2b] text-white font-semibold text-[1.4rem] hover:bg-[#9a3a1e] transition-all shadow-lg shadow-[#c44a2b]/20"
    >
      <ShoppingCart size={18} />
      Add to Cart
    </button>
  )
}
