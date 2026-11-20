import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardPile } from './CardPile.tsx'
import { CARDS_IN_LAYOUT, REVEALED_IN_LAYOUT } from './layouts.ts'

describe('CardPile', () => {
  it('dessine une carte, une pile de trois dos, un éventail de trois dos ou six dos alignés', () => {
    expect(CARDS_IN_LAYOUT).toEqual({ single: 1, pile: 3, spread: 3, grid: 6 })
    for (const [layout, count] of Object.entries(CARDS_IN_LAYOUT)) {
      const { unmount } = render(<CardPile layout={layout as keyof typeof CARDS_IN_LAYOUT} />)
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

  it('retourne une carte : au bord de la main, au milieu de la rangée du bas de la grille', () => {
    for (const layout of ['spread', 'grid'] as const) {
      const { container, unmount } = render(<CardPile layout={layout} reveal={{ rank: 'A', suit: 'spades' }} />)
      const cards = [...container.querySelectorAll<HTMLElement>('[role="img"]')]
      expect(cards).toHaveLength(CARDS_IN_LAYOUT[layout])
      const faceUp = cards.findIndex((card) => card.getAttribute('aria-label') === 'As de pique')
      expect(faceUp).toBe(REVEALED_IN_LAYOUT[layout])
      expect(cards.filter((card) => card.getAttribute('aria-label') === 'Dos de carte')).toHaveLength(cards.length - 1)
      unmount()
    }
    expect(REVEALED_IN_LAYOUT.spread).toBe(CARDS_IN_LAYOUT.spread - 1)
  })

  it('dessine toutes ses cartes de face, dans l’ordre, quand on les lui donne (ta main pendant un tour)', () => {
    const faces = [
      { rank: '5' as const, suit: 'hearts' as const },
      { rank: 'Q' as const, suit: 'hearts' as const },
    ]
    const { container } = render(<CardPile layout="spread" faces={faces} />)
    const cards = [...container.querySelectorAll('[role="img"]')].map((card) => card.getAttribute('aria-label'))
    expect(cards).toEqual(['5 de cœur', 'Dame de cœur'])
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--n')).toBe('2')
  })
})
