## API Design

*This bet touches one embedded core (`@staycurrent/core`) called in-process by one app
(`services/site`) — there is no cross-service HTTP boundary here, so "interface" below means a
function's full signature, exactly as `docs/architecture/index.md` §7 already commits ("its
contract is a typed module API... capability behaviour is proven headless against the module API
with no surface running"). Four entries: one existing function's extended contract
(`validateTopicFrontmatter`), two new `content.ts` accessors, and one new `freshness.ts`
function. Type and interface shapes below are the contract — this project's own convention
copies them verbatim into `core/src/types.ts` at implementation time (see that file's header
comment). Function bodies are described in prose, never written out, per this phase's
implementation-code restriction.*

**Contract serves every in-scope surface.** This bet's only surface is `site`
(`docs/bets/databases-catalogue/pitch.md` frontmatter). Per this workflow's own instruction, the
latent agentic surface stands in as the second consumer: every accessor below is a plain,
JSON-shaped return value with no session, viewport, or markup baked in — a programmatic caller
with no UI would find these contracts complete without adaptation.

---

#### `validateTopicFrontmatter` (extended) — `core/src/frontmatter.ts`

**Purpose:** unchanged in kind: the one function that turns a raw parsed-YAML object into a
`TopicFrontmatter`, or a list of issues — shared verbatim by every loader (`loadTopic`,
`listTopics`) and the publish gate's `frontmatter-schema` check (`runPublishGate.ts`, check 10).
This bet extends it to also carry seven additive display fields through to the returned value,
without ever letting them produce an issue.

**Signature (unchanged):**
```
validateTopicFrontmatter(data: Record<string, unknown>, slug: string): FieldValidation<TopicFrontmatter>
```

**Input:** unchanged — `data`, the raw frontmatter object `gray-matter`/`js-yaml` parsed (may
carry any keys; unknown keys have always been tolerated, per `04-data-design.md`); `slug`, the
directory name `data.topic` must match.

**Output:** unchanged shape, grown value. On success, `value` is a `TopicFrontmatter` carrying
the seven required fields exactly as today, plus whichever of the seven additive fields extracted
cleanly:

```
export type TopicRegister = 'foundation' | 'profile' | 'hub';

export interface ProfileAxes {
  consistency_model?: string;
  partition_strategy?: string;
  query_language?: string;
  scaling_axis?: string;
  latency_profile?: string;
  durability_guarantee?: string;
  transaction_support?: string;
  operational_maturity?: string;
}

export interface TopicFrontmatter {
  topic: string;
  title: string;
  stance: string;
  version: number;
  status: 'current' | 'in-research';
  cadence: `${number}d`;
  last_researched: string;
  // --- additive display fields (databases-catalogue bet) — optional, unvalidated ---
  area?: string;
  register?: TopicRegister;
  movement?: string;
  reading_order?: number;
  prereqs?: string[];
  core?: boolean;
  axes?: ProfileAxes;
}
```

Extraction rule per additive field:

| Field | Extracted when the raw value is... | Kept as | Otherwise |
|---|---|---|---|
| `area` | a string, non-blank after the same zero-width-stripping trim `isBlankField` already applies to `title`/`stance` | verbatim | `undefined` |
| `register` | exactly `'foundation'`, `'profile'`, or `'hub'` | verbatim, typed `TopicRegister` | `undefined` |
| `movement` | a string, non-blank | verbatim | `undefined` |
| `reading_order` | a number, `Number.isInteger`, `> 0` | verbatim | `undefined` |
| `prereqs` | an array where every element is a string | verbatim (the parsed array, unmodified) | `undefined` |
| `core` | a boolean | verbatim | `undefined` |
| `axes` | a plain object | a new object copying only the eight recognized `ProfileAxes` keys whose value is a non-blank string; unrecognized keys and non-string values are dropped silently | `undefined` if the raw value is not an object, or the copy ends up with zero keys |

**Errors:** unchanged. Only the seven required fields can add an entry to `issues`. None of the
seven additive rows above ever does, regardless of whether the raw value is missing,
wrong-typed, or malformed. This is the load-bearing behavioral contract: **a malformed or absent
additive field never fails validation, never blocks a cut, never blocks a build.**

**Design rationale:** [ADR 0006](../../../architecture/decisions/0006-gate-shares-the-loaders-schema-path.md)
established that the publish gate validates by calling this exact function rather than a second,
gate-only schema — "the gate and the reader see one schema." Extending extraction *inside*
`validateTopicFrontmatter`, rather than adding a second `extractDisplayFields` helper the loaders
would call separately, keeps that guarantee intact for free: `runPublishGate.ts`'s
`checkFrontmatterSchema` (check 10, around line 405) already calls this function and only
inspects `issues`. Since the seven new rows never populate `issues`, check 10's behavior is
unchanged by construction, not by a second manual update — see Gate↔loader parity, below.

