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

Les maquettes 03, 04, 05, 06 et 08 ont encore été retouchées pour les nouveaux principes : cartes d'origine en mode Connaisseur : images découpées de la planche (`npm run planche`) pour Trio (03, 04), dessinées pour Love Letter (06, 07) ; le moteur de rendu sert les fichiers des jeux à `/__games/<id>/<fichier>`, dos de carte à la couleur du jeu en pile ou en éventail (05, 06) et pioche de la partie (08). Elles sont refaites à partir des mêmes pages par un script, et l'app doit les égaler.

Les maquettes de mise en place (Trio 05, Love Letter 08) montrent la table vue de haut, à la demande de l'utilisateur : quatre mains de dos (en face, à gauche, à droite, et la tienne en bas, légendée), à la même distance du centre, et au centre ce que le jeu y pose (Trio : des cartes alignées, 3 x 2). Les mains en éventail sont inclinées comme celles de « Tes cartes ». « Un tour » (Trio 06, Love Letter 09) montre exactement la même table, légendes comprises, avec quelques cartes retournées : un 4 au centre et un as au bord de la main d'en face (Trio) ; ta main de 2 cartes de face et une carte découverte à côté de la main du joueur d'en face et de celui de droite (Love Letter). Ses étapes sont resserrées ; la page de l'app peut défiler, la maquette est coupée à 844 px comme la capture. La maquette 09 reprend la règle de l'Espionne de l'app.

Pas de maquette pour : « Qui joue ? » (avec « Passer cette étape », la partie sans prénoms et la version « pour noter les scores »), À propos.

**Saisie des scores (`09-scores`)** : la maquette montre « Léa 1 », mais l'app part de zéro pour tous les jeux (« Valider » ajoute). Le test de fidélité fait donc le geste « un point de plus pour Léa » avant de comparer.

## Love Letter (`love-letter/`)

Extraites de la galerie `love-letter-maquettes.html` (15 écrans dans une seule page ; l'original n'est pas dans le dépôt : il est dans `build_ressources/`, ignoré par Git). Chaque écran est une page HTML autonome dans `love-letter/source/` ; le Login (écran 1) n'est pas repris (pas de compte en v1).

| Image | Écran de l'app |
|---|---|
| `02-accueil` | Accueil « Tes jeux » |
| `03-game-detail` | Le jeu |
| `04-regles-completes` | Règles complètes |
| `05-cartes-classique` / `06-cartes-connaisseur` | Tes cartes |
| `07-carte-swipe` | Vue à balayer (« Carte 3 / 10 ») |
| `08-mise-en-place` | Mise en place |
| `09-un-tour` | Un tour de jeu |
| `10-partie` | Partie en cours (« Manche 3 ») |
| `11-scores` | Fin de la manche (même geste « un point de plus pour Léa » que pour Trio) |
| `12-podium-termine` / `13-podium-interrompu` | Podium |
| `14-historique` | Tes scores |
| `15-reglages` | Réglages |

La galerie est une version antérieure aux maquettes de Trio. Les sources ont été retouchées pour suivre nos décisions, et rapprochées de la mise en page validée de Trio :

- navigation homogène (« ‹ Retour », « Quitter le tutoriel », « Suivant ») ;
- **21 cartes**, règle de l'édition 2019 (10 personnages dont 2 jokers pour les Espionnes, la dame de cœur pour la Princesse ; 2 à 6 joueurs) : « Garde ces 21 cartes, dont 2 jokers. Retire tout le reste du paquet. », « Mélange les 21 cartes. », 10 lignes dans « Tes cartes », 7 sections de règles qui défilent dans leur carte ;
- 05, 06 et 07 reconstruites d'après les maquettes de Trio (lignes de liste, vue à balayer), avec les données de Love Letter ;
- 08 : la ligne vide sous les cartes du schéma et le décalage de la carte visible (défauts de la galerie) sont corrigés ;
- **fond crème** sur tous les écrans du jeu (`background_color`), pastilles bordeaux, dos corail : 03 à 09, 11 à 13 ; **cartes d'origine dessinées** (mode Connaisseur) : 06 et 07 ; **dos de carte** : 08 (mise en place), 09 (un tour), 10 (pioche de la partie) ;
- **palette bordeaux** (tapis #812B2B, ombre #400E0E, texte crème #EEDDC8) et logo en sceau de cire : 02, 03 et 10 ; **sans la mise en place à 2 joueurs** : 04 et 08 ;
- 02, 03, 04, 05, 06, 07, 08 et 09 refaites pour cette règle (« 2–6 joueurs », règles de 2019, vue à balayer sur le Prêtre, texte « Gagner la manche ») ; 04 : les textes `[…]` sont remplacés par les textes rédigés ; 15 : blocs Compte et « Tutoriels passés » retirés (« Jouer » suit le même chemin pour tous les jeux, il n'y a rien à réactiver), note sur les langues et bouton « À propos » ajoutés ;
- toutes les pages reçoivent `*{box-sizing:border-box}`, la règle globale de la galerie qui se perdait à l'extraction.

## Mettre à jour

1. Remplace la page HTML concernée dans `<jeu>/source/`.
2. `npm run maquettes` (ou `npm run maquettes -- love-letter`) régénère les images.
3. `npx playwright test --project=visual e2e/maquettes.spec.ts` montre ce que l'app doit rattraper (images d'écart dans `test-results/maquettes/`).

La source de vérité des valeurs (couleurs, rayons, polices) reste `../charte/masterscards-charte.json`.
