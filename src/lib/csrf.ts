'use client'
/**
 * CSRF Token 客户端工具
 * 从 cookie 中读取 CSRF token 并在 fetch 请求中自动附加
 */

const CSRF_COOKIE = '__Host-risunic-csrf'
const CSRF_HEADER = 'x-csrf-token'

function getCookie(name: string): string | null {
  for (const cookie of document.cookie.split('; ')) {
    const [key, ...rest] = cookie.split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

/**
 * 获取当前 CSRF token
 */
export function getCSRFToken(): string {
  return getCookie(CSRF_COOKIE) || ''
}

/**
 * 创建带 CSRF 保护的 fetch 请求
 */
export async function csrfFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getCSRFToken()
  const headers = new Headers(init?.headers)
  if (token) {
    headers.set(CSRF_HEADER, token)
  }
  headers.set('Content-Type', 'application/json')
  return fetch(input, { ...init, headers, credentials: 'same-origin' })
}
