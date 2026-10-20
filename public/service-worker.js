// Migration-only worker: replace the old CRA cache-first worker, then retire.
// Keep this file deployed so returning visitors can receive the migration.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration.unregister().then(() => self.clients.claim()))
})
