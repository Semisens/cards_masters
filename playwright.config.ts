import { defineConfig } from '@playwright/test'

const PREVIEW_PORT = 4173
const DEV_PORT = 5173

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    browserName: 'chromium',
    // Base du cahier des charges : 390 × 844.
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'fr-FR',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.005 },
  },
  projects: [
    // Build de production servi par `vite preview` : PWA, service worker, hors ligne.
    { name: 'pwa', testMatch: /pwa\.spec\.ts/, use: { baseURL: `http://localhost:${PREVIEW_PORT}` } },
    // Serveur de dev : la page de visite du design system n'existe pas en production.
    { name: 'visual', testMatch: /visual\.spec\.ts/, use: { baseURL: `http://localhost:${DEV_PORT}` } },
  ],
  webServer: [
    {
      command: `npm run build && npx vite preview --port ${PREVIEW_PORT} --strictPort`,
      url: `http://localhost:${PREVIEW_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `npx vite --port ${DEV_PORT} --strictPort`,
      url: `http://localhost:${DEV_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
