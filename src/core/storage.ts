import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const PREFIX = 'masterscards:'
/** Préfixe d'avant le renommage en MastersCards : une valeur trouvée sous ce préfixe est déplacée sous le nouveau. */
const OLD_PREFIX = 'mastercards:'

/** Accès brut, sans préfixe. Natif : @capacitor/preferences (non purgé par l'OS). Web : localStorage. */
const raw = {
  async get(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) return (await Preferences.get({ key })).value
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },

  async set(key: string, value: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value })
      return
    }
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Stockage indisponible : la préférence ne sera pas mémorisée, l'app continue de fonctionner.
    }
  },

  async remove(key: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key })
      return
    }
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Voir ci-dessus.
    }
  },
}

/**
 * Stockage de préférences (mode choisi, dernier jeu, étape en cours), avec repli silencieux
 * si le navigateur bloque le stockage (mode privé, quota).
 */
export const storage = {
  async get(key: string): Promise<string | null> {
    const value = await raw.get(PREFIX + key)
    if (value !== null) return value
    const old = await raw.get(OLD_PREFIX + key)
    if (old === null) return null
    await raw.set(PREFIX + key, old)
    await raw.remove(OLD_PREFIX + key)
    return old
  },

  async set(key: string, value: string): Promise<void> {
    await raw.set(PREFIX + key, value)
  },

  async remove(key: string): Promise<void> {
    await raw.remove(PREFIX + key)
    await raw.remove(OLD_PREFIX + key)
  },
}
