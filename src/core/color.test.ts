import { describe, expect, it } from 'vitest'
import { mix, parseHex, rgba, shadowOf, toHex } from './color.ts'

describe('couleurs', () => {
  it('lit et écrit un hexadécimal', () => {
    expect(parseHex('#187A33')).toEqual([24, 122, 51])
    expect(toHex([24, 122, 51])).toBe('#187A33')
    expect(() => parseHex('vert')).toThrow()
  })

  it('mélange deux couleurs', () => {
    expect(mix('#FFFFFF', '#000000', 0.5)).toBe('#808080')
    expect(mix('#FF0000', '#0000FF', 1)).toBe('#FF0000')
  })

  it('écrit un rgba', () => {
    expect(rgba('#FFFFFF', 0.6)).toBe('rgba(255, 255, 255, 0.6)')
  })
})

describe('shadowOf', () => {
  it('assombrit la couleur sans changer sa teinte (le vert reste vert)', () => {
    const [r, g, b] = parseHex(shadowOf('#187A33'))
    expect(g).toBeGreaterThan(r)
    expect(g).toBeGreaterThan(b)
    expect(g).toBeLessThan(122)
  })

  it('reste proche de l’ombre du tapis vert relevée dans la maquette (#0F4F20)', () => {
    const [r, g, b] = parseHex(shadowOf('#187A33'))
    const [er, eg, eb] = parseHex('#0F4F20')
    for (const [got, want] of [
      [r, er],
      [g, eg],
      [b, eb],
    ])
      expect(Math.abs(got - want)).toBeLessThanOrEqual(2)
  })
})
