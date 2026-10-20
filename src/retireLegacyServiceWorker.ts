// CRA registered this worker in production. Only retire that worker, not other apps on this origin.
export async function retireLegacyServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  const legacyUrl = new URL(`${import.meta.env.BASE_URL}service-worker.js`, location.origin)
  const registrations = await navigator.serviceWorker.getRegistrations()

  await Promise.all(
    registrations
      .filter((registration) =>
        [registration.active, registration.waiting, registration.installing].some(
          (worker) => worker?.scriptURL === legacyUrl.href,
        ),
      )
      .map((registration) => registration.unregister()),
  )
}
