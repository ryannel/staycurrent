## API Design

Stay Current's core is embedded (architecture §7) — there is no network to put an interface on, so the contract this section specifies is `@staycurrent/core`'s typed public module API: every exported type and function `site`, `workbench/cli.mjs`, and CI call in-process. The discipline is OpenAPI's discipline written in TypeScript's grammar (`api-and-contracts.md`, Embedded cores): full signatures, every field typed, every throw case named, rationale for the non-obvious calls. Implementation bodies are not specified here — only the shapes a caller programs against. Delivery implements against these signatures, and `core/dist/index.d.ts` becomes the literal, compiler-checked record of this contract once built.

#### content-core — embedded module API

**Exported types.** The frontmatter-shaped types below use field names and closed value sets copied verbatim from the design system's state-architecture schemas and `docs/architecture/domain/*.md` — no independent naming was introduced. Two parsing notes apply to every ISO-date field (`last_researched`, `cut`, `accessed`, `date`): (1) they are typed `string`, not `Date` — gray-matter's YAML parser auto-coerces an unquoted `YYYY-MM-DD` into a JS `Date` under YAML's core schema, and content-core normalizes every such field back to its ISO string form at parse time so a loaded value is always the same shape whether it came from frontmatter, a heading, or a table row; and (2) the type only documents intent — untrusted parsed content still needs the runtime validation named in each function's Errors section. Similarly, `cadence: \`${number}d\`` documents the expected shape; the runtime check is the `^\d+d$` regex applied wherever a topic is loaded or gated.

```ts
interface TopicFrontmatter {
  topic: string;                       // kebab-case slug; must equal the parent directory name
  title: string;
  stance: string;                      // one-sentence committed position (the ≤3-sentence callout budget is the article body's, not this field's)
  version: number;                     // positive integer, monotonic — increments only at a cut
  status: 'current' | 'in-research';   // the only two stored values, ever — `due` is never stored
  cadence: `${number}d`;               // research interval, e.g. '90d'
  last_researched: string;             // ISO 8601 date, YYYY-MM-DD
}

interface TopicSummary extends TopicFrontmatter {
  due: boolean;   // derived: last_researched + cadence(days) < today; computed independent of `status`
}

interface VersionSnapshot {
  version: number;   // matches the versions/vN/ directory number
  cut: string;        // ISO 8601 date the snapshot was written
}

interface ChangelogEntry {
  version: number;
  date: string;                                  // ISO 8601 date, parsed from '## vN — YYYY-MM-DD'
  bodyMd: string;                                  // the entry body, heading line stripped
  bodyHtml: string;                                 // bodyMd rendered through renderMarkdown()
  stance: 'held' | 'bent' | 'reversed' | null;      // null only for the v1 founding entry
}

interface ProvenanceRecord {
  sources: Source[];
  synthesis: string[];   // one entry per '## Synthesis' bullet, stated plainly
}

interface Source {
  title: string;
  url: string;
  accessed: string;    // ISO 8601 date
  supports: string;     // free text: which claim(s) this source backs
}

interface ResearchLogEntry {
  date: string;                 // ISO 8601 date
  outcome: 'cut' | 'no-cut';
  version?: number;             // present only when outcome === 'cut' — the version produced
  lines: string[];               // 2–4 factual lines, one array entry per line
}

interface TocEntry {
  depth: number;    // 1–6, the heading's level
  text: string;
  id: string;         // the generated heading-anchor id
}

interface RenderedDoc {
  html: string;
  toc: TocEntry[];
}

type GateCheckId =
  | 'snapshot-complete'
  | 'changelog-top-entry'
  | 'article-version-match'
  | 'skill-version-match'
  | 'skill-byte-identical'
  | 'provenance-non-empty'
  | 'slug-matches-dirname'
  | 'reserved-slug'
  | 'cadence-date-valid';

interface GateFailure {
  check: GateCheckId;
  path: string;      // dir-relative path of the offending artifact
  message: string;    // human-readable — see the per-check message shape in Publish Gate below
}

interface GateResult {
  ok: boolean;
  failures: GateFailure[];   // empty iff ok === true
  dir: string;                // the directory this result validated — binds the result to its tree (executeCut refuses any other)
}
```

**Additional supporting types** — not requested by name above, needed to give the functions below complete, typeable signatures:

```ts
// Errors — every throw in this module is one of these three, never a bare Error
class ContentValidationError extends Error {
  readonly topic: string;
  readonly file: string;      // dir-relative path of the offending file
  readonly issues: string[];   // one entry per violated field or rule
}
class ContentNotFoundError extends Error {
  readonly topic: string;
  readonly path: string;       // dir-relative path that does not exist
}
class GateNotPassedError extends Error {
  readonly failures: GateFailure[];
}

interface RenderMarkdownOptions {
  mermaid?: boolean;           // default true — rewrite ```mermaid fences into the client-rendered diagram marker
  headingIdPrefix?: string;     // default '' — namespaces generated heading-anchor ids
}

interface PublishGateOptions {
  now?: Date;   // injectable clock for the cadence-date-valid check; defaults to the current date
}

interface Topic {
  frontmatter: TopicFrontmatter;
  due: boolean;
  body: RenderedDoc;
  bodyMd: string;
}

interface Version {
  meta: VersionSnapshot;
  article: RenderedDoc;
  articleMd: string;
  skillDir: string;             // root-relative fs path to versions/vN/skill/ — content-core does not parse skill file contents
  provenance: ProvenanceRecord;
}

interface TopicError {
  slug: string;
  message: string;    // what failed schema validation, naming the file and field
}

interface TopicSweep {
  topics: TopicSummary[];   // every topic that parsed and validated
  errors: TopicError[];      // every topic that did not — the sweep never fails fast
}

interface StagedCut {
  dir: string;        // absolute path to .staycurrent/staged/<slug>/ — a full prospective topics/<slug>/ tree; basename == slug
  topic: string;
  version: number;     // the N this stage targets (1 from createTopic; live version + 1 from stageCut)
}

interface CreateTopicOptions {
  title: string;    // display title; stance and body are authored into the staged draft afterwards
}

interface CutReport {
  topic: string;
  version: number;
  paths: string[];      // every artifact path written under topics/<slug>/, root-relative
  removed: string[];     // files deleted from topics/<slug>/ because they are absent from the staged tree (the landing is a sync)
}

interface NoCutInput {
  lastResearched: string;      // ISO date, normally today
  researchLogLines: string[];
}

interface ConveneResult {
  topic: string;
  againstVersion: number;    // the live version this run researches against
  stagedDir: string;          // .staycurrent/staged/<slug>/ — the seeded baseline the run's drafts are authored into
}

interface ReconcileOptions {
  sessionExists?: boolean;              // single-slug form: whether .staycurrent/sessions/<slug>.md exists — supplied by the caller
  sessions?: Record<string, boolean>;    // sweep form: slug → session-file existence, supplied by the caller
}

