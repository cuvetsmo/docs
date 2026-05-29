# CLAUDE.md — cuvetsmo-docs

## 🧭 Ecosystem role (canonical · locked 2026-05-29)
- **Role:** Ecosystem governance + developer documentation hub (Starlight) — SHOULD own REPOS / DOMAINS / NO_DUPLICATION / ARCHITECTURE across all CUVETSMO repos; today scoped to WebCUVETSMO dev docs only.
- **Layer:** Docs
- **Live:** https://docs.cuvetsmo.com
- **This repo OWNS (do not rebuild elsewhere):** The cross-repo documentation + governance layer — architecture reference, SSO design, dev onboarding, succession guide, and the canonical NO_DUPLICATION / REPOS / DOMAINS registry. Other repos must NOT spin up their own docs sites; contribute pages here instead.

### ⛔ No-duplication rule
Before building anything new in this repo, check `cuvetsmo-docs/NO_DUPLICATION.md`. Do NOT rebuild: knowledge backend (→ cuvetsmo-source), MCP/tool access (→ cuvetsmo-mcp), AI inference (→ shared ai-chat edge fn in webcuvetsmo), forms/approval workflow (→ webcuvetsmo), exam engine (→ vet-mock), DICOM viewer (→ cuvetsmo-imaging) — unless THIS repo is the canonical owner above.

### Rule for any new repo/subdomain
Must declare: (1) canonical source repo, (2) whether it is data / protocol / UI / workflow / product. If you cannot answer both, do not create it.
