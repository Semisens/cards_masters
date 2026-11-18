import { describe, expect, it } from 'vitest'
import { RANKS } from '../core/cards.ts'
import { FULL_DECK, deckPlan, expandCards, removalList, toRank } from './deck.ts'
import { loadCardGroup } from './loadGame.ts'
import type { CardGroup, CardSpecConfig } from './types.ts'

const group = (cards: CardSpecConfig[], label = 'g'): CardGroup =>
  loadCardGroup({ label, cards, short: 's', detail: { title: 't', text: 'x' }, expert: { original: 'o' } })

describe('expandCards', () => {
  it('liste les rangs x couleurs', () => {
    expect(expandCards([{ ranks: ['A', 2], suits: ['spades', 'hearts'] }])).toEqual([
      { rank: 'A', suit: 'spades' },
      { rank: 'A', suit: 'hearts' },
      { rank: '2', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
    ])
  })

  it('comprend `all` : les quatre couleurs', () => {
    expect(expandCards([{ ranks: ['J'], suits: 'all' }])).toHaveLength(4)
  })

  it('liste exactement les cartes données : 4 valets et 2 rois noirs', () => {
    const cards = expandCards([
      { ranks: ['J'], suits: 'all' },
      { ranks: ['K'], suits: ['spades', 'clubs'] },
    ])
    expect(cards).toHaveLength(6)
    expect(cards).toContainEqual({ rank: 'K', suit: 'clubs' })
    expect(cards).not.toContainEqual({ rank: 'K', suit: 'hearts' })
  })
})

describe('toRank', () => {
  it('accepte les nombres écrits sans guillemets en YAML', () => {
    expect(toRank(7)).toBe('7')
    expect(toRank('Q')).toBe('Q')
  })

  it('refuse un rang inconnu', () => {
    expect(() => toRank(11)).toThrow(/Rang inconnu/)
  })
})

describe('loadCardGroup', () => {
  it('calcule les rangs (ordre du paquet), le nombre de cartes et la carte montrée', () => {
    const g = group([{ ranks: ['K', 'A'], suits: ['hearts', 'clubs'] }])
    expect(g.ranks).toEqual(['A', 'K'])
    expect(g.count).toBe(4)
    expect(g.display).toEqual({ rank: 'K', suit: 'hearts' })
  })
})

describe('jokers', () => {
  const jokers = loadCardGroup({
    label: 'Jokers',
    jokers: 2,
    short: 's',
    detail: { title: 't', text: 'x' },
    expert: { original: '0' },
  })

  it('un groupe de jokers n’a aucune carte du paquet, deux cartes en tout, et montre un joker', () => {
    expect(jokers.cards).toEqual([])
    expect(jokers.ranks).toEqual([])
    expect(jokers.jokers).toBe(2)
    expect(jokers.count).toBe(2)
    expect(jokers.display).toEqual({ joker: true })
  })

  it('un groupe mixte compte les cartes et les jokers, et montre sa première carte', () => {
    const mixed = loadCardGroup({
      label: 'm',
      jokers: 1,
      cards: [{ ranks: ['A'], suits: ['hearts'] }],
      short: 's',
      detail: { title: 't', text: 'x' },
      expert: { original: 'o' },
    })
    expect(mixed.count).toBe(2)
    expect(mixed.display).toEqual({ rank: 'A', suit: 'hearts' })
  })

  it('le plan compte les jokers dans les cartes à garder, pas dans le paquet de 52 à retirer', () => {
    const plan = deckPlan({ card_groups: [jokers, group([{ ranks: ['A'], suits: ['hearts', 'spades'] }])] })
    expect(plan.keptJokers).toBe(2)
    expect(plan.keptTotal).toBe(4)
    expect(plan.removedTotal).toBe(50)
  })

  it('avec des jokers, on dit « Retire tout le reste », jamais une liste', () => {
    const full = group([{ ranks: RANKS.filter((rank) => rank !== 'K'), suits: 'all' }])
    expect(deckPlan({ card_groups: [full] }).removalMode).toBe('list')
    expect(deckPlan({ card_groups: [full, jokers] }).removalMode).toBe('keepOnly')
  })
})

describe('deckPlan', () => {
  it('compte le paquet complet', () => {
    expect(FULL_DECK).toBe(52)
  })

  it('additionne les cartes gardées et retire en entier les rangs et couleurs jamais gardés', () => {
    const plan = deckPlan({
      card_groups: [
        group([{ ranks: ['A', '2'], suits: ['spades', 'hearts'] }]),
        group([{ ranks: ['3'], suits: ['spades', 'hearts'] }]),
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

  it('range les rangs dans l’ordre du paquet, pas dans l’ordre du fichier', () => {
    const plan = deckPlan({
      card_groups: [group([{ ranks: ['K'], suits: ['clubs'] }]), group([{ ranks: ['A', '5'], suits: ['clubs'] }])],
    })
    expect(plan.keptRanks).toEqual(['A', '5', 'K'])
  })

  it('garde les groupes dans l’ordre du jeu', () => {
    const groups = [group([{ ranks: ['K'], suits: 'all' }], 'b'), group([{ ranks: ['A'], suits: 'all' }], 'a')]
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

describe('mode de retrait', () => {
  it('dit « Retire… » quand les cartes gardées sont tous les rangs gardés dans toutes les couleurs gardées', () => {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q'] as const
    const plan = deckPlan({ card_groups: [group([{ ranks: [...ranks], suits: ['spades', 'hearts', 'clubs'] }])] })
    expect(plan.removalMode).toBe('list')
  })

  it('dit « tout le reste » quand les cartes gardées ne forment pas un rectangle de rangs et couleurs', () => {
    const plan = deckPlan({
      card_groups: [
        group([
          { ranks: ['J'], suits: 'all' },
          { ranks: ['K'], suits: ['spades', 'clubs'] },
        ]),
      ],
    })
    expect(plan.keptTotal).toBe(6)
    expect(plan.removalMode).toBe('keepOnly')
  })

  it('dit « tout le reste » quand la liste serait trop longue', () => {
    const plan = deckPlan({ card_groups: [group([{ ranks: ['A', '2'], suits: ['spades', 'hearts'] }])] })
    expect(plan.removedRanks.length + plan.removedSuits.length).toBeGreaterThan(3)
    expect(plan.removalMode).toBe('keepOnly')
  })
})
