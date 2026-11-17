import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { newSession } from '../../state/session.ts'
import { useSession } from '../../state/useSession.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import styles from './PlayersPage.module.css'

/**
 * « Qui joue ? » : le nombre de joueurs (dans les limites du jeu) et leurs prénoms.
 * Écran ajouté : les maquettes montrent la partie en cours (Léa, Tom, Inès) mais pas sa création.
 */
export function PlayersPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = getGame(gameId)
  const { status, session, save } = useSession(gameId ?? '')
  // Les prénoms modifiés par l'utilisateur ; tant qu'il n'a rien changé, on part de la dernière partie
  // ou, à défaut, du minimum de joueurs du jeu avec des champs vides.
  const [edited, setEdited] = useState<string[] | null>(null)
  const initial = session
    ? session.players.map((p) => p.name)
    : Array.from({ length: game?.players.min ?? 0 }, () => '')
  const names = edited ?? initial
  const setNames = (update: (current: string[]) => string[]) => setEdited(update(names))

  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />
  if (status !== 'ready') return null

  const { min, max } = game.players
  const setCount = (count: number) => setNames((current) => Array.from({ length: count }, (_, i) => current?.[i] ?? ''))

  const start = async () => {
    await save(newSession(names, fr.players.defaultName))
    navigate(paths.party(game.id))
  }

  return (
    <Screen>
      <StepHeader backTo={paths.turn(game.id)} />
      <PageTitle>{fr.players.title}</PageTitle>
      <p className={styles.intro}>{fr.players.intro}</p>
      <Panel>
        <div className={styles.count}>
          <span className={styles.label}>{fr.players.count}</span>
          <button
            type="button"
            className={styles.round}
            aria-label={fr.players.fewer}
            disabled={names.length <= min}
            onClick={() => setCount(names.length - 1)}
          >
            −
          </button>
          <b className={styles.number} aria-live="polite">
            {names.length}
          </b>
          <button
            type="button"
            className={styles.round}
            aria-label={fr.players.more}
            disabled={names.length >= max}
            onClick={() => setCount(names.length + 1)}
          >
            +
          </button>
        </div>
        {names.map((name, index) => (
          <div key={index} className={styles.field}>
            <input
              className={styles.input}
              type="text"
              value={name}
              maxLength={20}
              autoComplete="off"
              placeholder={fr.players.defaultName(index + 1)}
              aria-label={fr.players.nameLabel(index + 1)}
              onChange={(event) =>
                setNames((current) => current?.map((n, i) => (i === index ? event.target.value : n)) ?? null)
              }
            />
          </div>
        ))}
      </Panel>
      <div className={styles.spacer} />
      <Button block onClick={() => void start()}>
        {fr.players.start}
      </Button>
    </Screen>
  )
}
