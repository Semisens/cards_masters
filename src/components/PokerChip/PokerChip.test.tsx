import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PokerChip } from './PokerChip.tsx'

describe('PokerChip', () => {
  it("expose couleur et valeur aux lecteurs d'écran", () => {
    render(<PokerChip color="rouge" value={25} />)
    expect(screen.getByRole('img', { name: 'Jeton rouge, valeur 25' })).toBeInTheDocument()
  })

  it('affiche la valeur', () => {
    const { container } = render(<PokerChip color="jaune" value={5} />)
    expect(container).toHaveTextContent('5')
  })

  it('utilise la couleur de tapis correspondante', () => {
    render(<PokerChip color="vert" value={1} />)
    expect(screen.getByRole('img').style.getPropertyValue('--chip-color')).toBe('var(--mc-tapis-vert)')
  })
})
