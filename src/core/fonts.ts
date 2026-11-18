import type { GameFont } from '../data/types.ts'

export interface FontStyle {
  family: string
  weight: number
  /** Taille du nom du jeu dans le bandeau, en multiples du texte de base (16 px). La calligraphie a une petite hauteur d'x : elle est plus grande. */
  bandSize: number
}

/**
 * Polices de nom de jeu disponibles. Chacune doit être embarquée (import @fontsource dans main.tsx)
 * pour que l'app reste fidèle hors ligne. Ajouter une police = ajouter son paquet et une ligne ici.
 */
export const GAME_FONTS: Record<GameFont, FontStyle> = {
  Fredoka: { family: 'var(--mc-font-title)', weight: 700, bandSize: 3.5 },
  'Great Vibes': { family: 'var(--mc-font-script)', weight: 400, bandSize: 4 },
}

export const DEFAULT_GAME_FONT: GameFont = 'Fredoka'
