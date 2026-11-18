import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chips } from './Chips.tsx'

const OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'quick', label: 'Rapide' },
]

describe('Chips', () => {
  it('nomme le groupe et coche la valeur donnée', () => {
    render(<Chips legend="Filtres" options={OPTIONS} value="all" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: 'Filtres' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Tous' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Rapide' })).not.toBeChecked()
  })

  it('signale la pastille choisie', async () => {
    const onChange = vi.fn()
    render(<Chips legend="Filtres" options={OPTIONS} value="all" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Rapide' }))
    expect(onChange).toHaveBeenCalledWith('quick')
  })
})
