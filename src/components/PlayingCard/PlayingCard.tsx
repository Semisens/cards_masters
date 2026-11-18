import type { CSSProperties } from 'react'
import { cardLabel, isRedSuit, rankLetter, type Rank, type Suit } from '../../core/cards.ts'
import type { TapisName } from '../../core/tokens.generated.ts'
import { fr } from '../../i18n/fr.ts'
import { JOKER_PATH, SUIT_PATHS, SYMBOL_VIEWBOX } from './symbols.ts'
import styles from './PlayingCard.module.css'

/**
 * Variantes de carte :
 * - `standard` : la carte de la charte, avec son relief ;
 * - `list` : mini-carte des lignes de liste (maquettes Trio) : cadre bleu clair, sans relief, rang de 14 px ;
 * - `focus` : grande carte de la vue à balayer : cadre soleil, rang de 28 px ;
 * - `diagram` : carte visible du schéma de mise en place : cadre bleu clair, estompée, rang de 18 px.
 */
export type CardVariant = 'standard' | 'list' | 'focus' | 'diagram'

interface FaceUp {
  rank: Rank
  suit: Suit
  joker?: undefined
  faceDown?: false
  variant?: CardVariant
}

/** Un joker : une étoile, sans rang ni couleur. */
interface Joker {
  joker: true
  faceDown?: false
  variant?: CardVariant
}

interface FaceDown {
  faceDown: true
  /** Couleur de la pioche : un des tapis de la charte. */
  back?: TapisName
  /** Couleur de pioche libre (CSS), pour un jeu à fond libre. Prime sur `back`. */
  backColor?: string
}

export type PlayingCardProps = (FaceUp | Joker | FaceDown) & {
  /** Largeur de la carte : toute longueur CSS (par défaut, définie dans la feuille de style). */
  width?: string
  className?: string
  /** Style en ligne (variables CSS de placement). */
  style?: CSSProperties
  /** Libellé pour lecteurs d'écran, à la place du libellé automatique (ex. « As, 3 cartes »). */
  label?: string
}

/** Carte à jouer : rang seul en haut à gauche, un seul grand symbole centré, rouge ou noir uniquement. */
export function PlayingCard(props: PlayingCardProps) {
  const style = props.width ? ({ '--card-w': props.width } as CSSProperties) : undefined
  const classes = [styles.card, props.className].filter(Boolean).join(' ')

  if (props.faceDown) {
    const backColor =
      props.backColor ?? (props.back ? `var(--mc-tapis-${props.back})` : 'var(--game-card-back, var(--mc-tapis-bleu))')
    return (
      <div
        role="img"
        aria-label="Dos de carte"
        className={`${classes} ${styles.back}`}
        style={{ ...style, ...props.style, '--back-color': backColor } as CSSProperties}
      />
    )
  }

  const label = props.label ?? (props.joker ? fr.cards.jokerLabel : cardLabel(props.rank, props.suit))
  const color = !props.joker && isRedSuit(props.suit) ? styles.red : styles.black
  return (
    <div
      role="img"
      aria-label={label}
      className={`${classes} ${color} ${props.variant === 'list' ? styles.list : ''} ${props.variant === 'focus' ? styles.focus : ''} ${props.variant === 'diagram' ? styles.diagram : ''}`}
      style={{ ...style, ...props.style }}
    >
      {!props.joker && (
        <span className={styles.rank} aria-hidden="true">
          {rankLetter(props.rank)}
        </span>
      )}
      <svg
        className={styles.symbol}
        viewBox={`0 0 ${SYMBOL_VIEWBOX} ${SYMBOL_VIEWBOX}`}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={props.joker ? JOKER_PATH : SUIT_PATHS[props.suit]}
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
