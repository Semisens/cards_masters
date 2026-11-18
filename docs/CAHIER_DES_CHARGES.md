# Cahier des charges : MasterCards

Version 1.4 · Plateformes : PWA installable (web) + iOS et Android via Capacitor · Base écran : 390 × 844

> Version 1.1 : passage de Flutter à une PWA (Vite + React + TypeScript) empaquetée avec Capacitor. Version 1.2 : écrans de Trio alignés sur les maquettes (charte v6). Version 1.3 : second jeu Love Letter, podium, historique, réglages, accueil « Tes jeux » à onglets ; moteur généralisé. Version 1.4 : un seul fonctionnement pour tous les jeux ; un jeu = une configuration YAML, sans code.
> Raisons : contenu statique et hors ligne, aucune API native nécessaire, partage par lien, référencement web, pas de review de store pour la v1. Voir `docs/contexte/mastercards-contexte.md`.

---

## 1. Présentation

### 1.1 Concept
MasterCards est une application mobile qui explique comment jouer à des **jeux de société** (Love Letter, Trio, etc.) **avec un jeu de 52 cartes classique**.

L'app ne sert **pas** à apprendre des jeux de cartes classiques (belote, tarot…).

### 1.2 Problème résolu
Tu as envie de jouer à un jeu de société mais tu n'as pas la boîte. Tu as un paquet de cartes. MasterCards te dit quelles cartes garder et comment jouer.

### 1.3 Cible
Joueurs occasionnels et amateurs de jeux de société, en soirée, en voyage ou en vacances.

### 1.4 Deux modes de lecture
| Mode | Pour qui | Contenu |
|---|---|---|
| **Classique** | Tout le monde | Les cartes à garder expliquées avec **ton paquet** : « Vaut 1. », « Valent 2 à 6. ». |
| **Connaisseur** | Tu connais déjà le jeu | La même vue, avec la **correspondance** avec le jeu d'origine (« 2–6 → 2 à 6 », carte d'origine en pointillés) et son pouvoir d'origine. |

Le mode se choisit **après le choix du jeu**, avec la bascule de l'écran « Tes cartes ». Il ne change que les écrans de cartes (liste et vue à balayer) : la mise en place, le tour de jeu et les règles complètes sont les mêmes dans les deux modes.

---

## 2. Périmètre

### 2.1 Inclus (v1)
- Écran d'accueil avec la liste des jeux.
- Page du jeu : « Jouer » (le tutoriel puis la partie) et « Règles complètes ».
- Tutoriel : choix des cartes (liste et vue à balayer, deux modes), mise en place, un tour de jeu.
- **Partie en cours** : les joueurs, leurs scores, la saisie des scores, des raccourcis vers les règles. Mémorisée sur l'appareil.
- Thème visuel propre à chaque jeu.
- Fonctionnement 100 % hors ligne.
- **Installable** depuis le navigateur (manifeste + service worker).
- Projets natifs **Android et iOS** générés et maintenus avec Capacitor, dès le jalon 0. La **publication sur les stores** est décidée au jalon 6, pas avant.

