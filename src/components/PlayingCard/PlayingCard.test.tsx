import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayingCard } from './PlayingCard.tsx'
import { JOKER_PATH, SUIT_PATHS } from './symbols.ts'
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

  it('écrit les figures à la française : V, D, R', () => {
    const { container, rerender } = render(<PlayingCard rank="J" suit="hearts" />)
    expect(container).toHaveTextContent('V')
    rerender(<PlayingCard rank="Q" suit="spades" />)
    expect(container).toHaveTextContent('D')
    rerender(<PlayingCard rank="K" suit="clubs" />)
    expect(container).toHaveTextContent('R')
  })

  it('garde le libellé complet pour les lecteurs d’écran malgré la lettre', () => {
    render(<PlayingCard rank="J" suit="hearts" />)
    expect(screen.getByRole('img', { name: 'Valet de cœur' })).toBeInTheDocument()
  })

  it('accepte un libellé personnalisé', () => {
    render(<PlayingCard rank="2" suit="spades" label="2 à 6" />)
    expect(screen.getByRole('img', { name: '2 à 6' })).toBeInTheDocument()
  })

  it('a des variantes pour la liste et la vue à balayer', () => {
    const { container: list } = render(<PlayingCard rank="2" suit="spades" variant="list" />)
    const { container: focus } = render(<PlayingCard rank="2" suit="spades" variant="focus" />)
    const { container: standard } = render(<PlayingCard rank="2" suit="spades" />)
    const cls = (c: HTMLElement) => (c.firstChild as HTMLElement).className
    expect(new Set([cls(list), cls(focus), cls(standard)]).size).toBe(3)
  })

  it('le dos de pioche accepte une couleur libre', () => {
    render(<PlayingCard faceDown backColor="#187A33" />)
    expect(screen.getByRole('img', { name: 'Dos de carte' }).style.getPropertyValue('--back-color')).toBe('#187A33')
  })

  it('dessine un joker : une étoile, sans rang, avec son libellé', () => {
    const { container } = render(<PlayingCard joker />)
    expect(screen.getByRole('img', { name: 'Joker' })).toBeInTheDocument()
    expect(container).toHaveTextContent('')
    expect(container.querySelectorAll('svg')).toHaveLength(1)
    expect(container.querySelector('path')?.getAttribute('d')).toBe(JOKER_PATH)
    expect(Object.values(SUIT_PATHS)).not.toContain(JOKER_PATH)
  })

  it('un joker a les mêmes variantes que les autres cartes', () => {
    const { container: list } = render(<PlayingCard joker variant="list" />)
    const { container: focus } = render(<PlayingCard joker variant="focus" label="Jokers" />)
    expect((list.firstChild as HTMLElement).className).not.toBe((focus.firstChild as HTMLElement).className)
    expect(screen.getByRole('img', { name: 'Jokers' })).toBeInTheDocument()
  })

  it('a une variante pour les cartes retournées sur la table, distincte des autres', () => {
    const { container: table } = render(<PlayingCard rank="A" suit="spades" variant="table" />)
    const { container: standard } = render(<PlayingCard rank="A" suit="spades" />)
    const { container: list } = render(<PlayingCard rank="A" suit="spades" variant="list" />)
    const className = (table.firstChild as HTMLElement).className
    expect(className).not.toBe((standard.firstChild as HTMLElement).className)
    expect(className).not.toBe((list.firstChild as HTMLElement).className)
    expect(table).toHaveTextContent('A')
  })
})
