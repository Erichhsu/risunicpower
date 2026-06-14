'use client'

import dynamic from 'next/dynamic'

export const GoogleAnalytics = dynamic(() => import('@/components/analytics/GoogleAnalytics'), { ssr: false })
export const FloatingSocial = dynamic(() => import('@/components/layout/FloatingSocial'), { ssr: false })
export const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false })
export const AIChat = dynamic(() => import('@/components/ai/AIChat'), { ssr: false })
