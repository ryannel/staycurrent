## Schema & Data Design

The `topics/<slug>/` tree is the entire schema — there is no database anywhere in the
architecture ([ADR 0002](../../../architecture/decisions/0002-git-filesystem-as-only-store.md)).
Every store below is a file or file-group under one topic's directory, parsed and written
exclusively by `@staycurrent/core` (`core/`); `workbench/cli.mjs` and `services/site` never
touch `topics/` directly. This document specifies the on-disk contract at implementation
fidelity — precisely enough to build content-core's parser, publish gate, and content
loading API from it without further clarification. It extends, not duplicates, the
conceptual entities already committed in `docs/architecture/domain/` (`topic.md`,
`version.md`, `research-run.md`): those files own *what a topic/version/research-run is*
and its invariants; this file owns the exact bytes on disk.

### Directory Layout

```
<repo root>/
├── core/                          ← @staycurrent/core: TopicFrontmatter, ChangelogEntry,
│                                     VersionSnapshot, ProvenanceRecord, GateResult; the publish
│                                     gate, the content loading API, RSS generation
├── services/site/                 ← the static reader surface (Next.js, output: 'export')
│   └── public/                    ← content-core writes generated artifacts here; `next
│       │                            build` copies them into the static export unchanged
│       ├── rss.xml                ← GENERATED at build from changelog entries, verbatim —
│       │                            gitignored; not a store, purely derived from topics/
│       └── skills/                ← GENERATED skill payloads — gitignored
│           ├── <slug>.zip         ← current-version install archive; served at
│           │                         /skills/<slug>.zip — the target of the canonical
│           │                         install one-liner
│           └── <slug>/            ← browsable payload tree of the current skill
│               ├── SKILL.md         (mirrors the live topics/<slug>/skill/ tree)
│               ├── references/
│               └── v/
│                   ├── <n>/       ← archived per-version browsable trees
│                   └── <n>.zip    ← archived per-version install archives
├── workbench/
│   └── cli.mjs                    ← operator CLI entry point: status | create | convene |
│                                     gate | cut | log | discard
├── topics/                        ← PUBLISHED TRUTH — the only data store (ADR 0002)
│   └── <slug>/
│       ├── article.md             ← live article; frontmatter IS the topic state
│       ├── changelog.md           ← append-only timeline, newest `## vN` entry first
│       ├── research-log.md        ← every resolved run recorded, cut or no-cut
│       ├── skill/
│       │   ├── SKILL.md           ← live companion skill; article_version binds to the
│       │   │                        live article's version
│       │   └── references/*.md    ← depth files, loaded per task
│       └── versions/
│           └── v1/ … vN/          ← immutable snapshots, one directory per cut
│               ├── article.md     ← frozen article; frontmatter is version + cut only
│               ├── skill/         ← frozen skill; byte-identical to live skill/ when N
│               │                    equals the live article's version
│               └── provenance.md  ← Sources + Synthesis for this cut's claims
├── .staycurrent/
│   ├── sessions/
│   │   └── <slug>.md              ← QUARANTINE — in-flight session state; gitignored;
│   │                                 owned by workbench, never published truth
│   └── staged/
│       └── <slug>/                ← the staged prospective tree the cut gate validates;
│                                     basename == slug; gitignored; seeded by core
│                                     (stageCut/createTopic via the CLI), authored into
│                                     by the research/writer skill — quarantine is
│                                     workbench-writable; the core-only mutation rule
│                                     binds topics/ specifically — read by the gate,
│                                     cleared after a successful cut
└── site.config.json               ← instance-specific site config (title, nav, base URL)
                                      that keeps core/, services/site/, and the workbench
                                      skills instance-agnostic (architecture index §4,
                                      engine/instance boundary); no topic data lives here
```

`services/site/public/*` and `.staycurrent/` are the two things under this tree that are
*not* part of the schema proper: the first is a pure, deterministic derivation of
`topics/` (rebuilt every time, never hand-edited, never git-tracked); the second —
`sessions/` and `staged/` alike — is explicitly quarantined working state the design
system carves out as the one sanctioned exception to "everything published is
git-versioned." Both are gitignored for the same underlying reason — neither is allowed
to be a second source of truth.

---

#### `topics/<slug>/article.md` — Topic Frontmatter & Article Body (live)

**Owned by:** `@staycurrent/core` (`core/`) — the only code that mutates it, and only via
`workbench/cli.mjs`'s stage → gate → commit action contract.

**Purpose:** The live, current-truth document for a topic. Its frontmatter is the on-disk
shape of content-core's `TopicFrontmatter` type and *is* the topic's state — there is no
parallel registry, so status can never drift from the thing that states it
([ADR 0002](../../../architecture/decisions/0002-git-filesystem-as-only-store.md); domain
reference below).

**Frontmatter** — transcribed verbatim from the design system's topic-state schema:

```yaml
---
topic: observability            # kebab-case slug == directory name, immutable
title: Observability
stance: >                       # one-sentence committed position; the site's card one-liner
  Instrument for questions you cannot predict; three pillars is a
  vendor framing, not an architecture.
version: 5                      # positive integer, monotonic
status: current                 # current | in-research — nothing else, ever
cadence: 90d                    # research interval: <int>d
last_researched: 2026-06-12     # ISO date, updated by every run, cut or no-cut
---
```

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `topic` | string, kebab-case | Must equal the parent directory name (`topics/<topic>/`); immutable once created — the reconciliation check greps for drift. |
| `title` | string, non-blank | Display title; must carry visible text — empty or whitespace-only fails validation (change-proposal-6). |
| `stance` | string, one sentence, non-blank | The card one-liner on the home library; must carry visible text — empty or whitespace-only fails validation (change-proposal-6). Distinct from the article body's stance callout (≤ 3 sentences, see Document anatomy). |
| `version` | integer | Positive, monotonic; increments only at a cut; must equal the highest-numbered `versions/vN/` directory present. |
| `status` | enum: `current` \| `in-research` | The only two stored values, ever. `due` is never one of them — it is derived at read time as `last_researched + cadence < today`. |
| `cadence` | string, pattern `<int>d` | Research interval in days, e.g. `90d`. |
| `last_researched` | ISO date | Updated on **every** resolved run, cut or no-cut. |

**Document anatomy (body):** Frontmatter → `# Title` (H1) → stance callout (the committed
position, restated, ≤ 3 sentences) → the essay: `##` sections, at most two heading levels
below the H1 (so `##`/`###` only — no `####` inside an article body). The article is
always the current truth: no "updated:" annotations in prose, no strikethrough history —
history lives in `versions/`. Diagrams are fenced ` ```mermaid ` blocks, themed at render
time; the fenced source stays readable with JavaScript off.

**Lifecycle states:**

| State | Meaning | Transitions to |
|-------|---------|----------------|
| `current` | The live truth; no run in flight. Set at topic creation (v1 cut) and on every run's resolution. | `in-research` — operator convenes a run. |
| `in-research` | A session file exists at `.staycurrent/sessions/<slug>.md`; a run is in flight. | `current` — the run resolves, cut or no-cut. |

**Design rationale:** Frontmatter-as-state (rather than a separate status table or index)
is the load-bearing choice this whole tree is built around: any stored derived field
(`due`, for instance) could drift from `cadence`/`last_researched` the moment a run
resolves without updating it. Deriving `due` at read time, and storing only the two
mutually exclusive `status` values, is the only design that keeps "there is exactly one
current stance per topic, and it is always the thing readers, the skill, and the operator
all see" true without a reconciliation job running anywhere.

**Domain reference:** `docs/architecture/domain/topic.md` — this bet adds the verbatim
on-disk frontmatter shape, the file path binding (`topics/<slug>/article.md`), the article
body's document anatomy, and the cross-file constraint that `version` must match the
highest `versions/vN/` directory number.

---

#### `topics/<slug>/versions/vN/article.md` — Version Snapshot Frontmatter (frozen)

**Owned by:** `@staycurrent/core` (`core/`) — written once, atomically, as part of a cut;
never rewritten afterward.

**Purpose:** An immutable snapshot of the article at one stance revision. Its frontmatter
is the on-disk shape of content-core's `VersionSnapshot` type.

**Frontmatter** — identical shape to the live article minus the volatile fields, and **no
`status` field**:

```yaml
---
version: 5
cut: 2026-06-12
---
```

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `version` | integer | Matches the `versions/vN/` directory number and, at cut time, the live article's `version`. |
| `cut` | ISO date | The date this snapshot was written; immutable thereafter. |

**Document anatomy (body):** Same essay anatomy as the live article at the moment it was
cut — frozen, not re-derived. No live cross-references to later versions are added
retroactively.

**Lifecycle states:** N/A — a version snapshot has no state machine; it is written once
and nothing about it mutates afterward. `current` and `superseded` are **not** states this
file holds: they are read-time labels derived by comparing this snapshot's `N` to the live
article's `version` field, computed by the content loading API and by
`/[topic]/v/[n]`'s render logic, never stored on the snapshot itself.

**Design rationale:** Carrying no `status` field is deliberate, not an omission. A `status`
field on a frozen snapshot would create a second place "current" could be recorded, and it
would need rewriting on every later cut of the same topic — an immutable file that must be
rewritten on someone else's cut is not actually immutable. Comparing `N` against the live
`version` at read time is the only design that keeps every snapshot genuinely write-once;
it is also why `/[topic]/v/[n]` for the current version redirects to `/[topic]` rather than
rendering a second "current" page — the live article is a version's only current
rendering, so the archived banner on version pages stays unconditionally true.

**Domain reference:** `docs/architecture/domain/version.md` — this bet adds the verbatim
on-disk frontmatter shape and restates the current/superseded derivation as the concrete
rule the loading API and the site's render logic implement.

---

#### `topics/<slug>/skill/SKILL.md` (live) & `topics/<slug>/versions/vN/skill/SKILL.md` (frozen) — Companion Skill Frontmatter & Binding

**Owned by:** `@staycurrent/core` (`core/`) — the file is written as part of the atomic
cut; its prose is authored through the workbench's writer skill, but content-core executes
the write and the gate check.

**Purpose:** The distributable companion skill's entry point. Its frontmatter binds the
skill to the exact article stance it renders, so the pair can never drift because both cut
together (design system, Skill Anatomy).

**Frontmatter** — skill-creator conventions plus the one house field:

```yaml
---
name: databases
description: >
  Use when choosing or evaluating a database technology — relational,
  document, key-value, columnar, vector, or graph — or when reviewing
  a schema or storage decision for fit against workload shape.
article_version: 5
---
```

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string, kebab-case | Equals the topic slug; used for install naming and routing. |
| `description` | string | Written as routing triggers — when an agent should reach for this skill — not a summary (skill-creator convention). |
| `article_version` | integer | The article stance revision this skill renders. For the **live** `skill/`, must equal the live `article.md`'s `version`. For a **frozen** snapshot's `skill/`, must equal that snapshot's own `N`. |

**Document anatomy (body):** Mirrors the article's shape at skill-creator depth: the
stance callout first, principles as imperatives an agent can execute, named
anti-patterns, then pointers into `references/`. The article itself is not bundled — the
skill is the executable rendering, the site is the readable one.

**Lifecycle states:** N/A — no independent state. A skill's only stored fact is which
article version it renders (`article_version`); there is no separate skill-versioning
state to reconcile (design system, Versioning & Evolution).

**Design rationale:** `article_version` agreement is a necessary but not sufficient check
— two different `skill/` file trees could carry the same `article_version` integer by
mistake (a stale `references/` file left over from a hand-edit, for instance). The gate's
real enforcement is the stronger, byte-identity check on the live pair: for the current
version, `topics/<slug>/skill/` must be byte-identical to
`topics/<slug>/versions/vN/skill/`. The integer field is what a reader or an adopter's
agent checks at a glance; the byte comparison is what content-core actually trusts.

**Domain reference:** `docs/architecture/domain/version.md` (its `skill/` field row and
the byte-identical-skill invariant) — this bet adds the full `SKILL.md` frontmatter field
table, which no domain stub spells out today.

---

#### `.staycurrent/sessions/<slug>.md` — Session State (quarantine)

**Owned by:** workbench (`workbench/cli.mjs` + the research-run skill) — content-core
never reads or writes this path. It is workbench-private working state that results in
exactly one call into content-core (`cut` or `log`) at resolution.

**Purpose:** The in-flight state of one convened research run, entirely outside
`topics/`, so a failed or interrupted run can never leave a trace in published content.

**Frontmatter** — transcribed verbatim from the design system's session-state schema:

```yaml
---
topic: observability
phase: researching            # researching | arguing | deciding
opened: 2026-07-04
against_version: 5            # the version this run researches against
---
```

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `topic` | string | The topic slug this run researches; matches a `topics/<slug>/` directory. |
| `phase` | enum: `researching` \| `arguing` \| `deciding` | Current phase; advances only forward within one run. |
| `opened` | ISO date | Date the session file was created. |
| `against_version` | integer | The version this run researches against; fixed at convene time — does not change even if the topic's live `version` somehow changed mid-run. |

**Document anatomy (body):** Sections accumulate as the run progresses and are never
removed, so any phase is re-enterable by reading the file alone:

- `## Findings` — written during `researching`; the ranked digest table (finding, source, consequence for the stance).
- `## Argument` — appended during `arguing`; stance points raised and resolved.
- `## Draft` — appended during `deciding`; the changelog entry and article deltas awaiting the operator's decision.

**Lifecycle states:**

| State | Meaning | Transitions to |
|-------|---------|----------------|
| `researching` | Session file created; sources gathered into `## Findings`. | `arguing` — digest complete. |
| `arguing` | Stance points raised/resolved in `## Argument`; a verdict is presented. | `deciding` — verdict presented, draft prepared. |
| `deciding` | `## Draft` holds the changelog entry and article deltas. | resolved-cut (operator's go) or resolved-no-cut (operator confirms). |
| resolved (cut / no-cut) | content-core executes the outcome; session file cleared. | terminal — a `research-log.md` entry is appended in both cases. |
| discarded | Operator deletes the session file at any phase, mechanically detectable as the file's disappearance while unresolved. | terminal — nothing is written to `topics/`; abandonment is not a resolution. |

**Design rationale:** A single mutable file, not an append-only log, because a run's
argument genuinely evolves — a stance point raised in `## Argument` may be revised before
`## Draft` is written, and re-entry needs the *current* state of the argument, not its
history. Quarantining this file outside `topics/` (and gitignoring it) is what makes "a
failed or interrupted research run never mutates published content" a mechanical property
of the filesystem layout rather than a discipline the operator has to remember.

**Domain reference:** `docs/architecture/domain/research-run.md` — this bet adds the
verbatim on-disk frontmatter shape and formalises the body's section anatomy (the domain
stub describes the sections narratively; this file fixes their exact headings and
accumulation order).

---

#### `topics/<slug>/changelog.md` — Changelog

**Owned by:** `@staycurrent/core` (`core/`) — one `## vN` entry is appended per cut, as
part of the same atomic write; the file is otherwise append-only from every other caller's
perspective.

**Purpose:** The topic's append-only timeline of standalone entries. Each `## vN` section
is the on-disk shape of one `ChangelogEntry`; the RSS item for a cut is that entry,
rendered verbatim at site build — one written artifact serves the page, the feed, and the
audit trail.

**Document anatomy:** `# <Topic> — Changelog` (H1) → `## vN — YYYY-MM-DD` sections,
newest first. Entry anatomy:

- **What moved** — the field that changed.
- **What it means** — for the reader's practice.
- **Stance:** `held` \| `bent` \| `reversed` + one sentence.

An entry stands alone: a reader current on v*N*−1 is done after reading it. The **v1
founding entry** uses the identical `## v1 — YYYY-MM-DD` heading; its body is the founding
note — the initial stance and what the topic covers — and it carries **no `Stance:` line**,
because there is no predecessor cut to hold the stance against.

**Key fields (per `## vN` entry):**

| Field | Type | Description |
|-------|------|-------------|
| version heading | `## vN — YYYY-MM-DD` | Matches the snapshot's `version` and `cut` date exactly. |
| What moved | prose | The field that changed since the prior version. |
| What it means | prose | The consequence for the reader's practice. |
| Stance | enum: `held` \| `bent` \| `reversed` + sentence | Absent only on the v1 founding entry. |

**Lifecycle states:** N/A — append-only document, no per-entry state machine. Once
written, an entry is never edited or removed; a correction is a later entry, not a
mutation of this one (mirrors the append-only-events discipline generally, applied here to
a document rather than an event stream).

**Design rationale:** `changelog.md` lives at the topic root, not inside `versions/vN/`,
because the timeline belongs to the *topic* — it spans every cut — while `provenance.md`
belongs to one *cut* (design system, Workspace Topology). Newest-first ordering answers a
returning reader's actual question — "what changed since I last read this" — by reading
top-down to the version they remember, with no need to reconstruct the sequence.

**Domain reference:** `docs/architecture/domain/version.md` (the five-artifact atomic-cut
invariant, of which the changelog entry is one) — this bet adds the full document anatomy
and the v1 founding-entry exception.

---

#### `topics/<slug>/versions/vN/provenance.md` — Provenance Record

**Owned by:** `@staycurrent/core` (`core/`) — written once per cut, frozen alongside its
`versions/vN/` snapshot.

**Purpose:** A version's sources-and-influences record — the on-disk shape of one
`ProvenanceRecord`. Every consequential claim in the version traces to exactly one of its
two sections.

**Document anatomy:**

- `## Sources` — one bullet per citable input: title, URL, accessed date, and which
  claims it supports.
- `## Synthesis` — one bullet per claim drawn from agent knowledge, stated plainly and
  labelled as synthesis, not sourced.

**Key fields (per bullet):**

| Field | Type | Description |
|-------|------|-------------|
| `## Sources` bullet | title, URL, accessed date, claims supported | A `sourced` claim — traces to citable material. |
| `## Synthesis` bullet | claim, stated plainly | A `synthesis` claim — drawn from agent knowledge, never disguised as sourced. |

**Lifecycle states:** N/A — written once at cut time; frozen with the rest of its
`versions/vN/` snapshot.

**Design rationale:** `provenance.md` lives per-version (`versions/vN/provenance.md`), not
at the topic root, because sources belong to a specific cut's claims — a later cut's
provenance must not retroactively vouch for or contradict an earlier version's claims
(design system, Workspace Topology; `version.md`, "Owned by: content-core"). The
**combined non-emptiness rule** is a hard gate input, not a style preference: `## Sources`
and `## Synthesis` may not both be empty — a version whose provenance lists nothing in
either section cannot cut. A fully-sourced version needs no synthesis bullet, and a purely
synthesised version (a `no-cut` never reaches this file, but a genuinely novel-synthesis
cut can) needs no sourced bullet — only the *combination* being empty is disallowed.

**Domain reference:** `docs/architecture/domain/version.md` (the combined non-emptiness
invariant, and the five-artifact atomic-cut it participates in) — this bet adds the full
document anatomy (bullet field shape for each section).

---

#### `topics/<slug>/research-log.md` — Research Log

**Owned by:** `@staycurrent/core` (`core/`) — one entry appended per *resolved* run (cut
or no-cut), as the final step of that run's resolution.

**Purpose:** Every convened run's durable record, including runs that resolved to
no-cut — "we checked and the field was quiet" is itself currency information the topic's
`last_researched` date alone does not narrate.

**Document anatomy:** `# <Topic> — Research Log` (H1) → `## YYYY-MM-DD — cut vN` or
`## YYYY-MM-DD — no-cut` sections, newest first; 2–4 factual lines per entry on what was
examined and why it did or did not warrant a cut.

**Key fields (per entry):**

| Field | Type | Description |
|-------|------|-------------|
| heading | `## YYYY-MM-DD — cut vN` \| `## YYYY-MM-DD — no-cut` | The run's resolution date and outcome. |
| body | 2–4 factual lines | What was examined; why it did or did not warrant a cut. |

**Lifecycle states:** N/A — append-only document; a discarded (unresolved) session
appends nothing here, since abandonment is not a resolution.

**Design rationale:** This log is not a filtered view of `changelog.md` (which only ever
has cut entries) — a topic re-researched ten times with no stance change needs its own
distinct record of diligence, separate from the topic's public-facing timeline. Keeping
it a separate file (rather than a hidden section of the changelog) also keeps
`changelog.md` purely reader-facing, matching the design system's rule that RSS renders a
changelog entry verbatim with nothing to filter out.

**Domain reference:** `docs/architecture/domain/research-run.md` ("every *resolved* run —
cut or no-cut — appends an entry to `research-log.md`") — this bet adds the exact heading
format and the 2–4 line body constraint.

---

### Integrity Invariants

These are cross-file constraints the publish gate enforces mechanically before any commit
touches `topics/`; each is already named in a domain stub or ADR — this section is the
consolidated checklist content-core's gate implements against the staged prospective tree,
returning a `GateResult` that names the exact missing or mismatched artifact on failure
([ADR 0003](../../../architecture/decisions/0003-single-fail-closed-publish-gate.md)).

| Invariant | Source |
|---|---|
| `topic` frontmatter field equals its directory name (`topics/<topic>/`) | `topic.md` Invariants |
| `topic` is immutable once created; renaming is a migration, not an edit | `topic.md` Invariants |
| A topic slug colliding with a reserved root slug (`skills`, `changelog`, `about`, `rss.xml`) is rejected | `topic.md` Invariants; architecture index §4 (skill distribution) |
| `version` only increments, and only as part of a cut | `topic.md` Invariants; `version.md` |
| A cut is atomic across five artifacts: `versions/vN/{article.md, skill/, provenance.md}`, the `## vN` entry atop `changelog.md`, and the RSS item generated verbatim from that entry at site build | `version.md` Invariants |
| The snapshot skill's `article_version` equals `N` | `version.md` Invariants |
| For the current version, the live `skill/` is byte-identical to `versions/vN/skill/` | `version.md` Invariants |
| `provenance.md` carries at least one entry across `## Sources` and `## Synthesis` combined | `version.md` Invariants |
| `due` (topic) and `superseded` (version) are always derived at read time, never stored | `topic.md` Lifecycle; `version.md` Lifecycle; [ADR 0002](../../../architecture/decisions/0002-git-filesystem-as-only-store.md) |
| Only content-core mutates a topic's directory, and only via stage → gate → commit | `topic.md` Invariants; [ADR 0003](../../../architecture/decisions/0003-single-fail-closed-publish-gate.md) |
| One cut is one git commit: `cut(<slug>): v<N>`, or `log(<slug>): no-cut` for a resolved no-cut run | `version.md` Notes; design system Skill Anatomy (action contract) |
| A topic showing `status: in-research` with no matching `.staycurrent/sessions/<slug>.md` reverts to `current` on next read, reported as a reconciliation | `topic.md` Notes; `research-run.md` Invariants |
| The live `article.md` frontmatter passes the loaders' schema (types, status enum, non-blank `title`/`stance`) — gate check 10 | Frontmatter field table above; change-proposal-6 |
| An abandoned (discarded) session appends nothing to `research-log.md` and leaves no trace in `topics/` | `research-run.md` Lifecycle |

The gate runs against the **staged** prospective tree — the state `topics/` will hold
after the commit — before anything mutates the real tree, so a failed cut never produces a
partial version (`version.md` Notes). Nothing that touches `topics/` self-repairs on any
of the above failing; the system halts and names the exact offending artifact (design
system, Error resilience policies).

### Migration & Evolution

The content contract above evolves **additively only**, within one framework major
version: new frontmatter fields are additive, and a removed field is deprecated with a
review trigger rather than dropped silently (design system, Versioning & Evolution;
architecture index §7). A framework major-version bump is the only event permitted to make
a breaking change to this schema, and it is recorded as an ADR when it happens.

**Topic rename is out of scope for this bet.** `topic` is immutable by invariant — the
slug is the directory name, the URL, and the skill name (`topic.md` Invariants; site's
"Slugs are permanent; URL changes are migrations," architecture index §4). Renaming a
topic would require a real migration: a new `topics/<new-slug>/` directory (itself cut
through the same gate as any topic), plus redirect stubs from the old slug's site routes
and skill-payload paths to the new ones. No such migration mechanism is designed or built
by this bet — this paragraph is a placeholder note for a future bet, not a commitment.

### Seed Data — `topics/databases/`

`topics/databases/` is the seed topic: the first instance ever written against the
contract this document specifies. It is not a bootstrapped exception. Its `article.md`,
`changelog.md`, `skill/`, `versions/v1/`, and `research-log.md` are created by the same
`create <topic>` action contract, and its v1 cut passes through the identical stage → gate
→ commit publish gate any later cut of any later topic passes through (`topic.md` Notes:
"Topic creation is not a bootstrapped exception"). There is no hand-seeded exemption
anywhere in this schema — if the seed's v1 cut required bypassing the gate to land, the
gate itself would be wrong, not the seed.

The seed's coverage (relational, document, key-value, columnar, vector, and graph
databases; how to choose; the convergence trend; practitioner mental models) is a content
and product decision, out of this data-design document's scope — see the pitch's Solution.
Its `cadence` and initial `stance` values are likewise chosen by the operator at creation
time through the `create` operation, not fixed here.
