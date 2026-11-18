import type { CardGroup, DisplayCard } from './types.ts'

/** Une main compte au plus 3 cartes : assez pour dire « il y en a plusieurs », assez petit pour tenir dans une ligne. */
export const MAX_HAND = 3

/**
 * La main d'une liste ordonnée : tout si elle a 3 éléments ou moins, sinon le premier, celui du milieu et le dernier.
 * Ex. 8-9-10 → 8, 9, 10 ; 2-3-4-5-6 → 2, 4, 6.
 */
export function pickHand<T>(items: readonly T[]): T[] {
  if (items.length <= MAX_HAND) return [...items]
  return [items[0], items[Math.round((items.length - 1) / 2)], items[items.length - 1]]
}

/**
 * La main de cartes d'un groupe du paquet : 2 ou 3 cartes, une par rang, dans l'ordre du paquet (8-9-10, 2-4-6).
 * Seuls les groupes de plusieurs rangs ont une main ; un groupe d'un seul rang (l'As, le 7, le Valet, la Dame) ou de
 * jokers reste une carte seule : celle de `display`.
 */
export function handOf(group: Pick<CardGroup, 'cards' | 'display'>): DisplayCard[] {
  const byRank = group.cards.filter(
    (card, index) => group.cards.findIndex((other) => other.rank === card.rank) === index,
  )
  return byRank.length > 1 ? pickHand<DisplayCard>(byRank) : [group.display]
}
