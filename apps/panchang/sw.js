/**
 * Panchang Service Worker - Offline Support
 * Strategy: Stale-While-Revalidate (fresh content when online, cached when offline)
 */

const CACHE_NAME = 'panchang-v6';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon.svg',
    './icons/icon-96.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './lib/astronomy.js',
    './lib/vedic-engine.js',
    './lib/festival-calculator.js'
];

// Install - Pre-cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Stale-While-Revalidate for own assets, Cache-First for fonts
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Google Fonts: Cache-First (fonts rarely change)
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cached => {
                    if (cached) return cached;
                    return fetch(event.request).then(response => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
        return;
    }

    // Own assets: Stale-While-Revalidate
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                // Fetch from network in the background
                const networkFetch = fetch(event.request).then(networkResponse => {
                    // Update the cache with fresh content
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Network failed, cachedResponse will be used
                    return null;
                });

                // Return cached response immediately, or wait for network
                return cachedResponse || networkFetch;
            });
        })
    );
});
