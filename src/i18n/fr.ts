// Textes de l'interface (français, tutoiement, phrases courtes). Les clés sont stables : une autre langue
// ajoutera un fichier de même forme. Le contenu des jeux, lui, vit dans src/content/games/<id>/game.json.

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`

export const fr = {
  app: { name: 'MasterCards' },
  nav: {
    back: 'Retour',
    backToParty: 'Retour à la partie',
    quitTutorial: 'Quitter le tutoriel',
    next: 'Suivant',
    play: 'Jouer',
    finish: 'Terminer',
  },
  home: {
    title: 'MasterCards',
    lead: 'Joue à tes jeux de société avec un simple paquet de 52 cartes.',
    gamesTitle: 'Choisis ton jeu',
    about: 'À propos',
    emptyTitle: 'Aucun jeu pour le moment',
    emptyText: 'Les jeux arrivent bientôt. Reviens vite !',
    welcomeTitle: 'Bienvenue !',
    welcomeText:
      'Choisis un jeu. Tu découvres ses cartes en mode Classique, ou en mode Connaisseur pour faire le lien avec le jeu d’origine.',
    welcomeDismiss: 'C’est compris',
  },
  mode: {
    legend: 'Mode de lecture',
    classic: 'Classique',
    expert: 'Connaisseur',
  },
  game: {
    /** « 3 à 6 joueurs » pour les vignettes. */
    players: (min: number, max: number) => (min === max ? plural(min, 'joueur', 'joueurs') : `${min} à ${max} joueurs`),
    duration: (minutes: number) => `${minutes} min`,
    /** « 3–6 joueurs · 15 min » pour le bandeau du jeu. */
    facts: (min: number, max: number, minutes: number) =>
      `${min === max ? min : `${min}–${max}`} joueur${max > 1 ? 's' : ''} · ${minutes} min`,
    play: 'Jouer',
    fullRules: 'Règles complètes',
    pileOf: (name: string) => `Pioche de ${name}`,
  },
  cards: {
    title: 'Tes cartes',
    remove: (list: string) => `Retire ${list}.`,
    keep: (count: number) => `Garde ${plural(count, 'carte', 'cartes')}.`,
    keepAll: 'Garde tout le paquet.',
    /** Titre d'une ligne en mode connaisseur : « 2–6 → 2 à 6 ». */
    mapped: (original: string, label: string) => `${original} → ${label}`,
    /** Sous le titre d'une ligne : « ×15 · Valent 2 à 6. ». */
    countAndShort: (count: number, short: string) => `×${count} · ${short}`,
    groupCounter: (current: number, total: number) => `Groupe ${current} / ${total}`,
    previousGroup: 'Groupe précédent',
    nextGroup: 'Groupe suivant',
    /** Ligne grise de la vue à balayer en mode connaisseur. */
    expertNote: (original: string, several: boolean, power?: string) =>
      `Mode connaisseur : ${several ? 'cartes' : 'carte'} ${original} du jeu d’origine.${power ? ` Pouvoir d’origine : ${power}` : ''}`,
    dots: 'Position dans les groupes de cartes',
  },
  rules: {
    title: 'Règles complètes',
  },
  party: {
    title: 'Partie en cours',
    scoreLabel: 'Trios gagnés',
    rules: 'Règles',
    setup: 'Mise en place',
    cards: 'Cartes',
    turn: 'Un tour',
    enterScores: 'Noter les scores',
    end: 'Terminer la partie',
    players: 'Joueurs de la partie',
  },
  scores: {
    title: 'Trios gagnés',
    question: 'Qui a gagné un trio ?',
    validate: 'Valider',
  },
  players: {
    title: 'Qui joue ?',
    intro: 'Écris le prénom de chaque joueur.',
    count: 'Joueurs',
    fewer: 'Un joueur de moins',
    more: 'Un joueur de plus',
    defaultName: (n: number) => `Joueur ${n}`,
    nameLabel: (n: number) => `Prénom du joueur ${n}`,
    start: 'C’est parti',
  },
  about: {
    title: 'À propos',
    disclaimerTitle: 'Application non officielle',
    disclaimer: 'Application non officielle, sans lien avec les éditeurs des jeux cités.',
    namesNote:
      'Les noms de jeux sont cités à titre descriptif. Les règles sont expliquées avec nos propres mots, pour un paquet de 52 cartes.',
    fontsTitle: 'Polices',
    fonts: 'Fredoka, Nunito et Great Vibes, sous licence libre SIL Open Font License.',
    versionTitle: 'Version',
    privacyTitle: 'Données personnelles',
    privacy: 'Aucune donnée n’est collectée. L’app fonctionne sans compte et sans connexion.',
  },
  errors: {
    notFoundTitle: 'Oups, introuvable',
    gameNotFound: 'Ce jeu n’existe pas ou n’est plus disponible.',
    groupNotFound: 'Ce groupe de cartes n’existe pas.',
    pageNotFound: 'Cette page n’existe pas.',
    backHome: 'Retour à l’accueil',
  },
}
