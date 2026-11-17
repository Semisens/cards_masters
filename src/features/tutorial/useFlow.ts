import { useParams, useSearchParams } from 'react-router'
import { FROM_PARTY } from '../../routes.ts'

/** Vrai quand l'écran a été ouvert depuis « Partie en cours » (`?depuis=partie`). */
export function useFromParty(): boolean {
  const [params] = useSearchParams()
  return params.get(FROM_PARTY.param) === FROM_PARTY.value
}

/** Identifiant du jeu dans l'adresse. */
export function useGameId(): string | undefined {
  return useParams().gameId
}
