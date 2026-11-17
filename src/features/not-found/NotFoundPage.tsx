import { ButtonLink } from '../../components/Button/ButtonLink.tsx'
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { fr } from '../../i18n/fr.ts'

export interface NotFoundPageProps {
  message?: string
}

/** Page ou jeu introuvable : on dit ce qui s'est passé et on ramène à l'accueil. */
export function NotFoundPage({ message = fr.errors.pageNotFound }: NotFoundPageProps) {
  return (
    <Screen>
      <EmptyState
        title={fr.errors.notFoundTitle}
        text={message}
        action={<ButtonLink to="/">{fr.errors.backHome}</ButtonLink>}
      />
    </Screen>
  )
}
