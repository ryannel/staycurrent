## UI Design

*The `databases-catalogue` bet has one surface, `site` (`graphical-ui`). Every view below is a
display patch over the shell `docs/design-system.md` § Graphical UI already specifies — no new
route, no new page type, no content-contract change. The locked topology this design draws
against: 17 foundations (bare-noun slugs) in five movements — capacity (capacity-planning);
single node (data-models, storage-engines, schema-design, transactions, query-execution);
distributed (replication, consensus, partitioning, distributed-transactions, multi-region);
caches & derived data (caching, derived-data); operations (schema-migrations,
connection-pooling, backup-recovery, database-observability; the 2026-07-28 practice-tier
amendment, `04-data-design.md`) — 7 profiles (`<class>-database` slugs; relational,
key-value, and columnar are the ★ core trio; document, column-family, vector, and graph are the
four escape hatches), and 1 hub (`databases`), all under one area.*

### Surface: site

A reader meets this catalogue in three places: the hub page that chooses for them, the sidebar
and library that let them browse, and the individual foundation piece that has to tell them
where they are once they've committed to reading it. All three reuse components that already
ship — `app/[topic]/page.tsx`, `components/library/topic-library.tsx`,
`components/shell/sidebar.tsx` — extended, never replaced. Per `research/content-model-audit.md`,
each view below is explicit about which of its parts are **authored content** (prose, tables,
and Mermaid the writer produces inside `article.md` — free, no code) and which are the **display
patch** (a new accessor in `lib/content.ts` plus new rendering — the only code this bet touches).

---

#### The `/databases` Hub — Chooser and Map

**Purpose:** Today `/databases` is one essay. This bet re-cuts it into the catalogue's front
door: a reader names their access pattern and consistency need, and leaves with either a
specific profile to read or a specific foundation to start with — never a wall of prose to
search by hand. The hub is still just a topic, rendered by the same `/[topic]/page.tsx` route
every other page uses; nothing here is a new page type.

**What's authored vs. patched.** Four of this view's five elements are pure content, written
into `article.md` and requiring no code change at all: the 8 decision axes (prose), the master
comparison matrix (a markdown table), the reading path (prose, most naturally a short list
grouped by movement), and the decision tree (a Mermaid `flowchart`, rendered by the
`rehypeMermaid` pipeline already committed). The fifth element — the **catalogue freshness
rollup** — is the one piece of this view that is genuinely new code: a `lib/content.ts` accessor
that sweeps the area the same way `listTopicCards` already does, and a new component that
renders its result above the article body. That accessor and component are this view's entire
code surface; the axes, matrix, path, and tree are the writer's job, not the build's.

**Wireframe** (desktop, ≥ 1280px — same three-zone shell as every topic page):

