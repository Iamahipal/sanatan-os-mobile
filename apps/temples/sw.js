const CACHE_VERSION = "temples-v2";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;

const MAX_CACHE_ENTRIES = {
  [APP_SHELL_CACHE]: 30,
  [DATA_CACHE]: 80,
  [MEDIA_CACHE]: 120
};

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app/main.js",
  "./app/ui.js",
  "./app/router.js",
  "./app/data-service.js",
  "./app/i18n.js",
  "./app/preferences.js",
  "./app/pwa.js",
  "./app/styles.css",
  "./vite.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, DATA_CACHE, MEDIA_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isDataRequest(url) {
  return url.pathname.includes("/data/") || url.pathname.endsWith(".json");
}

function isMediaRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|mp3|ogg|wav)$/i.test(url.pathname);
}

async function trimCache(cacheName) {
  const maxEntries = MAX_CACHE_ENTRIES[cacheName];
  if (!maxEntries) return;

  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length <= maxEntries) return;

  const overflow = keys.length - maxEntries;
  await Promise.all(keys.slice(0, overflow).map((request) => cache.delete(request)));
}

async function storeAndTrim(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  await trimCache(cacheName);
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    await storeAndTrim(cacheName, request, response);
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const shell = await caches.open(APP_SHELL_CACHE);
      return shell.match(fallbackUrl);
    }
    throw new Error("Network unavailable and no cache fallback.");
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(async (response) => {
      await storeAndTrim(cacheName, request, response);
      return response;
    })
    .catch(() => null);

  return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, APP_SHELL_CACHE, "./index.html"));
    return;
  }

  if (isDataRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }

  if (isMediaRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, MEDIA_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, APP_SHELL_CACHE));
});
