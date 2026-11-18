import type { FontConfig, Game } from '../data/types.ts'

export interface FontStyle {
  family: string
  weight: number
  /** Taille du nom du jeu dans le bandeau, en multiples du texte de base (16 px). Une calligraphie a une petite hauteur d'x : elle est plus grande. */
  bandSize: number
}

/** Police du nom quand le jeu n'en déclare pas : Fredoka, la police de titre de la charte. */
export const DEFAULT_GAME_FONT: FontStyle = { family: 'var(--mc-font-title)', weight: 700, bandSize: 3.5 }

/** Style du nom d'un jeu, d'après sa configuration. Repli sur la police de titre si le fichier manque. */
export function gameFontStyle(font: FontConfig | undefined): FontStyle {
  if (!font) return DEFAULT_GAME_FONT
  return {
    family: `'${font.family}', ${DEFAULT_GAME_FONT.family}`,
    weight: font.weight ?? 400,
    bandSize: font.band_size ?? DEFAULT_GAME_FONT.bandSize,
  }
}

/**
 * Déclare les polices fournies par les jeux (fichier woff2 du dossier du jeu). Le navigateur ne les télécharge
 * qu'à la première utilisation ; le service worker les a précachées, elles marchent donc hors ligne.
 */
export function registerGameFonts(list: Game[]): void {
  if (typeof document === 'undefined' || typeof FontFace === 'undefined' || !document.fonts) return
  for (const { font } of list) {
    if (!font?.url) continue
    const face = new FontFace(font.family, `url(${font.url}) format('woff2')`, {
      weight: String(font.weight ?? 400),
      display: 'swap',
    })
    document.fonts.add(face)
  }
}
