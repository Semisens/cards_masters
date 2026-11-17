# Cahier des charges : MasterCards

Version 1.1 · Plateformes : PWA installable (web) + iOS et Android via Capacitor · Base écran : 390 × 844

> Version 1.1 : passage de Flutter à une PWA (Vite + React + TypeScript) empaquetée avec Capacitor.
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
| **Classique** | Tout le monde | Règles expliquées **uniquement** avec les cartes choisies. **Aucun vocabulaire du jeu d'origine** (pas de « garde », « princesse », etc.). |
| **Connaisseur** | Tu connais déjà le jeu | Correspondance **carte → personnage**, pouvoir, et règle d'origine. |

---

## 2. Périmètre

### 2.1 Inclus (v1)
- Écran d'accueil avec la liste des jeux.
- Fiche jeu : cartes à garder, accès aux règles.
- Règle pas à pas en mode classique et en mode connaisseur.
- Thème visuel propre à chaque jeu.
- Fonctionnement 100 % hors ligne.
- **Installable** depuis le navigateur (manifeste + service worker).
- Projets natifs **Android et iOS** générés et maintenus avec Capacitor, dès le jalon 0. La **publication sur les stores** est décidée au jalon 6, pas avant.

### 2.2 Hors périmètre (v1)
- Compte utilisateur, connexion, cloud.
- Partie en ligne ou multijoueur.
- Gestion de la partie (scores, tours) : l'app **explique**, elle ne **joue** pas.
- Règles de jeux de cartes classiques.
- Création de jeux par l'utilisateur (à envisager en v2).
- Achats intégrés et publicité (à trancher avec le modèle économique, question 5).

---

## 3. Ton et contenu éditorial

- **Tutoiement** partout.
- **Phrases courtes.**
- Français (v1). Prévoir l'internationalisation dès le départ (fichiers de traduction JSON par langue, clés stables).
- Mode classique : aucun terme du jeu d'origine.
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
- Polices **embarquées** via `@fontsource` (Fredoka, Nunito, Great Vibes), sous-ensemble latin uniquement, précachées par le service worker. Aucune requête vers Google Fonts : l'app reste fidèle hors ligne.
- Les ombres des boutons et des jetons sont des teintes **dérivées de la charte**, calculées par le générateur (`--mc-color-cerise-ombre`, `--mc-tapis-*-ombre`). On n'utilise pas `color-mix()` en CSS : il n'existe pas avant iOS 16.2 et l'app vise iOS 15.

---

## 5. Personnalisation par jeu

Chaque jeu possède son propre thème :

| Champ | Description |
|---|---|
| `name` | Nom du jeu |
| `font` | Police du nom (licence libre, embarquée). Défaut : Fredoka 600. Ex. Love Letter : Great Vibes |
| `pile` | Pioche : dos de cartes à la couleur du jeu |
| `logo` | Optionnel. Image **originale ou redessinée**. Sinon : initiale dans un rond blanc |
| `background_color` | jaune, vert, rouge, bleu ou libre. Texte blanc ou encre choisi **automatiquement** (contraste ≥ 4,5) |
| `kept_cards` | Liste des cartes du paquet à garder |
| `rules.classic` | Règles sans vocabulaire d'origine |
| `rules.expert` | Correspondance carte → personnage, pouvoir, règle d'origine |

Règle de contraste automatique : calculer le ratio WCAG entre la couleur de fond libre et blanc / encre, choisir le meilleur, et refuser (ou ajuster) si aucun n'atteint 4,5. Implémentée dans `src/core/contrast.ts` (`pickTextColor`).

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

### 7.1 Accueil
- Titre MasterCards, fond ciel.
- Liste/grille des jeux : vignette avec tapis, logo ou initiale, nom dans sa police.
- Bascule globale **Classique / Connaisseur** (mémorisée).
- Accès à « À propos / mentions légales ».

### 7.2 Fiche jeu
- En-tête aux couleurs du jeu (tapis, pioche, logo, nom).
- Résumé : nombre de joueurs, durée, but du jeu en 1-2 phrases.
- **Choix des cartes à garder** : affichage des cartes à garder (composant carte de la charte) et celles à retirer. Indication du nombre total de cartes du paquet de jeu.
- Boutons : « Règle classique » et « Règle connaisseur ».

### 7.3 Règle pas à pas (classique)
- Étapes courtes, une par écran (ou carte swipable).
- Barre de progression, boutons Précédent / Suivant en relief.
- Illustrations avec les composants carte et jeton.
- Uniquement les cartes choisies, sans vocabulaire d'origine.

### 7.4 Règle pas à pas (connaisseur)
- Même navigation.
- **Tableau de correspondance** : carte → personnage → pouvoir → règle d'origine.
- Rappel de ce qui change par rapport au jeu d'origine.

### 7.5 Mentions / À propos
Crédits, licences des polices, avertissement légal, version.

### 7.6 États à prévoir
Chargement, erreur de lecture du contenu, liste vide, premier lancement.

---

## 8. Composants UI réutilisables

