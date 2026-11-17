import { render } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { AppRoutes } from '../AppRoutes.tsx'
import { ModeProvider } from '../state/ModeProvider.tsx'

/** Affiche l'app complète à une adresse donnée, avec un routeur en mémoire. */
export function renderApp(path: string) {
  let location = ''
  function Probe() {
    const current = useLocation()
    location = current.pathname + current.search
    return null
  }
  const utils = render(
    <ModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
        <Probe />
      </MemoryRouter>
    </ModeProvider>,
  )
  return { ...utils, location: () => location }
}
