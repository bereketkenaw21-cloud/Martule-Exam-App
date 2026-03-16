const CACHE_NAME = 'martule-cache-v1';
const ASSETS = [
  '/Martule-Exam-App/',
  '/Martule-Exam-App/index.html',
  '/Martule-Exam-App/style.css',
  '/Martule-Exam-App/script.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
