import type { CSSProperties } from 'react'
import type { CardLayout } from '../../data/types.ts'
import { CARDS_IN_LAYOUT } from './layouts.ts'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './CardPile.module.css'

export interface CardPileProps {
  /** `single` : une carte ; `pile` : la pioche, des dos empilés ; `spread` : une main, des dos en éventail. */
  layout?: CardLayout
  /** Largeur d'une carte : toute longueur CSS. Défaut : 3,5 rem, comme les cartes des schémas. */
  width?: string
  className?: string
}

/**
 * Des cartes posées de dos : la pioche, une carte écartée, une main. Elles portent la couleur de dos du jeu
 * (`card_back_color`). Décoratif : la légende du schéma dit la même chose, les lecteurs d'écran passent.
 */
export function CardPile({ layout = 'single', width, className }: CardPileProps) {
  const count = CARDS_IN_LAYOUT[layout]
  const style = { '--n': count, ...(width ? { '--pile-card-w': width } : {}) } as CSSProperties
  return (
    <span
      className={[styles.root, styles[layout], className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <PlayingCard
          key={index}
          faceDown
          width="var(--pile-card-w)"
          className={styles.card}
          style={{ '--i': index } as CSSProperties}
        />
      ))}
    </span>
  )
}
