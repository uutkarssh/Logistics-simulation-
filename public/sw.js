// WareTrack 3D service worker — caches the app shell for offline / fast reload.
// Safe in Vite dev (skips /src/, /@vite, node_modules and HMR sockets) and useful in prod
// (stale-while-revalidate for hashed /assets/* + images, network-first for navigations).
const CACHE = 'waretrack-shell-v1'
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './favicon.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return
  // never intercept Vite dev modules / HMR / sockets
  if (url.protocol === 'ws:' || url.pathname.includes('/@') || url.pathname.includes('/node_modules/') || url.pathname.startsWith('/src/') || url.pathname.includes('sock')) return

  // navigations: network-first, fall back to the cached shell when offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./').then((r) => r || caches.match('./index.html'))),
    )
    return
  }

  // static assets (hashed JS/CSS in prod, images, fonts, manifest): stale-while-revalidate
  if (/\.(?:js|mjs|css|png|jpe?g|svg|webp|ico|woff2?|json|wasm)$/.test(url.pathname)) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const cached = await c.match(req)
        const network = fetch(req).then((res) => {
          if (res && res.status === 200 && res.type !== 'opaque') c.put(req, res.clone())
          return res
        }).catch(() => cached)
        return cached || network
      }),
    )
  }
})
