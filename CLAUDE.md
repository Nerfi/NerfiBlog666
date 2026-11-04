# CLAUDE.md — Project Memory

## Project Overview

**Nerf's World** — A minimal, bilingual (ES/EN) personal blog built with Astro 5.
Deployed to Cloudflare Workers (static assets) via Git integration.

- **Repo**: `Nerfi/NerfiBlog666` (GitHub)
- **Live URL**: `https://trip.six-six6.workers.dev`
- **Author**: TRIP (canonical pen name; Person schema, frontmatter default, footer)
- **Site name**: "Nerf's World"; accent `#6f00ff` (light) / `#9d5cff` (dark)

---

## Design Inspiration

- **Primary**: Lys's "Fourfold" blog (Japanese minimalist developer) — left sidebar (title + intro + nav + action icons), content column on right
- **Current layout already matched the skeleton**: sidebar + content grid, Inter + Source Serif 4

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
| Fonts | Self-hosted via `@fontsource/*` | No Google Fonts request; better LCP/privacy |
| CSS approach | Mobile-first, `min-width` breakpoints only (600px tablet, 900px desktop with sticky sidebar) | Progressive enhancement, no `max-width` reductions |

---

## Conventions

- **Language of a post comes from its folder**: `src/blog/es/...` → `es`, `src/blog/en/...` → `en`.
- **Adding a post**: create `src/blog/<lang>/<slug>/index.md`. Put images in the same folder and reference them relatively (`![](foto-1.png)`); the content layer optimizes them. `cover` in frontmatter is a plain relative string and is NOT yet optimized.
- **UI strings** live only in `src/i18n/config.ts` dictionaries. Never hardcode ES/EN text in components.
- **About page** is content, not UI: edit `src/about/es.md` and `src/about/en.md` (frontmatter `title`, `description`, Markdown body). It is its own `about` collection, so it never appears in post lists, tags or feeds.
- **Commits are atomic**: one logical change per commit; never mix a refactor with a feature or fix.
- **Language toggle** maps each page to its twin (`/x` ↔ `/en/x`). Posts have no 1:1 mapping, so the toggle falls back to home.

---

## SEO Implementation

| Feature | Implementation |
|---|---|
| Per-page `<title>` | `postTitle · Nerf's World` |
| Meta description | Frontmatter `description` (≤160 chars) |
| Canonical URL | `new URL(Astro.url.pathname, Astro.site)` |
| `hreflang` | On paired pages (home, about, sections, tags) + `x-default` → ES |
| Open Graph | cover or `/og-default.png` as `og:image` |
| Twitter Card | `summary_large_image` when cover exists |
| JSON-LD | `BlogPosting` + `BreadcrumbList` on posts; `CollectionPage` on sections/tags; `WebSite` + `Person` on home/about |
| Robots.txt | Sitemap line must point to `https://trip.six-six6.workers.dev/sitemap-index.xml` |

---

## Analytics

Cloudflare Web Analytics beacon is injected in `Layout.astro`. The token comes from `PUBLIC_CF_ANALYTICS_TOKEN`, set as a **build** variable in the Worker settings (not a runtime variable).

---

## Known Issues / Future Work

- **Post slug mapping**: Could add `translationKey` frontmatter for exact language-toggle linking.
- **EN trips section**: No sample EN trips post yet (shows empty state).
- **Search**: Not implemented (reference uses pagefind). Could add `@pagefind/astro` later.
- **OG image per post**: Uses cover as-is. Could generate 1200×630 crops with text overlay via Sharp at build time.
- **Cover images** in frontmatter are not processed by the Astro assets pipeline.
