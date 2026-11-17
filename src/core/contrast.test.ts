import { describe, expect, it } from 'vitest'
import { contrastRatio, MIN_CONTRAST, pickTextColor } from './contrast.ts'
import { tokens } from './tokens.generated.ts'

describe('contrastRatio', () => {
  it('vaut 21 entre noir et blanc, 1 entre deux couleurs identiques', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#1E5BD6', '#1E5BD6')).toBeCloseTo(1, 5)
  })

  it('est symétrique', () => {
    expect(contrastRatio('#FFC928', '#14213D')).toBeCloseTo(contrastRatio('#14213D', '#FFC928'), 10)
  })

  it('refuse une couleur invalide', () => {
    expect(() => contrastRatio('rouge', '#FFFFFF')).toThrow()
  })
})

describe('pickTextColor', () => {
  it("choisit du blanc sur un fond foncé et de l'encre sur un fond clair", () => {
    expect(pickTextColor(tokens.colors.nuit)?.color).toBe(tokens.colors.blanc_carte)
    expect(pickTextColor(tokens.colors.soleil)?.color).toBe(tokens.colors.encre)
  })

  it("renvoie null quand aucun texte n'atteint le seuil", () => {
    // Gris moyen : ni blanc ni encre ne passent 4,5.
    expect(pickTextColor('#7A7A7A')).toBeNull()
  })
})

// La charte déclare quel texte va sur quel fond : on vérifie qu'elle respecte son propre seuil.
describe('charte : couples texte / fond', () => {
  const backgrounds: Record<string, string> = {
    ciel: tokens.colors.ciel,
    nuit: tokens.colors.nuit,
    cerise: tokens.colors.cerise,
    soleil: tokens.colors.soleil,
    prairie: tokens.colors.prairie,
    azur: tokens.colors.azur,
    tapis_vert: tokens.tapis.vert,
    tapis_rouge: tokens.tapis.rouge,
    tapis_bleu: tokens.tapis.bleu,
    tapis_jaune: tokens.tapis.jaune,
  }

  for (const [name, text] of Object.entries(tokens.textOn)) {
    it(`${name} : texte ${text} ≥ ${MIN_CONTRAST}`, () => {
      expect(contrastRatio(backgrounds[name], text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    })
  }
})
