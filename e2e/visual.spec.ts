import { expect, test, type Page } from '@playwright/test'

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

// Écrans sans maquette (accueil, « Qui joue ? », À propos, erreur) : captures de non-régression à la taille de l'écran.
// Les écrans qui ont une maquette sont comparés à elle dans e2e/maquettes.spec.ts.
const ready = async (page: Page) => {
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('700 16px Fredoka'),
      document.fonts.load('600 32px Fredoka'),
      document.fonts.load('700 16px Nunito'),
      document.fonts.load('800 16px Nunito'),
    ])
    await document.fonts.ready
  })
}

const player = (name: string, trios = 0) => ({ name, trios })
const PARTY_3 = { players: [player('Léa', 2), player('Tom', 1), player('Inès')] }
const PARTY_6 = {
  players: [player('Léa', 2), player('Tom', 1), player('Inès'), player('Sacha'), player('Maé'), player('Noé', 3)],
}

test.describe('écrans sans maquette', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear())
  })

  test('accueil, premier lancement', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Bienvenue !')).toBeVisible()
    await ready(page)
    await expect(page).toHaveScreenshot('accueil-premier-lancement.png')
  })

  test('accueil', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'C’est compris' }).click()
    await expect(page.getByText('Bienvenue !')).toHaveCount(0)
    await ready(page)
    await expect(page).toHaveScreenshot('accueil.png')
  })

  test('qui joue ?', async ({ page }) => {
    await page.goto('/jeu/trio/joueurs')
    await expect(page.getByRole('heading', { name: 'Qui joue ?' })).toBeVisible()
    await ready(page)
    await expect(page).toHaveScreenshot('qui-joue.png')
  })

  test('partie en cours à six joueurs', async ({ page }) => {
    await page.addInitScript(
      (party) => window.localStorage.setItem('mastercards:session:trio', JSON.stringify(party)),
      PARTY_6,
    )
    await page.goto('/jeu/trio/partie')
    await expect(page.getByRole('heading', { name: 'Partie en cours' })).toBeVisible()
    await ready(page)
    await expect(page).toHaveScreenshot('partie-six-joueurs.png')
  })

  test('à propos', async ({ page }) => {
    await page.goto('/a-propos')
    await expect(page.getByRole('heading', { name: 'Application non officielle' })).toBeVisible()
    await ready(page)
    await expect(page).toHaveScreenshot('a-propos.png')
  })

  test('jeu introuvable', async ({ page }) => {
    await page.goto('/jeu/nexiste-pas')
    await expect(page.getByText('Ce jeu n’existe pas ou n’est plus disponible.')).toBeVisible()
    await ready(page)
    await expect(page).toHaveScreenshot('introuvable.png')
  })
})

// « Chaque écran doit tenir sans défilement vertical » : vérifié sur tous les écrans, à la base du cahier des charges
// (390 x 844) et au Pixel 8a (393 x 852).
interface Screen {
  name: string
  url: string
  mode?: 'classic' | 'expert'
  party?: typeof PARTY_3
}

const SCREENS: Screen[] = [
  { name: 'accueil', url: '/' },
  { name: 'le jeu', url: '/jeu/trio' },
  { name: 'règles complètes', url: '/jeu/trio/regles' },
  { name: 'cartes, classique', url: '/jeu/trio/tutoriel/cartes', mode: 'classic' },
  { name: 'cartes, connaisseur', url: '/jeu/trio/tutoriel/cartes', mode: 'expert' },
  ...[1, 2, 3, 4, 5, 6].flatMap((n): Screen[] => [
    { name: `groupe ${n}, classique`, url: `/jeu/trio/tutoriel/cartes/${n}`, mode: 'classic' },
    { name: `groupe ${n}, connaisseur`, url: `/jeu/trio/tutoriel/cartes/${n}`, mode: 'expert' },
  ]),
  { name: 'mise en place', url: '/jeu/trio/tutoriel/mise-en-place' },
  { name: 'un tour', url: '/jeu/trio/tutoriel/tour' },
  { name: 'qui joue ?', url: '/jeu/trio/joueurs' },
  { name: 'partie, 3 joueurs', url: '/jeu/trio/partie', party: PARTY_3 },
  { name: 'partie, 6 joueurs', url: '/jeu/trio/partie', party: PARTY_6 },
  { name: 'scores, 3 joueurs', url: '/jeu/trio/partie/scores', party: PARTY_3 },
  { name: 'scores, 6 joueurs', url: '/jeu/trio/partie/scores', party: PARTY_6 },
  { name: 'à propos', url: '/a-propos' },
]

test.describe('aucun défilement vertical', () => {
  for (const size of [
    { width: 390, height: 844 },
    { width: 393, height: 852 },
  ]) {
    test.describe(`${size.width} x ${size.height}`, () => {
      test.use({ viewport: size })
      for (const screen of SCREENS) {
        test(screen.name, async ({ page }) => {
          await page.addInitScript(
            ({ mode, party }) => {
              window.localStorage.clear()
              window.localStorage.setItem('mastercards:welcomed', '1')
              if (mode) window.localStorage.setItem('mastercards:mode', mode)
              if (party) window.localStorage.setItem('mastercards:session:trio', JSON.stringify(party))
            },
            { mode: screen.mode, party: screen.party },
          )
          await page.goto(screen.url)
          await ready(page)
          const overflow = await page.evaluate(
            () => document.documentElement.scrollHeight - document.documentElement.clientHeight,
          )
          expect(overflow, `dépasse de ${overflow}px`).toBeLessThanOrEqual(0)
        })
      }
    })
  }
})
