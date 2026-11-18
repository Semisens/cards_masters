import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardPile } from './CardPile.tsx'
import { CARDS_IN_LAYOUT } from './layouts.ts'

describe('CardPile', () => {
  it('dessine une carte, une pile de trois dos ou un éventail de trois dos', () => {
    expect(CARDS_IN_LAYOUT).toEqual({ single: 1, pile: 3, spread: 3 })
    for (const [layout, count] of Object.entries(CARDS_IN_LAYOUT)) {
      const { unmount } = render(<CardPile layout={layout as 'single' | 'pile' | 'spread'} />)
      expect(screen.getAllByRole('img', { name: 'Dos de carte', hidden: true })).toHaveLength(count)
      unmount()
    }
  })

  it('dessine une seule carte par défaut', () => {
    render(<CardPile />)
    expect(screen.getAllByRole('img', { name: 'Dos de carte', hidden: true })).toHaveLength(1)
  })

  it('est décoratif : les lecteurs d’écran passent, la légende du schéma parle', () => {
    const { container } = render(<CardPile layout="pile" />)
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('numérote ses cartes pour les décaler : la dernière est dessus', () => {
    const { container } = render(<CardPile layout="spread" />)
    const cards = [...container.querySelectorAll<HTMLElement>('[role="img"]')]
    expect(cards.map((card) => card.style.getPropertyValue('--i'))).toEqual(['0', '1', '2'])
  })

  it('prend la largeur demandée et la couleur de dos du jeu', () => {
    const { container } = render(<CardPile layout="pile" width="5.5rem" />)
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--pile-card-w')).toBe('5.5rem')
    const back = container.querySelector<HTMLElement>('[role="img"]')!
    expect(back.style.getPropertyValue('--back-color')).toBe('var(--game-card-back, var(--mc-tapis-bleu))')
  })
})
