import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { randomUUID } from 'node:crypto'
import { seedContent } from '../../src/content/seed'
import { audiences, services, businessHref } from '../../src/content/business'

test('home, keyboard navigation and responsive layout', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/de')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ihre Marke.')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('link', { name: /Bekleidung anfragen/ })).toBeVisible()
  await page.locator('.hero-visual img').evaluate((image: HTMLImageElement) => image.decode())
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true })
      if (width === 1440) await page.screenshot({ path: 'test-results/studio-home-desktop.png' })
    }
  }
  await page.getByRole('button', { name: 'Menü', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile Navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Menü', exact: true })).toBeFocused()
  expect(errors).toEqual([])
})

test('desktop navigation exposes every audience and service with keyboard access', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/de')
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation', exact: true })
  const audienceMenu = nav.locator('summary').filter({ hasText: 'Für wen' })
  await audienceMenu.focus()
  await page.keyboard.press('Enter')
  for (const audience of audiences)
    await expect(nav.locator(`a[href="${businessHref(audience, 'de')}"]`)).toBeVisible()
  await page.screenshot({ path: 'test-results/customer-menu.png' })
  await page.keyboard.press('Escape')
  await expect(audienceMenu).toBeFocused()
  await expect(nav.locator('details[open]')).toHaveCount(0)
  await nav.locator('summary').filter({ hasText: 'Leistungen' }).click()
  for (const service of services)
    await expect(nav.locator(`a[href="${businessHref(service, 'de')}"]`)).toBeVisible()
  const report = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(
    report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([])
  await page.locator('.utility-bar > span').click()
  await expect(nav.locator('details[open]')).toHaveCount(0)
  await expect(page.locator('main .audience-card')).toHaveCount(6)
  await expect(page.locator('main .service-card')).toHaveCount(6)
  await expect(page.locator('main .supply-card')).toBeVisible()
})

test('mobile menus reach supporting services and retain the enquiry context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/teamkleidung')
  await page.getByRole('button', { name: 'Menü', exact: true }).click()
  const nav = page.getByRole('navigation', { name: 'Mobile Navigation' })
  await nav.locator('summary').filter({ hasText: 'Für wen' }).click()
  for (const audience of audiences)
    await expect(nav.locator(`a[href="${businessHref(audience, 'de')}"]`)).toBeVisible()
  await nav.locator('summary').filter({ hasText: 'Leistungen' }).click()
  await expect(nav.locator('details[open]')).toHaveCount(1)
  for (const service of services)
    await expect(nav.locator(`a[href="${businessHref(service, 'de')}"]`)).toBeVisible()
  await nav.getByRole('link', { name: 'Verpackung & Lieferkoordination' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Verpackung & Lieferkoordination',
  )
  await expect(nav).toHaveCount(0)
  await page.getByRole('link', { name: 'Diese Leistung anfragen', exact: true }).first().click()
  await expect(page.getByLabel('Gewünschte Leistung (optional)')).toHaveValue('logistics')
  await expect(page.getByLabel('Andere Textilanfrage')).toBeChecked()
})

test('English customer pages lead to the matching English enquiry', async ({ page }) => {
  await page.goto('/en/customers')
  await page
    .locator('main')
    .getByRole('link', { name: /Growing online brands/ })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Growing online brands')
  await page.getByRole('link', { name: 'Discuss your garment programme' }).first().click()
  await expect(page.getByLabel('Your business type (optional)')).toHaveValue('online')
  await expect(page.getByLabel('Service of interest (optional)')).toHaveValue('supply')
})

