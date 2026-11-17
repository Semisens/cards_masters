import { expect, test, type Page } from '@playwright/test'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

// Fidélité aux maquettes : chaque écran de l'app est comparé, pixel par pixel, à l'image de sa maquette
// (maquettes/trio/*.png, produites par `npm run maquettes`). Les images d'écart sont écrites dans
// test-results/maquettes/ (rouge = pixels différents) : on peut les regarder même quand le test passe.

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface Screen {
  /** Nom du fichier de la maquette, sans extension. */
  name: string
  url: string
  /** Part maximale de pixels différents (0 à 1). */
  max: number
  /** Zones ignorées (en pixels CSS, base 390 x 844) : écarts voulus et expliqués. */
  masks?: Rect[]
  /** Pourquoi ces zones sont ignorées. */
  why?: string
  mode?: 'classic' | 'expert'
  /** Partie en cours à charger dans l'app. */
  party?: { players: Array<{ name: string; trios: number }> }
}

// États de l'app qui correspondent à ce que montre chaque maquette (elles ne montrent pas les mêmes scores).
const PARTY = {
  players: [
    { name: 'Léa', trios: 2 },
    { name: 'Tom', trios: 1 },
    { name: 'Inès', trios: 0 },
  ],
}
const SCORES = {
  players: [
    { name: 'Léa', trios: 1 },
    { name: 'Tom', trios: 0 },
    { name: 'Inès', trios: 0 },
  ],
}

// Écarts voulus, tous expliqués. Tout le reste doit correspondre à la maquette.
/** Texte du « Mode piquant » : la maquette contient un « [À détailler] » qu'on ne peut pas publier. */
const PIQUANT_TEXT: Rect = { x: 24, y: 700, w: 342, h: 115 }
/** Boutons « − » d'un score à zéro : désactivés dans l'app (on ne descend pas sous 0), actifs dans la maquette. */
const MINUS_AT_ZERO: Rect[] = [
  { x: 204, y: 288, w: 48, h: 48 },
  { x: 204, y: 350, w: 48, h: 48 },
]

const SCREENS: Screen[] = [
  { name: '01-game-detail', url: '/jeu/trio', max: 0.005 },
  { name: '02-cartes-classique', url: '/jeu/trio/tutoriel/cartes', mode: 'classic', max: 0.005 },
  { name: '03-cartes-connaisseur', url: '/jeu/trio/tutoriel/cartes', mode: 'expert', max: 0.005 },
  { name: '04-carte-swipe', url: '/jeu/trio/tutoriel/cartes/3', mode: 'expert', max: 0.01 },
  { name: '05-mise-en-place', url: '/jeu/trio/tutoriel/mise-en-place', max: 0.005 },
  { name: '06-un-tour', url: '/jeu/trio/tutoriel/tour', max: 0.01 },
  { name: '07-regles-completes', url: '/jeu/trio/regles', masks: [PIQUANT_TEXT], max: 0.01 },
  { name: '08-partie', url: '/jeu/trio/partie', party: PARTY, max: 0.005 },
  { name: '09-scores', url: '/jeu/trio/partie/scores', party: SCORES, masks: MINUS_AT_ZERO, max: 0.01 },
]

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

const SCALE = 2

function blank(png: PNG, rect: Rect) {
  for (let y = Math.round(rect.y * SCALE); y < Math.round((rect.y + rect.h) * SCALE); y++) {
    for (let x = Math.round(rect.x * SCALE); x < Math.round((rect.x + rect.w) * SCALE); x++) {
      const i = (y * png.width + x) * 4
      png.data[i] = png.data[i + 1] = png.data[i + 2] = 0
      png.data[i + 3] = 255
    }
  }
}

test.describe('fidélité aux maquettes', () => {
  for (const screen of SCREENS) {
    test(screen.name, async ({ page }, testInfo) => {
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
      await page.waitForTimeout(150)

      const actual = PNG.sync.read(await page.screenshot())
      const expected = PNG.sync.read(readFileSync(`maquettes/trio/${screen.name}.png`))
      expect([actual.width, actual.height], 'même taille que la maquette').toEqual([expected.width, expected.height])

      for (const mask of screen.masks ?? []) {
        blank(actual, mask)
        blank(expected, mask)
      }

      const diff = new PNG({ width: expected.width, height: expected.height })
      const different = pixelmatch(expected.data, actual.data, diff.data, expected.width, expected.height, {
        threshold: 0.1,
        includeAA: false,
      })
      const ratio = different / (expected.width * expected.height)

      mkdirSync('test-results/maquettes', { recursive: true })
      writeFileSync(`test-results/maquettes/${screen.name}-diff.png`, PNG.sync.write(diff))
      writeFileSync(
        `test-results/maquettes/${screen.name}-app.png`,
        PNG.sync.write(PNG.sync.read(await page.screenshot())),
      )
      testInfo.annotations.push({ type: 'écart', description: `${(ratio * 100).toFixed(2)} % des pixels` })
      console.log(`${screen.name}: ${(ratio * 100).toFixed(2)} % de pixels différents`)

      expect(
        ratio,
        `${(ratio * 100).toFixed(2)} % de pixels différents (maximum ${screen.max * 100} %)`,
      ).toBeLessThanOrEqual(screen.max)
    })
  }
})
