import { describe, expect, it } from 'vitest'
import { contrastRatio, MIN_CONTRAST } from '../core/contrast.ts'
import { tokens } from '../core/tokens.generated.ts'
import { backgroundHex, resolveGameTheme } from './theme.ts'

describe('resolveGameTheme', () => {
  it('utilise la couleur de la charte pour un tapis nommé', () => {
    expect(backgroundHex('vert')).toBe(tokens.tapis.vert)
    expect(resolveGameTheme({ background_color: 'vert' }).background).toBe(tokens.tapis.vert)
  })

  it('choisit du blanc sur un tapis foncé et de l’encre sur le jaune, comme la charte', () => {
    expect(resolveGameTheme({ background_color: 'vert' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ background_color: 'rouge' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ background_color: 'bleu' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ background_color: 'jaune' }).text).toBe(tokens.colors.encre)
  })

  it('atteint le contraste minimum sur les quatre tapis', () => {
    for (const tapis of ['jaune', 'vert', 'rouge', 'bleu'] as const) {
      const theme = resolveGameTheme({ background_color: tapis })
      expect(contrastRatio(theme.background, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    }
  })

  it('accepte une couleur libre lisible', () => {
    const theme = resolveGameTheme({ background_color: '#6A1B9A' })
    expect(theme.background).toBe('#6A1B9A')
    expect(contrastRatio(theme.background, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
  })

  it('refuse une couleur libre sans contraste suffisant', () => {
    expect(() => resolveGameTheme({ background_color: '#7A7A7A' })).toThrow(/contraste/)
  })

  it('utilise Fredoka par défaut et la police du jeu sinon', () => {
    expect(resolveGameTheme({ background_color: 'vert' }).font.family).toContain('--mc-font-title')
    const theme = resolveGameTheme({ background_color: 'rouge', font: { family: 'Great Vibes', band_size: 4 } })
    expect(theme.font.family).toMatch(/^'Great Vibes', /)
    expect(theme.font.weight).toBe(400)
    expect(theme.font.bandSize).toBe(4)
  })

  it('calcule une ombre différente du fond', () => {
    const theme = resolveGameTheme({ background_color: 'vert' })
    expect(theme.shadow).not.toBe(theme.background)
  })
})
