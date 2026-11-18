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

Pas de maquette pour : « Qui joue ? », À propos.

## Love Letter (`love-letter/`)

Extraites de la galerie `love-letter-maquettes.html` (15 écrans dans une seule page). Chaque écran est une page HTML autonome dans `love-letter/source/` ; le Login (écran 1) n'est pas repris (pas de compte en v1).

| Image | Écran de l'app |
|---|---|
| `02-accueil` | Accueil « Tes jeux » |
| `03-game-detail` | Le jeu |
| `04-regles-completes` | Règles complètes |
| `05-cartes-classique` / `06-cartes-connaisseur` | Tes cartes |
| `07-carte-swipe` | Vue à balayer (« Carte 2 / 8 ») |
| `08-mise-en-place` | Mise en place |
| `09-un-tour` | Un tour de jeu |
| `10-partie` | Partie en cours (« Manche 3 ») |
| `11-scores` | Fin de la manche |
| `12-podium-termine` / `13-podium-interrompu` | Podium |
| `14-historique` | Tes scores |
| `15-reglages` | Réglages |

La galerie est une version antérieure aux maquettes de Trio. Les sources ont été retouchées pour suivre nos décisions, et rapprochées de la mise en page validée de Trio :

- navigation homogène (« ‹ Retour », « Quitter le tutoriel », « Suivant ») ;
- **17 cartes** (6 Gardes : 4 valets et 2 rois noirs) : « Garde ces 17 cartes. Retire tout le reste du paquet. », « Mélange les 17 cartes. » ;
- 05, 06 et 07 reconstruites d'après les maquettes de Trio (lignes de liste, vue à balayer), avec les données de Love Letter ;
- 08 : la ligne vide sous les cartes du schéma et le décalage de la carte visible (défauts de la galerie) sont corrigés ;
- 04 : les textes `[…]` sont remplacés par les textes rédigés ; 15 : blocs Compte et « Tutoriels passés » retirés, note sur les langues et bouton « À propos » ajoutés ;
- toutes les pages reçoivent `*{box-sizing:border-box}`, la règle globale de la galerie qui se perdait à l'extraction.

## Mettre à jour

1. Remplace la page HTML concernée dans `<jeu>/source/`.
2. `npm run maquettes` (ou `npm run maquettes -- love-letter`) régénère les images.
3. `npx playwright test --project=visual e2e/maquettes.spec.ts` montre ce que l'app doit rattraper (images d'écart dans `test-results/maquettes/`).

La source de vérité des valeurs (couleurs, rayons, polices) reste `../charte/mastercards-charte.json`.
