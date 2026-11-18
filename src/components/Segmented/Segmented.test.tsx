import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Segmented } from './Segmented.tsx'

const OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English', disabled: true },
  { value: 'es', label: 'Español', disabled: true },
]

describe('Segmented', () => {
  it('nomme le groupe et coche la valeur donnée', () => {
    render(<Segmented legend="Langue" options={OPTIONS} value="fr" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: 'Langue' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Français' })).toBeChecked()
  })

  it('grise les options indisponibles et ne les laisse pas choisir', async () => {
    const onChange = vi.fn()
    render(<Segmented legend="Langue" options={OPTIONS} value="fr" onChange={onChange} />)
    expect(screen.getByRole('radio', { name: 'English' })).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'English' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('signale l’option choisie', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        legend="Mode"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        value="a"
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})
