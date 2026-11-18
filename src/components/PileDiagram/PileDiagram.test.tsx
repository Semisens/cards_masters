import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PileDiagram } from './PileDiagram.tsx'

const TRIO = [{ label: 'Ta main, triée' }, { label: 'Au centre, cachées' }]

describe('PileDiagram', () => {
  it('légende chaque élément', () => {
    const { container } = render(<PileDiagram items={TRIO} />)
    expect(container).toHaveTextContent('Ta main, triée')
    expect(container).toHaveTextContent('Au centre, cachées')
  })

  it('dessine un dos de carte par élément, sans bruit pour les lecteurs d’écran', () => {
    const { container } = render(<PileDiagram items={TRIO} />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('dessine une carte visible quand l’élément en donne une', () => {
    const items = [
      { label: 'Pioche' },
      { label: 'Écartée, cachée' },
      { label: 'Visibles (2 joueurs)', card: { rank: 'A' as const, suit: 'hearts' as const } },
    ]
    const { container, getByRole } = render(<PileDiagram items={items} />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2 + 2)
    expect(getByRole('img', { name: 'Visibles (2 joueurs)' })).toBeInTheDocument()
  })
})
