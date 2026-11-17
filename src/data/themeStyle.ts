import type { CSSProperties } from 'react'
import type { GameTheme } from './theme.ts'

/** Variables CSS d'un jeu : couleur du tapis, texte lisible dessus, ombre et police du nom. */
export function themeStyle(theme: GameTheme): CSSProperties {
  return {
    '--game-bg': theme.background,
    '--game-fg': theme.text,
    '--game-shadow': theme.shadow,
    '--game-font': theme.font.family,
    '--game-font-weight': theme.font.weight,
  } as CSSProperties
}
