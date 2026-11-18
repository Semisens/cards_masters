import { describe, expect, it } from 'vitest'
import type { Scoring } from '../data/types.ts'
import {
  endRound,
  hasWinner,
  MAX_ROUND,
  MAX_SCORE,
  newSession,
  parseSession,
  rankPlayers,
  sessionKey,
  winTarget,
} from './session.ts'

const ROUNDS: Scoring = {
  rounds: true,
  unit: 'point',
  title: 'Fin de la manche {round}',
  question: 'Qui ?',
  validate: 'Valider la manche',
  round_label: 'Manche {round}',
  target: { '2': 7, '3': 5, '4': 4 },
}
const NO_TARGET: Scoring = {
  rounds: false,
  unit: 'trio',
  title: 'Trios gagnés',
  question: 'Qui ?',
  validate: 'Valider',
}

describe('parseSession', () => {
  it('relit une partie valide', () => {
    const raw = JSON.stringify({
      players: [
        { name: 'Léa', score: 2 },
        { name: 'Tom', score: 0 },
      ],
      round: 3,
    })
    expect(parseSession(raw)).toEqual({
      players: [
        { name: 'Léa', score: 2 },
        { name: 'Tom', score: 0 },
      ],
      round: 3,
    })
  })

  it('relit l’ancien format (trios, sans manche) : une partie en cours n’est pas perdue', () => {
    const raw = JSON.stringify({ players: [{ name: 'Léa', trios: 2 }] })
    expect(parseSession(raw)).toEqual({ players: [{ name: 'Léa', score: 2 }], round: 1 })
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
    ['un joueur sans nom', JSON.stringify({ players: [{ score: 1 }] })],
    ['un nom vide', JSON.stringify({ players: [{ name: '  ', score: 1 }] })],
    ['un score négatif', JSON.stringify({ players: [{ name: 'A', score: -1 }] })],
    ['un score décimal', JSON.stringify({ players: [{ name: 'A', score: 1.5 }] })],
    ['un score trop grand', JSON.stringify({ players: [{ name: 'A', score: MAX_SCORE + 1 }] })],
    ['un score qui n’est pas un nombre', JSON.stringify({ players: [{ name: 'A', score: '2' }] })],
    ['un joueur null', JSON.stringify({ players: [null] })],
    ['une manche à zéro', JSON.stringify({ players: [{ name: 'A', score: 1 }], round: 0 })],
    ['une manche trop grande', JSON.stringify({ players: [{ name: 'A', score: 1 }], round: MAX_ROUND + 1 })],
    ['une manche qui n’est pas un nombre', JSON.stringify({ players: [{ name: 'A', score: 1 }], round: '2' })],
  ])('ignore une donnée abîmée : %s', (_label, raw) => {
    expect(parseSession(raw)).toBeNull()
  })
})

describe('newSession', () => {
  it('démarre tous les joueurs à zéro, à la première manche', () => {
    expect(newSession(['Léa', 'Tom'], (n) => `J${n}`)).toEqual({
      players: [
        { name: 'Léa', score: 0 },
        { name: 'Tom', score: 0 },
      ],
      round: 1,
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
    expect(sessionKey('love-letter')).not.toBe(sessionKey('trio'))
  })
})

describe('fin de partie', () => {
  const session = (scores: number[]) => ({ players: scores.map((score, i) => ({ name: `J${i}`, score })), round: 2 })

  it('lit le score visé selon le nombre de joueurs', () => {
    expect(winTarget(ROUNDS, 2)).toBe(7)
    expect(winTarget(ROUNDS, 3)).toBe(5)
    expect(winTarget(ROUNDS, 4)).toBe(4)
    expect(winTarget(ROUNDS, 5)).toBeUndefined()
    expect(winTarget(NO_TARGET, 3)).toBeUndefined()
  })

  it('désigne un gagnant dès que le score visé est atteint', () => {
    expect(hasWinner(session([3, 4, 2]), ROUNDS)).toBe(false)
    expect(hasWinner(session([3, 5, 2]), ROUNDS)).toBe(true)
    expect(hasWinner(session([6, 0, 0, 4]), ROUNDS)).toBe(true)
  })

  it('ne termine jamais seule une partie sans score visé', () => {
    expect(hasWinner(session([50, 0, 0]), NO_TARGET)).toBe(false)
  })
})

describe('endRound', () => {
  it('ajoute les points gagnés et passe à la manche suivante', () => {
    const next = endRound(
      {
        players: [
          { name: 'Léa', score: 2 },
          { name: 'Tom', score: 1 },
        ],
        round: 3,
      },
      [1, 0],
    )
    expect(next).toEqual({
      players: [
        { name: 'Léa', score: 3 },
        { name: 'Tom', score: 1 },
      ],
      round: 4,
    })
  })

  it('ne dépasse jamais le maximum', () => {
    const next = endRound({ players: [{ name: 'Léa', score: MAX_SCORE }], round: MAX_ROUND }, [5])
    expect(next.players[0].score).toBe(MAX_SCORE)
    expect(next.round).toBe(MAX_ROUND)
  })
})

describe('rankPlayers', () => {
  it('classe par score décroissant', () => {
    const ranked = rankPlayers([
      { name: 'Léa', score: 1 },
      { name: 'Tom', score: 2 },
      { name: 'Inès', score: 0 },
    ])
    expect(ranked.map((p) => [p.name, p.rank])).toEqual([
      ['Tom', 1],
      ['Léa', 2],
      ['Inès', 3],
    ])
  })

  it('donne le même rang aux égalités, puis saute les places', () => {
    const ranked = rankPlayers([
      { name: 'A', score: 2 },
      { name: 'B', score: 2 },
      { name: 'C', score: 1 },
    ])
    expect(ranked.map((p) => p.rank)).toEqual([1, 1, 3])
  })
})
