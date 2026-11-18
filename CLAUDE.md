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
| `npm run dev:phone` | Démarre le serveur de dev (s'il ne tourne pas) et ouvre la fenêtre au format téléphone, en une commande. `npm run phone` seul ouvre la fenêtre quand le serveur tourne déjà. |
| `npm run lint` | oxlint + Prettier (vérification). `npm run format` pour corriger. |
| `npm run typecheck` | `tsc -b` en mode strict. |
| `npm test` | Vitest : unitaires, composants, garde-fou « aucune valeur en dur ». |
| `npm run test:visual` | Playwright : PWA (hors ligne, manifeste), parcours de l’app sur le build de production, captures des écrans à 390x844. |
| `npm run build` | Build de production dans `dist/` (service worker inclus). |
| `npm run cap:sync` | Build puis copie dans les projets natifs `android/` et `ios/`. |
| `npm run tokens` / `npm run icons` | Régénèrent les tokens et les icônes depuis la charte. |
| `npm run maquettes` | Rend les maquettes HTML en images de référence (`maquettes/trio/*.png`). |

**Avant chaque commit** : `npm run lint && npm run typecheck && npm test`. Après un changement visuel voulu : `npm run test:visual -- --update-snapshots`, puis regarde les images avant de les valider.

## Parcours de l'app

**Navigation identique partout** (cahier §7.9 bis) : « ‹ Retour » en haut à gauche, « Quitter le tutoriel » en haut à droite (tutoriel), le bouton principal (« Suivant ») toujours en bas. `StepHeader` ne prend que des adresses, pas de libellé.

Accueil « Tes jeux » (recherche, filtres, onglets Jeux / Scores / Réglages) → le jeu (« Jouer » ou « Règles complètes ») → tutoriel : **Tes cartes** (liste, bandeau « Retire… » en bas ; **le mode Classique / Connaisseur se choisit ici**, jamais à l'accueil) → vue à balayer d'un groupe → mise en place → un tour → Qui joue ? → partie en cours ⇄ saisie des scores → podium → historique (`/scores`). Réglages : `/reglages` (tutoriels à réactiver, À propos). Une fois le tutoriel passé, « Jouer » va droit à « Qui joue ? ». Adresses dans `src/routes.ts`.

**Les écrans sont ceux des maquettes** : `maquettes/<jeu>/*.png` (rendues par `npm run maquettes` depuis `maquettes/<jeu>/source/*.html`). Trio : 9 écrans. Love Letter : 14 écrans extraits de la galerie. Quand une maquette de Love Letter diverge de Trio sur une mise en page commune, celle de Trio prime. Le test `e2e/maquettes.spec.ts` compare **chaque écran à sa maquette, pixel par pixel**, et échoue au-delà de son seuil (images d'écart dans `test-results/maquettes/`). Avant de changer un écran, regarde sa maquette ; après, lance `npx playwright test --project=visual e2e/maquettes.spec.ts` et regarde les images d'écart. Les écarts voulus sont listés dans le test et dans le cahier des charges (7.10). Une nouvelle maquette : dépose la page HTML dans `maquettes/<jeu>/source/` (ajoute `*{box-sizing:border-box}` si elle vient d'une galerie), ajoute l'écran à `e2e/maquettes.spec.ts`, relance `npm run maquettes -- <jeu>`.

**Chaque écran doit tenir sans défilement vertical** (test `aucun défilement vertical` dans `e2e/visual.spec.ts`, 390 x 844 et 393 x 852). Compacte avant d'ajouter du défilement.

## Ajouter un jeu

1. Crée le dossier `src/content/games/<id>/` avec un `game.json` (modèle : `src/content/game.schema.json`, exemples : `trio/game.json` (sans manche), `love-letter/game.json` (manches, cartes en liste exacte). Ajoute un logo `svg` ou `png` seulement s'il est original ou redessiné.
2. Les cartes sont regroupées en `card_groups` (une ligne de la liste = une page de la vue à balayer), avec `expert.original` (et `expert.name` si le jeu d'origine nomme ses cartes) pour le mode connaisseur. `ranks` + `suits` pour un rectangle de cartes, `cards` (liste exacte) quand les couleurs diffèrent selon le rang. Ajoute `scoring` (les mots du jeu, manches, `target` pour une fin automatique), `tutorial` (dont `setup.diagram`) et `full_rules`. Le bandeau « Retire… Garde… » est calculé, il ne s'écrit pas. Lance `npm test`. Les tests valident le schéma, les cartes, le contraste, les mots que le jeu interdit (`classic_forbidden_terms`, facultatif), le tutoiement et la longueur des phrases. Le jeu apparaît ensuite tout seul sur l'accueil.
3. Aucune ligne de code à modifier. Seule exception : une nouvelle police de nom de jeu (paquet `@fontsource`, import dans `main.tsx`, ligne dans `src/core/fonts.ts`).
4. Les textes de l'interface sont dans `src/i18n/fr.ts`, ceux des jeux dans leur `game.json`.

## Règles du dépôt

- Fichiers `*.generated.*` : jamais édités à la main, régénérés par `npm run tokens`.
- `.npmrc` active `legacy-peer-deps` (conflit de peer optionnel entre `@vitejs/plugin-react` et Workbox). Ne pas le retirer sans vérifier que `npm install` passe.
- Les rangs de cartes et valeurs de jetons sont des éléments graphiques proportionnels à l'objet. Sous environ 3,9 rem de largeur de carte, le rang passe sous 16 px : pour les cartes d’illustration, utiliser `READABLE_CARD_WIDTH` (`components/PlayingCard/sizes.ts`).
- `capacitor.config.ts` : l'identifiant `io.mastercards.app` est provisoire. Il ne peut plus changer une fois l'app publiée sur un store.
- iOS ne se compile que sur Mac (Xcode). Android demande le SDK Android (Android Studio). Sans eux, on vérifie seulement `npx cap sync`.
