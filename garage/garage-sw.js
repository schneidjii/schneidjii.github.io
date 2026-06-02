var CACHE = 'sf-garage-v1';
var BASE = '/garage/';
var ASSETS = [
  BASE + 'index.html',
  BASE + 'garage-manifest.json',
  BASE + 'garage-icon-192.png',
  BASE + 'garage-icon-512.png',
  BASE + 'garage-icon-192-light.png',
  BASE + 'garage-icon-512-light.png',
  BASE + 'apple-touch-icon.png',
  BASE + 'splash-dark-1290x2796.png',
  BASE + 'splash-dark-1179x2556.png',
  BASE + 'splash-dark-828x1792.png',
  BASE + 'splash-light-1290x2796.png',
  BASE + 'splash-light-1179x2556.png',
  BASE + 'splash-light-828x1792.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    }).catch(function(err) {
      console.log('Cache add failed:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf(BASE) === -1) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return cached; });
    })
  );
});
