import { loadGame } from './loadGame.ts'
import type { Game, GameConfig } from './types.ts'

// Chaque jeu est un dossier src/content/games/<id>/ avec un game.yaml (et, si besoin, un logo et une police).
// Ajouter un jeu = ajouter ce dossier. Aucun code à modifier. Les fichiers sont embarqués dans le build
// (donc précachés pour le hors ligne) et validés par src/data/games.test.ts.
const configModules = import.meta.glob<GameConfig>('../content/games/*/game.yaml', { eager: true, import: 'default' })
const assetModules = import.meta.glob<string>('../content/games/*/*.{svg,png,woff2}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Adresse d'un fichier du dossier d'un jeu, ou `undefined` s'il n'existe pas. */
const assetUrl = (id: string, file: string): string | undefined => assetModules[`../content/games/${id}/${file}`]

/** Configurations brutes, telles qu'écrites dans les game.yaml (pour les tests du schéma). */
export const gameConfigs: GameConfig[] = Object.values(configModules)

export const games: Game[] = gameConfigs
  .map((config) => loadGame(config, (file) => assetUrl(config.id, file)))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'))

export function getGame(id: string | undefined): Game | undefined {
  return games.find((game) => game.id === id)
}

/** URL du logo du jeu, ou `undefined` s'il n'en a pas (on affiche alors l'initiale). */
export function logoUrl(game: Pick<Game, 'id' | 'logo'>): string | undefined {
  return game.logo ? assetUrl(game.id, game.logo) : undefined
}

/** Chemins des fichiers de jeu, pour les tests (vérifier que l'id égale le nom du dossier). */
export const gameFiles = Object.keys(configModules)
