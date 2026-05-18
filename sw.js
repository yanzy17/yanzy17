/* Yanzy Affiliate Hub - Service Worker v3
 * Network-first strategy: selalu cek update dari server dulu
 * supaya perubahan langsung kelihatan tanpa harus clear cache manual
 */
const CACHE_NAME = "yanzy-hub-v3-" + new Date().toISOString().slice(0,10);
const ASSETS = [
  "./",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// NETWORK-FIRST: selalu coba ambil dari server dulu, kalau offline baru pakai cache
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Skip cross-origin (AI API, Google Fonts, dll)
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        // Berhasil dapet versi terbaru, update cache
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => {
        // Offline? Pakai cache
        return caches.match(req).then((cached) => cached || caches.match("./"));
      })
  );
});
