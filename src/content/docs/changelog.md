---
title: Changelog
description: Notable changes to the CUVETSMO docs site. New SMO IT leads add entries here when they ship something.
---

> Notable changes to **this docs site**. For changes to the WebCUVETSMO app itself, see [cuvetsmo.com/changelog](https://cuvetsmo.com/changelog).
>
> Format: one entry per shipped change. Newest at top. Future SMO IT leads add entries when polishing the docs.

---

## 2026-05-24 · v0.3.0 — Audit hardening pass synced to docs

Tracks the same-day production audit hardening pass on the WebCUVETSMO app. Pure documentation update — every code change ships in the app itself, this entry reflects what readers should know.

- **Architecture · data model** — added 5 new tables: `internal_secrets` (locked-down key/value · powers the CRON_SECRET gate), `ai_chat_usage_logs` (per-call token + provider observability), `ai_chat_intent_logs` (classifier audit trail · `surface` column distinguishes internal vs `ai.cuvetsmo.com` public), `ai_chat_rate_limit_buckets` (rolling 24h enforcement), `short_link_clicks` (campaign analytics).
- **Architecture · storage** — `project-documents` flipped to **private** (was public). Receipts and signed letters now served via 1-hour signed URLs from `ProjectDetail.tsx`. `shop-payment-proofs` (5 MB · image+PDF) and `clubs-logos` (2 MB · image-only) now have explicit `file_size_limit` + `allowed_mime_types`.
- **Architecture · cron** — 7 scheduled jobs now (was 3). Added 4 daily retention sweeps at 04:15/20/25/30 UTC for `ai_chat_intent_logs` (90d), `ai_chat_usage_logs` (90d), `ai_chat_rate_limit_buckets` (1d), `short_link_clicks` (90d). `audit_log` intentionally has no retention.
- **Architecture · edge functions** — `ig-harvest` now requires `x-cron-secret` header in addition to the anon JWT; pg_cron bakes the 64-char hex secret in via `format()` at schedule-time. Fail-CLOSED on missing secret (503), timing-safe header compare.
- **Successor guide** — `scripts/deploy-edge-function.mjs` documented as the generic deploy helper that supersedes per-function scripts. PAT lookup chain: `--token` → env vars → `.mcp.json` (with a loud warning when the file fallback fires).

## 2026-05-19 · v0.2.0 — Full-option polish

- **Mermaid diagrams** now render as proper SVG on architecture pages (client-side render via mermaid.js, ~80 KB loaded only on pages that have a diagram).
- **New hero landing page** with Card grid linking to each main doc.
- **Site footer** with project + tools + contact links across all pages.
- **Open Graph image** so link previews on LINE, Discord, Slack, Messenger show a real branded card instead of the raw URL.
- **Custom 404 page** with bilingual hint copy + navigation links.
- **Changelog page** (this one).
- **Theme polish** — sky-700 brand palette tuned for both light and dark, Sarabun + Noto Sans Thai font stack.

## 2026-05-19 · v0.1.0 — Initial public docs site

- Astro Starlight project initialized.
- Four core docs imported from the WebCUVETSMO repo: `architecture.md`, `architecture-sso.md`, `dev-onboard.md`, `successor.md`.
- Deployed on Cloudflare Pages via Workers Static Assets binding (pure static, no SSR adapter).
- Custom domain `docs.cuvetsmo.com` live.
- Pagefind search built-in.
- Edit-page links wired to the [cuvetsmo/docs](https://github.com/cuvetsmo/docs) repo.

---

## How to add a new entry

When you ship a noticeable change to the docs site (new section, design refresh, navigation change, etc.):

1. Bump the date heading at the top with today's date.
2. Add a one-line bullet describing what changed from the reader's perspective.
3. Skip mentioning internal-only refactors that don't affect the reader.
4. Commit with a message like `docs(changelog): note <thing>`.

Audience for this page: future contributors and curious visitors who want to know "what's new since I last looked." Keep entries short and human.
