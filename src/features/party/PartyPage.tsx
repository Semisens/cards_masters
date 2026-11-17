import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { ButtonLink } from '../../components/Button/ButtonLink.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { PlayerChip } from '../../components/PlayerChip/PlayerChip.tsx'
import { ResourceTile } from '../../components/ResourceTile/ResourceTile.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { getGame } from '../../data/games.ts'
import { resolveGameTheme } from '../../data/theme.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { useSession } from '../../state/useSession.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import { playerColor } from './playerColors.ts'
import styles from './PartyPage.module.css'

/** Partie en cours : les jetons des joueurs et leurs trios, des raccourcis vers les règles, et la saisie des scores. */
export function PartyPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = getGame(gameId)
  const { status, session, end } = useSession(gameId ?? '')

  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />
  if (status === 'loading') return null
  // Pas de partie en cours : on commence par dire qui joue.
  if (!session) return <Navigate to={paths.players(game.id)} replace />

  const theme = resolveGameTheme(game)
  const finish = async () => {
    await end()
    navigate(paths.game(game.id))
  }

  return (
    <Screen solid={theme.background}>
      <div className={styles.top}>
        <Link to={paths.game(game.id)} className={styles.quit}>
          <span aria-hidden="true">‹ </span>
          {fr.nav.back}
        </Link>
        <span>{fr.party.scoreLabel}</span>
      </div>
      <PageTitle>{fr.party.title}</PageTitle>

      <div className={styles.players} role="group" aria-label={fr.party.players}>
        {session.players.map((player, index) => {
          const { color, text } = playerColor(index)
          return <PlayerChip key={index} name={player.name} score={player.trios} color={color} textColor={text} />
        })}
      </div>

      <div className={styles.tiles}>
        <ResourceTile to={paths.rules(game.id, true)} icon="rules" accent={theme.background} shadow={theme.shadow}>
          {fr.party.rules}
        </ResourceTile>
        <ResourceTile to={paths.setup(game.id, true)} icon="setup" accent={theme.background} shadow={theme.shadow}>
          {fr.party.setup}
        </ResourceTile>
        <ResourceTile to={paths.cards(game.id, true)} icon="cards" accent={theme.background} shadow={theme.shadow}>
          {fr.party.cards}
        </ResourceTile>
        <ResourceTile to={paths.turn(game.id, true)} icon="turn" accent={theme.background} shadow={theme.shadow}>
          {fr.party.turn}
        </ResourceTile>
      </div>

      <div className={styles.spacer} />
      <ButtonLink block to={paths.scores(game.id)}>
        {fr.party.enterScores}
      </ButtonLink>
      <Button
        block
        variant="blanc"
        style={{ '--btn-fg': theme.background, '--btn-shadow': theme.shadow } as React.CSSProperties}
        onClick={() => void finish()}
      >
        {fr.party.end}
      </Button>
    </Screen>
  )
}
