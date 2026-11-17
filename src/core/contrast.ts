import { tokens } from './tokens.generated.ts'

/** Seuil WCAG AA pour du texte normal (cahier des charges, section 5). */
export const MIN_CONTRAST = 4.5

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function parseHex(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Couleur hexadécimale invalide : « ${hex} »`)
  const n = parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Ratio de contraste WCAG entre deux couleurs, de 1 à 21. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

export interface TextColorChoice {
  /** Couleur du texte à utiliser. */
  color: string
  ratio: number
}

/**
 * Choisit entre blanc et encre le texte le plus lisible sur un fond (libre ou non).
 * Renvoie `null` si aucun des deux n'atteint le seuil : l'appelant doit alors refuser ou ajuster le fond.
 */
export function pickTextColor(background: string): TextColorChoice | null {
  const candidates = [tokens.colors.blanc_carte, tokens.colors.encre]
    .map((color) => ({ color, ratio: contrastRatio(background, color) }))
    .sort((x, y) => y.ratio - x.ratio)
  const best = candidates[0]
  return best.ratio >= MIN_CONTRAST ? best : null
}
