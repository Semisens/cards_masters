import { useCallback, useEffect, useState } from 'react'
import { storage } from '../core/storage.ts'

/**
 * Drapeau oui/non mémorisé (ex. « message de bienvenue déjà vu »).
 * Vaut `null` tant que le stockage n'a pas répondu : l'écran n'affiche rien plutôt que de clignoter.
 */
export function useStoredFlag(key: string): [value: boolean | null, set: (value: boolean) => void] {
  const [value, setValue] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    void storage.get(key).then((saved) => {
      if (!cancelled) setValue(saved === '1')
    })
    return () => {
      cancelled = true
    }
  }, [key])

  const set = useCallback(
    (next: boolean) => {
      setValue(next)
      void storage.set(key, next ? '1' : '0')
    },
    [key],
  )

  return [value, set]
}
