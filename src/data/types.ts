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
  /**
   * Liste exacte, quand les rangs n'ont pas les mêmes couleurs (ex. 4 valets et 2 rois noirs).
   * Si présente : `ranks` en est la liste des rangs et `count` le nombre total de cartes ; `suits` est absent.
   */
  cards?: CardSpec[]
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
    /** Nom du personnage ou de la carte d'origine (ex. « Prêtre »). Absent : « 2–6 → 2 à 6 ». */
    name?: string
    /** Pouvoir ou règle d'origine, en une proposition. */
    power?: string
  }
}

/** Des cartes d'un même rang, dans les couleurs listées (ex. les rois noirs : K de pique et de trèfle). */
export interface CardSpec {
  rank: Rank
  suits: Suit[]
}

export interface TurnStep {
  label: string
  text: string
}

/** Un élément du schéma de mise en place : un dos de carte, ou une carte visible si `card` est donné. */
export interface DiagramItem {
  label: string
  card?: { rank: Rank; suit: Suit }
}

export interface Tutorial {
  setup: { title: string; diagram: DiagramItem[]; steps: string[] }
  turn: { title: string; steps: TurnStep[]; win: { title: string; text: string } }
}

export interface RuleSection {
  title: string
  text: string
}

/** Comment la partie se marque : les mots du jeu (trios, manches…) et la règle de fin. */
export interface Scoring {
  /** Vrai : la partie se joue en manches (« Manche 3 »), et on note les points gagnés à chaque manche. */
  rounds: boolean
  /** Ce qu'on compte, au singulier (« trio », « point »). */
  unit: string
  /** Titre de l'écran de saisie. `{round}` est remplacé par le numéro de manche. */
  title: string
  question: string
  validate: string
  /** « Manche {round} », affiché dans la partie en cours (jeux à manches). */
  round_label?: string
  /** Points à atteindre pour gagner, selon le nombre de joueurs (clé = nombre de joueurs). Absent : pas de fin automatique. */
  target?: Record<string, number>
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
  /** Mot qui numérote la vue à balayer : « Groupe 3 / 6 » (défaut) ou « Carte 2 / 8 ». */
  group_word?: string
  scoring: Scoring
  /** Mots du jeu d'origine interdits dans les textes du mode classique (vérifié par test). Optionnel. */
  classic_forbidden_terms?: string[]
  tutorial: Tutorial
  full_rules: RuleSection[]
}
