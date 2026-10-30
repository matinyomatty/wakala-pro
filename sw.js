// Wakala Pro service worker: lets the app open without internet.
// The app page itself is always fetched fresh when online (so updates show
// immediately); libraries are cached after the first visit.
const CACHE = 'wakala-pro-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const LIB_HOSTS = /(^|\.)cdn\.tailwindcss\.com$|(^|\.)gstatic\.com$|(^|\.)cdnjs\.cloudflare\.com$/;

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys()
        .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
        .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // App files: network first, cache as fallback.
    if (url.origin === self.location.origin) {
        e.respondWith(
            fetch(req).then(res => {
                const copy = res.clone();
                caches.open(CACHE).then(c => c.put(req, copy));
                return res;
            }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
        );
        return;
    }

    // Libraries (Tailwind, Firebase SDK, PDF): cache first.
    if (LIB_HOSTS.test(url.hostname)) {
        e.respondWith(
            caches.match(req).then(hit => hit || fetch(req).then(res => {
                const copy = res.clone();
                caches.open(CACHE).then(c => c.put(req, copy));
                return res;
            }))
        );
    }
    // Everything else (Firestore, Auth, CallMeBot) goes straight to the network.
});
