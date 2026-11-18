import type { ReactNode } from 'react'
import styles from '../PillLink/PillLink.module.css'

export interface PillButtonProps {
  onClick: () => void
  children: ReactNode
  /** `nuit` : fond bleu nuit. `soleil` : fond jaune, pour l'action à faire. */
  tone?: 'nuit' | 'soleil'
}

/**
 * Pastille de 44 px de haut, bout arrondi, comme `PillLink`, mais pour une action qui n'est pas une adresse
 * (par exemple « Passer cette étape », qui enregistre avant de naviguer). Elle partage le style de `PillLink`.
 */
export function PillButton({ onClick, children, tone = 'nuit' }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.pill} ${tone === 'soleil' ? styles.soleil : styles.nuit}`}
    >
      {children}
    </button>
  )
}