interface ReconcileReport {
  reverted: string[];   // slugs whose status was reverted in-research → current (filesystem wins)
}

interface SiteConfig {
  name: string;
  url: string;           // canonical origin, no trailing slash — e.g. 'https://staycurrent.dev'
  description: string;
  author: string;
}
```

---

**Loading API.** The throw contract splits by call shape. The per-topic loaders (`loadTopic`, `loadChangelog`, `loadVersion`, `loadResearchLog`) throw on a topic that fails schema validation — never silently skipped or partially returned — so the site build fails closed on any malformed topic it renders. The catalogue sweep (`listTopics`) is the one deliberate exception: it returns per-topic errors alongside the valid summaries instead of failing fast, because its callers need the whole catalogue's health in one pass — `status` reports every broken topic and exits nonzero; `buildRss` converts any reported error into a throw, so the build stays fatal either way. `ContentValidationError`/`ContentNotFoundError` are the only failure shapes any loader throws (`GateNotPassedError` belongs to Cut mechanics, below).

**`listTopics(root: string): TopicSweep`**

**Purpose:** The frontmatter sweep (Context Injection Strategy, L1) — every catalogue question ("what topics exist, what's due, what's broken") answers from this one call, at the cost of one directory listing plus N small file reads.

**Request:**
```
root: string   — absolute path to the instance repo root (the directory containing topics/)
```

**Response:**
```
TopicSweep {
  topics: TopicSummary[]   — one entry per valid topics/<slug>/ subdirectory, sorted by slug ascending
  errors: TopicError[]      — one entry per topic whose article.md failed schema validation
}
```

**Errors:**
- Does not throw for a malformed topic — that is the `errors` array's job (wrong field type, `status` outside the closed set, `cadence` not matching `<int>d`, `topic` not equal to its directory name); each entry's `message` names the file and the violated field.
- Never throws for zero topics — returns `{ topics: [], errors: [] }` (the design system's "first run, zero topics" state is valid, not an error).

**Design rationale:** Collects errors rather than failing fast because the sweep answers catalogue-health questions: one broken topic must not hide the rest of the catalogue from `status` — the operator repairing it still needs to see what else is due. Fail-closed is preserved where it matters: `loadTopic` (the site build's per-page path) still throws, `buildRss` treats a non-empty `errors` as fatal, and `status` exits `1` whenever `errors` is non-empty. Sorted by slug, not by urgency — ranking "what's due" is presentation logic for the caller, and content-core stays opinion-free about what "furthest over" means to a surface. `due` is computed here from the formula, independent of `status`, so an `in-research` topic can also read `due: true` — informational, never contradictory, and never stored (§ State management).

---

**`loadTopic(root: string, slug: string): Topic`**

**Purpose:** Loads one topic's full live state — frontmatter, derived `due`, and the rendered article — for a topic page or a workbench session's L2 context.

**Request:**
```
root: string
slug: string   — must name an existing topics/<slug>/ directory
```

**Response:**
```
Topic {
  frontmatter: TopicFrontmatter
  due: boolean
  body: RenderedDoc
  bodyMd: string
}
```

**Errors:**
- Throws `ContentNotFoundError` — no `topics/<slug>/` directory exists.
- Throws `ContentValidationError` — frontmatter fails schema validation, or `frontmatter.topic !== slug` (the reconciliation check named in `domain/topic.md`).

**Design rationale:** Returns `bodyMd` alongside `body` because the writer skill needs the raw markdown to compute a session's article deltas, while the site needs only the rendered form — returning both avoids a second parse for the one caller that needs text. `loadTopic` deliberately does **not** perform the `in-research`-with-no-session-file reconciliation the design system's Cold-start resolution describes: a loader never mutates, and the filesystem-wins revert is a mutation. `loadTopic` reports `status` exactly as stored; the reconciliation is `reconcile()`'s job (Session mechanics, below), which the `status` CLI command invokes before printing.

---

**`loadChangelog(root: string, slug: string): ChangelogEntry[]`**

**Purpose:** Parses `changelog.md` into structured, rendered entries for the changelog page and for `buildRss`.

**Request:**
```
root: string
slug: string
```

**Response:**
```
ChangelogEntry[]   — newest first (file order; changelog.md is append-only-at-top by contract)
```

**Errors:**
- Throws `ContentNotFoundError` — `changelog.md` is missing.
- Throws `ContentValidationError` — a heading is not `## vN — YYYY-MM-DD`; entries are not strictly version-descending or a version number repeats or gaps; a non-v1 entry has no parseable `**Stance:**` line, or its value is outside `held | bent | reversed`; the v1 entry carries a `**Stance:**` line (only the founding entry may omit it, per Document Architecture).

**Design rationale:** Renders `bodyHtml` eagerly (via `renderMarkdown`) so the changelog page and `buildRss` share one parse of one file — a changelog entry is never rendered two different ways. The strict-descending-order validation is defensive rather than load-bearing at write time (only content-core ever appends, one entry per cut, always at the top) — but a gap or reorder can only mean the file was edited outside the action contract, exactly the drift class the gate exists to catch, and a reader of the changelog benefits from a loud failure over a silently wrong timeline.

---

**`loadVersion(root: string, slug: string, n: number): Version`**

**Purpose:** Loads one immutable snapshot — rendered article, the skill payload's filesystem location, and structured provenance — for a version-history page or an audit of one cut.

**Request:**
```
root: string
slug: string
n: number   — positive integer; must name an existing versions/vN/ directory
```

**Response:**
```
Version {
  meta: VersionSnapshot
  article: RenderedDoc
  articleMd: string
  skillDir: string           // root-relative path to versions/vN/skill/
  provenance: ProvenanceRecord
}
```

**Errors:**
- Throws `ContentNotFoundError` — `versions/vN/` does not exist for the given `n`.
- Throws `ContentValidationError` — `versions/vN/article.md`'s frontmatter does not match the version-snapshot schema (exactly `version` and `cut`, no `status` field — `domain/version.md`); `provenance.md` does not parse under the bullet grammar below.

**Design rationale:** Does not compute or return `current`/`superseded` — that label is always a comparison against the *live* article's version (`domain/version.md`), which this call has no access to (it reads one version directory only) and should not infer speculatively. The caller (site) already holds both `loadTopic`'s `frontmatter.version` and this call's `meta.version` at render time and derives the label itself, so the derived fact is computed in exactly the one place its inputs are both in hand — never stored, never duplicated. `skillDir` is a filesystem path, not parsed content: the site serves that directory's files directly and builds the per-version zip from them, so content-core parsing skill file contents here would be work with no reader. `provenance.md`'s bullet grammar is not fixed anywhere else in the docs, so it is fixed here as the parseable contract every provenance record must follow: `## Sources` bullets are `- [<title>](<url>) — accessed <YYYY-MM-DD> — supports: <claim>`; `## Synthesis` bullets are `- <claim>`. A bullet that doesn't match throws `ContentValidationError` naming the line.

---

