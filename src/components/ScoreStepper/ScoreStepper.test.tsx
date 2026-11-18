import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScoreStepper } from './ScoreStepper.tsx'

describe('ScoreStepper', () => {
  it('affiche le nom et le nombre', () => {
    render(<ScoreStepper name="Léa" value={2} onChange={() => {}} />)
    expect(screen.getByText('Léa')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('ajoute et retire un trio', async () => {
    const onChange = vi.fn()
    render(<ScoreStepper name="Léa" unit="trio" value={2} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Un trio de plus pour Léa' }))
    expect(onChange).toHaveBeenLastCalledWith(3)
    await userEvent.click(screen.getByRole('button', { name: 'Un trio de moins pour Léa' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('parle de points par défaut', () => {
    render(<ScoreStepper name="Léa" value={2} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Un point de plus pour Léa' })).toBeInTheDocument()
  })

  it('ne descend pas sous le minimum', () => {
    render(<ScoreStepper name="Léa" value={0} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /de moins/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /de plus/ })).toBeEnabled()
  })

  it('ne monte pas au-dessus du maximum', () => {
    render(<ScoreStepper name="Léa" value={5} max={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /de plus/ })).toBeDisabled()
  })

  it('a des boutons d’au moins 44 px (zone tactile) définis par la feuille de style', () => {
    render(<ScoreStepper name="Léa" value={1} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
