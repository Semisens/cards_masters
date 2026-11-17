import { useRef, type KeyboardEvent, type PointerEvent } from 'react'

/** Écart horizontal minimum, en pixels d'écran, pour qu'un geste compte comme un balayage. */
export const SWIPE_DISTANCE = 60

export interface SwipeHandlers {
  onPointerDown: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * Navigation « page suivante / précédente » au balayage tactile et aux flèches du clavier.
 * À poser sur la zone qui porte le geste, avec `touch-action: pan-y` pour laisser le défilement vertical au navigateur.
 */
export function useSwipe({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null)

  return {
    onPointerDown(event) {
      // Souris exclue : on ne vole pas la sélection de texte.
      if (event.pointerType === 'mouse') return
      start.current = { x: event.clientX, y: event.clientY }
    },
    onPointerUp(event) {
      const from = start.current
      start.current = null
      if (!from) return
      const dx = event.clientX - from.x
      const dy = event.clientY - from.y
      // Trop court, ou surtout vertical : ce n'est pas un balayage.
      if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return
      if (dx < 0) onNext()
      else onPrevious()
    },
    onPointerCancel() {
      start.current = null
    },
    onKeyDown(event) {
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    },
  }
}