**`loadResearchLog(root: string, slug: string): ResearchLogEntry[]`**

**Purpose:** Parses `research-log.md` into structured entries, newest first — the record every convened run leaves, cut or no-cut.

**Request:**
```
root: string
slug: string
```

**Response:**
```
ResearchLogEntry[]   — newest first
```

**Errors:**
- Throws `ContentNotFoundError` — `research-log.md` is missing (every topic has one from creation; `domain/topic.md`, Notes).
- Throws `ContentValidationError` — a heading is not `## YYYY-MM-DD — cut vN` or `## YYYY-MM-DD — no-cut`, or a `cut` entry carries no parseable version number.

**Design rationale:** Not named in this section's original list, added here to give `ResearchLogEntry` a reader — a type with no loader would be dead on arrival for the `status` command's history and any future site history view. Mechanically identical to `loadChangelog`: parse a newest-first, append-only log against a fixed heading grammar, so it is grouped with the Loading API rather than given its own boundary.

---

**`renderMarkdown(md: string, opts?: RenderMarkdownOptions): RenderedDoc`**

**Purpose:** The one rendering pipeline every markdown body in the system goes through — article bodies, changelog entry bodies — so GFM tables, heading anchors, and mermaid-fence rewriting (architecture §3) behave identically everywhere they appear.

**Request:**
```
md: string                          — frontmatter-stripped body markdown
opts?: RenderMarkdownOptions {
  mermaid?: boolean = true          — rewrite ```mermaid fences into the client-rendered diagram marker
  headingIdPrefix?: string = ''     — namespaces generated heading-anchor ids
}
```

**Response:**
```
RenderedDoc { html: string, toc: TocEntry[] }
```

**Errors:**
- Does not validate content semantics and does not throw on malformed input under normal operation — markdown's grammar is permissive, and mermaid fence contents pass through unparsed (rendered client-side; architecture §3's "fenced source left readable when JavaScript is off" — content-core carries no server-side mermaid dependency and does not validate diagram syntax at build).
- May propagate a raw (non-domain) error only on a unified/remark pipeline crash — not expected on well-formed markdown, and if it happens it fails the build like any other content-core exception.

**Design rationale:** `headingIdPrefix` exists because one page can render more than one `RenderedDoc` into one DOM (a changelog page concatenating several entries) — without a prefix, two entries with an "Overview" heading collide on the generated id `#overview`. `mermaid` is a single boolean, not a richer options object, because the only decision content-core makes about a fence is whether to rewrite it into the client-component marker at all; theming, sizing, and the reserved-space CLS behavior are the site's rendering concern (architecture §3), not a rendering option here.

---

**Publish gate.** The nine mechanical checks from `docs/design-system.md` (Verification requirements) and `domain/version.md`'s invariants, formalized as one contract.

**How N is derived.** Every check resolves against one shared `N`: the highest version number present as a `versions/vN/` subdirectory inside `dir`. This makes the gate mode-agnostic — `dir` may be an already-committed `topics/<slug>/` (CI's per-topic re-validation, `cut`'s idempotency probe) or the staged tree at `.staycurrent/staged/<slug>/` (the `gate` command's pre-cut report, `cut`'s pre-commit check) — the same nine checks, the same code path, run either way (ADR 0003). This is also why `stageCut` seeds the staged tree as a complete copy of the committed topic rather than a diff: the gate must see the complete `versions/` set to compute `N` and check it end to end.

| # | id | inspects | failure message (`GateFailure.message`) |
|---|----|----------|-------------------------------------------|
| 1 | `snapshot-complete` | for every M in 1..N: `versions/vM/article.md`, `versions/vM/skill/SKILL.md`, `versions/vM/provenance.md` all exist | `missing required artifact: versions/v${M}/${artifact}` — one failure per missing file |
| 2 | `changelog-top-entry` | `changelog.md`'s first `## vX — <date>` heading | `changelog.md top entry is '## v${found}', expected '## v${N}'` (`found` is `<none>` for an empty file, `<malformed>` for an unparseable top line) |
| 3 | `article-version-match` | live `article.md` frontmatter `version` | `article.md frontmatter version is ${actual}, expected ${N}` |
| 4 | `skill-version-match` | live `skill/SKILL.md` frontmatter `article_version` | `skill/SKILL.md frontmatter article_version is ${actual}, expected ${N}` |
| 5 | `skill-byte-identical` | recursive byte comparison: live `skill/` vs `versions/v${N}/skill/` | `skill/${relPath} differs from versions/v${N}/skill/${relPath}` — one failure per differing or missing file |
| 6 | `provenance-non-empty` | `versions/v${N}/provenance.md`: `## Sources` + `## Synthesis` bullet count, combined | `versions/v${N}/provenance.md has no entries in Sources or Synthesis` |
| 7 | `slug-matches-dirname` | live `article.md` frontmatter `topic` vs `basename(dir)` | `article.md frontmatter topic '${actual}' does not match directory '${dirname}'` |
| 8 | `reserved-slug` | live `article.md` frontmatter `topic` vs `['skills','changelog','about','rss.xml']` | `article.md: topic slug '${topic}' collides with a reserved root path` |
| 9 | `cadence-date-valid` | `cadence` matches `/^\d+d$/`; `last_researched` and every `versions/vM/article.md`'s `cut` (M in 1..N) are valid ISO 8601 dates on or before `opts.now ?? new Date()` | `${file}: ${field} '${value}' is not a valid date on or before today` or `article.md: cadence '${value}' does not match <int>d` |

Every `message` names the exact missing or offending artifact path — that is a shape requirement, not a style: `GateFailure.path` always carries the same `dir`-relative path the message names (e.g. `versions/v6/provenance.md`, `skill/SKILL.md`), and the halt template's `Cause:` line and the `gate` command's per-failure lines are built directly from `check` + `message`, never a paraphrase.

**`runPublishGate(dir: string, opts?: PublishGateOptions): GateResult`**

**Purpose:** The one place gate logic exists (ADR 0003) — validates that `dir`, treated as a topic tree, is internally consistent across all nine checks above.

**Request:**
```
dir: string                 — a topic-shaped directory; its basename is the topic slug used by check 7
opts?: PublishGateOptions { now?: Date }
```

**Response:**
```
GateResult { ok: boolean, failures: GateFailure[], dir: string }
// ok is true iff failures.length === 0; dir echoes the directory validated
```

**Errors:**
- Never throws for content problems — every violation becomes a `GateFailure` entry, not an exception. This is the one function in the module deliberately designed not to throw on invalid content, because invalid content is its entire subject matter; a caller scripting against it (CI, the `gate` command) needs the complete list, not a stack unwound at the first problem.
- May propagate a raw fs error if `dir` itself does not exist — a usage error, not a content violation.

