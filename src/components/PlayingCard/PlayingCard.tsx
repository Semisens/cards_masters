import type { CSSProperties } from 'react'
import { cardLabel, isRedSuit, type Rank, type Suit } from '../../core/cards.ts'
import type { TapisName } from '../../core/tokens.generated.ts'
import { SUIT_PATHS, SYMBOL_VIEWBOX } from './symbols.ts'
import styles from './PlayingCard.module.css'

interface FaceUp {
  rank: Rank
  suit: Suit
  faceDown?: false
}

interface FaceDown {
  faceDown: true
  /** Couleur de la pioche (celle du tapis du jeu). */
  back?: TapisName
}

export type PlayingCardProps = (FaceUp | FaceDown) & {
  /** Largeur de la carte : toute longueur CSS (par défaut, définie dans la feuille de style). */
  width?: string
  className?: string
}

/** Carte à jouer : rang seul en haut à gauche, un seul grand symbole centré, rouge ou noir uniquement. */
export function PlayingCard(props: PlayingCardProps) {
  const style = props.width ? ({ '--card-w': props.width } as CSSProperties) : undefined
  const classes = [styles.card, props.className].filter(Boolean).join(' ')

  if (props.faceDown) {
    const back = props.back ?? 'bleu'
    return (
      <div
        role="img"
        aria-label="Dos de carte"
        className={`${classes} ${styles.back}`}
        style={{ ...style, '--back-color': `var(--mc-tapis-${back})` } as CSSProperties}
      />
    )
  }

  const { rank, suit } = props
  return (
    <div
      role="img"
      aria-label={cardLabel(rank, suit)}
      className={`${classes} ${isRedSuit(suit) ? styles.red : styles.black}`}
      style={style}
    >
      <span className={styles.rank} aria-hidden="true">
        {rank}
      </span>
      <svg
        className={styles.symbol}
        viewBox={`0 0 ${SYMBOL_VIEWBOX} ${SYMBOL_VIEWBOX}`}
        aria-hidden="true"
        focusable="false"
      >
        <path d={SUIT_PATHS[suit]} fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
