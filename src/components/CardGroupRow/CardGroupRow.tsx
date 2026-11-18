import { Link } from 'react-router'
import type { CardGroup, ReadingMode } from '../../data/types.ts'
import { fr } from '../../i18n/fr.ts'
import { GhostCard } from '../GhostCard/GhostCard.tsx'
import { OriginalCards } from '../OriginalCard/OriginalCard.tsx'
import { PlayingCard } from '../PlayingCard/PlayingCard.tsx'
import styles from './CardGroupRow.module.css'

export interface CardGroupRowProps {
  group: CardGroup
  mode: ReadingMode
  /** Adresse de la vue à balayer de ce groupe. */
  to: string
}

/**
 * Une ligne de la vue liste : le groupe de cartes à garder.
 * Mode classique : la carte, son titre, « ×3 · Vaut 1. ».
 * Mode connaisseur : la carte d'origine (dessinée, ou en pointillés sans `expert.cards`), une flèche, puis la carte du paquet (« 2–6 → 2 à 6 »).
 */
export function CardGroupRow({ group, mode, to }: CardGroupRowProps) {
  const expert = mode === 'expert'
  const title = expert ? (group.expert.name ?? fr.cards.mapped(group.expert.original, group.label)) : group.label
  return (
    <Link to={to} className={styles.row}>
      {expert && (
        <>
          {group.expert.cards ? (
            <OriginalCards cards={group.expert.cards} />
          ) : (
            <GhostCard label={group.expert.original} />
          )}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </>
      )}
      {/* La carte est décorative : le titre et le sous-titre portent l'information. */}
      <span aria-hidden="true" className={styles.card}>
        <PlayingCard {...group.display} variant="list" />
      </span>
      <span className={styles.text}>
        <span className={styles.titleLine}>
          <b>{title}</b>
          {group.badge && <span className={styles.badge}>{group.badge}</span>}
        </span>
        <span className={styles.short}>{fr.cards.countAndShort(group.count, group.short)}</span>
      </span>
      <span aria-hidden="true">›</span>
    </Link>
  )
}