test('production steps and buyer questions work with a keyboard and preserve service context', async ({
  page,
}) => {
  await page.goto('/de')
  const stages = page.locator('.journey-stage')
  await expect(stages).toHaveCount(7)
  await stages.nth(3).locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(stages.nth(3)).toHaveAttribute('open', '')
  await expect(page.locator('.journey-stage[open]')).toHaveCount(1)
  await expect(
    stages.nth(3).getByText('Musterreferenz, dokumentierte Kommentare und Freigabeumfang.'),
  ).toBeVisible()
  await stages.nth(3).getByRole('link', { name: 'Diesen Schritt besprechen' }).click()
  await expect(page.getByLabel('Gewünschte Leistung (optional)')).toHaveValue('development')
  await page.goto('/de#fragen')
  const faq = page.locator('.faq-item').filter({ hasText: 'Welche Mindestmengen sind möglich?' })
  await faq.locator('summary').click()
  await expect(faq.locator('p')).toContainText(
    'Eine pauschale Mindestmenge gilt nicht für alle Projekte.',
  )
  await page.goto('/en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your brand.')
  await expect(page.locator('link[hreflang="de"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/de',
  )
  await page
    .getByRole('navigation', { name: 'Main navigation', exact: true })
    .getByRole('link', { name: 'Process', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A shared reference. At every stage.',
  )
})

test('process and FAQ stay usable without JavaScript and with reduced motion', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://localhost:3000/en')
  await expect(page.locator('.hero-visual img')).toBeVisible()
  const quality = page.locator('.journey-stage').filter({ hasText: 'Quality & documentation' })
  await quality.locator('summary').click()
  await expect(quality.locator('.stage-content')).toBeVisible()
  const question = page
    .locator('.faq-item')
    .filter({ hasText: 'Do we buy garments or commission a service?' })
  await question.locator('summary').click()
  await expect(question.locator('p')).toContainText('Both routes are possible.')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  )
  await context.close()
})

test('all content routes and internal navigation targets resolve', async ({ request }) => {
  const paths = [
    '/de',
    '/en',
    '/de/wissen',
    '/de/materialien',
    '/de/journal',
    '/de/downloads',
    '/de/anfrage',
    '/de/nachbestellen',
    '/de/kontakt',
    '/de/impressum',
    '/de/datenschutz',
    '/de/suche',
    '/de/newsletter',
    '/en/contact',
    '/en/privacy',
    '/en/legal',
    ...seedContent.map((r) => `/${r.locale}/${r.slug}`),
  ]
  for (const path of paths) expect((await request.get(path)).status(), path).toBe(200)
  expect((await request.get('/de/not-a-real-page')).status()).toBe(404)
})

test('search and size worksheet are useful', async ({ page }) => {
  await page.goto('/de/suche?q=Logo')
  await expect(page.locator('.result-item').first()).toBeVisible()
  await page.getByLabel('Suchbegriff').fill('notarealwordxyz')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect(page.getByText('Noch keine passende Antwort?')).toBeVisible()
  await page.goto('/de/downloads/groessenliste')
  await page.getByLabel('Geplante Gesamtmenge').fill('100')
  await page.getByLabel('M', { exact: true }).fill('60')
  await expect(page.getByRole('button', { name: 'Größenliste herunterladen' })).toBeDisabled()
  await page.getByLabel('L', { exact: true }).fill('40')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Größenliste herunterladen' }).click()
  expect((await download).suggestedFilename()).toBe('texevo-groessenliste.csv')
})

test('guided mobile brief preserves inputs on errors and saves a real test receipt', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/kunden/modemarken')
  await page.getByRole('link', { name: 'Bekleidungsbedarf besprechen' }).first().click()
  await expect(page.getByLabel('Ihr Unternehmenstyp (optional)')).toHaveValue('fashion')
  await expect(page.getByLabel('Gewünschte Leistung (optional)')).toHaveValue('supply')
  await page.getByRole('button', { name: 'Weiter', exact: true }).click()
  await page.getByRole('button', { name: 'Weiter', exact: true }).click()
  await expect(page.locator('.notice[role=alert]')).toBeVisible()
  await page
    .getByLabel('Ihr Vorhaben und offene Fragen')
    .fill('Wir testen eine Anfrage für 100 Poloshirts mit Logo.')
  await page.getByRole('button', { name: 'Weiter', exact: true }).click()
  await page.getByLabel('Unternehmen', { exact: true }).fill('TEXEVO Browser Test')
  await page.getByLabel('Kontaktperson', { exact: true }).fill('Test Person')
  await page.getByLabel('E-Mail', { exact: true }).fill('browser@example.test')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Weiter', exact: true }).click()
  await expect(
    page
      .locator('.review-list dd')
      .filter({ hasText: 'Wir testen eine Anfrage für 100 Poloshirts mit Logo.' }),
  ).toBeVisible()
  await page.screenshot({ path: 'test-results/brief-390.png', fullPage: true })
  await page.route('**/api/enquiries', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Test: vorübergehend nicht erreichbar.' }),
    }),
  )
  await page.getByRole('button', { name: 'Testanfrage senden', exact: true }).click()
  await expect(page.locator('.notice[role=alert]')).toContainText('vorübergehend')
  await expect(
    page
      .locator('.review-list dd')
      .filter({ hasText: 'Wir testen eine Anfrage für 100 Poloshirts mit Logo.' }),
  ).toBeVisible()
  await page.unroute('**/api/enquiries')
  const savedRequest = page.waitForRequest(
    (request) => request.url().endsWith('/api/enquiries') && request.method() === 'POST',
  )
  await page.getByRole('button', { name: 'Testanfrage senden', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Danke. Ihr Briefing ist angekommen.' }),
  ).toBeVisible()
  await expect(page.locator('.receipt-code')).toHaveText(/TX-\d{4}-[A-F0-9]{8}/)
  expect((await savedRequest).postDataJSON()).toMatchObject({
    audience: 'fashion',
    service: 'supply',
    category: 'production',
  })
})

