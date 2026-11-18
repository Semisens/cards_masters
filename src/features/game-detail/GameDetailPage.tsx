import { useParams } from 'react-router'
import { ButtonLink } from '../../components/Button/ButtonLink.tsx'
import { GameBand } from '../../components/GameBand/GameBand.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import styles from './GameDetailPage.module.css'

/**
 * Page d'un jeu : bandeau à ses couleurs, sa phrase d'accroche, puis « Jouer » (le tutoriel et la partie)
 * ou « Règles complètes ».
 */
export function GameDetailPage() {
  const { gameId } = useParams()
  const game = getGame(gameId)
  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />

  return (
    <Screen bare>
      <GameBand game={game} backTo={paths.home()} />
      <div className={styles.body}>
        <Panel>
          <b>{game.tagline}</b>
          <br />
          {game.description}
        </Panel>
        <div className={styles.spacer} />
        {/* Tutoriel déjà passé : on va droit à « Qui joue ? » (il se réactive dans les Réglages). */}
        <ButtonLink block to={paths.cards(game.id)}>
          {fr.game.play}
        </ButtonLink>
        <ButtonLink block variant="blanc" to={paths.rules(game.id)}>
          {fr.game.fullRules}
        </ButtonLink>
      </div>
    </Screen>
  )
}
