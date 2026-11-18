import { describe, expect, it } from 'vitest'
import { contrastRatio, luminance, MIN_CONTRAST } from '../core/contrast.ts'
import { tokens } from '../core/tokens.generated.ts'
import { colorHex, resolveGameTheme } from './theme.ts'
import { scopeVariables } from './themeStyle.ts'

describe('resolveGameTheme', () => {
  it('utilise la couleur de la charte pour un tapis nommé', () => {
    expect(colorHex('vert')).toBe(tokens.tapis.vert)
    expect(resolveGameTheme({ main_color: 'vert' }).main).toBe(tokens.tapis.vert)
  })

  it('choisit du blanc sur un tapis foncé et de l’encre sur le jaune, comme la charte', () => {
    expect(resolveGameTheme({ main_color: 'vert' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ main_color: 'rouge' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ main_color: 'bleu' }).text).toBe(tokens.colors.blanc_carte)
    expect(resolveGameTheme({ main_color: 'jaune' }).text).toBe(tokens.colors.encre)
  })

  it('atteint le contraste minimum sur les quatre tapis', () => {
    for (const tapis of ['jaune', 'vert', 'rouge', 'bleu'] as const) {
      const theme = resolveGameTheme({ main_color: tapis })
      expect(contrastRatio(theme.main, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    }
  })

  it('accepte une couleur libre lisible', () => {
    const theme = resolveGameTheme({ main_color: '#6A1B9A' })
    expect(theme.main).toBe('#6A1B9A')
    expect(contrastRatio(theme.main, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
  })

  it('refuse une couleur libre sans contraste suffisant', () => {
    expect(() => resolveGameTheme({ main_color: '#7A7A7A' })).toThrow(/contraste/)
  })

  it('utilise Fredoka par défaut et la police du jeu sinon', () => {
    expect(resolveGameTheme({ main_color: 'vert' }).font.family).toContain('--mc-font-title')
    const theme = resolveGameTheme({ main_color: 'rouge', font: { family: 'Great Vibes', band_size: 4 } })
    expect(theme.font.family).toMatch(/^'Great Vibes', /)
    expect(theme.font.weight).toBe(400)
    expect(theme.font.bandSize).toBe(4)
  })

  it('calcule une ombre différente du fond', () => {
    const theme = resolveGameTheme({ main_color: 'vert' })
    expect(theme.shadow).not.toBe(theme.main)
  })

  describe('couleurs données par le jeu', () => {
    const palette = { main_color: '#812B2B', shadow_color: '#400E0E', text_color: '#EEDDC8' } as const

    it('prend l’ombre et le texte du jeu', () => {
      const theme = resolveGameTheme(palette)
      expect(theme).toMatchObject({ main: '#812B2B', shadow: '#400E0E', text: '#EEDDC8' })
    })

    it('met les couleurs en majuscules', () => {
      const theme = resolveGameTheme({ ...palette, shadow_color: '#400e0e', text_color: '#eeddc8' })
      expect(theme.shadow).toBe('#400E0E')
      expect(theme.text).toBe('#EEDDC8')
    })

    it('atteint le contraste minimum avec le texte du jeu', () => {
      const theme = resolveGameTheme(palette)
      expect(contrastRatio(theme.main, theme.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    })

    it('refuse un texte sans contraste suffisant, en le disant', () => {
      expect(() => resolveGameTheme({ ...palette, text_color: '#E57979' })).toThrow(/contraste de 3\.2/)
    })

    it('garde les couleurs calculées pour ce que le jeu ne donne pas', () => {
      const theme = resolveGameTheme({ main_color: '#812B2B', text_color: '#EEDDC8' })
      expect(theme.shadow).not.toBe('#400E0E')
      expect(theme.shadow).not.toBe(theme.main)
      expect(resolveGameTheme({ main_color: '#812B2B', shadow_color: '#400E0E' }).text).toBe(tokens.colors.blanc_carte)
    })
  })

  describe('fond des écrans', () => {
    const cream = { main_color: '#812B2B', background_color: '#EEDDC8' } as const

    it('sans background_color, pas de fond propre : le bleu de l’app', () => {
      expect(resolveGameTheme({ main_color: 'vert' }).screen).toBeUndefined()
    })

    it('tire un dégradé discret du fond : plus clair en haut, plus foncé en bas', () => {
      const { screen } = resolveGameTheme(cream)
      expect(screen?.base).toBe('#EEDDC8')
      expect(luminance(screen!.from)).toBeGreaterThan(luminance(screen!.base))
      expect(luminance(screen!.to)).toBeLessThan(luminance(screen!.base))
    })

    it('donne un relief plus foncé que le fond clair, plus clair que le fond foncé', () => {
      const light = resolveGameTheme(cream).screen!
      expect(luminance(light.edge)).toBeLessThan(luminance(light.base))
      const dark = resolveGameTheme({ ...cream, background_color: '#400E0E' }).screen!
      expect(luminance(dark.edge)).toBeGreaterThan(luminance(dark.base))
    })

    it('choisit l’encre sur un fond clair et le blanc sur un fond foncé', () => {
      expect(resolveGameTheme(cream).screen?.text).toBe(tokens.colors.encre)
      expect(resolveGameTheme({ ...cream, background_color: '#400E0E' }).screen?.text).toBe(tokens.colors.blanc_carte)
    })

    it('prend le texte du fond que le jeu donne, mis en majuscules', () => {
      const theme = resolveGameTheme({ ...cream, background_text_color: '#3f0f11' })
      expect(theme.screen?.text).toBe('#3F0F11')
    })

    it('lit le texte sur toute l’étendue du dégradé', () => {
      const { screen } = resolveGameTheme(cream)
      for (const end of [screen!.base, screen!.from, screen!.to])
        expect(contrastRatio(end, screen!.text)).toBeGreaterThanOrEqual(MIN_CONTRAST)
    })

    it('refuse un texte de fond illisible, en le disant', () => {
      expect(() => resolveGameTheme({ ...cream, background_text_color: '#E57979' })).toThrow(/sur le fond/)
    })

    it('refuse un fond où ni le blanc ni l’encre ne se lisent', () => {
      expect(() => resolveGameTheme({ ...cream, background_color: '#7A7A7A' })).toThrow(/contraste/)
    })

    it('accepte un tapis de la charte comme fond', () => {
      expect(resolveGameTheme({ main_color: '#812B2B', background_color: 'vert' }).screen?.base).toBe(tokens.tapis.vert)
    })
  })

  describe('dos de carte', () => {
    it('prend la couleur du jeu par défaut', () => {
      expect(resolveGameTheme({ main_color: '#812B2B' }).cardBack).toBe('#812B2B')
      expect(resolveGameTheme({ main_color: 'vert' }).cardBack).toBe(tokens.tapis.vert)
    })

    it('prend card_back_color, nom de charte ou couleur libre', () => {
      expect(resolveGameTheme({ main_color: '#812B2B', card_back_color: '#e57979' }).cardBack).toBe('#E57979')
      expect(resolveGameTheme({ main_color: '#812B2B', card_back_color: 'bleu' }).cardBack).toBe(tokens.tapis.bleu)
    })
  })

  describe('variables de la portée d’un jeu', () => {
    it('sans fond propre : seulement le dos des cartes, les pastilles gardent le bleu nuit', () => {
      const plain = scopeVariables(resolveGameTheme({ main_color: '#812B2B', text_color: '#EEDDC8' }))
      expect(plain).toEqual({ '--game-card-back': '#812B2B' })
    })

    it('avec un fond propre : fond, texte, relief, pastilles à la couleur du jeu, dos des cartes', () => {
      const themed = scopeVariables(
        resolveGameTheme({ main_color: '#812B2B', text_color: '#EEDDC8', background_color: '#EEDDC8' }),
      )
      expect(themed).toMatchObject({
        '--game-pill-bg': '#812B2B',
        '--game-pill-fg': '#EEDDC8',
        '--game-card-back': '#812B2B',
        '--game-screen-base': '#EEDDC8',
      })
      expect(Object.keys(themed)).toEqual(
        expect.arrayContaining(['--game-screen-from', '--game-screen-to', '--game-screen-fg', '--game-edge']),
      )
    })
  })
})
