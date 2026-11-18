import { useLayoutEffect, useMemo } from 'react'
import { Outlet, useParams } from 'react-router'
import { getGame } from '../../data/games.ts'
import { resolveGameTheme } from '../../data/theme.ts'
import { scopeVariables } from '../../data/themeStyle.ts'

/**
 * Cadre de toutes les pages d'un jeu (`/jeu/:gameId/…`) : tant qu'on y est, la page prend les couleurs du jeu
 * (fond des écrans, pastilles à sa couleur, dos des cartes), posées en variables CSS sur `<html>` pour que le fond du
 * `<body>` suive aussi. On les retire en sortant : l'accueil, l'historique et les réglages gardent le bleu de l'app.
 */
export function GameScope() {
  const { gameId } = useParams()
  const game = getGame(gameId)
  const variables = useMemo(() => (game ? scopeVariables(resolveGameTheme(game)) : {}), [game])

  useLayoutEffect(() => {
    const root = document.documentElement
    const names = Object.keys(variables)
    for (const name of names) root.style.setProperty(name, variables[name])
    return () => {
      for (const name of names) root.style.removeProperty(name)
    }
  }, [variables])

  return <Outlet />
}
