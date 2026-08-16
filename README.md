# Portfolio — Nlend Max

Portfolio personnel construit avec Angular 22 (standalone, zoneless) et Tailwind CSS v4. Quatre case studies complets, formulaire de contact via Brevo, déployé sur Vercel.

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | Angular 22 — standalone components, signals, `@let`, no NgModules |
| Styles | Tailwind CSS v4 — `@theme static`, utilitaires custom |
| Icônes | lucide-angular — tree-shaken via `LUCIDE_ICONS` provider |
| Email | Brevo API — serverless function `api/contact.js` |
| Déploiement | Vercel — SPA rewrite + env secrets |
| Typo | Syne (display) · DM Sans (body) · DM Serif Display (serif) · system mono |

---

## Démarrage local

```bash
# Installer les dépendances
npm install

# Lancer le dev server (port 4200)
npm start

# Lancer avec les fonctions serverless Vercel (formulaire de contact)
npx vercel dev

# Build de production
npm run build

# Lancer les tests
npm test
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine (déjà dans `.gitignore`) :

```env
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_sender@email.com
OWNER_EMAIL=your_inbox@email.com
```

Ces variables sont injectées automatiquement par `vercel dev` en local et par les secrets Vercel en production (voir section Déploiement).

---

## Structure du projet

```
src/app/
├── components/
│   ├── about/              # Section "À propos"
│   ├── contact/            # Formulaire de contact avec honeypot
│   ├── footer/             # Footer avec liens sociaux et citation
│   ├── header/             # Navbar fixe, scroll-spy, menu mobile
│   ├── hero/               # Hero plein écran avec grain + gradient
│   ├── project-detail/     # Page case study (lazy-loaded)
│   ├── projects/           # Grille 2×2 des projets
│   └── skills/             # Compétences, soft skills, intérêts
├── core/
│   ├── contact.service.ts  # HttpClient wrapper vers /api/contact
│   ├── motion.ts           # prefers-reduced-motion helper
│   ├── section-spy.ts      # Directive IntersectionObserver
│   └── section-tracker.ts  # Scroll-spy + ambient tint signal
├── data/
│   └── projects.ts         # Source unique de vérité — tout le contenu
├── shared/
│   ├── back-to-top.ts      # Bouton retour en haut
│   ├── media.ts            # <img> avec fallback hatch
│   ├── section-rail.ts     # Rail latéral de navigation
│   └── tag-list.ts         # Badges de stack
├── app.ts                  # Composant racine — absorbe la home
├── app.html                # Template racine (home + router-outlet conditionnel)
├── app.routes.ts           # Route unique : /projets/:slug
└── app.config.ts           # Providers : router, HttpClient, LucideIcons

api/
└── contact.js              # Serverless function Vercel — envoie via Brevo

public/
├── docs/
│   └── cv-nlend-max.pdf
└── images/
    ├── max-portrait.webp
    └── projets/
        ├── campussphere-1.webp
        ├── agriguard-1.webp
        ├── noah-1.webp
        └── flowdar-1.webp
```

---

## Routes

| Path | Composant | Chargement |
|---|---|---|
| `/` | `App` (home inline) | Eager |
| `/projets/:slug` | `ProjectDetail` | Lazy |

Les slugs valides : `campussphere`, `agriguard`, `noah`, `flowdar`.

Le SPA rewrite dans `vercel.json` redirige toute URL inconnue vers `index.html` — les deep links fonctionnent en production. En local sans `vercel dev`, utiliser `npm start` (le dev server Angular gère le fallback).

---

## Contenu

**Tout le contenu est dans `src/app/data/projects.ts`** — éditer du texte ne nécessite jamais de toucher un template.

Exports principaux :

| Export | Rôle |
|---|---|
| `PROJECTS` | Les 4 projets avec toutes leurs sections (why, idea, features, building, learning, next) |
| `STACK_GROUPS` | Groupes de compétences affichés dans la section Compétences |
| `SECTIONS` | Ordre et IDs des sections pour le scroll-spy |
| `CONTACT` | Email, téléphone, réseaux, CV URL |
| `PORTRAIT` | Image de la section À propos |
| `findProject(slug)` | Lookup projet par slug (utilisé dans le resolver de route) |

### Ajouter un projet

1. Ajouter une entrée dans `PROJECTS` dans `data/projects.ts`
2. Ajouter la couleur accent dans `src/styles.css` sous `@theme static`
3. Déposer le screenshot dans `public/images/projets/`

La grille s'adapte automatiquement — 2 projets = 1×2, 4 = 2×2, 6 = 2×3.

---

## Design system

Les tokens sont déclarés dans `src/styles.css` sous `@theme static`. Le mot-clé `static` force Tailwind à émettre chaque variable même si aucune classe utilitaire ne la référence — nécessaire car `PROJECTS[].accent` et `PROJECTS[].tint` sont des strings `var(--color-…)` consommées via des bindings `[style.background]` que Tailwind ne peut pas analyser statiquement.

**Règle d'or : `styles.css` est le seul endroit où une valeur de couleur est écrite.**

### Couleurs

| Token | Usage |
|---|---|
| `--color-ink` | Background global `#0b0c0e` |
| `--color-bone` | Texte principal `#f2f1ed` |
| `--color-accent` | Liens, boutons, focus ring `#d4a853` |
| `--color-accent-bright` | Hover accent `#e8c278` |
| `--color-campus` | Orange CampusSphere `#ff9800` |
| `--color-agriguard` | Vert AgriGuard `#8bc34a` |
| `--color-noah-fg` | Vert N.O.A.H `#3d9966` |
| `--color-flowdar` | Bleu Flowdar `#2257B3` |

