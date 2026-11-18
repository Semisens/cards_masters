import { Link } from 'react-router'
import type { CardGroup, ReadingMode } from '../../data/types.ts'
import { handOf } from '../../data/hand.ts'
import { fr } from '../../i18n/fr.ts'
import { CardHand } from '../CardHand/CardHand.tsx'
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

/** La main du groupe (2 ou 3 cartes), ou la carte seule d'un groupe d'une seule carte. */
function HandOfGroup({ group }: { group: CardGroup }) {
  const cards = handOf(group)
  if (cards.length === 1) return <PlayingCard {...cards[0]} variant="list" />
  return (
    <CardHand>
      {cards.map((card, index) => (
        <PlayingCard key={index} {...card} variant="list" />
      ))}
    </CardHand>
  )
}

/**
 * Une ligne de la vue liste : le groupe de cartes à garder.
 * Mode classique : la main (2 ou 3 cartes), son titre, « ×3 · Vaut 1. ».
 * Mode connaisseur : la main d'origine (dessinée, ou une carte en pointillés sans `expert.cards`), une flèche, puis la main du paquet (« 2–6 → 2 à 6 »).
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
        <HandOfGroup group={group} />
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
