const CACHE = 'booktrack-static-v5';

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

// Do not intercept or cache navigation requests. In particular, never cache
// the authenticated home page or a redirect to login in the public service-worker cache.
