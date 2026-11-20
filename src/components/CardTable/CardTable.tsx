import type { CardLayout, DeckCard, DiagramItem, TurnReveal } from '../../data/types.ts'
import { CardPile } from '../CardPile/CardPile.tsx'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './CardTable.module.css'

export interface CardTableProps {
  /** Ta main, en bas, légendée : sa disposition vaut pour les quatre mains de la table. */
  hand: DiagramItem
  /** Ce qui est au centre : pioche, cartes alignées, carte écartée… */
  center: DiagramItem[]
  /** « Un tour » : les cartes retournées. La table, elle, ne change pas (mêmes dimensions, mêmes positions). */
  reveal?: TurnReveal
}

interface CardsProps {
  layout?: CardLayout
  card?: DeckCard
  label?: string
  reveal?: DeckCard
  width: string
}

/** Les cartes d'un emplacement : une carte visible si le jeu en donne une, sinon des dos (dont une peut être retournée). */
function Cards({ layout, card, label, reveal, width }: CardsProps) {
  if (card) return <PlayingCard rank={card.rank} suit={card.suit} variant="table" width={width} label={label} />
  return <CardPile layout={layout} reveal={reveal} width={width} className={styles.hand} />
}

/** La carte découverte posée à côté de la main d'un autre joueur (un tour) : hors du flux, rien ne bouge. */
function Played({ card }: { card?: DeckCard }) {
  if (!card) return null
  return (
    <PlayingCard
      rank={card.rank}
      suit={card.suit}
      variant="table"
      width="var(--hand-card-w)"
      className={styles.played}
    />
  )
}

/**
 * La table vue de haut, la même sur la mise en place et sur un tour : quatre mains de dos (en face, à gauche, à droite,
 * et la tienne en bas, légendée) autour de ce que le jeu pose au centre. Sur un tour, quelques cartes sont de face
 * (`reveal`) : retournées, ta main, ou posées à côté de la main d'un autre joueur ; rien d'autre ne bouge. Les quatre
 * mains sont à la même distance des cartes du centre, quelle que soit la légende. Les dos portent la couleur du jeu.
 */
export function CardTable({ hand, center, reveal }: CardTableProps) {
  const layout = hand.card ? 'single' : hand.layout
  const yourHand = reveal?.hand
  return (
    <div className={styles.table}>
      <div className={`${styles.seat} ${styles.top}`}>
        <Cards layout={layout} reveal={reveal?.across} width="var(--hand-card-w)" />
        <Played card={reveal?.played?.across} />
      </div>
      <div className={`${styles.seat} ${styles.left}`}>
        <Cards layout={layout} width="var(--hand-card-w)" />
        <Played card={reveal?.played?.left} />
      </div>
      <div className={`${styles.seat} ${styles.right}`}>
        <Cards layout={layout} width="var(--hand-card-w)" />
        <Played card={reveal?.played?.right} />
      </div>

      <div className={styles.center}>
        {center.map((item, index) => (
          // Le reflet invisible de la légende (data-label) place les cartes au milieu exact de leur case.
          <div key={item.label} className={styles.item} data-label={item.label}>
            <div className={styles.visual}>
              <Cards {...item} reveal={reveal?.center?.[index]} width="var(--center-card-w)" />
            </div>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className={`${styles.seat} ${styles.bottom}`}>
        {yourHand ? (
          // Ta main pendant le tour, de face : en éventail si elle a plusieurs cartes.
          <CardPile
            layout={yourHand.length > 1 ? 'spread' : 'single'}
            faces={yourHand}
            width="var(--hand-card-w)"
            className={styles.hand}
          />
        ) : (
          <Cards layout={layout} width="var(--hand-card-w)" />
        )}
        {hand.label}
      </div>
    </div>
  )
}
