import { fill } from '../core/format.ts'
import { RANKS } from '../core/cards.ts'
import { expandCards, toRank } from './deck.ts'
import type { CardGroup, CardGroupConfig, Game, GameConfig } from './types.ts'

/** Remplace `{cards}` (nombre de cartes gardées) dans tous les textes. Les autres `{…}` (`{round}`) restent. */
function fillTexts<T>(value: T, values: Record<string, number>): T {
  if (typeof value === 'string') return fill(value, values) as T
  if (Array.isArray(value)) return value.map((item: unknown) => fillTexts(item, values)) as T
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillTexts(item, values)])) as T
  return value
}

/** Un groupe de cartes prêt à l’emploi : cartes exactes, rangs, nombre de cartes, carte montrée. */
export function loadCardGroup(group: CardGroupConfig): CardGroup {
  const cards = expandCards(group.cards)
  const ranks = RANKS.filter((rank) => cards.some((card) => card.rank === rank))
  const display = group.display ? { rank: toRank(group.display.rank), suit: group.display.suit } : cards[0]
  return { ...group, cards, ranks, count: cards.length, display }
}

/**
 * Prépare un jeu à partir de sa configuration (`game.yaml`) : cartes exactes et nombre de cartes de chaque groupe,
 * carte montrée, `{cards}` remplacé dans les textes, adresse du fichier de police.
 * La configuration est supposée valide (schéma vérifié par `src/data/games.test.ts`).
 * @param assetUrl adresse d'un fichier du dossier du jeu (police), ou `undefined` s'il n'existe pas.
 */
export function loadGame(config: GameConfig, assetUrl: (file: string) => string | undefined = () => undefined): Game {
  const card_groups = config.card_groups.map(loadCardGroup)
  const total = card_groups.reduce((sum, group) => sum + group.count, 0)
  const { font, ...rest } = fillTexts(config, { cards: total })
  return {
    ...rest,
    ...(font ? { font: { ...font, url: font.file ? assetUrl(font.file) : undefined } } : {}),
    card_groups: card_groups.map((group) => fillTexts(group, { cards: total })),
    tutorial: {
      ...rest.tutorial,
      setup: {
        ...rest.tutorial.setup,
        diagram: rest.tutorial.setup.diagram.map(({ label, card }) => ({
          label,
          ...(card ? { card: { rank: toRank(card.rank), suit: card.suit } } : {}),
        })),
      },
    },
  }
}
