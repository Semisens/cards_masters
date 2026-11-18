import type { DiagramItem } from '../../data/types.ts'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './PileDiagram.module.css'

export interface PileDiagramProps {
  items: DiagramItem[]
}

/**
 * Schéma de la mise en place : chaque élément (« Ta main, triée », « Pioche »…) est figuré par un dos de carte,
 * ou par une carte visible quand le jeu en donne une (« Visibles (2 joueurs) »).
 */
export function PileDiagram({ items }: PileDiagramProps) {
  return (
    <div className={styles.diagram}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          {item.card ? (
            <div className={styles.face}>
              <PlayingCard
                rank={item.card.rank}
                suit={item.card.suit}
                variant="diagram"
                width="3.5rem"
                label={item.label}
              />
            </div>
          ) : (
            <div className={styles.back} aria-hidden="true" />
          )}
          {item.label}
        </div>
      ))}
    </div>
  )
}