**Design rationale:** Runs all nine checks and aggregates every failure rather than failing fast, so an operator debugging a failed cut sees every problem in one pass instead of iterating the gate check-by-check. `opts.now` makes check 9 deterministic under test without mocking the system clock. `dir` is echoed into the result so a `GateResult` is bound to the tree it certified — `executeCut` refuses a result for any other directory (change-proposal-1: a pass for one tree must not authorize landing another). `stageCut`/`executeCut` never re-validate; every caller — the `gate` and `cut` commands, CI pre-deploy — calls exactly this function against exactly this directory shape.

---

**Cut mechanics.** One rule governs every write in this design, stated precisely: **only content-core functions mutate `topics/`; the `.staycurrent/` quarantine is workbench-writable.** The research and writer skills author draft artifacts directly into `.staycurrent/staged/<slug>/`, and the CLI owns the session files under `.staycurrent/sessions/` — but nothing under `topics/` is ever hand-edited: every `topics/` write below is a core call. The action contract's stage → gate → commit (design system, Skill Anatomy) is three explicit, sequential calls made by the CLI — no core function wraps another in this chain:

```
stageCut(root, slug)                → StagedCut          // seed the staged baseline (convene calls this internally)
runPublishGate(staged.dir)          → GateResult          // called directly — not reimplemented, not wrapped
executeCut(root, slug, gateResult)  → CutReport           // throws unless gateResult.ok and gateResult.dir is the staged tree
<CLI>: git add topics/<slug>/ && git commit -m "cut(<slug>): v<N>"
```

The staged tree lives at **`.staycurrent/staged/<slug>/`** — its basename equals the slug, so gate check 7 (`slug-matches-dirname`) resolves identically whether the gate runs against the staged tree or the committed `topics/<slug>/`.

**`createTopic(root: string, slug: string, opts: CreateTopicOptions): StagedCut`**

**Purpose:** Seeds `.staycurrent/staged/<slug>/` with the founding topic skeleton, so the founding v1 goes through the **same** `cut` gate as any later version (`domain/topic.md`, Notes: creation is not a bootstrapped exception). The skeleton is the complete gate-shaped tree, stub content throughout: `article.md` frontmatter (`topic: <slug>`, `title: opts.title`, `version: 1`, `status: current`, a default `cadence`, `last_researched: <today>`), a founding changelog entry stub (`## v1 — <today>` heading, no `Stance:` line), the skill skeleton (`skill/SKILL.md` with `name: <slug>`, `article_version: 1`, plus `references/`), the matching `versions/v1/` stubs (`article.md`, `skill/`, `provenance.md` with empty Sources/Synthesis sections), and `research-log.md`.

**Request:**
```
root: string
slug: string
opts: CreateTopicOptions { title: string }
```

**Response:**
```
StagedCut { dir, topic, version: 1 }
```

**Errors:**
- Throws `ContentValidationError` — the slug is invalid (not kebab-case noun-form, per Naming & Taxonomy), reserved (`skills`, `changelog`, `about`, `rss.xml`), already exists under `topics/`, or already has a staged tree.

**Design rationale:** The freshly seeded skeleton deliberately **fails** the gate — empty provenance (check 6) at minimum — so `gate <slug>` doubles as the founding run's TODO list from the first minute, and nothing can publish until the writer skill has authored real content into the staged draft. Every artifact is seeded at its one allowed path immediately, which is what the idempotency rule needs to hold later. The default `cadence` is seeded as `90d` — a placeholder the operator sets during the founding run, not a committed editorial value.

---

**`stageCut(root: string, slug: string): StagedCut`**

**Purpose:** Seeds the staged baseline for an existing topic's research run: copies the complete committed `topics/<slug>/` tree into `.staycurrent/staged/<slug>/`, touching nothing under `topics/`. The run's drafts — the updated article, the new `versions/vN/`, the changelog entry, skill changes — are then authored directly into that tree by the workbench skills (quarantine is workbench-writable). Action-contract step 1.

**Request:**
```
root: string
slug: string
```

**Response:**
```
StagedCut { dir: string, topic: string, version: number }   // version = live version + 1, the N this run targets if it cuts
```

**Errors:**
- Throws `ContentNotFoundError` — no `topics/<slug>/` exists (a founding topic is `createTopic`'s job, not this one's).
- Throws `ContentValidationError` — the live frontmatter fails schema validation.
- Propagates raw fs errors uncaught (disk full, permission denied). `stageCut` performs no gate validation — that is `runPublishGate`'s job, called separately, keeping the three-step contract three distinct steps rather than two.

**Design rationale:** A full copy-forward, not a diff, because the gate must see the complete `versions/` set to derive N (Publish gate, above) — and because authoring into a complete tree means `gate <slug>` gives a true report at any point mid-run. Idempotent re-seed: when the staged tree already exists, `stageCut` leaves it intact and returns it — re-entering an interrupted run never destroys authored drafts.

---

**`executeCut(root: string, slug: string, gateResult: GateResult): CutReport`**

**Purpose:** Lands the staged tree into `topics/<slug>/` via fs writes only — no git. Action-contract step 3, mechanical execution of an already-sanctioned decision (design system, Authority boundaries: "within a sanctioned cut, the system executes autonomously"). **Landing is a sync with normalization** (change-proposal-1), defined by four rules:

1. **Normalization** — the landed live `article.md` always carries `status: current`: published state is always current, whatever the staged working copy read. This is what keeps `in-research` out of git history even if a stray stamp reaches the staged tree.
2. **Monotonicity at the landing** — the staged version must **exceed** the live topic's version; otherwise `ContentValidationError`. A zero-authoring cut (staged N == live N) passes the gate but cannot land — monotonicity is enforced here, not only by convention.
3. **Sync** — after landing, `topics/<slug>/` exactly matches the staged tree: files absent from staging are deleted and reported in `CutReport.removed`. A copy-only landing would let deleted files survive live, and the freshly cut topic would then fail its own gate in CI.
4. **Binding** — `gateResult.dir` must equal the staged tree being landed; anything else throws `GateNotPassedError`. A gate pass certifies one directory, not the operation.

**Request:**
```
root: string
slug: string             — the staged tree is read from the deterministic .staycurrent/staged/<slug>/
gateResult: GateResult   — the result of runPublishGate over that staged tree; required, not optional;
                            its dir must equal the staged tree's path (rule 4)
```

**Response:**
```
CutReport { topic: string, version: number, paths: string[], removed: string[] }
// paths lists every artifact written, removed every file deleted by the sync — both root-relative;
// paths feeds the cut report template verbatim
```

**Errors:**
- Throws `GateNotPassedError` immediately, before touching `topics/`, if `gateResult.ok !== true` **or** `gateResult.dir` is not the staged tree being landed — a runtime-enforced instance of ADR 0003's fail-closed rule: the signature makes "no commit without a passing, matching `GateResult`" a compile-time reminder and a runtime guarantee, not just a documented calling convention.
- Throws `ContentNotFoundError` — no staged tree exists at `.staycurrent/staged/<slug>/`. Never a silent empty success.
- Throws `ContentValidationError` — the staged version does not exceed the live topic's version (rule 2).
- Propagates raw fs errors on a write failure.

