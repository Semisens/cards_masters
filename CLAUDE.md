# MasterCards : consignes pour Claude Code

- Spécification complète : `docs/CAHIER_DES_CHARGES.md`. Lis-le en premier.
- Tokens de design : `charte/mastercards-charte.json`. Ne jamais écrire une couleur, un rayon, un espacement ou une taille de texte en dur : tout passe par les variables `--mc-*` générées (`npm run tokens`). Le test `scripts/no-hardcoded-values.test.ts` fait échouer le build sinon.
- Contexte produit : `docs/contexte/mastercards-contexte.md`.
- Maquettes : `maquettes/` (images exportées du canvas).
- Stack : **PWA** en Vite + React + TypeScript strict, empaquetée pour iOS et Android avec **Capacitor**. Base 390x844, portrait uniquement.
- Textes de l'app : tutoiement, phrases courtes, français.
- Ne jamais reproduire de logo, lettrage ou illustration officiels d'un jeu.
- Texte minimum 16 px, zones tactiles minimum 44 px, contraste >= 4.5.
- Travaille par jalons (section 12 du cahier des charges).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev (régénère les tokens). Page de visite : `/dev/design-system` (dev uniquement). |
| `npm run lint` | oxlint + Prettier (vérification). `npm run format` pour corriger. |
| `npm run typecheck` | `tsc -b` en mode strict. |
| `npm test` | Vitest : unitaires, composants, garde-fou « aucune valeur en dur ». |
| `npm run test:visual` | Playwright : PWA (hors ligne, manifeste) et captures du design system à 390x844. |
| `npm run build` | Build de production dans `dist/` (service worker inclus). |
| `npm run cap:sync` | Build puis copie dans les projets natifs `android/` et `ios/`. |
| `npm run tokens` / `npm run icons` | Régénèrent les tokens et les icônes depuis la charte. |

**Avant chaque commit** : `npm run lint && npm run typecheck && npm test`. Après un changement visuel voulu : `npm run test:visual -- --update-snapshots`, puis regarde les images avant de les valider.

## Règles du dépôt

- Fichiers `*.generated.*` : jamais édités à la main, régénérés par `npm run tokens`.
- `.npmrc` active `legacy-peer-deps` (conflit de peer optionnel entre `@vitejs/plugin-react` et Workbox). Ne pas le retirer sans vérifier que `npm install` passe.
- Les rangs de cartes et valeurs de jetons sont des éléments graphiques proportionnels à l'objet. Sous environ 3,9 rem de largeur de carte, le rang passe sous 16 px : ne pas descendre en dessous.
- `capacitor.config.ts` : l'identifiant `io.mastercards.app` est provisoire. Il ne peut plus changer une fois l'app publiée sur un store.
- iOS ne se compile que sur Mac (Xcode). Android demande le SDK Android (Android Studio). Sans eux, on vérifie seulement `npx cap sync`.
