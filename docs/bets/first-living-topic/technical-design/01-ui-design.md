## UI Design

*Drafted as the `groundwork-designer` persona per `docs/design-system.md`. Every token, component, and pattern named below is defined in that document — none is invented here. Two design decisions are resolved in this file and called out inline: the current-version `/[topic]/v/[n]/` redirect mechanism (named as a risk in the pitch's Rabbit Holes), and where the superseded-skill honesty state renders — a refinement of the design system's Error & honesty choreography, which committed the state but assumed a versioned skill route the architecture doesn't have; the design-system doc is being updated to match.*

### Surface: site (graphical-ui)

**Shared across every view below — stated once so it is not repeated nine times:**

- **Light/dark.** Every token referenced (`--color-*`) resolves through the two first-class palettes in Colour Architecture. System preference is the default; the toggle overrides and persists to `localStorage` (`theme`: `light | dark | system`). Switching cross-fades `color`/`background-color` at `--duration-base` on `:root` only — no view transitions its own content individually. `color-scheme: light dark` is declared so native form/scrollbar chrome follows.
- **Print-flat.** Every surface below is flat (hairline `--color-rule` separation, no shadow) except the two shadowed elements in the whole product: the mobile sidebar drawer (`--shadow-drawer`) and popover/menu chrome (`--shadow-overlay`). No view spec below needs to restate "flat" — it's the default; only the two exceptions are called out.
- **Page-entry motion is none.** Motion → Route change: `none` — a new page paints immediately (an optional ≤ 120ms native view-transition cross-fade is permitted where the browser supports it, never polyfilled). Per-view Motion specs below therefore cover only in-page interactive elements (hover, disclosure, copy affordance), never page entrance — there is no stagger or fade-in anywhere in this product.
- **Shell zone rule.** The sidebar (280px, sticky ≥ 900px; drawer < 900px) renders on every page. The TOC rail (240px, sticky ≥ 1280px; in-page `<details>` 900–1279px; same collapsed form < 1280px) renders only on pages that have an `h2`/`h3` outline to scope-spy — present on `/[topic]/`, `/[topic]/changelog/`, `/[topic]/v/[n]/`; absent on `/`, `/[topic]/history/` (a table has no `h2`/`h3` outline), `/[topic]/skill/`, `/changelog/`, `/about/`, and 404, which give the reading column the freed width instead. Wireframes below show only the zones that apply to that view.
- **Accent budget.** At most one `.btn-primary` accent fill per view (Colour Architecture's budget). Every other accent use below is a link, active-nav state, badge, focus ring, or the freshness dot — never a background.

#### / — Topic Library

**Purpose:** The site's index. A cold reader or a returning one sees every topic's stance and currency at a glance and picks one to read — the sidebar's `Topics` tree is the only other index at this scale (no search until ~25 topics, per Design References).

**Wireframe:**

```
┌─ sidebar (280px) ─┬──────────────── reading column, full width (no TOC) ─────────────────┐
│ Stay Current       │                                                                       │
│ Changelog · About   │  ┌─ databases ──────────┐  ┌─ observability ────────┐  ┌─ testing ──┐│
│ TOPICS              │  │ Databases             │  │ Observability            │  │ Testing    ││
│  ▸ databases         │  │ Instrument for        │  │ Instrument for questions │  │ ...        ││
│  ▸ observability     │  │ decisions you cannot  │  │ you cannot predict...    │  │            ││
│  ▸ testing           │  │ predict...             │  │                          │  │            ││
│                      │  │ [v5] researched        │  │ [v3] researched          │  │            ││
│ ☀ 🔗 ⧉              │  │ 12 Jun 2026            │  │ 28 Jun 2026              │  │            ││
└─────────────────────┴──┴────────────────────────┴──┴──────────────────────────┴──┴───────────┘┘
```

*Second frame — first-run, zero topics (materially different layout: no grid renders):*

```
┌─ sidebar (280px, Topics section empty) ─┬──────── reading column ────────┐
│ Stay Current                             │                                │
│ Changelog · About                        │   No topics yet. The first     │
│ TOPICS                                   │   research run creates one.    │
│  (none)                                  │   → Framework docs             │
│ ☀ 🔗 ⧉                                  │                                │
└──────────────────────────────────────────┴────────────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Populated | ≥ 1 topic exists | The card grid, one tile per topic, sorted by topic slug |
| First-run empty | Zero topics in `topics/` | The designed empty state (Empty States spec, verbatim): wordmark, "No topics yet. The first research run creates one." + a link to the framework docs — vertically centered in the vacated space, no illustration |
| Populated, single topic | Exactly 1 topic | Same populated layout — the grid's `auto-fill` collapses gracefully to one card; no special-cased "single card" treatment |

**Key interactions:**
- Hover a card → background shifts to `--color-hover-wash`, `--duration-fast` `--ease-standard` (the card is one `.interactive` hit target, not per-element hover)
- Click/Enter a card → navigates to `/[topic]/`
- Click "Framework docs" link (first-run state) → external navigation, carries the `arrow-up-right` glyph per Iconography

**Micro-polish spec:**
- *Motion:* Card hover — Motion Event table "Hover states": `background/color` @ `--duration-fast` `--ease-standard`. No grid-entrance stagger — none is committed in the design system's Motion section, and inventing one would violate "motion confirms, it never performs."
- *Atmosphere:* Flat. Each card is a `--color-rule`-bordered tile on `--color-surface`, no shadow (Responsive grid spec, Elevation).
- *Static micro:* Grid: `repeat(auto-fill, minmax(min(320px, 100%), 1fr))`, gap `--space-5`. Card padding `--space-5`. Card anatomy per Responsive grid spec: title in `--text-h3` serif 600 / `--color-text-body`; stance one-liner 2-line clamp in `--text-ui-small` sans / `--color-text-secondary` (the design system names the title and meta roles explicitly; the one-liner's role is this design's call — sans chrome-density, matching the card's instrumentation register rather than essay prose); meta row = version `.badge` + researched date in `--text-meta` mono / `--color-text-secondary`. First-run copy in `--text-ui` / `--color-text-secondary` per Empty states pattern.

#### /[topic]/ — Living Article

**Purpose:** The product's core artifact — the current, current-truth essay a reader trusts because its currency and provenance are visible without asking. Directly serves Success Signal 1 (version, last-researched date, changelog, provenance visible with no explanation).

**Wireframe:**

```
┌ sidebar ┬───────────── reading column (72ch measure) ─────────────┬─ TOC rail (240px) ─┐
│ (280px) │ v5 · researched 12 Jun 2026 · changelog · history ·     │ Overview            │
│         │ skill                                        [fresh●]  │ Choosing a model     │
│         ├───────────────────────────────────────────────────────┤ The convergence trend │
│         │ ┃ Stance: relational is the default; reach for         │ Practitioner mental   │
│         │ ┃ document/kv/columnar/vector/graph only when a        │  models                │
│         │ ┃ named access pattern demands it.                     │                        │
│         │                                                        │                        │
│         │ # Databases                                            │                        │
│         │ ## Overview                                            │                        │
│         │ <serif essay body, --space-5 paragraph rhythm>          │                        │
│         │                                                         │                        │
│         │ ┌─ figure: the convergence trend (mermaid) ───────────┐│                        │
│         │ │ [container reserves min-height; renders on client]  ││                        │
│         │ │ caption: "Postgres absorbing JSON, vector, and       ││                        │
│         │ │  columnar workloads — 2024–2026."                    ││                        │
│         │ └────────────────────────────────────────────────────┘│                        │
│         │ ## Sources                                             │                        │
│         │  [sourced] <title> — <url> — accessed 2026-06-10        │                        │
│         │ ## Synthesis                                           │                        │
│         │  [synthesis] <claim drawn from agent knowledge>         │                        │
└─────────┴─────────────────────────────────────────────────────────┴────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Current | Default — this route always renders the live `article.md` | Trust header with the live version, freshness dot present only if the current version's cut date is ≤ 14 days old — a no-cut run updates `last_researched` but never lights the dot |
| Diagram render failure | A mermaid fence fails to parse/render client-side | The figure's designed caption renders in the empty-state pattern (one factual sentence, no broken-image glyph) — Error & Honesty Choreography |
| No topic at this slug | Reader navigates to an unknown `/[topic]/` | 404 (see below) — Next.js static export has no dynamic route for an unenumerated slug |

**Key interactions:**
- Click `changelog` / `history` / `skill` in the trust header → navigate to the topic's other faces
- Hover an in-body link → underline decoration raises to full alpha, text to `--color-accent-strong`, `--duration-fast`
- TOC rail scroll-spy → highlights the active `h2`/`h3` as the reader scrolls; clicking a TOC entry scroll-jumps with `scroll-margin-top: var(--space-8)`, native scroll only
- `< 900px`: sidebar becomes a drawer, TOC rail collapses to an in-page `<details>` block above the article

**Micro-polish spec:**
- *Motion:* Freshness dot (only while the current version's cut date is ≤ 14 days old — the same keying as the sidebar's dot) — the product's one earned motion exception: `opacity 1 → 0.35 → 1`, 2400ms `ease-in-out`, exactly two cycles on load, then rests solid; `prefers-reduced-motion` rests it solid immediately. TOC scroll-spy highlight and in-body link hover use the shared Hover-states spec (`--duration-fast`). Diagram theme re-renders on theme toggle (no transition — instant swap).
- *Atmosphere:* Flat. Trust header sits on `--color-surface`, no elevation (explicitly listed as flat in App Shell). Mermaid figure surface: `--color-surface-alt` per Diagrams spec.
- *Static micro:* `<h1>` = `--text-display` (article role, explicitly named in Type Scale). `<h2>` = `--text-h2`, `<h3>` = `--text-h3`, body = `--text-body` (fluid 17→19px, 1.72 line-height), bold-in-body = `--text-body-em` (weight 640, not 700 — serif bolds run heavy). Heading margins `--space-9` above / `--space-4` below. Paragraph spacing `--space-5`. Stance callout: 2px `--color-accent` left bar, `--color-surface-alt` fill, body-ink text — the one place the accent touches a text block (Blockquotes & asides). Trust header: `--font-mono` 13px / `--color-text-secondary`, version chip as `.badge`, interactive segments in `--color-accent`. Provenance list items: `.badge-sourced` (accent, inset border) or `.badge-synthesis` (synthesis-amber, inset border) prefixing each bullet — **design decision:** the design system defines `provenance.md`'s two-section anatomy (`## Sources` / `## Synthesis`) but does not pin it to a route; Success Signal 1 requires provenance visible on the article without explanation, so it renders inline at the essay's close, using the existing sourced/synthesis badge tokens rather than a new component. Mermaid figure: house theme (surfaces `--color-surface-alt`, strokes `--color-rule-strong`, text `--text-ui-small` body ink, accent reserved for the single current/active node), container reserves explicit `min-height` so client render never shifts settled text (CLS budget).

#### /[topic]/changelog/ — Changelog

**Purpose:** The topic's append-only timeline, each entry a self-contained mini-essay a returning reader can read alone to catch up (Design References: Linear Changelog technique).

**Wireframe:**

```
┌ sidebar ┬───────────── reading column ─────────────┬─ TOC rail ─┐
│ (280px) │ Databases — Changelog                    │ v5 — 12 Jun │
│         │                                           │ v4 — 03 May │
│         │ ## v5 — 2026-06-12                    #v5 │ v3 — ...    │
│         │ **What moved:** ...                       │             │
│         │ **What it means:** ...                    │             │
│         │ **Stance:** held — <one sentence>          │             │
│         │                                            │             │
│         │ ## v4 — 2026-05-03                    #v4 │             │
│         │ ...                                        │             │
└─────────┴────────────────────────────────────────────┴─────────────┘
```

*Second frame — single-version (founding entry only; materially shorter page, no "older entries" affordance to render):*

```
┌ sidebar ┬───────────── reading column ─────────────┬─ TOC rail ─┐
│ (280px) │ Databases — Changelog                    │ v1 — 09 Jul │
│         │                                           │             │
│         │ ## v1 — 2026-07-09                    #v1 │             │
│         │ The founding note: initial stance and     │             │
│         │ what this topic covers. (No Stance: line   │             │
│         │ — there is no predecessor to hold against.)│             │
└─────────┴────────────────────────────────────────────┴─────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Multi-version | ≥ 2 versions cut | Newest-first `## vN — date` entries, each permalinked (`#vN`), full text — no clamp, no accordion, no infinite scroll |
| Single-version (empty-state variant) | Topic has only its v1 founding cut | Only the v1 entry renders, using the same `## vN` heading; body is the founding note; no `Stance:` line (Empty and loading states spec, verbatim) — the page never apologises for brevity |

**Key interactions:**
- Click a TOC rail entry → scroll-jumps to that `## vN` anchor
- Deep-link from elsewhere (e.g. `/[topic]#heading-slug` cross-reference, or an external link to `#v4`) → browser-native anchor scroll, `scroll-margin-top: var(--space-8)`

**Micro-polish spec:**
- *Motion:* None beyond the shared rules — no accordion, so no expand/collapse motion exists on this page by design (Linear Changelog technique explicitly rejects the accordion pattern).
- *Atmosphere:* Flat, `--color-surface`.
- *Static micro:* Page `<h1>` ("Databases — Changelog") at `--text-h2` (a utility-page title, not the article masthead — `--text-display` stays reserved to the article `<h1>` and home masthead per Type Scale). Entry `<h2>` = `--text-h2`. Body prose = `--text-body`. `**What moved**/**What it means**/**Stance:**` labels render as `--text-body-em` inline, not a separate type role — they are emphasis within the entry's prose per Document Architecture's anatomy, not chrome. `<hr>`-equivalent between entries: none needed — heading rhythm (`--space-9` above each `##`) is the separator, consistent with "no cell borders" ink-on-paper restraint elsewhere in the system.

#### /[topic]/history/ — Version History

**Purpose:** The full version ledger — instrumentation density, one row per cut, so a reader or the operator can see the topic's whole cadence at a glance (Trust artifacts are first-class).

**Wireframe:**

```
┌ sidebar ┬────────────────── reading column ───────────────────┬─ TOC rail ─┐
│ (280px) │ Databases — History                                 │ (none —    │
│         │                                                       │  table has │
│         │ Version   Cut          Stance   Skill                │  no h2/h3  │
│         │ ─────────────────────────────────────────────────   │  outline)  │
│         │ [v5]      12 Jun 2026  held     skill →              │            │
│         │ [v4]      03 May 2026  bent     skill (renders v4 —  │            │
│         │                                  install current →)  │            │
│         │ [v3]      14 Jan 2026  reversed skill (renders v3 —  │            │
│         │                                  install current →)  │            │
│         │ [v2]      02 Oct 2025  held     skill (renders v2 —  │            │
│         │                                  install current →)  │            │
│         │ [v1]      09 Jul 2025  —        skill (renders v1 —  │            │
│         │                                  install current →)  │            │
└─────────┴───────────────────────────────────────────────────────┴────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Multi-version | ≥ 2 versions | Rows newest-first; the current row's version chip uses `.badge` (accent), every superseded row uses `.badge-superseded` (quiet, not alarming) |
| Single-version | Only v1 exists | One row, `.badge` (current), no `Stance:` value (v1 has no predecessor — a dash renders, not "n/a" prose) |

**Key interactions:**
- Click a version chip or its row → navigates to `/[topic]/v/[n]/`
- Click a row's `skill →` link → for the current row, navigates to `/[topic]/skill/`; for a superseded row, the link text itself carries the honesty microcopy (below) and points to the archived raw payload at `/skills/<slug>/v/<n>/`

**Micro-polish spec:**
- *Motion:* Row hover reuses the shared Hover-states wash — rows are `.interactive`.
- *Atmosphere:* Flat, `--color-surface`; row separation by 1px `--color-rule` per Tables spec (reading furniture, no zebra, no cell borders).
- *Static micro:* Table styled per the Tables spec: header row `--text-label`, `--color-rule-strong` rule below; data cells `--text-ui` except the `Cut` column which is `--font-mono` (a date, instrumentation register, consistent with the trust header's mono dates); cell padding `var(--space-3) var(--space-4)`. Version chips: `.badge` (current) / `.badge-superseded` (archived). **Design decision — where the superseded-skill honesty state lives:** this refines the design system's Error & honesty choreography, which committed the honesty *state* (install block replaced, not disabled: "This skill renders **v3** of the stance. Install the current version instead →") while assuming a versioned skill install route the architecture's URL contract does not have — `docs/architecture/index.md` §4 commits exactly one skill route per topic, `/[topic]/skill/`, always reflecting the live `article_version`. So the honesty copy renders in two committed locations instead of on a dedicated install page: inline in this row's `skill` link text, and as the superseded-skill pointer on the archived version page (`/[topic]/v/[n]/`, see that view below) — each pointing through to the raw archived payload at `/skills/<slug>/v/<n>/` and forward to `/[topic]/skill/`. The skill install page itself never needs to render the superseded state; the refreshed design-system line commits both locations.

#### /[topic]/v/[n]/ — Archived Version

**Purpose:** Full historical text of a superseded cut, unambiguously marked as not-current at every scroll depth — "history must never masquerade as current" (Error & honesty choreography). For `n` equal to the *live* version, this route is not a reading surface at all: static export has no server-side redirect, so it is a minimal redirect stub.

**Wireframe — archived (n < current):**

```
┌ sidebar ┬───────────── reading column ─────────────┬─ TOC rail ─┐
│ (280px) │▓ You're reading v3, cut 14 Jan 2026. The  │ Overview    │
│         │▓ current version is v5, updated 12 Jun    │ Choosing... │
│         │▓ 2026.                    Read current →  │             │
│         ├───────────────────────────────────────────┤             │
│         │ # Databases                    (v3 text)  │             │
│         │ ## Overview                                │             │
│         │ <archived essay body, frozen at v3>         │             │
│         │ ## Sources / ## Synthesis  (v3's provenance)│             │
│         ├───────────────────────────────────────────┤             │
│         │ This skill renders v3 of the stance.       │             │
│         │ Install the current version instead →      │             │
│         │ (archived payload: /skills/databases/v/3/) │             │
└─────────┴────────────────────────────────────────────┴─────────────┘
```

*Second frame — the same route at n = current version (materially different layout: no article text at all):*

```
┌──────────────────────────────────────────────────────────┐
│  v5 is the current version of this stance.                │
│  Read current →                                            │
│                                                              │
│  (redirects automatically — meta-refresh, 0-delay)          │
└──────────────────────────────────────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Archived | `n` < live `version` | Full frozen text of that snapshot; the archived banner replaces the trust header, sticky for the whole page, condensing after the first viewport to a slim single line (`v3 · current is v5 →`, 32px tall); below the article, the superseded-skill pointer — "This skill renders **v3** of the stance. Install the current version instead →" — the honesty state's second committed location alongside the history rows |
| Current-version redirect stub | `n` = live `version` | The minimal stub below — no essay body renders here at all; the live article is this version's only current rendering (design system, State Architecture) |

**Key interactions:**
- Click "Read current →" (either state) → navigates to `/[topic]/`
- Scroll past the first viewport on the archived state → banner condenses to the single-line form; scroll never un-sticks it
- Click "Install the current version instead →" in the superseded-skill pointer → navigates to `/[topic]/skill/`; the archived payload path (`/skills/<slug>/v/<n>/`) links to the browsable raw file tree — the old artifact stays readable, the path forward is the emphasis

**Micro-polish spec:**
- *Motion:* Banner condense-on-scroll is a layout response to scroll position, not an animated transition — it snaps at the viewport-height threshold (no committed transition token covers this; adding one would be motion for a state that isn't itself interactive, which the system doesn't do elsewhere). Redirect stub: no motion — it never stays on screen long enough to animate.
- *Atmosphere:* Flat. Archived banner: `--color-surface-alt` fill, 2px `--color-rule-strong` top rule ("archived is quiet, not alarming — no status colour is borrowed," per spec, verbatim).
- *Static micro:* Banner text in `--font-mono`, bold version numbers via `--text-body-em`-equivalent weight in mono context; "Read current →" as `--color-accent` link. Condensed form: 32px tall, same token set. Archived essay body: identical type roles to the live article (`--text-display` h1, etc.) — the snapshot renders with the same craft as current truth, per "Trust artifacts are first-class." **Design decision — the redirect stub's mechanism:** static export (ADR 0001) permits no server-side redirect, so the stub is a real static HTML page at `/[topic]/v/[n]/index.html` containing `<meta http-equiv="refresh" content="0; url=/[topic]/">` plus `<link rel="canonical" href="/[topic]/">` plus the visible "Read current →" link as real page content, not a hidden fallback. A 0-second meta-refresh carries no WCAG 2.2.1 timing-adjustable obligation (nothing to read before it fires), and the visible link satisfies JS-disabled navigation and any crawler or reader that doesn't execute the refresh. Copy is set in `--text-body` / `--color-text-body` on `--color-surface`, vertically centered — the empty-state pattern, not the archived-banner pattern, because this page is a pointer, not a reading surface. Superseded-skill pointer (archived state only): the honesty-state copy verbatim, set in `--text-meta` / `--color-text-secondary` above a 1px `--color-rule` hairline, with "Install the current version instead →" as the `--color-accent` link and the archived-payload path as a secondary link — the install block is replaced, not disabled, and no status colour is borrowed.

#### /[topic]/skill/ — Skill Install Page

**Purpose:** Distribute the companion skill and state exactly which article stance it renders, so an adopter's agent installs the version bound to what the reader just read (Success Signal 2).

**Wireframe:**

```
┌ sidebar ┬──────────── reading column (no TOC — no outline) ────────────┐
│ (280px) │ Install the Databases skill                                  │
│         │                                                                │
│         │ This skill renders v5 of the stance, cut 12 Jun 2026.          │
│         │                                                                │
│         │ ┌─ install.sh ──────────────────────────────────────── ⧉ ┐   │
│         │ │ curl -fsSL https://staycurrent.dev/skills/databases.zip  │  │
│         │ │   -o /tmp/databases-skill.zip && unzip -o                │  │
│         │ │   /tmp/databases-skill.zip -d ~/.claude/skills/          │  │
│         │ └───────────────────────────────────────────────────────┘   │
│         │                                                                │
│         │              [ Install skill ]  (btn-primary, copies command) │
│         │                                                                │
│         │ ← Back to the article                                         │
└─────────┴────────────────────────────────────────────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Current (only state at MVP) | Always — this route regenerates at every cut and always reflects the live `article_version` | The one-liner, version-binding statement, and the primary install action |

**Install block content (exact):** the code block renders this one-liner verbatim, `<slug>` resolved at build time:

```
curl -fsSL https://staycurrent.dev/skills/<slug>.zip -o /tmp/<slug>-skill.zip && unzip -o /tmp/<slug>-skill.zip -d ~/.claude/skills/
```

The current version's zip is served at `/skills/<slug>.zip`; archived versions at `/skills/<slug>/v/<n>.zip`. Each archive contains one top-level `<slug>/` directory, so `unzip -d ~/.claude/skills/` lands the payload at `~/.claude/skills/<slug>/`. The origin (`https://staycurrent.dev`) renders from `site.config.json` — engine code never names the instance. The command renders as a single line inside the designed code block; horizontal scroll per the Code blocks spec (`overflow-x: auto`), never wrapped — the wireframe's line breaks are ASCII-width artifacts only.

**Key interactions:**
- Click the code block's ghost copy icon → copies the one-liner; glyph swaps to `check` in `--color-accent` for 1500ms (the site's only inline "toast")
- Click "Install skill" (`.btn-primary`) → same copy action, offered as the page's single sanctioned accent-fill CTA (Buttons spec names "Install skill" as its own worked example)
- Click "Back to the article" → `/[topic]/`

**Micro-polish spec:**
- *Motion:* Copy-success glyph swap — `.interactive[data-loading]` pattern is not in play here (no network wait), just the instant glyph swap held 1500ms, no transition curve specified beyond the shared Hover-states wash on the buttons themselves.
- *Atmosphere:* Flat. Code block: `--color-surface-alt` well, 1px `--color-rule` border, per Code blocks spec.
- *Static micro:* Page `<h1>` at `--text-h2` (utility-page convention, see Changelog view). Version-binding statement in `--text-meta` / `--color-text-secondary` (trust-register text, same family as the trust header). Code block: `--radius-control`, padding `--space-4 --space-5`, `--text-code-block` (mono 420, 0.8125rem/1.7), header strip `--text-label` in `--color-text-faint`. `.btn-primary`: `--color-accent` background, `--color-surface` text (5.6:1 light / 8.6:1 dark), `--radius-control`, `--space-2 --space-4` padding, min 40px target (44px < 900px). This page carries the sole `.btn-primary` on the site's per-topic faces — spent here deliberately, because installing is the one true call-to-action on the trust apparatus's four faces.

#### /changelog/ — Site-Wide Changelog

**Purpose:** A cross-topic feed mirroring `rss.xml` exactly — the site's second, browsable form of the same feed.

**Wireframe:**

```
┌ sidebar ┬───────────── reading column ─────────────┬─ TOC rail ─┐
│ (280px) │ Changelog                                │ (none)     │
│         │                                           │             │
│         │ databases · v5 · 2026-06-12               │             │
│         │ **What moved:** <clamped to 4 lines>       │             │
│         │ ...                          Read entry →  │             │
│         │ ───────────────────────────────────────   │             │
│         │ testing · v3 · 2026-06-28                  │             │
│         │ ...                          Read entry →  │             │
└─────────┴────────────────────────────────────────────┴─────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Populated | ≥ 1 cut exists across any topic | Cards newest-first, cross-topic, each labelled with its topic |
| First-run empty | Zero topics (inherits `/`'s condition) | Same empty-state sentence pattern as `/` — "No topics yet. The first research run creates one." — since there is nothing to feed |

**Key interactions:**
- Click "Read entry →" → navigates to the entry's permalink on its own topic's `/[topic]/changelog/#vN`

**Micro-polish spec:**
- *Motion:* None beyond shared rules.
- *Atmosphere:* Flat, `--color-surface`; each card `--color-rule`-bordered.
- *Static micro:* Card entries clamp to 4 lines (`-webkit-line-clamp`) per Overflow & truncation spec, verbatim — "the entry stands alone at its permalink, never silently cut" is why the clamp exists only here and not on the per-topic changelog. Topic label prefix in `--text-label` / `--color-text-faint`; entry heading `--text-h3`; body `--text-body` at the prose-table size (0.9375rem) rather than full essay size, since this is a feed, not the essay itself.

#### /about/ — About

**Purpose:** The one place a curious reader learns how a living article works — no tours or tooltips exist anywhere else in the product (Onboarding spec).

**Wireframe:**

```
┌ sidebar ┬────────── reading column (no TOC — single short page) ──────┐
│ (280px) │ # About Stay Current                                        │
│         │ ## How a living article works                               │
│         │ <prose: topic, article, version, cut, changelog,             │
│         │  provenance, stance — the shared vocabulary, explained>       │
└─────────┴───────────────────────────────────────────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Static | Always — this page has no data dependency | Fixed prose; identical on every build |

**Key interactions:**
- None beyond standard in-body link hover (shared rules).

**Micro-polish spec:**
- *Motion:* None.
- *Atmosphere:* Flat.
- *Static micro:* `<h1>` at `--text-h2` (utility-page convention). Body `--text-body`, same essay measure (72ch) and rhythm as the article, since this page is prose meant to be read, not chrome.

#### 404 — Not Found

**Purpose:** The one designed dead end — "the dead end contains the map" (Error & honesty choreography, verbatim).

**Wireframe:**

```
┌ sidebar ┬────────── reading column (no TOC) ──────────┐
│ (280px) │ This page doesn't exist.                    │
│  (same   │ It may have moved when a topic was renamed. │
│  Topics  │                                              │
│  tree as │ Topics                                       │
│  always) │  → databases                                 │
│         │  → observability                              │
│         │  → testing                                    │
└─────────┴───────────────────────────────────────────────┘
```

**States:**

| State | Trigger | What the user observes |
|---|---|---|
| Only state | Any unmatched route under static export | The designed 404 — never a bare host-default error page |

**Key interactions:**
- Click any listed topic → navigates to `/[topic]/`

**Micro-polish spec:**
- *Motion:* None.
- *Atmosphere:* Flat.
- *Static micro:* `<h1>` "This page doesn't exist." at `--text-display` (this is the one utility page that earns the article-masthead weight — it is the page's entire content, deliberately stated with the same authority as an article opening, per "quiet authority" brand voice) — sentence below at `--text-ui` / `--color-text-secondary`. The inline topic list reuses the sidebar's tree markup/roles (`--text-ui`/500 title links) rendered as page content, per spec's literal instruction — not the card-grid pattern from `/`, since this is wayfinding text, not the library's browsing surface.

### Surface: workbench (agentic-protocol)

*No wireframes — this surface is a structured conversation between the operator, the agent, and the filesystem, plus one deterministic CLI. Every microcopy template quoted below is verbatim from `docs/design-system.md` § Agentic Protocol, normative for this bet; nothing here introduces a synonym for the closed status vocabulary (`current`, `due`, `in-research`, `superseded`, `cut`, `no-cut`, `sourced`, `synthesis`).*

**Shared across every turn and command below:**

- **Terse, factual, zero ceremony.** No apology theatre, no "Would you like me to...?" when evidence suffices, no enthusiasm filler, no "As an AI..." (Tone & Posture, Prohibited phrases table applies identically to conversational turns and CLI text output).
- **Closed status vocabulary only** — the exact string an agent greps is the exact string rendered, in frontmatter, conversation, and CLI output alike.
- **The halt template is the conversational failure format** — every `blocking`/`violation` halt in a session turn renders it. At the CLI it belongs to `cut` exclusively (the one command that mutates published truth); `gate` emits `FAIL <check-id>: <message>` report lines, and exit-2 usage/state errors are plain one-liners — never the template:
  ```
  Blocked: <what stopped, one line>
  Cause:   <why — the file, the value, the check that failed>
  State:   <topic, phase, last durable step — what is safely on disk>
  Action:  <the one thing the operator should do>
  ```
- **The CLI's command set is closed:** `status | create <slug> --title <t> | convene <slug> | gate <slug> | cut <slug> | log <slug> --line <text>… | discard <slug>` — seven commands, specified below. The output strings and exit codes are one verbatim contract shared with `03-api-design.md`. RSS is not a CLI command: the site's prebuild owns feed generation.
- **Exit codes (CLI):** `0` — success (including `cut`'s idempotent no-op); `1` — a failed check (`gate` FAIL, `cut` gate failure, `log` validation failure, malformed topics under `status`); `2` — usage/state errors (unknown slug; slug exists/reserved/invalid; already `in-research`; nothing staged; no open session; nothing to discard), always plain one-liners. `recoverable` failures never surface as a halt — they retry bounded (3×, 1s/2s/4s backoff) and degrade silently unless exhausted.
- **The staged tree.** `.staycurrent/staged/<slug>/` is seeded at `create`/`convene`; the research and writer skills author draft artifacts directly into it; `cut` gates that staged tree and commits it into `topics/` in one step. The session file (`.staycurrent/sessions/<slug>.md`) records phase and argument; the staged tree holds the prospective artifacts.

#### Session Opening — State Block

**Purpose:** Every workbench session opens with filesystem-derived state, not ceremony — the operator sees exactly what's true before anything is proposed.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| Topics exist | ≥ 1 topic in `topics/` | The compact mono state block, one row per topic, immediately followed by the agent's proposal |
| Zero topics (boot) | No `topics/*/article.md` at all | The boot opening replaces the state block entirely |
| Reconciliation needed | A topic's frontmatter says `in-research` but `.staycurrent/sessions/<slug>.md` is missing | The state block renders with that topic already reverted to `current`, plus one reported line naming the reconciliation |

**Key interactions (turns):**
- System opens (topics exist):
  ```
  observability      v5   researched 12 Jun 2026   current — next run 10 Sep
  testing            v3   researched 28 Jun 2026   current — next run 26 Sep
  cost-engineering   v2   researched 01 Mar 2026   due — 35 days over
  ```
  …immediately followed by a proposal, e.g. "cost-engineering is furthest over — convene it?" — never an open-ended "what would you like to do?"
- System opens (zero topics):
  `No topics yet. Name a practice area and I'll create the first one — topic, cadence, and the initial research run.`
- System opens (reconciliation case): the state block renders as above, plus one factual line, e.g. `observability: reverted in-research → current — no session file found at .staycurrent/sessions/observability.md.`

#### Convene

**Purpose:** Start a research run against a named topic's current version — the brief's own verb.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| Fresh convene | Operator names a topic with no open session | The convene microcopy, then research proceeds |
| Resume offered | An open session file exists for that topic | The resume microcopy instead — convene never silently restarts in-flight work |

**Key interactions (turns):**
- Operator: `convene cost-engineering`
- System (fresh): `Convening cost-engineering against v2 (last researched 01 Mar 2026). Sources first, digest when I have it.`
- System (resume case instead): `cost-engineering has an open session from 2026-07-04, phase: arguing. Resume it or discard it?` — a bounded prompt (Propose-vs-prompt: resuming vs. discarding is a genuinely open editorial choice, not one the filesystem alone can settle)

#### Research Progress & Findings Digest

**Purpose:** Report research as it happens without narrating activity, then present the ranked digest that opens the argument.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| In progress | Sources being examined | Completed facts only — "12 sources examined; 3 findings of consequence" — never "let me now look at…" |
| Source fetch degraded | A fetch/search fails 3× (bounded retry, `recoverable` severity) | One factual digest line naming the gap; the run continues without that source, recorded in provenance as a gap — no halt |
| Digest ready | Research phase completes | The ranked findings table, followed by the system's significance verdict (see next block) |

**Key interactions (turns):**
- System (progress, mid-run): `12 sources examined; 3 findings of consequence.`
- System (digest): a table of *finding · source · consequence for the stance*, ranked by consequence — no fixed microcopy template is defined beyond the table shape itself; the table is the artifact.

#### Verdict — Cut / No-cut

**Purpose:** State the system's position on whether findings warrant a version cut, and invite the operator's editorial pushback — the system holds an informed position, it does not defer with an open question.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| Verdict: cut | Findings touch the stance or its claims | The cut-verdict microcopy plus a draft changelog entry to argue or approve |
| Verdict: no-cut | Findings don't touch the stance or claims | The no-cut-verdict microcopy; the run still logs and updates `last_researched` |

**Key interactions (turns):**
- System (cut): `Verdict: cut. <finding count> findings, <n> touch the stance — <one-line reason>. Draft entry below; argue or approve.` — the draft entry and every other prospective artifact are authored by the research/writer skills directly into the staged tree `.staycurrent/staged/<slug>/`, which `cut` will gate
- System (no-cut): `Verdict: no-cut. What moved doesn't touch the claims or the stance — logging the run. Overrule if you read it differently.`
- Operator: argues, revises, or gives explicit go — the system never cuts without it (the one authority rule with no exception, Authority boundaries).

#### Cut Execution & Report

**Purpose:** On the operator's explicit go, execute the sanctioned cut mechanically (stage → gate → commit) and report exactly what was written.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| Gate passes | Staged tree has all five artifacts, byte-identical skill, non-empty provenance | The cut report, paths listed |
| Gate fails | Any check fails against the staged tree | The halt template, naming the exact missing/offending artifact; `topics/` is untouched, the staged tree stays intact at `.staycurrent/staged/<slug>/` |

**Key interactions (turns):**
- Operator: explicit go (e.g. "approved" / "cut it")
- System (pass): `Cut v6 — article, skill, changelog entry, provenance; RSS follows at site build. Paths: …` (four written artifacts listed; RSS is not a fifth write — it derives at site build from the changelog entry, verbatim)
- System (gate fail): halt template, e.g. `Blocked: cut v6 failed the publish gate. Cause: versions/v6/provenance.md missing. State: staged tree intact at .staycurrent/staged/databases/. Action: the draft's Sources section is empty — provide or approve synthesis labelling, then I re-run the gate.`

#### Resume & Reconciliation

**Purpose:** Any interrupted session resumes from its quarantine file; any orphaned `in-research` state self-corrects from the filesystem, never from memory.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| Resumable | Session file exists for a topic marked `in-research` | The resume microcopy, offering to continue from the recorded phase |
| Orphaned (no session file) | `in-research` with no matching session file | Silent revert to `current` plus one reported reconciliation line — no "resume" is offered, because there is nothing to resume |

**Key interactions (turns):**
- System: `<topic> has an open session from <date>, phase: <phase>. Resume it or discard it?`
- Operator: resume → re-enters the recorded phase (`researching` / `arguing` / `deciding`) from the session file's accumulated sections; discard → session file deleted, no trace in published content

#### Error & Halt Choreography

**Purpose:** The uniform failure surface for anything that cannot proceed — one severity ladder; the full halt template renders for conversational halts and for `cut` — the one CLI command that halts — while `gate` reports `FAIL <check-id>: <message>` lines and exit-2 usage errors are plain one-liners.

**States:**

| State | Trigger | What the operator observes |
|---|---|---|
| `recoverable` | Transient I/O (fetch, search) | Silent bounded retry (3×, 1s/2s/4s); one factual digest line only if exhausted |
| `blocking` | Schema violation, unresolvable state | Halt template; no workaround attempted |
| `violation` | Publish gate fails, or an operation would mutate `topics/` outside the action contract | Halt template naming the exact missing/offending artifact; never overridable in-session |

**Key interactions (turns):**
- Two `blocking`/`violation` halts in the same session → the system recommends closing it: `Session paused twice on blocking issues — the session file preserves everything; resume in fresh context.` (Escalation ladder, step 3)

#### CLI: `status`

**Purpose:** The deterministic, scriptable form of the state block — `node workbench/cli.mjs status` — the health signal the runner checks (`docs/architecture/infrastructure.md`: exits 0 on success) and the raw data the conversational session-opening turn is built from. No proposal sentence — that's the agent's addition, not the script's.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Topics exist | ≥ 1 topic | The state-block table, plain text, column-aligned, greppable; reconciliation lines appended when one was applied | 0 |
| Zero topics | No topics | `No topics.` (one line) | 0 |
| Malformed topic frontmatter | Any `topics/*/article.md` fails frontmatter validation | One error line per malformed topic (the loading API returns `{topics, errors}` — valid topics still list) | 1 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs status
observability      v5   researched 12 Jun 2026   current — next run 10 Sep
testing            v3   researched 28 Jun 2026   current — next run 26 Sep
cost-engineering   v2   researched 01 Mar 2026   due — 35 days over
$ echo $?
0
```

#### CLI: `create <slug> --title <t>`

**Purpose:** Topic creation — the design system's verb set commits `create` alongside `convene`, `cut`, and `log`. Seeds the staged topic skeleton at `.staycurrent/staged/<slug>/` and the session file; the founding v1 then goes through the same `cut` gate as any later version — creation is not a bootstrapped exception.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Created (staged) | Slug is new, valid, unreserved | `Created staged topic <slug> — draft at .staycurrent/staged/<slug>/. Session: .staycurrent/sessions/<slug>.md` | 0 |
| Slug exists / reserved / invalid | `topics/<slug>/` already exists; slug is a reserved root segment (`skills`, `changelog`, `about`, `rss.xml`); or slug fails the naming rules (kebab-case, ≤ 3 words) | Plain one-line usage error naming the reason | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs create databases --title "Databases"
Created staged topic databases — draft at .staycurrent/staged/databases/. Session: .staycurrent/sessions/databases.md
$ echo $?
0
```

#### CLI: `convene <slug>`

**Purpose:** The deterministic half of the conversational convene turn: stamp `status: in-research` in the topic's frontmatter, create the session quarantine file, and seed the staged tree at `.staycurrent/staged/<slug>/`. The agent does the research; the CLI does the filesystem.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Convened | Topic is `current`, no session file exists | `Convened <slug> against v<N> — in-research. Session: .staycurrent/sessions/<slug>.md` | 0 |
| Already in-research | A session file exists for the topic | Plain one-line usage error pointing at the existing session — resume or discard, never a silent restart | 2 |
| Unknown slug | `<slug>` matches no `topics/` directory | Plain one-line usage error naming the slug | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs convene cost-engineering
Convened cost-engineering against v2 — in-research. Session: .staycurrent/sessions/cost-engineering.md
$ echo $?
0
```

#### CLI: `gate <slug>`

**Purpose:** Validate the staged prospective tree at `.staycurrent/staged/<slug>/` — the state `topics/` will hold after the commit — through the single gate implementation every caller shares (ADR 0003: this command, the workbench pre-commit, and CI pre-deploy all invoke the identical function).

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| PASS | All five-artifact and consistency checks hold | `PASS <slug> v<N>` (one line) | 0 |
| FAIL | Any check fails | One `FAIL <check-id>: <message>` line per failing check — report lines, not the halt template | 1 |
| Nothing staged | No staged tree exists for the slug | Plain one-line usage error | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs gate databases
PASS databases v6
$ echo $?
0

$ node workbench/cli.mjs gate cost-engineering
FAIL snapshot-complete: missing required artifact: versions/v3/provenance.md
FAIL changelog-top-entry: changelog.md top entry is ## v2, expected ## v3
$ echo $?
1
```

#### CLI: `cut <slug>`

**Purpose:** Execute the action contract's stage → gate → commit for a topic whose cut has already been sanctioned by the operator's explicit go in the conversation — the CLI is the mechanical executor, not a second authority check.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Committed | A staged tree exists → gate passes → commit | The cut report: the `Cut v<N> — …` line, artifact paths, and the commit line | 0 |
| Blocked | A staged tree exists → gate fails | The full halt template — `cut` is the only CLI command that renders it; `topics/` untouched, staged tree intact | 1 |
| Nothing to cut | No staged tree and the latest version is complete (a re-run after success lands here) | `Nothing to cut — v<N> is complete.` — no duplicate commit | 0 |
| Committed topic broken | No staged tree and the committed topic fails its own gate | The full halt template — the live tree needs repair before any new cut | 1 |
| Unknown slug | No staged tree **and** no `topics/` entry (a staged-only slug — the `create` path — proceeds) | Plain one-line usage error naming the slug | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs cut databases
Cut v6 — article, skill, changelog entry, provenance; RSS follows at site build.
Paths:
  topics/databases/article.md
  topics/databases/skill/
  topics/databases/changelog.md (## v6 entry)
  topics/databases/versions/v6/provenance.md
cut(databases): v6
$ echo $?
0

$ node workbench/cli.mjs cut databases
Nothing to cut — v6 is complete.
$ echo $?
0
```

#### CLI: `log <slug> --line <text>…`

**Purpose:** Resolve a run as `no-cut`: write the research-log entry from the supplied `--line` facts (repeatable flag — the entry's 2–4 factual lines), update `last_researched`, revert `in-research` → `current`, delete the session file, and commit — the mechanical execution of the no-cut verdict the operator accepted.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Logged | An open session exists for the topic | `Logged no-cut for <slug> — last_researched <date>. Commit: log(<slug>): no-cut` | 0 |
| Validation failure | The entry fails validation (e.g. no `--line` supplied) | One error line naming the failed check | 1 |
| No open session | No session file for the topic (or unknown slug) | Plain one-line usage error | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs log cost-engineering --line "9 sources examined; nothing moved the stance." --line "Pricing shifts are vendor-level, not architectural."
Logged no-cut for cost-engineering — last_researched 2026-07-09. Commit: log(cost-engineering): no-cut
$ echo $?
0
```

#### CLI: `discard <slug>`

**Purpose:** Abandon an open session without trace: delete the session file and the staged tree, revert `in-research` → `current`. Published content is untouched — an abandoned run leaves no artifact.

**States:**

| State | Trigger | What the operator/caller observes | Exit code |
|---|---|---|---|
| Discarded | An open session exists for the topic | `Discarded session for <slug> — status reverted to current. Nothing published changed.` | 0 |
| Nothing to discard | No session file **and** no `in-research` stamp for the topic | Plain one-line usage error | 2 |

**Key interactions (turns):**
```
$ node workbench/cli.mjs discard cost-engineering
Discarded session for cost-engineering — status reverted to current. Nothing published changed.
$ echo $?
0
```

---
*(One `### Surface:` subsection per in-scope surface, per the pitch's `surfaces: [site, workbench]` frontmatter — both covered above.)*
