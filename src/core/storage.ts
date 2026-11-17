import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const PREFIX = 'mastercards:'

/**
 * Stockage de préférences (mode choisi, dernier jeu, étape en cours).
 * Natif : @capacitor/preferences (non purgé par l'OS). Web : localStorage, avec repli silencieux
 * si le navigateur le bloque (mode privé, quota).
 */
export const storage = {
  async get(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      return (await Preferences.get({ key: PREFIX + key })).value
    }
    try {
      return window.localStorage.getItem(PREFIX + key)
    } catch {
      return null
    }
  },

  async set(key: string, value: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: PREFIX + key, value })
      return
    }
    try {
      window.localStorage.setItem(PREFIX + key, value)
    } catch {
      // Stockage indisponible : la préférence ne sera pas mémorisée, l'app continue de fonctionner.
    }
  },

  async remove(key: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: PREFIX + key })
      return
    }
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      // Voir ci-dessus.
    }
  },
}
