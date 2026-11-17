import { useCallback, useEffect, useState } from 'react'
import { storage } from '../core/storage.ts'
import { parseSession, sessionKey, type Session } from './session.ts'

export interface UseSession {
  /** `loading` tant que le stockage n'a pas répondu : l'écran n'affiche rien plutôt que de clignoter. */
  status: 'loading' | 'ready'
  /** La partie en cours, ou `null` s'il n'y en a pas. */
  session: Session | null
  save: (session: Session) => Promise<void>
  end: () => Promise<void>
}

/** La partie en cours d'un jeu, mémorisée sur l'appareil (aucun compte, aucun réseau). */
export function useSession(gameId: string): UseSession {
  const [state, setState] = useState<{ status: 'loading' | 'ready'; session: Session | null }>({
    status: 'loading',
    session: null,
  })

  useEffect(() => {
    let cancelled = false
    void storage.get(sessionKey(gameId)).then((raw) => {
      if (!cancelled) setState({ status: 'ready', session: parseSession(raw) })
    })
    return () => {
      cancelled = true
    }
  }, [gameId])

  const save = useCallback(
    async (session: Session) => {
      setState({ status: 'ready', session })
      await storage.set(sessionKey(gameId), JSON.stringify(session))
    },
    [gameId],
  )

  const end = useCallback(async () => {
    setState({ status: 'ready', session: null })
    await storage.remove(sessionKey(gameId))
  }, [gameId])

  return { ...state, save, end }
}
