import { describe, expect, it } from 'vitest'
import { FULL_DECK, deckPlan, removalList } from './deck.ts'
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
