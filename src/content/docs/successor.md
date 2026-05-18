---
title: Successor Guide
description: Annual handover playbook for WebCUVETSMO — what to inherit, how to onboard the next person, and what NOT to undo.
---

> For the **outgoing** dev to walk the **incoming** dev through everything they're inheriting. Designed to be re-run every year as the SMO board rolls over.
>
> If you're an incoming dev and your predecessor isn't around, this is also your inventory list — work through it top to bottom.

---

## 1. What you are inheriting

A snapshot of every asset that keeps the site alive. Tick each one off during handover.

### 1.1 Code + repo

- [ ] **GitHub repo** `palmzamak2547/WebCUVETSMO` (private) — get added as a collaborator with write access
- [ ] **Default branch protection** on `main` — main is auto-deployed; treat it as production
- [ ] **PR templates / labels** — current convention: `good-first-issue`, `bug`, `feature`, `infra`

### 1.2 Hosting

- [ ] **Vercel project** `webcuvetsmo` — get invited to the Palm Vercel team
  - Hobby tier (currently); 100 deploys/day shared across all projects on this team
  - Auto-deploy from `main`
  - Custom domain `cuvetsmo.com`
- [ ] **DNS** for `cuvetsmo.com` — registered through Vercel; ACME LE certificate auto-renews
  - **Do not** front it with Cloudflare's orange-cloud proxy while a cert is issuing (HTTP-01 race · see Palm's memory `reference_vercel-cert-cf-proxy-race`)

### 1.3 Database / backend

- [ ] **Supabase project** `cuvetsmo` (ref `snmjxaydjykosdzxwjnv`) — get invited as a team member with admin role
  - Free tier currently. Upgrade trigger: > 500 MB DB or > 5 GB storage
  - 6 Edge Functions deployed (see the [Architecture](/architecture/) reference §6)
  - 3 `pg_cron` jobs running (IG harvest)
  - Migrations live under `supabase/migrations/` but are NOT auto-applied — see §6 below

### 1.4 Third-party accounts + tokens

- [ ] **Google Cloud project** for OAuth (Calendar push integration)
  - OAuth consent screen verified
  - Client ID / secret in Supabase Auth provider config + the `google-*` Edge Function secrets
