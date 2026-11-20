import type { CardLayout } from '../../data/types.ts'

/** Combien de dos on dessine pour chaque disposition. */
export const CARDS_IN_LAYOUT: Record<CardLayout, number> = { single: 1, pile: 3, spread: 3, grid: 6 }

/**
 * Quelle carte est retournée (`reveal`) : celle du bord de la main (la dernière, dessus), celle du dessus de la pile,
 * celle du milieu de la rangée du bas de la grille 3 x 2.
 */
export const REVEALED_IN_LAYOUT: Record<CardLayout, number> = { single: 0, pile: 2, spread: 2, grid: 4 }
