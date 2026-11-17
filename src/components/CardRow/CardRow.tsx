import type { ReactNode } from 'react'
import styles from './CardRow.module.css'

export interface CardRowProps {
  children: ReactNode
  /** Lecteurs d'écran : ce que montre la rangée. */
  label?: string
  /** Chevauche les cartes comme une main éventail. */
  overlap?: boolean
  className?: string
}

/** Rangée de cartes, qui passe à la ligne quand l'écran est trop étroit. */
export function CardRow({ children, label, overlap = false, className }: CardRowProps) {
  return (
    <div
      className={[styles.row, overlap ? styles.overlap : '', className].filter(Boolean).join(' ')}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {children}
    </div>
  )
}
