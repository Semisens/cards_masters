import { shadowOf } from '../core/color.ts'
import { MIN_CONTRAST, pickTextColor } from '../core/contrast.ts'
import { DEFAULT_GAME_FONT, GAME_FONTS, type FontStyle } from '../core/fonts.ts'
import { tokens } from '../core/tokens.generated.ts'
import type { Game, GameBackground } from './types.ts'

export interface GameTheme {
  /** Couleur du tapis. */
  background: string
  /** Texte lisible sur ce tapis : blanc ou encre, choisi automatiquement. */
  text: string
  /** Ombre en relief. */
  shadow: string
  font: FontStyle
}

/** Couleur du tapis en hexadécimal, qu'il vienne de la charte ou d'une couleur libre. */
export function backgroundHex(background: GameBackground): string {
  return background.startsWith('#') ? background.toUpperCase() : tokens.tapis[background as keyof typeof tokens.tapis]
}

/** Ombre en relief du tapis : celle de la charte pour un tapis nommé, sinon la couleur assombrie. */
function shadowOfBackground(background: GameBackground, hex: string): string {
  return background.startsWith('#') ? shadowOf(hex) : tokens.tapisOmbres[background as keyof typeof tokens.tapisOmbres]
}

/**
 * Thème d'un jeu. Refuse une couleur libre sans contraste suffisant (≥ 4,5) avec le blanc comme avec l'encre.
 * Le test des jeux garantit qu'aucun jeu livré ne lève cette erreur.
 */
export function resolveGameTheme(game: Pick<Game, 'background_color' | 'font'>): GameTheme {
  const background = backgroundHex(game.background_color)
  const text = pickTextColor(background)
  if (!text) {
    throw new Error(
      `La couleur ${background} n'atteint pas un contraste de ${MIN_CONTRAST} avec le blanc ni avec l'encre : choisis un fond plus clair ou plus foncé.`,
    )
  }
  return {
    background,
    text: text.color,
    shadow: shadowOfBackground(game.background_color, background),
    font: GAME_FONTS[game.font ?? DEFAULT_GAME_FONT],
  }
}
