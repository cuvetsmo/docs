# CUVETSMO — No-Duplication Map

> The single source of truth for **who owns what**. Read this BEFORE building anything new in any ecosystem repo. Generated 2026-05-29 from a direct read of all repos.

## The one rule
> **Before creating a repo, subdomain, or feature, name the canonical owner repo and the layer (data / protocol / UI / workflow / product). If you can't, don't build it.**

## Canonical owners — never rebuild these elsewhere
| Capability | Canonical owner | Everyone else |
|---|---|---|
| Verified medical/vet knowledge (drugs, facts, citations) | **cuvetsmo-source** | CONSUME via its read API — never re-author facts |
| Vet data as agent/MCP tools | **cuvetsmo-mcp** | call the MCP server |
| LLM inference / chat brain | **webcuvetsmo › `ai-chat` edge fn** | call it — no second model path |
| Public chat UI | **cuvetsmo-ai** (ai.cuvetsmo.com) + webcuvetsmo `/chat` (internal) | reuse, don't fork |
| Project approval / forms / DOCX workflow | **webcuvetsmo** | a future `forms.cuvetsmo.com` may do GENERIC forms only (register/feedback/survey) — never the proposal/approval engine |
| Question-bank + exam/SRS engine | **vet-mock** | consume, don't rebuild quizzes |
| DICOM viewer + Norberg/VHS overlays | **cuvetsmo-imaging** | embed/link — don't re-add cornerstone |
| Internship lookup + หัวปี console | **cuvetsmo-vettobe** | — |
| Stray-welfare product | **johnjud (Hanong)** | — |
| Ecosystem docs/governance | **cuvetsmo-docs** | no second docs site |

## ⚠️ CONFIRMED drift to reconcile (found 2026-05-29)
1. **DICOM viewer is in 3 places.** Canonical = `cuvetsmo-imaging`. Duplicated in `cuvetsmo-ai/app/lab` (cornerstone + pdfjs + jspdf + Norberg/VHS) and `vet-mock/src/views/LabView.jsx` (cornerstone + dicom-parser). → Keep it in cuvetsmo-imaging; have the other two **embed/link** imaging.cuvetsmo.com and drop the heavy DICOM deps from their `package.json`.
2. **Second LLM path.** `cuvetsmo-ai/app/local` runs an on-device `@mlc-ai/web-llm` model — contradicts "all inference in the shared `ai-chat` fn." → Decide: keep as an explicit offline-only lab, or remove. Don't let it diverge from the shared brain.
3. **Drug DB in 3 places.** Canonical = `cuvetsmo-source`. Copies in `cuvetsmo-ai/app/drugs` and `cuvetsmo-mcp/src/drugs-seed.ts` ("ported from cuvetsmo-ai"). → MCP + AI should consume cuvetsmo-source's `/api/drugs`, not bundle their own.
4. **Exam/quiz duplication.** Canonical = `vet-mock`. `cuvetsmo-ai/app/study/quiz` duplicates it. → Link to vetmock instead.
5. **cuvetsmo-ai README ≠ code.** README says "UI-only, no inference, anonymous, no persistence" but `app/cases`, `app/soap`, LINE login + push persist data. → Update the README to match reality OR prune the extra surfaces.
6. **cuvetsmo-docs scope gap.** It's a WebCUVETSMO-only dev wiki; it should be the ecosystem-wide governance hub (this file lives here now). Also its GitHub edit-links point at `github.com/cuvetsmo/*` while content lives under `palmzamak2547/WebCUVETSMO` — verify the org repo exists/syncs.

## Cross-pollination note — /chat ↔ ai.cuvetsmo.com
The **model is already shared** (both call `ai-chat`), so the brain upgrades together. The remaining gap is **front-end UX features**:
- ai.cuvetsmo.com HAS (port → webcuvetsmo `/chat`): CommandPalette + slash-commands, ModeChips, ArtifactPanel/ComparisonTable, ExampleGallery, Turnstile anti-abuse, i18n switcher, anonymous access.
- webcuvetsmo `/chat` HAS (port → ai.cuvetsmo.com): Supabase-persisted per-user conversation history + Realtime multi-tab sync, provider/model picker, proposal-drafter pre-fill.
- Port features both ways — but do NOT propagate the drift items above while doing it.
