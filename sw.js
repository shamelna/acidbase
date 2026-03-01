const CACHE_NAME = 'acid-base-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // If fetch fails, try to return from cache even if stale
          if (!response) {
            return caches.match(event.request);
          }

          // Check if valid response
          if (response.status === 200 || response.status === 0) {
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache API calls or non-GET requests
                if (event.request.method === 'GET' && 
                    !event.request.url.includes('/api/') &&
                    !event.request.url.includes('chrome-extension://')) {
                  cache.put(event.request, responseToCache);
                }
              });
          }

          return response;
        }).catch(error => {
          // If network fetch fails, try to return from cache
          console.log('Fetch failed, trying cache:', error);
          return caches.match(event.request);
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
