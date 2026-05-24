---
title: Developer Onboarding
description: First-hour guide to WebCUVETSMO — clone, run, ship your first PR. For Vet 87/88/89 successors and external contributors.
---

> Welcome. This guide gets you from zero to "first PR merged" in about 60 minutes.
>
> Audience: any incoming contributor — Vet 87 / 88 / 89 students taking over from Palm, or external open-source devs.

---

## 1. Pre-requisites

| Tool | Minimum | How to get it |
|------|---------|---------------|
| Node.js | 18.x · 20.x · or 22.x LTS | https://nodejs.org/ (pick LTS) |
| npm | bundled with Node | — |
| git | 2.40+ | https://git-scm.com/ |
| Editor | VS Code or Cursor (recommended · MCP-aware) | https://code.visualstudio.com/ or https://cursor.com/ |
| Supabase account | free tier | https://supabase.com/ — ask Palm to invite you as a team member on the `cuvetsmo` project |
| GitHub access | read at minimum · write for PRs | ask Palm to add you as a collaborator on `palmzamak2547/WebCUVETSMO` |

Optional but useful:

- **Supabase CLI** — only needed if you want to deploy Edge Functions or pull schema diffs. `npx supabase ...` works without a global install.
- **Playwright browsers** — `npx playwright install chromium` if you plan to run smoke tests locally.

---

## 2. Clone and run

```bash
git clone https://github.com/palmzamak2547/WebCUVETSMO.git
cd WebCUVETSMO
npm install
cp .env.example .env.local
# Open .env.local in your editor and paste the two values from Palm.
# (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY · both are public-safe.)
npm run dev
```

Visit `http://localhost:5173`. Vite picks the next free port if 5173 is busy — check the terminal output.

You should see the home page. If `<ProtectedRoute>` is asking you to "set Supabase env vars", your `.env.local` was not loaded — restart `npm run dev`.

### Sign in

The site only accepts `@chula.ac.th` and `@student.chula.ac.th` emails (enforced at three layers: client, Supabase Auth, DB trigger). Use your real Chula email — sign-up will auto-create a `member` profile. To get a higher role for testing, ask Palm or an existing admin to promote you from `/admin → Users`.

---

## 3. Your first feature · "add yourself to the board history"

Goal: get one PR merged so you understand the full loop — clone → edit → build → push → review. Should take 30–60 minutes.

### Step 1 · Pick a file

Open `src/data/board-history.ts`. This file holds the canonical roster for past SMO terms. Find the current term (SMO 69 at time of writing) and the `chairs` array.

### Step 2 · Add an entry

Add one entry for yourself with the fields the `BoardMember` type requires:

```ts
{
  position: 'ฝ่าย IT (ผู้ช่วย Palm)',
  cluster: 'operations',
  fullName: 'YOUR_FULL_NAME',
  nickname: 'YOUR_NICKNAME',
  vetCohort: 87,
}
```

> Privacy contract (see the file header): we store position / full name / nickname / cohort only. **Never add phone numbers, student IDs, or email addresses to this file.** Contact info lives in the Drive contact list, not the repo.

### Step 3 · Verify it renders

```bash
npm run dev
```

Visit `/about/board` and confirm your entry is on the SMO 69 card.

### Step 4 · Type-check + build

```bash
npx tsc --noEmit   # TypeScript check · must be clean
npm run build      # production bundle in dist/
```

Both should pass. If `tsc` complains about a missing field, you probably left out a non-optional property on `BoardMember`.

### Step 5 · Commit and push

```bash
git checkout -b feat/add-myself-to-board
git status -s
# Stage SPECIFIC files (NEVER `git add -A`):
git add src/data/board-history.ts
git commit -m "add YOUR_NICKNAME to SMO 69 board (IT)"
git push -u origin feat/add-myself-to-board
```

Open a PR on GitHub. Palm or another admin reviews, merges, and Vercel auto-deploys within ~60 seconds.

That's it — you're in.

---

## 4. Code style and conventions

### 4.1 Internationalization (i18n)

Two locales currently live: `src/locales/th.json` (default) and `src/locales/en.json`. When you add user-facing text:

- Add a key to **both** files
- Use `useTranslation()` from `react-i18next` to consume it
- Keys are nested by feature area (e.g. `submit.section3.budget.label`)
- Don't hardcode Thai strings in JSX once the surrounding component is i18n-aware

### 4.2 Tailwind palette

Brand colors live in `tailwind.config.js`:

