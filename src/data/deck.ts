import { RANKS, SUITS, rankPlural, suitPlural, type Rank, type Suit } from '../core/cards.ts'
import type { CardGroup, CardSpecConfig, DeckCard, Game } from './types.ts'

/** Taille d'un paquet classique sans jokers. */
export const FULL_DECK = RANKS.length * SUITS.length

/** Rang d'une configuration : en YAML, `2` est un nombre ; on le ramène au rang `'2'`. */
export function toRank(value: string | number): Rank {
  const rank = String(value)
  if (!(RANKS as readonly string[]).includes(rank)) throw new Error(`Rang inconnu : ${rank}`)
  return rank as Rank
}

/** Les cartes exactes décrites par une liste `{ ranks, suits }` (`suits: all` : les quatre couleurs). */
export function expandCards(specs: CardSpecConfig[]): DeckCard[] {
  return specs.flatMap(({ ranks, suits }) =>
    ranks.flatMap((rank) => (suits === 'all' ? SUITS : suits).map((suit) => ({ rank: toRank(rank), suit }))),
  )
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
  /** Couleurs retirées en entier. */
  removedSuits: Suit[]
  /** Couleurs gardées. */
  keptSuits: Suit[]
  /**
   * Comment dire ce qu'on retire : `list` (« Retire les carreaux et les rois ») quand les cartes gardées sont
   * exactement toutes les couleurs gardées dans tous les rangs gardés ; sinon `keepOnly` (« Retire tout le reste »).
   */
  removalMode: 'list' | 'keepOnly'
}

/** Calcule, carte par carte, ce qu'il faut garder et retirer du paquet de 52. */
export function deckPlan(game: Pick<Game, 'card_groups'>): DeckPlan {
  const groups = game.card_groups
  const cards: DeckCard[] = groups.flatMap((group) => group.cards)
  const ranks = new Set<Rank>(cards.map((card) => card.rank))
  const suits = new Set<Suit>(cards.map((card) => card.suit))
  const keptTotal = cards.length
  const keptRanks = RANKS.filter((rank) => ranks.has(rank))
  const keptSuits = SUITS.filter((suit) => suits.has(suit))
  const removedRanks = RANKS.filter((rank) => !ranks.has(rank))
  const removedSuits = SUITS.filter((suit) => !suits.has(suit))
  // La liste « Retire… » dit vrai seulement si tout le reste du paquet part : gardées = rangs gardés x couleurs gardées.
  const isProduct = keptTotal === keptRanks.length * keptSuits.length
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
