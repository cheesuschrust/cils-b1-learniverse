
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'cils-app-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.svg',
  // Add other critical assets here
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache core assets
      await cache.addAll(ASSETS_TO_CACHE);
      // Activate immediately
      await self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Handle API requests separately
  if (event.request.url.includes('/api/')) {
    return handleApiRequest(event);
  }

  // For navigation requests, use a network-first strategy
  if (event.request.mode === 'navigate') {
    return handleNavigationRequest(event);
  }

  // For assets and other resources, use a cache-first strategy
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        // Return cached response and update cache in background
        updateCache(event.request, cache);
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      try {
        const response = await fetch(event.request);
        
        // Cache successful responses
        if (response.ok) {
          const responseToCache = response.clone();
          cache.put(event.request, responseToCache);
        }
        
        return response;
      } catch (error) {
        // If offline and no cache, return default offline page for HTML requests
        const accept = event.request.headers.get('Accept') || '';
        if (accept.includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
        
        throw error;
      }
    })()
  );
});

// Handle API requests with network-first strategy and graceful degradation
async function handleApiRequest(event: FetchEvent) {
  try {
    // Try network first
    const response = await fetch(event.request);
    return response;
  } catch (error) {
    // If offline, check if we have cached data
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a specific offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'You are offline',
        offline: true,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(event: FetchEvent) {
  try {
    // Try network first
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      return preloadResponse;
    }
    
    const networkResponse = await fetch(event.request);
    
    // Cache successful responses
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If offline, try cache
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, show offline page
    return caches.match(OFFLINE_URL);
  }
}

// Update cache in background
async function updateCache(request: Request, cache: Cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    // Silently fail on background updates
  }
}

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