- `stone-*` for neutrals (the site's whole grey scale)
- `smo-*` for the brand accent (sky-blue derived from the SMO logo)

Don't introduce new color tokens without asking — the palette is meant to be the single source of truth for a global rebrand.

### 4.3 Component patterns

- All pages are lazy-loaded · keep one page per file under `src/pages/`
- Shared UI in `src/components/`
- Auth-gated pages wrap with `<ProtectedRoute>` (see `src/components/ProtectedRoute.tsx`)
- Role-gated pages add `roles={[...]}` or use `BOARD_ROLES` / `APPROVAL_ROLES` from the same module

### 4.4 Middle-dot (·) usage

The codebase uses `·` (middle dot, U+00B7) as a soft separator in copy. Keep it consistent — `Login · Sign up` rather than `Login | Sign up` or `Login / Sign up`. Search the locales for examples.

### 4.5 Git hygiene

- **Never `git add -A` or `git add .`.** Stage specific files by name. Untracked launch kits, scratch folders, and `.env*` files are common in worktrees.
- Imperative commit subjects under 70 chars (`add export button`, `fix RLS for owner submit`)
- Body explains *why* not *what* — the diff already shows what
- Co-author tag is appreciated:
  ```
  Co-Authored-By: Your Name <you@example.com>
  ```

### 4.6 Avoid burst-pushes

Vercel Hobby tier has a 100 deploys/day quota across the **whole team account** (shared with VetMock, Hanong, miracle-investment). One feature = one deploy, not ten. Batch your commits before pushing if you're iterating.

---

## 5. Pre-push checklist

Before `git push` on any branch that will trigger CI:

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes (Vite ES2018 target — older browsers will silently break if you use newer syntax)
- [ ] If you touched a route, you tested both the logged-out and logged-in paths
- [ ] If you touched RLS or migrations, you `curl`-smoked from an authenticated user (not the dashboard SQL editor — that bypasses RLS as superuser)
- [ ] If you added a dependency, you justified the bundle delta (initial chunk target: < 1 MB gzip)
- [ ] (Optional but recommended) `npm run test:smoke` — runs Playwright e2e

### Smoke tests

```bash
npm run test:smoke
```

This runs the Playwright suite in `e2e/`. The Playwright config spins up its own Vite server on port 5273 (so it does NOT collide with `npm run dev` on 5173). If you don't have Playwright browsers installed, run `npx playwright install chromium` once.

Current baseline: **19 passed / 4 skipped** in ~37s. The 4 skips are the `/chat intent routing` tests that need an authenticated session.

To run the 4 authenticated `/chat` tests locally:

```bash
# 1. Sign in manually at http://localhost:5173/login (magic link is easiest)
# 2. Capture the storage state
npx playwright codegen --save-storage=auth.json http://localhost:5173
# 3. Run the full suite with the captured state
CHAT_AUTH_STATE=$PWD/auth.json npm run test:smoke
```

`auth.json` is gitignored. Don't commit it.

---

## 6. Where things live

```
WebCUVETSMO/
├── public/                  static assets · forms/ holds official CUVET DOCX
├── src/
│   ├── App.tsx              every route declared here
│   ├── main.tsx             React root + service worker register
│   ├── pages/               one file per route
│   ├── components/          shared UI (Header · Footer · ProtectedRoute · ErrorBoundary)
│   ├── lib/                 auth · supabase client · docx generators · form schema
│   ├── locales/             th.json · en.json
│   └── data/                static seed data (board-history · newsPosts · partners)
├── supabase/
│   ├── migrations/          numbered SQL files · run in order
│   └── functions/           Edge Functions (Deno)
├── docs/                    you are here
├── e2e/                     Playwright smoke tests
├── scripts/                 one-off helpers (seo-ping · google-indexing · deploy-edge-function)
├── .mcp.json                MCP server config (gitignored when it has tokens)
├── tailwind.config.js       brand palette
├── vite.config.ts           build + PWA config
└── vercel.json              SPA rewrites
```

For the deeper "why" behind each choice, see the [Architecture](/architecture/) reference.

---

## 7. Who to ask

| Topic | Who | How |
|-------|-----|-----|
| General code questions | Palm (while transitioning) | GitHub issue or DM on IG |
| Council / non-code questions | IG `@cuvetsmo` | DM |
| Faculty contacts | ผู้ช่วยคณบดีฝ่ายกิจการนิสิต CUVET | email via Palm bridge |
| Production incident (site down) | Palm + current SMO IT lead | LINE group "CUVETSMO IT" (ask to be added) |
| Supabase or Vercel billing | Palm (until handover complete) | direct message |

Useful runbooks live in the source repo alongside this guide: `docs/RUNBOOK.md` and `docs/COST_MONITORING.md`.

---

## 8. Next steps

Once your first PR is merged:

1. Skim the [Architecture](/architecture/) doc end-to-end — at least the data model and the routes table
2. Read `CONTRIBUTING.md` for the more advanced workflows (DB migrations, Edge Function deploys, secret rotation)
3. Pick an issue tagged `good-first-issue` on GitHub
4. If you're being onboarded as the next maintainer, read the [Successor Guide](/successor/) next
