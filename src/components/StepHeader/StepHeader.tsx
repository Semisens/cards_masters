import { Link } from 'react-router'
import { fr } from '../../i18n/fr.ts'
import { PillLink } from '../PillLink/PillLink.tsx'
import styles from './StepHeader.module.css'

export interface StepHeaderProps {
  /** Adresse du retour. */
  backTo: string
  /** Adresse de la pastille « Quitter le tutoriel ». Absente : pas de pastille. */
  quitTo?: string
}

/**
 * Navigation du haut de page, la même partout : « ‹ Retour » à gauche, pastille « Quitter le tutoriel » à droite
 * (dans le tutoriel). Le libellé est fixe : on ne le personnalise pas d'un écran à l'autre. « Suivant » est toujours
 * le bouton du bas.
 */
export function StepHeader({ backTo, quitTo }: StepHeaderProps) {
  return (
    <div className={styles.header}>
      <Link to={backTo} className={styles.back}>
        <span aria-hidden="true">‹ </span>
        {fr.nav.back}
      </Link>
      {quitTo && <PillLink to={quitTo}>{fr.nav.quitTutorial}</PillLink>}
    </div>
  )
}