`register` is typed as a closed union (`TopicRegister`) while `area` and `movement` stay open
strings. This is a deliberate asymmetry. `foundation`/`profile`/`hub` describe the *shape* of a
hub-and-spoke catalogue generically — any future area built on this pattern reuses these three
words, the way every topic already reuses `status: 'current' | 'in-research'` regardless of
instance — while `area` (`"databases"`) and `movement` (`"Single Node"`) are this instance's own
editorial taxonomy, exactly as instance-specific as a topic's `title`. A closed-union `register`
costs nothing extra to extract leniently (it still never raises an issue on a bad value) and
buys real type safety for every downstream consumer.

---

#### `getCatalogues` — `services/site/lib/content.ts`

**Purpose:** the single grouping accessor behind both display views in 01-ui-design.md's "Topic
Library and Sidebar — Databases-Area Grouping." Sweeps every topic, buckets each by `area` then
`register`, and orders foundations by movement and both foundations and profiles by
`reading_order`. The sidebar tree and the library grid both render from its output; they differ
only in how much of the shape a nav tree versus a card grid can carry (01-ui-design.md).

**Signature:**
```
getCatalogues(root: string = REPO_ROOT): Catalogue[]
```

**Input:** `root` — the same optional repo-root override every other `content.ts` accessor
takes (`STAYCURRENT_REPO_ROOT`, or the default two levels above `process.cwd()`). No area
argument — see Design rationale.

**Output:**
```
export interface CatalogueEntry {
  slug: string;
  title: string;
  stance: string;
  version: number;
  register?: TopicRegister;       // absent on an ungrouped entry whose authored register was
                                  // missing or unrecognized (core extraction drops both to
                                  // undefined — indistinguishable downstream, by design)
  movement?: string;               // upper bound: present only when register === 'foundation'
  readingOrder?: number;           // upper bound: register === 'foundation' | 'profile'
  core?: boolean;                  // upper bound: register === 'profile'; true for the featured trio
                                   // (an ungrouped entry may carry register with a field missing —
                                   // e.g. 'foundation' without movement)
}

export interface CatalogueMovement {
  name: string;                    // verbatim movement label, e.g. "Single Node"
  entries: CatalogueEntry[];       // ordered by readingOrder ascending
}

export interface Catalogue {
  area: string;
  hub: CatalogueEntry | null;      // null iff no topic in this area declares register: 'hub';
                                   // if more than one does, the slug-alphabetical first wins
                                   // and the rest land in `ungrouped` (an authoring defect the
                                   // build tolerates and the next editorial pass fixes)
  movements: CatalogueMovement[];  // ordered by the lowest readingOrder any member carries
  profiles: CatalogueEntry[];      // ordered by readingOrder ascending
  ungrouped: CatalogueEntry[];     // register missing/unrecognized, or 'foundation' without movement
}
```

One `Catalogue` per distinct `area` value found in the sweep, sorted by `area` ascending.
`getCatalogues(root)` returns `[]` when no topic in the tree carries an `area` at all — the
state every topic in this repository is in before this bet's first wave lands.

**Errors:** none of its own. Propagates `sweepOrThrow`'s fail-closed throw verbatim (an `Error`
naming every invalid topic) for a malformed topic anywhere in `topics/`, or for a mis-resolved
`root` with no `topics/` directory at all — identical contract to `listTopicCards`.

**Design rationale:** No area argument, and no assumption that exactly one `Catalogue` exists,
because `docs/architecture/index.md` §4 commits that `services/site` "never names the instance."
A function signature that defaulted to (or required) the literal string `"databases"` would bake
this bet's own content into engine code the framework's next adopter inherits verbatim.
Returning `Catalogue[]` costs one extra grouping pass over a design that hardcoded a single
area, and it is the only version of this function a future second catalogue-shaped area could
reuse unchanged.

`CatalogueEntry` deliberately omits `cutDate`/`isFresh` — the same split `app/layout.tsx`'s
existing `buildTopicNavEntries` already draws: `content.ts` hands back sweep-cheap facts, and
the caller fans out `getTopicCutDate` (and, where needed, `isFresh`) per entry it actually needs
a date for. Baking a `loadVersion` call into every `CatalogueEntry` would pay that cost even for
callers — a card-grid render, say — that never show a date, and would blur a boundary this
codebase keeps clean everywhere else.

---

#### `getReadingPosition` — `services/site/lib/content.ts`

