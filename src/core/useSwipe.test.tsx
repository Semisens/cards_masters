import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSwipe } from './useSwipe.ts'

function Zone({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) {
  const swipe = useSwipe({ onNext, onPrevious })
  return (
    <div data-testid="zone" tabIndex={-1} {...swipe}>
      zone
    </div>
  )
}

const setup = () => {
  const onNext = vi.fn()
  const onPrevious = vi.fn()
  render(<Zone onNext={onNext} onPrevious={onPrevious} />)
  return { onNext, onPrevious, zone: screen.getByTestId('zone') }
}

const swipe = (zone: HTMLElement, from: [number, number], to: [number, number], pointerType = 'touch') => {
  fireEvent.pointerDown(zone, { pointerType, clientX: from[0], clientY: from[1] })
  fireEvent.pointerUp(zone, { pointerType, clientX: to[0], clientY: to[1] })
}

describe('useSwipe', () => {
  it('balayer vers la gauche passe à la suite, vers la droite revient', () => {
    const { onNext, onPrevious, zone } = setup()
    swipe(zone, [250, 100], [100, 100])
    expect(onNext).toHaveBeenCalledOnce()
    swipe(zone, [100, 100], [250, 100])
    expect(onPrevious).toHaveBeenCalledOnce()
  })

  it('ignore un geste trop court', () => {
    const { onNext, onPrevious, zone } = setup()
    swipe(zone, [200, 100], [170, 100])
    expect(onNext).not.toHaveBeenCalled()
    expect(onPrevious).not.toHaveBeenCalled()
  })

  it('ignore un geste surtout vertical (c’est un défilement)', () => {
    const { onNext, onPrevious, zone } = setup()
    swipe(zone, [250, 100], [150, 400])
    expect(onNext).not.toHaveBeenCalled()
    expect(onPrevious).not.toHaveBeenCalled()
  })

  it('ignore la souris, pour ne pas gêner la sélection de texte', () => {
    const { onNext, zone } = setup()
    swipe(zone, [250, 100], [50, 100], 'mouse')
    expect(onNext).not.toHaveBeenCalled()
  })

  it('oublie un geste annulé', () => {
    const { onNext, zone } = setup()
    fireEvent.pointerDown(zone, { pointerType: 'touch', clientX: 250, clientY: 100 })
    fireEvent.pointerCancel(zone)
    fireEvent.pointerUp(zone, { pointerType: 'touch', clientX: 50, clientY: 100 })
    expect(onNext).not.toHaveBeenCalled()
  })

  it('répond aux flèches du clavier', () => {
    const { onNext, onPrevious, zone } = setup()
    fireEvent.keyDown(zone, { key: 'ArrowRight' })
    expect(onNext).toHaveBeenCalledOnce()
    fireEvent.keyDown(zone, { key: 'ArrowLeft' })
    expect(onPrevious).toHaveBeenCalledOnce()
    fireEvent.keyDown(zone, { key: 'Enter' })
    expect(onNext).toHaveBeenCalledOnce()
  })
})
