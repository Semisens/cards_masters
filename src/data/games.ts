import type { Game } from './types.ts'

// Chaque jeu est un dossier src/content/games/<id>/ avec un game.json (et un logo optionnel).
// Ajouter un jeu = ajouter ce dossier. Aucun code à modifier. Les fichiers sont embarqués dans le build
// (donc précachés pour le hors ligne) et validés par src/data/games.test.ts.
const gameModules = import.meta.glob<Game>('../content/games/*/game.json', { eager: true, import: 'default' })
const logoModules = import.meta.glob<string>('../content/games/*/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const games: Game[] = Object.values(gameModules).sort((a, b) => a.name.localeCompare(b.name, 'fr'))

export function getGame(id: string | undefined): Game | undefined {
  return games.find((game) => game.id === id)
}

/** URL du logo du jeu, ou `undefined` s'il n'en a pas (on affiche alors l'initiale). */
export function logoUrl(game: Pick<Game, 'id' | 'logo'>): string | undefined {
  return game.logo ? logoModules[`../content/games/${game.id}/${game.logo}`] : undefined
}

/** Chemins des fichiers de jeu, pour les tests (vérifier que l'id égale le nom du dossier). */
export const gameFiles = Object.keys(gameModules)
