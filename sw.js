// Cache configuration
const CACHE_VERSION = '3';
const STATIC_CACHE = `static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Assets to cache immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/critical.css',
  '/css/combined.min.css',
  '/js/mobile-optimizations.js',
  '/images/marcelassogba blanc.webp',
  '/offline.html',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Cache duration in seconds
const CACHE_DURATION = {
  default: 7 * 24 * 60 * 60, // 1 week
  images: 30 * 24 * 60 * 60, // 30 days
  fonts: 365 * 24 * 60 * 60 // 1 year
};

// Helper to identify asset types
function getAssetType(url) {
  const path = new URL(url).pathname;
  if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  if (path.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
  if (path.match(/\.(css|js)$/)) return 'static';
  return 'default';
}

// Helper to set cache headers
function setCacheHeaders(response, type) {
  const headers = new Headers(response.headers);
  const duration = CACHE_DURATION[type] || CACHE_DURATION.default;
  headers.set('Cache-Control', `public, max-age=${duration}`);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Helper functions for different caching strategies
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('Network response was not ok');

    const type = getAssetType(request.url);
    const cachedResponse = setCacheHeaders(response.clone(), type);
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, cachedResponse);

    return response;
  } catch (error) {
    const fallbackResponse = await caches.match(OFFLINE_PAGE);
    return fallbackResponse || new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('Network response was not ok');

    const type = getAssetType(request.url);
    const cachedResponse = setCacheHeaders(response.clone(), type);
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put(request, cachedResponse);

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match(OFFLINE_PAGE);
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const networkPromise = fetch(request).then(response => {
    if (!response.ok) throw new Error('Network response was not ok');

    const type = getAssetType(request.url);
    const cachedResponse = setCacheHeaders(response.clone(), type);
    caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, cachedResponse));

    return response;
  }).catch(error => {
    console.error('Error fetching resource:', error);
    return cachedResponse || caches.match(OFFLINE_PAGE);
  });

  return cachedResponse || networkPromise;
}

// Install event: Cache core assets immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return key.startsWith('static-v') && key !== STATIC_CACHE ||
                 key.startsWith('dynamic-v') && key !== DYNAMIC_CACHE;
        }).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event: Apply caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle different request types
  if (request.method !== 'GET') return;

  // API calls: Network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: Cache-first strategy
  if (CORE_ASSETS.includes(url.pathname) || getAssetType(url.pathname) === 'static') {
    event.respondWith(cacheFirst(request));
});

// Activate event: Clean up old caches and take control
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => {
            return ![
              STATIC_CACHE,
              DYNAMIC_CACHE
            ].includes(key);
          }).map(key => caches.delete(key))
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

// Fetch event: Handle requests with appropriate strategies
self.addEventListener('fetch', event => {
  // Only handle GET requests for HTTP(S) URLs
  if (!event.request.url.startsWith('http') || event.request.method !== 'GET') {
    return;
  }

  // Network-first strategy for API calls and dynamic content
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first strategy for static assets
  if (isStaticAsset(event.request.url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Stale-while-revalidate for everything else
  event.respondWith(staleWhileRevalidate(event.request));
});
