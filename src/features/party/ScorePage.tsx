import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { ScoreStepper } from '../../components/ScoreStepper/ScoreStepper.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { MAX_TRIOS } from '../../state/session.ts'
import { useSession } from '../../state/useSession.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import styles from './ScorePage.module.css'

/** « Trios gagnés » : un compteur par joueur. Rien n'est enregistré avant « Valider ». */
export function ScorePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = getGame(gameId)
  const { status, session, save } = useSession(gameId ?? '')
  // Les scores modifiés ; tant qu'il n'y a pas eu de changement, ce sont ceux de la partie.
  const [edited, setEdited] = useState<number[] | null>(null)
  const scores = edited ?? session?.players.map((p) => p.trios) ?? []

  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />
  if (status === 'loading') return null
  if (!session) return <Navigate to={paths.players(game.id)} replace />

  const validate = async () => {
    await save({ players: session.players.map((player, i) => ({ ...player, trios: scores[i] ?? player.trios })) })
    navigate(paths.party(game.id))
  }

  return (
    <Screen>
      <StepHeader backTo={paths.party(game.id)} />
      <PageTitle>{fr.scores.title}</PageTitle>
      <p className={styles.question}>{fr.scores.question}</p>
      <Panel>
        {session.players.map((player, index) => (
          <ScoreStepper
            key={index}
            name={player.name}
            value={scores[index] ?? 0}
            max={MAX_TRIOS}
            onChange={(value) => setEdited(scores.map((s, i) => (i === index ? value : s)))}
          />
        ))}
      </Panel>
      <div className={styles.spacer} />
      <Button block onClick={() => void validate()}>
        {fr.scores.validate}
      </Button>
    </Screen>
  )
}
