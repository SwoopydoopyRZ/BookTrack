const CACHE = 'booktrack-static-v6';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache =>
    cache.addAll(['./manifest.webmanifest'])
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('booktrack-') && key !== CACHE)
        .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Leave app navigations and user data in browser storage; never cache
// an HTML page containing or depending on a user's private collection.