```
┌─ sidebar ─┬─ /databases ────────────────────────────────────┬─ TOC ─┐
│           │ [v6]·researched 14 Jul 2026·changelog·history·   │ On   │
│           │ skill                                   [fresh●] │ this │
│           ├──────────────────────────────────────────────────┤ page │
│           │ ACROSS THE CATALOGUE                              │      │
│           │ 25 pieces · 6 fresh (≤14d) · most recently cut:   │ Axes │
│           │ Partitioning, 16 Jul 2026                         │ Comp-│
│           ├──────────────────────────────────────────────────┤ are  │
│           │ ┃ Name your access pattern and your consistency   │ Read-│
│           │ ┃ need, and the matrix below names your engine.   │ ing  │
│           │                                                    │ path │
│           │ # Databases                                       │ Which│
│           │                                                    │ one? │
│           │ ## The 8 decision axes                            │      │
│           │ consistency model · partition strategy · query    │      │
│           │ language · scaling axis · latency profile ·       │      │
│           │ durability guarantee · transaction support ·      │      │
│           │ operational maturity          (illustrative only) │      │
│           │                                                    │      │
│           │ ## Compare the seven profiles                     │      │
│           │ ┌──────────────┬───────┬───────┬─────┬───────┐   │      │
│           │ │ Profile       │ Axis 1│ Axis 2│ ... │ Axis 8│   │      │
│           │ ├──────────────┼───────┼───────┼─────┼───────┤   │      │
│           │ │ ★ Relational  │       │       │     │       │   │      │
│           │ │ ★ Key-Value   │       │       │     │       │   │      │
│           │ │ ★ Columnar    │       │       │     │       │   │      │
│           │ │ Document      │       │       │     │       │   │      │
│           │ │ Column-Family │       │       │     │       │   │      │
│           │ │ Vector        │       │       │     │       │   │      │
│           │ │ Graph         │       │       │     │       │   │      │
│           │ └──────────────┴───────┴───────┴─────┴───────┘   │      │
│           │  ↑ first column stays put; the axis columns scroll under it │
│           │                                                    │      │
│           │ ## The reading path                               │      │
│           │ Capacity → Single node (5) → Distributed (5) → │      │
│           │ Caches & derived data (2) → Operations (4).│      │
│           │ 17 pieces, each linked.                           │      │
│           │                                                    │      │
│           │ ## Which one do I need?                           │      │
│           │ ┌ flowchart ───────────────────────────────────┐ │      │
│           │ │  Need cross-row transactions? ─yes→ Relational│ │      │
│           │ │       │no                                     │ │      │
│           │ │       ▼  ...                                  │ │      │
│           │ └────────────────────────────────────────────────┘ │      │
│           ├──────────────────────────────────────────────────┤      │
│           │ Provenance — Sources / Synthesis (unchanged)      │      │
└───────────┴──────────────────────────────────────────────────┴──────┘
```

**A second frame — mid-rollout (waves 1–5), before the hub itself is re-cut.** The rollup band
is code; it reads whatever exists in `topics/` today and is correct at every point in the
six-wave delivery, including before the hub's own content catches up (the pitch's own rule is
that the hub re-cut lands *last*, so dead links never appear). Until then, the same rollup band
sits above the **current v2 essay**, unchanged:

