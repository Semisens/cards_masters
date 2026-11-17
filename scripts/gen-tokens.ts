// Génère les tokens de design depuis charte/mastercards-charte.json.
// Sorties (ne jamais éditer à la main) :
//   - src/styles/tokens.generated.css  : variables CSS --mc-*
//   - src/core/tokens.generated.ts     : mêmes valeurs côté TypeScript
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rgba, shadowOf } from '../src/core/color.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const charte = JSON.parse(readFileSync(resolve(root, 'charte/mastercards-charte.json'), 'utf8'))

const kebab = (s: string) => s.replace(/_/g, '-')
const PX_PER_REM = 16
const rem = (px: number) => `${px / PX_PER_REM}rem`

type Entry = [name: string, value: string]
const css: Entry[] = []
const add = (name: string, value: string | number) => css.push([`--mc-${name}`, String(value)])

// Couleurs
for (const [k, v] of Object.entries<string>(charte.colors)) {
  if (Array.isArray(v)) continue
  add(`color-${kebab(k)}`, v)
}
add('color-ciel-from', charte.colors.ciel_degrade[0])
add('color-ciel-to', charte.colors.ciel_degrade[1])

// Tapis et texte sur fond
for (const [k, v] of Object.entries<string>(charte.tapis_jeux)) add(`tapis-${kebab(k)}`, v)
for (const [k, v] of Object.entries<string>(charte.text_on)) add(`text-on-${kebab(k)}`, v)

// Rayons, élévations (px, ce sont des dimensions d'objet) et espacements (rem)
for (const [k, v] of Object.entries<number>(charte.radius)) add(`radius-${k}`, `${v}px`)
for (const [k, v] of Object.entries<number>(charte.elevation_px)) add(`elevation-${k}`, `${v}px`)
;(charte.spacing as number[]).forEach((v, i) => add(`space-${i + 1}`, rem(v)))

// Accessibilité et typographie
add('touch-min', `${charte.touch_min_px}px`)
add('text-min', rem(charte.fonts.texte_min_px))
add('font-title', "'Fredoka', system-ui, sans-serif")
add('font-text', "'Nunito', system-ui, sans-serif")
add('font-script', "'Great Vibes', cursive")

// Icônes
add('icon-stroke', charte.icons.stroke)
add('icon-color', charte.icons.color)

// Cartes
add('card-ratio', charte.card.ratio)
add('card-radius', `${charte.card.radius}px`)
add('card-face', charte.card.face)
add('card-red', charte.card.red)
add('card-black', charte.card.black)
add('card-symbol-ratio', charte.card.symbol_width_ratio)
add('card-symbol-ratio-list', charte.card.symbol_width_ratio_maquette)
add('card-ratio-list', charte.card.ratio_liste)
add('card-frame-list', `${charte.card.frame_px.liste}px`)
add('card-frame-focus', `${charte.card.frame_px.focus}px`)

// Jetons
add('chip-inner-border', `${charte.chip_jeton.inner_border_px}px`)
add('chip-stripe', `${charte.chip_jeton.stripe_deg}deg`)

// Teintes dérivées, calculées ici et non avec `color-mix()` en CSS (absent d'iOS avant 16.2, alors que l'app vise iOS 15).
const WHITE_STRIPE_ALPHA = 0.18 // motif en diagonale du dos de carte

add('color-cerise-ombre', shadowOf(charte.colors.cerise))
for (const [k, v] of Object.entries<string>(charte.tapis_ombres)) add(`tapis-${kebab(k)}-ombre`, v)
add('ghost-bg', charte.fantome.fond)
add('ghost-text', charte.fantome.texte)
add('veil', charte.voile.fond)
add('veil-shadow', charte.voile.ombre)
add('chip-inner-color', rgba(charte.colors.blanc_carte, charte.chip_jeton.inner_border_alpha))
add('card-back-stripe', rgba(charte.colors.blanc_carte, WHITE_STRIPE_ALPHA))

const banner = '/* Fichier généré par scripts/gen-tokens.ts depuis charte/mastercards-charte.json. Ne pas éditer. */'
const cssOut = `${banner}\n:root {\n${css.map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}\n`

const tsOut = `// Fichier généré par scripts/gen-tokens.ts depuis charte/mastercards-charte.json. Ne pas éditer.
export const tokens = ${JSON.stringify(
  {
    colors: charte.colors,
    tapis: charte.tapis_jeux,
    textOn: charte.text_on,
    tapisOmbres: charte.tapis_ombres,
    card: { ratio: charte.card.ratio, red: charte.card.red, black: charte.card.black, face: charte.card.face },
  },
  null,
  2,
)} as const

export type TapisName = ${Object.keys(charte.tapis_jeux)
  .map((k) => `'${k}'`)
  .join(' | ')}
`

for (const [file, content] of [
  ['src/styles/tokens.generated.css', cssOut],
  ['src/core/tokens.generated.ts', tsOut],
] as const) {
  const target = resolve(root, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}
console.log(`tokens: ${css.length} variables CSS générées`)
