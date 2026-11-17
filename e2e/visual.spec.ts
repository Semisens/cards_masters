import { expect, test } from '@playwright/test'

// Remplace les « golden tests » : captures de la page de visite du design system à 390 × 844.
// Première exécution ou changement voulu : `npm run test:visual -- --update-snapshots`, puis relire les images.
test.describe('design system', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/design-system')
    await expect(page.getByTestId('design-system')).toBeVisible()
    // Les captures dépendent des polices : on attend qu'elles soient chargées.
    await page.evaluate(async () => {
      await Promise.all([document.fonts.load('700 16px Fredoka'), document.fonts.load('600 16px Nunito')])
      await document.fonts.ready
    })
  })

  test('boutons', async ({ page }) => {
    await expect(page.locator('section[aria-labelledby="ds-buttons"]')).toHaveScreenshot('boutons.png')
  })

  test('cartes', async ({ page }) => {
    await expect(page.locator('section[aria-labelledby="ds-cards"]')).toHaveScreenshot('cartes.png')
  })

  test('jetons', async ({ page }) => {
    await expect(page.locator('section[aria-labelledby="ds-chips"]')).toHaveScreenshot('jetons.png')
  })

  test('page complète', async ({ page }) => {
    await expect(page).toHaveScreenshot('design-system.png', { fullPage: true })
  })

  test("le bouton pressé s'enfonce de la hauteur du relief", async ({ page }) => {
    const button = page.getByRole('button', { name: 'Jouer' })
    const rest = (await button.boundingBox())!
    await button.hover()
    await page.mouse.down()
    // La transition dure 80 ms.
    await page.waitForTimeout(200)
    const pressed = (await button.boundingBox())!
    await page.mouse.up()
    expect(pressed.y - rest.y).toBeGreaterThan(4)
  })

  test('toutes les cibles tactiles font au moins 44 px', async ({ page }) => {
    const buttons = page.getByRole('button')
    for (let i = 0; i < (await buttons.count()); i++) {
      const box = (await buttons.nth(i).boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeGreaterThanOrEqual(44)
    }
  })

  test('aucun texte sous 16 px', async ({ page }) => {
    const tooSmall = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of document.querySelectorAll<HTMLElement>('main *')) {
        const own = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
        if (own && parseFloat(getComputedStyle(el).fontSize) < 16) bad.push(el.tagName)
      }
      return bad
    })
    // Le rang des cartes et la valeur des jetons sont des éléments graphiques à taille proportionnelle à l'objet.
    expect(tooSmall).toEqual([])
  })
})
