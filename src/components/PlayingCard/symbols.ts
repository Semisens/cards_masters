import type { Suit } from '../../core/cards.ts'

/** Côté de la grille de dessin des symboles (viewBox carré). */
export const SYMBOL_VIEWBOX = 100

/** Tracés vectoriels des quatre symboles, dans une grille de SYMBOL_VIEWBOX × SYMBOL_VIEWBOX. */
export const SUIT_PATHS: Record<Suit, string> = {
  hearts: 'M50 90 C8 60 4 30 26 17 C39 10 50 18 50 30 C50 18 61 10 74 17 C96 30 92 60 50 90 Z',
  diamonds: 'M50 5 L89 50 L50 95 L11 50 Z',
  spades:
    'M50 7 C50 7 9 38 9 62 C9 79 30 85 42 72 C40 84 36 90 29 94 L71 94 C64 90 60 84 58 72 C70 85 91 79 91 62 C91 38 50 7 50 7 Z',
  // Trois cercles (haut, gauche, droite), un cercle central de liaison et le pied.
  clubs:
    'M30 28 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 Z ' +
    'M7 62 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 Z ' +
    'M53 62 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 Z ' +
    'M38 55 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 Z ' +
    'M50 55 L37 94 L63 94 Z',
}

/** Étoile à cinq branches du joker, dans la même grille. */
export const JOKER_PATH = 'M50 6 L62 37 L95 38 L69 58 L78 90 L50 71 L22 90 L31 58 L5 38 L38 37 Z'
