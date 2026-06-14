// src/lib/media.ts
// Centralized image management — fallback only; production uses DB ProductImage

export const PLACEHOLDER_PRODUCT = '/images/placeholder-product.webp'
export const PLACEHOLDER_CATEGORY = '/images/placeholder-category.webp'
export const LOGO = '/images/logo/svg/logo-07.svg'

// Category fallback images
const CATEGORY_IMAGES: Record<string, string> = {
  poe: '/images/products/r0046/r0046_main.png',
  ups: '/images/products/r0212/r0212_main.png',
  inverter: '/images/products/r0285/r0285_main.png',
  'split-phase-inverter': '/images/products/r0378/r0378_main.png',
  'backup-power': '/images/products/r0256/r0256_main.png',
  'power-station': '/images/products/rps-1200/rps-1200_main.png',
  'all-in-one': '/images/products/rl550/rl550_main.png',
  'micro-inverter': '/images/products/r0410/r0410_main.png',
  'solar-controller': '/images/products/bdh-318/bdh-318_main.png',
}

export function categoryIcon(slug: string): string {
  return CATEGORY_IMAGES[slug] || LOGO
}

// Product image fallback lookup
export function productImage(slug: string): string {
  return `/images/products/${slug}/${slug}_main.png`
}
