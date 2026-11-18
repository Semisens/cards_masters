import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepHeader } from './StepHeader.tsx'

const renderHeader = (props: Parameters<typeof StepHeader>[0]) =>
  render(
    <MemoryRouter>
      <StepHeader {...props} />
    </MemoryRouter>,
  )

describe('StepHeader', () => {
  it('a un lien « Retour » qui mène où on lui dit', () => {
    renderHeader({ backTo: '/ici' })
    expect(screen.getByRole('link', { name: /Retour/ })).toHaveAttribute('href', '/ici')
  })

  it('affiche la pastille « Quitter le tutoriel » quand on lui donne une adresse', () => {
    renderHeader({ backTo: '/ici', quitTo: '/ailleurs' })
    expect(screen.getByRole('link', { name: 'Quitter le tutoriel' })).toHaveAttribute('href', '/ailleurs')
  })

  it('n’affiche pas la pastille sans adresse', () => {
    renderHeader({ backTo: '/ici' })
    expect(screen.queryByRole('link', { name: 'Quitter le tutoriel' })).not.toBeInTheDocument()
  })

  it('affiche la pastille « Passer cette étape » et appelle l’action au clic', async () => {
    const onSkip = vi.fn()
    renderHeader({ backTo: '/ici', onSkip })
    await userEvent.click(screen.getByRole('button', { name: 'Passer cette étape' }))
    expect(onSkip).toHaveBeenCalledOnce()
    expect(screen.queryByRole('link', { name: 'Quitter le tutoriel' })).not.toBeInTheDocument()
  })

  it('n’affiche pas « Passer cette étape » sans action', () => {
    renderHeader({ backTo: '/ici' })
    expect(screen.queryByRole('button', { name: 'Passer cette étape' })).not.toBeInTheDocument()
  })
})
