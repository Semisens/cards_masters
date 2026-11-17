import styles from './HomePage.module.css'

/** Accueil provisoire (jalon 0). La vraie liste des jeux arrive au jalon 3. */
export function HomePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>MasterCards</h1>
      <p className={styles.lead}>Joue à tes jeux de société préférés avec un simple paquet de 52 cartes.</p>
      <p className={styles.soon}>Les jeux arrivent bientôt.</p>
    </main>
  )
}
