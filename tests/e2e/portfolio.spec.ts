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
    ['Contributions', 'contributions'],
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

for (const [company, summary, employmentDates, highlightCount] of [
  ['Dyno Nobel', /Build and modernize frontend applications/, 'May 2021 – Present', 5],
  ['RoviTracker', /Started in QA automation/, 'November 2018 – March 2022', 6],
] as const) {
  test(`${company} work highlights overlay the page without changing its layout`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#workexperience')
    await page.evaluate(() => document.fonts.ready)
    const card = page.getByRole('article', { name: company, includeHidden: true })
    const toggle = card.getByRole('button', { name: 'Work highlights', includeHidden: true })
    const dialog = page.getByRole('dialog', { name: `${company} work highlights` })
    const highlights = dialog.getByRole('list')
    const overview = card.getByText(summary)
    const dates = card.getByText(employmentDates)
    await expect(overview).toBeVisible()
    await expect(dates).toBeVisible()
    await toggle.scrollIntoViewIfNeeded()
    const layout = () =>
      page.evaluate(() => ({
        pageHeight: document.documentElement.scrollHeight,
        cardHeights: Array.from(
          document.querySelectorAll('.experience-card'),
          (element) => element.getBoundingClientRect().height,
        ),
      }))
    const initialLayout = await layout()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(dialog).toBeHidden()
    await toggle.click()
    await expect(dialog).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(highlights.getByRole('listitem')).toHaveCount(highlightCount)
    expect(await layout()).toEqual(initialLayout)
    const bounds = (await dialog.boundingBox())!
    expect(bounds.x).toBeGreaterThanOrEqual(16)
    expect(bounds.y).toBeGreaterThanOrEqual(16)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize()!.width - 16)
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(page.viewportSize()!.height - 16)
    await expect(dialog).toHaveCSS('overflow-y', 'auto')
    await dialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(highlights.getByRole('listitem').last()).toBeInViewport()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(toggle).toBeFocused()
    await toggle.focus()
    await toggle.press('Enter')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close work highlights' }).click()
    await expect(dialog).toBeHidden()
    await expect(toggle).toBeFocused()
    await toggle.press('Space')
    await expect(dialog).toBeVisible()
    await page.mouse.click(1, 1)
    await expect(dialog).toBeHidden()
    await expect(toggle).toBeFocused()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(overview).toBeVisible()
    await expect(dates).toBeVisible()
    expect(await layout()).toEqual(initialLayout)
  })
}

