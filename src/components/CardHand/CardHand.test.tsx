import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import { CardHand } from './CardHand.tsx'

describe('CardHand', () => {
  it('pose chaque carte, numérotée de gauche à droite : la dernière est dessus', () => {
    const { container } = render(
      <CardHand>
        <PlayingCard rank="8" suit="hearts" />
        <PlayingCard rank="9" suit="hearts" />
        <PlayingCard rank="10" suit="hearts" />
      </CardHand>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--n')).toBe('3')
    const items = [...root.children] as HTMLElement[]
    expect(items.map((item) => item.style.getPropertyValue('--i'))).toEqual(['0', '1', '2'])
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(3)
  })

  it('accepte deux cartes', () => {
    const { container } = render(
      <CardHand size="focus" width="9rem">
        <PlayingCard rank="K" suit="spades" />
        <PlayingCard rank="K" suit="clubs" />
      </CardHand>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--n')).toBe('2')
    expect(root.style.getPropertyValue('--hand-card-w')).toBe('9rem')
  })

  it('est décorative', () => {
    const { container } = render(
      <CardHand>
        <PlayingCard rank="A" suit="spades" />
      </CardHand>,
    )
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })
})
