/**
 * Single source of truth for the portfolio content.
 *
 * Everything the prototype hard-coded lives here so copy edits never require
 * touching a template. Items still marked TODO are placeholders carried over
 * from the design and need real content before launch.
 */

export interface ProjectStat {
  readonly value: string;
  readonly label: string;
}

export interface ProjectSection {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: readonly string[];
}

export interface ProjectFeature {
  readonly icon: string;
  readonly name: string;
  readonly desc: string;
}

export interface ProjectLearning {
  readonly worked: readonly string[];
  readonly didnt: readonly string[];
}

export interface Media {
  /** Chemin servi depuis `public/` — `public/images/x.jpg` → `/images/x.jpg`. */
  readonly src: string;
  /**
   * Décrit ce que la capture montre, jamais « capture d'écran ». Sert aussi de
   * libellé au placeholder tant que le fichier n'est pas déposé, donc à
   * réaligner sur ce qui a réellement été capturé.
   */
  readonly alt: string;
}

export interface Project {
  readonly slug: string;
  /** Short index used as an eyebrow, e.g. `01A`. */
  readonly label: string;
  readonly title: string;
  readonly role: string;
  /**
   * Accent driving eyebrows, rules and CTAs on the detail page. Always a
   * `var(--color-…)` reference — `src/styles.css` is the single source of
   * truth for the actual value, so a recolour never means editing this file.
   */
  readonly accent: string;
  /** Ambient wash painted behind the page while the section is in view. */
  readonly tint: string;
  readonly oneLiner: string;
  readonly context: string;
  readonly stack: readonly string[];
  readonly numbers: readonly ProjectStat[];
  /**
   * Cinq captures par projet. La première est affichée pleine largeur en tête
   * de la page détail, les quatre suivantes en grille 2×2 dessous.
   */
  readonly shots: readonly Media[];
  readonly finalist?: string;
  readonly liveUrl: string | null;
  readonly githubUrl?: string | null;
  readonly why?: ProjectSection;
  readonly whyCallout?: string;
  readonly idea?: ProjectSection;
  readonly features?: readonly ProjectFeature[];
  readonly learning?: ProjectLearning;
  readonly team?: string;
  readonly status?: string;
  readonly building?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: readonly string[];
    readonly callout?: string;
  };
  readonly next?: readonly {
    readonly num: string;
    readonly title: string;
    readonly desc: string;
  }[];
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'campussphere',
    label: '02A',
    title: 'CampusSphere',
    role: 'CEO & Frontend Developer',
    accent: 'var(--color-campus)',
    tint: 'var(--color-campus-wash)',
    oneLiner:
      'Le réseau social académique qui connecte les étudiants africains; ressources, collaboration et IA de révision réunis dans une seule plateforme.',
    context:
      "Plateforme collaborative pour étudiants africains, démarrée à l'IUC Douala. " +
      'Déjà en ligne : Ressources, Sphères (Cours, Projet avec kanban, Club/Association, Révision, ' +
      'Communauté), Feed avec Impact Score, Messagerie, Connexions, Notifications. Authentification ' +
      "Supabase (email + OAuth Google/Facebook) au-dessus d'un backend Django 5.2 / DRF en Simple JWT. " +
      "Sphera, l'assistant IA intégré, génère fiches, quiz et flashcards depuis une ressource ou un " +
      'fichier uploadé, corrige les annales question par question, répond aux questions sur le cours et ' +
      "exporte en PDF A4 — le tout repartageable dans une sphère.",
    team: '6 personnes',
    status: 'Live — campussphere.app',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind',
      'Shadcn/UI',
      'Django 5.2 + DRF',
      'Simple JWT',
      'Supabase Auth (OAuth)',
      'PostgreSQL',
      'Vercel',
      'Render',
    ],
    numbers: [
      { value: '3', label: 'Providers IA (Claude → Gemini → Groq) avec fallback automatique' },
      { value: '6', label: "membres dans l'équipe fondatrice" },
      { value: 'V2', label: 'Live — Fiche · Quiz · Flashcards · Q&A · Annales' },
    ],
    why: {
      eyebrow: '01 — Why',
      title: 'Les étudiants africains méritent mieux que WhatsApp.',
      body: [
        "À l'IUC Douala et dans la plupart des universités camerounaises, la vie académique numérique tient dans des groupes WhatsApp chaotiques. Les cours se perdent dans des centaines de messages. Les annales circulent par USB. Les informations importantes arrivent trop tard ou n'arrivent pas.",
        "Pas d'outil centralisé. Pas de bibliothèque commune. Pas de moyen de collaborer proprement sur un projet. Juste WhatsApp, utilisé pour tout, optimisé pour rien d'académique.",
      ],
    },
    whyCallout:
      "Les cours partagés via WhatsApp ou USB, les informations perdues, aucune vue centralisée de la vie universitaire — c'est la réalité quotidienne de millions d'étudiants africains.",
    idea: {
      eyebrow: '02 — The Idea',
      title: "Construire l'infrastructure numérique du campus africain.",
      body: [
        "L'idée n'était pas de construire « un autre réseau social ». C'était de construire l'outil que WhatsApp ne peut pas être : structuré, académique, intelligent.",
        "CampusSphere devait répondre à trois problèmes distincts en un seul produit — la gestion des ressources, la communication structurée entre étudiants, et l'accès à une aide académique intelligente. Sphera, notre IA académique intégrée, est née de ce troisième besoin : les étudiants africains n'ont pas accès à des outils d'IA localisés pour leurs cours spécifiques.",
        "Opérant sous Artelos Co., notre holding dont la thèse est « donner aux gens accès à l'intelligence qu'ils n'avaient pas avant », CampusSphere est le premier projet de cette vision.",
      ],
    },
    features: [
      { icon: 'Hexagon',     name: 'Sphères collaboratives', desc: 'Espaces de travail par cours ou projet avec Kanban, fichiers partagés et chat en temps réel. Deux types : Cours (ressources + Sphera) et Projet (kanban + tâches).' },
      { icon: 'Sparkles',    name: 'Sphera — IA académique', desc: 'Upload un cours PDF. Sphera génère une fiche de révision, un quiz de 10 questions, des flashcards recto/verso et corrige les annales — en 30 secondes.' },
      { icon: 'BookOpen',    name: 'Bibliothèque communautaire', desc: 'Ressources partagées par les étudiants : annales, notes de cours, TDs. Organisées par matière, niveau et type. Téléchargement direct.' },
      { icon: 'BarChart2',   name: 'Feed avec Impact Score', desc: "Feed personnalisé classé par utilité réelle, pas par likes. Chaque post est évalué par la communauté sur son impact académique." },
      { icon: 'MessageSquare', name: 'Q&A sur le cours', desc: "Poser des questions directement sur le contenu d'un PDF. Sphera répond uniquement depuis le document, pas de réponses génériques hors contexte." },
      { icon: 'FileText',    name: "Correction d'annales", desc: "Mode Complet (réponse + explication + chapitre + à retenir) ou mode Rapide (réponse directe, zéro blabla). S'adapte à chaque structure d'épreuve." },
    ],
    learning: {
      worked: [
        "Commencer par deux features seulement (Sphères + Ressources) plutôt que tout construire d'un coup",
        "Sphera comme différenciateur — les étudiants reviennent pour l'IA, pas pour le réseau social",
        'Le système de fallback IA — zéro downtime visible même quand Claude rate',
        "Montrer l'app à de vrais utilisateurs dès le premier jour, bugs inclus",
        'Documentation technique dès le début (ARCHITECTURE.md, API.md, AUTH.md)',
      ],
      didnt: [
        'Ne pas anticiper la suspension Render 90 jours — leçon coûteuse le jour du lancement',
        'Pas de cache React Query dès le départ — chaque navigation refaisait tous les appels API',
        'Bundle de 2.36 MB en un seul chunk — framer-motion et Lottie non lazy-loadés',
        "Polling notifications toutes les 1.5s — 110 requêtes pour 5 minutes d'utilisation",
        "Vouloir trop de features à la fois avant d'avoir validé le cœur du produit",
      ],
    },
    shots: [
      {
        src: '/images/projets/campussphere-1.webp',
        alt: "Landing page CampusSphere",
      },
    ],
    liveUrl: 'https://campussphere.app',
    githubUrl: null,
    building: {
      eyebrow: '04 — Building It',
      title: 'Les décisions techniques qui ont compté.',
      body: [
        'React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/UI côté frontend. Django 5.2 + DRF côté backend. Supabase pour l\'auth et la base de données PostgreSQL. Vercel pour le frontend, Render pour le backend.',
        'Pour Sphera, l\'architecture IA utilise un système de fallback automatique : Claude Haiku comme modèle principal, Gemini Flash comme premier fallback, Groq Llama 3.3 70B comme filet de sécurité. Si un provider tombe, le suivant prend le relais sans que l\'utilisateur le voie.',
      ],
      callout:
        "Render suspend les bases de données PostgreSQL gratuites après 90 jours. On l'a découvert le jour du premier lancement réel, en pleine démo. Migration d'urgence vers Supabase le soir même — données perdues, mais l'app était de nouveau live le lendemain matin.",
    },
    next: [
      { num: '01', title: 'App Mobile Android', desc: 'Capacitor pour wrapper le frontend React existant. Publication Play Store avant la rentrée de septembre 2026.' },
      { num: '02', title: 'Quiz Multijoueur', desc: 'Kahoot-style mais avec le contenu des propres cours des étudiants.' },
      { num: '03', title: 'Compte Enseignant', desc: 'Profs partenaires avec stats de téléchargement, annonces officielles et dépôt de devoirs intégrés.' },
      { num: '04', title: 'Sphera Standalone', desc: 'sphera.campussphere.app — accessible sans compte CampusSphere, avec bot Telegram et API publique à terme.' },
      { num: '05', title: 'Welcome Week IUC', desc: "Lancement officiel lors de la semaine d'intégration. Objectif : 300–500 Spherians actifs en octobre 2026." },
      { num: '06', title: 'Expansion Campus', desc: 'IUC → autres campus Douala → Yaoundé → Cameroun → Afrique francophone. Une ville à la fois.' },
    ],
  },
  {
    slug: 'agriguard',
    label: '02B',
    title: 'AgriGuard',
    role: 'Tech & Product Lead',
    accent: 'var(--color-agriguard)',
    tint: 'var(--color-agriguard-wash)',
    oneLiner:
      "Un système d'alertes climatiques SMS qui prévient les petits agriculteurs camerounais 48h avant chaque risque; sur un simple téléphone basique.",
    context:
      "Startup camerounaise d'intelligence climatique : alertes SMS hyper-locales pour les petits " +
      "agriculteurs. Chaque jour à 06:00 UTC, un pipeline agrège l'imagerie satellite (Google Earth " +
      'Engine — NDVI MODIS et Sentinel-2 10 m, pluie CHIRPS, relief SRTM) et le climat (NASA POWER, ' +
      'OpenWeatherMap), en regroupant les parcelles en zones de 5 km : les API sont appelées une fois ' +
      "par zone et non par culture, soit ~70 % d'appels en moins. Le risque est ensuite scoré deux " +
      'fois — un moteur de règles agronomiques régionalisé sur les 5 zones agroclimatiques du Cameroun, ' +
      'et Sentinel, mon modèle interne (Random Forest, scikit-learn — pas un wrapper API). La fusion ' +
      'des deux signaux applique un veto absolu : une alerte critique issue des règles ne peut jamais ' +
      "être adoucie par le modèle, et à sévérité égale c'est le type de risque des règles — traçable à " +
      'un seuil précis — qui part dans le SMS. Les alertes HIGH/CRITICAL sont rédigées par une cascade ' +
      "LLM puis routées vers une chaîne d'opérateurs SMS avec repli.",
    team: '4 personnes',
    status: 'Pipeline live — SMS en finalisation',
    stack: [
      'FastAPI',
      'Python',
      'Google Earth Engine',
      'NASA POWER',
      'OpenWeatherMap',
      'scikit-learn',
      'Supabase',
      'Redis',
      'APScheduler',
      'React + TypeScript',
      'Leaflet',
      'Railway',
      "EasySend SMS",
    ],
    numbers: [
      { value: '8', label: 'zones agroclimatiques camerounaises couvertes' },
      { value: '~70%', label: "d'appels API en moins grâce au Zone Aggregator" },
      { value: '48h', label: "délai d'anticipation moyen entre détection et risque réel" },
    ],
    why: {
      eyebrow: '01 — Why',
      title: "Les agriculteurs camerounais n'ont aucune alerte avant la catastrophe.",
      body: [
        "200 millions de petits agriculteurs en Afrique subsaharienne perdent 30 à 50% de leurs récoltes chaque année à cause des chocs climatiques. Au Cameroun, l'agriculture emploie plus de 60% de la population active et pèse 13 à 19% du PIB national.",
        "Dans une enquête terrain menée en 2025, 93% des agriculteurs interrogés avaient subi des pertes climatiques en deux ans. 80% n'avaient qu'un téléphone basique. Les bulletins météo génériques informent sans jamais dire quoi faire.",
      ],
    },
    whyCallout:
      "La cause racine n'est pas le manque de compétences agricoles. C'est l'absence d'alertes précoces adaptées à la réalité rurale camerounaise et à ses spécificités agroclimatiques régionales.",
    idea: {
      eyebrow: '02 — The Idea',
      title: "Inverser la logique : alerter avant que l'agriculteur ne demande.",
      body: [
        "L'idée n'était pas de construire une nouvelle application météo. Les solutions existantes sont réactives — l'agriculteur doit consulter une app ou poser une question pour obtenir une information. AgriGuard inverse cette logique : le système détecte de façon autonome les conditions de risque et alerte avant qu'on ait besoin de solliciter quoi que ce soit.",
        "Le vrai défi n'était pas le satellite ou l'IA — c'était de rendre tout ça utilisable par quelqu'un sans smartphone ni internet. D'où le choix du SMS comme unique canal de livraison, et d'un modèle prédictif propriétaire, Sentinel, entraîné spécifiquement sur les dynamiques agro-climatiques camerounaises plutôt qu'une simple API générique branchée.",
        "Opérant sous Artelos Co., notre holding dont la thèse est « donner aux gens accès à l'intelligence qu'ils n'avaient pas avant », AgriGuard applique cette vision à l'agriculture climatique.",
      ],
    },
    features: [
      { icon: 'Cpu',          name: 'Sentinel — IA prédictive propriétaire', desc: "Modèle entraîné en interne sur les dynamiques agro-climatiques camerounaises. Un garde-fou absolu : toute alerte critique des règles déterministes prévaut toujours sur la prédiction statistique." },
      { icon: 'Map',          name: 'Carte satellite temps réel', desc: "Fond ESRI World Imagery avec couches NDVI, pluies, température et humidité superposables. Points colorés par niveau de risque sur 8 zones agroclimatiques du Cameroun." },
      { icon: 'LayoutDashboard', name: 'Vue 360 par agriculteur', desc: "Graphique climatique combiné, chronologie narrative de la saison et historique complet des alertes — basé uniquement sur des données chiffrées vérifiables." },
      { icon: 'MessageCircle', name: 'SMS hyper-local et actionnable', desc: "Deux actions concrètes par alerte, dans la langue de l'agriculteur, sur téléphone basique. Zéro internet, zéro app requise." },
      { icon: 'Database',     name: 'Espace admin complet', desc: "CRUD complet sur farmers, villages, cultures et parcelles. Import/export CSV, pilotage du pipeline, gestion des SMS." },
      { icon: 'Shield',       name: 'Résilience multi-fournisseurs', desc: "Cascade de génération de langage (OpenAI, Gemini, Groq, templates statiques) et distribution SMS multi-providers." },
    ],
    learning: {
      worked: [
        "Construire d'abord un système technique rigoureux avant de multiplier les partenariats",
        "Le garde-fou règles-sur-ML — aucune alerte vitale ne dépend d'un modèle statistique seul",
        "Le Zone Aggregator — réduction de 70% des appels API satellite",
        "Le 27 avril 2026, détection automatique des fortes pluies de Bamenda 48h à l'avance",
      ],
      didnt: [
        "Vouloir afficher de l'imagerie satellite parcellaire trop tôt, avant d'avoir la fiabilité nécessaire",
        "Sous-estimer le temps pour transformer une preuve technique en preuve terrain humaine",
        'Le budget SMS reste la contrainte principale au déploiement réel',
        'Juxtaposer trop de fronts en parallèle sans les hiérarchiser dans le temps',
      ],
    },
    shots: [
      {
        src: '/images/projets/agriguard-1.webp',
        alt: "Landing page AgriGuard",
      },
    ],
    liveUrl: 'https://agriguard.org',
    githubUrl: null,
    building: {
      eyebrow: '04 — Building It',
      title: 'Les décisions techniques qui ont compté.',
      body: [
        "FastAPI (Python) côté backend, Supabase PostgreSQL avec extension PostGIS pour la géométrie des parcelles. Frontend React 18 + TypeScript avec cartographie Leaflet sur imagerie satellite réelle. Pipeline quotidien à 06h00 UTC via Google Earth Engine (MODIS, Sentinel-2, CHIRPS, SRTM).",
        "Le cœur du système est la fusion entre le moteur de règles agronomiques déterministe et Sentinel, notre modèle de Machine Learning. Un mécanisme de garde-fou impose que toute condition jugée critique par les règles prévaut toujours sur la prédiction du modèle — aucune alerte vitale ne dépend d'une prédiction statistique seule.",
        "Un Zone Aggregator regroupe les exploitations physiquement proches pour mutualiser les appels satellite, réduisant les coûts d'API d'environ 70% — condition indispensable pour espérer scaler au-delà de quelques centaines d'agriculteurs.",
      ],
      callout:
        "Un bug de duplication géographique faisait que tous les agriculteurs d'une même zone partageaient les mêmes coordonnées GPS — corrigé en passant de coordonnées village à coordonnées parcelle individuelle. Une première tentative d'affichage d'imagerie satellite découpée sur chaque parcelle s'est révélée peu fiable à grande échelle — abandonnée au profit de données chiffrées historiques, plus robuste et plus honnête.",
    },
    next: [
      { num: '01', title: 'Envoi SMS en production', desc: 'Passer de la phase de test contrôlée au déploiement réel — première alerte effectivement reçue par un agriculteur.' },
      { num: '02', title: 'Pilote terrain 20-50 agriculteurs', desc: 'Premier partenariat avec une coopérative camerounaise, validation terrain de bout en bout.' },
      { num: '03', title: 'Validation scientifique', desc: 'Calibration de Sentinel sur données de stations météo terrain, avec des chercheurs universitaires camerounais.' },
      { num: '04', title: 'Jumeau numérique de parcelle', desc: "Intégration topographie, type de sol et historique biologique pour affiner encore la précision des alertes." },
      { num: '05', title: 'Dashboard Premium & Data-as-a-Service', desc: 'Ouverture aux institutions partenaires — coopératives, ONG, assureurs agricoles — avec accès API aux données agrégées.' },
      { num: '06', title: 'Partenariat télécom national', desc: "Distribution via un opérateur camerounais pour réduire le coût dominant du système : le SMS à l'échelle." },
    ],
  },
  {
    slug: 'noah',
    label: '02C',
    title: 'N.O.A.H',
    role: 'Concepteur & Développeur',
    accent: 'var(--color-noah-fg)',
    tint: 'var(--color-noah-wash)',
    oneLiner:
      "Un moteur d'observation déterministe qui détecte le drift comportemental avant qu'il devienne visible.",
    context:
      'Neural Observation & Alignment Hub — un miroir, pas un coach. On verrouille un rôle et trois ' +
      "ancres comportementales pour 30 jours, puis on logue chaque jour le temps réel, l'énergie et " +
      'les ancres tenues. Le noyau noah-core compare une fenêtre glissante de 7 jours à la précédente ' +
      'et en tire un score de dérive additif — même famille que les scores de triage clinique type ' +
      'NEWS2 — classé en quatre états : stable, fragile, drift, critical. Cinq règles de cohérence ' +
      "déclaré/observé alimentent un score d'authenticité qui attrape les deux tricheries classiques : " +
      'les ancres cochées avec 0 minute au compteur (Ghost Achievement) et les trois heures de travail ' +
      'sans une seule ancre tenue (Effort Paradox). Tout le scoring est déterministe et auditable — ' +
      "chaque alerte se ramène à une règle explicite, pas à une boîte noire. Le LLM n'intervient qu'en " +
      'périphérie : transcription audio du check-in et session de relecture à la demande, jamais dans ' +
      'le calcul. Doctrine assumée : zéro inférence spéculative — le système constate le fait de la ' +
      'dérive, jamais sa cause, et ne donne ni diagnostic ni conseil.',
    team: '1 personne',
    status: 'Live — Phase test personnel ',
    stack: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Express',
      'Vite',
      'Gemini 3 Pro / Flash',
      'Offline-first (localStorage)',
    ],
    numbers: [
      { value: '4', label: 'états déterministes : stable · fragile · drift · critical' },
      { value: '5', label: "règles d'authenticité déclaré/observé" },
      { value: '30j', label: "cycle d'identité verrouillé — la référence du signal" },
    ],
    why: {
      eyebrow: '01 — Why',
      title: "L'IA bien-être optimise pour te rassurer. Pas pour te dire la vérité.",
      body: [
        "Le burnout, le décrochage, l'effondrement ne sont presque jamais des événements soudains. Ce sont le résultat d'un drift lent et invisible — un écart progressif entre qui on veut être et ce qu'on fait réellement chaque jour.",
        "La quasi-totalité des applications de productivité et de bien-être masquent le drift en récompensant l'acte de logger sans vérifier ce qui est loggé. À mesure que les LLM envahissent ce marché, le problème s'aggrave : un agent qui optimise pour te garder engagé finit toujours par te dire ce que tu veux entendre.",
      ],
    },
    whyCallout:
      "Si on arrêtait d'essayer de comprendre les humains et qu'on se concentrait sur l'observation de leurs trajectoires ?",
    idea: {
      eyebrow: '02 — The Idea',
      title: 'Un miroir silencieux. Pas un coach.',
      body: [
        "N.O.A.H repose sur une conviction simple : la vérité n'a pas besoin d'être dite avec bienveillance pour être utile. Face à une mesure déterministe, le déni perd sa prise.",
        "Le système demande à l'utilisateur de verrouiller une identité cible (un rôle, trois anchors comportementaux) pour 30 jours. Chaque jour, il logue ce qu'il a réellement fait. Le moteur compare — pas pour juger, mais pour mesurer l'écart avec une précision que l'introspection seule ne peut pas atteindre.",
        "N.O.A.H ne pose pas la question « comment tu vas ? ». Il répond à une seule : « si rien ne change, où va cette trajectoire ? »",
      ],
    },
    features: [
      { icon: 'Eye',          name: 'Moteur déterministe — NOAH Core', desc: "Pipeline en 5 étapes : SignalAnalyzer → DriftDetector → StateClassifier → Predictor → ExplanationBuilder. Chaque alerte est justifiable par une règle mathématique explicite, jamais par un LLM." },
      { icon: 'Star',         name: "Score d'authenticité", desc: "Détecte l'écart entre ce qu'on déclare et ce qu'on fait réellement. Ghost Achievement (ancres cochées avec 0 min), Effort Paradox (temps élevé sans ancre) — six règles de cohérence vérifiées." },
      { icon: 'Clock',        name: 'Période de calibration', desc: "Les 7 premiers jours, le système affiche CALIBRATING. La confiance croît proportionnellement au volume de logs disponibles — pour ne pas afficher 95% avec une seule entrée." },
      { icon: 'Brain',        name: 'Deep Analysis — LLM comme traducteur', desc: "Le statut dérive du moteur déterministe, jamais de Gemini. Le LLM traduit en langage humain le verdict déjà calculé — il n'a jamais le dernier mot." },
      { icon: 'Lock',         name: 'Architecture sécurisée', desc: "Clé API Gemini opaque côté serveur (Cloud Run), jamais exposée dans le bundle client. Rate-limiting à 2 deep analyses par 24h par IP." },
      { icon: 'TrendingUp',   name: 'Visualisation de trajectoire', desc: "Graphe de signal sur fenêtre glissante 7 jours. Les couleurs correspondent exactement aux seuils du classificateur d'état — stable, fragile, drift, critical." },
    ],
    learning: {
      worked: [
        "Construire d'abord le moteur déterministe, greffer le LLM après — pas l'inverse",
        "Tester sur soi-même avant tout groupe révèle des bugs impossibles à voir dans le code seul",
        "La période CALIBRATING rend le système honnête sur sa propre incertitude",
        'La séparation stricte doctrine/code : vérifier que chaque ligne de doctrine est tenue par le code',
      ],
      didnt: [
        'Jargon physique emprunté sans la substance — pas soutenable face à un lecteur technique',
        "La clé API Gemini dans le bundle client — exposée à quiconque ouvre l'onglet Network",
        "Deux formules différentes pour le même signal — graphe et drift score ne partageaient pas la même pondération",
        "Le ton du Deep Analysis trop clinique au jour 1, avant même qu'un pattern existe",
      ],
    },
    shots: [
      { src: '/images/projets/noah-1.webp', alt: "Landing page N.O.A.H" },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/MaxPrime7097/N.O.A.H.git",
    building: {
      eyebrow: '04 — Building It',
      title: 'Les décisions techniques qui ont compté.',
      body: [
        "La décision la plus difficile a été de résister à la tentation de tout confier au LLM. Concevoir une logique déterministe claire est plus exigeant que de générer du texte — mais c'est la seule façon de rendre chaque alerte auditable et reproductible.",
        "La séparation stricte entre le moteur décisionnel (NOAH Core, pur TypeScript, zéro IA) et la couche d'interprétation (Gemini, uniquement pour la traduction en langage humain) a structuré toute l'architecture. Le badge d'état affiché à l'utilisateur est câblé directement sur coreResult.state, jamais sur la réponse JSON du LLM.",
        "Côté déploiement, le choix Cloud Run garantit que la clé Gemini ne transite jamais dans le bundle client — les composants React appellent uniquement des endpoints internes.",
      ],
      callout:
        "Le badge ALIGNED affiché en grand venait de Gemini, alors que le Drift Score et les projections de risque venaient du moteur déterministe — deux systèmes d'état parallèles qui pouvaient se contredire. Corrigé en supprimant status du schema JSON demandé au LLM et en câblant le badge directement sur coreResult.state.",
    },
    next: [
      { num: '01', title: 'Ouverture petit groupe', desc: '5 à 10 personnes pour valider que le score d\'authenticité attrape du vrai déni, pas des faux positifs.' },
      { num: '02', title: 'Validation H1 — Score d\'authenticité', desc: 'Quand l\'alerte de cohérence se déclenche, la personne confirme-t-elle que c\'était un vrai écart déclaré/réel ?' },
      { num: '03', title: 'Validation H2 — Ton froid vs abandon', desc: 'Le taux de check-in sur 30 jours : est-ce que l\'absence de coaching décourage ou filtre le bon profil ?' },
      { num: '04', title: 'Notifications push', desc: 'Alerte automatique à J7 si le score de dérive dépasse le seuil fragile pour la première fois dans un cycle.' },
      { num: '05', title: 'Intégration CampusSphere', desc: 'Synergie directe : N.O.A.H comme module optionnel pour les étudiants qui veulent suivre leur discipline de travail.' },
      { num: '06', title: 'Positionnement B2B', desc: 'Coaching personnel et éducation — wedges les moins réglementés et les plus proches de l\'infrastructure existante.' },
    ],
  },
  {
    slug: 'flowdar',
    label: '02D',
    title: 'Flowdar',
    role: 'Frontend Developer',
    accent: 'var(--color-flowdar)',
    tint: 'var(--color-flowdar-wash)',
    oneLiner:
      'La plateforme citoyenne qui détecte les inondations à Douala en temps réel et guide vers un itinéraire sûr.',
    context:
      "Projet individuel Angular Talent Lab 2026. La plateforme détecte les inondations à Douala en croisant données météo par quartier (OpenWeatherMap), confirmations citoyennes et historique terrain. Un score de 0 à 100 combine météo, historique, signalements et géographie. Google Maps recalcule l'itinéraire en évitant les zones alertées, mis à jour en temps réel via Supabase Realtime. Backend Node.js + Express + PostgreSQL + PostGIS développé par Mr Ebanga Arnaud, encadreur du projet.",
    team: 'Solo (frontend) + Mr Ebanga Arnaud (backend)',
    status: 'En développement — Angular Talent Lab 2026',
    stack: [
      'Angular 21',
      'TypeScript',
      'TailwindCSS',
      'Supabase Realtime',
      'Supabase Auth',
      'Google Maps JS API',
      'Directions API',
      'OpenWeatherMap',
      'Node.js',
      'PostgreSQL',
      'PostGIS',
      'Vercel',
    ],
    numbers: [
      { value: '48%', label: 'de Douala exposé aux inondations' },
      { value: '4', label: 'facteurs combinés dans le score : météo, historique, citoyens, géographie' },
      { value: '20s', label: "objectif : ouverture de l'app → consultation d'une alerte" },
    ],
    why: {
      eyebrow: '01 — Why',
      title: 'Douala inonde. Personne ne le sait à temps.',
      body: [
        "Près de 48% de la ville de Douala est exposée aux risques d'inondation. Entre 2024 et 2025, plus d'un million de Camerounais ont été affectés. Quand il pleut fort, les habitants apprennent qu'une rue est sous l'eau une heure après — via Facebook ou WhatsApp — généralement après avoir déjà pris la route.",
        "Les prévisions officielles de l'ONACC sont régionales et publiées tous les 10 jours. Elles ne disent pas si la rue Joss est sous l'eau ce matin. Aucune application mobile citoyenne n'existait pour combler ce vide.",
      ],
    },
    whyCallout:
      "Waze sait qu'il y a un bouchon parce que les conducteurs le signalent. Flowdar sait qu'un quartier est inondé parce que la météo et les citoyens le confirment ensemble.",
    idea: {
      eyebrow: '02 — The Idea',
      title: 'Trois couches. Une seule certitude.',
      body: [
        "L'idée n'était pas de construire une app météo de plus. C'était de construire le premier système de détection citoyenne des inondations à Douala — en croisant des données que personne ne croisait encore.",
        "Couche 1 — Détection automatique : OpenWeatherMap interrogé par coordonnées GPS pour chaque quartier individuellement. Pas une météo pour toute la ville — une mesure précise par zone. Couche 2 — Confirmation citoyenne : les habitants valident ce que les données détectent. Un score de 0 à 100 combine météo, historique, signalements et géographie du terrain. Couche 3 — Guidage : Google Maps recalcule l'itinéraire en évitant automatiquement les zones alertées, mis à jour en temps réel via Supabase Realtime.",
      ],
    },
    features: [
      { icon: 'Satellite',    name: 'Détection automatique par quartier', desc: "OpenWeatherMap interrogé par coordonnées GPS pour chaque zone. Score calculé toutes les 30 minutes." },
      { icon: 'Users',        name: 'Confirmation citoyenne', desc: "Les habitants confirment ou signalent. La résolution d'une alerte nécessite 3 confirmations en moins de 30 minutes." },
      { icon: 'Navigation',   name: 'Itinéraire sûr en temps réel', desc: "Google Maps Directions API recalcule automatiquement l'itinéraire en évitant les zones alertées." },
      { icon: 'Map',          name: 'Zones apprises dynamiquement', desc: "Si 5+ citoyens signalent une zone inconnue en moins d'1h, le backend la crée automatiquement." },
      { icon: 'Radio',        name: 'Alertes préventives', desc: "Prévisions météo à 6h croisées avec l'historique des zones — l'alerte arrive avant l'inondation." },
      { icon: 'Wifi',         name: 'Mode hors connexion', desc: "Dernières alertes en cache localStorage. Signalements mis en file d'attente et envoyés à la reconnexion. Compatible réseau 3G." },
    ],
    learning: {
      worked: [
        'Cadrer le MVP sur 3 fonctions uniquement : voir les alertes, signaler, trouver un itinéraire',
        "Faire reviewer les specs par Claude Code avant de coder — 7 bugs d'intégration évités en amont",
        'Supabase plutôt que Firebase pour le Storage — zéro carte bancaire requise',
        "Requêtes météo GPS individuelles par quartier — Douala n'a pas une seule météo",
        "Système de résolution en 3 confirmations — empêche les faux positifs citoyens",
      ],
      didnt: [
        "Commencer par des maquettes validées avant de rédiger les specs techniques — l'ordre inverse coûte du temps",
        "Tester l'affichage du score avec de vrais utilisateurs plus tôt — la confusion avec les signalements était prévisible",
        "Définir les bornes de score [30,60) dès le début — l'ambiguïté à 60 exactement a nécessité une v3",
        "Clarifier la responsabilité backend/frontend avant la doc, pas après",
      ],
    },
    shots: [
      { src: '/images/projets/flowdar-1.webp', alt: 'Landing page Flowdar' },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/MaxPrime7097/Flowdar.git",
    building: {
      eyebrow: '04 — Building It',
      title: 'Les décisions techniques qui ont compté.',
      body: [
        "Angular 21+ avec standalone components côté frontend — pas de NgModule, chaque composant est autonome. TailwindCSS pour le style. Supabase pour l'auth, le temps réel et le storage — gratuit, PostgreSQL natif.",
        "Le choix Supabase plutôt que Firebase était délibéré : Firebase Storage requiert le plan Blaze depuis février 2026. Supabase inclut 1 Go de storage gratuit — les photos de signalement citoyens sont couvertes sans carte bancaire.",
        "Le backend Node.js + Express + PostgreSQL + PostGIS est développé par l'encadreur Mr Ebanga Arnaud. Angular consomme uniquement l'API REST exposée — séparation claire des responsabilités.",
      ],
      callout:
        "Le score d'inondation ne s'affiche jamais seul. Après review UX, le chiffre brut '87' était systématiquement confondu avec un nombre de signalements. La solution : jauge visuelle + label texte + '87 / 100' — toujours les trois ensemble, jamais séparément.",
    },
    next: [
      { num: '01', title: 'MVP Angular complet', desc: 'Les 7 écrans fonctionnels avec les 4 composants UX (source-badge, statut-badge, risk-gauge, citizen-count) — Demo Day ATL 2026.' },
      { num: '02', title: 'Résumés Gemini', desc: "Intégration Gemini API pour générer un résumé lisible de chaque alerte : 'Rue Mandessi Bell sous 80cm d'eau, résolution estimée dans 1h30.'" },
      { num: '03', title: 'Notifications push', desc: "Alerte automatique quand une zone s'active dans le quartier de résidence de l'utilisateur. Supabase Edge Functions + Web Push." },
      { num: '04', title: 'Historique & analytics', desc: "Carte de chaleur des quartiers les plus touchés. Données utiles pour les autorités locales et l'ONACC." },
      { num: '05', title: 'Extension Cameroun', desc: "Douala → Yaoundé → autres villes camerounaises. L'architecture GPS par quartier rend l'extension triviale." },
      { num: '06', title: 'Partenariat ONACC', desc: 'Proposer Flowdar comme couche citoyenne complémentaire à la plateforme ONACC lancée en janvier 2026.' },
    ],
  },
];

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export interface SectionMeta {
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly tint: string;
}

