import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayingCard } from './PlayingCard.tsx'
import { SUIT_PATHS } from './symbols.ts'
import { SUITS } from '../../core/cards.ts'

describe('PlayingCard', () => {
  it('expose un libellé sémantique en français', () => {
    render(<PlayingCard rank="K" suit="hearts" />)
    expect(screen.getByRole('img', { name: 'Roi de cœur' })).toBeInTheDocument()
  })

  it('affiche le rang seul et un seul symbole', () => {
    const { container } = render(<PlayingCard rank="10" suit="spades" />)
    expect(container).toHaveTextContent('10')
    expect(container.querySelectorAll('svg')).toHaveLength(1)
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('le sens ne repose pas sur la couleur : chaque couleur a son propre tracé', () => {
    expect(new Set(SUITS.map((s) => SUIT_PATHS[s])).size).toBe(4)
  })

  it("le dos de pioche n'affiche ni rang ni symbole", () => {
    const { container } = render(<PlayingCard faceDown back="vert" />)
    expect(screen.getByRole('img', { name: 'Dos de carte' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
    expect(container).toHaveTextContent('')
  })
})
