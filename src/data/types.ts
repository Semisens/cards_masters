import type { Rank, Suit } from '../core/cards.ts'
import type { TapisName } from '../core/tokens.generated.ts'

/** Polices de nom de jeu embarquées dans l'app (voir src/core/fonts.ts). */
export type GameFont = 'Fredoka' | 'Great Vibes'

/** Un des quatre tapis de la charte, ou une couleur libre `#RRGGBB`. */
export type GameBackground = TapisName | `#${string}`

/** Mode de lecture des cartes : Classique, ou Connaisseur (lien avec le jeu d'origine). */
export type ReadingMode = 'classic' | 'expert'

/**
 * Un groupe de cartes du paquet à garder : une ligne de la vue liste, une page de la vue à balayer.
 * Ex. pour Trio, « 2 à 6 » réunit cinq rangs en trois couleurs, soit 15 cartes.
 */
export interface CardGroup {
  label: string
  ranks: Rank[]
  /** Nombre de cartes gardées dans le groupe. */
  count: number
  /** Couleurs gardées. Absent : n'importe lesquelles. Si présent, `count` = rangs x couleurs. */
  suits?: Suit[]
  /** La carte montrée dans la liste et la vue à balayer. */
  display: { rank: Rank; suit: Suit }
  /** Sous le titre, après « ×3 · ». */
  short: string
  /** Pastille à côté du titre (ex. « Spécial »). */
  badge?: string
  /** Carte d'explication de la vue à balayer. */
  detail: { title: string; text: string }
  expert: {
    /** Carte(s) du jeu d'origine (ex. « 2–6 »). */
    original: string
    /** Pouvoir ou règle d'origine, en une proposition. */
    power?: string
  }
}

export interface TurnStep {
  label: string
  text: string
}

export interface Tutorial {
  setup: { title: string; hand: string; center: string; steps: string[] }
  turn: { title: string; steps: TurnStep[]; win: { title: string; text: string } }
}

export interface RuleSection {
  title: string
  text: string
}

export interface Game {
  id: string
  name: string
  font?: GameFont
  background_color: GameBackground
  /** Nom d'un fichier du dossier du jeu (svg ou png). Absent : initiale dans un rond blanc. */
  logo?: string
  /** Phrase d'accroche en gras, sur la page du jeu. */
  tagline: string
  /** Texte qui suit la phrase d'accroche. */
  description: string
  players: { min: number; max: number }
  duration_min: number
  card_groups: CardGroup[]
  /** Mots du jeu d'origine interdits dans les textes du mode classique (vérifié par test). Optionnel. */
  classic_forbidden_terms?: string[]
  tutorial: Tutorial
  full_rules: RuleSection[]
}
