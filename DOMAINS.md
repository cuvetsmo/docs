# CUVETSMO Ecosystem — Domain & Subdomain Map

> Every domain/subdomain → the repo that owns it. Generated 2026-05-29.
> **Rule:** a new subdomain needs an entry here + a repo in `REPOS.md` + a declared layer (data/protocol/UI/workflow/product).

| Domain | Repo | Layer | Notes |
|---|---|---|---|
| **cuvetsmo.com** | webcuvetsmo | Product (core) | Council OS · `/chat` (login-gated AI) · `/ai` (benchmark page) |
| **ai.cuvetsmo.com** | cuvetsmo-ai | AI-UI | Public anonymous chat · proxies to shared `ai-chat` |
| **source.cuvetsmo.com** | cuvetsmo-source | Knowledge-data | Verified knowledge corpus + verification UI |
| **docs.cuvetsmo.com** | cuvetsmo-docs | Docs | Ecosystem docs + governance |
| **vettobe.cuvetsmo.com** | cuvetsmo-vettobe | Product | Vet-to-be internship ops |
| **labs.cuvetsmo.com** | cuvetsmo-labs | Labs (index) | Lab launcher |
| **imaging.cuvetsmo.com** | cuvetsmo-imaging | Labs (product) | Canonical DICOM viewer |
| **web3.cuvetsmo.com** | cuvetsmo-web3 | Labs (edu) | Web3 playground |
| **vetmock.vercel.app** | vet-mock | Product | Study platform (own brand) |
| **hanong.vercel.app** | johnjud | Product | Stray welfare (own brand) |
| _(npm)_ `cuvetsmo-mcp` | cuvetsmo-mcp | Knowledge-access | VetMCP server · `npx cuvetsmo-mcp` |

## Shared backend
- **Supabase project `snmjxaydjykosdzxwjnv` (WebCUVETSMO)** hosts the `ai-chat` edge fn + council DB. ai.cuvetsmo.com + cuvetsmo-mcp's vault tools both call it.
- **Identity policy:** one app may have its own Supabase project, but CUVETSMO-core roles/identity need a central mapping (future `accounts.cuvetsmo.com` — UI/mapping layer only, not a new auth system).

## Deploy reality
- `cuvetsmo` GitHub org has **no Vercel GitHub App** → pushing does NOT auto-deploy. Deploy via `vercel deploy --prod --yes` from the repo. Batch deploys (Hobby = 100/day team-wide).
