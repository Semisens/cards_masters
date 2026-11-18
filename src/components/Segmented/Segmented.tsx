import { useId } from 'react'
import styles from './Segmented.module.css'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  /** Option non disponible : visible mais grisée, impossible à choisir. */
  disabled?: boolean
}

export interface SegmentedProps<T extends string> {
  /** Nom du groupe, lu par les lecteurs d'écran. */
  legend: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
}

/** Bascule à plusieurs choix (mode de lecture, langue). De vrais boutons radio : clavier et lecteur d'écran gratuits. */
export function Segmented<T extends string>({ legend, options, value, onChange }: SegmentedProps<T>) {
  const name = useId()
  return (
    <fieldset className={styles.toggle}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
