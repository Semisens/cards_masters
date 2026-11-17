export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'] as const
export type Suit = (typeof SUITS)[number]

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
export type Rank = (typeof RANKS)[number]

export const isRedSuit = (suit: Suit): boolean => suit === 'hearts' || suit === 'diamonds'

const RANK_NAMES: Record<Rank, string> = {
  A: 'As',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  J: 'Valet',
  Q: 'Dame',
  K: 'Roi',
}

const SUIT_NAMES: Record<Suit, string> = {
  spades: 'pique',
  hearts: 'cœur',
  diamonds: 'carreau',
  clubs: 'trèfle',
}

/** Nom d'un rang, ex. « Roi », « As », « 10 ». */
export const rankName = (rank: Rank): string => RANK_NAMES[rank]

/** Lettre du rang sur une carte française : V (Valet), D (Dame), R (Roi). Les autres rangs sont inchangés. */
export const rankLetter = (rank: Rank): string => (rank === 'J' ? 'V' : rank === 'Q' ? 'D' : rank === 'K' ? 'R' : rank)

/** Rang au pluriel, ex. « Rois », « Dames », « 7 ». */
export const rankPlural = (rank: Rank): string =>
  rank === 'A' ? 'As' : /^\d+$/.test(rank) ? rank : `${RANK_NAMES[rank]}s`

const SUIT_PLURALS: Record<Suit, string> = { spades: 'piques', hearts: 'cœurs', diamonds: 'carreaux', clubs: 'trèfles' }

/** Couleur au pluriel, ex. « trèfles ». */
export const suitPlural = (suit: Suit): string => SUIT_PLURALS[suit]

/** Nom d'une couleur, ex. « cœur ». */
export const suitName = (suit: Suit): string => SUIT_NAMES[suit]

/** Libellé lisible par un lecteur d'écran, ex. « Roi de cœur ». */
export function cardLabel(rank: Rank, suit: Suit): string {
  return `${RANK_NAMES[rank]} de ${SUIT_NAMES[suit]}`
}
