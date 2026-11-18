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

/** « Mise en place » : un schéma (ta main, le centre) et les étapes numérotées. */
export function SetupPage() {
  const { gameId } = useParams()
  const fromParty = useFromParty()
  const game = getGame(gameId)
  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />

  const { setup } = game.tutorial
  return (
    <Screen>
      <StepHeader
        backTo={fromParty ? paths.party(game.id) : paths.cards(game.id)}
        quitTo={fromParty ? undefined : paths.game(game.id)}
      />
      <PageTitle>{setup.title}</PageTitle>
      <PileDiagram items={setup.diagram} />
      <Panel>
        {setup.steps.map((step, index) => (
          <div key={step}>
            <b>{index + 1}.</b> {step}
          </div>
        ))}
      </Panel>
      <div style={{ flex: 1 }} />
      {fromParty ? (
        <ButtonLink block to={paths.party(game.id)}>
          {fr.nav.backToParty}
        </ButtonLink>
      ) : (
        <ButtonLink block to={paths.turn(game.id)}>
          {fr.nav.next}
        </ButtonLink>
      )}
    </Screen>
  )
}