**Design rationale:** Content-core performs the fs half of the commit only; the caller performs `git add`/`git commit` (core does fs, the CLI does the git commit — architecture §4). This keeps content-core testable with no git binary present, and keeps commit-message construction, author identity, and signing out of the module `site` also depends on. **Idempotency:** the landing is a convergent sync — files already byte-identical are skipped, missing ones written, stragglers deleted — so re-running after a partial failure completes the landing and returns the same `paths` list, never duplicating (design system, Skill Anatomy: "every artifact has exactly one path it can exist at"). One ordering obligation follows from rule 2: `article.md`, the version-bearing file, lands last, so a partially-landed tree still reads as the previous live version and the monotonicity check permits the completing re-run.

---

**Session mechanics.** Four functions govern the research-run lifecycle around a cut. They are the action contract's **degenerate case**, not an exception to it: *stage* is in-memory (the new field values), *validate* is frontmatter-schema validation (no version is being cut, so the five-artifact gate has nothing to inspect), and *commit* is the CLI's single `log(<slug>): no-cut` commit for `recordNoCut` — and no commit at all for `convene`, `discardSession`, and `reconcile`, which touch only the uncommitted working tree: `in-research` never appears in git history (02-data-flows' rule), so stamping it and reverting it are working-tree-only operations by design.

Ownership is split precisely, and 04-data-design's ownership statement is normative: **core never reads or writes `.staycurrent/sessions/`**. Session-file creation (the `create`/`convene` commands), deletion (the `log`/`discard` commands, and `cut`'s cleanup), and existence-probing (`status`) are CLI-layer actions. Core functions touch only the frontmatter stamps, staged-tree seeding, and `topics/` writes; where core logic needs a session-file fact (`reconcile`), the CLI supplies it as an argument.

**`convene(root: string, slug: string): ConveneResult`**

**Purpose:** Opens a research run in one core call, in a contractual order: **seeds the staged baseline first** by calling `stageCut` internally — the one sanctioned core-calls-core composition — and only **then** stamps `status: in-research` in the live `article.md` frontmatter (working tree only — no commit). Seed-then-stamp means the staged baseline is copied before the stamp exists, so it always reads `status: current` (change-proposal-1) — the landing's normalization never has an accidental `in-research` to scrub from a faithfully-authored tree. It does not create the session file — that is the `convene` command's CLI-layer action.

**Request:**
```
root: string
slug: string
```

**Response:**
```
ConveneResult { topic, againstVersion, stagedDir }
```

**Errors:**
- Throws `ContentNotFoundError` — the topic does not exist.
- Throws `ContentValidationError` — `status` is already `in-research` (an open or unreconciled session; resume or discard it first), or the frontmatter fails schema validation.

**Design rationale:** Seed and stamp are one call so a crash between them is a single process's window, not a CLI choreography to get wrong — and the order makes that crash harmless: a seeded tree without a stamp is just a re-runnable convene (`stageCut`'s idempotent re-seed), while the reverse order could strand an `in-research` stamp with no staged tree behind it. The session file rides with the CLI instead because 04's ownership line wins: core's contract ends at `topics/` and the staged tree; the session file is workbench conversation state.

---

**`recordNoCut(root: string, slug: string, input: NoCutInput): ResearchLogEntry`**

**Purpose:** Resolves a research run that found nothing warranting a cut: updates `last_researched`, reverts `status` to `current`, appends the research-log entry. The no-cut counterpart to `executeCut`. It does not touch the session file — deletion is the `log` command's CLI-layer cleanup.

**Request:**
```
root: string
slug: string
input: NoCutInput { lastResearched: string, researchLogLines: string[] }
```

**Response:**
```
ResearchLogEntry { date: input.lastResearched, outcome: 'no-cut', lines: input.researchLogLines }   // no `version` field
```

**Errors:**
- Throws `ContentValidationError` — the topic's live `status` is not `in-research` (a no-cut resolution presupposes a convened run; `domain/research-run.md`).
- Throws `ContentNotFoundError` — the topic does not exist.

**Design rationale:** The degenerate action contract, exactly: no staging directory and no five-artifact gate, because a no-cut touches only `article.md`'s `last_researched`/`status` fields and one `research-log.md` entry — none of the five gate-checked artifacts change, so validation is the frontmatter schema alone. The caller (`log <slug>`, below) deletes the session file and makes the single git commit `log(<slug>): no-cut` — core does `topics/` fs, the CLI does git and session cleanup, same split as `executeCut`.

---

**`discardSession(root: string, slug: string): void`**

**Purpose:** Abandons an unresolved run's `topics/` footprint: reverts `status` to `current` in the working tree — zero other `topics/` writes, no research-log entry, no `last_researched` change (abandonment is not a resolution; `domain/research-run.md`). Deleting the session file and the staged tree is the `discard` command's CLI-layer cleanup.

**Request:**
```
root: string
slug: string
```

**Response:**
```
void
```

**Errors:**
- Throws `ContentNotFoundError` — the topic does not exist.
- Throws `ContentValidationError` — `status` is not `in-research` (no stamp to revert).

**Design rationale:** No commit follows — the `in-research` stamp only ever existed in the working tree, so the revert restores the committed state exactly: git shows nothing happened, which is precisely the design system's "deleted without trace in published content."

---

**`reconcile(root: string, slug: string | undefined, opts: ReconcileOptions): ReconcileReport`**

**Purpose:** The filesystem-wins rule as a function (design system, Cold-start resolution): for every topic — or just `slug` when given — whose stored `status` is `in-research` but whose session file does not exist *as reported by the caller*, revert `status` to `current` in the working tree.

**Request:**
```
root: string
slug: string | undefined              — undefined sweeps all topics (the status command's mode)
opts: ReconcileOptions
  sessionExists?: boolean             — single-slug form
  sessions?: Record<string, boolean>   — sweep form: slug → session-file existence
// the CLI probes .staycurrent/sessions/ and supplies the facts — core never reads that path
```

**Response:**
```
ReconcileReport { reverted: string[] }   // empty when nothing needed reconciling
```

**Errors:**
- Throws `ContentNotFoundError` — `slug` given but no such topic.
- Throws `ContentValidationError` — propagated from a frontmatter read that fails schema validation.

**Design rationale:** Session-file existence arrives as an argument, not a probe — 04's ownership statement applied to the one core function that needs the fact. An `in-research` topic whose existence fact is *absent* from `opts.sessions` is treated as session-present and left untouched: reverting published state on missing information is the wrong default, so the function is fail-safe against a caller that forgets a slug. A topic with `in-research` *and* a reported session file is likewise untouched — that is a resumable run, not drift. No commit — like `convene` and `discardSession`, it only moves the working tree back to what git already holds.

---

**RSS.**

**`buildRss(root: string, config: SiteConfig): string`**

