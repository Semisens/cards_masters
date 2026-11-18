import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

// Polices embarquées (sous-ensemble latin uniquement) : l'app doit rester fidèle hors ligne.
import '@fontsource/fredoka/latin-500.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/fredoka/latin-700.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'

import './styles/tokens.generated.css'
import './styles/global.css'

import { App } from './App.tsx'
import { initNative } from './core/native.ts'
import { registerGameFonts } from './core/fonts.ts'
import { games } from './data/games.ts'

registerSW({ immediate: true })
void initNative()
// Police du nom de chaque jeu qui en fournit une (fichier woff2 de son dossier).
registerGameFonts(games)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
