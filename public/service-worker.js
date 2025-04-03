
/* eslint-disable no-restricted-globals */

// Define cache name and assets to cache
const CACHE_NAME = 'cils-app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', event => {
  // For API requests, don't use cache
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For non-API requests, try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response because it can only be consumed once
        const responseClone = response.clone();
        
        // Open cache and store the new response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // If network fetch fails, try to return from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            // Return cached response or offline page
            return cachedResponse || caches.match('/offline.html');
          });
      })
  );
});
