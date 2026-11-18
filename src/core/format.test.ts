import { describe, expect, it } from 'vitest'
import { fill } from './format.ts'

describe('fill', () => {
  it('remplace les champs connus', () => {
    expect(fill('Manche {round}', { round: 3 })).toBe('Manche 3')
    expect(fill('{a} et {b}', { a: 'x', b: 2 })).toBe('x et 2')
  })

  it('laisse un champ inconnu tel quel', () => {
    expect(fill('Manche {tour}', { round: 3 })).toBe('Manche {tour}')
  })

  it('ne change pas un texte sans champ', () => {
    expect(fill('Trios gagnés', { round: 3 })).toBe('Trios gagnés')
  })
})
