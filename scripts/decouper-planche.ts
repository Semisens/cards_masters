// Découpe une planche de cartes (une image avec plusieurs cartes sur fond blanc) en une image par carte.
//
// Usage : npm run planche -- <planche.png> <dossier-du-jeu> <préfixe> [--cartes N]
//   ex. : npm run planche -- build_ressources/MasterCards/Trio/planche_trio_1.png src/content/games/trio carte
//   donne src/content/games/trio/carte-01.webp, carte-02.webp… dans l'ordre de lecture (de gauche à droite, de haut en bas).
//
// Les cartes sont repérées seules : les bandes de fond blanc séparent les rangées, puis les cartes d'une rangée.
// Le fond autour de chaque carte devient transparent (coins arrondis propres) ; les chiffres blancs à l'intérieur,
// enfermés par la bordure, restent intacts. Chaque carte est écrite en webp, à sa taille d'origine.
import { mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

/** Une carte sur la planche, en pixels : coin haut gauche, largeur, hauteur. */
export interface Box {
  x: number
  y: number
  width: number
  height: number
}

/** Pixels bruts RGBA d'une image. */
export interface Pixels {
  data: Uint8Array
  width: number
  height: number
}

/** Somme R + G + B au-dessous de laquelle un pixel compte comme « de l'encre » : le fond blanc fait 760 à 765. */
const INK_BELOW = 735
/** Somme R + G + B au-dessus de laquelle un pixel du bord compte comme du fond, à rendre transparent. */
const BACKGROUND_ABOVE = 700
/** Une colonne ou une rangée est « vide » si elle a trois pixels d'encre ou moins (grain, ombres légères). */
const MAX_NOISE = 3
/** Une carte fait au moins 30 px dans les deux sens : on ignore les poussières. */
const MIN_SIZE = 30
export const WEBP_QUALITY = 85

const isInk = ({ data, width }: Pixels, x: number, y: number): boolean => {
  const i = (y * width + x) * 4
  return data[i] + data[i + 1] + data[i + 2] < INK_BELOW
}

/** Les plages consécutives de `true` qui font au moins `MIN_SIZE`, en [début, fin exclue]. */
function runs(filled: boolean[]): Array<[number, number]> {
  const out: Array<[number, number]> = []
  let start = -1
  filled.forEach((value, i) => {
    if (value && start < 0) start = i
    if (!value && start >= 0) {
      if (i - start >= MIN_SIZE) out.push([start, i])
      start = -1
    }
  })
  if (start >= 0 && filled.length - start >= MIN_SIZE) out.push([start, filled.length])
  return out
}

/** Rétrécit une boîte à l'encre qu'elle contient : la carte sans marge blanche. */
function tighten(pixels: Pixels, box: Box): Box {
  let minX = box.x + box.width
  let maxX = box.x
  let minY = box.y + box.height
  let maxY = box.y
  for (let y = box.y; y < box.y + box.height; y++)
    for (let x = box.x; x < box.x + box.width; x++)
      if (isInk(pixels, x, y)) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/** Repère les cartes d'une planche, dans l'ordre de lecture. */
export function findCards(pixels: Pixels): Box[] {
  const { width, height } = pixels
  const rowInk = Array.from({ length: height }, (_, y) => {
    let n = 0
    for (let x = 0; x < width; x++) if (isInk(pixels, x, y)) n++
    return n > MAX_NOISE
  })
  const boxes: Box[] = []
  for (const [top, bottom] of runs(rowInk)) {
    const columnInk = Array.from({ length: width }, (_, x) => {
      let n = 0
      for (let y = top; y < bottom; y++) if (isInk(pixels, x, y)) n++
      return n > MAX_NOISE
    })
    for (const [left, right] of runs(columnInk))
      boxes.push(tighten(pixels, { x: left, y: top, width: right - left, height: bottom - top }))
  }
  return boxes
}

/**
 * Découpe une carte et rend transparent le fond autour d'elle : remplissage depuis les bords de la découpe sur les
 * pixels clairs, qui s'arrête à la bordure sombre de la carte.
 */
export function cutCard(pixels: Pixels, box: Box): Pixels {
  const { width, height } = box
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const from = ((box.y + y) * pixels.width + box.x + x) * 4
      data.set(pixels.data.subarray(from, from + 4), (y * width + x) * 4)
    }
  const isBackground = (i: number) => data[i] + data[i + 1] + data[i + 2] > BACKGROUND_ABOVE
  const seen = new Uint8Array(width * height)
  const queue: number[] = []
  const visit = (x: number, y: number) => {
    const at = y * width + x
    if (seen[at] || !isBackground(at * 4)) return
    seen[at] = 1
    queue.push(at)
  }
  for (let x = 0; x < width; x++) {
    visit(x, 0)
    visit(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    visit(0, y)
    visit(width - 1, y)
  }
  for (let head = 0; head < queue.length; head++) {
    const at = queue[head]
    const x = at % width
    const y = (at - x) / width
    data[at * 4 + 3] = 0
    if (x > 0) visit(x - 1, y)
    if (x < width - 1) visit(x + 1, y)
    if (y > 0) visit(x, y - 1)
    if (y < height - 1) visit(x, y + 1)
  }
  return { data, width, height }
}

/** Charge une image en pixels RGBA. */
export async function loadPixels(file: string): Promise<Pixels> {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data: new Uint8Array(data), width: info.width, height: info.height }
}

/** Écrit des pixels RGBA en webp (avec transparence). */
export async function saveWebp({ data, width, height }: Pixels, file: string): Promise<void> {
  await sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .webp({ quality: WEBP_QUALITY, alphaQuality: 100 })
    .toFile(file)
}

/** Découpe la planche `sheet` : une carte par fichier `<prefix>-NN.webp` dans `outDir`. Rend les fichiers écrits. */
export async function cutSheet(sheet: string, outDir: string, prefix: string, expected?: number): Promise<string[]> {
  const pixels = await loadPixels(sheet)
  const boxes = findCards(pixels)
  if (expected !== undefined && boxes.length !== expected)
    throw new Error(`${boxes.length} carte(s) trouvée(s) sur la planche, ${expected} attendue(s).`)
  mkdirSync(outDir, { recursive: true })
  const files: string[] = []
  for (const [index, box] of boxes.entries()) {
    const file = join(outDir, `${prefix}-${String(index + 1).padStart(2, '0')}.webp`)
    await saveWebp(cutCard(pixels, box), file)
    console.log(`${file} : ${box.width} x ${box.height} (planche : ${box.x}, ${box.y})`)
    files.push(file)
  }
  return files
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const option = args.indexOf('--cartes')
  const expected = option >= 0 ? Number(args.splice(option, 2)[1]) : undefined
  const [sheet, outDir, prefix] = args
  if (!sheet || !outDir || !prefix) {
    console.error('Usage : npm run planche -- <planche.png> <dossier-du-jeu> <préfixe> [--cartes N]')
    process.exit(1)
  }
  await cutSheet(sheet, outDir, prefix, expected)
}
