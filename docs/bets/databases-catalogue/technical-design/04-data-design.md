## Schema & Data Design

*This bet introduces no new store, table, or collection. `topics/<slug>/article.md`'s
frontmatter is still the only place a topic's state lives
(`docs/architecture/domain/topic.md`), and this design adds fields to it, not files, tables, or
a parallel registry. Reference `docs/architecture/domain/topic.md` for the topic entity itself —
its seven required fields, its `current`/`in-research` lifecycle, its invariants — nothing below
repeats it. And nothing below changes it: seven new frontmatter keys, zero new lifecycle states.
The keys this bet adds are **fields on the existing topic entity**, not a new state a topic can
be in; `due`/`current`/`in-research` behave exactly as `topic.md` already specifies, for every
topic, catalogue or not.*

*Stated plainly, because the pitch's own no-go depends on this being unambiguous: **every field
below is display frontmatter, not a gate-validated structured field.**
`validateTopicFrontmatter` (`core/src/frontmatter.ts`) tolerates unknown keys today, unlike
`validateVersionFrontmatter`, which rejects any key outside `{version, cut}`
(`research/content-model-audit.md`). This bet keeps that asymmetry exactly as it is rather than
closing it — see `03-api-design.md`'s Gate↔loader parity section for what "tolerates" means in
the extended contract.*

---

### The additive frontmatter schema

| Field | Type | Applies to | Validated? |
|---|---|---|---|
| `area` | `string` | every catalogue topic (hub, foundation, profile) | No — extracted if a non-blank string, else absent |
| `register` | `'foundation' \| 'profile' \| 'hub'` | every catalogue topic | No — extracted only if it exactly matches one of the three values, else absent |
| `movement` | `string` | foundations only | No — extracted if a non-blank string, else absent |
| `reading_order` | `number` (positive integer) | foundations and profiles | No — extracted if a positive integer, else absent |
| `prereqs` | `string[]` (foundation slugs) | foundations only | No — extracted only if every element is a string, else absent |
| `core` | `boolean` | profiles only | No — extracted if a boolean, else absent |
| `axes` | `ProfileAxes` (eight named optional string fields) | profiles only | No — recognized string-valued keys copied through; everything else dropped |

Every row is optional and additive: present today only where an author has typed it, tolerated
— never rejected — if absent or malformed. None of the seven can ever produce a `GateFailure`;
see `03-api-design.md`'s `validateTopicFrontmatter` entry for the exact extraction rule per
field, and its Gate↔loader parity section for why the gate's behavior is unchanged.

This bet's brief names six of these seven keys directly — `area`, `register`, `movement`,
`reading_order`, `prereqs`, and the profile `axes` object. `core` is a seventh, proposed here
beyond that list — flagged as decision 1 below.

**Example — a mid-sequence foundation** (`topics/transactions/article.md`):
```yaml
---
topic: transactions
title: Transactions
stance: >-
  Take the cheap guarantee everywhere except where an invariant spans rows
  and money or safety rides on it.
version: 1
status: current
cadence: 180d
last_researched: 2026-08-01
area: databases
register: foundation
movement: Single-Node
reading_order: 5
prereqs: [data-models, storage-engines, schema-design]
---
```

**Example — a core-trio profile** (`topics/relational-database/article.md`):
```yaml
---
topic: relational-database
title: Relational Database
stance: >-
  The default for a reason: joins and a declarative planner answer the
  question nobody anticipated.
version: 1
status: current
cadence: 180d
last_researched: 2026-08-01
area: databases
register: profile
reading_order: 1
core: true
axes:
  consistency_model: Linearizable by default (single-leader); tunable via isolation level
  partition_strategy: Single-node first; native partitioning and read replicas before a distributed rewrite
  query_language: SQL — joins, secondary indexes, a declarative planner
  scaling_axis: Read replicas, then vertical, then a distributed-Postgres rewrite
  latency_profile: Low-single-digit ms, disk-backed
  durability_guarantee: WAL-fsynced before commit is acknowledged
  transaction_support: Full multi-row ACID; serializable available
  operational_maturity: Decades-mature; the default managed-service tier everywhere
---
```
The profile's other authored content — links to foundations, the teachable-quadruple prose —
lives in the article body, unchanged from the pitch's authoring-convention framing. `axes` is
metadata alongside it, not a replacement for it (see The 8 canonical decision axes, below).

**Example — the hub** (`topics/databases/article.md`):
```yaml
---
topic: databases
title: Databases
...
area: databases
register: hub
---
```
No `movement`, `reading_order`, `prereqs`, `core`, or `axes` — none apply to the one hub an area
carries.

