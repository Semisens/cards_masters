import type { Rank, Suit } from '../core/cards.ts'
import type { TapisName } from '../core/tokens.generated.ts'

// Deux familles de types :
// - `*Config` : ce qu'on écrit dans `src/content/games/<id>/game.yaml` (validé par `src/content/game.schema.json`) ;
// - les autres : le jeu prêt à l'emploi, calculé une fois au chargement (`src/data/loadGame.ts`).
// Les écrans ne lisent que le jeu prêt à l'emploi : ils sont les mêmes pour tous les jeux.

/** Un des quatre tapis de la charte, ou une couleur libre `#RRGGBB`. */
export type GameBackground = TapisName | `#${string}`

/** Mode de lecture des cartes : Classique, ou Connaisseur (lien avec le jeu d'origine). */
export type ReadingMode = 'classic' | 'expert'

/** Un rang tel qu'on l'écrit en YAML : `2` (nombre) ou `"2"`, `J`, `A`… */
export type RankInput = Rank | number

/** Une carte précise du paquet. */
export interface DeckCard {
  rank: Rank
  suit: Suit
}

/** Des rangs, dans des couleurs (`all` : les quatre). Ex. les rois noirs : `{ ranks: [K], suits: [spades, clubs] }`. */
export interface CardSpecConfig {
  ranks: RankInput[]
  suits: Suit[] | 'all'
}

/** Police du nom du jeu. Sans `file`, une police déjà embarquée (Fredoka, Nunito). */
export interface FontConfig {
  /** Fichier woff2 déposé dans le dossier du jeu. */
  file?: string
  family: string
  weight?: number
  /** Taille du nom dans le bandeau, en multiples de 16 px. Défaut : 3,5. */
  band_size?: number
}

interface CardGroupBase {
  label: string
  /** Sous le titre, après « ×3 · ». */
  short: string
  /** Pastille à côté du titre (ex. « Spécial »). */
  badge?: string
  /** Carte d'explication de la vue à balayer. */
  detail: { title: string; text: string }
  /** Correspondance avec le jeu d'origine (mode connaisseur). */
  expert: {
    /** Carte(s) du jeu d'origine (ex. « 2–6 »). */
    original: string
    /** Nom du personnage ou de la carte d'origine (ex. « Prêtre »). Absent : « 2–6 → 2 à 6 ». */
    name?: string
    /** Pouvoir ou règle d'origine, en une proposition. */
    power?: string
  }
}

/** Un groupe de cartes à garder, tel qu'écrit dans la configuration. */
export interface CardGroupConfig extends CardGroupBase {
  cards: CardSpecConfig[]
  /** Carte montrée dans la liste et la vue à balayer. Absent : la première carte du groupe. */
  display?: { rank: RankInput; suit: Suit }
}

/**
 * Un groupe de cartes du paquet à garder : une ligne de la vue liste, une page de la vue à balayer.
 * Ex. pour Trio, « 2 à 6 » réunit cinq rangs en trois couleurs, soit 15 cartes.
 */
export interface CardGroup extends CardGroupBase {
  /** Les cartes exactes du groupe. */
  cards: DeckCard[]
  /** Les rangs du groupe, dans l'ordre du paquet. */
  ranks: Rank[]
  count: number
  display: DeckCard
}

export interface TurnStep {
  label: string
  text: string
}

/** Un élément du schéma de mise en place : un dos de carte, ou une carte visible si `card` est donné. */
export interface DiagramItem {
  label: string
  card?: DeckCard
}

export interface DiagramItemConfig {
  label: string
  card?: { rank: RankInput; suit: Suit }
}

export interface Tutorial<Item = DiagramItem> {
  setup: { title: string; diagram: Item[]; steps: string[] }
  turn: { title: string; steps: TurnStep[]; win: { title: string; text: string } }
}

export interface RuleSection {
  title: string
  text: string
}

/**
 * Comment la partie se marque. Tous les jeux fonctionnent pareil : à chaque saisie, on note les points gagnés
 * depuis la précédente ; « Valider » les ajoute et passe à la manche suivante.
 */
export interface Scoring {
  /** Ce qu'on compte, au singulier (« trio », « point »). Sert aux libellés pour lecteurs d'écran. */
  unit: string
  /** En haut à droite de la partie en cours (« Manche {round} », « Trios gagnés »). */
  party_label: string
  /** Titre de l'écran de saisie. `{round}` est remplacé par le numéro de manche. */
  title: string
  question: string
  validate: string
  /** Points à atteindre pour gagner : un nombre, ou un nombre par effectif (clé = nombre de joueurs). Absent : pas de fin automatique. */
  target?: number | Record<string, number>
}

interface GameBase {
  id: string
  name: string
  background_color: GameBackground
  /** Nom d'un fichier du dossier du jeu (svg ou png). Absent : initiale dans un rond blanc. */
  logo?: string
  /** Phrase d'accroche en gras, sur la page du jeu. */
  tagline: string
  /** Texte qui suit la phrase d'accroche. */
  description: string
  players: { min: number; max: number }
  duration_min: number
  /** Mot qui numérote la vue à balayer : « Groupe 3 / 6 » (défaut) ou « Carte 2 / 8 ». */
  group_word?: string
  scoring: Scoring
  /** Mots du jeu d'origine interdits dans les textes du mode classique (vérifié par test). Optionnel. */
  classic_forbidden_terms?: string[]
  full_rules: RuleSection[]
}

/** Le fichier `game.yaml` d'un jeu. */
export interface GameConfig extends GameBase {
  font?: FontConfig
  card_groups: CardGroupConfig[]
  tutorial: Tutorial<DiagramItemConfig>
}

/** Un jeu prêt à l'emploi : cartes calculées, textes complétés (`{cards}`), police résolue. */
export interface Game extends GameBase {
  /** Police du nom ; `url` est l'adresse du fichier embarqué, s'il y en a un. */
  font?: FontConfig & { url?: string }
  card_groups: CardGroup[]
  tutorial: Tutorial
}
