# Portfolio — Kuppannagari Mahendra Aravind

Personal portfolio with a **public site** and a private **admin portal** (a small CMS) for editing
everything on it — projects, experience, skills, education, achievements, resume PDF and photo —
without touching code.

**Put it online:** follow [SETUP.md](SETUP.md) (free: GitHub + Cloudflare Pages).

## How it works

```
Visitors ──> Cloudflare Pages ──> static site (Next.js export, ./out)
                                    ▲ rebuilds on every commit
Admin ──> /admin ──> /api/* (Cloudflare Functions, ./functions)
                       ├─ login: username + PBKDF2 password hash from env vars → signed HttpOnly cookie
                       └─ save: validate against src/lib/schema.ts → commit content/*.json via GitHub API
GitHub Actions (every 6h) ──> scripts/fetch-tech-updates.mjs ──> content/tech-updates.json
```

- **Content** lives in `content/*.json` and `public/` (resume.pdf, photo). Git history = backup and undo.
- **Schema** (`src/lib/schema.ts`) defines every editable section once; the admin forms and the server
  validation are both generated from it.
- **Resume sync**: uploading a new resume PDF in the admin reads its Technical Skills section (pdf.js, in the
  browser) and offers the differences to apply to the site's skills.
- **Tech updates** are public-only (not in the admin), pulled from official RSS/Atom feeds listed in
  `content/tech-sources.json`, with optional Gemini summaries.

## Security

- Admin credentials come only from environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`); the
  password is stored as a PBKDF2-SHA256 hash (100k iterations, random salt) and compared in constant time.
- Sessions: HMAC-SHA256-signed token in a `__Host-` cookie — `HttpOnly; Secure; SameSite=Strict`, 8-hour expiry.
- CSRF: state-changing requests must carry this site's `Origin`.
- Brute force: 5 failed logins per IP → 15-minute lockout (Cloudflare KV).
- The GitHub token never reaches the browser; it is scoped to this repo's contents only.
- Uploads are size-limited and checked by file signature, not just extension.
- Strict security headers and CSP in `public/_headers`; `/admin` is `noindex`.

## Develop locally

```bash
npm install
npm run dev                      # public site at http://localhost:3000 (no admin API)

cp .dev.vars.example .dev.vars   # fill in the hash + secret (npm run hash-password / gen-secret)
npm run preview                  # full site + admin API at http://localhost:8788 (DEV_MODE: nothing is committed)

npm run typecheck && npm run lint && npm run build
npm run tech-updates             # refresh content/tech-updates.json now
```

## Add a new content section

1. Create `content/<name>.json`.
2. Add an entry to `SECTIONS` in `src/lib/schema.ts` (the admin form appears automatically).
3. Import it in `src/lib/content.ts` and `functions/_lib/devContent.ts`, and render it in `src/components/sections/`.
