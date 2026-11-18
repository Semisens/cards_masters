import type { CSSProperties, ReactNode } from 'react'
import { TabBar } from '../TabBar/TabBar.tsx'
import styles from './Screen.module.css'

export interface ScreenProps {
  children: ReactNode
  className?: string
  /** Couleur de fond unie (écran « Partie en cours ») au lieu du dégradé bleu. Toute couleur CSS. */
  solid?: string
  /** Sans marges : l'écran place lui-même ses blocs pleine largeur (bandeau du jeu). */
  bare?: boolean
  /** Hauteur de l'écran, pas plus : une zone interne défile (liste des cartes) au lieu de la page. */
  fixed?: boolean
  /** Blocs plus serrés (12 au lieu de 16), comme l'écran « Tes cartes » de la maquette. */
  tight?: boolean
  /** Barre d'onglets Jeux / Scores / Réglages en bas : écrans racines. La zone de contenu prend la hauteur restante. */
  tabs?: boolean
}

/**
 * Un écran de l'app, au format des maquettes : fond bleu en dégradé, marges 48 / 24 / 24 (le haut tient compte
 * de la zone sûre), blocs espacés de 16. Sur grand écran, le contenu reste une colonne centrée.
 */
export function Screen({
  children,
  className,
  solid,
  bare = false,
  fixed = false,
  tight = false,
  tabs = false,
}: ScreenProps) {
  const style = solid ? ({ '--screen-solid': solid } as CSSProperties) : undefined
  return (
    <div
      className={[styles.root, solid ? styles.solid : '', tabs ? styles.withTabs : ''].filter(Boolean).join(' ')}
      style={style}
    >
      <main
        className={[
          styles.content,
          bare ? styles.bare : '',
          fixed ? styles.fixed : '',
          tight ? styles.tight : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </main>
      {tabs && <TabBar />}
    </div>
  )
}
