import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../../test/renderApp.tsx'

const root = () => document.documentElement.style

describe('GameScope', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('pose les couleurs du jeu sur la page quand on est dans Love Letter', async () => {
    renderApp('/jeu/love-letter')
    await screen.findByRole('heading', { level: 1, name: 'Love Letter' })
    expect(root().getPropertyValue('--game-screen-base')).toBe('#EEDDC8')
    expect(root().getPropertyValue('--game-pill-bg')).toBe('#812B2B')
    expect(root().getPropertyValue('--game-pill-fg')).toBe('#EEDDC8')
    expect(root().getPropertyValue('--game-card-back')).toBe('#E57979')
  })

  it('les garde d’une page du jeu à l’autre', async () => {
    renderApp('/jeu/love-letter/regles')
    await screen.findByRole('heading', { level: 1, name: 'Règles complètes' })
    expect(root().getPropertyValue('--game-screen-from')).not.toBe('')
  })

  it('ne pose ni fond ni pastilles pour un jeu qui n’a pas de fond propre (Trio garde le bleu), mais son dos de carte', async () => {
    renderApp('/jeu/trio')
    await screen.findByRole('heading', { level: 1, name: 'Trio' })
    expect(root().getPropertyValue('--game-screen-from')).toBe('')
    expect(root().getPropertyValue('--game-pill-bg')).toBe('')
    expect(root().getPropertyValue('--game-card-back')).not.toBe('')
  })

  it('ne pose rien hors d’un jeu : l’accueil garde le bleu', async () => {
    window.localStorage.setItem('mastercards:welcomed', '1')
    renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Tes jeux' })
    expect(root().getPropertyValue('--game-pill-bg')).toBe('')
    expect(root().getPropertyValue('--game-screen-from')).toBe('')
  })

  it('retire les couleurs en quittant le jeu', async () => {
    window.localStorage.setItem('mastercards:welcomed', '1')
    renderApp('/jeu/love-letter')
    await screen.findByRole('heading', { level: 1, name: 'Love Letter' })
    expect(root().getPropertyValue('--game-pill-bg')).not.toBe('')
    await userEvent.click(screen.getByRole('link', { name: /Retour/ }))
    await screen.findByRole('heading', { level: 1, name: 'Tes jeux' })
    expect(root().getPropertyValue('--game-pill-bg')).toBe('')
    expect(root().getPropertyValue('--game-card-back')).toBe('')
  })

  it('un jeu inconnu ne pose rien et dit qu’il n’existe pas', async () => {
    renderApp('/jeu/inconnu')
    expect((await screen.findAllByText(/introuvable/i)).length).toBeGreaterThan(0)
    expect(root().getPropertyValue('--game-pill-bg')).toBe('')
  })
})
