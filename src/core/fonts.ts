import type { GameFont } from '../data/types.ts'

export interface FontStyle {
  family: string
  weight: number
}

/**
 * Polices de nom de jeu disponibles. Chacune doit être embarquée (import @fontsource dans main.tsx)
 * pour que l'app reste fidèle hors ligne. Ajouter une police = ajouter son paquet et une ligne ici.
 */
export const GAME_FONTS: Record<GameFont, FontStyle> = {
  Fredoka: { family: 'var(--mc-font-title)', weight: 700 },
  'Great Vibes': { family: 'var(--mc-font-script)', weight: 400 },
}

export const DEFAULT_GAME_FONT: GameFont = 'Fredoka'
