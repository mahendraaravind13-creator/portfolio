# Setup guide — put the portfolio online (free)

This takes about 20 minutes, once. Everything here is free: GitHub (code + content backup) and
Cloudflare Pages (hosting + the admin login). No credit card is needed.

You will create **5 secret values**. Keep them somewhere safe (a password manager).

| Name | What it is | Where it comes from |
|---|---|---|
| `ADMIN_USERNAME` | Your admin login name | You choose it |
| `ADMIN_PASSWORD_HASH` | A scrambled form of your admin password | `npm run hash-password` (step 3) |
| `SESSION_SECRET` | Random key that signs login sessions | `npm run gen-secret` (step 3) |
| `GITHUB_TOKEN` | Lets the admin portal save changes to your repo | GitHub (step 2) |
| `GITHUB_REPO` | Your repo, e.g. `mahendraaravind13-creator/portfolio` | Step 1 |

---

## 1. Put the code on GitHub

1. Go to <https://github.com/new>, name the repository **`portfolio`**, choose **Public**, and do **not** add a README.
2. In a terminal inside this folder:
   ```bash
   git add -A
   git commit -m "Portfolio website"
   git branch -M main
   git remote add origin https://github.com/mahendraaravind13-creator/portfolio.git
   git push -u origin main
   ```

> Public is recommended: GitHub Actions minutes are unlimited for public repos, and recruiters can see the code.
> No secrets are ever stored in the repo.

## 2. Create the GitHub token (for saving from the admin portal)

1. Open <https://github.com/settings/personal-access-tokens/new> (Fine-grained token).
2. **Token name:** `portfolio-admin`. **Expiration:** the longest option offered.
3. **Repository access:** *Only select repositories* → `portfolio`.
4. **Permissions → Repository permissions → Contents:** *Read and write*. Leave everything else as is.
5. Click **Generate token** and copy it (it starts with `github_pat_`). This is your `GITHUB_TOKEN`.

## 3. Create your admin password hash and session secret

In this folder:

```bash
npm install
npm run hash-password      # type your admin password (12+ characters); copy the line starting with pbkdf2-sha256$
npm run gen-secret         # copy the random string
```

Your real password is never stored anywhere — only the hash.

## 4. Deploy on Cloudflare Pages

1. Sign up at <https://dash.cloudflare.com/sign-up> (free plan).
2. **Workers & Pages → Create → Pages → Connect to Git** → authorise GitHub → pick the `portfolio` repo.
3. Build settings:
   - **Project name:** `mahendra-aravind` (this becomes `mahendra-aravind.pages.dev`; pick another if taken)
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Under **Environment variables**, add:
   - `NODE_VERSION` = `22`
   - `NEXT_PUBLIC_SITE_URL` = `https://mahendra-aravind.pages.dev` (your real Pages URL)
5. Click **Save and Deploy**. The first build takes 2–3 minutes. Your public site is now live.

## 5. Add the admin secrets

In the Pages project: **Settings → Variables and Secrets → Add** (choose type **Secret** for each, environment **Production**):

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO` = `mahendraaravind13-creator/portfolio`
- `GITHUB_BRANCH` = `main` (plain text is fine)

## 6. Turn on login protection (recommended)

This blocks anyone who guesses passwords (5 wrong tries → locked out for 15 minutes).

1. **Storage & Databases → KV → Create** a namespace called `portfolio-login`.
2. In the Pages project: **Settings → Bindings → Add → KV namespace**. Variable name: **`LOGIN_KV`**, namespace: `portfolio-login`.

## 7. Redeploy and sign in

1. **Deployments → (latest) → ⋯ → Retry deployment** so the new secrets take effect.
2. Open `https://<your-site>.pages.dev/admin/login/` and sign in.
3. Make a small change (e.g. your tagline) → **Save & publish**. It goes live in 1–2 minutes.

## 8. (Optional) AI summaries for Tech Updates

Tech updates refresh every 6 hours by themselves. Summaries are taken from each article.
For AI-written summaries, add a free Gemini key:

1. Get a key at <https://aistudio.google.com/apikey>.
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**: `GEMINI_API_KEY`.
3. **Actions → Refresh tech updates → Run workflow** to fetch now.

To change which sites the updates come from, edit `content/tech-sources.json`.

---

## Maintenance

**Change your admin password** — run `npm run hash-password`, replace `ADMIN_PASSWORD_HASH` in Cloudflare, retry the latest deployment.

**Sign out everywhere** — generate a new `SESSION_SECRET` (`npm run gen-secret`), replace it, retry the deployment.

**Renew the GitHub token** — if saving shows *"The GitHub token has expired"*, repeat step 2, replace `GITHUB_TOKEN` in Cloudflare, retry the deployment.

**Undo a change** — Admin → **History** → *Restore this version*. Nothing is ever lost; git keeps every version.

**Custom domain (optional, paid)** — buy a domain, then Pages project → **Custom domains** → add it. Update `NEXT_PUBLIC_SITE_URL`.

**Backups** — your whole site and all content live in the GitHub repo. `git clone` it anywhere to get a full copy.
