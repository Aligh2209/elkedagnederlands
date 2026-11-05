const VERSIE = 'edn-a78330aeb2', LETTERS = 'edn-letters';
const KERN = ['./', 'inhoud.js', 'fotos.js', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSIE).then(c => c.addAll(KERN))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(ks => Promise.all(ks.filter(k => k !== VERSIE && k !== LETTERS).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const bak = u.origin === location.origin ? VERSIE : /^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname) ? LETTERS : null;
  if (!bak) return;
  const sleutel = r.mode === 'navigate' ? './' : r;
  e.respondWith(caches.open(bak).then(c => c.match(sleutel, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
    if (res.ok || res.type === 'opaque') c.put(sleutel, res.clone());
    return res;
  }).catch(() => hit))));
});
