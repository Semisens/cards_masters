import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { loadCardGroup } from '../../data/loadGame.ts'
import type { CardGroup } from '../../data/types.ts'
import { CardGroupRow } from './CardGroupRow.tsx'

const group: CardGroup = loadCardGroup({
  label: '2 à 6',
  cards: [{ ranks: [2, 3, 4, 5, 6], suits: ['spades', 'hearts', 'clubs'] }],
  short: 'Valent 2 à 6.',
  detail: { title: 'T', text: 'X' },
  expert: { original: '2–6' },
})
const special: CardGroup = loadCardGroup({
  label: '7',
  cards: [{ ranks: [7], suits: ['spades', 'hearts', 'clubs'] }],
  short: 'Trio de 7 = victoire.',
  badge: 'Spécial',
  detail: { title: 'T', text: 'X' },
  expert: { original: '7' },
})

const renderRow = (g: CardGroup, mode: 'classic' | 'expert') =>
  render(
    <MemoryRouter>
      <CardGroupRow group={g} mode={mode} to="/vers/ici" />
    </MemoryRouter>,
  )

describe('CardGroupRow', () => {
  it('mode classique : le titre, puis « ×15 · Valent 2 à 6. »', () => {
    renderRow(group, 'classic')
    const row = screen.getByRole('link')
    expect(row).toHaveAttribute('href', '/vers/ici')
    expect(row).toHaveTextContent('2 à 6')
    expect(row).toHaveTextContent('×15 · Valent 2 à 6.')
    expect(row).not.toHaveTextContent('→')
  })

  it('mode connaisseur : la carte d’origine, une flèche, puis « 2–6 → 2 à 6 »', () => {
    renderRow(group, 'expert')
    const row = screen.getByRole('link')
    expect(row).toHaveTextContent('2–6 → 2 à 6')
    expect(row).toHaveTextContent('×15 · Valent 2 à 6.')
    // Carte d'origine (2–6) et flèche : décoratives.
    expect(row.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(3)
  })

  it('affiche la pastille d’un groupe spécial', () => {
    renderRow(special, 'classic')
    expect(screen.getByText('Spécial')).toBeInTheDocument()
  })

  it('n’affiche pas de pastille sinon', () => {
    renderRow(group, 'classic')
    expect(screen.queryByText('Spécial')).not.toBeInTheDocument()
  })

  it('cache la mini-carte aux lecteurs d’écran : le texte dit tout', () => {
    renderRow(group, 'classic')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
