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

## 🧠 Single AI brain — model cross-pollination (locked 2026-05-29)
**Goal (Palm):** upgrade the model ONCE and every surface gets *equal intelligence* at the same instant — no per-app model upgrades.

**Rule:** ALL chat/text intelligence flows through the single **`ai-chat` edge fn** (webcuvetsmo). No surface embeds its own chat model. Upgrading ai-chat's `PROVIDERS` (e.g. Typhoon L0) upgrades every surface simultaneously. The `x-vetos-surface` header changes *scope* (public strips internal SMO data) — never the model.

**✅ Already unified (one brain · equal smarts · proven 2026-05-29):**
`cuvetsmo.com/chat` (internal) · `ai.cuvetsmo.com` (public) · `cuvetsmo-mcp` vault tools — all call `ai-chat`. One Typhoon upgrade hit all three at once.

**Allowed exceptions (must be declared, like here):**
- `cuvetsmo-ai/app/local` = on-device WebLLM, **offline mode only** — cannot match the cloud brain by design. Keep, but label it "offline / lighter" in the UI so users know it isn't the full brain.
- Specialized **non-chat** models (e.g. ASR in `/api/transcribe`) may differ.
- ⚠️ **TODO (cuvetsmo-ai):** the TEXT routes `/api/translate` + `/api/extract-soap` currently call a model directly — route them through `ai-chat` so they inherit upgrades too. Then *all text intelligence* is truly one-upgrade-fits-all.

**vet-mock** = no LLM (pure exam/SRS engine) — nothing to unify.
