import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'soleil' | 'cerise' | 'ciel' | 'blanc'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  /** Pleine largeur. */
  block?: boolean
  /** Petit bouton d'une ligne de liste (« Réactiver ») : 44 px de haut, relief de 4 px. */
  compact?: boolean
}

/** Bouton en relief (référence Ludo) : se « pose » au repos, s'enfonce quand on appuie. */
export function Button({
  variant = 'soleil',
  type = 'button',
  block = false,
  compact = false,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], block ? styles.block : '', compact ? styles.compact : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
