import type { CapacitorConfig } from '@capacitor/cli'
import { readFileSync } from 'node:fs'

const charte = JSON.parse(readFileSync(new URL('./charte/masterscards-charte.json', import.meta.url), 'utf8'))

const config: CapacitorConfig = {
  // À confirmer avant toute publication : l'identifiant ne peut plus changer une fois l'app sur les stores.
  appId: 'io.masterscards.app',
  appName: 'MastersCards',
  webDir: 'dist',
  backgroundColor: charte.colors.ciel,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: charte.colors.ciel,
    },
  },
}

export default config
