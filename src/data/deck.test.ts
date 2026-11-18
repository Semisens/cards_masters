import { describe, expect, it } from 'vitest'
import { FULL_DECK, deckPlan, groupCards, removalList } from './deck.ts'
import type { CardGroup } from './types.ts'

const group = (partial: Partial<CardGroup> & Pick<CardGroup, 'ranks' | 'count'>): CardGroup => ({
  label: 'g',
  display: { rank: partial.ranks[0], suit: 'hearts' },
  short: 's',
  detail: { title: 't', text: 'x' },
  expert: { original: 'o' },
  ...partial,
})

describe('deckPlan', () => {
  it('compte le paquet complet', () => {
    expect(FULL_DECK).toBe(52)
  })

  it('additionne les cartes gardées et retire en entier les rangs et couleurs jamais gardés', () => {
    const plan = deckPlan({
      card_groups: [
        group({ ranks: ['A', '2'], count: 4, suits: ['spades', 'hearts'] }),
        group({ ranks: ['3'], count: 2, suits: ['spades', 'hearts'] }),
      ],
    })
    expect(plan.keptTotal).toBe(6)
    expect(plan.removedTotal).toBe(46)
    expect(plan.keptRanks).toEqual(['A', '2', '3'])
    expect(plan.removedRanks).toHaveLength(10)
    expect(plan.removedRanks).not.toContain('A')
    expect(plan.keptSuits).toEqual(['spades', 'hearts'])
    expect(plan.removedSuits).toEqual(['diamonds', 'clubs'])
  })

  it('garde toutes les couleurs quand un groupe accepte n’importe laquelle', () => {
    const plan = deckPlan({
      card_groups: [group({ ranks: ['A'], count: 4 }), group({ ranks: ['K'], count: 1, suits: ['clubs'] })],
    })
    expect(plan.keptSuits).toHaveLength(4)
    expect(plan.removedSuits).toEqual([])
  })

  it('range les rangs dans l’ordre du paquet, pas dans l’ordre du fichier', () => {
    const plan = deckPlan({
      card_groups: [group({ ranks: ['K'], count: 1 }), group({ ranks: ['A', '5'], count: 2 })],
    })
    expect(plan.keptRanks).toEqual(['A', '5', 'K'])
  })

  it('garde les groupes dans l’ordre du jeu', () => {
    const groups = [group({ label: 'b', ranks: ['K'], count: 1 }), group({ label: 'a', ranks: ['A'], count: 1 })]
    expect(deckPlan({ card_groups: groups }).groups.map((g) => g.label)).toEqual(['b', 'a'])
  })
})

describe('removalList', () => {
  it('cite les couleurs d’abord, puis les valeurs', () => {
    expect(removalList({ removedSuits: ['diamonds'], removedRanks: ['K'] })).toBe('les carreaux et les rois')
  })

  it('accorde la liste : virgules puis « et »', () => {
    expect(removalList({ removedSuits: ['clubs', 'diamonds'], removedRanks: ['K'] })).toBe(
      'les trèfles, les carreaux et les rois',
    )
  })

  it('écrit un seul élément sans « et »', () => {
    expect(removalList({ removedSuits: [], removedRanks: ['Q'] })).toBe('les dames')
    expect(removalList({ removedSuits: ['hearts'], removedRanks: [] })).toBe('les cœurs')
  })

  it('met As et valeurs numériques au pluriel correctement', () => {
    expect(removalList({ removedSuits: [], removedRanks: ['A'] })).toBe('les as')
    expect(removalList({ removedSuits: [], removedRanks: ['10'] })).toBe('les 10')
  })

  it('est vide quand on garde tout le paquet', () => {
    expect(removalList({ removedSuits: [], removedRanks: [] })).toBe('')
  })
})

describe('groupCards', () => {
  it('liste les rangs x couleurs', () => {
    expect(groupCards(group({ ranks: ['A', '2'], count: 4, suits: ['spades', 'hearts'] }))).toHaveLength(4)
  })

  it('liste exactement les cartes données : 4 valets et 2 rois noirs', () => {
    const cards = groupCards(
      group({
        ranks: ['J', 'K'],
        count: 6,
        cards: [
          { rank: 'J', suits: ['spades', 'hearts', 'diamonds', 'clubs'] },
          { rank: 'K', suits: ['spades', 'clubs'] },
        ],
      }),
    )
    expect(cards).toHaveLength(6)
    expect(cards).toContainEqual({ rank: 'K', suit: 'clubs' })
    expect(cards).not.toContainEqual({ rank: 'K', suit: 'hearts' })
  })

  it('ne sait pas lister « n’importe quelle couleur »', () => {
    expect(groupCards(group({ ranks: ['A'], count: 4 }))).toBeNull()
  })
})

describe('mode de retrait', () => {
  it('dit « Retire… » quand les cartes gardées sont tous les rangs gardés dans toutes les couleurs gardées', () => {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q'] as const
    const plan = deckPlan({
      card_groups: [group({ ranks: [...ranks], count: 36, suits: ['spades', 'hearts', 'clubs'] })],
    })
    expect(plan.removalMode).toBe('list')
  })

  it('dit « tout le reste » quand les cartes gardées ne forment pas un rectangle de rangs et couleurs', () => {
    const plan = deckPlan({
      card_groups: [
        group({
          ranks: ['J', 'K'],
          count: 6,
          cards: [
            { rank: 'J', suits: ['spades', 'hearts', 'diamonds', 'clubs'] },
            { rank: 'K', suits: ['spades', 'clubs'] },
          ],
        }),
      ],
    })
    expect(plan.keptTotal).toBe(6)
    expect(plan.removalMode).toBe('keepOnly')
  })

  it('dit « tout le reste » quand la liste serait trop longue', () => {
    const plan = deckPlan({ card_groups: [group({ ranks: ['A', '2'], count: 4, suits: ['spades', 'hearts'] })] })
    expect(plan.removedRanks.length + plan.removedSuits.length).toBeGreaterThan(3)
    expect(plan.removalMode).toBe('keepOnly')
  })

  it('dit « tout le reste » sans liste de couleurs', () => {
    expect(deckPlan({ card_groups: [group({ ranks: ['A'], count: 4 })] }).removalMode).toBe('keepOnly')
  })
})
