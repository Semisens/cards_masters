import styles from './GhostCard.module.css'

/** Carte du jeu d'origine, en pointillés : « 2–6 », « 11 »… Décorative, le texte de la ligne dit la même chose. */
export function GhostCard({ label }: { label: string }) {
  return (
    <span className={styles.ghost} aria-hidden="true">
      <span className={styles.label}>{label}</span>
      <svg className={styles.circle} viewBox="0 0 24 24" fill="none" stroke="currentColor" focusable="false">
        <circle cx="12" cy="12" r="8" />
      </svg>
    </span>
  )
}
