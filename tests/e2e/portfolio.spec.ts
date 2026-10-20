import { expect, test } from '@playwright/test'

test('navigation works on desktop and mobile without browser errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Nathaniel P. Young' })).toBeVisible()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  for (const name of ['Projects', 'Skills', 'Contact', 'Home']) {
    await nav.getByRole('link', { name, exact: true }).click()
    await expect(
      page.getByRole('heading', { level: 1, name: name === 'Home' ? 'Nathaniel P. Young' : name }),
    ).toBeVisible()
    await expect(page.getByRole('main')).toBeFocused()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  expect(errors).toEqual([])
})

test('direct route reloads, résumé asset, and downloads work', async ({ page, request }) => {
  await page.goto('/contact')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible()
  const resume = await request.get('/assets/Resume.pdf')
  expect(resume.ok()).toBe(true)
  expect(resume.headers()['content-type']).toContain('application/pdf')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download résumé' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('Nathaniel-Young-Resume.pdf')
  expect(await download.failure()).toBeNull()
})

test('keyboard users can skip navigation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
})

test('unknown URLs show a 404 and can recover', async ({ page }) => {
  await page.goto('/missing-page')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page).toHaveURL('/')
})

test('layouts fit a narrow viewport and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/', '/projects', '/skills', '/contact']) {
    await page.goto(path)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  await page.goto('/')
  await expect(page.locator('#nameSigned')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('#nameSigned')).toHaveCSS('stroke-dashoffset', '0px')
})

test('the migration worker retires itself without deleting other caches', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    const cache = await caches.open('unrelated-app-cache')
    await cache.put('/unrelated', new Response('keep this'))
    await navigator.serviceWorker.register('/service-worker.js')
  })
  await expect
    .poll(() =>
      page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length),
    )
    .toBe(0)
  expect(await page.evaluate(() => caches.has('unrelated-app-cache'))).toBe(true)
})
