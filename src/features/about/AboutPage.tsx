import { Panel } from '../../components/Panel/Panel.tsx'
import { Screen } from '../../components/Screen/Screen.tsx'
import { StepHeader } from '../../components/StepHeader/StepHeader.tsx'
import { PageTitle } from '../../components/PageTitle/PageTitle.tsx'
import { fr } from '../../i18n/fr.ts'
import styles from './AboutPage.module.css'

/** Mentions légales, crédits, licences des polices et version. */
export function AboutPage() {
  return (
    <Screen>
      <StepHeader backTo="/" />
      <PageTitle>{fr.about.title}</PageTitle>

      <Panel labelledBy="about-disclaimer" className={styles.panel}>
        <h2 id="about-disclaimer" className={styles.heading}>
          {fr.about.disclaimerTitle}
        </h2>
        <p>{fr.about.disclaimer}</p>
        <p>{fr.about.namesNote}</p>
      </Panel>

      <Panel labelledBy="about-fonts" className={styles.panel}>
        <h2 id="about-fonts" className={styles.heading}>
          {fr.about.fontsTitle}
        </h2>
        <p>{fr.about.fonts}</p>
      </Panel>

      <Panel labelledBy="about-privacy" className={styles.panel}>
        <h2 id="about-privacy" className={styles.heading}>
          {fr.about.privacyTitle}
        </h2>
        <p>{fr.about.privacy}</p>
      </Panel>

      <Panel labelledBy="about-version" className={styles.panel}>
        <h2 id="about-version" className={styles.heading}>
          {fr.about.versionTitle}
        </h2>
        <p>{__APP_VERSION__}</p>
      </Panel>
    </Screen>
  )
}
