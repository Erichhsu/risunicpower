const CACHE_NAME = 'risunic-v1'

const LOCALES = ['en', 'zh', 'ja', 'es', 'de', 'fr', 'pt', 'ar', 'ru']

const PRECACHE_URLS = LOCALES.flatMap(locale => [
  `/${locale}/`,
  `/${locale}/products`,
  `/${locale}/contact`,
  `/${locale}/blog`,
  `/${locale}/case-studies`,
  `/${locale}/offline`,
])

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      }).catch(() => {
        // Try to match offline page for the user's locale from the request path
        const localeMatch = event.request.url.match(/\/(en|zh|ja|es|de|fr|pt|ar|ru)\//)
        const locale = localeMatch ? localeMatch[1] : 'en'
        return caches.match(`/${locale}/offline`)
      })
    )
  )
})