```
│ [v2]·researched 16 Jul 2026·changelog·history·skill         [fresh●]│
├───────────────────────────────────────────────────────────────────┤
│ ACROSS THE CATALOGUE                                                │
│ 4 pieces · 4 fresh (≤14d) · most recently cut: Capacity Planning,   │
│ 16 Jul 2026                                                         │
├───────────────────────────────────────────────────────────────────┤
│ ┃ (v2's existing stance callout, untouched)                        │
│ # Databases                                                         │
│ (the current single-essay body — chooser/matrix/tree land in the   │
│  final wave's re-cut, not before)                                  │
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Loading | — | Not applicable. The site is a static export; the page paints complete on arrival (`docs/design-system.md` § Constraints: "No skeletons at MVP"). |
| Active / populated | Any build where `topics/` sweeps cleanly | The rollup band states a live count and the most recent cut; the article body renders whatever is currently authored (v2 essay pre-recut, chooser+map post-recut). |
| Empty (interim) | Waves 1–5: the area holds only the hub plus however many pieces have cut so far | The rollup band shows the true live count (e.g. "4 pieces · 4 fresh"), never a hardcoded 25 — it is wrong to ship a number the current wave hasn't earned. |
| Error | A topic in the area fails schema validation, or the root can't be resolved | No runtime error state exists. Exactly like `listTopicCards`' existing `sweepOrThrow` behavior, this fails `next build` outright — "currency is never guessed" extends to the rollup's inputs. There is nothing to design here beyond: it must never render a partial or wrong count. |
| Degraded | A profile or axis label is missing from the matrix, or a Mermaid fence fails to render | The matrix/tree are authored markdown; a broken Mermaid fence falls back to its fenced source exactly as `docs/design-system.md` § Error & Honesty Choreography already specifies for any diagram. No new degraded behavior for the rollup band itself — it has no partial-data path (the sweep is all-or-nothing). |

**Key interactions:**
- Reader scrolls the comparison matrix horizontally → the profile-name column stays pinned in view; the eight axis columns scroll beneath it.
- Reader clicks a profile or foundation name anywhere in the axes prose, matrix, reading path, or decision tree → navigates to that topic (ordinary cross-link, already free).
- Reader clicks the rollup's "most recently cut" topic name → navigates to that topic.
- Reader hovers a matrix row → the row washes to signal it's one comparable unit, same affordance the version-history table already uses.
- Reader on `< 1280px` → the TOC collapses into the existing in-page `<details>` outline above the article; nothing about the rollup or matrix changes shape at that breakpoint beyond what tables/mermaid already do.

**Micro-polish spec:**

- *Motion:* The rollup band has no entrance motion — it is static-exported content, painting with the page (`docs/design-system.md` § Motion, "Route change: none"). Its reused freshness-dot glyph is **static**, not the breathing animation — the breathe keyframe is reserved as "the one earned exception," spent once on the page's own trust header; a second breathing dot immediately below it would cheapen that exception. Links inside the rollup and the matrix use the standard link-hover recipe: `--color-accent` → `--color-accent-strong`, `text-decoration-color` to full alpha, at `--duration-fast` with `--ease-standard` — the exact rule `.trust-header a:hover` and `.provenance-source-link:hover` already use. Matrix row hover: `background` to `--color-hover-wash` at `--duration-fast`/`--ease-standard`, declared on the row's base rule (not only `:hover`) so the fade-out on pointer-leave animates too — the same convention `.version-history-table tbody tr` already follows, not a new one. The sticky first column has no motion of its own (`position: sticky` is not animated). The decision tree and any other diagram inherit the committed Mermaid enhancement verbatim — no new motion spec.
- *Atmosphere / material:* The rollup band is flush on `--color-surface` — no well, no border box — because it is a second line of the same trust apparatus the page's own trust header opens with, and stacking a filled `--color-surface-alt` panel directly beneath a flush header would read as two competing containers rather than one instrument. It closes with the identical box model the trust header already uses: `--space-4` bottom padding, a 1px `--color-rule` bottom rule, `--space-6` margin before the stance callout. The comparison matrix stays on the existing flat `.article-body table` treatment (no well, no shadow) — it only gains row-hover and a pinned column, not a new surface. The sticky column needs an explicit opaque background (`--color-surface`) so the scrolling columns don't bleed through beneath it, plus a 1px `--color-rule` inline-end edge so the pinned boundary reads as deliberate, not as a rendering glitch. Nothing in this view introduces a shadow — the print-flat rule holds, and neither the rollup nor the matrix is one of the two sanctioned shadowed elements (drawer, popovers).
- *Static micro:* The rollup's label ("ACROSS THE CATALOGUE") is `--text-label` (sans 600, 0.6875rem/1.2, uppercase, tracking 0.08em, `--color-text-faint`) — the identical treatment `.nav-section-label` and `.provenance-section-label` already carry. Its stat line is `--text-meta` (mono 420, 0.8125rem/1.5, `--color-text-secondary`) — the trust header's own register, because this is the same instrument continued. The fresh-count figure and any other compared number render in tabular numerals (`font-variant-numeric: tabular-nums`) so the digit doesn't jitter against its neighbors — visual-craft's rule for "compared or in-place-changing figures." The matrix keeps the existing `.article-body table` type (sans 0.9375rem body, `--text-label`-style uppercase header row, `--color-rule` row dividers, `--color-rule-strong` header underline) and adds nothing new to that register — only the sticky-column edge rule above. Every hairline in this view sits on the pixel grid, matching the site's existing crisp-1px convention.

**New pattern this view needs:** the rollup band's exact box model — flush surface, `--text-label` heading over a `--text-meta` body line, closed by a `--space-4`/1px-rule/`--space-6` rhythm — recurs unchanged in the next view's reading-order rail. Name it once, in `docs/design-system.md`, as the **Instrumentation Strip**: a reusable flush band for any single-purpose trust fact that doesn't belong in the trust header itself. This view's instance is the **Catalogue Freshness Rollup**; the next view's is the **Reading-Order Rail**. The **Comparison Matrix** is the other new pattern here — worth naming in `docs/design-system.md` § Tables as a variant (sticky first column, row hover, tabular numerals) even though it costs no new component: it's still a markdown table through the existing pipeline, so it stays free, but the next bet that needs to compare more than a handful of things side by side should inherit this recipe by name instead of re-deriving it.

---

#### Topic Library and Sidebar — Databases-Area Grouping

**Purpose:** `topic-library.tsx` and `sidebar.tsx` both sort flat and slug-alphabetical today —
correct at one topic, illegible at 25. A reader should see the catalogue's real shape without
thinking about it: the hub first, foundations in the order they're meant to be read, profiles
with the three most-reached-for engines ahead of the four specialized ones. Both views group by
the same logic; they differ only in how much of it a card grid versus a nav tree can carry.

**Sidebar tree — wireframe** (≥ 900px, sticky rail; same structure inside the < 900px drawer):

```
┌─ Sidebar (280px, sticky) ──────────────┐
│ Stay Current                            │
│ Changelog   About                       │
│                                          │
│ DATABASES                               │  ← was "Topics"; the area label,
│ ▸ Databases                    [fresh●] │    now named for its one area
│                                          │
│ ▾ Foundations (17)                      │  ← NEW: register group, collapsible
│    CAPACITY                          │  ← NEW: movement divider, static
│    ▸ Capacity Planning                  │
│    SINGLE NODE                          │
│    ▸ Data Models                        │
│    ▸ Storage Engines                    │
│    ▸ Schema Design                      │
│    ▸ Transactions                       │
│    ▸ Query Execution                    │
│    DISTRIBUTED                          │
│    ▸ Replication              [fresh●]  │
│    ▸ Consensus                          │
│    ▸ Partitioning                       │
│    ▸ Distributed Transactions           │
│    ▸ Multi-Region                       │
│    CACHES & DERIVED DATA                   │
│    ▸ Caching                            │
│    ▸ Derived Data                       │
│    OPERATIONS                 │
│    ▸ Schema Migrations                  │
│    ▸ Connection Pooling                 │
│    ▸ Backup & Recovery                  │
│    ▸ Database Observability             │
│                                          │
│ ▾ Profiles (7)                          │  ← NEW: register group, collapsible
│    ▸ Relational                 [core]  │
│    ▸ Key-Value                  [core]  │
│    ▸ Columnar                   [core]  │
│    ▸ Document                           │
│    ▸ Column-Family                      │
│    ▸ Vector                             │
│    ▸ Graph                              │
│                                          │
│ [☀] [RSS] [GitHub]                      │
└──────────────────────────────────────────┘
```

Each `▸` is still the existing per-topic disclosure (title + freshness dot, expanding to
Article / Changelog / History / Skill) — unchanged, just nested one level deeper. `[core]` is a
new badge, not a Lucide icon (see micro-polish, below).

**Topic Library grid — wireframe** (`/`, desktop, freed width since this page carries no TOC):

```
┌─ / — Topic Library ────────────────────────────────────────────────┐
│ Databases                                                            │  ← NEW: h2, area heading
│                                                                        │    (the page had none before)
│ ┌───────────┐                                                        │
│ │ Databases │  ← the hub, standalone, ahead of both registers        │
│ │ (the map) │                                                        │
│ │ [v6]·14Jul│                                                        │
│ └───────────┘                                                        │
│                                                                        │
│ Foundations                                                           │  ← NEW: register label
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│ │ Capacity  │ │ Data      │ │ Storage   │ │ Schema    │  ...        │
│ │ Planning  │ │ Models    │ │ Engines   │ │ Design    │             │
│ │ stance…   │ │ stance…   │ │ stance…   │ │ stance…   │             │
│ │ [v2]·10Jul│ │ [v1]·09Jul│ │ [v1]·09Jul│ │ [v1]·09Jul│             │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘             │
│  (17 cards, reading-order — not sub-grouped by movement; see the     │
│   open decision below)                                               │
│                                                                        │
│ Profiles                                                              │  ← NEW: register label
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│ │ Relational│ │ Key-Value │ │ Columnar  │ │ Document  │  ...        │
│ │ [core]    │ │ [core]    │ │ [core]    │ │           │             │
│ │ stance…   │ │ stance…   │ │ stance…   │ │ stance…   │             │
│ │ [v1]·11Jul│ │ [v1]·11Jul│ │ [v1]·11Jul│ │ [v1]·12Jul│             │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘             │
│  (7 cards, ★ core trio first, then the four escape hatches)          │
└────────────────────────────────────────────────────────────────────┘
```

Each register renders as its own `repeat(auto-fill, minmax(min(320px, 100%), 1fr))` grid instance
— the existing RAM pattern, run three times (hub / foundations / profiles) instead of once, so
the reflow behavior at any width is exactly what `.topic-grid` already does today.

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Loading | — | Not applicable — static export, content arrives with the page. |
| Active / populated | The full 25-topic catalogue exists | Sidebar and library both show the hub, a 17-item Foundations group in reading order, and a 7-item Profiles group, ★-first. |
| Empty (interim, per register) | Waves 1–5: some foundations or profiles haven't cut yet, or an entire register is still empty | The register group with zero members doesn't render at all — no "Foundations (0)" placeholder, no empty grid section. This matches the product's existing convention that absence is the resting state (the freshness dot has no "not fresh" variant; a missing register gets the same treatment). If literally nothing but the hub exists, the sidebar shows the hub alone under "Databases" and the library shows one card — the pre-existing first-run empty state only fires when `topics/` is validly empty, which no wave of this bet ever produces. |
| Error | A topic's `area` (or whatever field carries grouping) fails validation, or the sweep can't resolve its root | Fails `next build`, same as `sweepOrThrow` today — never a partially-grouped tree or grid. |
| Degraded | Not applicable | The sweep that drives both views is all-or-nothing (see `sweepOrThrow`); there's no partial-render path to design for. |

**Key interactions:**
- Reader clicks the "Foundations" or "Profiles" group summary in the sidebar → toggles that group's disclosure; the chevron rotates, content reveals instantly (no animated height — the existing per-topic disclosure rule).
- Reader navigates to a page inside a group (e.g. any foundation article) → that group is force-open on load regardless of its last toggled state, mirroring the existing `isTopicActive` auto-open logic so a reader is never dropped into a page whose own nav group reads as collapsed.
- Reader collapses a group, then navigates within the same tab → the collapsed state persists (`sessionStorage`, per-tab), the same rule that already governs per-topic disclosure state.
- Reader clicks a topic's own `▸` disclosure (inside a register group) → unchanged: reveals Article / Changelog / History / Skill.
- Reader clicks a card in the library grid → navigates to that topic; hover washes the card background — both unchanged from `.topic-card` today.
- Movement dividers ("CAPACITY," "SINGLE NODE," …) are plain text, not interactive — they never receive focus or a hover state.

**Micro-polish spec:**

- *Motion:* The new register-group `<details>` (Foundations, Profiles) uses the exact recipe `.topic-disclosure` already defines: chevron `rotate(90deg)` at `--duration-base` with `--ease-standard`; content reveal is instant, no height transition (animating height on a 17-item list would cause visible reflow, which is exactly what the existing rule already forbids). Hover on the group's summary row: `--color-hover-wash` background plus `--color-text-secondary` → `--color-text-body`, both at `--duration-fast`/`--ease-standard` — identical to `.topic-disclosure > summary:hover`. Every per-topic disclosure nested inside a group keeps its motion completely unchanged; only its DOM depth changes. Movement dividers and the library's register labels carry no motion — they're static text, same as `.nav-section-label` today. Library cards keep their existing `--duration-fast` background-hover transition, unchanged.
- *Atmosphere / material:* The register groups live on the sidebar's existing `--color-surface-alt` background — no new well, no border, exactly like the per-topic disclosures they now contain. Movement dividers are flush text with no background, matching `.nav-section-label`'s own flush treatment. The library's new "Databases" heading and "Foundations"/"Profiles" labels sit flush on `--color-surface` — the page background — no card, no border, no shadow. Nothing here is one of the two sanctioned shadowed elements, so nothing here gets a shadow token.
- *Static micro:* The register-group summary row reuses `.topic-disclosure > summary`'s exact spec (sans 0.875rem/500, `--color-text-secondary`, `--space-1`/`--space-2` padding, a 16px `chevron-right` at `--color-text-faint`), plus a trailing count in `--text-meta` mono at `--color-text-faint` — "(17)", "(7)" — right of the label, reusing the version-badge convention of setting counts in mono rather than inventing a new numeral treatment. The movement divider is `--text-label` (sans 600, 0.6875rem/1.2, uppercase, tracking 0.08em, `--color-text-faint`) — `.nav-section-label`'s exact recipe — indented one step further (`--space-4`, matching `.topic-faces`'s own indent) so it visually nests under "Foundations" rather than competing with it. The new `[core]` marker is a badge, not an icon: `badge-core`, following `.badge-sourced`/`.badge-synthesis`'s exact recipe (transparent background, `--color-text-secondary`, inset 1px currentColor border, `font: 420 0.75rem/1 var(--font-mono)`) — deliberately not accent-colored, because the accent budget is already spent on links, active-nav, version badges, and the freshness dot, and a third recurring accent touch (now appearing three times per page, sidebar and library both) would blow it. Colour is never the marker's only signal either way: the badge always carries the word "core," never a bare glyph. The library's "Databases" area heading takes `--text-h2` (serif 600, fluid `clamp(1.5rem, 1.28rem + 0.8vw, 1.75rem)`/1.25) — the same role article section headings already use, because this is the first heading this page has ever carried and it deserves that weight. "Foundations" and "Profiles" sub-labels take the same `--text-label` treatment as the sidebar's movement dividers, keeping one consistent "this is a group, not a heading" register across both surfaces.

**New patterns this view needs:** the **Register-Group Disclosure** (an extension of the existing `.topic-disclosure` pattern one level up, now carrying a count) and the **Movement Divider** (a non-interactive extension of `.nav-section-label`) both belong in `docs/design-system.md` § App Shell's Sidebar anatomy, since any future second area inherits the identical shape. `badge-core` belongs beside `badge-sourced`/`badge-synthesis` in § Badges.

**Open UX decision — movement sub-grouping.** This spec recommends sub-grouping Foundations by
movement in the **sidebar** (17 items with no visible structure is a wall; the five movements
are the bet's own pedagogical spine) but *not* in the **library grid** (a card carries enough
visual weight on its own that four short sub-grids would fragment the layout more than they'd
clarify it — a tree benefits from fine structure a grid doesn't need). That asymmetry is a
judgment call, not a settled fact: the lighter alternative is a flat 17-item reading-order list
in the sidebar too, with no movement dividers. Confirm before build.

---

#### Foundation Reading-Order and Prereqs

**Purpose:** A reader who lands on a foundation piece — via the reading path, a cross-link, or
search — needs two facts before investing in a deep mechanism essay: where this piece sits in
the 17-piece sequence, and what it assumes they've already read. This element answers both, in
one small instrument, only on the 17 foundation pages — never on a profile, never on the hub.

**Wireframe** (`/transactions` — piece 5 of 17, fourth of five in Single node):

```
┌─ sidebar ─┬─ /transactions ─────────────────────────────────┬─ TOC ─┐
│           │ [v3]·researched 14 Jul 2026·changelog·history·   │       │
│           │ skill                                   [fresh●] │       │
│           ├──────────────────────────────────────────────────┤       │
│           │ Single node · piece 5 of 17 · 4th of 5 in this    │       │
│           │ movement                                          │       │
│           │ Read first: Data Models · Storage Engines ·       │       │
│           │ Schema Design                                     │       │
│           ├──────────────────────────────────────────────────┤       │
│           │ ┃ (stance callout)                                │       │
│           │ # Transactions                                    │       │
│           │ … essay body …                                    │       │
│           ├──────────────────────────────────────────────────┤       │
│           │ Continue: Query Execution →                       │       │
│           ├──────────────────────────────────────────────────┤       │
│           │ Provenance (unchanged)                            │       │
└───────────┴──────────────────────────────────────────────────┴───────┘
```

**First piece in the path** (`/capacity-planning` — piece 1 of 17): the "Read first" line is
absent entirely, not replaced with "no prerequisites" — the same convention the freshness dot
already uses (absence is the resting state, not a negative message to design):

```
│ Capacity · piece 1 of 17 · 1st of 1 in this movement          │
├────────────────────────────────────────────────────────────────┤
│ ┃ (stance callout)                                              │
│ # Capacity Planning                                              │
```

**Last piece in the path** (`/database-observability` — piece 17 of 17): there is no next foundation to
point to, so the footer redirects to the hub rather than disappearing:

```
│ Continue: back to the chooser and map →                          │
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Loading | — | Not applicable — static export. |
| Active / populated | A foundation with one or more prereqs, mid-sequence | Movement name, position in the full path, position within the movement, and a "Read first" line naming every prereq as a real link — not necessarily just the immediately preceding piece, since prereqs can legitimately cross movements (e.g. `distributed-transactions` reasonably names both `transactions` and `partitioning`). |
| Empty (no prereqs) | The first piece in the path, or any piece whose author records no prerequisite | The "Read first" line doesn't render — no placeholder text, matching the existing absence-is-resting-state convention. |
| Error | Missing or invalid position/prereq data on a foundation topic | Fails `next build`, the same fail-closed rule "currency is never guessed" already applies to every other piece of topic state — never a rail rendered with a blank or wrong position. |
| Degraded | A *prereq* names a slug that doesn't exist yet | The prereq list is free text, so an unresolved prereq renders as an ordinary link and 404s on click — like any unvalidated cross-link today (`research/content-model-audit.md` defers link-graph validation to a separate small bet). The forward **Continue** pointer is *not* exposed to this: `02-data-flows.md` flow (b) and `04-data-design.md` decision 5 derive `next` from the live sweep, so it only ever points at a piece that exists. Prereqs are the one link class here that can 404, and only until that deferred bet lands. |

