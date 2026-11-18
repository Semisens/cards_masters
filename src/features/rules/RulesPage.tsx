import { useParams } from 'react-router'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import { useFromParty } from '../tutorial/useFlow.ts'
import styles from './RulesPage.module.css'

/**
 * Règles complètes : toutes les sections sur une seule carte, pour s'y retrouver en un coup d'œil.
 * Quand les règles dépassent l'écran, la carte défile dans son cadre : la page, elle, ne bouge pas.
 */
export function RulesPage() {
  const { gameId } = useParams()
  const fromParty = useFromParty()
  const game = getGame(gameId)
  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />

  return (
    <Screen fixed>
      <StepHeader backTo={fromParty ? paths.party(game.id) : paths.game(game.id)} />
      <PageTitle>{fr.rules.title}</PageTitle>
      <Panel className={styles.panel}>
        {game.full_rules.map((section) => (
          <div key={section.title} className={styles.section}>
            <b className={styles.title}>{section.title}</b>
            <br />
            {section.text}
          </div>
        ))}
      </Panel>
    </Screen>
  )
}
