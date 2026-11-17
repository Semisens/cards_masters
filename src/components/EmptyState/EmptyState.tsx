import type { ReactNode } from 'react'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  title: string
  text: string
  /** Bouton ou lien pour s'en sortir. */
  action?: ReactNode
}

/** État vide ou erreur : une pioche, un titre, une phrase et une sortie. */
export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className={styles.state} role="status">
      <PlayingCard faceDown back="jaune" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  )
}