**Key interactions:**
- Reader clicks a "Read first" prereq name → navigates to that foundation.
- Reader clicks "Continue: `<next piece>` →" → navigates to the next piece in reading order, or to the hub if this was the last piece.
- Reader arriving via keyboard or screen reader → the rail is a `<nav aria-label="Reading path position">`, landmarked and announced distinctly from the trust header and the main article, so its links are discoverable without reading the whole instrument as prose.

**Micro-polish spec:**

- *Motion:* No entrance animation — static content, paints with the page. Every link in the rail (prereqs, the continue pointer) uses the identical link-hover recipe as the hub's rollup band: `--color-accent` → `--color-accent-strong`, underline to full alpha, at `--duration-fast`/`--ease-standard`. No press/scale effect — these are text links, not chrome, and the interaction-states spec reserves the `scale(0.985)` press exclusively for chrome, never for text links.
- *Atmosphere / material:* This is the second instance of the **Instrumentation Strip** named in the hub view — flush on `--color-surface`, no well, no shadow. The header instance (movement/position/prereqs) closes with the same `--space-4`-padding / 1px-`--color-rule`-bottom-rule / `--space-6`-margin rhythm as the trust header and the catalogue rollup. If the footer "Continue" pointer is adopted, it mirrors the *opening* half of that rhythm instead — a `--color-rule` top rule with `--space-9`/`--space-6` margin/padding — the same shape `.provenance` already uses to announce "the trust apparatus continues past the essay's last paragraph."
- *Static micro:* The movement/position line and the "Read first" line are both `--text-meta` (mono 420, 0.8125rem/1.5, `--color-text-secondary`) — the trust header's own register, because this rail is part of the same trust apparatus, not essay prose. Position figures ("5 of 17", "4th of 5") render in tabular numerals. Prereq names are real links in `--color-accent` with the standard underline treatment (45%-alpha decoration color, 0.15em offset) — `.trust-header a`'s exact recipe. The footer "Continue" pointer does *not* borrow the reserved `arrow-up-right` glyph — that icon means "leaves the site" everywhere else it appears, and reusing it here would misstate an internal link as external. It reuses the plain "→" text arrow the changelog cards already use for "Read entry →", at `--text-ui` (sans 450, 0.875rem) — no new icon, no new glyph.

