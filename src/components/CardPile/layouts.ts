import type { CardLayout } from '../../data/types.ts'

/** Combien de dos on dessine pour chaque disposition. */
export const CARDS_IN_LAYOUT: Record<CardLayout, number> = { single: 1, pile: 3, spread: 3 }
