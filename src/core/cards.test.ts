import { describe, expect, it } from 'vitest'
import { cardLabel, isRedSuit, rankLetter, RANKS, SUITS } from './cards.ts'

describe('cardLabel', () => {
  it('donne un libellé français lisible', () => {
    expect(cardLabel('K', 'hearts')).toBe('Roi de cœur')
    expect(cardLabel('A', 'spades')).toBe('As de pique')
    expect(cardLabel('10', 'clubs')).toBe('10 de trèfle')
    expect(cardLabel('J', 'diamonds')).toBe('Valet de carreau')
    expect(cardLabel('Q', 'hearts')).toBe('Dame de cœur')
  })

  it('est unique pour les 52 cartes', () => {
    const labels = RANKS.flatMap((r) => SUITS.map((s) => cardLabel(r, s)))
    expect(new Set(labels).size).toBe(52)
  })
})

describe('isRedSuit', () => {
  it('cœur et carreau sont rouges, pique et trèfle noirs', () => {
    expect(SUITS.filter(isRedSuit)).toEqual(['hearts', 'diamonds'])
  })
})

describe('rankLetter', () => {
  it('écrit les figures à la française : V, D, R', () => {
    expect(rankLetter('J')).toBe('V')
    expect(rankLetter('Q')).toBe('D')
    expect(rankLetter('K')).toBe('R')
  })

  it('laisse As et valeurs numériques inchangés', () => {
    expect(rankLetter('A')).toBe('A')
    expect(rankLetter('10')).toBe('10')
    expect(rankLetter('7')).toBe('7')
  })
})
