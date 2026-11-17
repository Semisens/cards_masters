import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'soleil' | 'cerise' | 'ciel' | 'blanc'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  /** Pleine largeur. */
  block?: boolean
}

/** Bouton en relief (référence Ludo) : se « pose » au repos, s'enfonce quand on appuie. */
export function Button({ variant = 'soleil', type = 'button', block = false, className, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], block ? styles.block : '', className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
