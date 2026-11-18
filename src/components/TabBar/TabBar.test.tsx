import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TabBar } from './TabBar.tsx'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TabBar />
    </MemoryRouter>,
  )

describe('TabBar', () => {
  it('propose Jeux, Scores et Réglages', () => {
    renderAt('/')
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jeux' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Scores' })).toHaveAttribute('href', '/scores')
    expect(screen.getByRole('link', { name: 'Réglages' })).toHaveAttribute('href', '/reglages')
  })

  it.each([
    ['/', 'Jeux'],
    ['/scores', 'Scores'],
    ['/reglages', 'Réglages'],
  ])('marque l’onglet de %s comme page courante', (path, name) => {
    renderAt(path)
    expect(screen.getByRole('link', { name })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link').filter((l) => l.getAttribute('aria-current') === 'page')).toHaveLength(1)
  })
})
