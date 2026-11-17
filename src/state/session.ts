/** Un joueur de la partie en cours et ses trios gagnés. */
export interface Player {
  name: string
  trios: number
}

export interface Session {
  players: Player[]
}

export const MAX_TRIOS = 99

/** Clé de stockage de la partie d'un jeu. */
export const sessionKey = (gameId: string) => `session:${gameId}`

/**
 * Relit une partie mémorisée. Renvoie `null` si le texte est absent ou n'a pas la bonne forme :
 * une donnée abîmée ne doit jamais empêcher l'app de démarrer.
 */
export function parseSession(raw: string | null): Session | null {
  if (!raw) return null
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null || !Array.isArray((data as { players?: unknown }).players))
      return null
    const players = (data as { players: unknown[] }).players
    if (players.length === 0) return null
    const valid: Player[] = []
    for (const item of players) {
      if (typeof item !== 'object' || item === null) return null
      const { name, trios } = item as { name?: unknown; trios?: unknown }
      if (typeof name !== 'string' || name.trim() === '') return null
      if (typeof trios !== 'number' || !Number.isInteger(trios) || trios < 0 || trios > MAX_TRIOS) return null
      valid.push({ name, trios })
    }
    return { players: valid }
  } catch {
    return null
  }
}

/** Nouvelle partie : tous les joueurs à zéro. Les noms vides reçoivent un nom par défaut. */
export function newSession(names: string[], defaultName: (n: number) => string): Session {
  return { players: names.map((name, i) => ({ name: name.trim() || defaultName(i + 1), trios: 0 })) }
}
