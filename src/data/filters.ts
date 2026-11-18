import { normalizeText } from '../core/text.ts'
import type { Game } from './types.ts'

export type GameFilter = 'all' | 'small' | 'quick'

/** Jeu « rapide » : une partie dure 15 minutes ou moins. */
export const QUICK_MAX_MINUTES = 15
/** Jeu « 2–4 joueurs » : il se joue en petit groupe, c'est-à-dire avec au moins un nombre de joueurs de 2 à 4. */
export const SMALL_MIN_PLAYERS = 2
export const SMALL_MAX_PLAYERS = 4

const matches: Record<GameFilter, (game: Game) => boolean> = {
  all: () => true,
  small: (game) => game.players.min <= SMALL_MAX_PLAYERS && game.players.max >= SMALL_MIN_PLAYERS,
  quick: (game) => game.duration_min <= QUICK_MAX_MINUTES,
}

/** Les jeux qui répondent au filtre choisi et contiennent le texte cherché dans leur nom (sans casse ni accents). */
export function filterGames(games: Game[], filter: GameFilter, query: string): Game[] {
  const wanted = normalizeText(query.trim())
  return games.filter((game) => matches[filter](game) && normalizeText(game.name).includes(wanted))
}
