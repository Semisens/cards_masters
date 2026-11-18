import { useCallback, useEffect, useState } from 'react'
import { storage } from '../core/storage.ts'
import { HISTORY_KEY, parseHistory, withEntry, type HistoryEntry } from './history.ts'

export interface UseHistory {
  status: 'loading' | 'ready'
  /** Les parties passées, la plus récente d'abord. */
  entries: HistoryEntry[]
  /** Ajoute une partie. Relit le stockage avant d'écrire : deux écrans ne s'écrasent pas. */
  add: (entry: HistoryEntry) => Promise<void>
}

/** L'historique des parties, mémorisé sur l'appareil. */
export function useHistory(): UseHistory {
  const [state, setState] = useState<{ status: 'loading' | 'ready'; entries: HistoryEntry[] }>({
    status: 'loading',
    entries: [],
  })

  useEffect(() => {
    let cancelled = false
    void storage.get(HISTORY_KEY).then((raw) => {
      if (!cancelled) setState({ status: 'ready', entries: parseHistory(raw) })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const add = useCallback(async (entry: HistoryEntry) => {
    const entries = withEntry(parseHistory(await storage.get(HISTORY_KEY)), entry)
    setState({ status: 'ready', entries })
    await storage.set(HISTORY_KEY, JSON.stringify(entries))
  }, [])

  return { ...state, add }
}
