---
title: Changelog
description: Notable changes to the CUVETSMO docs site. New SMO IT leads add entries here when they ship something.
---

> Notable changes to **this docs site**. For changes to the WebCUVETSMO app itself, see [cuvetsmo.com/changelog](https://cuvetsmo.com/changelog).
>
> Format: one entry per shipped change. Newest at top. Future SMO IT leads add entries when polishing the docs.

---

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
