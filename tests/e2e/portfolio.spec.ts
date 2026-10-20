import { expect, test } from '@playwright/test'

test('navigation works on desktop and mobile without browser errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Nathaniel Patrick Young' }),
  ).toBeVisible()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  for (const [name, id] of [
    ['Experience', 'workexperience'],
    ['Projects', 'projects'],
    ['Languages', 'languages'],
    ['About Me', 'aboutme'],
    ['Resume', 'resume'],
    ['References', 'references'],
  ] as const) {
    await nav.getByRole('link', { name, exact: true }).click()
    await expect(page.locator(`#${id}`)).toBeFocused()
    await expect(page).toHaveURL(`/#${id}`)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  for (const path of ['/projects', '/skills', '/contact']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
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
  await expect(page.locator('.orbit-item').first()).toHaveCSS('animation-name', 'none')
  await expect(page.getByRole('button', { name: 'Pause skills animation' })).toBeHidden()
})

test('sunrise and sunset change artwork and survive a reload', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('switch', { name: 'Sunrise theme' })
  await expect(toggle).not.toBeChecked()
  await expect(page.locator('.mountain-backdrop img')).toHaveAttribute(
    'src',
    /mountainsSunset\.svg$/,
  )
  await toggle.check()
  await expect(page.locator('.portfolio')).toHaveAttribute('data-scenery', 'sunrise')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(6, 43, 121)')
  await expect(page.getByRole('link', { name: 'Explore my projects' })).toHaveCSS(
    'background-color',
    'rgb(156, 219, 255)',
  )
  await expect(page.locator('.mountain-backdrop img')).toHaveAttribute('src', /mSunrise\.svg$/)
  await page.reload()
  await expect(toggle).toBeChecked()
  await expect(page.locator('.portfolio')).toHaveAttribute('data-scenery', 'sunrise')
  await toggle.uncheck()
  await expect(page.locator('.portfolio')).toHaveAttribute('data-scenery', 'sunset')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(84, 7, 0)')
})

test('section links work from direct URLs and the retained contact route', async ({ page }) => {
  await page.goto('/#aboutme')
  await expect(page.getByRole('region', { name: 'About Me' })).toBeFocused()
  await page.reload()
  await expect(page.getByRole('region', { name: 'About Me' })).toBeFocused()
  await page.goto('/contact')
  await page.getByRole('link', { name: 'Experience', exact: true }).click()
  await expect(page).toHaveURL('/#workexperience')
  await expect(page.getByRole('region', { name: 'Work Experience' })).toBeFocused()
})

test('top navigation scrolls gradually and honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth')
  const destination = await page.locator('#projects').evaluate((section) => {
    return section.getBoundingClientRect().top + window.scrollY - 32
  })
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect
    .poll(
      () => page.evaluate((end) => window.scrollY > 0 && window.scrollY < end - 1, destination),
      { intervals: [16] },
    )
    .toBe(true)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(destination, 0)
  await expect(page.locator('#projects')).toBeFocused()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page.locator('#projects')).toBeFocused()
  const finalOffset = await page
    .locator('#projects')
    .evaluate((section) => section.getBoundingClientRect().top)
  expect(finalOffset).toBeCloseTo(32, 0)
})

test('both landscape SVGs render without transparent seams at different scales', async ({
  page,
}) => {
  await page.goto('/')
  for (const filename of ['mountainsSunset.svg', 'mSunrise.svg']) {
    for (const size of [390, 1920, 2560]) {
      const translucentPixels = await page.evaluate(
        async ({ filename, size }) => {
          const image = new Image()
          image.src = new URL(`assets/concept/${filename}`, document.baseURI).href
          await image.decode()
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = size
          const context = canvas.getContext('2d')!
          context.drawImage(image, 0, 0, size, size)
          const { data } = context.getImageData(0, 0, size, size)
          let translucent = 0
          for (let index = 3; index < data.length; index += 4) {
            if (data[index]! < 255) translucent++
          }
          return translucent
        },
        { filename, size },
      )
      expect(translucentPixels, `${filename} at ${size}px should have an opaque backing`).toBe(0)
    }
  }
})

test('back-to-top button floats at the top right and supports keyboard and reduced motion', async ({
  page,
}) => {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion })
    await page.goto('/')
    const button = page.getByRole('button', { name: 'Back to top' })
    await expect(button).toBeHidden()
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('position', 'fixed')
    const initial = (await button.boundingBox())!
    expect(initial.y).toBe(16)
    expect(initial.x + initial.width).toBe(page.viewportSize()!.width - 16)

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
    expect(await button.boundingBox()).toEqual(initial)
    await button.focus()
    await button.press('Enter')
    await expect(page.getByRole('banner')).toBeFocused()
    if (reducedMotion === 'no-preference') {
      await expect
        .poll(() => page.evaluate(() => window.scrollY > 0 && window.scrollY < 1500), {
          intervals: [16],
        })
        .toBe(true)
    }
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(button).toBeHidden()
  }
})

test('the project and contact hero buttons reach their sections', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore my projects' }).click()
  await expect(page).toHaveURL('/#projects')
  await expect(page.getByRole('region', { name: 'Projects', exact: true })).toBeFocused()
  await page.goto('/')
  await page.getByRole('link', { name: 'Get in touch' }).click()
  await expect(page).toHaveURL('/#contact')
  await expect(page.getByRole('region', { name: 'Contact Me', exact: true })).toBeFocused()
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
