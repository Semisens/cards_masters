import { useCallback, useEffect, useState } from 'react'
import { storage } from '../core/storage.ts'
import { useStoredFlag } from './useStoredFlag.ts'

/** Clé de stockage du drapeau « tutoriel passé » d'un jeu. */
export const tutorialKey = (gameId: string) => `tutorial:${gameId}`

/** Le tutoriel d'un jeu a-t-il été parcouru jusqu'au bout ? `null` tant que le stockage n'a pas répondu. */
export function useTutorialDone(gameId: string): [done: boolean | null, set: (done: boolean) => void] {
  return useStoredFlag(tutorialKey(gameId))
}

export interface UseDoneTutorials {
  status: 'loading' | 'ready'
  /** Les jeux dont le tutoriel a été passé, dans l'ordre demandé. */
  done: string[]
  /** Réactive le tutoriel d'un jeu : « Jouer » repassera par lui. */
  reactivate: (gameId: string) => Promise<void>
}

/** Les tutoriels passés parmi une liste de jeux. */
export function useDoneTutorials(gameIds: string[]): UseDoneTutorials {
  const [state, setState] = useState<{ status: 'loading' | 'ready'; done: string[] }>({ status: 'loading', done: [] })
  const key = gameIds.join('|')

  useEffect(() => {
    let cancelled = false
    void Promise.all(gameIds.map((id) => storage.get(tutorialKey(id)))).then((values) => {
      if (!cancelled) setState({ status: 'ready', done: gameIds.filter((_, i) => values[i] === '1') })
    })
    return () => {
      cancelled = true
    }
    // `key` résume `gameIds` : on ne relit que si la liste change vraiment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const reactivate = useCallback(async (gameId: string) => {
    setState((current) => ({ ...current, done: current.done.filter((id) => id !== gameId) }))
    await storage.set(tutorialKey(gameId), '0')
  }, [])

  return { ...state, reactivate }
}
