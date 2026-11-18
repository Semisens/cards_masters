import { expect, test } from '@playwright/test'

test.describe('PWA (build de production)', () => {
  test('expose un manifeste installable', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(href).toBeTruthy()

    const manifest = await (await request.get(new URL(href!, page.url()).toString())).json()
    expect(manifest.name).toBe('MasterCards')
    expect(manifest.display).toBe('standalone')
    expect(manifest.orientation).toBe('portrait')
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes)
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true)

    // Chaque icône déclarée existe vraiment.
    for (const icon of manifest.icons) {
      const res = await request.get(new URL(icon.src, page.url()).toString())
      expect(res.status(), icon.src).toBe(200)
    }
  })

  test('déclare la couleur de thème et la zone sûre', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', /^#[0-9A-Fa-f]{6}$/)
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })

  test('fonctionne entièrement hors ligne', async ({ page, context }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Tes jeux' })).toBeVisible()

    // Attend que le service worker soit actif et qu'il contrôle la page.
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
    })
    await page.reload()
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)

    await context.setOffline(true)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Tes jeux' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Trio/ })).toBeVisible()

    // Les polices embarquées sont bien servies depuis le cache.
    const fontsReady = await page.evaluate(async () => {
      await document.fonts.ready
      return document.fonts.check('700 16px Fredoka')
    })
    expect(fontsReady).toBe(true)

    // Une route inconnue retombe sur l'app (navigateFallback) au lieu d'une erreur réseau.
    await page.goto('/une/route/inconnue')
    await expect(page.locator('#root')).toBeAttached()
  })

  test('la page de visite du design system est absente de la production', async ({ page }) => {
    await page.goto('/dev/design-system')
    await expect(page.getByTestId('design-system')).toHaveCount(0)
  })
})
