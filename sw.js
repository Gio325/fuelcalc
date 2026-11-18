const cachePrefix = 'fuelcalc-shell-';
const cacheName = cachePrefix + 'v1';
const home = new URL('./', self.location.href).href;
const index = new URL('./index.html', self.location.href).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll([home, './manifest.webmanifest', './icon.svg'])
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.mode !== 'navigate' || request.method !== 'GET') return;
  url.search = '';
  if (url.href !== home && url.href !== index) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(home, response.clone());
      }
      return response;
    } catch (error) {
      const cache = await caches.open(cacheName);
      const saved = await cache.match(home);
      if (saved) return saved;
      throw error;
    }
  })());
});
