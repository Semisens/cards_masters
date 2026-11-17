import { RANKS, SUITS, rankPlural, suitPlural, type Rank, type Suit } from '../core/cards.ts'
import type { CardGroup, Game } from './types.ts'

/** Taille d'un paquet classique sans jokers. */
export const FULL_DECK = RANKS.length * SUITS.length

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
}

/** Calcule, à partir de `card_groups`, ce qu'il faut garder et retirer du paquet de 52. */
export function deckPlan(game: Pick<Game, 'card_groups'>): DeckPlan {
  const groups = game.card_groups
  const kept = new Set<Rank>(groups.flatMap((group) => group.ranks))
  const keptTotal = groups.reduce((sum, group) => sum + group.count, 0)

  const anySuit = groups.some((group) => !group.suits)
  const used = new Set<Suit>(groups.flatMap((group) => group.suits ?? []))

  return {
    groups,
    keptRanks: RANKS.filter((rank) => kept.has(rank)),
    keptTotal,
    removedTotal: FULL_DECK - keptTotal,
    removedRanks: RANKS.filter((rank) => !kept.has(rank)),
    removedSuits: anySuit ? [] : SUITS.filter((suit) => !used.has(suit)),
    keptSuits: anySuit ? [...SUITS] : SUITS.filter((suit) => used.has(suit)),
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
