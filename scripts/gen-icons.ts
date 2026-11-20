// Génère l'icône provisoire (carte blanche + cœur sur fond ciel) en SVG et PNG.
// Couleurs et symbole viennent de la charte et du composant PlayingCard : rien n'est dessiné à part.
// Usage : npm run icons
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { SUIT_PATHS, SYMBOL_VIEWBOX } from '../src/components/PlayingCard/symbols.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const charte = JSON.parse(readFileSync(resolve(root, 'charte/masterscards-charte.json'), 'utf8'))

const SIZE = 512
const CARD_W = 230
const CARD_H = CARD_W * charte.card.ratio
const SYMBOL = CARD_W * charte.card.symbol_width_ratio
const scale = SYMBOL / SYMBOL_VIEWBOX

function icon(cornerRadius: number): string {
  const [from, to] = charte.colors.ciel_degrade
  const cardX = (SIZE - CARD_W) / 2
  const cardY = (SIZE - CARD_H) / 2
  const symX = (SIZE - SYMBOL) / 2
  const symY = (SIZE - SYMBOL) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="${cornerRadius}" fill="url(#ciel)"/>
  <rect x="${cardX}" y="${(cardY + 10).toFixed(1)}" width="${CARD_W}" height="${CARD_H}" rx="${charte.card.radius * 2}" fill="${charte.colors.nuit}" opacity="0.55"/>
  <rect x="${cardX}" y="${cardY.toFixed(1)}" width="${CARD_W}" height="${CARD_H}" rx="${charte.card.radius * 2}" fill="${charte.card.face}"/>
  <g transform="translate(${symX} ${symY.toFixed(1)}) scale(${scale.toFixed(4)})">
    <path d="${SUIT_PATHS.hearts}" fill="${charte.card.red}" stroke="${charte.card.red}" stroke-width="6" stroke-linejoin="round"/>
  </g>
</svg>
`
}

const publicDir = resolve(root, 'public')
mkdirSync(resolve(publicDir, 'icons'), { recursive: true })

// Favicon : coins arrondis. Icônes d'app : plein cadre (le système applique son propre masque).
writeFileSync(resolve(publicDir, 'favicon.svg'), icon(96))
const full = Buffer.from(icon(0))

const outputs: Array<[file: string, size: number]> = [
  ['icons/icon-192.png', 192],
  ['icons/icon-512.png', 512],
  ['icons/icon-maskable-512.png', 512],
  ['icons/apple-touch-icon.png', 180],
]
for (const [file, size] of outputs) {
  await sharp(full).resize(size, size).png().toFile(resolve(publicDir, file))
}
console.log(`icônes : favicon.svg + ${outputs.length} PNG générés dans public/`)
