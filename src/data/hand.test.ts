import { describe, expect, it } from 'vitest'
import { handOf, pickHand } from './hand.ts'
import { toRank } from './deck.ts'
import { games } from './games.ts'
import { loadCardGroup } from './loadGame.ts'
import type { CardSpecConfig, DisplayCard } from './types.ts'

const group = (cards: CardSpecConfig[], jokers = 0) =>
  loadCardGroup({ label: 'g', short: 's', detail: { title: 't', text: 'x' }, expert: { original: 'o' }, cards, jokers })
const ranksOf = (hand: DisplayCard[]) => hand.map((card) => ('joker' in card ? 'joker' : card.rank))

describe('pickHand', () => {
  it('garde tout jusqu’à 3 éléments', () => {
    expect(pickHand([])).toEqual([])
    expect(pickHand([1])).toEqual([1])
    expect(pickHand([1, 2])).toEqual([1, 2])
    expect(pickHand([1, 2, 3])).toEqual([1, 2, 3])
  })
  it('sinon le premier, celui du milieu et le dernier', () => {
    expect(pickHand([2, 3, 4, 5, 6])).toEqual([2, 4, 6])
    expect(pickHand([2, 3, 4, 5])).toEqual([2, 4, 5])
    expect(pickHand([1, 2, 3, 4, 5, 6, 7])).toEqual([1, 4, 7])
  })
})

describe('handOf', () => {
  const suits = ['spades', 'hearts', 'clubs'] as const
  it('8 à 10 : la main 8-9-10', () => {
    expect(ranksOf(handOf(group([{ ranks: [8, 9, 10], suits: [...suits] }])))).toEqual(['8', '9', '10'])
  })
  it('2 à 6 : la main 2-4-6', () => {
    expect(ranksOf(handOf(group([{ ranks: [2, 3, 4, 5, 6], suits: [...suits] }])))).toEqual(['2', '4', '6'])
  })
  it('un seul rang (A, 7, Valet, Dame) : une carte seule, même à trois couleurs', () => {
    expect(handOf(group([{ ranks: [7], suits: [...suits] }]))).toEqual([{ rank: '7', suit: 'spades' }])
    expect(handOf(group([{ ranks: [3], suits: ['hearts', 'spades'] }]))).toHaveLength(1)
  })
  it('un seul rang : la carte montrée est `display` si le jeu en donne une', () => {
    const g = loadCardGroup({
      label: 'g',
      short: 's',
      detail: { title: 't', text: 'x' },
      expert: { original: 'o' },
      cards: [{ ranks: [7], suits: [...suits] }],
      display: { rank: 7, suit: 'clubs' },
    })
    expect(handOf(g)).toEqual([{ rank: '7', suit: 'clubs' }])
  })
  it('deux rangs : une main de deux cartes (Valets et rois noirs)', () => {
    const hand = handOf(
      group([
        { ranks: [toRank('J')], suits: 'all' },
        { ranks: [toRank('K')], suits: ['spades', 'clubs'] },
      ]),
    )
    expect(ranksOf(hand)).toEqual(['J', 'K'])
  })
  it('des jokers : une carte seule', () => {
    expect(handOf(group([], 2))).toEqual([{ joker: true }])
  })
  it('sur chaque jeu : une main de 2 ou 3 cartes si le groupe a plusieurs rangs, sinon une seule carte', () => {
    for (const game of games) {
      for (const g of game.card_groups) {
        const hand = handOf(g)
        expect(hand).toHaveLength(g.ranks.length > 1 ? Math.min(g.ranks.length, 3) : 1)
      }
    }
  })
})
