import { useId } from 'react'
import type { ReadingMode } from '../../data/types.ts'
import { fr } from '../../i18n/fr.ts'
import styles from './ModeToggle.module.css'

export interface ModeToggleProps {
  mode: ReadingMode
  onChange: (mode: ReadingMode) => void
}

const OPTIONS: ReadingMode[] = ['classic', 'expert']

/** Bascule Classique / Connaisseur. De vrais boutons radio : clavier et lecteur d'écran gratuits. */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const name = useId()
  return (
    <fieldset className={styles.toggle}>
      <legend className={styles.legend}>{fr.mode.legend}</legend>
      {OPTIONS.map((option) => (
        <label key={option} className={styles.option}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            value={option}
            checked={mode === option}
            onChange={() => onChange(option)}
          />
          <span className={styles.label}>{fr.mode[option]}</span>
        </label>
      ))}
    </fieldset>
  )
}