/** Drives the fixed rail, the scroll-spy and the ambient tint, in page order. */
export const SECTIONS: readonly SectionMeta[] = [
  { id: 'hero',     label: '00 · Intro',        color: 'var(--color-bone)', tint: 'transparent' },
  { id: 'a-propos', label: '01 · À propos',      color: 'var(--color-bone)', tint: 'transparent' },
  { id: 'projets',  label: '02 · Projets',       color: 'var(--color-bone)', tint: 'transparent' },
  { id: 'stack',    label: '03 · Compétences',   color: 'var(--color-bone)', tint: 'transparent' },
  { id: 'contact',  label: '04 · Contact',       color: 'var(--color-bone)', tint: 'transparent' },
];

export interface StackGroup {
  readonly label: string;
  readonly items: readonly string[];
}

export const STACK_GROUPS: readonly StackGroup[] = [
  {
    label: 'Frontend',
    items: ['React', 'Angular', 'TypeScript', 'Vite', 'Tailwind CSS', 'Shadcn/UI'],
  },
  { label: 'Backend', items: ['Django 5.2 + DRF', 'FastAPI', 'Python'] },
  {
    label: 'Data & infra',
    items: ['Supabase', 'PostgreSQL', 'AWS', 'GCP', 'Vercel', 'Render', 'Git'],
  },
  {
    label: 'Soft Skills',
    items: [
      'Adaptability',
      'Leadership',
      'Communication',
      'Strategic Thinking',
      'Self-learning',
      'Teamwork',
      'Creativity',
    ],
  },
  {
    label: 'Interests',
    items: ['Tech & Startups','AI and Machine Learning', 'Music & Creative Expression', 'Personal Development', 'Gaming', 'Reading'],
  },
  { label: 'Langues', items: ['Français — courant', 'Anglais — courant'] },
];

