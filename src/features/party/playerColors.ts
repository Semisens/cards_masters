export interface PlayerColor {
  /** Couleur du jeton. */
  color: string
  /** Couleur du chiffre, celle que la charte associe au fond (contraste ≥ 4,5). */
  text: string
}

/** Couleurs des jetons, dans l'ordre des joueurs. Toutes viennent de la charte. */
const PALETTE: PlayerColor[] = [
  { color: 'var(--mc-color-soleil)', text: 'var(--mc-text-on-soleil)' },
  { color: 'var(--mc-color-cerise)', text: 'var(--mc-text-on-cerise)' },
  { color: 'var(--mc-color-azur)', text: 'var(--mc-text-on-azur)' },
  { color: 'var(--mc-color-nuit)', text: 'var(--mc-text-on-nuit)' },
  { color: 'var(--mc-color-prairie)', text: 'var(--mc-text-on-prairie)' },
  { color: 'var(--mc-color-texte-secondaire)', text: 'var(--mc-color-blanc-carte)' },
]

/** Couleur du jeton du joueur n (à partir de 0). Au-delà de la palette, on repart du début. */
export const playerColor = (index: number): PlayerColor => PALETTE[index % PALETTE.length]
