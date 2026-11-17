# Maquettes

## Trio (`trio/`)

Les 9 écrans de Trio, tels que le designer les a livrés.

- `trio/source/*.dc.html` : les maquettes HTML (un fichier par écran) et `support.js`, `vendor/` : le moteur qui les affiche. Ce ne sont pas du code de production : les valeurs (couleurs, tailles, espacements) sont celles que l'app doit reproduire.
- `trio/*.png` : chaque maquette rendue en 390 x 844 (x2), avec les polices de l'app. **Référence du test de fidélité** `e2e/maquettes.spec.ts`.

| Image | Écran de l'app |
|---|---|
| `01-game-detail` | Le jeu |
| `02-cartes-classique` | Tes cartes, mode classique |
| `03-cartes-connaisseur` | Tes cartes, mode connaisseur |
| `04-carte-swipe` | Vue à balayer d'un groupe de cartes |
| `05-mise-en-place` | Mise en place |
| `06-un-tour` | Un tour de jeu |
| `07-regles-completes` | Règles complètes |
| `08-partie` | Partie en cours |
| `09-scores` | Trios gagnés |

Les maquettes 01, 02, 03, 04, 07 et 08 ont été retouchées à la demande de l'utilisateur : navigation homogène (« ‹ Retour » en haut à gauche, « Quitter le tutoriel » en haut à droite, « Suivant » en bas), et sur « Tes cartes » le bandeau « Retire… » en bas et la légende du mode connaisseur retirée.

Pas de maquette pour : l'accueil, « Qui joue ? », À propos.

## Mettre à jour

1. Remplace le `.dc.html` concerné dans `trio/source/`.
2. `npm run maquettes` régénère les images.
3. `npx playwright test --project=visual e2e/maquettes.spec.ts` montre ce que l'app doit rattraper (images d'écart dans `test-results/maquettes/`).

La source de vérité des valeurs (couleurs, rayons, polices) reste `../charte/mastercards-charte.json`.