test('idempotency, CSRF, private files and quarantine are enforced', async ({ request }) => {
  const data = {
    idempotencyKey: randomUUID(),
    locale: 'de',
    category: 'team',
    company: 'API Test',
    name: 'Test Person',
    email: 'api@example.test',
    description: 'A test request for one hundred polos',
    privacy: true,
  }
  expect((await request.post('/api/enquiries', { data })).status()).toBe(403)
  const headers = { origin: 'http://localhost:3000' }
  const [first, duplicate] = await Promise.all([
    request.post('/api/enquiries', { data, headers }),
    request.post('/api/enquiries', { data, headers }),
  ])
  expect(first.status()).toBe(201)
  expect(duplicate.status()).toBe(201)
  const a = await first.json()
  const b = await duplicate.json()
  expect(a.reference).toBe(b.reference)
  expect(
    (
      await request.post('/api/enquiries', {
        data: { ...data, description: 'A different request attempting to reuse the key' },
        headers,
      })
    ).status(),
  ).toBe(409)
  const uploadURL = `/api/enquiries/${a.id}/files?slot=0`
  expect((await request.post(uploadURL, { data: '%PDF-1.7\nTest', headers })).status()).toBe(403)
  const auth = { ...headers, authorization: `Bearer ${a.uploadToken}`, 'x-file-name': 'logo.svg' }
  expect((await request.post(uploadURL, { data: '<svg/>', headers: auth })).status()).toBe(415)
  expect(
    (
      await request.post(uploadURL, {
        data: '%PDF-1.7\nTest fixture',
        headers: { ...auth, 'x-file-name': 'reference.pdf' },
      })
    ).status(),
  ).toBe(201)
  expect((await request.get(`/api/staff/files/${a.id}`)).status()).toBe(401)
  expect((await request.get('/cms-api/content?draft=true')).status()).toBe(401)
  expect((await request.get('/de/private-label?preview=1')).status()).toBe(401)
  expect(
    (
      await request.post('/api/newsletter', {
        data: { email: 'test@example.test', consent: true },
        headers,
      })
    ).status(),
  ).toBe(503)
})

test('short enquiry works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(
    'http://localhost:3000/de/kontakt?category=sourcing&audience=wholesale&service=office',
  )
  await expect(page.getByLabel('Ihr Unternehmenstyp (optional)')).toHaveValue('wholesale')
  await expect(page.getByLabel('Gewünschte Leistung (optional)')).toHaveValue('office')
  await page
    .getByLabel('Ihr Vorhaben und offene Fragen')
    .fill('Test des Formulars ohne JavaScript.')
  await page.getByLabel('Unternehmen', { exact: true }).fill('No JS Test')
  await page.getByLabel('Kontaktperson', { exact: true }).fill('Test Person')
  await page.getByLabel('E-Mail', { exact: true }).fill('nojs@example.test')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Testanfrage senden', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ihre Anfrage ist gespeichert.')
  await context.close()
})

test('representative pages have no serious accessibility violations', async ({ page }) => {
  for (const path of [
    '/de',
    '/de/anfrage',
    '/de/wissen/100-poloshirts',
    '/de/downloads/groessenliste',
    '/en/contact',
    '/en',
    '/en/process',
    '/de/kunden',
    '/de/leistungen',
    '/de/kunden/importeure-grosshandel',
  ]) {
    await page.goto(path)
    const report = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
      path,
    ).toEqual([])
  }
})
