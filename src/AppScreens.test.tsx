import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp.tsx'

const LL_KEY = 'mastercards:session:love-letter'
const store = (key: string, value: unknown) => window.localStorage.setItem(key, JSON.stringify(value))
const stored = (key: string) => JSON.parse(window.localStorage.getItem(key) ?? 'null')

const LL_PARTY = {
  players: [
    { name: 'Léa', score: 2 },
    { name: 'Tom', score: 1 },
    { name: 'Inès', score: 0 },
  ],
  round: 3,
}

const ENTRY = (id: string, partial: object = {}) => ({
  id,
  gameId: 'love-letter',
  date: '2026-10-12T18:00:00.000Z',
  status: 'finished',
  players: [
    { name: 'Léa', score: 4 },
    { name: 'Tom', score: 2 },
  ],
  ...partial,
})

beforeEach(() => window.localStorage.clear())

describe('accueil « Tes jeux »', () => {
  it('liste Love Letter et Trio, avec joueurs et durée', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Tes jeux' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Love Letter/ })).toHaveTextContent('2–4 joueurs · 20 min')
    expect(screen.getByRole('link', { name: /Trio/ })).toHaveTextContent('3–6 joueurs · 15 min')
  })

  it('cherche dans le nom, sans casse', async () => {
    renderApp('/')
    await userEvent.type(await screen.findByRole('searchbox', { name: 'Recherche' }), 'LOVE')
    expect(screen.getByRole('link', { name: /Love Letter/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Trio/ })).not.toBeInTheDocument()
  })

  it('filtre : « 2–4 joueurs » puis « Rapide »', async () => {
    renderApp('/')
    await userEvent.click(await screen.findByRole('radio', { name: '2–4 joueurs' }))
    expect(screen.getByRole('link', { name: /Love Letter/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Trio/ })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Rapide' }))
    expect(screen.getByRole('link', { name: /Trio/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Love Letter/ })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Tous' }))
    expect(screen.getAllByRole('link', { name: /joueurs/ })).toHaveLength(2)
  })

  it('dit quand rien ne correspond', async () => {
    renderApp('/')
    await userEvent.type(await screen.findByRole('searchbox', { name: 'Recherche' }), 'zzz')
    expect(screen.getByText('Aucun jeu trouvé')).toBeInTheDocument()
  })

  it('a la barre d’onglets, sur Jeux', async () => {
    renderApp('/')
    expect(await screen.findByRole('link', { name: 'Jeux' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Scores' })).toHaveAttribute('href', '/scores')
    expect(screen.getByRole('link', { name: 'Réglages' })).toHaveAttribute('href', '/reglages')
  })
})

describe('Love Letter : tutoriel', () => {
  it('annonce 17 cartes à garder, sans liste à retirer', async () => {
    renderApp('/jeu/love-letter/tutoriel/cartes')
    expect(await screen.findByText('Garde ces 17 cartes. Retire tout le reste du paquet.')).toBeInTheDocument()
  })

  it('liste 8 groupes ; le mode connaisseur donne le nom du personnage', async () => {
    renderApp('/jeu/love-letter/tutoriel/cartes')
    const rows = () =>
      screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.includes('/tutoriel/cartes/'))
    await screen.findByText('Garde ces 17 cartes. Retire tout le reste du paquet.')
    expect(rows()).toHaveLength(8)
    expect(rows()[0]).toHaveTextContent('Valets et rois noirs')
    expect(rows()[0]).toHaveTextContent('×6 · Devine la carte d’un rival.')
    await userEvent.click(screen.getByRole('radio', { name: 'Connaisseur' }))
    expect(rows()[0]).toHaveTextContent('Garde')
    expect(rows()[1]).toHaveTextContent('Prêtre')
    expect(rows()[7]).toHaveTextContent('Princesse')
  })

  it('numérote la vue à balayer « Carte 2 / 8 » et explique le pouvoir en mode connaisseur', async () => {
    window.localStorage.setItem('mastercards:mode', 'expert')
    renderApp('/jeu/love-letter/tutoriel/cartes/2')
    expect(await screen.findByText('Carte 2 / 8')).toBeInTheDocument()
    expect(screen.getByText('Choisis un rival. Il te montre sa carte. Ne la répète à personne.')).toBeInTheDocument()
    expect(
      screen.getByText('Mode connaisseur : Prêtre. Pouvoir d’origine : voir la main d’un joueur.'),
    ).toBeInTheDocument()
  })

  it('dessine les trois éléments de la mise en place', async () => {
    renderApp('/jeu/love-letter/tutoriel/mise-en-place')
    expect(await screen.findByText('Pioche')).toBeInTheDocument()
    expect(screen.getByText('Écartée, cachée')).toBeInTheDocument()
    expect(screen.getByText('Visibles (2 joueurs)')).toBeInTheDocument()
    expect(screen.getByText('Mélange les 17 cartes.')).toBeInTheDocument()
  })
})

describe('Love Letter : partie en manches', () => {
  it('affiche la manche en cours', async () => {
    store(LL_KEY, LL_PARTY)
    renderApp('/jeu/love-letter/partie')
    expect(await screen.findByText('Manche 3')).toBeInTheDocument()
  })

  it('saisit les points de la manche, de zéro : valider les ajoute et passe à la manche suivante', async () => {
    store(LL_KEY, LL_PARTY)
    const app = renderApp('/jeu/love-letter/partie/scores')
    expect(await screen.findByRole('heading', { level: 1, name: 'Fin de la manche 3' })).toBeInTheDocument()
    expect(screen.getByText('Qui a gagné des points ?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Un point de plus pour Inès' }))
    await userEvent.click(screen.getByRole('button', { name: 'Valider la manche' }))
    await waitFor(() => expect(app.location()).toBe('/jeu/love-letter/partie'))
    expect(stored(LL_KEY)).toEqual({
      players: [
        { name: 'Léa', score: 2 },
        { name: 'Tom', score: 1 },
        { name: 'Inès', score: 1 },
      ],
      round: 4,
    })
  })

  it('termine la partie quand un joueur atteint le score visé (5 à trois joueurs) : podium et historique', async () => {
    store(LL_KEY, { ...LL_PARTY, players: [{ name: 'Léa', score: 4 }, ...LL_PARTY.players.slice(1)] })
    const app = renderApp('/jeu/love-letter/partie/scores')
    await userEvent.click(await screen.findByRole('button', { name: 'Un point de plus pour Léa' }))
    await userEvent.click(screen.getByRole('button', { name: 'Valider la manche' }))
    await waitFor(() => expect(app.location()).toMatch(/^\/jeu\/love-letter\/resultat\/\d+$/))
    expect(await screen.findByText('Partie terminée')).toBeInTheDocument()
    expect(stored(LL_KEY)).toBeNull()
    expect(stored('mastercards:history')).toHaveLength(1)
    expect(stored('mastercards:history')[0]).toMatchObject({ gameId: 'love-letter', status: 'finished' })
  })

  it('ne termine pas la partie tant que personne n’a le score visé', async () => {
    store(LL_KEY, LL_PARTY)
    const app = renderApp('/jeu/love-letter/partie/scores')
    await userEvent.click(await screen.findByRole('button', { name: 'Un point de plus pour Léa' }))
    await userEvent.click(screen.getByRole('button', { name: 'Valider la manche' }))
    await waitFor(() => expect(app.location()).toBe('/jeu/love-letter/partie'))
    expect(stored('mastercards:history')).toBeNull()
  })
})

describe('podium', () => {
  it('place le premier au centre, le deuxième à gauche, le troisième à droite, puis la liste', async () => {
    store('mastercards:history', [
      ENTRY('1', {
        players: [
          { name: 'Tom', score: 2 },
          { name: 'Léa', score: 3 },
          { name: 'Inès', score: 1 },
          { name: 'Sam', score: 0 },
        ],
      }),
    ])
    renderApp('/jeu/love-letter/resultat/1')
    expect(await screen.findByText('Partie terminée')).toBeInTheDocument()
    const podium = screen.getByRole('list', { name: 'Podium des joueurs' })
    const names = Array.from(podium.querySelectorAll('li')).map((li) => li.getAttribute('aria-label'))
    expect(names).toEqual(['2e : Tom, 2', '1er : Léa, 3', '3e : Inès, 1'])
    expect(screen.getByText('4e')).toBeInTheDocument()
    expect(screen.getByText('Sam')).toBeInTheDocument()
  })

  it('dit « Partie interrompue » quand la partie a été arrêtée', async () => {
    store('mastercards:history', [ENTRY('1', { status: 'interrupted' })])
    renderApp('/jeu/love-letter/resultat/1')
    expect(await screen.findByText('Partie interrompue')).toBeInTheDocument()
  })

  it('mène à l’historique et à l’accueil', async () => {
    store('mastercards:history', [ENTRY('1')])
    renderApp('/jeu/love-letter/resultat/1')
    expect(await screen.findByRole('link', { name: 'Voir l’historique' })).toHaveAttribute('href', '/scores')
    expect(screen.getByRole('link', { name: 'Retour aux jeux' })).toHaveAttribute('href', '/')
  })

  it('explique quand la partie est introuvable', async () => {
    renderApp('/jeu/love-letter/resultat/42')
    expect(await screen.findByText('Cette partie est introuvable.')).toBeInTheDocument()
  })
})

describe('historique « Tes scores »', () => {
  it('invite à jouer quand il est vide', async () => {
    renderApp('/scores')
    expect(await screen.findByText('Aucune partie pour le moment')).toBeInTheDocument()
  })

  it('ouvre le jeu le plus récent : date, deux meilleurs, état', async () => {
    store('mastercards:history', [
      ENTRY('2', { date: '2026-10-12T10:00:00.000Z' }),
      ENTRY('1', { date: '2026-10-03T10:00:00.000Z', status: 'interrupted' }),
      ENTRY('3', { gameId: 'trio', date: '2026-09-28T10:00:00.000Z' }),
    ])
    renderApp('/scores')
    expect(await screen.findByRole('button', { name: /Love Letter.*2 parties/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByText('12 oct.')).toBeInTheDocument()
    expect(screen.getAllByText('Léa 4 · Tom 2')).toHaveLength(2)
    expect(screen.getByText('Terminée')).toBeInTheDocument()
    expect(screen.getByText('Interrompue')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Trio.*1 partie/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('link', { name: 'Scores' })).toHaveAttribute('aria-current', 'page')
  })

  it('ouvre un autre jeu au toucher, et referme le premier', async () => {
    store('mastercards:history', [ENTRY('2'), ENTRY('3', { gameId: 'trio', date: '2026-09-28T10:00:00.000Z' })])
    renderApp('/scores')
    await userEvent.click(await screen.findByRole('button', { name: /Trio/ }))
    expect(screen.getByRole('button', { name: /Trio/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Love Letter/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('ignore les parties d’un jeu qui n’existe plus', async () => {
    store('mastercards:history', [ENTRY('1', { gameId: 'inconnu' })])
    renderApp('/scores')
    expect(await screen.findByText('Aucune partie pour le moment')).toBeInTheDocument()
  })
})

describe('réglages', () => {
  it('propose le français, les autres langues sont grisées', async () => {
    renderApp('/reglages')
    expect(await screen.findByRole('radio', { name: 'Français' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'English' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Español' })).toBeDisabled()
  })

  it('n’a ni compte ni déconnexion', async () => {
    renderApp('/reglages')
    await screen.findByRole('heading', { level: 1, name: 'Réglages' })
    expect(screen.queryByText(/compte/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/connecter/i)).not.toBeInTheDocument()
  })

  it('mène à la page À propos', async () => {
    renderApp('/reglages')
    expect(await screen.findByRole('link', { name: 'À propos' })).toHaveAttribute('href', '/a-propos')
  })

  it('dit qu’aucun tutoriel n’est passé au départ', async () => {
    renderApp('/reglages')
    expect(await screen.findByText('Aucun tutoriel passé pour l’instant.')).toBeInTheDocument()
  })
})

describe('tutoriel passé', () => {
  it('« Jouer » ramène au tutoriel tant qu’il n’est pas fini', async () => {
    renderApp('/jeu/love-letter')
    expect(await screen.findByRole('link', { name: 'Jouer' })).toHaveAttribute(
      'href',
      '/jeu/love-letter/tutoriel/cartes',
    )
  })

  it('arriver au bout du tutoriel le marque passé : « Jouer » va droit à « Qui joue ? »', async () => {
    const first = renderApp('/jeu/love-letter/tutoriel/tour')
    await userEvent.click(await screen.findByRole('link', { name: 'Jouer' }))
    await waitFor(() => expect(window.localStorage.getItem('mastercards:tutorial:love-letter')).toBe('1'))
    first.unmount()

    renderApp('/jeu/love-letter')
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Jouer' })).toHaveAttribute('href', '/jeu/love-letter/joueurs'),
    )
  })

  it('apparaît dans les Réglages, où « Réactiver » le remet à zéro', async () => {
    window.localStorage.setItem('mastercards:tutorial:love-letter', '1')
    renderApp('/reglages')
    await userEvent.click(await screen.findByRole('button', { name: 'Réactiver le tutoriel de Love Letter' }))
    expect(screen.queryByRole('button', { name: /Réactiver/ })).not.toBeInTheDocument()
    expect(window.localStorage.getItem('mastercards:tutorial:love-letter')).toBe('0')
  })
})
