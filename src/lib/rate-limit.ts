/**
 * 滑动窗口 IP 速率限制器
 * 单实例部署的内存实现，无需外部依赖
 */

interface RateLimitStore {
  timestamps: number[]
}

const store = new Map<string, RateLimitStore>()

// 每 60 秒清理过期记录，防止内存泄漏
const CLEANUP_INTERVAL = 60_000
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const cutoff = Date.now() - CLEANUP_INTERVAL * 2
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter(t => t > cutoff)
      if (entry.timestamps.length === 0) store.delete(key)
    }
  }, CLEANUP_INTERVAL)
  // Node.js 不阻止进程退出
  try {
    // Edge runtime: setInterval returns a number, not a Timeout object
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
      (cleanupTimer as NodeJS.Timeout).unref()
    }
  } catch (_err) { /* ignore in edge runtime */ }
}

/**
 * 检查指定 key 是否超过速率限制
 * @param key   标识（通常为 IP 地址）
 * @param limit 窗口内最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns true = 放行，false = 限流
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  ensureCleanup()
  const now = Date.now()
  let entry = store.get(key)

  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // 移除窗口外的时间戳
  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs)

  if (entry.timestamps.length >= limit) return false

  entry.timestamps.push(now)
  return true
}

/**
 * 获取当前 key 在窗口内的请求数（用于监控）
 */
export function getRequestCount(key: string, windowMs: number): number {
  const entry = store.get(key)
  if (!entry) return 0
  const now = Date.now()
  return entry.timestamps.filter(t => now - t < windowMs).length
}

/** 预定义的限流配置 */
export const RATE_LIMITS = {
  /** AI Chat API */
  aiChat: { limit: 10, windowMs: 60_000 },
  /** 通用 API */
  api: { limit: 60, windowMs: 60_000 },
  /** 表单提交（询价） */
  form: { limit: 5, windowMs: 60_000 },
  /** 评论读取（GET 频繁调用） */
  reviewsRead: { limit: 30, windowMs: 60_000 },
  /** 搜索 */
  search: { limit: 30, windowMs: 60_000 },
  /** 一般页面 */
  page: { limit: 120, windowMs: 60_000 },
} as const
