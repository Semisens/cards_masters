// Rend les maquettes de Trio (maquettes/trio/source/*.dc.html) en images PNG 390 x 844 (x2) dans maquettes/trio/.
// Ces images sont la référence du test de fidélité (e2e/maquettes.spec.ts).
// Les polices sont servies depuis les paquets @fontsource de l'app, pas depuis Google Fonts : le rendu est
// identique à celui de l'app et ne dépend pas du réseau.
// Usage : npm run maquettes
import { createServer } from 'node:http'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'maquettes/trio/source')
const outDir = join(root, 'maquettes/trio')

const FONTS: Array<[family: string, pkg: string, weights: number[]]> = [
  ['Fredoka', 'fredoka', [500, 600, 700]],
  ['Nunito', 'nunito', [600, 700, 800]],
  ['Great Vibes', 'great-vibes', [400]],
]

const fontFile = (pkg: string, weight: number) =>
  join(root, 'node_modules/@fontsource', pkg, 'files', `${pkg}-latin-${weight}-normal.woff2`)

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  let file: string
  if (url.pathname.startsWith('/__fonts/')) {
    const [pkg, weight] = url.pathname.slice('/__fonts/'.length).replace('.woff2', '').split('-')
    file = fontFile(pkg === 'greatvibes' ? 'great-vibes' : pkg, Number(weight))
  } else {
    file = join(sourceDir, decodeURIComponent(url.pathname))
    if (!file.startsWith(sourceDir)) file = ''
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

const fontCss = FONTS.flatMap(([family, pkg, weights]) =>
  weights.map(
    (weight) =>
      `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;` +
      `src:url(http://127.0.0.1:${port}/__fonts/${pkg.replace('-', '')}-${weight}.woff2) format('woff2')}`,
  ),
).join('\n')

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await context.route('https://fonts.googleapis.com/**', (route) =>
  route.fulfill({ contentType: 'text/css', body: fontCss }),
)
await context.route('https://fonts.gstatic.com/**', (route) => route.abort())

const pages = readdirSync(sourceDir).filter((f) => f.endsWith('.dc.html'))
for (const file of pages) {
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${port}/${file}`)
  // Le moteur de la maquette dessine l'écran après le chargement : on attend du texte visible, puis les polices.
  await page.waitForFunction(() => document.body.innerText.trim().length > 0)
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('700 16px Fredoka'),
      document.fonts.load('600 32px Fredoka'),
      document.fonts.load('700 16px Nunito'),
      document.fonts.load('800 16px Nunito'),
    ])
    await document.fonts.ready
  })
  const name = file.replace('.dc.html', '')
  await page.screenshot({ path: join(outDir, `${name}.png`), clip: { x: 0, y: 0, width: 390, height: 844 } })
  console.log(`maquette : ${name}.png`)
  await page.close()
}

await browser.close()
server.close()