---

### The register model

| `register` | What it marks | Carries | Count per area |
|---|---|---|---|
| `hub` | the area's front door — chooser, map, freshness rollup | `area` only | exactly one (`Catalogue.hub` degrades to `null` if this is ever violated in the other direction — see `03-api-design.md`'s `getCatalogues`) |
| `foundation` | a deep, sequenced mechanism essay the reading path walks in order | `area`, `movement`, `reading_order`, optionally `prereqs` | 17 in this program (`pitch.md`) |
| `profile` | a comparable, coordinate-scored engine entry | `area`, `reading_order`, optionally `core`, optionally `axes` | 7 in this program |

`register`'s three values are engine-level vocabulary, not this instance's private taxonomy —
see `03-api-design.md`'s rationale for why it is typed as a closed union (`TopicRegister`) while
`area`/`movement` stay open strings. These three words describe the *shape* of any hub-and-spoke
catalogue — one front door, a sequenced core, a comparable periphery — which is the pattern this
bet establishes generically for the product, not a databases-specific concept. The pitch's own
Living Documents refinement, applied at pitch commit to both `docs/product-brief.md` and
`docs/design-system.md`'s Shared Vocabulary, already frames "topic" this way: "a broad area is a
catalogue of finer-grained topics fronted by a hub" (`docs/design-system.md` § Shared
Vocabulary).

---

### The five movements, as data

The reading path's five movements are not stored anywhere as their own record. A movement is
simply the set of foundations that share a `movement` string, ordered by the lowest
`reading_order` its members carry (`02-data-flows.md`, flow a). Recorded here as the data this
program commits to authoring, not as a new store:

| Movement | Foundations (reading order) | Reading-order range |
|---|---|---|
| Sizing Lens | capacity-planning | 1 |
| Single-Node | data-models, storage-engines, schema-design, transactions, query-execution | 2–6 |
| Distributed | replication, consensus, partitioning, distributed-transactions, multi-region | 7–11 |
| Deriving & Serving | caching, derived-data | 12–13 |
| Operating & Evolving | schema-migrations, connection-pooling, backup-recovery, database-observability | 14–17 |

The fifth movement is the 2026-07-28 amendment (below): the operator committed to
Postgres-deep operational leverage as dedicated pieces, not folded prose. Its display name
is provisional until the operator confirms it before the movement's first authored
frontmatter — the pilot (`query-execution`, Single-Node) does not touch it.

This table is the authoring target, not a validated invariant. Nothing in this design enforces
that a movement's members carry contiguous `reading_order` values, or that every author spells
"Single-Node" identically — an accidental "single-node" vs. "Single-Node" split silently
produces two movement buckets instead of one (`02-data-flows.md` flow a). Both are
editorial-discipline risks in the same class `research/content-model-audit.md` already accepts
for cross-piece consistency generally ("comparability is a writer-skill convention, enforced
editorially... not by the gate") — named here rather than silently assumed, and not escalated
into a gate check, per this bet's no-gos.

---

### The locked 25-slug set — the content topology

| Slug | Register | Movement | Reading order | Notes |
|---|---|---|---|---|
| `databases` | hub | — | — | the re-cut chooser/map (01-ui-design.md); this bet's only re-cut, everything else is net-new |
| `capacity-planning` | foundation | Sizing Lens | 1 | |
| `data-models` | foundation | Single-Node | 2 | |
| `storage-engines` | foundation | Single-Node | 3 | |
| `schema-design` | foundation | Single-Node | 4 | |
| `transactions` | foundation | Single-Node | 5 | |
| `query-execution` | foundation | Single-Node | 6 | |
| `replication` | foundation | Distributed | 7 | |
| `consensus` | foundation | Distributed | 8 | |
| `partitioning` | foundation | Distributed | 9 | |
| `distributed-transactions` | foundation | Distributed | 10 | |
| `multi-region` | foundation | Distributed | 11 | |
| `caching` | foundation | Deriving & Serving | 12 | |
| `derived-data` | foundation | Deriving & Serving | 13 | |
| `schema-migrations` | foundation | Operating & Evolving | 14 | amendment 2026-07-28 |
| `connection-pooling` | foundation | Operating & Evolving | 15 | amendment 2026-07-28 |
| `backup-recovery` | foundation | Operating & Evolving | 16 | amendment 2026-07-28 |
| `database-observability` | foundation | Operating & Evolving | 17 | amendment 2026-07-28 |
| `relational-database` | profile | — | 1 | core (★) |
| `key-value-database` | profile | — | 2 | core (★) |
| `columnar-database` | profile | — | 3 | core (★) |
| `document-database` | profile | — | 4 | |
| `column-family-database` | profile | — | 5 | |
| `vector-database` | profile | — | 6 | |
| `graph-database` | profile | — | 7 | |

25 rows: 1 hub, 17 foundations, 7 profiles. Every slug fits `SLUG_RE`
(`core/src/slug.ts`: kebab-case, at most three words) and none collides with a reserved root
slug (`skills`, `changelog`, `about`, `rss.xml`). Slugs are permanent
(`docs/architecture/domain/topic.md` Invariants) — this table is the one-way door the pitch
names; changing any slug after its first cut requires the rename migration that does not exist
today.

---

### The 8 canonical decision axes

01-ui-design.md's hub wireframe lists eight axis names "(illustrative only)," pending this
document. Derived from `research/interview-rubric.md`'s 11 competencies and the live
`topics/databases/article.md`'s own engine-family comparison (its
`Family | structure | what it makes cheap | canonical engines` table, and its Transactions,
Replication, and Partitioning sections), the eight are confirmed as canonical:

