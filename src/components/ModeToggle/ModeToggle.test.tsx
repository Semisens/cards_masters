import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModeToggle } from './ModeToggle.tsx'

describe('ModeToggle', () => {
  it('propose Classique et Connaisseur dans un groupe nommé', () => {
    render(<ModeToggle mode="classic" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: 'Mode de lecture' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Classique' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Connaisseur' })).not.toBeChecked()
  })

  it('coche le mode donné', () => {
    render(<ModeToggle mode="expert" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Connaisseur' })).toBeChecked()
  })

  it('signale le mode choisi', async () => {
    const onChange = vi.fn()
    render(<ModeToggle mode="classic" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Connaisseur' }))
    expect(onChange).toHaveBeenCalledWith('expert')
  })

  it('se règle aux flèches du clavier', async () => {
    const onChange = vi.fn()
    render(<ModeToggle mode="classic" onChange={onChange} />)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('expert')
  })
})
