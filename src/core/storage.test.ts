import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storage } from './storage.ts'

describe('storage (web)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('écrit, relit et supprime une valeur', async () => {
    expect(await storage.get('mode')).toBeNull()
    await storage.set('mode', 'expert')
    expect(await storage.get('mode')).toBe('expert')
    await storage.remove('mode')
    expect(await storage.get('mode')).toBeNull()
  })

  it("préfixe les clés pour ne pas entrer en collision avec d'autres données", async () => {
    await storage.set('mode', 'classic')
    expect(window.localStorage.getItem('mastercards:mode')).toBe('classic')
  })

  it('ne plante pas si le navigateur bloque le stockage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqué')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqué')
    })
    await expect(storage.set('mode', 'classic')).resolves.toBeUndefined()
    await expect(storage.get('mode')).resolves.toBeNull()
  })
})
