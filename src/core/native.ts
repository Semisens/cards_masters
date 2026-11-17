import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

/** Réglages propres à la coque native (iOS / Android). Sans effet dans le navigateur. */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  // Fond bleu : icônes de la barre d'état claires.
  await StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
  await SplashScreen.hide().catch(() => {})
}
