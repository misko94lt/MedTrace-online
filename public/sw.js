/* MedTrace Service Worker — caches app shell for offline use */
const CACHE_VERSION = 'medtrace-v3-13';
const CACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './assets/main.js',
  './assets/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_URLS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;
  // MAI toccare l'API (auth e dati sempre freschi, mai dalla cache)
  if (e.request.url.indexOf('supabase.co') !== -1) return;

  // Network-first per shell e bundle (fix cache iOS PWA):
  // navigazioni, index.html e tutto ciò che sta in /assets/
  if (e.request.mode === 'navigate' ||
      e.request.url.endsWith('index.html') ||
      e.request.url.indexOf('/assets/') !== -1) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first per il resto (icone, manifest)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      });
    })
  );
});
