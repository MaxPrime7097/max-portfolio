# Portfolio — Nlend Max

Angular 22 (standalone, zoneless) + Tailwind CSS v4 implementation of the
`Portfolio.dc.html` design prototype.

```bash
npm start        # dev server on http://localhost:4200
npm run build    # production bundle in dist/Portfolio
npm test         # Vitest
```

## Routes

| Path              | Page                                       |
| ----------------- | ------------------------------------------ |
| `/`               | Long-form home page with the section rail  |
| `/projets/:slug`  | Project detail (`campussphere`, `agriguard`, `noah`) |
| `/blog`           | Blog index                                 |
| `/blog/:slug`     | Blog post                                  |

The prototype used hash routing (`#/projets/…`); this uses real paths, so any
static host needs an SPA fallback rewriting unknown paths to `index.html`
(`vercel.json` rewrites, Netlify `_redirects`, `try_files` on nginx). Without it
deep links 404 in production — the dev server handles this for you.

## Structure

```
src/app/
  core/
    portfolio-data.ts   All copy, projects, posts, stack, timeline, contact
    section-tracker.ts  IntersectionObserver scroll-spy + ambient tint
    section-spy.ts      Directive registering a <section> with the tracker
  shared/               section-rail, tag-list, post-list, media-placeholder, site-footer
  pages/
    home/               home.ts + sections/ (hero, 3 projects, about, parcours, blog, stack, contact)
    project-detail/     lazy
    blog-list/          lazy
    blog-post/          lazy
```

**All content lives in `core/portfolio-data.ts`** — copy edits should never
require touching a template.

## Design system

Tokens are declared in `src/styles.css` under `@theme`, so they are available as
normal Tailwind utilities:

- Surfaces — `ink` `bone` `mint`, plus `terminal` / `terminal-noah` for the two
  monospace log blocks (each biased towards its project's accent)
- Site accent — `accent` / `accent-bright` (links, selection, focus ring, primary
  buttons). Deliberately not any project's colour.
- Project accents — `campus` `agriguard` `noah`, each with a `-bright` hover
  variant and a `-wash` used for the ambient section tint

`@theme` is declared **`static`**, so every variable is emitted even when no
utility references it. That matters because `PROJECTS[].accent` / `.tint` and
`SECTIONS[].color` / `.tint` in `core/portfolio-data.ts` hold
`var(--color-…)` strings consumed through `[style.…]` bindings — Tailwind
cannot see those, and without `static` it would tree-shake the variables away.
**`styles.css` is the only place a colour value is written**; recolouring a
project means editing one line there.
- Fonts — `font-display` (Syne), `font-sans` (DM Sans), `font-serif` (DM Serif Display), `font-mono`
- Breakpoint — `wide:` = 880px, the single breakpoint the prototype switched on
- Animations — `animate-pulse-dot`, `animate-caret`
- Custom utilities — `section-shell`, `section-title`, `eyebrow`, `hatch`

The prototype branched on a JS `isMobile` flag at 880px; that is a CSS media
query here (`wide:`), so there is no resize listener and no layout flash.

## Assets

Everything static lives in `public/`, copied verbatim to the build root — so
`public/images/x.jpg` is served at `/images/x.jpg`. The paths are already wired;
dropping the files in is all that's left:

```
public/
  images/
    max-portrait.jpg        4/5, ~800×1000 — PORTRAIT in core/portfolio-data.ts
    projets/
      campussphere-1..5.png 16/10 — PROJECTS[].shots
      agriguard-1..5.png
      noah-1..5.png
  docs/
    cv-nlend-max.pdf        CONTACT.cvUrl, linked from the footer
```

`<app-media>` (`shared/media.ts`) renders an `<img>` and falls back to the
design's hatch box on `error`, labelled with the alt text — so a file that isn't
there yet degrades to a described placeholder instead of a broken-image icon.
That also means **a typo'd filename fails silently**; check the slot renders an
image once you've dropped one in.

On the detail page the first shot runs full width and the remaining four sit in
a 2×2 grid.

## Still TODO (carried over from the design)

- **Contact form has no backend.** `ContactSection.submit()` only flips a local
  signal — nothing is sent. Wire it to a real endpoint.
- **Contact details are placeholders** — see `CONTACT` in `core/portfolio-data.ts`:
  email, GitHub URL, LinkedIn URL.
- **Blog posts are placeholders** — `BLOG_POSTS` holds two TODO stubs.
- **Shot alt text is provisional** — written from each product's real features,
  not from the actual captures. Realign once the images exist.
- **Hero status row** is an intentional empty spacer (`hero.html`); the design
  left it blank.
