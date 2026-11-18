import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSession } from './useSession.ts'

const KEY = 'mastercards:session:trio'
const PARTY = { players: [{ name: 'Léa', score: 2 }], round: 1 }

beforeEach(() => window.localStorage.clear())

describe('useSession', () => {
  it('commence en chargement puis dit qu’il n’y a pas de partie', async () => {
    const { result } = renderHook(() => useSession('trio'))
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.session).toBeNull()
  })

  it('retrouve la partie mémorisée', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(PARTY))
    const { result } = renderHook(() => useSession('trio'))
    await waitFor(() => expect(result.current.session).toEqual(PARTY))
  })

  it('mémorise une partie enregistrée', async () => {
    const { result } = renderHook(() => useSession('trio'))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    await act(async () => result.current.save(PARTY))
    expect(result.current.session).toEqual(PARTY)
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual(PARTY)
  })

  it('efface la partie quand elle se termine', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(PARTY))
    const { result } = renderHook(() => useSession('trio'))
    await waitFor(() => expect(result.current.session).not.toBeNull())
    await act(async () => result.current.end())
    expect(result.current.session).toBeNull()
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('ne plante pas devant une donnée abîmée : pas de partie', async () => {
    window.localStorage.setItem(KEY, '{abîmé')
    const { result } = renderHook(() => useSession('trio'))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.session).toBeNull()
  })

  it('garde les parties de deux jeux séparées', async () => {
    window.localStorage.setItem('mastercards:session:autre', JSON.stringify(PARTY))
    const { result } = renderHook(() => useSession('trio'))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.session).toBeNull()
  })
})
