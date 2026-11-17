import type { ReactNode } from 'react'
import styles from './Notice.module.css'

/** Bandeau jaune d'information (ex. « Retire les carreaux et les rois. Garde 36 cartes. »). */
export function Notice({ children }: { children: ReactNode }) {
  return <p className={styles.notice}>{children}</p>
}
