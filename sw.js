/* ==================================================
   JSON STUDIO LITE – Service Worker (Offline support)
   Strategy:
   - Precache core shell (HTML/CSS/JS vendor)
   - Cache-first for static assets
   - Network-first for HTML navigations
   ================================================== */

const VERSION = "jsl-v1.0.0";
const CORE_CACHE = `${VERSION}-core`;

const CORE_ASSETS = [
  "/",                      // adjust to "/jsonstudio-lite/" if hosted in a subfolder
  "/index.html",
  "/assets/styles.css",
  "/styles/theme.css",
  "/assets/favicon.ico",

  // Vendor libs (adjust if you change filenames)
  "/js/vendor/papaparse.min.js",
  "/js/vendor/filesaver.min.js",
  "/js/vendor/dompurify.min.js",
  "/js/vendor/dayjs.min.js",
  "/js/vendor/codemirror.min.js",
  "/js/vendor/codemirror-json.min.js",

  // App files
  "/js/converters.js",
  "/js/ui.js",
  "/js/storage.js",
  "/js/app.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CORE_CACHE).then((c) => c.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k.startsWith("jsl-") && k !== CORE_CACHE) ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // HTML navigations → Network first (so updates appear), fallback to cache
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CORE_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("/index.html")))
    );
    return;
  }

  // Same-origin static assets → Cache first
  const url = new URL(req.url);
  const isSameOrigin = url.origin === location.origin;
  if (isSameOrigin && (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/js/") || url.pathname.startsWith("/styles/"))) {
    e.respondWith(
      caches.match(req).then((m) => m || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CORE_CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // default: just pass through
});
