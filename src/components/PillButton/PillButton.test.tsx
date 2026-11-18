import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PillButton } from './PillButton.tsx'

describe('PillButton', () => {
  it('est un bouton qui appelle l’action au clic', async () => {
    const onClick = vi.fn()
    render(<PillButton onClick={onClick}>Passer</PillButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Passer' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
