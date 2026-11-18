import { Children, type CSSProperties, type ReactNode } from 'react'
import styles from './CardHand.module.css'

/** `list` : cartes de 44 px des lignes de la liste ; `focus` : grandes cartes de la vue à balayer. */
export type CardHandSize = 'list' | 'focus'

export interface CardHandProps {
  /** Les 2 ou 3 cartes (PlayingCard, OriginalCard…), de gauche à droite : la dernière est dessus. */
  children: ReactNode
  size?: CardHandSize
  /** Largeur d'une carte : toute longueur CSS. Défaut : 44 px (`list`) ou 8 rem (`focus`). */
  width?: string
  className?: string
}

/**
 * Une main : 2 ou 3 cartes de face en éventail, qui se recouvrent et s'inclinent autour de la carte du milieu.
 * Chaque carte laisse voir son rang (en haut à gauche) sous la suivante.
 * Décorative : le titre et le sous-titre portent l'information.
 */
export function CardHand({ children, size = 'list', width, className }: CardHandProps) {
  const cards = Children.toArray(children)
  const style = { '--n': cards.length, ...(width ? { '--hand-card-w': width } : {}) } as CSSProperties
  return (
    <span className={[styles.root, styles[size], className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
      {cards.map((card, index) => (
        <span key={index} className={styles.item} style={{ '--i': index } as CSSProperties}>
          {card}
        </span>
      ))}
    </span>
  )
}
