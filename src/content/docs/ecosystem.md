---
title: Ecosystem Map
description: Every CUVETSMO repo, subdomain, and its locked canonical role — the architecture that prevents duplication across the ecosystem.
---

CUVETSMO is not one app — it is an **ecosystem** of repos and subdomains. This page is the canonical map of what lives where, so nothing gets rebuilt twice.

:::tip[The one rule]
Before creating a repo, subdomain, or feature, name the **canonical owner** repo and the **layer** (data / protocol / UI / workflow / product). If you can't, don't build it.
:::

Machine-readable source files live in the repo root: [`REPOS.md`](https://github.com/cuvetsmo/docs/blob/main/REPOS.md), [`DOMAINS.md`](https://github.com/cuvetsmo/docs/blob/main/DOMAINS.md), [`NO_DUPLICATION.md`](https://github.com/cuvetsmo/docs/blob/main/NO_DUPLICATION.md). Per-repo `CLAUDE.md` files point back here.

## Repo registry

### Core — council operations
| Repo | Live | Layer | Owns (do NOT rebuild elsewhere) |
|---|---|---|---|
| **webcuvetsmo** | cuvetsmo.com | Product (core) | Project approval workflow (CUVET 1.0 form, 16-state, DOCX/PDF), admin CMS, marketplace, LINE notify, roles/auth — and hosts the shared `ai-chat` LLM edge function |
| **cuvetsmo-vettobe** | vettobe.cuvetsmo.com | Product | Vet-to-be internship lookup + per-dept reviews + ทีมหัวปี ops console |
| **cuvetsmo-docs** | docs.cuvetsmo.com | Docs | This ecosystem docs + governance hub |

### Knowledge / AI — 4-layer stack (never collapse or duplicate)
| Repo | Live | Layer | Owns |
|---|---|---|---|
| **cuvetsmo-source** | source.cuvetsmo.com | Knowledge **DATA** | Verified vet knowledge + citation chain + Ed25519 faculty signoff. The only place verified medical facts are authored. |
| **cuvetsmo-mcp** | npm `cuvetsmo-mcp` | Knowledge **ACCESS** | VetMCP server — pubmed / openalex / tjvm / faculty / curriculum / drug / vault tools |
| **webcuvetsmo › `ai-chat`** | edge fn | AI **INFERENCE** | The shared multi-provider LLM brain (Typhoon L0 → Llama → …). The only inference backend. |
| **cuvetsmo-ai** | ai.cuvetsmo.com | AI **UI** | Public anonymous chat front-end (proxies to `ai-chat`). Owns no inference. |

### Labs — experimental
| Repo | Live | Owns |
|---|---|---|
| **cuvetsmo-labs** | labs.cuvetsmo.com | Labs registry + launcher |
| **cuvetsmo-imaging** | imaging.cuvetsmo.com | Canonical DICOM viewer + Norberg/VHS overlays |
| **cuvetsmo-web3** | web3.cuvetsmo.com | Web3 playground (testnet, education only) |

### Standalone products — own brand, may consume source/mcp, not the council site
| Repo | Live | Owns |
|---|---|---|
| **vet-mock** | vetmock.vercel.app | Question-bank (1700+) + exam/SRS engine |
| **hanong** | hanong.vercel.app | Stray-welfare map / profiles / adoption / donation |

## Domain map
| Domain | Repo |
|---|---|
| cuvetsmo.com | webcuvetsmo (`/chat`, `/ai`) |
| ai.cuvetsmo.com | cuvetsmo-ai |
| source.cuvetsmo.com | cuvetsmo-source |
| docs.cuvetsmo.com | cuvetsmo-docs |
| vettobe.cuvetsmo.com | cuvetsmo-vettobe |
| labs / imaging / web3 .cuvetsmo.com | cuvetsmo-labs / -imaging / -web3 |
| vetmock.vercel.app · hanong.vercel.app | vet-mock · hanong |

## No-duplication — canonical owners
Never rebuild these elsewhere:

- **Verified medical knowledge** → cuvetsmo-source (consume its API, never re-author facts)
- **Vet data as agent/MCP tools** → cuvetsmo-mcp
- **LLM inference / chat brain** → `ai-chat` edge fn (no second model path)
- **Project approval / forms / DOCX** → webcuvetsmo (a future generic-forms need = a webcuvetsmo *module*, not a new site)
- **Question-bank + exam/SRS** → vet-mock
- **DICOM viewer + Norberg/VHS** → cuvetsmo-imaging

## AI single-brain rule
All chat/text intelligence flows through the **one `ai-chat` edge function**. Upgrade it once (e.g. swap the primary model) and **every surface gets equal intelligence at the same instant** — cuvetsmo.com/chat, ai.cuvetsmo.com, and the MCP vault tools all call it. The `x-vetos-surface` header changes scope (public strips internal data), never the model.

**Allowed exceptions:** the on-device WebLLM in `cuvetsmo-ai/app/local` (offline mode only) and specialised non-chat models (ASR transcription).
