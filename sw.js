// Family Resort Finder — service worker
// Bump VERSION any time you change SHELL_ASSETS or want to force clients to refresh.
const VERSION = 'v1';
const SHELL_CACHE = `resort-finder-shell-${VERSION}`;
const RUNTIME_CACHE = `resort-finder-runtime-${VERSION}`;

// Paths are relative to this file's location (repo root), so this works
// unchanged whether you're on https://<user>.github.io/family-resort-finder/
// or https://family-resort-finder.vercel.app/
const SHELL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './flights.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Live flight search hits a Vercel serverless function — never cache it,
  // and fail politely instead of throwing when there's no connection.
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ error: 'You appear to be offline — flight search needs an internet connection.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Page navigations: try the network first (so you always get updates),
  // fall back to the cached shell if offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Precached app shell assets: cache-first for instant loads.
  const shellUrls = SHELL_ASSETS.map((path) => new URL(path, self.registration.scope).href);
  if (shellUrls.includes(request.url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Everything else (resort data files, images, the Leaflet CDN assets):
  // stale-while-revalidate — show the cached copy instantly, refresh in the background.
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
