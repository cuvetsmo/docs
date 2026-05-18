---
title: SSO Design — VetMock + Hanong + CUVETSMO
description: Design draft for cross-app single sign-on across Palm's three production apps. Status, options, milestones, and risks.
---

**Status:** design draft · no code yet
**Author:** Palm Anuthin · 2026-05-18
**Audience:** Palm + future code maintainer + advisor reviewers

---

## Problem

Palm runs 3 user-facing apps under his control:

| App | Supabase project | Auth method | User scope |
|---|---|---|---|
| VetMock | `vetmock` (Org A) | email + password OR Google | All vet students nationwide |
| Hanong | `hanong` (Org A) | email + password OR Google | Public + ชมรม JohnJud team |
| CUVETSMO | `webcuvetsmo` (Org B) | email + password + Chula email trigger | Chula vet students + faculty + board |

Each app has its own `auth.users` table · its own `profiles` table · no
shared identity. A student using all 3 must:

1. Create 3 separate accounts
2. Remember 3 passwords (or 3 Google OAuth grants)
3. Curate 3 different profiles (name · avatar · nickname)
4. Lose cross-app personalization opportunities

Friction cost: every new student that wants to try a sibling app
re-onboards from zero. That's a network-effect tax we currently pay
on every cross-link.

## Why this matters now

Palm's strategic thesis (2026-05-18):

> "AI will commoditize web development in 2-3 years. The moat is DATA +
> NETWORK + INSTITUTIONAL TRUST that compound over years."

Cross-app SSO is a **Layer 2 (Identity) moat investment**:

- 1 student profile = composite career narrative · "ปี 1 ใช้ VetMock
  มาก · ปี 3 lead ชมรม JohnJud ใน CUVETSMO · ปี 5 รายงาน lost-stray ใน
  Hanong" → AI clone can't replicate the cross-product trajectory
- Once Boom (SMO 69) brings his board into all 3 apps with 1 login,
  the network locks in
- Future apps (Palm has palm-mcp-suite · miracle-investment in pipeline)
  plug into the same identity

## Options analysis

### Option A · Merge all 3 into 1 Supabase project

**Pros:**
- Native auth.users sharing · no glue code
- 1 RLS policy surface
- 1 billing line (when we eventually outgrow free tier)

**Cons:**
- High-risk migration · downtime if done wrong
- Conflates 3 product surfaces · RLS becomes complex (a Hanong row
  must not be readable by a CUVETSMO-only user)
- Loses isolation · a Supabase outage takes down all 3 apps together
- VetMock + Hanong already have years of data · migration cost real

**Verdict:** NO · isolation is a real benefit · don't sacrifice it
just for shared identity.

### Option B · Shared auth-only Supabase project (recommended)

Create a 4th Supabase project: `palm-id` (or `cuvet-id` for branding).

It holds ONLY the auth/identity surface:
- `auth.users` (Supabase Auth managed)
- `identity_profiles` (shared name · avatar · email · Chula-affiliation)
- `app_grants` (which apps the user has granted access to)

Each existing app (vetmock · hanong · webcuvetsmo) becomes an OAuth/OIDC
client of `palm-id`:

```
                   ┌─────────────┐
                   │   palm-id   │  Supabase auth + identity
                   │  (IdP role) │  Hosts shared profile
                   └──────┬──────┘
                          │ OAuth/OIDC
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌─────────┐ ┌─────────┐ ┌─────────────┐
        │ vetmock │ │ hanong  │ │ webcuvetsmo │   Each is RP (relying party)
        └─────────┘ └─────────┘ └─────────────┘   Keeps own app-data DB
```

**Implementation:**
- Stand up `palm-id` Supabase project · enable Google OAuth +
  email/password
- Build a thin "Sign in with CUVETSMO" button (or "Sign in with Palm ID"
  · branding TBD) in each app
- Button redirects to palm-id authorize endpoint · gets JWT · app stores
  it · creates local `profiles` row with palm_id_user_id FK
- App-specific data (vetmock_progress · hanong_reports · cuvetsmo_
  projects) stays in respective project DBs
- Cross-app personalization happens at query time via API: each app's
  edge function reads its own data + makes outbound call to palm-id
  for the user's shared profile

**Pros:**
- 3 apps stay isolated (data + RLS + outage blast radius)
- 1 login UX
- Backward-compatible · existing users get auto-linked on next login
- Adds 4th project but stays in free tier (Org limits)
- Reusable for FUTURE apps (palm-mcp-suite · miracle-investment ·
  cross-faculty federation later)

