# CUVETSMO Ecosystem — Repo Registry

> Canonical map of every repo + its **locked role**. Generated 2026-05-29 by reading each repo's README/config directly.
> **Rule:** before creating ANY new repo or subdomain, add a row here first and state whether it is **data / protocol / UI / workflow / product**. If you can't, don't create it.

## Core — council operations
| Repo | Live | Layer | Owns (do NOT rebuild elsewhere) |
|---|---|---|---|
| **webcuvetsmo** | cuvetsmo.com | Product (core) | โครงการ approval workflow (CUVET 1.0 form · 16-state ApprovalStatus · DOCX/PDF gen · role-routed review queue), admin CMS, marketplace, LINE notify, roles/auth — **AND hosts the shared `ai-chat` LLM edge fn for the whole ecosystem** |
| **cuvetsmo-vettobe** | vettobe.cuvetsmo.com | Product | Vet-to-be internship lookup + per-dept/per-year reviews + ทีมหัวปี ops console (replaces claude.ai + Excel) |
| **cuvetsmo-docs** | docs.cuvetsmo.com | Docs | Ecosystem docs + **governance (this registry, DOMAINS.md, NO_DUPLICATION.md)**. No other repo stands up its own docs site. |

## Knowledge / AI — 4-layer stack (DO NOT collapse or duplicate)
| Repo | Live | Layer | Owns |
|---|---|---|---|
| **cuvetsmo-source** | source.cuvetsmo.com | Knowledge **DATA** | Verified vet knowledge corpus + SHA-256 citation chain + Ed25519 faculty signoff + ontology (ATC/RxNorm/ICD-11). The ONLY place verified medical facts are authored. (43 drugs · 132 citations) |
| **cuvetsmo-mcp** | npm `cuvetsmo-mcp` | Knowledge **ACCESS** | VetMCP server — 7 tools (pubmed · openalex · tjvm · faculty_lookup · curriculum_search · drug_lookup · vault_retrieve). The ONLY place vet data is exposed as agent/MCP tools. |
| **webcuvetsmo › `ai-chat`** | (Supabase edge fn) | AI **INFERENCE** | The shared multi-provider LLM brain: L0 Typhoon v2.5 30B → Groq Llama 3.3 70B → Cerebras → SambaNova → OpenRouter + OpenAlex tool-calling + SSE. The ONLY inference backend. |
| **cuvetsmo-ai** | ai.cuvetsmo.com | AI **UI** | Public anonymous chat FRONT-END only (proxies to `ai-chat` via /api/chat, `x-vetos-surface: cuvetsmo-public`). Owns NO inference. |

> Both **cuvetsmo.com/chat** (webcuvetsmo `src/pages/Chat.tsx`, login-gated) and **ai.cuvetsmo.com** (cuvetsmo-ai, anonymous) call the SAME `ai-chat` edge fn → any model upgrade benefits both at once.

## Labs — experimental
| Repo | Live | Layer | Owns |
|---|---|---|---|
| **cuvetsmo-labs** | labs.cuvetsmo.com | Labs (index) | Labs registry + launcher (`lib/labs.ts`). Not a lab itself. |
| **cuvetsmo-imaging** | imaging.cuvetsmo.com | Labs (product) | **Canonical DICOM viewer** + Norberg/VHS overlays + image occlusion |
| **cuvetsmo-web3** | web3.cuvetsmo.com | Labs (edu) | Web3 playground (Base Sepolia testnet) — education only |

## Standalone products — own brand · may consume source/mcp · NOT the council site
| Repo | Live | Layer | Owns |
|---|---|---|---|
| **vet-mock** | vetmock.vercel.app | Product | The vet question-bank (1700+ Qs) + exam/SRS engine (MCQ/TF/Fill/Match · Quick/Exam/SM-2 · analytics · groups) |
| **johnjud (Hanong)** | hanong.vercel.app | Product | Stray-welfare: map + per-animal profiles + sighting reports + adoption + transparent donation ledger |

## Personal — separate from CUVETSMO (keep the 3-tier identity)
`anuthindanoi-hub` (Tier-1 canonical identity) · `palmdanoi-hub` (Tier-2 lifestyle) · `kcraft-hub` (Tier-3 Minecraft) · `palm-trading-lab` (crypto · 100% separate) · `mycos-vault` (private second brain) · `palms-vet-research` (research portfolio)
