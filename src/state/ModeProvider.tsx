import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { storage } from '../core/storage.ts'
import type { ReadingMode } from '../data/types.ts'
import { ModeContext } from './modeContext.ts'

const STORAGE_KEY = 'mode'
const DEFAULT_MODE: ReadingMode = 'classic'

const isMode = (value: string | null): value is ReadingMode => value === 'classic' || value === 'expert'

/** Mode de lecture global (Classique / Connaisseur), mémorisé d'une visite à l'autre. */
export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ReadingMode>(DEFAULT_MODE)
  // Vrai dès que l'utilisateur a choisi lui-même un mode : la valeur lue dans le stockage ne doit plus l'écraser.
  const chosen = useRef(false)

  useEffect(() => {
    let cancelled = false
    void storage.get(STORAGE_KEY).then((saved) => {
      if (!cancelled && !chosen.current && isMode(saved)) setModeState(saved)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const setMode = useCallback((next: ReadingMode) => {
    chosen.current = true
    setModeState(next)
    void storage.set(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}