**Purpose:** Builds the site-wide `rss.xml` feed body from the newest changelog entries across every topic — one written artifact (the changelog entry) serving the page, the feed, and, through the skill payload, the agent (architecture §3, design system: "the RSS item is the entry, verbatim").

**Sole caller:** the site's prebuild script (`services/site`, run automatically before `next build` via the npm `prebuild` hook), which reads `site.config.json` from the repo root, calls `buildRss`, and writes the returned string to `services/site/public/rss.xml` — a static asset Next.js copies through unchanged under `output: 'export'`. CI exercises `buildRss` only through that script; no CLI command duplicates it. One writer, one artifact: the feed cannot be generated two ways.

**Request:**
```
root: string
config: SiteConfig { name: string, url: string, description: string, author: string }
// read by the site's prebuild script from site.config.json at the repo root and passed in —
// buildRss does not read the file itself, so it stays pure and testable without a config fixture
```

**Response:**
```
string   — a complete RSS 2.0 XML document
```

**Errors:**
- Throws `ContentValidationError` when its internal `listTopics` sweep reports any `TopicError` — the feed never builds from a partially valid catalogue — and propagates `ContentValidationError`/`ContentNotFoundError` from the per-topic `loadChangelog` calls. Either way RSS generation fails, and with it the site build (the prebuild is part of `next build`'s invocation): CI goes red, the previous deploy stays live (index.md §5).

**Design rationale:**
- **Item set:** all changelog entries site-wide, flattened and sorted by `date` descending (newest first), capped at the 50 most recent — a fixed constant, not a `config` field (revisit if the ~25-topic ceiling this project already assumes elsewhere — ADR 0002, the design system's search-escalation trigger — is raised).
- **`title`:** `${topicFrontmatter.title} v${entry.version}` — the display title, not the slug.
- **`link`:** `${config.url}/${slug}/changelog/#v${entry.version}`.
- **`guid`:** same value as `link`, `isPermaLink="false"` — the URL is real and fetchable, but it addresses a fragment on a page whose surrounding content changes as later entries append above it, so it is marked non-permalink rather than implying the URL's content is immutable.
- **`pubDate`:** `entry.date`, formatted RFC-822 (RSS 2.0's required date format) — `entry.date` is definitionally the cut date, since the changelog entry and its version snapshot are written together in one commit (`domain/version.md`).
- **`description`:** `entry.bodyHtml` verbatim — the same HTML the changelog page renders, so a feed reader and the site never show a differently-synthesized summary.
- Channel-level `title`/`link`/`description` come straight from `config.name`/`config.url`/`config.description`; item-level `<author>` is `config.author` on every item, since the product has exactly one author-of-record (product brief: "the operator — the site's author-of-record").

---

**Skill payload distribution — build-artifact contract.** The site's build publishes each topic's companion skill in the two static forms ADR 0005 commits, built from the same gate-checked files the loading API reads (`loadVersion`'s `skillDir` names the source trees). This is a build-artifact contract, not a core function — no content-core API is added for it:

- **Browsable trees:** `/skills/<slug>/` (current — mirrors the live `topics/<slug>/skill/`) and `/skills/<slug>/v/<n>/` (archived — mirrors `versions/vN/skill/`).
- **Zip archives:** current at `/skills/<slug>.zip`, archived at `/skills/<slug>/v/<n>.zip`. Each zip contains a single top-level `<slug>/` directory holding the payload (`SKILL.md` + `references/`) — never loose files at the archive root — so unpacking into a skills directory lands the skill under its own name.

The canonical install one-liner — the exact command the install page (`/[topic]/skill`, rendered per `01-ui-design.md`) shows, its origin resolved from `config.url` (this instance: `https://staycurrent.dev`):

```
curl -fsSL https://staycurrent.dev/skills/<slug>.zip -o /tmp/<slug>-skill.zip && unzip -o /tmp/<slug>-skill.zip -d ~/.claude/skills/
```

The single top-level `<slug>/` directory plus `unzip -o` is what makes the command idempotent and update-safe: re-running it after a new cut overwrites the same `~/.claude/skills/<slug>/` tree in place, and the freshly-installed `SKILL.md`'s `article_version` states which stance revision landed. This is Success Signal 2's front door — a fresh Claude Code session runs this one command and has the skill.

---

#### workbench/cli.mjs — command contract

The command set: `status | create <slug> --title <t> | convene <slug> | gate <slug> | cut <slug> | log <slug> --line <text>… | discard <slug>`. The table below is the **verbatim contract** — `01-ui-design.md` presents the same commands as per-command state tables carrying these exact strings and exit codes, and the per-command sections that follow elaborate it without contradicting it:

| Command | Success output (stdout) | Exit codes |
|---|---|---|
| `status` | state-block table; `No topics.` when none; reconciliation lines when applied | 0; 1 if any topic malformed |
| `create <slug> --title <t>` | `Created staged topic <slug> — draft at .staycurrent/staged/<slug>/. Session: .staycurrent/sessions/<slug>.md` | 0; 2 slug exists/reserved/invalid |
| `convene <slug>` | `Convened <slug> against v<N> — in-research. Session: .staycurrent/sessions/<slug>.md` | 0; 2 already in-research or unknown slug |
| `gate <slug>` | `PASS <slug> v<N>` / one `FAIL <check-id>: <message>` line per failure | 0 pass; 1 fail; 2 nothing staged |
| `cut <slug>` | `Cut v<N> — article, skill, changelog entry, provenance; RSS follows at site build.` + artifact paths + commit line `cut(<slug>): v<N>` | 0 success or idempotent `Nothing to cut — v<N> is complete.`; 1 gate failure (renders the full halt template); 2 unknown slug (no staged tree and no topics/ entry) |
| `log <slug> --line <text>…` | `Logged no-cut for <slug> — last_researched <date>. Commit: log(<slug>): no-cut` | 0; 1 validation failure; 2 no open session |
| `discard <slug>` | `Discarded session for <slug> — status reverted to current. Nothing published changed.` | 0; 2 nothing to discard |

Binding rules across the set: **`gate` is a report command** — it prints `FAIL` lines only and never the halt template; **only `cut` renders the full `Blocked/Cause/State/Action` halt template** on failure. Only content-core functions mutate `topics/`; the `.staycurrent/` quarantine is workbench-writable — `cli.mjs` contains argument parsing, session-file lifecycle, output formatting, and the git commits, never a frontmatter edit or a `topics/` write of its own. Missing or malformed arguments exit `2` for every command. Every command accepts a `--json` flag: it prints the underlying typed value as JSON on stdout instead of the human-formatted text — `cli.mjs` is invoked by workbench skills running inside an agent session at least as often as by a human operator, and the types above serialize directly (`api-and-contracts.md`'s "agent-readiness is first-class" applied to a CLI instead of an HTTP API). All commands resolve `root` as the current working directory (`cli.mjs` is invoked from the repo root).

**`status`**

**Purpose:** Prints the state block — the cold-start orientation the design system specifies (Session choreography) — and is where the `in-research`-with-no-session-file reconciliation (Cold-start resolution) actually runs: the command probes `.staycurrent/sessions/` itself, calls `reconcile(root, undefined, { sessions })` with the facts, then `listTopics(root)`, and reports all of it.

**Request:**
```
(no args)
--json   — prints { reverted: string[], topics: TopicSummary[], errors: TopicError[] } —
           the reconcile result and the post-reconciliation sweep, together
```

**Response (human):**
```
one line per reverted topic first (when any):
reconciled ${slug}: in-research had no session file — status reverted to current

then one line per topic:
${slug.padEnd(w)}  v${version}   researched ${last_researched, 'D MMM YYYY'}   ${state}
// state is one of:
//   current — next run ${last_researched + cadence, formatted}
//   due — ${daysOver} days over
//   in-research                          (session file confirmed present)

then one line per malformed topic (when any):
malformed ${slug}: ${message}

zero topics:
No topics.
```

**Exit codes:** `0` — printed successfully (including the zero-topics case). `1` — any topic malformed: the sweep's `errors` is non-empty (the state block still prints for the valid topics, the `malformed` lines name the rest).

**Design rationale:** Matches the design system's state block example byte-for-byte so a workbench skill can shell out to `status --json`, reconcile nothing further, and render the same block verbatim. Exit `1` with full output — rather than aborting — because `listTopics` no longer fails fast: the operator repairing one broken topic still sees what else is due, while the nonzero exit keeps scripts honest. The zero-topics output is terse and deterministic — `No topics.` — because `cli.mjs` output is a machine-parseable surface: the conversational boot opening the design system specifies ("No topics yet. Name a practice area…") is the workbench *skill's* rendering of this state, layered on top of the CLI's answer, not emitted by the CLI itself.

---

**`create <slug> --title <t>`**

**Purpose:** Starts a founding topic — calls core's `createTopic(root, slug, { title })` to seed the staged skeleton, then creates the session file (CLI-layer) so the founding run has its quarantine from the first minute. The founding v1 publishes later through the same `cut <slug>` as any version.

**Request:**
```
slug: string (required)
--title <t>: string (required)   — the display title
--json   — prints StagedCut verbatim
```

**Response (human):**
```
Created staged topic ${slug} — draft at .staycurrent/staged/${slug}/. Session: .staycurrent/sessions/${slug}.md
```

**Exit codes:** `0` — created. `2` — slug exists (under `topics/` or already staged), reserved, or invalid.

**Design rationale:** No `topics/` write and no git action happen here — `create` produces only quarantine artifacts, so an abandoned founding draft is discarded without trace, exactly like any other session. The session file's `against_version` is `0` for a founding run — no published version exists to research against. `create` completes the design system's closed verb set (`convene`, `cut`, `log`, `create`) in the CLI, one command per verb.

---

**`convene <slug>`**

**Purpose:** Opens a research run — calls core's `convene(root, slug)` (staged seed + stamp, in that order, in one call), then creates the session file (CLI-layer, per the ownership split). No git commit follows (`in-research` never appears in git history).

**Request:**
```
slug: string (required)
--json   — prints ConveneResult verbatim
```

**Response (human):**
```
Convened ${slug} against v${againstVersion} — in-research. Session: .staycurrent/sessions/${slug}.md
```

**Exit codes:** `0` — session opened. `2` — already `in-research` (resume or `discard` first) or unknown slug.

**Design rationale:** Already-in-research maps to exit `2` — it is a precondition the caller can check (`status`) and correct (`discard`), the same class as an unknown slug, not a content defect. The conversational convene microcopy ("Sources first, digest when I have it") is the workbench skill's line; the CLI states the fact.

---

**`gate <slug>`**

**Purpose:** The operator's pre-cut dry-run — calls `runPublishGate(.staycurrent/staged/<slug>/)` against the staged tree, at any point mid-run. The `FAIL` list is the run's remaining TODO list; a freshly created topic fails by design until its content is authored.

**Request:**
```
slug: string (required)   — must have a staged tree at .staycurrent/staged/<slug>/
--json                     — prints GateResult verbatim
```

**Response (human):**
```
pass: PASS ${slug} v${N}
fail: one line per GateFailure — FAIL ${check-id}: ${message}
// ${message} names the exact missing or offending artifact path — guaranteed by the
// per-check message shapes in the Publish gate table, which are the halt vocabulary
```

**Exit codes:** `0` — gate passed. `1` — gate ran and returned failures. `2` — nothing staged for `slug`.

**Design rationale:** `gate` is a **report command**: it renders `FAIL` lines only, never the halt template — the halt template belongs to `cut`, the one command whose failure blocks an action in flight. CI's per-topic re-validation calls the same `runPublishGate` against the committed `topics/<slug>/` in its own workflow step — identical code path, different `dir` argument (ADR 0003); the CLI command serves the staged tree because that is the one an operator is iterating on.

---

**`cut <slug>`**

**Purpose:** Executes a sanctioned cut — the CLI-side end of stage → gate → commit, as three explicit sequential calls: `runPublishGate(stagedDir)` → `executeCut(root, slug, gateResult)` → `git commit`.

**Request:**
```
slug: string (required)
// operates on the staged tree at .staycurrent/staged/<slug>/, seeded by convene/create
// and authored into by the run's skills
--json   — prints CutReport on success (converged re-entry included; nothing-to-cut prints the
//         degenerate CutReport { topic, version, paths: [], removed: [] }); GateResult on gate
//         failure; a non-advancing-version refusal prints the serialized typed error
//         { error: 'ContentValidationError', topic, file, issues }
```

**Behaviour:**
- Staged tree exists at `.staycurrent/staged/<slug>/` → `runPublishGate(stagedDir)` → on pass, `executeCut(root, slug, gateResult)`, then `git add topics/<slug>/ && git commit -m "cut(<slug>): v<N>"`, then CLI cleanup: delete the staged tree and the session file (quarantine emptied — the cut resolved the run). A staged-only slug with no `topics/` entry is the founding-v1 create path and proceeds identically.
- Staged tree exists and `topics/<slug>/` is already **byte-identical** to it (a crash landed the sync but the commit was lost) → the **converged re-entry**: skip `executeCut` (its monotonicity check would rightly refuse a same-version landing) and proceed straight to the git commit and cleanup — exit `0` with the cut report.
- Staged tree exists, gate passes, but `executeCut` throws `ContentValidationError` (staged version does not exceed the live version — the zero-authoring case: convene, author nothing, cut) → exit `1` with the halt template naming the versions; staged tree and session left intact.
- No staged tree, `topics/<slug>/` exists, and `runPublishGate(topics/<slug>/)` passes → exit `0` with `Nothing to cut — v<N> is complete.` — the idempotent re-run the design system's rule requires (the gate detects already-complete artifacts and skips).
- No staged tree and the committed topic fails its own gate → exit `1` with the halt template — there is nothing staged to complete from, and the failure names the artifact.

**Response (human), success:**
```
Cut v<N> — article, skill, changelog entry, provenance; RSS follows at site build.
[each path in CutReport.paths]
cut(<slug>): v<N>

idempotent re-run (nothing staged, latest version complete):
Nothing to cut — v<N> is complete.
```

**Response (human), gate failure — the halt template, verbatim:**
```
Blocked: <what stopped, one line>
Cause:   <the file, the value, the check that failed>
State:   staged set intact at .staycurrent/staged/<slug>/; topics/ untouched
Action:  <the one thing the operator should do>
[additional GateFailures, if any, listed below the block]
```

**Exit codes:** `0` — committed (including the converged re-entry), or nothing to cut (idempotent). `1` — gate failed (staged tree, or the committed topic when nothing is staged), or `executeCut` refused a non-advancing version (zero-authoring); nothing further written to `topics/`, any staged set left intact for resume. `2` — unknown slug: no staged tree **and** no `topics/` entry.

**Design rationale:** `cut` and `log` are the only two commands that construct git commits — `cut(<slug>): v<N>` here, `log(<slug>): no-cut` there; nothing else in the system touches git. Only `cut` renders the halt template, because only `cut` has an action in flight to block — `gate` reporting the same failures stays a report. On gate failure, `cut` exits before calling `executeCut` at all, so `GateNotPassedError` is never actually thrown in normal CLI operation — it exists as a safety net for any other caller of `executeCut`. The nothing-to-cut case exits `0`, not `2`, because a re-run after success is a legitimate operation with a true answer, not a caller mistake.

---

**`log <slug> --line <text>…`**

**Purpose:** Resolves a convened run as no-cut — calls core's `recordNoCut` (research-log entry, `last_researched` bump, status revert to `current`), then deletes the session file and the staged tree (CLI-layer cleanup) and makes the single git commit `log(<slug>): no-cut`.

**Converged re-entry:** a crash between `recordNoCut`'s filesystem writes and the git commit leaves the resolution applied but uncommitted. `log <slug>` re-entry detects it — status already `current`, the session file still present, and uncommitted changes under `topics/<slug>/` — and proceeds straight to the commit and cleanup, exit `0`. Mirrors `cut`'s converged re-entry; the two committing commands share the same crash-window discipline.

**Request:**
```
slug: string (required)
--line <text>   — repeatable, 2–4 occurrences: the factual research-log lines
                   (authored by the writer skill; the CLI passes them through)
--date <iso>    — optional; last_researched value, default today
--json          — prints ResearchLogEntry verbatim
```

**Response (human):**
```
Logged no-cut for ${slug} — last_researched ${date}. Commit: log(${slug}): no-cut
```

**Exit codes:** `0` — logged and committed. `1` — validation failure (`recordNoCut` threw — e.g. the topic's `status` is not `in-research`, or frontmatter fails schema validation). `2` — no open session: no `.staycurrent/sessions/<slug>.md` exists (checked by the CLI before any core call — it owns the session files).

**Design rationale:** The no-cut verdict conversation (digest, recommendation, the operator's confirmation) happens in the workbench skill before `log` runs — by the time this command executes, the resolution is sanctioned, so the command is mechanical: one core call, one commit, one cleanup, matching the degenerate action contract exactly.

---

**`discard <slug>`**

**Purpose:** Abandons an unresolved run — calls core's `discardSession(root, slug)` to revert the working-tree `in-research` stamp, then deletes the session file and the staged tree (CLI-layer cleanup). Zero other `topics/` writes and **no git commit** — nothing published changed.

**Request:**
```
slug: string (required)
--json   — prints { topic: string, discarded: true }
```

**Response (human):**
```
Discarded session for ${slug} — status reverted to current. Nothing published changed.
```

**Exit codes:** `0` — discarded (whichever of the session file, the `in-research` stamp, and the staged tree exist are cleared). `2` — nothing to discard: no session file, no `in-research` stamp, **and** no staged tree.

**Design rationale:** Nothing-to-discard is exit `2` for the same reason `convene`'s already-in-research is: a checkable precondition, not a content defect. For a staged-only founding draft (the `create` path, no `topics/` entry), the CLI skips the core call — there is no stamp to revert — and simply deletes the session file and staged tree. Abandonment is not a resolution (`domain/research-run.md`) — hence no log entry and no `last_researched` update, deliberately distinct from `log`.

---

### Versioning & Compatibility

- **Additive evolution within a framework major.** Every type above may grow new optional fields, and the module may grow new exported functions, without a major bump; no field is removed, retyped, or has its meaning changed, and no function's existing parameters narrow, without a framework major-version event recorded as an ADR (architecture §7). An additive change never requires migrating `topics/` content itself — a site or workbench built against an older minor version reads a newer one's frontmatter unchanged, because it simply never looks at the new optional field.
- **Package shape.** `@staycurrent/core` lives at `core/`, written in TypeScript, published as ESM, built to `dist/` via `tsc` — every type and function above is a named export from the package's single entry point. `services/site` depends on it via `file:../../core`; `workbench/cli.mjs` imports directly from `dist/`. Both consumers resolve the identical compiled artifact — no second build target, no wire format to keep in sync (embedded core; architecture §7).
- **The contract serves all three consumers and presumes none** (`api-and-contracts.md`'s surface-neutral check, applied):
  - **site** calls only the Loading API (`listTopics`, `loadTopic`, `loadChangelog`, `loadVersion`, `loadResearchLog`, `renderMarkdown`) and `buildRss` — the latter exclusively from its prebuild script, which writes `public/rss.xml` before `next build`. The site's build treats a non-empty `errors` from `listTopics` as build-fatal (the same fail-closed rule `loadTopic` enforces per page — a malformed topic must never be silently absent from the catalogue). It never calls the cut or session mechanics (`createTopic`, `stageCut`, `executeCut`, `convene`, `recordNoCut`, `discardSession`, `reconcile`) or `runPublishGate` — site has no write path (architecture §4), enforced by which functions its build script has any reason to import, not by a runtime permission check.
  - **workbench/cli.mjs** is the read-and-write consumer — the sole caller of the cut and session mechanics (`createTopic`/`stageCut`/`executeCut`/`convene`/`recordNoCut`/`discardSession`/`reconcile`), the owner of the session files under `.staycurrent/sessions/`, and the only place git commits are constructed (`cut`, `log`).
  - **CI** calls `runPublishGate` directly against each committed `topics/<slug>/` in its own workflow step (the same code path the `gate` and `cut` commands use — ADR 0003) and, transitively through the site build it runs, the Loading API and `buildRss` — never the cut or session mechanics. CI re-validates; it does not publish.
  - No shape above assumes a session, a viewport, or a human reading the response — `GateResult`, `CutReport`, and `TopicSummary[]` are equally consumable by a script (`--json`) or a person (the formatted CLI output). This is the check this design's independent review applies (workflow `02-design.md`: "would a programmatic caller find this contract complete?").
