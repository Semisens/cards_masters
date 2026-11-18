# MasterCards : consignes pour Claude Code

- Spécification complète : `docs/CAHIER_DES_CHARGES.md`. Lis-le en premier.
- Tokens de design : `charte/mastercards-charte.json`. Ne jamais écrire une couleur, un rayon, un espacement ou une taille de texte en dur : tout passe par les variables `--mc-*` générées (`npm run tokens`). Le test `scripts/no-hardcoded-values.test.ts` fait échouer le build sinon.
- Contexte produit : `docs/contexte/mastercards-contexte.md`.
- Maquettes : `maquettes/<jeu>/*.png`, rendues par `npm run maquettes` depuis `maquettes/<jeu>/source/*.html` (voir `maquettes/LISEZ-MOI.md`).
- Stack : **PWA** en Vite + React + TypeScript strict, empaquetée pour iOS et Android avec **Capacitor**. Base 390x844, portrait uniquement.
- Textes de l'app : tutoiement, phrases courtes, français.
- Ne jamais reproduire de logo, lettrage ou illustration officiels d'un jeu.
- Texte minimum 16 px, zones tactiles minimum 44 px, contraste >= 4.5.
- Travaille par jalons (section 12 du cahier des charges).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev (régénère les tokens). Page de visite : `/dev/design-system` (dev uniquement). |
| `npm run dev:phone` | Démarre le serveur de dev (s'il ne tourne pas) et ouvre la fenêtre au format téléphone, en une commande. `npm run phone` seul ouvre la fenêtre quand le serveur tourne déjà. |
| `npm run lint` | oxlint + Prettier (vérification). `npm run format` pour corriger. |
| `npm run typecheck` | `tsc -b` en mode strict. |
| `npm test` | Vitest : unitaires, composants, garde-fou « aucune valeur en dur ». |
| `npm run test:visual` | Playwright : PWA (hors ligne, manifeste), parcours de l’app sur le build de production (dont `e2e/jeux.spec.ts` : le même parcours pour chaque jeu), captures des écrans à 390x844. |
| `npm run build` | Build de production dans `dist/` (service worker inclus). |
| `npm run cap:sync` | Build puis copie dans les projets natifs `android/` et `ios/`. |
| `npm run tokens` / `npm run icons` | Régénèrent les tokens et les icônes depuis la charte. |
| `npm run maquettes` | Rend les maquettes HTML en images de référence (`maquettes/trio/*.png`). |

**Avant chaque commit** : `npm run lint && npm run typecheck && npm test`. Après un changement visuel voulu : `npm run test:visual -- --update-snapshots`, puis regarde les images avant de les valider.

## Parcours de l'app

**Navigation identique partout** (cahier §7.9 bis) : « ‹ Retour » en haut à gauche, « Quitter le tutoriel » en haut à droite (tutoriel) ou « Passer cette étape » (« Qui joue ? »), le bouton principal (« Suivant ») toujours en bas. `StepHeader` ne prend que des adresses (ou `onSkip`), pas de libellé.

Accueil « Tes jeux » (recherche, filtres, onglets Jeux / Scores / Réglages) → le jeu (« Jouer » ou « Règles complètes ») → tutoriel : **Tes cartes** (liste, bandeau « Retire… » en bas ; **le mode Classique / Connaisseur se choisit ici**, jamais à l'accueil) → vue à balayer d'un groupe → mise en place → un tour → Qui joue ? → partie en cours ⇄ saisie des scores → podium → historique (`/scores`). Réglages : `/reglages` (langue, À propos). « Jouer » ouvre toujours « Tes cartes » : pas de raccourci qui dépende de l'historique. Adresses dans `src/routes.ts`.

**Les écrans sont ceux des maquettes** : `maquettes/<jeu>/*.png` (rendues par `npm run maquettes` depuis `maquettes/<jeu>/source/*.html`). Trio : 9 écrans. Love Letter : 14 écrans extraits de la galerie. Quand une maquette de Love Letter diverge de Trio sur une mise en page commune, celle de Trio prime. Le test `e2e/maquettes.spec.ts` compare **chaque écran à sa maquette, pixel par pixel**, et échoue au-delà de son seuil (images d'écart dans `test-results/maquettes/`). Avant de changer un écran, regarde sa maquette ; après, lance `npx playwright test --project=visual e2e/maquettes.spec.ts` et regarde les images d'écart. Les écarts voulus sont listés dans le test et dans le cahier des charges (7.10). Une nouvelle maquette : dépose la page HTML dans `maquettes/<jeu>/source/` (ajoute `*{box-sizing:border-box}` si elle vient d'une galerie), ajoute l'écran à `e2e/maquettes.spec.ts`, relance `npm run maquettes -- <jeu>`.

**Chaque écran doit tenir sans défilement vertical** (test `aucun défilement vertical` dans `e2e/visual.spec.ts`, 390 x 844 et 393 x 852). Compacte avant d'ajouter du défilement ; seules la liste de « Tes cartes » et la carte des règles complètes défilent dans leur cadre (la page, elle, ne bouge pas).

## Ajouter un jeu

Tous les jeux ont les mêmes écrans et le même fonctionnement. **Un jeu = une configuration, sans code.**

1. Copie `docs/modele-jeu.yaml` (modèle commenté) dans `src/content/games/<id>/game.yaml` et remplis-le : identité, couleur du tapis, joueurs, durée, cartes à garder (`card_groups[].cards`, `suits: all` pour les quatre couleurs ; `jokers: 2` pour des jokers, pris dans la boîte, comptés dans « Garde ces N cartes »), correspondances (`expert`), mots du score (`scoring`, `target` pour une fin automatique), tutoriel, règles complètes. Exemples : `trio/game.yaml`, `love-letter/game.yaml`.
2. Facultatif, dans le même dossier : un logo `svg` ou `png` (original ou redessiné) et la police du nom (`woff2` sous licence libre, avec sa licence), déclarée par `font: { file, family, weight, band_size }`.
3. Lance `npm test`, puis `npx playwright test e2e/jeux.spec.ts e2e/visual.spec.ts`. Ils valident le schéma, les cartes, le contraste, les mots interdits, le ton, le parcours complet jusqu'au podium et l'absence de défilement, **pour chaque dossier de jeu**, sans les nommer. Le jeu apparaît seul sur l'accueil.
4. Calculé, ne s'écrit pas : le nombre de cartes de chaque groupe, le bandeau « Retire… Garde… », `{cards}` dans les textes (nombre de cartes gardées).
5. Pièges YAML : un texte avec « : » ou « # », ou qui commence par un chiffre, se met entre apostrophes droites (`'7'`). Pas d'accolades `{ }` autour d'un texte qui contient une virgule.
6. Les textes de l'interface sont dans `src/i18n/fr.ts`, ceux des jeux dans leur `game.yaml`. Modifier le code n'est utile que pour une **nouvelle fonction** (nouveau champ du schéma, nouvel écran).

## Règles du dépôt

- Fichiers `*.generated.*` : jamais édités à la main, régénérés par `npm run tokens`.
- `.npmrc` active `legacy-peer-deps` (conflit de peer optionnel entre `@vitejs/plugin-react` et Workbox). Ne pas le retirer sans vérifier que `npm install` passe.
- Les rangs de cartes et valeurs de jetons sont des éléments graphiques proportionnels à l'objet. Sous environ 3,9 rem de largeur de carte, le rang passe sous 16 px : pour les cartes d’illustration, utiliser `READABLE_CARD_WIDTH` (`components/PlayingCard/sizes.ts`).
- `capacitor.config.ts` : l'identifiant `io.mastercards.app` est provisoire. Il ne peut plus changer une fois l'app publiée sur un store.
- iOS ne se compile que sur Mac (Xcode). Android demande le SDK Android (Android Studio). Sans eux, on vérifie seulement `npx cap sync`.