- [ ] **LINE Messaging API channel** for board notifications
  - Channel access token in `notify-status-change` Edge Function secrets
  - Target groupId (currently Palm's DM — see §7)
- [ ] **Sentry project** (optional · `VITE_SENTRY_DSN`)
- [ ] **Lazyweb account + IG token files** in `~/.lazyweb/` (Palm-local · MCP-driven design research)
- [ ] **Figma file** — design system source · Palm's personal account; should be transferred to a CUVETSMO Figma team account during your handover
- [ ] **MCP tokens** in `.mcp.json` — Supabase PAT (`sbp_...`), Vercel PAT (`vcp_...`), Lazyweb bearer, Figma API key

### 1.5 Communication

- [ ] **LINE group "CUVETSMO IT"** — ask current admin to add you
- [ ] **IG `@cuvetsmo`** posting access — handover separately (council, not code)
- [ ] **Notion / Drive workspace** — board contact list, meeting minutes (lives in Google Drive, see `board-history.ts` for the source IDs)

### 1.6 Domain ownership

- [ ] `cuvetsmo.com` registrar — currently registered through Vercel domains
  - Renewal cadence: annual
  - Auto-renew enabled? Check `getDomain` in Vercel dashboard
- [ ] No alternate domains in use; do not move without an ACME-cert renewal plan

---

## 2. Annual cadence — what happens each term

Most of the maintenance burden is seasonal. Plan around the academic calendar.

| Month | What happens | What you do |
|-------|--------------|-------------|
| **June** | New SMO board onboards (nayok 70 takes over from nayok 69) | Update `divisions.chair_id` · `clubs.president_id` · add new `board-history` term · promote new president/VPs/secretaries in `profiles.role` |
| **July–August** | ปฐมนิเทศ + ค่ายน้องใหม่ → busy submit period | Be on-call for project-submit bugs · LINE notify reliability matters most here |
| **September** | New academic year settles · clubs request shop listings | CMS / shop product workflows get used heavily; watch the orders dashboard |
| **October–November** | Midterm slowdown | Catch up on tech debt · run the security advisor (`mcp__supabase-cuvetsmo__get_advisors`) · upgrade dependencies |
| **December** | Maintenance window · content audit | Refresh `faculty_static` · prune stale draft projects · run `npm audit` |
| **January–February** | Open House prep | Public-facing content gets polished · gallery and `/about` are the front door |
| **March** | Exam season · everyone busy | Freeze non-critical pushes |
| **April** | Handover begins · current dev mentors next dev | Start working through this checklist top to bottom |
| **May** | Official transition | Hand over admin tokens · revoke your own access after the transfer is verified |

---

## 3. Onboarding the next person

The handover model that has worked so far:

1. **2-month mentorship overlap** — the incoming dev shadows for two terms (~2 months) before taking over solo
2. **First-PR exercise** — walk them through the [Developer Onboarding](/dev-onboard/) §3; review their PR yourself
3. **Shadow 2–3 issue triages** — they watch you triage real bugs, read the logs, decide the fix, write the patch
4. **Incremental admin access** — give them GitHub write first, then Vercel viewer, then Supabase developer, finally Supabase admin and `.mcp.json` tokens
5. **Final cut-over** — revoke your tokens after a 2-week grace period in case of regressions

Recommended pairing topics:

- Walking through the live `cron.job` rows in Supabase
- Reading an `ig-harvest` log via `mcp__supabase-cuvetsmo__get_logs`
- Triggering an `ai-chat` request and watching the SSE stream in DevTools
- Rolling a Supabase migration end-to-end (write → test in branch project → apply to main)

---

## 4. Decision log

A list of decisions that future devs should not undo without understanding the original constraint. The full log lives at `_meta/decision-log.md` (to be created in 2027; placeholder for now).

Until that file exists, the key decisions are captured inline in the [Architecture](/architecture/) doc §11 and in code comments.

---

## 5. Emergency contacts

| Service | Tier | Support channel |
|---------|------|-----------------|
| Supabase | Free | Discord + status.supabase.com |
| Vercel | Hobby | help@vercel.com (response within ~24h on weekdays) |
| Google OAuth | n/a | Google Cloud Console issue tracker · OAuth verification team is slow (allow 2 weeks) |
| LINE Messaging API | Free | LINE Developers Console · channel-bound support |
| DNS / domain | Vercel-managed | same as Vercel |

### Break-glass access

The following people currently have or have had production admin tokens. **Do not assume any of them are still active** — verify before relying on them in an outage.

- **Palm (อนุทิน ดาน้อย / Anuthin Danoi · Vet 86)** — original maintainer, full admin on everything
- **Boom (nayok SMO 69 · Vet 87)** — council president, NOT a dev; do not give him code admin unless he asks

When transitioning, audit:

- Supabase team members (`Settings → Team`)
- Vercel team members (`Settings → Members`)
- GitHub collaborators (`Settings → Collaborators`)
- Google Cloud IAM (the OAuth project)

Revoke ex-maintainers within 30 days of confirmed transition.

---

## 6. Critical decisions to NOT undo without thought

These are the load-bearing parts of the system. Touch with care.

### 6.1 Supabase RLS policies

Every public table has RLS. Several policies have been refactored 3+ times (see migrations `0003`, `0021`, `0034`, `0036`, `0038`–`0041`) to:

- Fix the missing `WITH CHECK` gotcha on UPDATE policies
- Address Supabase security advisors
- Scope personal-data tables to `authenticated` (not `anon`)

Before changing any policy, run `mcp__supabase-cuvetsmo__get_advisors` to see the current advisor state. Always smoke-test with `curl` from an authenticated user — the Dashboard SQL Editor runs as superuser and bypasses RLS, so passing there means nothing.

### 6.2 The 16-state project workflow

`projects.status` is an enum with 16 values forming a state machine (see the [Architecture](/architecture/) reference §9.2). Adding/removing states ripples into:

- The `notify-status-change` Edge Function (which messages fire on which transitions)
- The `ApprovalQueue` filter logic
- The `approval_steps` audit history
- DOCX export filenames

Prefer extending (e.g. adding a new terminal state) over restructuring.

### 6.3 i18n key conventions

`src/locales/th.json` and `src/locales/en.json` are kept in lockstep. Renaming a key breaks both languages until both files are updated. If you remove a key, grep first to make sure no JSX still references it.

### 6.4 Custom domain DNS

`cuvetsmo.com` is registered through Vercel; the LE cert is issued via HTTP-01. **Do not** put Cloudflare's orange-cloud proxy in front while a cert is being issued or renewed — it breaks the ACME challenge and the cert can stall indefinitely (see Palm's memory `reference_vercel-cert-cf-proxy-race`). Keep DNS-only until the cert is live and verified.

