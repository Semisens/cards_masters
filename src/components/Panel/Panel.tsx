import type { ReactNode } from 'react'
import styles from './Panel.module.css'

export interface PanelProps {
  children: ReactNode
  /** Nom de la région pour les lecteurs d'écran (id d'un titre). */
  labelledBy?: string
  className?: string
}

/** Surface claire pour du texte dense (tableau, listes) sur le fond bleu : texte encre sur blanc. */
export function Panel({ children, labelledBy, className }: PanelProps) {
  return (
    <section className={[styles.panel, className].filter(Boolean).join(' ')} aria-labelledby={labelledBy}>
      {children}
    </section>
  )
}
