// CACHE VERSION - INCREMENT TO BUST CACHE
const CACHE_NAME = 'sanatan-os-v7';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css'
];

// Install - cache files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - delete old caches
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
  return self.clients.claim();
});

// Fetch - network first
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ===== PUSH NOTIFICATIONS =====
// Handle incoming push notifications (works even when browser is closed!)
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);

  let data = {
    title: '🙏 Naam Jap Reminder',
    body: 'Time for your daily Naam Jap sadhana!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png'
  };

  // Try to parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'naamjap-reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Start Japa' },
      { action: 'dismiss', title: 'Later' }
    ],
    data: {
      url: '/apps/japa/index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click:', event.action);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the app
  const urlToOpen = event.notification.data?.url || '/apps/japa/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if already open
        for (const client of windowClients) {
          if (client.url.includes('/apps/japa') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('[SW] Notification closed');
});
