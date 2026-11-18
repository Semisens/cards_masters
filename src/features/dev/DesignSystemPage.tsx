import { Button } from '../../components/Button/Button.tsx'
import { CardHand } from '../../components/CardHand/CardHand.tsx'
import { PlayingCard } from '../../components/PlayingCard/PlayingCard.tsx'
import { PokerChip } from '../../components/PokerChip/PokerChip.tsx'
import type { TapisName } from '../../core/tokens.generated.ts'
import styles from './DesignSystemPage.module.css'

const TAPIS: TapisName[] = ['jaune', 'vert', 'rouge', 'bleu']
const CHIP_VALUES = [1, 5, 10, 25]
// Quatre cartes tiennent sur une ligne à 390 px. En dessous d'environ 3,9 rem, le rang passe sous 16 px.
const CARD_WIDTH = '4.5rem'

/** Page de visite interne (dev uniquement) : tous les composants du design system, utilisée aussi pour les tests visuels. */
export function DesignSystemPage() {
  return (
    <main className={styles.page} data-testid="design-system">
      <h1>Design system</h1>

      <section className={styles.section} aria-labelledby="ds-buttons">
        <h2 id="ds-buttons">Boutons</h2>
        <div className={styles.column}>
          <Button variant="soleil">Jouer</Button>
          <Button variant="cerise">Retirer</Button>
          <Button variant="ciel">Précédent</Button>
          <Button variant="blanc">Règles complètes</Button>
          <Button variant="soleil" disabled>
            Désactivé
          </Button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ds-cards">
        <h2 id="ds-cards">Cartes</h2>
        <div className={styles.row}>
          <PlayingCard rank="A" suit="spades" width={CARD_WIDTH} />
          <PlayingCard rank="10" suit="hearts" width={CARD_WIDTH} />
          <PlayingCard rank="K" suit="diamonds" width={CARD_WIDTH} />
          <PlayingCard rank="Q" suit="clubs" width={CARD_WIDTH} />
        </div>
        <div className={styles.row}>
          {TAPIS.map((color) => (
            <PlayingCard key={color} faceDown back={color} width={CARD_WIDTH} />
          ))}
        </div>
        {/* La main : 2 ou 3 cartes en éventail (groupes de plusieurs rangs : « 8 à 10 », « Valets et rois noirs »). */}
        <div className={`${styles.row} ${styles.hands}`}>
          <CardHand size="focus" width={CARD_WIDTH}>
            <PlayingCard rank="8" suit="hearts" />
            <PlayingCard rank="9" suit="hearts" />
            <PlayingCard rank="10" suit="hearts" />
          </CardHand>
          <CardHand size="focus" width={CARD_WIDTH}>
            <PlayingCard rank="J" suit="spades" />
            <PlayingCard rank="K" suit="clubs" />
          </CardHand>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ds-chips">
        <h2 id="ds-chips">Jetons</h2>
        <div className={styles.row}>
          {TAPIS.map((color, i) => (
            <PokerChip key={color} color={color} value={CHIP_VALUES[i]} />
          ))}
        </div>
      </section>
    </main>
  )
}
