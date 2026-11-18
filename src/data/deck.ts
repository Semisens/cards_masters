import { RANKS, SUITS, rankPlural, suitPlural, type Rank, type Suit } from '../core/cards.ts'
import type { CardGroup, Game } from './types.ts'

/** Taille d'un paquet classique sans jokers. */
export const FULL_DECK = RANKS.length * SUITS.length

export interface DeckCard {
  rank: Rank
  suit: Suit
}

/** Les cartes exactes d'un groupe, quand elles sont connues. `null` : « n'importe quelle couleur » (pas de liste). */
export function groupCards(group: Pick<CardGroup, 'ranks' | 'suits' | 'cards'>): DeckCard[] | null {
  if (group.cards) return group.cards.flatMap(({ rank, suits }) => suits.map((suit) => ({ rank, suit })))
  if (group.suits) return group.ranks.flatMap((rank) => group.suits!.map((suit) => ({ rank, suit })))
  return null
}

/** Nombre maximum d'éléments dans « Retire les carreaux, les trèfles et les rois » avant de dire « tout le reste ». */
const MAX_REMOVAL_ITEMS = 3

export interface DeckPlan {
  /** Les groupes de cartes à garder, dans l'ordre du jeu. */
  groups: CardGroup[]
  /** Tous les rangs gardés, dans l'ordre du paquet (As à Roi). */
  keptRanks: Rank[]
  keptTotal: number
  removedTotal: number
  /** Rangs retirés en entier (aucune carte gardée). */
  removedRanks: Rank[]
  /** Couleurs retirées en entier. Vide si un groupe accepte « n'importe quelle couleur ». */
  removedSuits: Suit[]
  /** Couleurs gardées. Toutes si un groupe accepte « n'importe quelle couleur ». */
  keptSuits: Suit[]
  /**
   * Comment dire ce qu'on retire : `list` (« Retire les carreaux et les rois ») quand les cartes gardées sont
   * exactement toutes les couleurs gardées dans tous les rangs gardés ; sinon `keepOnly` (« Retire tout le reste »).
   */
  removalMode: 'list' | 'keepOnly'
}

/** Calcule, à partir de `card_groups`, ce qu'il faut garder et retirer du paquet de 52. */
export function deckPlan(game: Pick<Game, 'card_groups'>): DeckPlan {
  const groups = game.card_groups
  const kept = new Set<Rank>(groups.flatMap((group) => group.ranks))
  const keptTotal = groups.reduce((sum, group) => sum + group.count, 0)

  const exact = groups.map(groupCards)
  const anySuit = exact.some((cards) => cards === null)
  const used = new Set<Suit>(exact.flatMap((cards) => (cards ?? []).map((card) => card.suit)))
  const keptRanks = RANKS.filter((rank) => kept.has(rank))
  const keptSuits = anySuit ? [...SUITS] : SUITS.filter((suit) => used.has(suit))
  const removedRanks = RANKS.filter((rank) => !kept.has(rank))
  const removedSuits = anySuit ? [] : SUITS.filter((suit) => !used.has(suit))
  // La liste « Retire… » dit vrai seulement si tout le reste du paquet part : kept = rangs gardés x couleurs gardées.
  const isProduct = !anySuit && keptTotal === keptRanks.length * keptSuits.length
  const removalMode = isProduct && removedRanks.length + removedSuits.length <= MAX_REMOVAL_ITEMS ? 'list' : 'keepOnly'

  return {
    groups,
    keptRanks,
    keptTotal,
    removedTotal: FULL_DECK - keptTotal,
    removedRanks,
    removedSuits,
    keptSuits,
    removalMode,
  }
}

/**
 * Ce qu'il faut sortir du paquet, en une liste lisible : les couleurs d'abord, puis les valeurs.
 * Ex. « les carreaux et les rois ». Vide si on garde tout le paquet.
 */
export function removalList(plan: Pick<DeckPlan, 'removedSuits' | 'removedRanks'>): string {
  const items = [
    ...plan.removedSuits.map((suit) => `les ${suitPlural(suit)}`),
    ...plan.removedRanks.map((rank) => `les ${rankPlural(rank).toLowerCase()}`),
  ]
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`
}
