// Garde-fou du cahier des charges (section 4.6) : aucune couleur, rayon, espacement ou taille de texte
// en dur dans les composants. Tout passe par les variables --mc-* générées depuis la charte.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const files = walk(srcDir).filter(
  (f) =>
    /\.(css|tsx?)$/.test(f) &&
    !/\.test\.tsx?$/.test(f) &&
    !f.includes('.generated.') &&
    !f.includes(`${join('src', 'test')}`),
)

/** Retire les commentaires pour ne pas signaler une valeur citée dans une explication. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// Un hex de couleur, ou une couleur fonctionnelle écrite à la main.
// `color-mix(` est aussi interdit : absent d'iOS avant 16.2, alors que l'app vise iOS 15. Les teintes dérivées
// sont calculées dans scripts/gen-tokens.ts.
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/g
// Propriétés de rayon / espacement / texte avec une longueur littérale non nulle (px, rem, em).
const LENGTH_PROP =
  /(?:^|[\s;{])(border-radius|padding(?:-[a-z]+)?|margin(?:-[a-z]+)?|gap|row-gap|column-gap|font-size)\s*:\s*([^;}]+)/g
const LITERAL_LENGTH = /(?<![\w.-])-?\d*\.?\d+(?:px|rem|em)\b/

function findViolations(file: string): string[] {
  const source = stripComments(readFileSync(file, 'utf8'))
  const found: string[] = []

  for (const match of source.matchAll(COLOR)) found.push(`couleur en dur : ${match[0]}`)

  if (file.endsWith('.css')) {
    for (const [, prop, value] of source.matchAll(LENGTH_PROP)) {
      // On retire les var(...) et calc(...) : seules comptent les longueurs littérales hors tokens.
      const outsideTokens = value.replace(/var\([^)]*\)/g, '')
      if (LITERAL_LENGTH.test(outsideTokens)) found.push(`${prop}: ${value.trim()}`)
    }
  }
  return found
}

describe('aucune valeur de charte en dur', () => {
  it('parcourt bien des fichiers', () => {
    expect(files.length).toBeGreaterThan(5)
  })

  for (const file of files) {
    it(relative(root, file), () => {
      expect(findViolations(file)).toEqual([])
    })
  }

  // Preuve que le garde-fou détecte bien ce qu'il doit détecter.
  describe('détection', () => {
    const detect = (css: string) => {
      const source = stripComments(css)
      const bad: string[] = []
      for (const m of source.matchAll(COLOR)) bad.push(m[0])
      for (const [, prop, value] of source.matchAll(LENGTH_PROP)) {
        if (LITERAL_LENGTH.test(value.replace(/var\([^)]*\)/g, ''))) bad.push(`${prop}: ${value}`)
      }
      return bad
    }

    it('signale une couleur hexadécimale', () => {
      expect(detect('a { color: #FF0000; }')).toHaveLength(1)
    })
    it('signale un rayon et un espacement littéraux', () => {
      expect(detect('a { border-radius: 12px; padding: 8px 16px; }')).toHaveLength(2)
    })
    it('accepte les variables, les multiplications par un token et zéro', () => {
      expect(detect('a { border-radius: var(--mc-radius-m); padding: 0; gap: calc(var(--mc-space-2) * 2); }')).toEqual(
        [],
      )
    })
    it("signale color-mix (absent d'iOS 15)", () => {
      expect(detect('a { box-shadow: 0 0 0 color-mix(in srgb, red 50%, blue); }')).toHaveLength(1)
    })
    it('ignore les commentaires', () => {
      expect(detect('/* couleur #FF0000 */ a { color: var(--mc-color-ciel); }')).toEqual([])
    })
  })
})
