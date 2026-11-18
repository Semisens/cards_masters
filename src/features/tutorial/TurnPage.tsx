import { useParams } from 'react-router'
import { ButtonLink } from '../../components/Button/ButtonLink.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { PileDiagram } from '../../components/PileDiagram/PileDiagram.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import { useFromParty } from './useFlow.ts'
import styles from './TurnPage.module.css'

/** « Un tour de jeu » : les étapes d'un tour, la façon de gagner, puis « Jouer » (qui joue ?). */
export function TurnPage() {
  const { gameId } = useParams()
  const fromParty = useFromParty()
  const game = getGame(gameId)
  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />

  const { turn } = game.tutorial
  return (
    <Screen>
      <StepHeader
        backTo={fromParty ? paths.party(game.id) : paths.setup(game.id)}
        quitTo={fromParty ? undefined : paths.game(game.id)}
      />
      <PageTitle>{turn.title}</PageTitle>
      {turn.diagram && <PileDiagram items={turn.diagram} />}
      <Panel>
        {turn.steps.map((step, index) => (
          <p key={step.label} className={styles.step}>
            <b>
              {index + 1}. {step.label}
            </b>{' '}
            {step.text}
          </p>
        ))}
      </Panel>
      <Panel>
        <b>{turn.win.title}</b>
        <br />
        {turn.win.text}
      </Panel>
      <div className={styles.spacer} />
      {fromParty ? (
        <ButtonLink block to={paths.party(game.id)}>
          {fr.nav.backToParty}
        </ButtonLink>
      ) : (
        // Arrivé au bout du tutoriel : la prochaine fois, « Jouer » ira droit à « Qui joue ? ».
        <ButtonLink block to={paths.players(game.id)}>
          {fr.nav.play}
        </ButtonLink>
      )}
    </Screen>
  )
}
