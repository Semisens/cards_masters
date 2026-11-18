import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { tokens } from '../../core/tokens.generated.ts'
import { OriginalCard, OriginalCards } from './OriginalCard.tsx'

const card = (value: string, color: string) => ({ value, color })

describe('OriginalCard', () => {
  it('écrit la valeur sur la couleur de la carte', () => {
    const { container } = render(<OriginalCard card={card('7', '#F1CA26')} />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveTextContent('7')
    expect(el.style.getPropertyValue('--original-bg')).toBe('#F1CA26')
  })

  it('choisit le texte lisible : encre sur le jaune, blanc sur le violet', () => {
    const { container: yellow } = render(<OriginalCard card={card('7', '#F1CA26')} />)
    const { container: violet } = render(<OriginalCard card={card('4', '#7A31A2')} />)
    const fg = (c: HTMLElement) => (c.firstChild as HTMLElement).style.getPropertyValue('--original-fg')
    expect(fg(yellow)).toBe(tokens.colors.encre)
    expect(fg(violet)).toBe(tokens.colors.blanc_carte)
  })

  it('est décorative et a deux tailles', () => {
    const { container: list } = render(<OriginalCard card={card('1', '#BC2EA8')} />)
    const { container: strip } = render(<OriginalCard card={card('1', '#BC2EA8')} variant="strip" />)
    expect((list.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
    expect((list.firstChild as HTMLElement).className).not.toBe((strip.firstChild as HTMLElement).className)
  })

  it('avec une image, la carte est l’image : ni valeur dessinée, ni fond, ni cadre', () => {
    const { container } = render(<OriginalCard card={{ ...card('1', '#BC2EA8'), imageUrl: '/x.webp' }} />)
    const el = container.firstChild as HTMLElement
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/x.webp')
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
    expect(container).not.toHaveTextContent('1')
    expect(el.style.getPropertyValue('--original-bg')).toBe('')
    expect(el.className).toMatch(/picture/)
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('une carte en image a les mêmes deux tailles', () => {
    const { container: list } = render(<OriginalCard card={{ ...card('1', '#BC2EA8'), imageUrl: '/x.webp' }} />)
    const { container: strip } = render(
      <OriginalCard card={{ ...card('1', '#BC2EA8'), imageUrl: '/x.webp' }} variant="strip" />,
    )
    expect((list.firstChild as HTMLElement).className).not.toBe((strip.firstChild as HTMLElement).className)
  })

  it('n’a pas d’image sans imageUrl', () => {
    const { container } = render(<OriginalCard card={card('1', '#BC2EA8')} />)
    expect(container.querySelector('img')).toBeNull()
  })
})

describe('OriginalCards', () => {
  it('deux cartes : une main de deux', () => {
    const { container } = render(<OriginalCards cards={[card('1', '#BC2EA8'), card('2', '#FA7A06')]} />)
    expect(container.textContent).toBe('12')
  })

  it('une carte seule : elle seule', () => {
    const { container } = render(<OriginalCards cards={[card('1', '#BC2EA8')]} />)
    expect(container.textContent).toBe('1')
  })

  it('plusieurs cartes en image : une main de trois, la première, celle du milieu et la dernière', () => {
    const cards = ['2', '3', '4', '5', '6'].map((v) => ({ ...card(v, '#FA7A06'), imageUrl: `/carte-${v}.webp` }))
    const { container } = render(<OriginalCards cards={cards} />)
    expect([...container.querySelectorAll('img')].map((img) => img.getAttribute('src'))).toEqual([
      '/carte-2.webp',
      '/carte-4.webp',
      '/carte-6.webp',
    ])
  })

  it('plusieurs cartes : une main de trois, qui se recouvrent', () => {
    const cards = ['2', '3', '4', '5', '6'].map((v) => card(v, '#FA7A06'))
    const { container } = render(<OriginalCards cards={cards} />)
    expect(container.textContent).toBe('246')
  })
})
