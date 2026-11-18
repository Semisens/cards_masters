import type { DiagramItem } from '../../data/types.ts'
import { CardPile } from '../CardPile/CardPile.tsx'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './PileDiagram.module.css'

export interface PileDiagramProps {
  items: DiagramItem[]
}

/**
 * Schéma de cartes (mise en place, un tour) : chaque élément (« Pioche », « Ta main »…) est figuré par des cartes de
 * dos, à la couleur de dos du jeu (une carte, une pile, un éventail : `layout`), ou par une carte visible quand le
 * jeu en donne une (« Posée devant toi »).
 */
export function PileDiagram({ items }: PileDiagramProps) {
  return (
    <div className={styles.diagram}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.visual}>
            {item.card ? (
              <PlayingCard
                rank={item.card.rank}
                suit={item.card.suit}
                variant="diagram"
                width="3.5rem"
                label={item.label}
              />
            ) : (
              <CardPile layout={item.layout} />
            )}
          </div>
          {item.label}
        </div>
      ))}
    </div>
  )
}