### 6.5 IG harvest function

`ig-harvest` scrapes public Instagram profile pages. Instagram rate-limits aggressive crawlers, and a ban affects every handle we track. The current 3-schedule design (hourly full sweep + 6-hourly per-handle priority for `@cuvetsmo` and `@cuvetography`) was tuned by trial; don't crank the frequency without monitoring. If IG changes its public JSON shape (it has happened twice in 2025), expect the function to need a rewrite.

### 6.6 LINE notification target

The current `groupId` for `notify-status-change` is **Palm's DM**, not the board group. The switch to the board group is pending nayok 69 buy-in. When you flip it:

1. Get the new groupId by sending any message in the target LINE group and reading the webhook payload
2. Update the `LINE_TARGET_ID` secret on the Edge Function (`npx supabase secrets set LINE_TARGET_ID=...`)
3. Test by triggering one status change and confirming the message lands

### 6.7 Self-promotion lockdown trigger

`profiles_guard_role` blocks any UPDATE to `profiles.role` unless the caller is already an admin. The bootstrap path for the first admin is documented in `CONTRIBUTING.md`. **Never disable the trigger and forget to re-enable it** — without it, any logged-in user can promote themselves to admin via a crafted REST request.

### 6.8 Migrations are not auto-applied

`supabase/migrations/*.sql` files are **not** run automatically when you push. After committing a new migration, you must:

- Either paste it into the Supabase Dashboard SQL editor, or
- Run `mcp__supabase-cuvetsmo__apply_migration` (preferred — gets logged), or
- Run `npx supabase db push` after linking the project (if you have CLI auth)

Skipping this step means the frontend will reference a column that doesn't exist in production. Always verify in `mcp__supabase-cuvetsmo__list_migrations` after deploy.

---

## 7. The "if Palm gets hit by a bus" recovery list

If you are the next maintainer and Palm is unreachable, here is the minimum set of accesses you need to keep the site alive:

1. **Supabase team admin** on project `snmjxaydjykosdzxwjnv` — without this you cannot fix DB issues
2. **Vercel team admin** — without this you cannot redeploy or rotate env vars
3. **GitHub admin** on `palmzamak2547/WebCUVETSMO` — without this you cannot merge PRs
4. **Domain registrar access** at Vercel for `cuvetsmo.com` — without this the domain can lapse
5. **LINE channel access token** — copy from `notify-status-change` secrets to your local password manager
6. **Google OAuth client secret** — copy from the Google Cloud Console to your password manager

If any of these are missing on the day of takeover, your first task is to recover them. The Vercel and Supabase teams will both honor a domain-ownership challenge (DNS TXT record) for account recovery if Palm is truly unreachable.

---

## 8. Where to go next

- Day-to-day code workflows: [Developer Onboarding](/dev-onboard/)
- Deeper architecture reference: [Architecture](/architecture/)
- Cross-app SSO design draft: [SSO Design](/architecture-sso/)
- Incident runbook + cost monitoring: see `docs/RUNBOOK.md` and `docs/COST_MONITORING.md` in the source repo
- Non-technical handover (for new nayok / กก.สโม): `HANDOFF.md` in the source repo
