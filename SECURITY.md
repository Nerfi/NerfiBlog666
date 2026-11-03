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

## Accepted risk: `npm audit` (1 critical, 15 high), 2026-11-03
- Cause: `astro <=7.3.1`, plus transitive `vite` and `zod`. The fix needs Astro 5 -> 7 (major).
- Why accepted: the advisories cover SSR, server islands, the dev server, spread props,
  `define:vars` and View Transitions. This site is static output with no adapter and uses
  none of them; no Astro code runs in production. The AVIF advisory needs a malicious
  image at build time, and all images are our own.
- Cost if wrong: low, build machine only.
- Next: upgrade Astro to 7 in its own change, with a build and visual check.
