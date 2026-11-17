# MasterCards : contexte du projet

## Concept
Application mobile (PWA installable, puis iOS + Android via Capacitor) qui explique comment jouer à des jeux de société
(Love Letter, Trio, etc.) avec un jeu de cartes classique.
Il ne s'agit pas d'enseigner les règles de jeux de cartes classiques (belote…).

## Pour chaque jeu
- Quelles cartes du paquet garder.
- Mode classique : règles expliquées uniquement sur la base des cartes choisies, sans vocabulaire du jeu d'origine.
- Mode connaisseur : correspondance carte → personnage, pouvoir, règle d'origine.

## Personnalisation par jeu
Nom, police du nom, pioche (dos de cartes), logo (optionnel), couleur de fond
(jaune, vert, rouge, bleu ou libre), règles (classique + connaisseur).

## Direction artistique
- Ambiance jeu de société : fond bleu, formes épaisses et arrondies, boutons en relief (réf. Ludo).
- Cartes façon Gambit : blanches, rang seul en haut à gauche, un seul grand symbole centré, rouge et noir uniquement.
- Jetons de poker en jaune, vert, rouge, bleu.
- Un tapis (couleur) par jeu.
- Ton : tutoiement, phrases courtes.

## Décisions
- Logos et lettrages officiels non reproduits : évocation originale seulement
  (ex. Love Letter : police calligraphique + sceau de cire redessiné). Droits à vérifier avant publication.
- Ressources : canvas de maquettes (charte, 5 planches) + mastercards-charte.json (tokens).

## Décision technique
PWA en Vite + React + TypeScript, empaquetée avec Capacitor pour les stores. Raisons : contenu statique et hors ligne,
aucune API native requise, partage par simple lien, référencement web, pas de review de store pour la v1.
Capacitor est intégré dès le départ pour publier sur les stores sans réécriture si la monétisation ou la visibilité l'exigent.

## Prochaines étapes
Écrans complets : accueil, fiche jeu avec choix des cartes à garder, règle pas à pas en mode classique et connaisseur.
