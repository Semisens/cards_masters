// Rend les maquettes HTML de chaque jeu (maquettes/<jeu>/source/*.html) en images PNG 390 x 844 (x2) dans maquettes/<jeu>/.
// Ces images sont la référence du test de fidélité (e2e/maquettes.spec.ts).
// Les polices sont celles de l'app (paquets @fontsource, et police du nom fournie par chaque jeu dans son dossier),
// pas celles de Google Fonts : le rendu est identique à celui de l'app et ne dépend pas du réseau.
// Usage : npm run maquettes
import { createServer } from 'node:http'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { parse } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const gamesDir = join(root, 'maquettes')
// Un dossier de maquettes par jeu. `npm run maquettes -- love-letter` n'en rend qu'un.
const only = process.argv[2]
const games = readdirSync(gamesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(gamesDir, entry.name, 'source')))
  .map((entry) => entry.name)
  .filter((name) => !only || name === only)

const contentDir = join(root, 'src/content/games')

/** Polices servies aux maquettes : [famille, graisse, fichier]. */
const FONTS: Array<[family: string, weight: number, file: string]> = [
  ...([500, 600, 700] as const).map((w): [string, number, string] => ['Fredoka', w, fontsource('fredoka', w)]),
  ...([600, 700, 800] as const).map((w): [string, number, string] => ['Nunito', w, fontsource('nunito', w)]),
  // Police du nom de chaque jeu qui en fournit une.
  ...readdirSync(contentDir).flatMap((id): Array<[string, number, string]> => {
    const configFile = join(contentDir, id, 'game.yaml')
    if (!existsSync(configFile)) return []
    const { font } = parse(readFileSync(configFile, 'utf8')) as {
      font?: { file?: string; family: string; weight?: number }
    }
    return font?.file ? [[font.family, font.weight ?? 400, join(contentDir, id, font.file)]] : []
  }),
]

function fontsource(pkg: string, weight: number) {
  return join(root, 'node_modules/@fontsource', pkg, 'files', `${pkg}-latin-${weight}-normal.woff2`)
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  let file: string
  if (url.pathname.startsWith('/__fonts/')) {
    file = FONTS[Number(url.pathname.slice('/__fonts/'.length).replace('.woff2', ''))]?.[2] ?? ''
  } else {
    file = join(gamesDir, decodeURIComponent(url.pathname))
    if (!file.startsWith(gamesDir)) file = ''
  }
  if (!file || !existsSync(file)) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
})
await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
const port = (server.address() as { port: number }).port

const fontCss = FONTS.map(
  ([family, weight], index) =>
    `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;` +
    `src:url(http://127.0.0.1:${port}/__fonts/${index}.woff2) format('woff2')}`,
).join('\n')

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await context.route('https://fonts.googleapis.com/**', (route) =>
  route.fulfill({ contentType: 'text/css', body: fontCss }),
)
await context.route('https://fonts.gstatic.com/**', (route) => route.abort())

for (const game of games) {
  const sourceDir = join(gamesDir, game, 'source')
  const pages = readdirSync(sourceDir).filter((f) => f.endsWith('.html'))
  for (const file of pages) {
    const page = await context.newPage()
    await page.goto(`http://127.0.0.1:${port}/${game}/source/${file}`)
    // Le moteur de la maquette dessine l'écran après le chargement : on attend du texte visible, puis les polices.
    await page.waitForFunction(() => document.body.innerText.trim().length > 0)
    await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('700 16px Fredoka'),
        document.fonts.load('600 32px Fredoka'),
        document.fonts.load('700 16px Nunito'),
        document.fonts.load('800 16px Nunito'),
        document.fonts.load('400 64px "Great Vibes"'),
      ])
      await document.fonts.ready
    })
    const name = file.replace(/\.(dc\.)?html$/, '')
    await page.screenshot({ path: join(gamesDir, game, `${name}.png`), clip: { x: 0, y: 0, width: 390, height: 844 } })
    console.log(`maquette : ${game}/${name}.png`)
    await page.close()
  }
}

await browser.close()
server.close()
