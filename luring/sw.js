/* Service worker SIDOKWAS Luring: menyimpan halaman agar tetap terbuka tanpa sinyal. */
const CACHE = "sidokwas-luring-v1";
const ISI = ["./", "./index.html", "./manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ISI)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // kiriman ke Apps Script tidak di-cache
  e.respondWith(caches.match(req).then(res => res || fetch(req).then(r => {
    const salinan = r.clone(); caches.open(CACHE).then(c => c.put(req, salinan)); return r;
  }).catch(() => caches.match("./index.html"))));
});
