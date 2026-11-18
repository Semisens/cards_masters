import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'
import { parse } from 'yaml'

// Les couleurs viennent de la charte, jamais écrites ici.
const charte = JSON.parse(readFileSync(new URL('./charte/mastercards-charte.json', import.meta.url), 'utf8'))
const ciel: string = charte.colors.ciel
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    {
      // Configurations des jeux (src/content/games/<id>/game.yaml) : lues au build, embarquées en JSON.
      name: 'mastercards-yaml',
      transform: (code, id) =>
        id.endsWith('.yaml') ? { code: `export default ${JSON.stringify(parse(code))}`, map: null } : undefined,
    },
    {
      name: 'mastercards-theme-color',
      transformIndexHtml: () => [{ tag: 'meta', attrs: { name: 'theme-color', content: ciel }, injectTo: 'head' }],
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'MasterCards',
        short_name: 'MasterCards',
        description: 'Joue à tes jeux de société préférés avec un simple paquet de 52 cartes.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: ciel,
        background_color: ciel,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    css: true,
  },
})
