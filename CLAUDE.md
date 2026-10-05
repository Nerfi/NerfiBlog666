# CLAUDE.md — Project Memory

## Project Overview

**Nerf's World** — A minimal, bilingual (ES/EN) personal blog built with Astro 5.
Deployed to Cloudflare Workers (static assets) via Git integration.

- **Repo**: `Nerfi/NerfiBlog666` (GitHub)
- **Live URL**: `https://trip.six-six6.workers.dev`
- **Author**: TRIP (canonical pen name)

---

## Design Inspiration

- **Primary**: Lys's "Fourfold" blog (Japanese minimalist developer) — left sidebar (title + intro + nav + action icons), content column on right
- **Current layout already matched the skeleton**: sidebar + content grid, Inter + Source Serif 4, accent `#6f00ff`

---

## Architecture Decisions (ADRs)

| Decision | Choice | Rationale |
|---|---|---|
| Language model | One language per post, UI chrome in both ES/EN | Simpler to write; matches personal blog workflow |
| URL scheme | ES at `/`, EN at `/en/` (no prefix for default) | Clean URLs for primary language; explicit for secondary |
| Analytics | Cloudflare Web Analytics | Free, cookieless, same dashboard as Workers |
| Photos | Local in repo, colocated with posts, build-optimized | Few photos; Astro content layer handles optimization |
| Deployment | Cloudflare Workers + Git integration (master branch) | Auto-deploy on push; preview deploys |
| i18n routing | Astro native i18n config (`prefixDefaultLocale: false`) | Built-in; no extra deps; `Astro.resolvePageLocale()` works |
| Fonts | Self-hosted via `@fontsource/inter` + `@fontsource/source-serif-4` | No Google Fonts request; better LCP/privacy |
| CSS approach | Mobile-first with progressive enhancement breakpoints | Mobile: single column stacked; Tablet (600px+); Desktop (900px+, sticky sidebar) |

---

## Tech Stack

- **Astro 5.17.1** (static output, content layer)
- **@astrojs/sitemap** — auto sitemap-index.xml
- **@astrojs/rss** — per-locale feeds (`/feed.xml`, `/en/feed.xml`)
- **@fontsource/inter** + **@fontsource/source-serif-4** — self-hosted fonts
- **sharp** (dev) — placeholder image generation
- **TypeScript** (strict) + **@astrojs/check** — type safety

---

## Project Structure

```
src/
├── components/
│   ├── DescriptionBlog.astro   # Site title + description (per-lang)
│   ├── Footer.astro            # Copyright + RSS link (per-lang)
│   ├── NavBarActions.astro     # RSS, GitHub, lang toggle, theme toggle
│   ├── Navigation.astro        # Nav links with active state (per-lang)
│   ├── PostPage.astro          # Article rendering + meta + prev/next + JSON-LD
│   └── Welcome.astro           # (removed)
├── config/
│   └── site.ts                 # Site metadata (name, description, author, github)
├── i18n/
│   └── config.ts               # Lang type, dictionaries (ES/EN), helpers
├── layouts/
│   ├── Layout.astro            # Root layout: SEO meta, OG, JSON-LD, hreflang, fonts
│   └── MarkDownLayout.astro    # (removed, replaced by PostPage)
├── pages/
│   ├── index.astro             # ES home: reading paths + latest posts
│   ├── about.astro             # ES about
│   ├── thoughts.astro          # ES thoughts (tag filter)
│   ├── trips.astro             # ES trips (photo posts with cover)
│   ├── tags.astro              # ES tag cloud index
│   ├── tags/[tag].astro        # ES tag detail
│   ├── posts/[...slug].astro   # ES post pages (PostPage component)
│   ├── feed.xml.ts             # ES RSS
│   ├── en/
│   │   ├── index.astro         # EN home
│   │   ├── about.astro         # EN about
│   │   ├── thoughts.astro      # EN thoughts
│   │   ├── trips.astro         # EN trips
│   │   ├── tags.astro          # EN tag cloud
│   │   ├── tags/[tag].astro    # EN tag detail
│   │   ├── posts/[...slug].astro # EN post pages
│   │   └── feed.xml.ts         # EN RSS
│   └── 404.astro               # Not found (ES)
├── styles/
│   └── global.css              # Mobile-first, CSS variables, dark mode
├── utils/
│   └── posts.ts                # Filtering, sorting, read time, date formatting
├── blog/
│   ├── es/
│   │   ├── primer-post/
│   │   │   └── index.md        # ES thoughts post
│   │   └── primer-viaje/
│   │       ├── index.md        # ES trips post with photos
│   │       ├── cover.png
│   │       ├── foto-1.png
│   │       └── foto-2.png
│   └── en/
│       └── first-post/
│           └── index.md        # EN thoughts post
├── content.config.ts           # Collection schema (title, description, pubDate, author, tags, cover?)
├── env.d.ts                    # import.meta.env types
scripts/
├── generate-images.mjs         # Sharp script: og-default.png, favicon.png, placeholders
public/
├── favicon.png                 # 64x64 rasterized from logoBlog.svg
├── og-default.png              # 1200x630 default OG image
├── robots.txt                  # Sitemap reference
├── logoBlog.svg                # Original vector logo (320KB)
└── icons/
    ├── rss.svg
    ├── github.svg
    ├── theme.svg
    └── lang.svg                # Language toggle icon (globe)
```

