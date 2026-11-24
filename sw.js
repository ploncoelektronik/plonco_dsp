// Service worker sederhana: aplikasi tetap bisa dibuka tanpa internet.
// Naikkan angka VERSI setiap kali index.html diganti agar HP memuat versi terbaru.
const VERSI = 'pl24-v1';
const FILE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Jaringan dulu (selalu versi terbaru), bila offline pakai salinan tersimpan.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const salinan = r.clone();
      caches.open(VERSI).then(c => c.put(e.request, salinan));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
