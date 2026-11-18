import { Button } from '../../components/Button/Button.tsx'
import { ButtonLink } from '../../components/Button/ButtonLink.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { Segmented } from '../../components/Segmented/Segmented.tsx'
import { games } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { useDoneTutorials } from '../../state/tutorial.ts'
import styles from './SettingsPage.module.css'

// Seul le français existe pour l'instant : les autres langues s'affichent, grisées.
const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English', disabled: true },
  { value: 'es', label: 'Español', disabled: true },
]

/** Réglages : la langue, les tutoriels passés (à réactiver), et le lien « À propos ». Aucun compte en v1. */
export function SettingsPage() {
  const { status, done, reactivate } = useDoneTutorials(games.map((game) => game.id))
  const doneGames = games.filter((game) => done.includes(game.id))

  return (
    <Screen tabs>
      <PageTitle>{fr.settings.title}</PageTitle>
      <span>{fr.settings.language}</span>
      <Segmented legend={fr.settings.language} options={LANGUAGES} value="fr" onChange={() => {}} />
      <p className={styles.note}>{fr.settings.languageSoon}</p>

      <Panel labelledBy="tutorials-title">
        <b id="tutorials-title">{fr.settings.tutorials}</b>
        {status === 'ready' && doneGames.length === 0 && <p className={styles.none}>{fr.settings.tutorialsNone}</p>}
        {doneGames.map((game) => (
          <div key={game.id} className={styles.row}>
            <span>{game.name}</span>
            <Button
              compact
              variant="soleil"
              aria-label={fr.settings.reactivateFor(game.name)}
              onClick={() => void reactivate(game.id)}
            >
              {fr.settings.reactivate}
            </Button>
          </div>
        ))}
      </Panel>

      <div className={styles.spacer} />
      <ButtonLink block variant="blanc" to={paths.about()}>
        {fr.settings.about}
      </ButtonLink>
    </Screen>
  )
}
