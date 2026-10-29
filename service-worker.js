const CACHE_NAME = "innoaim-magazyn-v40-shelves-ef";
const APP_FILES = [
  "./",
  "./index.html",
  "./klient.html",
  "./styles.css",
  "./styles.css?v=20261021-odswiezanie",
  "./app.js",
  "./app.js?v=20261028-regaly-ef",
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

// Aktualizacja kodu musi się udać nawet przy braku zdjęcia lub innego zasobu.
const CORE_FILES = ["./index.html", "./app.js", "./app.js?v=20261028-regaly-ef"];
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Przy niedostępnym kodzie zachowaj poprzednią działającą wersję.
    await cache.addAll(CORE_FILES);
    await Promise.allSettled(APP_FILES.filter(path => !CORE_FILES.includes(path))
      .map(path => cache.add(path)));
    await self.skipWaiting();
  })());
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