**Purpose:** resolves 01-ui-design.md's "Foundation Reading-Order and Prereqs" rail — this
piece's position in the reading path and within its own movement, its prereqs resolved to real
(or best-effort) titles, and the next piece to read.

**Signature:**
```
getReadingPosition(frontmatter: TopicFrontmatter, root: string = REPO_ROOT): ReadingPosition | null
```

**Input:** `frontmatter` — the topic's own frontmatter, which the caller already holds from
`getTopic(slug)` for the page's other needs (trust header, body); this function does not
re-load it, matching `content.ts`'s established "read once, pass in" shape (see
`getTopicVersion`'s own doc comment for the precedent). `root` as above.

**Output:**
```
export interface ReadingPathLink {
  slug: string;
  title: string;      // the linked topic's real title if it exists in the sweep;
                       // otherwise its slug humanized (kebab-case → Title Case words)
}

export interface ReadingPosition {
  movement: string;
  indexInPath: number;          // 1-based position among this area's path members — the
                                // foundations carrying a movement (an unannotated foundation
                                // sits in `ungrouped` and is not on the path)
  totalInPath: number;          // how many path members this area currently has
  indexInMovement: number;      // 1-based position within just this movement
  totalInMovement: number;      // how many foundations share this movement
  prereqs: ReadingPathLink[];   // [] when the topic authored none — renders no "Read first" line
  next: ReadingPathLink | null; // the following foundation in reading order; null on the last piece
}
```

**Errors:** none — a total function. Returns `null` (never throws) when
`frontmatter.register !== 'foundation'`, or `frontmatter.area` is blank, or
`frontmatter.reading_order` is not a valid positive integer, or — defensively — this topic's own
slug is not found among its area's resolved foundations after those checks pass.

**Design rationale:** `null`-on-inapplicable rather than throwing, because `reading_order` and
`movement` are unvalidated additive fields (`04-data-design.md`): a foundation that has not yet
been annotated with them must render normally, without a rail, not fail the build. This is a
deliberate asymmetry with the loaders proper. `loadTopic` fails closed on the seven required
fields because they are load-bearing state ("currency is never guessed"); these two are optional
display data, and treating a missing one as a build failure would make an unvalidated field
behave like a gate check by accident — exactly what the pitch's no-gos forbid.

`next` is computed by walking the same live sweep `indexInPath` is computed from; it is never
authored as its own free-text field. This resolves 01-ui-design.md's open decision 2
("header-only vs. header-and-footer") in the safer direction: that document originally flagged
the footer "Continue" pointer as the design's most exposed dangling-link risk, because
an *authored* forward pointer could name a piece that has not cut yet, and it proposed an
editorial discipline as a stopgap. A derived `next` can only ever name a slug the sweep has
already proven exists, which removes that risk mechanically rather than by discipline — see
`04-data-design.md`'s Decisions for the operator, item 5. `prereqs` keeps the free-text,
fallback-title design instead, because unlike `next` it points *backward* at pieces a wave may
not have reached yet even when authored correctly, and validating it is explicitly deferred as
its own small bet (`research/content-model-audit.md`).

---

#### `summarizeCatalogueFreshness` — `services/site/lib/freshness.ts`

