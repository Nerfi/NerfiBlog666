# Security

Static site: no server code, no user input, no database. Attack surface is the
headers, the build-time dependencies and the repo.

## Controls
- Headers and CSP: `public/_headers` (HSTS, CSP, nosniff, frame-ancestors none,
  Referrer-Policy, Permissions-Policy, COOP). Tested locally on 2026-11-03: no CSP
  violations, theme toggle works.
- CSP allows one inline script (theme) by hash. If the inline script in
  `src/components/NavBarActions.astro` changes, recompute its sha256 and update `_headers`.
- Secrets: `gitleaks git .` scanned 25 commits, no leaks (2026-11-03).
- HTTPS: HSTS is sent on every page. "Always Use HTTPS" is a per-zone setting and
  `workers.dev` is not our zone, so plain `http://` still answers 200 (UNVERIFIED against
  Cloudflare docs). Accepted: low risk for a static public site. Fix path: add a custom
  domain, then enable "Always Use HTTPS" (SSL/TLS -> Edge Certificates).

## Dependencies: `npm audit` = 0 vulnerabilities (2026-11-03)
- Upgraded Astro 5.17 -> 7.4.5 (+ rss, sitemap, check). The old 1 critical / 15 high came
  from `astro <=7.3.1`, `vite` and `zod`; no accepted risk remains.
- Astro 7 needs Node >=22.23.4. Pinned in `.nvmrc` (Cloudflare Workers Builds reads it)
  and `engines` in `package.json`.
- Checked: `astro build` (17 pages), `astro check` (0 errors), output identical except
  whitespace; the theme script hash in `_headers` is unchanged.

## External scan
- Mozilla Observatory, 2026-11-03: grade A+, score 125, 11 of 12 tests passed.
- Only miss: Subresource Integrity (-5). The one external script is Cloudflare's analytics
  beacon, loaded over HTTPS from an allowed origin; Cloudflare changes it in place, so a
  fixed SRI hash would break it. Accepted.

## OWASP checklist (`web-api.md`), 2026-11-03
Static site: no endpoints, auth, sessions, forms, database, uploads or server code.
- Access control (A01, API1/3/5), authentication (A07, API2): N/A, nothing to protect, no accounts.
- Injection (A05): N/A, no queries or user input. Only `set:html` is JSON-LD built from our own frontmatter.
- Input (API10, API7), resources (API4/6): N/A, no outbound calls or endpoints; Cloudflare serves and rate-limits static assets.
- Configuration (A02/A06/API8/9): headers + CSP set (see Controls); Observatory A+; deps 0 vulns.
- Cryptography (A04): TLS terminated by Cloudflare; HSTS on. Open item: HTTP->HTTPS redirect (needs custom domain).
- Errors/logs/integrity (A10/A09/A08/A03): no stack traces (static 404); no secrets (gitleaks); supply chain via lockfile + `npm audit` = 0.
