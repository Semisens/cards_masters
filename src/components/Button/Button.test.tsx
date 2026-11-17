import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button.tsx'

describe('Button', () => {
  it('appelle onClick au clic', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Jouer</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Jouer' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("n'appelle pas onClick quand il est désactivé", async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Jouer
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Jouer' })
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('est de type button par défaut (ne soumet pas un formulaire)', () => {
    render(<Button>Suivant</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('applique une classe différente par variante', () => {
    const { rerender } = render(<Button variant="soleil">A</Button>)
    const soleil = screen.getByRole('button').className
    rerender(<Button variant="cerise">A</Button>)
    const cerise = screen.getByRole('button').className
    rerender(<Button variant="ciel">A</Button>)
    const ciel = screen.getByRole('button').className
    expect(new Set([soleil, cerise, ciel]).size).toBe(3)
  })
})
