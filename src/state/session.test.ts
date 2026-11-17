import { describe, expect, it } from 'vitest'
import { MAX_TRIOS, newSession, parseSession, sessionKey } from './session.ts'

describe('parseSession', () => {
  it('relit une partie valide', () => {
    const raw = JSON.stringify({
      players: [
        { name: 'Léa', trios: 2 },
        { name: 'Tom', trios: 0 },
      ],
    })
    expect(parseSession(raw)).toEqual({
      players: [
        { name: 'Léa', trios: 2 },
        { name: 'Tom', trios: 0 },
      ],
    })
  })

  it('renvoie null sans donnée', () => {
    expect(parseSession(null)).toBeNull()
    expect(parseSession('')).toBeNull()
  })

  it.each([
    ['du texte qui n’est pas du JSON', '{pas du json'],
    ['un autre type', '42'],
    ['sans liste de joueurs', JSON.stringify({ gens: [] })],
    ['une liste vide', JSON.stringify({ players: [] })],
    ['un joueur sans nom', JSON.stringify({ players: [{ trios: 1 }] })],
    ['un nom vide', JSON.stringify({ players: [{ name: '  ', trios: 1 }] })],
    ['un score négatif', JSON.stringify({ players: [{ name: 'A', trios: -1 }] })],
    ['un score décimal', JSON.stringify({ players: [{ name: 'A', trios: 1.5 }] })],
    ['un score trop grand', JSON.stringify({ players: [{ name: 'A', trios: MAX_TRIOS + 1 }] })],
    ['un score qui n’est pas un nombre', JSON.stringify({ players: [{ name: 'A', trios: '2' }] })],
    ['un joueur null', JSON.stringify({ players: [null] })],
  ])('ignore une donnée abîmée : %s', (_label, raw) => {
    expect(parseSession(raw)).toBeNull()
  })
})

describe('newSession', () => {
  it('démarre tous les joueurs à zéro', () => {
    expect(newSession(['Léa', 'Tom'], (n) => `J${n}`)).toEqual({
      players: [
        { name: 'Léa', trios: 0 },
        { name: 'Tom', trios: 0 },
      ],
    })
  })

  it('donne un nom par défaut aux champs vides et nettoie les espaces', () => {
    const session = newSession(['  Léa  ', '', '   '], (n) => `Joueur ${n}`)
    expect(session.players.map((p) => p.name)).toEqual(['Léa', 'Joueur 2', 'Joueur 3'])
  })
})

describe('sessionKey', () => {
  it('est propre à chaque jeu', () => {
    expect(sessionKey('trio')).toBe('session:trio')
    expect(sessionKey('trio')).not.toBe(sessionKey('autre'))
  })
})
