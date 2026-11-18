import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { ScoreStepper } from '../../components/ScoreStepper/ScoreStepper.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { fill } from '../../core/format.ts'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { endRound, hasWinner, MAX_SCORE } from '../../state/session.ts'
import { useSession } from '../../state/useSession.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import { useEndGame } from './useEndGame.ts'
import styles from './ScorePage.module.css'

/**
 * Saisie des scores, un compteur par joueur. Rien n'est enregistré avant la validation.
 * - Jeu sans manche (Trio) : les compteurs montrent le total de chacun, qu'on corrige.
 * - Jeu à manches (Love Letter) : les compteurs partent de zéro et donnent les points de la manche ; valider les
 *   ajoute aux scores et passe à la manche suivante. Si quelqu'un atteint le score visé, la partie est terminée.
 */
export function ScorePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = getGame(gameId)
  const { status, session, save } = useSession(gameId ?? '')
  const endGame = useEndGame(gameId ?? '')
  // Les valeurs modifiées ; tant qu'il n'y a pas eu de changement, on part des scores (ou de zéro, par manche).
  const [edited, setEdited] = useState<number[] | null>(null)

  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />
  if (status === 'loading') return null
  if (!session) return <Navigate to={paths.players(game.id)} replace />

  const { scoring } = game
  const values = edited ?? session.players.map((player) => (scoring.rounds ? 0 : player.score))

  const validate = async () => {
    if (!scoring.rounds) {
      await save({
        ...session,
        players: session.players.map((player, i) => ({ ...player, score: values[i] ?? player.score })),
      })
      navigate(paths.party(game.id))
      return
    }
    const next = endRound(session, values)
    if (hasWinner(next, scoring)) await endGame(next, 'finished')
    else {
      await save(next)
      navigate(paths.party(game.id))
    }
  }

  return (
    <Screen>
      <StepHeader backTo={paths.party(game.id)} />
      <PageTitle>{fill(scoring.title, { round: session.round })}</PageTitle>
      <p className={styles.question}>{scoring.question}</p>
      <Panel>
        {session.players.map((player, index) => (
          <ScoreStepper
            key={index}
            name={player.name}
            value={values[index] ?? 0}
            max={MAX_SCORE}
            unit={scoring.unit}
            onChange={(value) => setEdited(values.map((v, i) => (i === index ? value : v)))}
          />
        ))}
      </Panel>
      <div className={styles.spacer} />
      <Button block onClick={() => void validate()}>
        {scoring.validate}
      </Button>
    </Screen>
  )
}