**Purpose:** turns a list of per-topic cut dates into the Catalogue Freshness Rollup's three
numbers (01-ui-design.md's "ACROSS THE CATALOGUE" band) — total count, how many are inside the
14-day freshness window, and which one cut most recently. Pure date math, consistent with every
other function in this module.

**Signature:**
```
summarizeCatalogueFreshness(
  entries: CatalogueFreshnessInput[],
  now: Date = new Date()
): CatalogueFreshness
```

**Input:**
```
export interface CatalogueFreshnessInput {
  slug: string;
  title: string;
  cutDate: string;   // ISO date — the CURRENT version's cut, from getTopicCutDate; never last_researched
}
```
`now` — an injectable clock, the same pattern `isFresh` and `runPublishGate`'s
`PublishGateOptions.now` already use, so a test can pin "today" rather than depend on the real
clock.

**Output:**
```
export interface CatalogueFreshness {
  totalCount: number;
  freshCount: number;     // entries where isFresh(cutDate, now) is true
  mostRecentlyCut: { slug: string; title: string; cutDate: string } | null;  // null iff entries is []
}
```

**Errors:** none — a total, pure function. `entries: []` returns
`{ totalCount: 0, freshCount: 0, mostRecentlyCut: null }` rather than throwing; a caller only
ever passes an empty list for an area with zero topics, which is a valid, if inert, state — not
an error.

**Design rationale:** lives beside `isFresh` in `freshness.ts`, not in `content.ts`, because it
is exactly what this module's own docstring already scopes itself to — "pure date math... no
`@staycurrent/core` call" — extended from one date to a list of them. Ties in `mostRecentlyCut`
(two topics cut the same day) break by `slug` ascending: the identical rule `listSiteChangelog`
already documents for the same situation (`Array#sort`'s documented stability over `listTopics`'
own slug-ascending base order). One house convention for "same-day cuts," not two.

---

#### Gate↔loader parity (retro R1 / ADR 0006)

The pitch's retro item R1 commits: "the patch types new frontmatter keys → verify gate↔loader
parity in one pass, ADR 0006 standard." Verified against the design above:

- **What changed:** `core/src/frontmatter.ts`'s `validateTopicFrontmatter` — the one function
  `loadTopic`, `listTopics`, and `runPublishGate`'s check 10 (`frontmatter-schema`) all call —
  now also extracts seven additive fields, none of which can ever add an `issues` entry.
- **What did not change:** `runPublishGate.ts` itself. Its `checkFrontmatterSchema` calls
  `validateTopicFrontmatter` and turns `issues` into `GateFailure`s. Since the new extraction
  never touches `issues`, this check's behavior — what it accepts, what it rejects — is
  identical before and after this bet, without a single line of gate code changing.
- **The parity, stated plainly:** the loaders now *read* seven more keys than the gate
  *validates*. That gap is the design, not an oversight — these keys are additive display
  frontmatter, explicitly not gate-validated structured fields, a pitch no-go. ADR 0006's
  standard ("the gate and the reader see one schema") holds exactly because both still call the
  identical function; there is nothing for the gate to fall behind, because there is only one
  schema-reading code path to keep in sync with itself.
- **The other frontmatter loader, and why the keys never reach it:** the parity above covers
  the *live* `article.md` path. There is a second frontmatter loader — `validateVersionFrontmatter`
  (`core/src/frontmatter.ts`), which reads `versions/vN/article.md` snapshots and is strict: it
  *rejects* any key outside `{version, cut}` at build time, and it is not gate-checked. An additive
  key that leaked into a snapshot would pass the gate and then break `next build`. It never leaks:
  the writer skill freezes snapshot frontmatter to `{version, cut}`
  (`.agents/skills/staycurrent-writer/SKILL.md` § versions/vN snapshot) and `createTopic` writes
  exactly `{version, cut}`. The seven keys therefore live only on the live article, never in a
  snapshot — the frontmatter asymmetry `04-data-design.md` keeps is exactly what holds them out of
  the strict loader. R1 is verified across *both* frontmatter loaders, not only the one the gate shares.
- **The trigger this leaves recorded:** if a future bet ever wants one of these seven keys
  gate-validated — say, requiring every foundation to carry `reading_order` before it can cut —
  ADR 0006 and this retro item both name the rule for that day: add the check to
  `runPublishGate.ts` and the corresponding `issues`-raising branch in `validateTopicFrontmatter`
  in the same pass, never one without the other. Nothing in this bet does that; it is named here
  so the next bet that touches these fields does not have to rediscover the rule.

---

### Refinements recorded at delivery (slice 1.2 review, 2026-07-29)

Review-approved resolutions of cases the design left unstated, recorded per the amendment
protocol rather than left as code-only knowledge:

1. `CatalogueEntry.register` is optional (interface above) — the design's required typing was
   internally inconsistent with its own ungrouped definition; a fourth sentinel value or a
   separate entry type were both judged worse at review.
2. "Register missing" and "register unrecognized" are indistinguishable downstream — core
   extraction drops both to absent; `ungrouped` cannot report which defect occurred.
3. Ordering when `reading_order` is absent: such entries sort last within their bucket, a
   movement whose members all lack it sorts last among movements, ties fall back to
   slug-ascending; movement-carrying foundations without `reading_order` remain path members,
   count in `totalInPath`, and can be returned as `next`.
4. `Catalogue.ungrouped` is slug-ascending (the sweep's own order).
5. `getReadingPosition`'s "Errors: none — a total function" is scoped to frontmatter input
   classes; it still propagates `sweepOrThrow` on a malformed sweep or mis-resolved root,
   per flow (b) step 2 composing on flow (a)'s fail-closed path.
6. Area ordering uses `localeCompare` (the repo's existing `listTopics` convention) — "sorted
   ascending" means that comparator, which is case-insensitive-ish.
7. Prereq links derived for the rail drop blank or whitespace-only authored entries entirely
   (absence-is-resting-state) — the rail never renders blank text or an empty href (flow (b)
   step 3's own requirement, closed against `prereqs: [""]` which passes extraction).
