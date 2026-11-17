import { isRedSuit, type Suit } from '../../core/cards.ts'
import { SUIT_PATHS, SYMBOL_VIEWBOX } from '../PlayingCard/symbols.ts'
import styles from './SuitIcon.module.css'

export interface SuitIconProps {
  suit: Suit
  /** Nom lisible par un lecteur d'écran, ex. « cœur ». Absent : icône décorative. */
  label?: string
  className?: string
}

/** Petit symbole de couleur (♠ ♥ ♦ ♣) en vectoriel, de la taille du texte qui l'entoure. */
export function SuitIcon({ suit, label, className }: SuitIconProps) {
  return (
    <svg
      className={[styles.icon, isRedSuit(suit) ? styles.red : styles.black, className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${SYMBOL_VIEWBOX} ${SYMBOL_VIEWBOX}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={SUIT_PATHS[suit]} fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  )
}
