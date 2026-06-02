var CACHE = 'garage-manager-v2';
var ASSETS = [
  '/garage.html',
  '/garage-manifest.json',
  '/garage-icon-192.png',
  '/garage-icon-512.png',
  '/garage-icon-192-light.png',
  '/garage-icon-512-light.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
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
  // Only handle requests for garage-related files
  var url = e.request.url;
  if (url.indexOf('garage') === -1 && url.indexOf('apple-touch') === -1) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return cached; });
    })
  );
});
