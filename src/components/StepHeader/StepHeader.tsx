import { Link } from 'react-router'
import { fr } from '../../i18n/fr.ts'
import { PillButton } from '../PillButton/PillButton.tsx'
import { PillLink } from '../PillLink/PillLink.tsx'
import styles from './StepHeader.module.css'

export interface StepHeaderProps {
  /** Adresse du retour. */
  backTo: string
  /** Adresse de la pastille « Quitter le tutoriel ». Absente : pas de pastille. */
  quitTo?: string
  /**
   * Action de la pastille « Passer cette étape », au même endroit que « Quitter le tutoriel ». Absente : pas de
   * pastille. On ne donne pas `quitTo` et `onSkip` ensemble : il n'y a qu'une pastille, à droite.
   */
  onSkip?: () => void
}

/**
 * Navigation du haut de page, la même partout : « ‹ Retour » à gauche, une pastille à droite : « Quitter le tutoriel »
 * (dans le tutoriel) ou « Passer cette étape » (« Qui joue ? »). Les libellés sont fixes : on ne le personnalise pas d'un écran à l'autre. « Suivant » est toujours
 * le bouton du bas.
 */
export function StepHeader({ backTo, quitTo, onSkip }: StepHeaderProps) {
  return (
    <div className={styles.header}>
      <Link to={backTo} className={styles.back}>
        <span aria-hidden="true">‹ </span>
        {fr.nav.back}
      </Link>
      {quitTo && <PillLink to={quitTo}>{fr.nav.quitTutorial}</PillLink>}
      {onSkip && <PillButton onClick={onSkip}>{fr.nav.skip}</PillButton>}
    </div>
  )
}
