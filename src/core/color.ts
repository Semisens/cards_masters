// Utilitaires de couleur partagés entre l'app et les scripts de génération (gen-tokens, gen-icons).

export type Rgb = [r: number, g: number, b: number]

export function parseHex(hex: string): Rgb {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Couleur hexadécimale invalide : « ${hex} »`)
  const n = parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

/** Mélange deux couleurs : `share` est la part de `hex` (0 à 1), le reste vient de `withHex`. */
export function mix(hex: string, withHex: string, share: number): string {
  const a = parseHex(hex)
  const b = parseHex(withHex)
  return toHex(a.map((v, i) => Math.round(v * share + b[i] * (1 - share))) as Rgb)
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Éclaircit une couleur : `keep` est la part conservée (0 à 1), le reste est du blanc. */
export function tint(hex: string, keep: number): string {
  return mix(hex, '#FFFFFF', keep)
}

/** Assombrit une couleur : `keep` est la part conservée (0 à 1), le reste est du noir. */
export function shade(hex: string, keep: number): string {
  return mix(hex, '#000000', keep)
}

/** Part de la couleur d'origine conservée dans son ombre en relief (le reste est du noir). */
export const SHADOW_KEEP = 0.65

/**
 * Ombre en relief d'une couleur : la même couleur, assombrie. (Les maquettes de Trio : tapis vert #187A33,
 * ombre #0F4F20.) Calculé en TypeScript et non avec `color-mix()` en CSS, absent d'iOS avant 16.2
 * alors que l'app vise iOS 15.
 */
export function shadowOf(hex: string): string {
  return shade(hex, SHADOW_KEEP)
}