export interface TimelineEntry {
  readonly tag: string;
  readonly text: string;
}

export const TIMELINE: readonly TimelineEntry[] = [
  {
    tag: '2019—2024',
    text: 'St Thomas Comprehensive High School — GCE O Level puis A Level',
  },
  {
    tag: '2024—2028',
    text: 'Institut Universitaire de la Côte (IUC), Douala — Bachelor in Computer Science Engineering, en cours',
  },
  { tag: 'Fév 2025', text: 'CampusSphere — CEO & Frontend Developer' },
  {
    tag: 'Aout 2026',
    text: 'Formation en Architecture Logiciel — Orange Digital Center Douala',
  },
  { tag: 'Dec 2025', text: 'Lauréat — AWS Santa Challenge' },
  { tag: 'Fév 2026', text: 'AgriGuard — Co-fondateur, Tech & Product Lead' },
  { tag: 'Fév 2026', text: 'Lauréat — Hult Prize OnCampus, IUC · avec AgriGuard' },

  {
    tag: 'Juin - Sep 2026',
    text: 'Angular Talent Lab — Orange Digital Center Douala, 14 semaines · "Cameroun 2030"',
  },
];

export interface Foundation {
  readonly title: string;
  readonly desc: string;
}

/**
 * N.O.A.H n'invente pas de champ théorique : il opérationnalise des constructs
 * établis. Chaque entrée dit ce que la théorie justifie *dans le code actuel* —
 * ne jamais y glisser un mécanisme de la roadmap (EWMA, CUSUM), c'est
 * exactement le décalage vocabulaire/substance que le projet s'interdit.
 */
