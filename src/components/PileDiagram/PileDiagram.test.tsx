import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PileDiagram } from './PileDiagram.tsx'

describe('PileDiagram', () => {
  it('légende les deux piles', () => {
    const { container } = render(<PileDiagram hand="Ta main, triée" center="Au centre, cachées" />)
    expect(container).toHaveTextContent('Ta main, triée')
    expect(container).toHaveTextContent('Au centre, cachées')
  })

  it('dessine un dos de carte par pile, sans bruit pour les lecteurs d’écran', () => {
    const { container } = render(<PileDiagram hand="a" center="b" />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })
})
