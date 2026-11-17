/** Part de la largeur de la carte occupée par la taille du rang (voir PlayingCard.module.css, `.rank`). */
const RANK_FONT_RATIO = 0.26

/**
 * Largeur minimale d'une carte dont le rang reste lisible : la taille de texte minimale de la charte (16 px).
 * À utiliser pour les cartes d'illustration, qui doivent tenir plusieurs sur une ligne.
 */
export const READABLE_CARD_WIDTH = `calc(var(--mc-text-min) / ${RANK_FONT_RATIO})`
