// @vitest-environment node
// Sharp tourne dans Node : sous jsdom, ses tampons ne sont pas reconnus.
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { cutCard, cutSheet, findCards, loadPixels, type Pixels } from './decouper-planche.ts'

const WIDTH = 400
const HEIGHT = 300
const WHITE: [number, number, number] = [254, 254, 254]

/** Une planche de 3 colonnes sur 2 rangées : des cartes colorées, bordure noire, un chiffre blanc au centre. */
function sheet(): Pixels {
  const data = new Uint8Array(WIDTH * HEIGHT * 4)
  const put = (x: number, y: number, [r, g, b]: [number, number, number]) =>
    data.set([r, g, b, 255], (y * WIDTH + x) * 4)
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) put(x, y, WHITE)
  const colors: Array<[number, number, number]> = [
    [200, 30, 30],
    [30, 160, 60],
    [30, 90, 200],
    [220, 160, 20],
    [140, 40, 160],
    [20, 150, 150],
  ]
  colors.forEach((color, index) => {
    const left = 20 + (index % 3) * 125
    const top = 15 + Math.floor(index / 3) * 140
    for (let y = 0; y < 120; y++)
      for (let x = 0; x < 100; x++) {
        const border = x < 4 || x >= 96 || y < 4 || y >= 116
        // coins arrondis : on retire un carré de 6 px à chaque coin
        const corner = (x < 6 || x >= 94) && (y < 6 || y >= 114)
        if (corner) continue
        put(left + x, top + y, border ? [0, 0, 0] : color)
      }
    // le « chiffre » : un carré blanc enfermé par la bordure
    for (let y = 50; y < 70; y++) for (let x = 40; x < 60; x++) put(left + x, top + y, [255, 255, 255])
  })
  return { data, width: WIDTH, height: HEIGHT }
}

describe('findCards', () => {
  it('repère six cartes dans l’ordre de lecture', () => {
    const boxes = findCards(sheet())
    expect(boxes).toHaveLength(6)
    expect(boxes.map((b) => [b.x, b.y])).toEqual([
      [20, 15],
      [145, 15],
      [270, 15],
      [20, 155],
      [145, 155],
      [270, 155],
    ])
  })

  it('donne à chaque carte sa taille exacte, sans marge blanche', () => {
    for (const box of findCards(sheet())) expect([box.width, box.height]).toEqual([100, 120])
  })

  it('ne repère rien sur une planche blanche', () => {
    const data = new Uint8Array(100 * 100 * 4).fill(255)
    expect(findCards({ data, width: 100, height: 100 })).toEqual([])
  })
})

describe('cutCard', () => {
  const pixels = sheet()
  const [first] = findCards(pixels)
  const card = cutCard(pixels, first)
  const alpha = (x: number, y: number) => card.data[(y * card.width + x) * 4 + 3]
  const rgb = (x: number, y: number) => [...card.data.subarray((y * card.width + x) * 4, (y * card.width + x) * 4 + 3)]

  it('garde la taille de la carte', () => {
    expect([card.width, card.height]).toEqual([100, 120])
  })

  it('rend transparents les coins arrondis, qui étaient du fond', () => {
    expect(alpha(0, 0)).toBe(0)
    expect(alpha(99, 0)).toBe(0)
    expect(alpha(0, 119)).toBe(0)
    expect(alpha(99, 119)).toBe(0)
  })

  it('garde opaques la bordure, le fond coloré et le chiffre blanc enfermé', () => {
    expect(alpha(10, 0 + 3)).toBe(255)
    expect(rgb(10, 3)).toEqual([0, 0, 0])
    expect(rgb(20, 30)).toEqual([200, 30, 30])
    expect(alpha(50, 60)).toBe(255)
    expect(rgb(50, 60)).toEqual([255, 255, 255])
  })
})

describe('cutSheet', () => {
  let dir = ''
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'planche-'))
  })
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  it('écrit une image webp par carte, numérotée, avec transparence', async () => {
    const source = join(dir, 'planche.png')
    const { data, width, height } = sheet()
    await sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
      .png()
      .toFile(source)
    const files = await cutSheet(source, join(dir, 'sortie'), 'carte', 6)
    expect(files.map((f) => f.split('/').pop())).toEqual([
      'carte-01.webp',
      'carte-02.webp',
      'carte-03.webp',
      'carte-04.webp',
      'carte-05.webp',
      'carte-06.webp',
    ])
    const meta = await sharp(files[0]).metadata()
    expect([meta.format, meta.width, meta.height, meta.hasAlpha]).toEqual(['webp', 100, 120, true])
    const written = await loadPixels(files[0])
    expect(written.data[3]).toBe(0)
  })

  it('refuse une planche qui n’a pas le nombre de cartes attendu', async () => {
    await expect(cutSheet(join(dir, 'planche.png'), join(dir, 'x'), 'carte', 12)).rejects.toThrow(
      /6 carte\(s\) trouvée/,
    )
  })
})
