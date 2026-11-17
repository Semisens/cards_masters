import { Link } from 'react-router'
import { fr } from '../../i18n/fr.ts'
import type { Game } from '../../data/types.ts'
import { resolveGameTheme } from '../../data/theme.ts'
import { themeStyle } from '../../data/themeStyle.ts'
import { paths } from '../../routes.ts'
import { GameLogo } from '../GameLogo/GameLogo.tsx'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './GameTile.module.css'

export interface GameTileProps {
  game: Game
}

/** Vignette d'un jeu sur l'accueil : tapis, logo ou initiale, nom dans sa police, joueurs et durée. */
export function GameTile({ game }: GameTileProps) {
  const theme = resolveGameTheme(game)
  return (
    <Link to={paths.game(game.id)} className={styles.tile} style={themeStyle(theme)}>
      <GameLogo game={game} />
      <span className={styles.text}>
        <span className={styles.name}>{game.name}</span>
        <span className={styles.meta}>{fr.game.facts(game.players.min, game.players.max, game.duration_min)}</span>
      </span>
      <span className={styles.pile} aria-hidden="true">
        <PlayingCard faceDown backColor={theme.background} width="3.2rem" />
      </span>
    </Link>
  )
}
