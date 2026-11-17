import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ModeProvider } from './ModeProvider.tsx'
import { useMode } from './modeContext.ts'

function Probe() {
  const { mode, setMode } = useMode()
  return (
    <>
      <p>mode:{mode}</p>
      <button onClick={() => setMode('expert')}>expert</button>
      <button onClick={() => setMode('classic')}>classic</button>
    </>
  )
}

describe('ModeProvider', () => {
  beforeEach(() => window.localStorage.clear())

  it('démarre en mode classique', () => {
    render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    )
    expect(screen.getByText('mode:classic')).toBeInTheDocument()
  })

  it('retrouve le mode mémorisé', async () => {
    window.localStorage.setItem('mastercards:mode', 'expert')
    render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    )
    await waitFor(() => expect(screen.getByText('mode:expert')).toBeInTheDocument())
  })

  it('mémorise le choix', async () => {
    render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'expert' }))
    expect(screen.getByText('mode:expert')).toBeInTheDocument()
    expect(window.localStorage.getItem('mastercards:mode')).toBe('expert')
  })

  it('ignore une valeur mémorisée invalide', async () => {
    window.localStorage.setItem('mastercards:mode', 'nimporte-quoi')
    render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    )
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(screen.getByText('mode:classic')).toBeInTheDocument()
  })

  it('refuse d’être utilisé hors du fournisseur', () => {
    expect(() => render(<Probe />)).toThrow(/ModeProvider/)
  })
})
