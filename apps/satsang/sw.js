/**
 * Satsang App - Service Worker
 * Provides offline support and caching strategies
 */

const CACHE_NAME = 'satsang-v3';
const STATIC_CACHE = 'satsang-static-v3';
const DYNAMIC_CACHE = 'satsang-dynamic-v3';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/variables.css',
    '/css/reset.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/screens.css',
    '/css/player.css',
    '/css/search.css',
    '/js/app.js',
    '/js/store.js',
    '/js/router.js',
    '/js/utils.js',
    '/js/data.js',
    '/js/screens/home.js',
    '/js/screens/event.js',
    '/js/screens/vachak.js',
    '/js/screens/calendar.js',
    '/js/screens/saved.js',
    '/js/screens/profile.js',
    '/js/components/youtube-player.js',
    '/js/components/search.js',
    '/js/services/calendar-export.js',
    '/assets/icons/lucide.min.js',
    '/assets/images/placeholder-vachak.png',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.error('Cache failed:', err))
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                        .map((key) => {
                            console.log('🗑️ Deleting old cache:', key);
                            return caches.delete(key);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (YouTube, fonts, etc.)
    if (!url.origin.includes(self.location.origin)) {
        // For Google Fonts, try cache first
        if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
            event.respondWith(cacheFirst(request));
        }
        return;
    }

    // HTML pages - Network first, fallback to cache
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Static assets (CSS, JS, images) - Cache first
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // API/Data requests - Network first with cache fallback
    event.respondWith(networkFirst(request));
});

/**
 * Cache First Strategy
 * Try cache, fallback to network, update cache
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        console.log('Network failed, no cache:', request.url);
        // Return offline fallback for HTML
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
        }
        throw err;
    }
}

/**
 * Network First Strategy
 * Try network, fallback to cache
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Return offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
        }

        throw err;
    }
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(pathname) {
    return pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/);
}

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('📬 Push notification received');

    const data = event.data?.json() || {
        title: 'Satsang',
        body: 'New event notification',
        icon: '/assets/icons/icon-192x192.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: data.data || {},
            actions: data.actions || []
        })
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
                // Open new window
                return clients.openWindow(urlToOpen);
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);

    if (event.tag === 'sync-saved-events') {
        event.waitUntil(syncSavedEvents());
    }
});

async function syncSavedEvents() {
    // This would sync saved events with a backend
    // For now, just log
    console.log('Syncing saved events...');
}
