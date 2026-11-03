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
- HTTPS: enable "Always Use HTTPS" in Cloudflare (SSL/TLS -> Edge Certificates).

## Dependencies: `npm audit` = 0 vulnerabilities (2026-11-03)
- Upgraded Astro 5.17 -> 7.4.5 (+ rss, sitemap, check). The old 1 critical / 15 high came
  from `astro <=7.3.1`, `vite` and `zod`; no accepted risk remains.
- Astro 7 needs Node >=22.23.4. Pinned in `.nvmrc` (Cloudflare Workers Builds reads it)
  and `engines` in `package.json`.
- Checked: `astro build` (17 pages), `astro check` (0 errors), output identical except
  whitespace; the theme script hash in `_headers` is unchanged.
