import type { ReadingMode } from '../../data/types.ts'
import { fr } from '../../i18n/fr.ts'
import { Segmented } from '../Segmented/Segmented.tsx'

export interface ModeToggleProps {
  mode: ReadingMode
  onChange: (mode: ReadingMode) => void
}

const OPTIONS = [
  { value: 'classic', label: fr.mode.classic },
  { value: 'expert', label: fr.mode.expert },
] as const

/** Bascule Classique / Connaisseur. */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return <Segmented legend={fr.mode.legend} options={[...OPTIONS]} value={mode} onChange={onChange} />
}
