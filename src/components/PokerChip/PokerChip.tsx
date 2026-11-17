import type { CSSProperties } from 'react'
import type { TapisName } from '../../core/tokens.generated.ts'
import styles from './PokerChip.module.css'

const COLOR_NAMES: Record<TapisName, string> = {
  jaune: 'jaune',
  vert: 'vert',
  rouge: 'rouge',
  bleu: 'bleu',
}

export interface PokerChipProps {
  color: TapisName
  value: number | string
  /** Diamètre : toute longueur CSS. */
  size?: string
  className?: string
}

/** Jeton de poker : bord rayé blanc/couleur, liseré intérieur blanc 60 %, valeur en Fredoka 700. */
export function PokerChip({ color, value, size, className }: PokerChipProps) {
  const style = {
    '--chip-color': `var(--mc-tapis-${color})`,
    '--chip-text': `var(--mc-text-on-tapis-${color})`,
    '--chip-shadow': `var(--mc-tapis-${color}-ombre)`,
    ...(size ? { '--chip-size': size } : {}),
  } as CSSProperties

  return (
    <div
      role="img"
      aria-label={`Jeton ${COLOR_NAMES[color]}, valeur ${value}`}
      className={[styles.chip, className].filter(Boolean).join(' ')}
      style={style}
    >
      <span className={styles.face} aria-hidden="true">
        {value}
      </span>
    </div>
  )
}
