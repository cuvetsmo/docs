# CUVETSMO Docs

Developer wiki **and ecosystem governance hub** for the CUVETSMO platform — published at **[docs.cuvetsmo.com](https://docs.cuvetsmo.com)**. Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## What's here

- **[Ecosystem Map](https://docs.cuvetsmo.com/ecosystem/)** — every repo, subdomain, and its locked canonical role. The no-duplication map. **Read this before building anything new.**
- **Architecture** — system overview, data model, RLS, edge functions, the 16-state approval workflow.
- **SSO design · Developer onboarding · Succession guide · Changelog.**

## Governance source files (machine-readable)

Kept at the repo root and referenced by each ecosystem repo's `CLAUDE.md`:

- [`REPOS.md`](./REPOS.md) — repo registry
- [`DOMAINS.md`](./DOMAINS.md) — domain / subdomain map
- [`NO_DUPLICATION.md`](./NO_DUPLICATION.md) — canonical owners + the single-AI-brain rule

> **The rule:** before creating any repo, subdomain, or feature, name the canonical owner repo and the layer (data / protocol / UI / workflow / product). If you can't, don't build it.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the build locally |

Docs content lives in `src/content/docs/` — each `.md` / `.mdx` becomes a route based on its filename.