### 2.2 Hors périmètre (v1)
- Compte utilisateur, connexion, cloud. (L'écran « Login » et le bloc « Compte » de la galerie Love Letter ne sont pas faits.)
- Partie en ligne ou multijoueur sur plusieurs appareils.
- Gestion fine des tours : l'app **compte les points** (trios, jetons) et les manches, elle ne **joue** pas à la place des joueurs. Seule exception : un jeu qui déclare un score à atteindre (`scoring.target`) termine la partie quand un joueur l'atteint.
- Langues autres que le français : les réglages montrent English et Español, grisés.
- Règles de jeux de cartes classiques.
- Création de jeux par l'utilisateur (à envisager en v2).
- Achats intégrés et publicité (à trancher avec le modèle économique, question 5).

---

## 3. Ton et contenu éditorial

- **Tutoiement** partout.
- **Phrases courtes.**
- Français (v1). Prévoir l'internationalisation dès le départ (fichiers de traduction JSON par langue, clés stables).
- Le mode classique privilégie les mots simples. Un jeu peut **interdire** certains termes d'origine (champ `classic_forbidden_terms`, vérifié par test) ; pour Trio il n'y en a aucun : le nom du jeu est lui-même le vocabulaire (« trio »), et les maquettes l'emploient partout.
- Mode connaisseur : termes d'origine autorisés, utilisés dans la correspondance.

Exemple de ton : « Garde les as, les 2 et les 3. Mélange. Distribue une carte à chacun. »

---

## 4. Direction artistique

### 4.1 Ambiance
Jeu de société : **fond bleu**, formes **épaisses et arrondies**, **boutons en relief** (référence : Ludo).

### 4.2 Cartes (façon Gambit)
- Fond blanc, ratio 1,4, rayon 12.
- **Rang seul** en haut à gauche (Fredoka 700).
- **Un seul grand symbole centré** (62 % de la largeur).
- **Pas de petit symbole.**
- Rouge (`#D93A34`) et noir/encre (`#14213D`) uniquement.

### 4.3 Jetons de poker
Jaune, vert, rouge, bleu. Bord conique rayé blanc/couleur, bordure intérieure 3 px blanc 60 %, chiffres en Fredoka 700.

### 4.4 Tapis
Un tapis (couleur) par jeu : jaune, vert, rouge, bleu.

### 4.5 Tokens (source : `charte/mastercards-charte.json`)

**Couleurs**
| Token | Valeur | Usage |
|---|---|---|
| ciel | `#1E5BD6` (dégradé `#2A70E8` → `#1648B8`) | Fond principal |
| nuit | `#0E2F86` | Fond foncé, icônes |
| soleil | `#FFC928` (ombre `#B98300`) | Boutons principaux, jeton jaune |
| cerise | `#D93A34` | Rouge des cartes, alertes |
| prairie | `#2DB24E` | Succès, jeton vert |
| azur | `#36A0F5` | Accent clair |
| blanc_carte | `#FFFFFF` | Faces de cartes |
| encre | `#14213D` | Texte principal, noir des cartes |
| texte_secondaire | `#4A5675` | Texte secondaire |
| bordure | `#C9D6F2` | Bordures |

**Tapis** : jaune `#FFC928`, vert `#187A33`, rouge `#B8312C`, bleu `#2273C9`.

**Texte sur fond** : blanc sur ciel, nuit, cerise, tapis vert/rouge/bleu. Encre sur soleil, prairie, azur, tapis jaune.

**Typographie** : titres **Fredoka** 500/600/700 · textes **Nunito** 600/700/800 · **16 px minimum**.

**Rayons** : s 12 · m 20 · l 28. **Élévation (boutons en relief)** : s 4 · m 6 · l 8 px. **Espacements** : 8, 16, 24, 32, 48. **Zone tactile min.** : 44 px.

**Icônes** : trait 2,5, extrémités arrondies, couleur `#0E2F86`.

### 4.6 Implémentation
- `scripts/gen-tokens.ts` lit `charte/mastercards-charte.json` et génère `src/styles/tokens.generated.css` (variables CSS `--mc-*`) et `src/core/tokens.generated.ts` (mêmes valeurs côté TypeScript). La charte reste **la seule source** : on modifie le JSON, jamais les fichiers générés.
- **Aucune valeur de couleur, rayon, espacement ou taille de texte en dur** dans le CSS ni le TSX. Un test automatisé (`scripts/no-hardcoded-values.test.ts`) fait échouer la CI sinon.
- Les espacements et la taille de texte minimale sont exprimés en `rem`, pour suivre la taille de texte choisie par l'utilisateur.
- Polices **embarquées** : Fredoka et Nunito via `@fontsource`, la police du nom de chaque jeu dans son dossier (ex. Great Vibes, `love-letter/great-vibes.woff2`, avec sa licence OFL) ; sous-ensemble latin uniquement, précachées par le service worker. Aucune requête vers Google Fonts : l'app reste fidèle hors ligne.
- Les ombres des boutons et des jetons sont des teintes **dérivées de la charte**, calculées par le générateur (`--mc-color-cerise-ombre`, `--mc-tapis-*-ombre`). On n'utilise pas `color-mix()` en CSS : il n'existe pas avant iOS 16.2 et l'app vise iOS 15.

---

## 5. Personnalisation par jeu

Chaque jeu possède son propre thème et son propre contenu (détail et règles de validation en 9.2) :

| Champ | Description |
|---|---|
| `name` | Nom du jeu |
| `font` | Police du nom (licence libre, fichier woff2 dans le dossier du jeu). Défaut : Fredoka 700. Ex. Love Letter : Great Vibes |
| pioche | Dos de cartes à la couleur du jeu (automatique) |
| `logo` | Optionnel. Image **originale ou redessinée**. Sinon : initiale dans un rond blanc |
| `background_color` | jaune, vert, rouge, bleu ou libre. Texte blanc ou encre choisi **automatiquement** (contraste ≥ 4,5) |
| `card_groups` | Les cartes du paquet à garder, regroupées (une ligne de la liste, une page de la vue à balayer), avec leur correspondance d'origine |
| `tutorial`, `full_rules` | Mise en place, un tour de jeu, règles complètes |

Règle de contraste automatique : calculer le ratio WCAG entre la couleur de fond libre et blanc / encre, choisir le meilleur, et refuser si aucun n'atteint 4,5. Implémentée dans `src/core/contrast.ts` (`pickTextColor`).

---

## 6. Contraintes légales (point bloquant)

- **Ne jamais reproduire** les logos, lettrages ou illustrations officiels.
- Évocation **originale** seulement. Ex. Love Letter : police calligraphique libre (Great Vibes) + sceau de cire **redessiné**.
- Les noms de jeux sont cités à titre descriptif. **Droits à vérifier avant publication** (marques, règles, stores).
- Vérifier la licence de chaque police et de chaque asset.
- Ajouter une mention dans l'app : « Application non officielle, sans lien avec les éditeurs des jeux cités. »
- **Stores** : un éditeur peut demander le retrait d'une app qui cite sa marque, et les stores l'exécutent sans délai. Sur le web, ce risque existe mais personne ne peut bloquer la publication à votre place. C'est une raison de lancer d'abord la PWA.
- **Apple** : l'App Store refuse les apps qui ne sont « qu'un site web dans une coque » (règle 4.2, fonctionnalité minimale). Une app Capacitor passe si elle apporte un vrai usage mobile : contenu embarqué, hors ligne, interface pensée pour le tactile, quelques fonctions natives (écran maintenu allumé pendant la lecture, partage). À traiter au jalon 6.

---

## 7. Écrans

Les écrans sont ceux des **maquettes** : `maquettes/trio/*.png` (sources HTML dans `maquettes/trio/source/`) et `maquettes/love-letter/*.png` (extraites de la galerie `love-letter-maquettes.html`). L'app est **comparée pixel à pixel** à chacune par `e2e/maquettes.spec.ts`. Quand la galerie de Love Letter et les maquettes de Trio (plus abouties) divergent sur une mise en page commune, **celle de Trio fait foi** (écarts en 7.10).

### 7.0 Parcours et principes
Accueil → le jeu → **Jouer** : Tes cartes (liste) → *[détail d'un groupe : vue à balayer]* → Mise en place → Un tour de jeu → Qui joue ? → Partie en cours ⇄ saisie des scores → **Podium** (partie terminée ou interrompue) → Historique.
Le jeu → **Règles complètes**. **Jouer** ouvre toujours « Tes cartes », pour tous les jeux et à chaque fois : le chemin ne dépend pas de l'historique du joueur.
Trois écrans racines ont la **barre d'onglets** Jeux / Scores / Réglages : l'accueil, l'historique, les réglages.

- **Le mode se choisit après le jeu**, avec la bascule de « Tes cartes ».
- **Chaque écran tient sans défilement vertical** : vérifié sur tous les écrans, à 390 × 844 et à 393 × 852, y compris une partie à 6 joueurs. Seule la liste des cartes défile **dans son cadre** si un jeu a beaucoup plus de groupes que Trio.
- Format des maquettes : 390 × 844, marges 48 / 24 / 24, blocs espacés de 16.

### 7.1 Accueil « Tes jeux » (maquette *Games* de Love Letter)
Titre, **recherche** (« Un jeu, un titre… », filtre sur le nom, sans casse ni accents), **filtres** en pastilles (Tous ; « 2–4 joueurs » : se joue à 4 au plus ; « Rapide » : 15 minutes ou moins), liste des jeux (carré aux couleurs du jeu avec son initiale, nom, « 2–4 joueurs · 20 min »), barre d'onglets. Mot de bienvenue au premier lancement. Aucun choix de mode ici. La liste défile dans son cadre, sans barre, s'il y a beaucoup de jeux.

### 7.2 Le jeu (maquette *GameDetail*)
Bandeau plein cadre aux couleurs du jeu (« ‹ Retour », nom en grand, « 3–6 joueurs · 15 min »), carte blanche (phrase d'accroche en gras + texte), boutons **Jouer** et **Règles complètes**.

### 7.3 Tes cartes : vue liste (maquettes *List classic* et *List expert*)
En-tête (voir « Navigation » ci-dessous). Titre, **bascule Classique / Connaisseur**, puis une ligne par **groupe de cartes** (6 pour Trio : A, 2 à 6, 7, 8 à 10, Valet, Dame) : mini-carte, titre, « ×15 · Valent 2 à 6. », pastille éventuelle (« Spécial »). En bas, le bandeau jaune **dérivé des données** (« Retire les carreaux et les rois. Garde 36 cartes. »). La liste défile au doigt dans son cadre, **sans barre de défilement** (app mobile) ; le bandeau et le bouton « Suivant » restent fixes en dessous.
- **Classique** : la liste.
- **Connaisseur** : la même liste, sans légende, carte d'origine en pointillés → carte du paquet, titre « 2–6 → 2 à 6 ».

### 7.4 Vue à balayer (maquette *Swipe*)
Un clic sur une ligne ouvre cette vue sur le groupe touché. « Groupe 3 / 6 », grande carte (200 × 280, cadre soleil), flèches ‹ ›, points de progression, carte d'explication (« ×3 · Le 7 est spécial. » + texte), bouton « Suivant ». On balaie, on touche les flèches ou le bouton, ou on utilise le clavier. Mode connaisseur : une ligne grise ajoute la carte d'origine et son pouvoir. Après le dernier groupe : « Terminer » ramène à la liste.

### 7.5 Mise en place et un tour de jeu (maquettes *Setup* et *TurnFlow*)
Mise en place : schéma (2 à 4 éléments, chacun un dos de carte ou une carte visible : « Ta main, triée / Au centre, cachées » pour Trio ; « Pioche / Écartée, cachée / Visibles (2 joueurs) » pour Love Letter) et les étapes numérotées. Un tour de jeu : 4 étapes, la façon de gagner (« Gagner » ou « Gagner la manche »), bouton « Jouer ».

### 7.6 Règles complètes (maquette *FullRules*)
Une carte blanche avec toutes les sections : But, Mise en place, Un tour, Trio, Cartes différentes, Mode piquant.

### 7.7 Partie en cours et saisie des scores (maquettes *Play* et *ScoreEntry*)
Écrans et fonctionnement **identiques pour tous les jeux** ; seuls les mots viennent de la configuration (`scoring`). Fond du tapis du jeu ; en haut à droite, `party_label` (« Trios gagnés », « Manche 3 ») ; jetons des joueurs (cercle à bord pointillé, score, nom) ; tuiles Règles / Mise en place / Cartes / Un tour (elles ouvrent ces écrans, avec retour à la partie) ; « Noter les scores » ; « Terminer la partie » (archive la partie comme **interrompue**, l'efface, ouvre le podium).
- Saisie : un compteur − / + par joueur, qui **part de zéro** (points gagnés depuis la saisie précédente) ; « Valider » (`validate`) les ajoute aux scores et passe à la manche suivante. Titre et question viennent du jeu (« Trios gagnés » / « Qui a gagné un trio ? » ; « Fin de la manche 3 » / « Qui a gagné des points ? »).
- Si un joueur atteint le score visé (`target` : 3 trios pour Trio ; 7, 5 ou 4 jetons à 2, 3 ou 4 joueurs pour Love Letter), la partie est **terminée** : podium. Trio : le trio de 7 (victoire immédiate) se note en ajoutant 3 au gagnant.
- *Ajout (absent des maquettes)* : **Qui joue ?**, le nombre de joueurs (dans les limites du jeu) et leurs prénoms. « C'est parti » en bas ; « Passer cette étape » en haut à droite démarre sans prénoms. **Partie sans prénoms** (pastille, ou « C'est parti » avec tous les champs vides) : la partie en cours n'affiche **pas les jetons** des joueurs ; « Noter les scores » ouvre « Qui joue ? » (`?depuis=partie`, texte « Pour noter les scores, écris le prénom de chaque joueur. », champs vides, nombre de joueurs gardé, « Retour » vers la partie, pas de « Passer cette étape ») puis, dès qu'un prénom est donné, la saisie des scores. La saisie des scores ne s'ouvre jamais sur une partie sans prénoms.

### 7.7 bis Podium, historique, réglages (maquettes *Results*, *History*, *Settings* de Love Letter)
- **Podium** : pastille « Partie terminée » (verte) ou « Partie interrompue » (jaune), les trois premiers sur des marches (2e à gauche, 1er au centre, 3e à droite), les suivants en liste (« 4e Sam 0 »), « Voir l'historique », « Retour aux jeux ». Les égalités partagent le même rang. La partie est lue dans l'historique.
- **Tes scores** : parties passées par jeu (date, deux meilleurs scores, « Terminée » / « Interrompue »). Un jeu est ouvert à la fois, le plus récemment joué au départ ; les autres montrent « 1 partie › ». Les 100 dernières parties sont gardées.
- **Réglages** : langue (Français ; English et Español grisés, avec « arrivent bientôt »), lien « À propos ». Ni compte ni déconnexion.

### 7.8 Mentions / À propos
Crédits, licences des polices, avertissement légal, version.

### 7.9 États à prévoir
Premier lancement, liste vide, jeu / groupe / page introuvable (avec retour), partie absente (on demande qui joue), donnée mémorisée abîmée (traitée comme « pas de partie »).

### 7.9 bis Navigation (la même dans toute l'app)

- **En haut à gauche** : « ‹ Retour », toujours ce libellé, jamais le nom d'un écran (composant `StepHeader`, ou le bandeau du jeu).
- **Écrans racines** (Jeux, Scores, Réglages) : la barre d'onglets du bas tient lieu de navigation ; pas de « Retour ».
- **En haut à droite** : une seule pastille, au même endroit. « Quitter le tutoriel » sur les écrans du tutoriel (Tes cartes, vue à balayer, Mise en place, Un tour), absente quand l'écran est ouvert depuis la partie. « Passer cette étape » sur « Qui joue ? » : elle démarre la partie tout de suite, avec les noms par défaut (« Joueur 1 »…) et le nombre de joueurs affiché ; les prénoms tapés sont ignorés.
- **En bas de page** : le bouton principal de l'étape, toujours à la même place : « Suivant » (Tes cartes, vue à balayer, Mise en place), « Jouer » à la dernière étape du tutoriel. Depuis la partie : « Retour à la partie ».
- Les libellés de l'en-tête ne sont pas personnalisables : `StepHeader` n'accepte que des adresses (`backTo`, `quitTo`) ou l'action de « Passer cette étape » (`onSkip`).

### 7.10 Écarts assumés avec les maquettes
| Écart | Raison |
|---|---|
| Navigation homogène (voir ci-dessous) ; sur « Tes cartes » : bandeau « Retire… » en bas, bouton « Suivant » en bas, pas de légende en connaisseur, liste sans barre de défilement | Demandé par l'utilisateur après la reprise des maquettes. Les sources `maquettes/trio/source/01`, `02`, `03`, `04`, `07` et `08` ont été modifiées de même (libellés de retour, pastille, bouton), pour que le test de fidélité reste la référence. |
| Écran « Qui joue ? » | Les maquettes montrent la partie (Léa, Tom, Inès) mais pas sa création. |
| **Love Letter** : 17 cartes (6 Gardes : 4 valets et 2 rois noirs), au lieu des 16 de la galerie | Un paquet de 52 n'a que 4 as : décision de l'utilisateur. Les as sont retirés avec le reste ; « Garde ces 17 cartes. Retire tout le reste du paquet. » |
| **Love Letter** : lignes de liste au format de Trio (« Valets et rois noirs » / « ×6 · Devine… ») ; vue à balayer, mise en place sans la ligne vide, sources reconstruites d'après Trio | La galerie est une version antérieure : la mise en page validée de Trio prime. En mode connaisseur la ligne dit le nom d'origine (« Garde »). |
| **Love Letter** : textes « Fin de manche » et « Cas particuliers » | La galerie contient des `[…]` : textes rédigés (jetons 7 / 5 / 4, égalités), à relire. Sept textes de détail de groupe aussi (seul celui du 2 est donné). |
| Réglages : pas de bloc Compte ni « Se déconnecter » ; pas de bloc « Tutoriels passés » ; note « English et Español arrivent bientôt » ; « À propos » à la place | Pas de compte en v1. « Jouer » suit le même chemin pour tous les jeux, à chaque fois : il n'y a donc rien à réactiver. Les sources de la maquette 15 sont retouchées de même. |
| Accueil : troisième vignette « [JEU 3] » non rendue | Gabarit de la maquette, masqué dans le test. |
| Podium : l'écran n'a pas de « ‹ Retour » | Fidèle à la maquette : on en sort par « Voir l'historique » ou « Retour aux jeux ». |
| « Terminer la partie » de **Trio** mène aussi au podium (partie interrompue) et à l'historique | Cohérence des jeux ; la maquette de Trio n'a pas ce cas. |
| Texte du « Mode piquant » | La maquette contient « [Deux trios liés. À détailler.] » : remplacé par un texte publiable. |
| « − » grisé quand un score est à 0 | On ne descend pas sous zéro ; la maquette montre le bouton actif. |
| Cœurs à la place des symboles provisoires | Les mini-cartes de la maquette sont toutes des cœurs ; l'app montre les vrais symboles, avec la même alternance rouge / noir. |
| Chiffre des jetons joueurs | Couleur choisie selon la charte (`text_on`, contraste ≥ 4,5) : encre sur jaune et bleu clair, là où la maquette met du blanc. |
| Zones tactiles de 44 px | Les liens « ‹ Retour » ont une zone tactile qui déborde du texte, sans changer la mise en page. |
| Rang à 14 px sur les mini-cartes | Valeur de la maquette (la charte dit 16 px minimum) ; la mini-carte est décorative, le texte de la ligne porte l'information. |

---

## 8. Composants UI réutilisables

Composants React dans `src/components/`, un dossier par composant (TSX + CSS Module + test).

- **Structure** : `Screen` (fond, marges des maquettes, zones sûres ; options `solid`, `bare`, `fixed`, `tight`), `StepHeader` (« ‹ Retour » + pastille), `PillLink`, `PageTitle`, `Panel` (carte blanche), `Notice` (bandeau jaune), `EmptyState`.
- **Boutons** : `Button` et `ButtonLink` (variantes soleil, cerise, ciel, **blanc** ; option `block` pleine largeur).
- **Cartes et jetons** : `PlayingCard` (variantes `standard`, `list`, `focus` ; lettres V / D / R), `GhostCard` (carte d'origine en pointillés), `PokerChip`, `PlayerChip`, `SuitIcon`, `CardRow`.
- **Choix des cartes** : `ModeToggle` (bascule Classique / Connaisseur), `CardGroupRow` (ligne de la liste).
- **Jeu** : `GameBand` (bandeau), `GameTile` (vignette d'accueil), `GameLogo`, `PileDiagram` (schéma de mise en place).
- **Partie** : `ResourceTile` (tuiles de raccourci), `ScoreStepper` (compteur − / +).

Hook `useSwipe` (`src/core/`) : balayage tactile et flèches du clavier. Les symboles ♠ ♥ ♦ ♣ sont dessinés en **vectoriel** (`PlayingCard/symbols.ts`), pas en texte.

---

## 9. Données et contenu

### 9.1 Principe
**Tous les jeux ont les mêmes écrans et le même fonctionnement.** Un jeu n'est qu'une **configuration** : un dossier `src/content/games/<id>/` avec un `game.yaml` et, si besoin, un logo (`svg` ou `png`) et la police de son nom (`woff2`, licence libre). Ajouter un jeu = ajouter ce dossier, **sans toucher au code**, sauf demande de nouvelle fonction. Modèle commenté à copier : `docs/modele-jeu.yaml`.

Les fichiers sont lus au build (`import.meta.glob`, plugin `mastercards-yaml` de `vite.config.ts`) : ils sont donc **embarqués** et précachés pour le hors ligne. `src/data/loadGame.ts` prépare chaque jeu (cartes exactes, nombre de cartes, `{cards}` dans les textes, police). C'est vérifié : le modèle, déposé tel quel comme troisième jeu, passe le schéma, le parcours complet jusqu'au podium (`e2e/jeux.spec.ts`) et le test « aucun défilement » (`e2e/visual.spec.ts`), qui parcourent **tous** les dossiers de jeux.

### 9.2 Modèle

Source de vérité : `src/content/game.schema.json` (VS Code complète les champs avec l'extension YAML ; types TypeScript dans `src/data/types.ts` : `GameConfig` pour le fichier, `Game` pour le jeu prêt à l'emploi).

```yaml
id: love-letter
name: Love Letter
font: { file: great-vibes.woff2, family: Great Vibes, weight: 400, band_size: 4 }
background_color: rouge
tagline: Une lettre. Une princesse. Un seul gagnant.
description: …
players: { min: 2, max: 4 }
duration_min: 20
group_word: Carte
classic_forbidden_terms: [Garde, Prêtre, Baron, Servante, Comtesse]
card_groups:
  - label: Valets et rois noirs
    cards:
      - ranks: [J]
        suits: all
      - ranks: [K]
        suits: [spades, clubs]
    display: { rank: J, suit: hearts }
    short: Devine la carte d’un rival.
    detail:
      title: …
      text: …
    expert:
      original: '1'
      name: Garde
      power: deviner la carte d’un joueur pour l’éliminer
scoring:
  unit: point
  party_label: Manche {round}
  title: Fin de la manche {round}
  question: Qui a gagné des points ?
  validate: Valider la manche
  target: { 2: 7, 3: 5, 4: 4 }
tutorial:
  setup: { title: …, diagram: [{ label: Pioche }], steps: [Mélange les {cards} cartes.] }
  turn: { title: …, steps: […], win: { title: …, text: … } }
full_rules: [{ title: But, text: … }]
```

| Champ | Règle |
|---|---|
| `id` | Identifiant d'URL. Doit être égal au nom du dossier. |
| `font` | Absent : Fredoka 700. Sinon `file` (woff2 du dossier du jeu), `family`, `weight` (défaut 400), `band_size` (taille du nom dans le bandeau, défaut 3,5 × 16 px). La police est déclarée au démarrage (`registerGameFonts`) et précachée. |
| `background_color` | `jaune`, `vert`, `rouge`, `bleu` ou `#RRGGBB`. Le texte est **choisi automatiquement** ; une couleur sans contraste ≥ 4,5 est refusée. L'ombre vient de `tapis_ombres` (charte) ou, pour une couleur libre, de la couleur assombrie. |
| `card_groups` | Une ligne de la liste = une page de la vue à balayer. `cards` : les cartes à garder, une liste de `{ ranks, suits }` (`suits: all` = les quatre couleurs ; les rangs 2 à 10 s'écrivent sans guillemets). Le nombre de cartes est **calculé**. `display` : la carte montrée (défaut : la première) ; `short` : sous le titre, après « ×15 · » ; `badge` : pastille facultative ; `detail` : carte d'explication de la vue à balayer ; `expert` : la **correspondance** avec le jeu d'origine : `original` (« 2–6 », « 1 »), `name` (« Prêtre », remplace « 2–6 → 2 à 6 »), `power` (son pouvoir, en une proposition). |
| `group_word` | « Groupe » (défaut) ou « Carte » : « Carte 2 / 8 » dans la vue à balayer. |
| `scoring` | Les mots du jeu et la règle de fin (le fonctionnement est commun, voir §7) : `unit` (« trio », « point », pour les boutons − et +), `party_label` (en haut à droite de la partie : « Manche {round} », « Trios gagnés »), `title`, `question`, `validate`, `target` (score qui termine la partie : un nombre, ou un nombre par effectif ; absent : pas de fin automatique). |
| `tutorial.setup.diagram` | 1 à 4 éléments `{label, card?}` : un dos de carte, ou une carte visible si `card` est donné. |
| `{cards}` | Dans tous les textes : remplacé par le nombre de cartes gardées. `{round}` : numéro de manche (scores). |
| bandeau « Retire… Garde… » | **Dérivé** des cartes gardées, carte par carte (`deckPlan` dans `src/data/deck.ts`). Si les cartes gardées sont exactement toutes les couleurs gardées dans tous les rangs gardés, et qu'il y a au plus 3 éléments à retirer : « Retire les carreaux et les rois. Garde 36 cartes. » Sinon : « Garde ces 17 cartes. Retire tout le reste du paquet. » Rien à écrire. |
| `classic_forbidden_terms` | Facultatif. Vocabulaire d'origine interdit dans les textes (test). Absent pour Trio. |
| pioche | Pas de champ : le dos prend la couleur du jeu. |

Un test automatisé (`src/data/games.test.ts`, Vitest + Ajv) vérifie **chaque jeu**, et le modèle `docs/modele-jeu.yaml` :
- conformité au schéma, un `game.yaml` par dossier, id égal au dossier, logo et police existants ;
- groupes : aucune carte gardée deux fois, noms différents, carte montrée dans le groupe, tient dans 52 cartes, chaque groupe a son `expert.original` ;
- `{cards}` remplacé partout ; score visé donné pour chaque effectif quand c'est une table ;
- contraste texte / fond ≥ 4,5 ;
- vocabulaire interdit par le jeu absent des textes ;
- **ton** : tutoiement, phrases de 22 mots au plus.

### 9.3 Jeux livrés en v1
1. **Trio** *(réalisé, d'après les maquettes)*. Fin automatique au 3e trio. 36 cartes d'origine (valeurs 1 à 12 en trois exemplaires) jouées avec le paquet de 52 : on garde pique, cœur et trèfle de l'As à la Dame, et on **retire les carreaux et les rois**. As = 1, Valet = 11, Dame = 12. Six groupes : A, 2 à 6, 7 (« Spécial »), 8 à 10, Valet, Dame. 3 à 6 joueurs, environ 15 minutes. Le mode « Piquant » n'est pas jouable : ses liens entre numéros sont imprimés sur les cartes d'origine.
2. **Love Letter** *(réalisé, d'après la galerie de maquettes)*. 2 à 4 joueurs, 20 minutes, nom en Great Vibes, tapis rouge. **17 cartes** : les 6 Gardes sont les 4 valets et les 2 rois noirs (un paquet de 52 n'a que 4 as : décision de l'utilisateur), puis Prêtre = 2 (×2, cœur et pique), Baron = 3 (×2), Servante = 4 (×2), Prince = 5 (×2), Roi = 6 (×1), Comtesse = 7 (×1), Princesse = 8 (×1). Huit groupes. Les as, 9, 10, dames et autres rois sont retirés. Jusqu'à 7, 5 ou 4 jetons à 2, 3 ou 4 joueurs.

> Les textes viennent des **maquettes, mot pour mot**. Rédigés par nous, à relire : pour Trio, cinq textes de la vue à balayer ; pour Love Letter, « Fin de manche », « Cas particuliers » et sept textes de détail de groupe.

### 9.4 Persistance locale
Via `src/core/storage.ts` : `@capacitor/preferences` dans les apps natives (non purgé par le système), `localStorage` sur le web, avec repli silencieux si le navigateur le bloque.
- **Mode de lecture** (Classique / Connaisseur), changé par la bascule de « Tes cartes ».
- **Message de bienvenue** déjà vu.
- **Partie en cours**, par jeu (`session:<id>`) : joueurs, scores, manche et marque `unnamed` (partie sans prénoms). Relue avec validation stricte : une donnée abîmée est ignorée, l'app démarre normalement ; l'ancien format (`trios`, sans manche) est relu. « Terminer la partie » l'efface.
- **Historique** (`history`) : les 100 dernières parties (jeu, date, statut, scores). Les entrées abîmées sont ignorées une à une.

Aucune donnée n'est indispensable au fonctionnement : sans stockage, l'app reste utilisable.

## 10. Spécifications techniques

### 10.1 Stack
- **Vite + React + TypeScript** en mode `strict`.
- **PWA** : `vite-plugin-pwa` (Workbox, précache de tout le build, mise à jour automatique), manifeste `display: standalone`, `orientation: portrait`.
- **Capacitor 8** : `@capacitor/core`, plugins `preferences`, `status-bar`, `splash-screen`. Projets natifs `android/` et `ios/` versionnés dans le dépôt.
- Navigation : `react-router`.
- État : état local React et contexte. Pas de bibliothèque d'état tant que le besoin n'existe pas (les préférences tiennent en 2 ou 3 valeurs).
- Qualité : `oxlint`, Prettier, `tsc -b`.
- Tests : Vitest + Testing Library (unitaires et composants), Playwright (PWA hors ligne, captures du design system).
- Versions minimales : navigateurs récents (Chrome/Safari/Firefox, 2 dernières années), iOS 15+, Android 7+ (WebView à jour), à confirmer avec le jalon 6.
- Orientation : portrait uniquement (manifeste, `AndroidManifest.xml`, `Info.plist`).

### 10.2 Architecture
Organisation par fonctionnalités :

```
src/
  core/          # tokens générés, contraste, storage, cartes, init native
  content/games/ # <id>/game.yaml + logo et police du jeu
  features/
    home/
    game-detail/
    rules/
    about/
    dev/         # page de visite du design system (dev uniquement)
  components/    # design system partagé
  styles/        # tokens générés + styles globaux
scripts/         # gen-tokens, gen-icons, garde-fous
e2e/             # tests Playwright
charte/  docs/  maquettes/
android/  ios/   # projets natifs Capacitor
```

### 10.2 bis Adresses
| Adresse | Écran |
|---|---|
| `/` | Accueil : choix du jeu |
| `/jeu/:id` | Le jeu : « Jouer » ou « Règles complètes » |
| `/jeu/:id/regles` | Règles complètes |
| `/jeu/:id/tutoriel/cartes` | Tes cartes : vue liste (bascule de mode) |
| `/jeu/:id/tutoriel/cartes/3` | Vue à balayer, ouverte sur le groupe 3 (à partir de 1) |
| `/jeu/:id/tutoriel/mise-en-place` | Mise en place |
| `/jeu/:id/tutoriel/tour` | Un tour de jeu |
| `/jeu/:id/joueurs` | Qui joue ? |
| `/jeu/:id/partie` | Partie en cours |
| `/jeu/:id/partie/scores` | Saisie des scores (points gagnés, ajoutés à la validation) |
| `/jeu/:id/resultat/:partieId` | Podium d'une partie terminée ou interrompue |
| `/scores` | Historique « Tes scores » |
| `/reglages` | Réglages |
| `/a-propos` | Mentions légales, crédits, version |

Toutes les adresses sont construites par `src/routes.ts`. Depuis la partie, les écrans de règles, cartes, mise en place et tour s'ouvrent avec `?depuis=partie` : le retour mène à la partie. Un groupe, un jeu ou une page inconnus affichent « introuvable ».

### 10.3 Performance
- Démarrage < 2 s sur appareil milieu de gamme.
- 60 fps dans les écrans de règles (animations en `transform` et `opacity` uniquement).
- Poids : JS initial < 150 Ko gzip ; polices limitées au sous-ensemble latin et aux graisses utilisées.
- Lighthouse : score PWA « installable » et accessibilité ≥ 95.

### 10.4 Accessibilité
- Texte ≥ 16 px, zones tactiles ≥ 44 px, contraste ≥ 4,5.
- Libellés sémantiques (`aria-label`, `role="img"`) sur cartes et jetons : « Roi de cœur », « Jeton rouge, valeur 25 ».
- Ne pas faire reposer le sens sur la seule couleur (rouge/noir des cartes toujours accompagné du symbole).
- Respect de la taille de texte système (jusqu'à 130 % sans casse de mise en page) : unités `rem`, zoom autorisé (pas de `user-scalable=no`).
- Zones sûres (encoche, barre de gestes) gérées par `viewport-fit=cover` et `env(safe-area-inset-*)`.
- Respect de `prefers-reduced-motion`.
- Focus clavier visible.

### 10.5 Données personnelles
Aucune collecte en v1, aucun compte, pas de tracking. Si des statistiques sont ajoutées plus tard : consentement et politique de confidentialité obligatoires.

### 10.6 Hors ligne et mises à jour
- Le service worker précache tout le build (code, polices, JSON des jeux, icônes). L'app démarre sans réseau dès la deuxième visite.
- Mise à jour automatique : une nouvelle version est téléchargée en arrière-plan et prend effet au prochain lancement.
- Dans les apps natives, le build web est **embarqué dans le binaire** : le hors ligne fonctionne dès l'installation, sans service worker.

### 10.7 Distribution
- **Web (v1)** : build statique `dist/` servi par n'importe quel hébergeur statique, avec repli de toutes les routes vers `index.html`. HTTPS obligatoire (service worker).
- **Stores (décision au jalon 6)** : `npm run cap:sync`, puis build et signature dans Android Studio (SDK Android) et Xcode (Mac obligatoire). Comptes développeur : Apple 99 $/an, Google 25 $ une fois.
- **SEO** : une SPA classique est mal indexée. Si le référencement des pages par jeu devient un objectif, évaluer un prérendu statique au jalon 6 (par exemple `vite-react-ssg`).

---

## 11. Critères d'acceptation

- [x] Chaque écran de Trio et de Love Letter est **conforme à sa maquette, mesuré** : moins de 1 % de pixels différents (`e2e/maquettes.spec.ts`), écarts assumés listés en 7.10.
- [x] Chaque écran tient sans défilement vertical à 390 × 844 et 393 × 852 (test automatisé).
- [x] Le mode de lecture se choisit après le jeu, jamais à l'accueil.
- [ ] Aucune couleur / rayon / espacement / taille de texte en dur (test automatisé vert).
- [ ] Un nouveau jeu s'ajoute avec un seul JSON + assets, sans modification de code.
- [ ] Les termes d'origine interdits par un jeu n'apparaissent pas dans ses textes (test, champ `classic_forbidden_terms`).
- [ ] Contraste ≥ 4,5 pour tous les couples texte/fond, y compris fond « libre ».
- [ ] Aucun logo ou lettrage officiel dans le dépôt.
- [ ] App 100 % fonctionnelle hors ligne (test Playwright : rechargement sans réseau).
- [ ] App installable : manifeste valide, icônes 192, 512 et maskable.
- [ ] `npm run lint`, `npm run typecheck`, `npm test` sans erreur.
- [ ] `npx cap sync` sans erreur.
- [ ] Testé sur au moins un petit et un grand écran, sur iOS (Safari) et Android (Chrome).
- [ ] Si publication sur les stores : build natif Android et iOS testé sur appareil réel.

---

## 12. Plan de réalisation (jalons pour Claude Code)

**Jalon 0 : initialisation** *(réalisé)*
Projet Vite + React + TypeScript strict, structure de dossiers, lint (oxlint + Prettier), tests (Vitest, Playwright), PWA (manifeste, service worker, icônes), Capacitor (Android + iOS, portrait, `cap sync`), CI de base. `CLAUDE.md`, charte et maquettes copiés dans le dépôt.

**Jalon 1 : design system** *(réalisé)*
Tokens générés depuis le JSON (variables CSS + TypeScript), garde-fou « aucune valeur en dur », contraste WCAG, polices embarquées, `Button`, `PlayingCard`, `PokerChip`, page de visite `/dev/design-system`, tests de composants et captures Playwright.

**Jalon 2 : données** *(réalisé, avec Trio)*
Types, schéma JSON, chargement des jeux (`import.meta.glob`), plan du paquet (`deckPlan`, `removalList`), thème par jeu, tests de validation éditoriale. Trio en contenu de référence.

**Jalons 3 et 4 : écrans de Trio d'après les maquettes** *(réalisés)*
Page du jeu, tutoriel (Tes cartes en deux modes, vue à balayer, mise en place, un tour), règles complètes, partie en cours, trios gagnés, plus « Qui joue ? ». Charte v6 (ombres de tapis, carte fantôme, voile, rayon 16). **Test de fidélité pixel à pixel** aux maquettes.

**Jalon 5 : second jeu et finitions** *(en partie)*
Fait : page À propos et mentions légales, états vides, erreur et premier lancement ; **second jeu, Love Letter** (manches, podium, historique, réglages, accueil « Tes jeux » avec onglets, recherche et filtres), **moteur généralisé** (liste exacte de cartes, retrait « tout le reste », schéma de mise en place libre, scoring par jeu). Reste : accessibilité à auditer sur appareil, performances (Lighthouse).

**Jalon 6 : publication**
Hébergement web et nom de domaine, icône et écran de lancement natifs (`@capacitor/assets`), vérification des droits (voir section 6), puis, si décidé : builds Android et iOS, fiches et captures de stores, plugin d'écran maintenu allumé.

### Prompt de démarrage conseillé pour Claude Code

> Lis `CLAUDE.md` puis `docs/CAHIER_DES_CHARGES.md`. Reprends au jalon 5 (finitions) ou ajoute un troisième jeu. Utilise `charte/mastercards-charte.json` comme seule source des tokens et les images de `maquettes/<jeu>/` comme référence. Avant de coder, propose-moi la liste des fichiers que tu vas créer.

---

## 13. Questions ouvertes

1. Quels jeux au-delà de Love Letter et Trio pour la v1 ?
2. Qui rédige et relit les règles (classique et connaisseur) ?
3. Un paquet de 52 cartes, ou avec jokers (54) ?
4. Langues autres que le français ?
5. Modèle économique (gratuit, achat unique, abonnement, pub) ? Il décide si les stores sont nécessaires.
6. Où sont hébergées les maquettes définitives ? Lien du canvas à conserver dans le dépôt.
7. Validation juridique des noms de jeux avant publication.
8. Hébergement web et nom de domaine.
9. Identifiant d'application définitif (`io.mastercards.app` est provisoire) : à fixer avant toute publication sur un store.
10. Prérendu statique des pages par jeu pour le référencement : nécessaire ou non ?
11. ~~Love Letter : comment représenter les cartes avec un paquet de 52 ?~~ *Tranché : 6 Gardes = 4 valets + 2 rois noirs, 17 cartes (7.10).*
12. Relecture éditoriale de Trio : les textes viennent des maquettes ; cinq textes de la vue à balayer (A, 2 à 6, 8 à 10, Valet, Dame) ont été rédigés sur le même modèle. « Un tour » (maquette) dit « puis une deuxième » alors qu'on peut retourner jusqu'à trois cartes : à confirmer.
13. Durée de Trio : « environ 15 minutes » d'après l'éditeur et les revendeurs, une source indique 15 à 20 minutes.
14. ~~Maquette de l'accueil~~ *Fournie avec la galerie Love Letter (« Tes jeux »), réalisée.* Reste à valider : les filtres « 2–4 joueurs » et « Rapide », que la maquette ne définit pas.
15. Écran **« Qui joue ? »** (ajouté, sans maquette) : à valider ou à remplacer par la maquette.
16. ~~Maquettes d'un second jeu~~ *Reçues et réalisées (Love Letter).*
17. Love Letter : relire les textes rédigés par nous (« Fin de manche », « Cas particuliers », sept détails de groupe), et confirmer le jeu à **6 Gardes** (17 cartes) plutôt que 5 (16 cartes).
18. « Terminer la partie » de Trio mène au podium et à l'historique ; un trio de 7 ou trois trios ne terminent pas la partie tout seuls (pas de `target` pour Trio).
19. Langues English et Español : affichées grisées dans les Réglages, à traduire ou à retirer.
