import { logoUrl } from '../../data/games.ts'
import type { Game } from '../../data/types.ts'
import styles from './GameLogo.module.css'

export interface GameLogoProps {
  game: Pick<Game, 'id' | 'name' | 'logo'>
  className?: string
}

/** Logo du jeu (original ou redessiné). À défaut, l'initiale du nom dans un rond blanc. */
export function GameLogo({ game, className }: GameLogoProps) {
  const url = logoUrl(game)
  return (
    <span className={[styles.logo, className].filter(Boolean).join(' ')} aria-hidden="true">
      {url ? (
        <img className={styles.image} src={url} alt="" />
      ) : (
        <span className={styles.initial}>{game.name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  )
}