**Cons:**
- 1 extra hop on every auth → ~200ms slower login (acceptable)
- 4 projects to maintain instead of 3
- Cross-project RLS reasoning requires care · service-role calls
  between projects need explicit auth
- Migration of existing 3-account users needs a "link my accounts"
  flow (~1 week of work)

**Verdict:** RECOMMENDED · best moat/cost ratio.

### Option C · OAuth via existing Google (no Palm IdP)

Use Google as the canonical identity provider. Don't run our own.
Each app reads `email` from Google · matches users by email.

**Pros:**
- Zero new infra
- Already implemented in CUVETSMO (Google OAuth working today)

**Cons:**
- Email-as-key fails if user changes Chula → personal Gmail
- Can't store shared profile data (Google doesn't host it for us)
- Locks us to Google · can't pivot to LINE-login or in-house
- Users without Chula email (alumni · external collaborators) excluded

**Verdict:** NO · too restrictive for the "Thai Vet Student Network"
ambition.

### Option D · Federated via shared user_id table (cheap migration)

Add a `unified_users` table replicated across all 3 projects via
Supabase replication or scheduled sync.

**Pros:**
- No new project · just a table
- Migration is mostly data work

**Cons:**
- Replication adds latency + consistency problems
- No real SSO · user still creates accounts in each app
- Eventually has the same problems as Option C

**Verdict:** Half-measure · doesn't solve the friction.

## Recommended path: Option B

### Milestones (not committed dates · scope estimate)

| Phase | Effort | Deliverable |
|---|---|---|
| **Phase 0 · Spec lock** | 1 week | This doc reviewed + approved by Palm |
| **Phase 1 · palm-id project stand-up** | 2 days | Supabase project · schema · OAuth/OIDC enabled · test redirect |
| **Phase 2 · CUVETSMO RP** | 1 week | "Sign in with Palm ID" button on CUVETSMO · stores palm_id_user_id |
| **Phase 3 · Migration** | 1 week | Existing CUVETSMO users auto-linked via Chula email match · audit row |
| **Phase 4 · VetMock RP** | 1 week | Same for VetMock |
| **Phase 5 · Hanong RP** | 1 week | Same for Hanong |
| **Phase 6 · Cross-app personalization** | 2 weeks | Each app calls palm-id for shared profile · displays "You're also a CUVETSMO board member" hint |

Total: ~6-7 weeks of focused work. Could parallelize Phase 4+5.

### Risks

1. **OAuth state-machine bugs** — token refresh · expired-grant
   handling. Use Supabase's built-in flows · don't custom-build.
2. **Migration data loss** — Chula email might be tied to wrong
   account if duplicated. Pre-flight: audit existing 3 dbs for email
   collisions BEFORE turn-on.
3. **Vendor lock** — palm-id becomes critical SPOF. Mitigate with
   nightly backup · documented restore runbook.
4. **PDPA / consent** — auto-linking accounts requires explicit
   consent per Thai PDPA. Don't link silently · prompt user once
   per app first login.

### What we DON'T do here

- Multi-tenancy for other vet faculties (KU vet · CMU vet · etc.) —
  that's a separate Layer 2 extension (Year 2 thesis · 2027+).
- Single sign-OUT (logout from one = logout from all) — nice-to-have ·
  not critical for MVP.
- Cross-app push notifications — deferred to Layer 3 (Knowledge).

## Open questions

1. **Branding** · "Palm ID" vs "CUVET ID" vs "Vet Network ID" — depends
   on whether we plan to bring in non-Palm-owned apps later. Recommend
   neutral: **"Vet Network ID"** (or just "Vet ID").
2. **Free tier capacity** · 4 projects on Supabase free tier limited to
   2 ACTIVE per Org. Boom's CUVETSMO Org has WebCUVETSMO + Miracle
   Investment occupying 2 slots. palm-id would need either a new Org
   or pay Pro for 1 of the existing ones.
3. **MCP exposure** · should palm-id expose an MCP server (`palm_id_*`
   tools) so Claude/Cursor can query identity across apps? Cool but
   ambitious. Defer.

## Decision log

- 2026-05-18 · drafted · Palm
- _Pending Palm approval before Phase 0 lock_

---

When ready to start Phase 0, open an issue: "SSO Phase 0 · spec lock"
and tag this doc.
