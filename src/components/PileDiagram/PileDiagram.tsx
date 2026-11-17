import styles from './PileDiagram.module.css'

export interface PileDiagramProps {
  hand: string
  center: string
}

/** Schéma de la mise en place : « ta main, triée » et « au centre, cachées », chacune figurée par un dos de carte. */
export function PileDiagram({ hand, center }: PileDiagramProps) {
  return (
    <div className={styles.diagram}>
      <div className={styles.item}>
        <div className={styles.back} aria-hidden="true" />
        {hand}
      </div>
      <div className={styles.item}>
        <div className={styles.back} aria-hidden="true" />
        {center}
      </div>
    </div>
  )
}
