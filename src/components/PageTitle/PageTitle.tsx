import type { ReactNode } from 'react'
import styles from './PageTitle.module.css'

/** Titre d'écran des maquettes : Fredoka 600, 32 px. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.title}>{children}</h1>
}
