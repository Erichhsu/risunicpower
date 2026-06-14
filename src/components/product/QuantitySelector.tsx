'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ min = 1, max = 9999 }: { min?: number; max?: number }) {
  const [qty, setQty] = useState(min)

  return (
    <div className="flex items-center border border-[#e2e8ef] rounded-xl overflow-hidden">
      <button
        onClick={() => setQty(Math.max(min, qty - 1))}
        disabled={qty <= min}
        className="p-3 hover:bg-[#ECF1F7] disabled:opacity-30 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={qty}
        onChange={(e) => {
          const v = parseInt(e.target.value)
          if (!isNaN(v)) setQty(Math.min(max, Math.max(min, v)))
        }}
        className="w-16 text-center text-[1.6rem] font-semibold border-x border-[#e2e8ef] py-2 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => setQty(Math.min(max, qty + 1))}
        disabled={qty >= max}
        className="p-3 hover:bg-[#ECF1F7] disabled:opacity-30 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
