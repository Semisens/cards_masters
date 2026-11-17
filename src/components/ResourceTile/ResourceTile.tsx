import type { CSSProperties, ReactElement } from 'react'
import { Link } from 'react-router'
import styles from './ResourceTile.module.css'

export type ResourceIcon = 'rules' | 'setup' | 'cards' | 'turn'

const ICONS: Record<ResourceIcon, ReactElement> = {
  rules: <path d="M5 4h14v16H5zM9 9h6M9 13h6" />,
  setup: <path d="M4 12h16M12 4v16" />,
  cards: <rect x="6" y="3" width="12" height="18" rx="2" />,
  turn: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
}

export interface ResourceTileProps {
  to: string
  icon: ResourceIcon
  children: string
  /** Couleur de l'icône (celle du tapis). */
  accent: string
  /** Couleur du relief (l'ombre du tapis). */
  shadow: string
}

/** Tuile de raccourci de la partie en cours : une icône et un mot sur fond blanc, relief de la couleur du tapis. */
export function ResourceTile({ to, icon, children, accent, shadow }: ResourceTileProps) {
  return (
    <Link to={to} className={styles.tile} style={{ '--tile-accent': accent, '--tile-shadow': shadow } as CSSProperties}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        {ICONS[icon]}
      </svg>
      {children}
    </Link>
  )
}