Chaque projet a aussi un `-wash` (fond ambiant transparent) et un `-bright` (hover).

### Typographie

| Classe | Police |
|---|---|
| `font-display` | Syne — titres, eyebrows |
| `font-sans` | DM Sans — body, UI |
| `font-serif` | DM Serif Display — citations |
| `font-mono` | system monospace — labels, dates |

### Breakpoint

Un seul breakpoint : `wide:` = 880px. Correspond au passage desktop/mobile du prototype.

### Utilitaires custom

| Classe | Description |
|---|---|
| `section-shell` | Padding + border-bottom pour chaque section home |
| `section-title` | `clamp(32px, 4.4vw, 56px)` Syne 800 |
| `eyebrow` | 11px mono 700 tracking-[0.1em] |
| `hatch` | Background rayé pour les placeholders d'images |

---

## Formulaire de contact

Le formulaire utilise une architecture en deux parties :

**Frontend** (`components/contact/contact-section.ts`)
- Signals Angular pour l'état du formulaire
- Validation email côté client
- Champ honeypot caché (`website`) — si rempli, la requête est rejetée côté serveur
- États : `idle` → `sending` → `ok` / `error`

**Backend** (`api/contact.js`)
- Serverless function Vercel (Node.js)
- Validation du honeypot
- Envoi via l'API Brevo (ex-Sendinblue) en mode transactionnel
- Répond `{ ok: true }` ou un code d'erreur HTTP

---

## Déploiement Vercel

### Configuration automatique (`vercel.json`)

- **Build** : `npm run build` → output dans `dist/Portfolio/browser`
- **SPA rewrite** : toute requête non-API → `index.html`
- **Cache** : assets hashés mis en cache 1 an (immutable)
- **Headers de sécurité** : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

### Variables d'environnement en production

Dans le dashboard Vercel, aller dans **Settings → Environment Variables** et ajouter :

| Nom | Valeur |
|---|---|
| `BREVO_API_KEY` | Clé API Brevo (Transactional → API Keys) |
| `SENDER_EMAIL` | Adresse expéditrice vérifiée dans Brevo |
| `OWNER_EMAIL` | Adresse qui reçoit les messages du formulaire |

Les noms dans `vercel.json` (`@brevo_api_key`, etc.) référencent des secrets Vercel. Pour les créer :

```bash
vercel secrets add brevo_api_key "your_key_here"
vercel secrets add sender_email "sender@email.com"
vercel secrets add owner_email "owner@email.com"
```

Ou simplement ajouter les variables directement dans le dashboard — les deux méthodes fonctionnent.

### Première mise en ligne

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer (suivre les instructions interactives)
vercel

# Déploiement de production
vercel --prod
```

---

## Assets

Déposer les fichiers dans `public/` — ils sont copiés verbatim à la racine du build.

| Fichier | Format recommandé | Dimensions |
|---|---|---|
| `images/max-portrait.webp` | WebP | ~800×1000 (ratio 4/5) |
| `images/projets/*.webp` | WebP | ~1280×720 (ratio 16/9) |
| `docs/cv-nlend-max.pdf` | PDF | — |

`<app-media>` affiche un placeholder hachuré si le fichier est absent — pas d'image cassée visible.

---

## Scripts npm

| Commande | Action |
|---|---|
| `npm start` | Dev server sur `http://localhost:4200` |
| `npm run build` | Bundle de production dans `dist/Portfolio/browser` |
| `npm run watch` | Build en mode watch (développement) |
| `npm test` | Tests unitaires avec Vitest |
| `npx vercel dev` | Dev server avec fonctions serverless (formulaire actif) |
