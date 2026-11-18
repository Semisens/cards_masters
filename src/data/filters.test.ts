import { describe, expect, it } from 'vitest'
import { filterGames } from './filters.ts'
import { getGame } from './games.ts'
import type { Game } from './types.ts'

const trio = getGame('trio')!
const loveLetter = getGame('love-letter')!
const GAMES: Game[] = [loveLetter, trio]
const names = (games: Game[]) => games.map((g) => g.name)

describe('filterGames', () => {
  it('rend tous les jeux sans filtre ni recherche', () => {
    expect(names(filterGames(GAMES, 'all', ''))).toEqual(['Love Letter', 'Trio'])
  })

  it('cherche dans le nom, sans casse ni accents', () => {
    expect(names(filterGames(GAMES, 'all', 'trio'))).toEqual(['Trio'])
    expect(names(filterGames(GAMES, 'all', 'LOVE'))).toEqual(['Love Letter'])
    expect(names(filterGames(GAMES, 'all', '  lette '))).toEqual(['Love Letter'])
  })

  it('ne rend rien quand rien ne correspond', () => {
    expect(filterGames(GAMES, 'all', 'zzz')).toEqual([])
  })

  it('« 2–4 joueurs » garde les jeux qui se jouent au plus à quatre', () => {
    expect(names(filterGames(GAMES, 'small', ''))).toEqual(['Love Letter'])
  })

  it('« Rapide » garde les parties de 15 minutes ou moins', () => {
    expect(names(filterGames(GAMES, 'quick', ''))).toEqual(['Trio'])
  })

  it('combine filtre et recherche', () => {
    expect(filterGames(GAMES, 'quick', 'love')).toEqual([])
  })
})
