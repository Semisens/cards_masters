import type { CSSProperties } from 'react'
import { pickTextColor } from '../../core/contrast.ts'
import { tokens } from '../../core/tokens.generated.ts'
import type { OriginalCard as OriginalCardData } from '../../data/types.ts'
import styles from './OriginalCard.module.css'

/** `list` : mini-carte des lignes (44 px) ; `strip` : carte de la rangée de la vue à balayer (3,5 rem). */
export type OriginalCardVariant = 'list' | 'strip'

export interface OriginalCardProps {
  card: OriginalCardData
  variant?: OriginalCardVariant
}

/**
 * Une carte du jeu d'origine. Avec une image (`image`, découpée d'une planche : `npm run planche`), la carte EST l'image,
 * chiffre compris. Sans image, elle est dessinée : un fond de sa couleur et sa valeur, en blanc ou en encre selon le
 * contraste (pas de portrait ni de texte officiel).
 * Décorative : la légende ou le titre de la ligne disent la même chose.
 */
export function OriginalCard({ card, variant = 'list' }: OriginalCardProps) {
  const size = variant === 'strip' ? styles.strip : styles.list
  if (card.imageUrl) {
    return (
      <span className={`${styles.card} ${size} ${styles.picture}`} aria-hidden="true">
        <img className={styles.image} src={card.imageUrl} alt="" />
      </span>
    )
  }
  const text = pickTextColor(card.color)?.color ?? tokens.colors.encre
  const style = { '--original-bg': card.color, '--original-fg': text } as CSSProperties
  return (
    <span className={`${styles.card} ${size}`} style={style} aria-hidden="true">
      <span className={styles.value}>{card.value}</span>
    </span>
  )
}

export interface OriginalCardsProps {
  cards: OriginalCardData[]
}

/**
 * Les cartes d'origine d'une ligne de la liste : une carte, ou la première et la dernière qui se recouvrent
 * (« 2–6 » : le 2 et le 6) pour dire qu'il y en a plusieurs sans prendre de place.
 */
export function OriginalCards({ cards }: OriginalCardsProps) {
  const shown = cards.length > 1 ? [cards[0], cards[cards.length - 1]] : cards
  return (
    <span className={styles.pair} aria-hidden="true">
      {shown.map((card, index) => (
        <OriginalCard key={`${card.value}-${index}`} card={card} />
      ))}
    </span>
  )
}