test('active and past projects are separated on the home page and projects route', async ({
  page,
}) => {
  for (const path of ['/', '/projects']) {
    await page.goto(path)
    const active = page.getByRole('region', { name: 'Active Projects' })
    const past = page.getByRole('region', { name: 'Past Projects' })
    await expect(active.getByRole('article')).toHaveCount(4)
    const artisanRayTech = active.getByRole('article', { name: 'Artisan Ray Tech Home Page' })
    await expect(artisanRayTech).toBeVisible()
    await expect(
      artisanRayTech.getByRole('link', { name: /Visit Artisan Ray Tech Home Page/ }),
    ).toHaveAttribute('href', 'https://artisanraytech.com')
    await expect(artisanRayTech.getByText('Private repository')).toBeVisible()
    await expect(past.getByRole('article', { name: 'Artisan Ray Tech Home Page' })).toHaveCount(0)
    const gameMapster = active.getByRole('article', { name: 'Game Mapster' })
    await expect(gameMapster).toBeVisible()
    await expect(
      gameMapster.getByRole('link', { name: 'Visit Game Mapster (opens in a new tab)' }),
    ).toHaveAttribute('href', 'https://gamemapster.com')
    await expect(past.getByRole('article', { name: 'Game Mapster' })).toHaveCount(0)
    await expect(active.getByRole('article', { name: 'Wild Haven / Wolf Haven' })).toBeVisible()
    await expect(active.getByRole('article', { name: 'Portfolio' })).toBeVisible()
    await expect(past.getByRole('article')).toHaveCount(8)
    await expect(past.getByRole('article', { name: 'Allergen Buddy' })).toBeVisible()
    await expect(past.getByRole('article', { name: 'Medicy', exact: true })).toBeVisible()
    expect((await active.boundingBox())!.y).toBeLessThan((await past.boundingBox())!.y)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

for (const [title, summary, path] of [
  ['Game Mapster', /An interactive game-map website/, '/#projects'],
  ['Game Mapster', /An interactive game-map website/, '/projects'],
  ['Wild Haven / Wolf Haven', /Rewrote the entire website in React/, '/#projects'],
  ['Wild Haven / Wolf Haven', /Rewrote the entire website in React/, '/projects'],
] as const) {
  test(`${title} project highlights float without resizing cards on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    const card = page.getByRole('article', { name: title, includeHidden: true })
    const toggle = card.getByRole('button', { name: 'Project highlights', includeHidden: true })
    const dialog = page.getByRole('dialog', { name: `${title} highlights` })
    await toggle.scrollIntoViewIfNeeded()
    const layout = () =>
      page.evaluate(() => ({
        pageHeight: document.documentElement.scrollHeight,
        cardHeights: Array.from(
          document.querySelectorAll('.project-card'),
          (element) => element.getBoundingClientRect().height,
        ),
      }))
    const initial = await layout()
    await expect(dialog).toBeHidden()
    await toggle.click()
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('listitem')).toHaveCount(6)
    expect(await layout()).toEqual(initial)
    await dialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(dialog.getByRole('listitem').last()).toBeInViewport()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(toggle).toBeFocused()
    await toggle.press('Enter')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close project highlights' }).click()
    await expect(dialog).toBeHidden()
    await expect(toggle).toBeFocused()
    expect(await layout()).toEqual(initial)
    await expect(card.getByText(summary)).toBeVisible()
  })
}

test('contributions combine both services with accessible source and day controls', async ({
  page,
}) => {
  await page.goto('/#contributions')
  const section = page.getByRole('region', { name: 'Contributions', exact: true })
  const controls = section.getByRole('group', { name: 'Contribution source' })
  const count = async () =>
    Number(
      (await section.getByRole('heading', { name: /recorded contributions/ }).innerText()).replace(
        /[^\d]/g,
        '',
      ),
    )
  const combined = await count()
  await controls.getByRole('button', { name: 'GitHub' }).click()
  await expect(controls.getByRole('button', { name: 'GitHub' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  const github = await count()
  await controls.getByRole('button', { name: 'Gitea' }).click()
  const gitea = await count()
  expect(combined).toBe(github + gitea)
  await controls.getByRole('button', { name: 'Combined' }).click()
  const calendar = section.getByRole('group', { name: 'Daily contribution calendar' })
  const days = calendar.getByRole('button')
  await expect(days).toHaveCount(365)
  await days.first().focus()
  await page.keyboard.press('End')
  await expect(days.last()).toBeFocused()
  await expect(section.getByRole('status')).toContainText('GitHub:')
  await page.keyboard.press('Home')
  await expect(days.first()).toBeFocused()
  await expect(section.getByRole('status')).toContainText('Gitea:')
  expect(await calendar.locator('button[tabindex="0"]').count()).toBe(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await expect(
    section.getByRole('link', { name: 'Gitea profile (opens in a new tab)' }),
  ).toHaveAttribute('href', 'https://gitea.natelinyoungnas.com/RazorzMcLazorz')
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

test('desktop terrain stays in the gutters, follows scrolling, and matches both themes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Animated terrain is desktop only')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const terrain = page.locator('.terrain-journey')
  await expect(terrain).toHaveAttribute('aria-hidden', 'true')
  await expect(terrain).toHaveCSS('opacity', '0')
  await expect(terrain).toHaveCSS('pointer-events', 'none')
  await expect(page.locator('.terrain-layer')).toHaveCount(6)
  const floor = page.locator('.terrain-floor').last()
  const elk = page.locator('.terrain-elk')
  await expect(elk).toHaveCount(1)
  await expect(elk).not.toBeInViewport()
  const column = (await page.getByRole('main').boundingBox())!
  const left = (await page.locator('.terrain-rail--left').boundingBox())!
  const right = (await page.locator('.terrain-rail--right').boundingBox())!
  expect(left.x + left.width).toBeLessThanOrEqual(column.x - 32)
  expect(right.x).toBeGreaterThanOrEqual(column.x + column.width + 32)

  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }))
  await expect(terrain).toHaveCSS('opacity', '1')
  const distant = page.locator('.terrain-layer--distant').first()
  const trees = page.locator('.terrain-layer--woodland').first()
  const pine = (await page.locator('.terrain-trees-front .terrain-pine').first().boundingBox())!
  expect(pine.height).toBeGreaterThan(350)
  await expect(elk).not.toBeInViewport()
  await expect
    .poll(() =>
      distant.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42),
    )
    .toBeLessThan(0)
  expect(await trees.getAttribute('style')).not.toBe(await distant.getAttribute('style'))
  const before = await distant.getAttribute('style')
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  )
  await expect.poll(() => distant.getAttribute('style')).not.toBe(before)
  await expect
    .poll(() => floor.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42))
    .toBeCloseTo(0, 0)
  await expect(elk).toBeInViewport()
  const ground = (await floor.boundingBox())!
  expect(ground.y + ground.height).toBeCloseTo(900, 0)
  expect(ground.x).toBeGreaterThanOrEqual(right.x)
  await expect(page.locator('.terrain-rocks')).toHaveCount(2)
  await expect(page.locator('.terrain-river, .terrain-waterline')).toHaveCount(0)
  await expect(page.locator('.terrain-trees-front').first()).toHaveCSS('fill', 'rgb(220, 148, 98)')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440)

  await page.getByRole('button', { name: 'Back to top' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.getByRole('switch', { name: 'Sunrise theme' }).check()
  await expect(page.locator('.terrain-trees-front').first()).toHaveCSS('fill', 'rgb(104, 173, 189)')
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page.locator('#projects')).toBeFocused()

  await page.setViewportSize({ width: 1100, height: 900 })
  await expect(terrain).toHaveCount(0)
  await page.setViewportSize({ width: 1920, height: 900 })
  await expect(terrain).toBeVisible()
  await page.goto('/projects')
  await expect(terrain).toHaveCount(0)
})

test('desktop reduced-motion scenery remains still and responds to preference changes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Static terrain is desktop only')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const layer = page.locator('.terrain-layer').first()
  const before = await layer.getAttribute('style')
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }))
  await expect(layer).toHaveAttribute('style', before!)
  await expect(page.locator('.terrain-journey')).toHaveCSS('opacity', '1')
  await expect(page.locator('.terrain-elk')).toBeInViewport()

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(layer).not.toHaveAttribute('style', before!)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(layer).toHaveAttribute('style', before!)
})

test('touch screens do not mount desktop terrain even with a wide viewport', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Checks touch-screen exclusion')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.terrain-journey')).toHaveCount(0)
})
