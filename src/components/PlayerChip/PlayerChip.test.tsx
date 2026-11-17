import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayerChip } from './PlayerChip.tsx'

describe('PlayerChip', () => {
  it('annonce le joueur et son nombre de trios', () => {
    render(<PlayerChip name="Léa" score={2} color="var(--mc-color-soleil)" textColor="var(--mc-text-on-soleil)" />)
    expect(screen.getByRole('img', { name: 'Léa : 2' })).toBeInTheDocument()
  })

  it('affiche le nom et le nombre', () => {
    const { container } = render(<PlayerChip name="Tom" score={1} color="red" textColor="white" />)
    expect(container).toHaveTextContent('Tom')
    expect(container).toHaveTextContent('1')
  })

  it('prend la couleur du joueur', () => {
    const { container } = render(<PlayerChip name="Tom" score={1} color="var(--mc-color-cerise)" textColor="white" />)
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--chip')).toBe('var(--mc-color-cerise)')
  })
})