**Resolved — header-and-footer, unconditionally** (was: header-only vs. header-and-footer). This
view originally flagged the footer "Continue" pointer as a dangling-link risk needing an editorial
mitigation. `04-data-design.md` decision 5 closes that mechanically: `getReadingPosition` derives
`next` from the live sweep (`02-data-flows.md` flow b), so the forward pointer can only ever name a
piece that exists — it cannot dangle. The design adopts both halves, the header rail and the footer
pointer, with no editorial guard required. Backward `prereqs` stay free text and can still 404 until
the deferred link-graph bet lands — see the Degraded state above.

---

#### New design-system patterns this bet requires

None of these need new component code beyond what each view already scopes — they need naming
in `docs/design-system.md` so the next bet inherits them instead of re-deriving them.

| Pattern | What it is | Where it's used |
|---|---|---|
| Instrumentation Strip | A flush band for a single trust fact that doesn't belong in the trust header itself: `--text-label` heading, `--text-meta` body, closed by a `--space-4`/1px-rule/`--space-6` rhythm. | Catalogue Freshness Rollup (hub); Reading-Order Rail (foundations) |
| Comparison Matrix | `.article-body table` plus a sticky first column, row-hover wash, and tabular numerals — no new component, still a markdown table through the existing pipeline. | The hub's seven-profile matrix |
| Register-Group Disclosure | `.topic-disclosure`'s exact recipe one level up, with a trailing mono count. | Sidebar's Foundations / Profiles groups |
| Movement Divider | `.nav-section-label`'s exact recipe, non-interactive, indented one step deeper. | Sidebar, inside Foundations |
| `badge-core` | `badge-sourced`/`badge-synthesis`'s exact recipe, new semantic pairing, text "core." | Sidebar tree, library cards |

#### Open UX decisions for the operator

1. **Movement sub-grouping in the sidebar** (View 2) — *resolved 2026-07-28 (operator, via the `04-data-design.md` amendment)*: as recommended — sub-grouped in the sidebar only, never the library grid.
2. **Reading-order rail — header-and-footer** (View 3) — *resolved*: both halves, unconditionally. `04-data-design.md` decision 5's derived `next` makes the forward "Continue" link structurally unable to dangle, so no editorial mitigation is needed.
3. **Rollup content depth** (View 1) — *resolved 2026-07-28 (operator)*: one aggregate line (total, fresh count, most-recent). The per-register breakout stays available to a future bet if the single line proves too thin in use.
4. **Register-group default state** (View 2) — *resolved 2026-07-28 (operator)*: open on first load, matching "recognition over recall."
5. **Movement display names** (View 2, View 3) — *resolved 2026-07-29 (operator)*: the plain-language set "Capacity," "Single Node," "Distributed," "Caches & Derived Data," "Operations" — names that state the contents; the earlier gerund/metaphor forms were rejected. These exact strings are what authors hand-type into all 17 pieces of frontmatter.