| Key | Label | What it captures | Grounded in |
|---|---|---|---|
| `consistency_model` | Consistency model | What the engine guarantees by default, and what it can be tuned to (linearizable, snapshot, tunable quorum, eventual) | interview-rubric competencies 5, 5b; article §Transactions, §Replication |
| `partition_strategy` | Partition strategy | Whether and how the engine distributes data by default — single-node-first with optional partitioning, always sharded, hash vs. range | interview-rubric competency 6; pedagogy-teardown's single-node/distributed seam |
| `query_language` | Query interface | The question surface exposed — SQL, exact-key get/put, wide-column, graph traversal, vector similarity | interview-rubric competency 3; article's "query surface" framing |
| `scaling_axis` | Scaling axis | The primary lever an operator pulls to grow capacity — read replicas, vertical, horizontal write partitioning, a managed distributed rewrite | interview-rubric competency 2; article §Partitioning ("a bigger box is unfashionable and extremely effective") |
| `latency_profile` | Latency profile | The p50/p99 shape a workload should expect — sub-millisecond in-memory, low-single-digit-ms disk-backed, seconds-scale analytical | interview-rubric competency 2; article §Two workloads (OLTP/OLAP) |
| `durability_guarantee` | Durability guarantee | What survives a crash by default — WAL-fsynced before acknowledgment, replicated before acknowledgment, async snapshot | article §Transactions ("durability is the WAL again"); interview-rubric competency 11 |
| `transaction_support` | Transaction support | The strongest atomicity/isolation unit offered out of the box — multi-row ACID, single-row atomic only, coordinator-mediated | interview-rubric competency 7; article §Transactions |
| `operational_maturity` | Operational maturity | How deep the tooling, managed-service, and incident-response ecosystem runs today | interview-rubric competency 11; article §The convergence (the operational-bill argument) |

These eight are `ProfileAxes`' keys (schema above) and the hub matrix's eight columns
(01-ui-design.md) — one vocabulary, two surfaces. Per the pitch's no-go, no code reads or
renders `axes` in this bet: the hub matrix is hand-authored markdown (01-ui-design.md, "requiring
no code change at all"), and `axes` exists on each profile primarily so the writer has one place
to keep a profile's coordinates before transcribing them into that matrix — a consistency aid,
not (yet) a data dependency. A future bet could generate the matrix from `axes` directly; nothing
here commits to that (decision 4, below).

---

### The reading-order + prereq model

Covered mechanically in `02-data-flows.md` flow (b) and `03-api-design.md`'s
`getReadingPosition` entry; this section is the schema-level summary those files' mechanism
serves.

- `reading_order` is a single global integer per register, per area — 1–17 for foundations,
  1–7 for profiles in this program — not scoped per movement. A foundation's within-movement
  position (rendered as "4th of 5") is *derived* by ranking a topic among just its movement's
  members, never separately authored: one authored number, two displayed positions.
- `prereqs` names foundation slugs this piece assumes the reader has already read. It is not
  restricted to the immediately preceding piece — prereqs can cross movements (the pitch's own
  example: `distributed-transactions` naming both `transactions` and `partitioning`).
- Neither field is validated for existence, acyclicity, or contiguity —
  `research/content-model-audit.md`'s BET tier defers that ("Prereq graph validated (existence,
  acyclicity) | BET (small)"). The display layer's fallback behavior for a dangling reference is
  specified in `02-data-flows.md` flow (b) and `03-api-design.md`'s `getReadingPosition` entry,
  not here — this section states the data shape; those state what happens when the shape points
  at nothing.

