import { Link } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx'
import { GameTile } from '../../components/GameTile/GameTile.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { games } from '../../data/games.ts'
import { paths } from '../../routes.ts'
import { fr } from '../../i18n/fr.ts'
import { useStoredFlag } from '../../state/useStoredFlag.ts'
import styles from './HomePage.module.css'

/** Accueil : le titre et le choix du jeu. Le mode de lecture se choisit ensuite, sur la page du jeu. */
export function HomePage() {
  // Premier lancement : un mot de bienvenue, une seule fois. `null` = pas encore lu, on n'affiche rien.
  const [welcomed, setWelcomed] = useStoredFlag('welcomed')

  return (
    <Screen>
      <header className={styles.header}>
        <h1 className={styles.title}>{fr.home.title}</h1>
        <p className={styles.lead}>{fr.home.lead}</p>
      </header>

      {welcomed === false && (
        <Panel labelledBy="welcome-title">
          <h2 id="welcome-title" className={styles.welcomeTitle}>
            {fr.home.welcomeTitle}
          </h2>
          <p className={styles.welcomeText}>{fr.home.welcomeText}</p>
          <Button variant="soleil" onClick={() => setWelcomed(true)}>
            {fr.home.welcomeDismiss}
          </Button>
        </Panel>
      )}

      <section className={styles.section} aria-labelledby="games-title">
        <h2 id="games-title" className={styles.sectionTitle}>
          {fr.home.gamesTitle}
        </h2>
        {games.length === 0 ? (
          <EmptyState title={fr.home.emptyTitle} text={fr.home.emptyText} />
        ) : (
          <ul className={styles.list}>
            {games.map((game) => (
              <li key={game.id}>
                <GameTile game={game} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className={styles.footer}>
        <Link to={paths.about()} className={styles.link}>
          {fr.home.about}
        </Link>
      </footer>
    </Screen>
  )
}
