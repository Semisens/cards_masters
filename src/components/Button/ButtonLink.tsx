import { Link, type LinkProps } from 'react-router'
import type { ButtonVariant } from './Button.tsx'
import styles from './Button.module.css'

export interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  /** Pleine largeur. */
  block?: boolean
}

/** Lien qui a l'apparence d'un bouton en relief (même feuille de style que `Button`). */
export function ButtonLink({ variant = 'soleil', block = false, className, ...rest }: ButtonLinkProps) {
  return (
    <Link
      className={[styles.button, styles.link, styles[variant], block ? styles.block : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