Composants React dans `src/components/`, un dossier par composant (TSX + CSS Module + test).

- `Button` (relief, états : normal / pressé / désactivé, variantes soleil, cerise, ciel). *Réalisé (jalon 1).*
- `PlayingCard` (rang, symbole, couleur rouge/noir, dos de pioche coloré). *Réalisé (jalon 1).*
- `CardRow` (rangée de cartes).
- `PokerChip` (4 couleurs, valeur). *Réalisé (jalon 1).*
- `GameTile` (vignette de jeu).
- `GameHeader` (tapis + logo + nom).
- `ModeToggle` (Classique / Connaisseur).
- `StepPager` (étapes, progression).
- `CorrespondenceTable` (mode connaisseur).

Les symboles de cartes (♠ ♥ ♦ ♣) sont dessinés en **vectoriel** (tracés SVG dans `PlayingCard/symbols.ts`), pas en texte, pour un rendu identique partout. Les mêmes tracés servent à générer l'icône de l'app.

---

## 9. Données et contenu

### 9.1 Principe
Le contenu des jeux est **externe au code** : un fichier JSON par jeu dans `src/content/games/<id>/game.json`, chargé avec `import.meta.glob`. Les fichiers sont donc **embarqués dans le build** (et précachés pour le hors ligne). Ajouter un jeu = ajouter un fichier + ses assets, **sans toucher au code**.

### 9.2 Modèle (proposition)

```json
{
  "id": "love-letter",
  "name": "Love Letter",
  "font": "Great Vibes",
  "background_color": "rouge",
  "logo": "logo.svg",
  "players": { "min": 2, "max": 6 },
  "duration_min": 20,
  "summary": "Garde ta carte en main. Fais tomber les autres.",
  "kept_cards": [
    { "rank": "A", "count": 5, "suits": ["any"] }
  ],
  "rules": {
    "classic": [
      { "title": "Prépare le paquet", "text": "…", "cards_shown": ["A", "2"] }
    ],
    "expert": {
      "mapping": [
        { "card": "A", "character": "…", "power": "…", "original_rule": "…" }
      ],
      "steps": [
        { "title": "…", "text": "…" }
      ]
    }
  }
}
```

Un schéma JSON (`game.schema.json`) valide chaque fichier. Un test automatisé (Vitest + Ajv) vérifie tous les jeux au build.

### 9.3 Jeux livrés en v1
1. **Love Letter** (16 cartes d'origine). À titre d'exemple de correspondance : as ×5, 2 ×2, 3 ×2, 4 ×2, 5 ×2, 6, 7, 8.
2. **Trio** (36 cartes d'origine, valeurs 1 à 12 en trois exemplaires, soit 12 rangs × 3 couleurs).

> Le contenu exact des règles et des correspondances est à **rédiger et relire** par l'équipe éditoriale. Il n'est pas fourni dans ce cahier des charges.

### 9.4 Persistance locale
Préférences uniquement : mode choisi, dernier jeu consulté, éventuellement étape de lecture en cours. Via `src/core/storage.ts` : `@capacitor/preferences` dans les apps natives (non purgé par le système), `localStorage` sur le web, avec repli silencieux si le navigateur le bloque. Aucune donnée n'est indispensable au fonctionnement : sans stockage, l'app reste utilisable.

---

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
  content/games/ # <id>/game.json + assets du jeu
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

- [ ] Tous les écrans respectent la charte et les maquettes (tolérance visuelle à valider).
- [ ] Aucune couleur / rayon / espacement / taille de texte en dur (test automatisé vert).
- [ ] Un nouveau jeu s'ajoute avec un seul JSON + assets, sans modification de code.
- [ ] Le mode classique ne contient aucun terme du jeu d'origine (relecture + test de liste de mots interdits par jeu).
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

**Jalon 2 : données**
Modèles TypeScript, schéma JSON, chargement des jeux (`import.meta.glob`), dépôt, test de validation des jeux. Love Letter en contenu d'exemple.

**Jalon 3 : accueil et fiche jeu**
Liste des jeux, thème par jeu (couleur, police, logo/initiale, contraste auto), choix des cartes à garder, bascule Classique / Connaisseur mémorisée.

**Jalon 4 : règles pas à pas**
`StepPager`, mode classique, mode connaisseur, tableau de correspondance.

**Jalon 5 : second jeu et finitions**
Trio, mentions légales, états vides/erreur, accessibilité, performances (Lighthouse).

**Jalon 6 : publication**
Hébergement web et nom de domaine, icône et écran de lancement natifs (`@capacitor/assets`), vérification des droits (voir section 6), puis, si décidé : builds Android et iOS, fiches et captures de stores, plugin d'écran maintenu allumé.

### Prompt de démarrage conseillé pour Claude Code

> Lis `CLAUDE.md` puis `docs/CAHIER_DES_CHARGES.md`. Reprends au jalon 2. Utilise `charte/mastercards-charte.json` comme seule source des tokens et regarde les images dans `maquettes/`. Avant de coder, propose-moi la liste des fichiers que tu vas créer.

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
