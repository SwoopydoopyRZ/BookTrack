const CACHE = 'booktrack-static-v7';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache =>
    cache.addAll(['./', './manifest.webmanifest'])
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

// BookTrack's book collection is stored separately in localStorage.
// Avoid caching page navigations so updates to the app are picked up cleanly.
