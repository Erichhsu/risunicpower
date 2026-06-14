'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, ChevronDown } from 'lucide-react'
import StarRating from './StarRating'
import ReviewCard from './ReviewCard'

interface Review {
  id: string
  rating: number
  content: string
  reviewer: string
  company: string | null
  country: string | null
  createdAt: string
}

function calcStats(reviews: Review[]) {
  const dist = [0, 0, 0, 0, 0] // 1★ to 5★
  let total = 0
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      dist[r.rating - 1]++
      total += r.rating
    }
  })
  const avg = reviews.length ? total / reviews.length : 0
  return { avg, dist, total: reviews.length }
}

const countryOptions = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }, { code: 'SG', name: 'Singapore' },
  { code: 'TW', name: 'Taiwan' }, { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' }, { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' }, { code: 'BR', name: 'Brazil' },
  { code: 'AE', name: 'UAE' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'CA', name: 'Canada' },
]

export default function ProductReviews({ productId, locale }: { productId: string; locale: string }) {
  const t = useTranslations('Reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [company, setCompany] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        const res = await fetch(`/api/reviews?productId=${productId}&locale=${locale}`, {
          signal: controller.signal,
          cache: 'no-store',
        })
        clearTimeout(timeout)
        if (!res.ok) {
          console.error('Reviews fetch error: HTTP', res.status)
          if (!cancelled) { setReviews([]); return }
        }
        const data = await res.json()
        if (!cancelled) {
          // API returns 'author' but component expects 'reviewer'
          const mapped = (data.reviews || []).map((r: any) => ({
            id: r.id,
            rating: r.rating,
            content: r.content || '',
            reviewer: r.reviewer || r.author || 'Verified Buyer',
            company: r.company || null,
            country: r.country || null,
            createdAt: r.createdAt,
          }))
          setReviews(mapped)
        }
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') {
          console.error('Reviews fetch aborted (timeout)')
        } else {
          console.error('Reviews fetch error:', e)
        }
        if (!cancelled) setReviews([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchReviews()
    return () => { cancelled = true }
  }, [productId, locale])

  const stats = calcStats(reviews)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || content.length < 20 || !reviewer.trim()) return
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, locale, rating, content: content.trim(), company: company.trim() || undefined, reviewer: reviewer.trim(), country: country || undefined }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: t('success') })
        setRating(0); setContent(''); setCompany(''); setReviewer(''); setCountry('')
        setShowForm(false)
      } else {
        setMessage({ type: 'error', text: data.error || t('error') })
      }
    } catch (e) {
      console.error('Review submit error:', e)
      setMessage({ type: 'error', text: t('error') })
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-[2.4rem] font-bold text-[#0E4071]">{t('title')}</h2>
        <div className="flex items-center gap-3 text-[1.4rem] text-[#4A5D70]">
          <Loader2 size={18} className="animate-spin" /> {t('loading')}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-[2.4rem] font-bold text-[#0E4071] mb-6">{t('title')}</h2>

      {/* Stats + CTA */}
      {reviews.length > 0 ? (
        <div className="grid sm:grid-cols-[240px_1fr] gap-8 mb-8">
          <div className="bg-[#ECF1F7] rounded-xl p-6 text-center">
            <div className="text-[4rem] font-bold text-[#0E4071] leading-none">{stats.avg.toFixed(1)}</div>
            <StarRating rating={stats.avg} />
            <p className="text-[1.3rem] text-[#4A5D70] mt-2">{t('count', { n: stats.total })}</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.dist[star - 1]
              const pct = stats.total ? (count / stats.total) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3 text-[1.2rem]">
                  <span className="w-10 text-right text-[#4A5D70]">{star}★</span>
                  <div className="flex-1 h-2 bg-[#e2e8ef] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-[#4A5D70]">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#ECF1F7] rounded-xl p-8 text-center mb-8">
          <p className="text-[1.6rem] text-[#4A5D70] mb-3">{t('noReviews')}</p>
          <p className="text-[1.3rem] text-[#4A5D70]">{t('beFirst')}</p>
        </div>
      )}

      {/* Review List */}
      {reviews.length > 0 && (
        <div className="space-y-4 mb-8">
          {reviews.map(r => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      )}

      {/* Write Review Button / Form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 rounded-full bg-[#F7D142] text-[#0E4071] font-semibold text-[1.4rem] hover:bg-[#D4B838] transition-all shadow-sm"
        >
          {t('writeReview')}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e2e8ef] p-6 space-y-5">
          {message && (
            <div className={`p-3 rounded-lg text-[1.3rem] ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="block text-[1.3rem] font-medium text-[#0E4071] mb-2">{t('rating')}</label>
            <StarRating rating={rating} interactive onChange={setRating} />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[1.3rem] font-medium text-[#0E4071] mb-2">{t('yourReview')}</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              minLength={20}
              placeholder={t('reviewPlaceholder')}
              className="w-full rounded-xl border border-[#e2e8ef] px-4 py-3 text-[1.4rem] resize-y focus:outline-none focus:border-[#F7D142]"
            />
            <p className="text-[1.1rem] text-[#4A5D70] mt-1">{content.length}/20+</p>
          </div>

          {/* Company + Name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[1.3rem] font-medium text-[#0E4071] mb-2">{t('company')}</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className="w-full rounded-xl border border-[#e2e8ef] px-4 py-3 text-[1.4rem] focus:outline-none focus:border-[#F7D142]" />
            </div>
            <div>
              <label className="block text-[1.3rem] font-medium text-[#0E4071] mb-2">{t('yourName')} *</label>
              <input value={reviewer} onChange={e => setReviewer(e.target.value)} required className="w-full rounded-xl border border-[#e2e8ef] px-4 py-3 text-[1.4rem] focus:outline-none focus:border-[#F7D142]" />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[1.3rem] font-medium text-[#0E4071] mb-2">{t('country')}</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="w-full sm:w-64 rounded-xl border border-[#e2e8ef] px-4 py-3 text-[1.4rem] focus:outline-none focus:border-[#F7D142] bg-white">
              <option value="">--</option>
              {countryOptions.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={submitting || rating < 1 || content.length < 20 || !reviewer.trim()}
            className="px-8 py-3 rounded-full bg-[#F7D142] text-[#0E4071] font-semibold text-[1.4rem] hover:bg-[#D4B838] transition-all disabled:opacity-50 shadow-sm"
          >
            {submitting ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {t('submitting')}</span> : t('submit')}
          </button>
        </form>
      )}
    </div>
  )
}
