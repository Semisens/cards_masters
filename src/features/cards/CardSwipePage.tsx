import { useNavigate, useParams } from 'react-router'
import { Button } from '../../components/Button/Button.tsx'
import { Panel } from '../../components/Panel/Panel.tsx'
import { PlayingCard } from '../../components/PlayingCard/PlayingCard.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { useSwipe } from '../../core/useSwipe.ts'
import { deckPlan } from '../../data/deck.ts'
import { getGame } from '../../data/games.ts'
import { fr } from '../../i18n/fr.ts'
import { paths } from '../../routes.ts'
import { useMode } from '../../state/modeContext.ts'
import { NotFoundPage } from '../not-found/NotFoundPage.tsx'
import { useFromParty } from '../tutorial/useFlow.ts'
import styles from './CardSwipePage.module.css'

/**
 * Vue à balayer : on fait défiler les groupes de cartes à garder, un par écran, et chacun explique son rôle.
 * Ouverte sur le groupe touché dans la liste. Mode connaisseur : une ligne grise donne la carte d'origine.
 */
export function CardSwipePage() {
  const { gameId, groupe } = useParams()
  const { mode } = useMode()
  const navigate = useNavigate()
  const fromParty = useFromParty()
  const game = getGame(gameId)
  // Appelé dans tous les cas (règle des hooks) ; les gestes ne font rien tant que la page n'est pas valide.
  const groups = game ? deckPlan(game).groups : []
  const position = Number(groupe)
  const index = Number.isInteger(position) ? position - 1 : -1
  const valid = game !== undefined && index >= 0 && index < groups.length

  const goTo = (target: number) => {
    if (!game || target < 0 || target >= groups.length) return
    navigate(paths.group(game.id, target + 1, fromParty), { replace: true })
  }
  const swipe = useSwipe({ onNext: () => goTo(index + 1), onPrevious: () => goTo(index - 1) })

  if (!game) return <NotFoundPage message={fr.errors.gameNotFound} />
  if (!valid) return <NotFoundPage message={fr.errors.groupNotFound} />

  const group = groups[index]
  const isLast = index === groups.length - 1
  const listPath = paths.cards(game.id, fromParty)

  return (
    <Screen>
      <StepHeader backTo={listPath} quitTo={fromParty ? undefined : paths.game(game.id)} />
      {/* Le geste porte sur toute la zone : carte, points et explication. */}
      <div className={styles.zone} tabIndex={-1} {...swipe}>
        <div className={styles.counter}>
          {fr.cards.groupCounter(game.group_word ?? fr.cards.groupWord, index + 1, groups.length)}
        </div>

        <div className={styles.stage}>
          <button
            type="button"
            className={styles.chevron}
            aria-label={fr.cards.previousGroup}
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            ‹
          </button>
          <PlayingCard {...group.display} variant="focus" width="12.5rem" label={group.label} />
          <button
            type="button"
            className={styles.chevron}
            aria-label={fr.cards.nextGroup}
            disabled={isLast}
            onClick={() => goTo(index + 1)}
          >
            ›
          </button>
        </div>

        <div className={styles.dots} aria-hidden="true">
          {groups.map((g, i) => (
            <span key={g.label} className={i === index ? styles.dotActive : styles.dot} />
          ))}
        </div>

        <Panel>
          <b>{fr.cards.countAndShort(group.count, group.detail.title)}</b>
          <br />
          {group.detail.text}
          {mode === 'expert' && (
            <>
              <br />
              <br />
              <span className={styles.note}>
                {fr.cards.expertNote(
                  group.expert.original,
                  group.ranks.length > 1,
                  group.expert.power,
                  group.expert.name,
                )}
              </span>
            </>
          )}
        </Panel>
      </div>

      <Button block onClick={() => (isLast ? navigate(listPath) : goTo(index + 1))}>
        {isLast ? fr.nav.finish : fr.nav.next}
      </Button>
    </Screen>
  )
}
