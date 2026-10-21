const CACHE_NAME = "innoaim-magazyn-v38-both-panels-backup21";
const APP_FILES = [
  "./",
  "./index.html",
  "./klient.html",
  "./styles.css",
  "./app.js",
  "./app.js?v=20261021-kolejnosc-2",
  "./client-order-import.js",
  "./client-order-import.css",
  "./client.js",
  "./manifest.webmanifest",
  "./innoaim-logo.png",
  "./innoaim-app-icon.svg",
  "./innoaim-phone-icon.jpg",
  "./innoaim-phone-icon-square.jpg",
  "./innoaim-phone-icon-512.jpg",
  "./product-placeholder.svg",
  "./vendor/xlsx.bundle.js",
  "./vendor/supabase.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith("innoaim-magazyn-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.includes("/panel-klienta/")) return;
  const freshCode = request.mode === "navigate" || /\.(?:html|js|css)$/.test(url.pathname);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (!freshCode && cached) return cached;
    try {
      const response = await fetch(request, freshCode ? {cache: "no-cache"} : undefined);
      if (response.ok) {
        try { await cache.put(request, response.clone()); } catch {}
        return response;
      }
      if (cached) return cached;
      return response;
    } catch (error) {
      if (cached) return cached;
      const offline = await cache.match(request, {ignoreSearch: true});
      if (offline) return offline;
      if (request.mode === "navigate") {
        const fallback = await cache.match(url.pathname.endsWith("/klient.html") ? "./klient.html" : "./index.html");
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
