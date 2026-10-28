/* WonderWorld's service worker (public build): keeps a copy of the game so it opens without the internet.
   The page is fetched fresh when online (so a new version arrives) and from the copy when offline. __VERSION__ changes with every build. */
const CACHE = 'wonderworld-__VERSION__';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('wonderworld-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   /* videos and anything else from elsewhere go straight to the network */
  if (r.mode === 'navigate' || r.url.endsWith('/') || r.url.endsWith('index.html'))
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
  else e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
