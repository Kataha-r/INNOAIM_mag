const CACHE_NAME = "innoaim-magazyn-v7";
const APP_FILES = [
  "./",
  "./index.html",
  "./klient.html",
  "./styles.css",
  "./app.js",
  "./client.js",
  "./manifest.webmanifest",
  "./innoaim-logo.png",
  "./innoaim-app-icon.svg",
  "./innoaim-phone-icon.jpg",
  "./innoaim-phone-icon-square.jpg",
  "./innoaim-phone-icon-512.jpg",
  "./product-placeholder.svg",
  "./vendor/xlsx.bundle.js"
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
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            const url = new URL(request.url);
            if (url.pathname.endsWith("/klient.html")) return caches.match("./klient.html");
            return caches.match("./index.html");
          }
          return undefined;
        });
    })
  );
});
