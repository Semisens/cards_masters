import Ajv2020 from 'ajv/dist/2020.js'
import { describe, expect, it } from 'vitest'
import schema from '../content/game.schema.json'
import { SUITS, isRedSuit } from '../core/cards.ts'
import { contrastRatio, MIN_CONTRAST } from '../core/contrast.ts'
import { FULL_DECK, deckPlan, removalList } from './deck.ts'
import { gameFiles, games, getGame, logoUrl } from './games.ts'
import { resolveGameTheme } from './theme.ts'
import type { Game } from './types.ts'

// ---------------------------------------------------------------------------------------------------------
// Aides de relecture éditoriale (testées plus bas, pour prouver qu'elles détectent bien ce qu'elles doivent)
// ---------------------------------------------------------------------------------------------------------

/** Minuscules et sans accents, pour comparer des mots sans se soucier de la casse ni des accents. */
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/** Termes interdits trouvés dans un texte (mots entiers). */
export function forbiddenTermsIn(text: string, terms: string[]): string[] {
  const haystack = normalize(text)
  return terms.filter((term) => new RegExp(`(^|[^a-z0-9])${normalize(term)}([^a-z0-9]|$)`).test(haystack))
}

/** Marques du vouvoiement : le cahier des charges impose le tutoiement. */
export function voussoiementIn(text: string): string[] {
  return normalize(text).match(/\b(vous|votre|vos)\b/g) ?? []
}

const MAX_WORDS_PER_SENTENCE = 22

/** Phrases trop longues (le cahier des charges demande des phrases courtes). */
export function longSentencesIn(text: string): string[] {
  return text
    .split(/[.!?…:;]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).filter(Boolean).length > MAX_WORDS_PER_SENTENCE)
}

/** Tous les textes que le mode classique affiche (tout, sauf la ligne « pouvoir d'origine » du mode connaisseur). */
const classicTexts = (game: Game): string[] => [
  game.name,
  game.tagline,
  game.description,
  ...game.card_groups.flatMap((g) => [g.label, g.short, g.badge ?? '', g.detail.title, g.detail.text]),
  game.tutorial.setup.title,
  game.tutorial.setup.hand,
  game.tutorial.setup.center,
  ...game.tutorial.setup.steps,
  game.tutorial.turn.title,
  ...game.tutorial.turn.steps.flatMap((s) => [s.label, s.text]),
  game.tutorial.turn.win.title,
  game.tutorial.turn.win.text,
  ...game.full_rules.flatMap((s) => [s.title, s.text]),
]
const allTexts = (game: Game): string[] => [
  ...classicTexts(game),
  ...game.card_groups.flatMap((g) => [g.expert.original, g.expert.power ?? '']),
]

// ---------------------------------------------------------------------------------------------------------

const ajv = new Ajv2020({ allErrors: true, strict: true })
const validate = ajv.compile(schema)

describe('aides de relecture', () => {
  it('détectent un terme interdit, quelle que soit la casse ou l’accent', () => {
    expect(forbiddenTermsIn('Le Trio gagne.', ['trio'])).toEqual(['trio'])
    expect(forbiddenTermsIn('Mode PIQUANT', ['piquant'])).toEqual(['piquant'])
    expect(forbiddenTermsIn('Mode Pîquant', ['piquant'])).toEqual(['piquant'])
  })

  it('ne confondent pas un mot avec un autre qui le contient', () => {
    expect(forbiddenTermsIn('Un trio de rois', ['rio'])).toEqual([])
    expect(forbiddenTermsIn('Un concerto', ['trio'])).toEqual([])
  })

  it('détectent le vouvoiement', () => {
    expect(voussoiementIn('Vous retournez votre carte.')).toHaveLength(2)
    expect(voussoiementIn('Tu retournes ta carte.')).toEqual([])
  })

  it('détectent les phrases trop longues', () => {
    const long = Array.from({ length: MAX_WORDS_PER_SENTENCE + 1 }, () => 'mot').join(' ')
    expect(longSentencesIn(`Court. ${long}.`)).toHaveLength(1)
    expect(longSentencesIn('Court. Encore court : deux parties.')).toEqual([])
  })

  it('le schéma refuse un jeu incomplet', () => {
    expect(validate({ id: 'x' })).toBe(false)
  })
})

describe('liste des jeux', () => {
  it('contient au moins un jeu', () => {
    expect(games.length).toBeGreaterThan(0)
  })

  it('a des identifiants uniques', () => {
    expect(new Set(games.map((g) => g.id)).size).toBe(games.length)
  })

  it('retrouve un jeu par son id', () => {
    expect(getGame('trio')?.name).toBe('Trio')
    expect(getGame('inconnu')).toBeUndefined()
    expect(getGame(undefined)).toBeUndefined()
  })
})