export const NOAH_FOUNDATIONS: readonly Foundation[] = [
  {
    title: 'Self-discrepancy theory — Higgins, 1987',
    desc: "Rôle + ancres = le soi idéal, les logs = le soi actuel ; le score de dérive est l'écart mesuré entre les deux.",
  },
  {
    title: "Contrôle de l'autorégulation — Carver & Scheier, 1982",
    desc: "Boucle perception → comparaison au standard → détection d'écart : c'est littéralement le pipeline signal → analyse → dérive → état.",
  },
  {
    title: 'Contrôle statistique de processus',
    desc: "Justifie les fenêtres glissantes et les seuils de répétition, plutôt qu'une réaction à un point isolé.",
  },
  {
    title: 'Self-report validity gap — Steele',
    desc: "L'auto-rapport diverge du comportement réel pour protéger l'image de soi : c'est précisément ce que mesure le score d'authenticité.",
  },
  {
    title: 'Identity-based motivation — Oyserman',
    desc: "La saillance répétée de l'identité visée change l'interprétation de l'effort : le check-in quotidien est un mécanisme anti-dérive, pas qu'une mesure.",
  },
];

/** Footer / contact endpoints. */
export const CONTACT = {
  email: 'maxprime558@gmail.com',
  phone: '+237 6 99 40 47 59',
  city: 'Bonamoussadi, Douala — Cameroun',
  github: 'https://github.com/MaxPrime7097',
  linkedin: 'https://www.linkedin.com/in/nlend-max-6a4792330',
  instagram: 'https://instagram.com/primemax7',
  cvUrl: '/docs/cv-nlend-max.pdf',
} as const;

/** Portrait de la section « À propos ». */
export const PORTRAIT: Media = {
  src: '/images/max-portrait.webp',
  alt: "Nlend Max",
};
