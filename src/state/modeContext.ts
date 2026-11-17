import { createContext, useContext } from 'react'
import type { ReadingMode } from '../data/types.ts'

export interface ModeValue {
  mode: ReadingMode
  setMode: (mode: ReadingMode) => void
}

export const ModeContext = createContext<ModeValue | null>(null)

export function useMode(): ModeValue {
  const value = useContext(ModeContext)
  if (!value) throw new Error('useMode doit être utilisé dans un <ModeProvider>.')
  return value
}