describe.each(games.map((game) => [game.id, game] as const))('jeu « %s »', (id, game) => {
  it('respecte le schéma JSON', () => {
    const ok = validate(game)
    expect(ok, JSON.stringify(validate.errors, null, 2)).toBe(true)
  })

  it('a un id égal au nom de son dossier', () => {
    expect(gameFiles.find((f) => f.includes(`/games/${id}/`))).toBe(`../content/games/${id}/game.json`)
  })

  it('a un nombre de joueurs cohérent', () => {
    expect(game.players.min).toBeLessThanOrEqual(game.players.max)
  })

  it('a un logo qui existe, s’il en déclare un', () => {
    if (game.logo) expect(logoUrl(game), `logo ${game.logo} introuvable`).toBeTruthy()
  })

  describe('groupes de cartes', () => {
    it('ne gardent chaque rang qu’une fois', () => {
      const ranks = game.card_groups.flatMap((g) => g.ranks)
      expect(new Set(ranks).size).toBe(ranks.length)
    })

    it('ont un nombre de cartes égal aux rangs x couleurs listées', () => {
      for (const group of game.card_groups) {
        if (group.suits) expect(group.count, group.label).toBe(group.ranks.length * group.suits.length)
        else expect(group.count, group.label).toBeLessThanOrEqual(group.ranks.length * SUITS.length)
      }
    })

    it('montrent une carte qui fait partie du groupe', () => {
      for (const group of game.card_groups) {
        expect(group.ranks, group.label).toContain(group.display.rank)
        if (group.suits) expect(group.suits, group.label).toContain(group.display.suit)
      }
    })

    it('tiennent dans un paquet de 52 cartes', () => {
      const plan = deckPlan(game)
      expect(plan.keptTotal).toBeGreaterThan(0)
      expect(plan.keptTotal).toBeLessThanOrEqual(FULL_DECK)
      expect(plan.keptTotal + plan.removedTotal).toBe(FULL_DECK)
    })

    it('donnent à chacun son pendant dans le jeu d’origine (mode connaisseur)', () => {
      for (const group of game.card_groups) expect(group.expert.original.trim(), group.label).not.toBe('')
    })
  })

  describe('thème', () => {
    it('a un contraste texte / fond d’au moins 4,5', () => {
      const theme = resolveGameTheme(game)
      expect(contrastRatio(theme.background, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    })
  })

  describe('vocabulaire', () => {
    it('évite les termes d’origine que le jeu interdit en mode classique', () => {
      const terms = game.classic_forbidden_terms ?? []
      const found = classicTexts(game).flatMap((text) => forbiddenTermsIn(text, terms))
      expect(found).toEqual([])
    })
  })

  describe('ton', () => {
    it('tutoie partout', () => {
      expect(allTexts(game).flatMap(voussoiementIn)).toEqual([])
    })

    it('utilise des phrases courtes', () => {
      expect(allTexts(game).flatMap(longSentencesIn)).toEqual([])
    })
  })
})

describe('Trio', () => {
  const trio = getGame('trio')!
  const plan = deckPlan(trio)

  it('regroupe les cartes comme la maquette : 6 lignes', () => {
    expect(trio.card_groups.map((g) => g.label)).toEqual(['A', '2 à 6', '7', '8 à 10', 'Valet', 'Dame'])
    expect(trio.card_groups.map((g) => g.count)).toEqual([3, 15, 3, 9, 3, 3])
  })

  it('garde 36 cartes : on retire les carreaux et les rois', () => {
    expect(plan.keptTotal).toBe(36)
    expect(plan.removedTotal).toBe(16)
    expect(plan.removedSuits).toEqual(['diamonds'])
    expect(plan.removedRanks).toEqual(['K'])
    expect(plan.keptSuits).toEqual(['spades', 'hearts', 'clubs'])
    expect(removalList(plan)).toBe('les carreaux et les rois')
  })

  it('numérote les valeurs d’origine de 1 à 12', () => {
    expect(trio.card_groups.map((g) => g.expert.original)).toEqual(['1', '2–6', '7', '8–10', '11', '12'])
  })

  it('met en avant le 7 : pastille « Spécial » et pouvoir d’origine', () => {
    const seven = trio.card_groups.find((g) => g.label === '7')!
    expect(seven.badge).toBe('Spécial')
    expect(seven.expert.power).toMatch(/victoire/)
    expect(trio.card_groups.filter((g) => g.badge)).toHaveLength(1)
  })

  it('alterne cartes rouges et noires dans la liste, comme la maquette', () => {
    const reds = trio.card_groups.map((g) => isRedSuit(g.display.suit))
    expect(reds).toEqual([true, false, true, false, true, false])
  })

  it('se joue de 3 à 6 joueurs, en 15 minutes', () => {
    expect(trio.players).toEqual({ min: 3, max: 6 })
    expect(trio.duration_min).toBe(15)
  })

  it('répartit les 36 cartes entre joueurs et centre pour chaque effectif', () => {
    // Mise en place d'origine : [joueurs, cartes par joueur, cartes au centre].
    const setups: Array<[number, number, number]> = [
      [3, 9, 9],
      [4, 7, 8],
      [5, 6, 6],
      [6, 5, 6],
    ]
    for (const [players, each, center] of setups) expect(players * each + center).toBe(36)
    // Les textes citent ces nombres : 9, 7, 6 ou 5 cartes par joueur.
    const text = [...trio.tutorial.setup.steps, ...trio.full_rules.map((s) => s.text)].join(' ')
    expect(text).toContain('9, 7, 6 ou 5 cartes')
  })

  it('reprend les textes de la maquette mot pour mot', () => {
    expect(trio.tagline).toBe('Trouve trois cartes identiques.')
    expect(trio.tutorial.turn.win.text).toBe('Réunis 3 trios. Ou le trio de 7.')
    expect(trio.tutorial.setup.hand).toBe('Ta main, triée')
    expect(trio.tutorial.setup.center).toBe('Au centre, cachées')
    expect(trio.full_rules.map((s) => s.title)).toEqual([
      'But',
      'Mise en place',
      'Un tour',
      'Trio',
      'Cartes différentes',
      'Mode piquant',
    ])
  })

  it('ne laisse aucun texte provisoire de la maquette', () => {
    expect(allTexts(trio).join('\n')).not.toMatch(/à détailler|\[|\]/i)
  })
})
