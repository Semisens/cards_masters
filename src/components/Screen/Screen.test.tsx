import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Screen } from './Screen.tsx'

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement

describe('Screen', () => {
  it('prend le fond uni et le texte du jeu pour l’écran de partie', () => {
    const { container } = render(
      <MemoryRouter>
        <Screen solid="#812B2B" solidText="#EEDDC8">
          x
        </Screen>
      </MemoryRouter>,
    )
    expect(root(container).style.getPropertyValue('--screen-solid')).toBe('#812B2B')
    expect(root(container).style.getPropertyValue('--screen-solid-fg')).toBe('#EEDDC8')
  })

  it('garde le texte de l’app quand le jeu n’en donne pas', () => {
    const { container } = render(
      <MemoryRouter>
        <Screen solid="#812B2B">x</Screen>
      </MemoryRouter>,
    )
    expect(root(container).style.getPropertyValue('--screen-solid')).toBe('#812B2B')
    expect(root(container).style.getPropertyValue('--screen-solid-fg')).toBe('')
  })

  it('sans fond uni, aucune variable de jeu', () => {
    const { container } = render(
      <MemoryRouter>
        <Screen>x</Screen>
      </MemoryRouter>,
    )
    expect(root(container).getAttribute('style')).toBeNull()
  })
})
