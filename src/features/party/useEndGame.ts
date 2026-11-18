import { useNavigate } from 'react-router'
import { paths } from '../../routes.ts'
import type { GameStatus } from '../../state/history.ts'
import type { Session } from '../../state/session.ts'
import { useHistory } from '../../state/useHistory.ts'
import { useSession } from '../../state/useSession.ts'

/**
 * Termine la partie d'un jeu : l'archive dans l'historique (terminée ou interrompue), efface la partie en cours,
 * puis ouvre le podium.
 */
export function useEndGame(gameId: string) {
  const navigate = useNavigate()
  const { end } = useSession(gameId)
  const { add } = useHistory()

  return async (session: Session, status: GameStatus) => {
    const now = new Date()
    const id = String(now.getTime())
    await add({ id, gameId, date: now.toISOString(), status, players: session.players })
    await end()
    navigate(paths.results(gameId, id), { replace: true })
  }
}