---

### Decisions for the operator

1. **A seventh additive key, `core: boolean`, beyond the six this bet's brief names.** Needed
   to drive the sidebar/library `[core]` badge (01-ui-design.md) without coupling it to
   `reading_order` position — fragile, since reordering profiles would silently move the badge —
   or hardcoding profile slugs in `services/site`, which the engine/instance boundary forbids.
   Recommended: add it. Rejected alternative: derive "core" from `readingOrder <= 3` among
   profiles.
2. **`register` is a closed engine-level union (`'foundation' | 'profile' | 'hub'`), not an open
   string.** Recommended for the type safety it buys every consumer, on the premise that this
   three-word vocabulary describes the hub-and-spoke pattern generically rather than this
   instance's private taxonomy (see The register model, above). Flagging because it is a real
   commitment: a future area wanting a different three-tier shape would need a fourth `register`
   value added to the union — a small, additive core change — rather than being free to invent
   its own words.
3. **`getCatalogues` is area-generic — `Catalogue[]`, not a single hardcoded-`"databases"`
   accessor.** Recommended per the committed engine/instance boundary
   (`docs/architecture/index.md` §4). Costs one extra grouping pass over a hardcoded version;
   buys a function the framework's next adopter can reuse unchanged.
4. **`axes` ships as frontmatter now, even though no code reads it in this bet.** Recommended as
   a low-cost consistency aid for the writer authoring the hub's hand-built matrix, and as
   optionality for a future bet that might generate the matrix from it directly. Rejected
   alternative: leave the eight coordinates as body prose only, with no frontmatter — simpler
   today, but leaves the matrix's source of truth unrecoverable from the profile page itself.
5. **`getReadingPosition`'s derived `next` resolves 01-ui-design.md's open decision 2
   (header-only vs. header-and-footer) in favor of always rendering the footer.** A derived
   `next` cannot dangle (`03-api-design.md`'s rationale) — the risk that motivated the
   header-only fallback is closed mechanically. Recommended: adopt header-and-footer
   unconditionally; the editorial-discipline mitigation 01-ui-design.md proposed is no longer
   necessary.

01-ui-design.md's own five open decisions (movement sub-grouping, header/footer, rollup depth,
register-group default state, movement display names) are UI-rendering calls this document does
not re-litigate. Decision 5 above narrows its item 2 specifically, on new information this
design phase produced.

---

### Amendment — 2026-07-28, operator-sanctioned

The operator resolved this document's five decisions and extended the topology in one
sitting. Recorded here so the design reads as one contract, not a document plus a diff.

1. **Decisions 1–5: adopted as recommended.** `core` ships as the seventh key; `register`
   stays a closed engine-level union; `getCatalogues` stays area-generic; `axes` ships as
   frontmatter; the reading rail renders header and footer unconditionally.
2. **The practice tier: four foundation slugs added** — `schema-migrations`,
   `connection-pooling`, `backup-recovery`, `database-observability`, reading order 14–17,
   grouped as the fifth movement (Operating & Evolving, display name provisional until the
   operator confirms it before that movement's first authored frontmatter). Reason: the
   operator committed to Postgres-deep operational leverage as dedicated pieces; folding
   migrations, pooling, backup, and monitoring into the existing thirteen would re-create
   the monolith's depth cap one level down. All four fit `SLUG_RE` and collide with nothing
   reserved. Three are unprefixed primitives per the slug-semantics guard; the fourth is
   deliberately prefixed — `docs/product-brief.md` names bare "observability" as its own
   example of a future self-contained practice area, and this piece is database-scoped, so
   claiming the site-level primitive would burn a slug the product already has other plans
   for. The program now lands at 25 topics — the full ~25-topic design headroom. The
   pitch's search no-go re-raise trigger ("revisit at ~25 topics") therefore arrives at
   program end, and the first post-program bet discovery inherits it.
3. **Rollout posture: pre-audience, ship-fast.** The site has no readership yet. The
   no-depth-regression invariant is relaxed until it does — waves land as they finish, and
   the deployed site may show the catalogue mid-growth. No-dead-links still binds; the hub
   re-cut still lands last. The 01-ui-design.md open UX decisions resolve to their own
   recommendations (movement sub-grouping in the sidebar only; one aggregate rollup line;
   register groups open by default).
