import type { ReactNode } from 'react'
import { Link } from 'react-router'
import styles from './PillLink.module.css'

export interface PillLinkProps {
  to: string
  children: ReactNode
  /** `nuit` : fond bleu nuit (« Quitter le tutoriel »). `soleil` : fond jaune, pour l'action à faire. */
  tone?: 'nuit' | 'soleil'
}

/** Pastille de 44 px de haut, bout arrondi : une action secondaire, placée dans un en-tête. */
export function PillLink({ to, children, tone = 'nuit' }: PillLinkProps) {
  return (
    <Link to={to} className={`${styles.pill} ${tone === 'soleil' ? styles.soleil : styles.nuit}`}>
      {children}
    </Link>
  )
}
