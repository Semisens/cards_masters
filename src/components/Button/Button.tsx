import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'soleil' | 'cerise' | 'ciel'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

/** Bouton en relief (référence Ludo) : se « pose » au repos, s'enfonce quand on appuie. */
export function Button({ variant = 'soleil', type = 'button', className, ...rest }: ButtonProps) {
  return (
    <button type={type} className={[styles.button, styles[variant], className].filter(Boolean).join(' ')} {...rest} />
  )
}
