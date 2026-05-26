const CACHE_NAME = "alif-ai-v16";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260516-2",
  "./app.js?v=20260516-2",
  "./version.json",
  "./data.js",
  "./data/content-metadata.js",
  "./data/history.js",
  "./data/halal-haram.js",
  "./data/islamic-faq.js",
  "./data/islamic-hadith.js",
  "./data/prayer-mode.js",
  "./data/quran-mode.js",
  "./data/quran-surahs.js",
  "./manifest.json",
  "./sitemap.xml",
  "./robots.txt",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/maskable.svg",
  "./assets/maskable-512.png",
  "./assets/apple-touch-icon.svg"
];

const OPTIONAL_CDN = [
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(APP_SHELL).then(() => Promise.allSettled(OPTIONAL_CDN.map((url) => cache.add(url))))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const isAppShellAsset =
    sameOrigin && [".html", ".css", ".js", ".json"].some((ext) => requestUrl.pathname.endsWith(ext));
  const isAssetRequest = sameOrigin && !isAppShellAsset;
  const isNavigation = event.request.mode === "navigate";
  event.respondWith(
    isNavigation || isAppShellAsset
      ? fetch(event.request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(async () => {
            const cached = await caches.match(event.request);
            if (cached) return cached;
            if (isNavigation) return caches.match("./index.html");
            return Response.error();
          })
      : caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request)
            .then((response) => {
              if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
              }
              return response;
            })
            .catch(() => (isAssetRequest ? Response.error() : caches.match("./index.html")));
        })
  );
});