---

## Content Model

**Collection: `blog`** (glob loader: `{es,en}/**/*.md`)

```ts
schema: z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().default('TRIP'),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(), // relative path, optimized by content layer
})
```

**Language derived from folder**: `es/...` → `es`, `en/...` → `en`

**Photos**: Place images in same folder as `index.md`, reference with relative markdown: `![](foto-1.png)`. Content layer auto-optimizes via Astro assets.

**Adding a post**:
```
src/blog/es/mi-nuevo-post/
  index.md
  cover.png (optional)
  foto-1.jpg (optional)
```

---

## i18n Dictionary (`src/i18n/config.ts`)

All UI strings centralized:
- `nav` (home, thoughts, trips, tags, about)
- `sections` (thoughts, trips, tags, about, post)
- `homeLabel`, `homeTitle`, `homeIntro`, `paths`, `latestTitle`
- `metaBy`, `metaPublished`, `metaMinRead(minutes)`
- `tagsTitle`, `tagsIntro`, `tagCount(count)`
- `aboutTitle`, `aboutIntro`, `aboutBody[]`
- `prev`, `next`, `empty`
- `rights(year)`, `notFoundTitle`, `notFoundBody`

Helpers: `getDictionary(lang)`, `langPrefix(lang)`, `langPath(lang, path)`, `postLang(id)`

---

## SEO Implementation

| Feature | Implementation |
|---|---|
| Per-page `<title>` | `postTitle · Nerf's World` |
| Meta description | Frontmatter `description` (≤160 chars) |
| Canonical URL | `new URL(Astro.url.pathname, Astro.site)` |
| `html lang` | Per-page (`es` / `en`) |
| `hreflang` | On paired pages (home, about, sections, tags) + `x-default` → ES |
| Open Graph | `og:title`, `og:description`, `og:type` (article/website), `og:url`, `og:locale`, `og:image` (cover or `/og-default.png`), `og:image:width/height` |
| Twitter Card | `summary_large_image` when cover exists |
| JSON-LD | `BlogPosting` + `BreadcrumbList` on posts; `CollectionPage` on sections/tags; `WebSite` + `Person` on home/about |
| Sitemap | `@astrojs/sitemap` → `sitemap-index.xml` |
| RSS | Per-locale (`/feed.xml`, `/en/feed.xml`) via `@astrojs/rss` |
| Robots.txt | `User-agent: *` + `Sitemap: https://trip.six-six6.workers.dev/sitemap-index.xml` |
| Fonts | Self-hosted (no external requests) |
| Images | `width`/`height`/`srcset`/`loading=lazy` via content layer |

---

## Analytics

**Cloudflare Web Analytics** beacon injected in `Layout.astro` head:
```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" 
  data-cf-beacon='{"token":"...","useSession":true}'>
```
Token via `PUBLIC_CF_ANALYTICS_TOKEN` env var (set as a **build** variable in the Worker settings).

## Language Toggle

Added to `NavBarActions.astro`:
- Globe icon (`/icons/lang.svg`)
- Links to equivalent page in other language:
  - `/` ↔ `/en/`
  - `/thoughts` ↔ `/en/thoughts`
  - `/trips` ↔ `/en/trips`
  - `/tags` ↔ `/en/tags`
  - `/about` ↔ `/en/about`
  - `/tags/x` ↔ `/en/tags/x`
  - `/posts/*` ↔ `/en/posts/*` (falls back to home if no mapping)

---

## Mobile-First CSS

**Base (<600px)**: Single column, sidebar stacked above content, padding `2rem 1rem`, h1 `1.9rem`
**Tablet (600px+)**: Padding `2.5rem 1.5rem`, h1 `2.1rem`
**Desktop (900px+)**: 2-column grid, sticky sidebar (230px), full padding `3.5rem`, h1 `2.3rem`

Breakpoints use `min-width` (progressive enhancement), not `max-width` reduction.


## Known Issues / Future Work

- **Post slug mapping**: Language toggle for posts falls back to home if no 1:1 mapping exists. Could add `translationKey` frontmatter for exact linking.
- **EN trips section**: No sample EN trips post yet (shows empty state).
- **Search**: Not implemented (reference uses pagefind). Could add `@pagefind/astro` later.
- **OG image per post**: Currently uses cover image as-is. Could generate 1200×630 crops with text overlay via Sharp at build time.
- **Image optimization**: Content layer handles markdown images; cover images in frontmatter are not yet processed by Astro assets pipeline (just passed through as strings).

---

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build (dist/)
npm run preview      # Preview dist/
npm run images       # Generate placeholder images (og-default, favicon, covers)
npx astro check      # Type check
```


## Quick Reference

- **Author name everywhere**: TRIP (Person schema, frontmatter default, footer)
- **Site name**: "Nerf's World"
- **Accent color**: `#6f00ff` (light) / `#9d5cff` (dark)
- **Fonts**: Inter (UI) + Source Serif 4 (headings/body)
- **Content dir**: `src/blog/{es,en}/<slug>/index.md`
- **Images**: Colocated, referenced relatively in markdown