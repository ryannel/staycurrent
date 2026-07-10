---
title: Design System
description: Implementation-ready design specification for Stay Current — the brand foundation, the website's visual system, and the workbench's protocol design.
type: design-system
last_reviewed: 2026-07-09
---

# Stay Current — Design System

This document is the implementation-ready design specification for Stay Current. It carries the shared brand foundation and one section per interface type: the **Graphical UI** section specifies the reader-facing website to CSS-token precision; the **Agentic Protocol** section specifies the operator workbench and companion skills to schema precision. A developer or a generative tool implements from this document without making design decisions of their own — every value that belongs to design is committed here.
# Part 1 — Foundation

The foundation binds every interface type. Each type section translates it into its own medium; none may contradict it.

## Brand Direction

**Stay Current is an engineering press, not an app.** Its personality is the senior colleague who shows their work: opinionated without theatre, calm without being bloodless. The register is quiet authority — confidence earned through visible provenance, never volume. The visual and verbal identity is archival calm carrying one live wire: ink-on-paper neutrals with a single accent spent almost entirely on the trust apparatus (version badges, currency markers, links).

**Voice.** Declarative and stance-first: do this, reject that, here is why. Honest caveats are named, not buried. Synthesis is labelled as synthesis, plainly — that honesty is what makes the confident sentences believable. The interface chrome around the writing is nearly silent; what it says is load-bearing and factual, with dates and versions wherever the trust story needs them. Warmth appears only in honesty states.

**Two densities.** Prose breathes: generous measure, real whitespace, one thing to look at. Trust metadata is instrumentation: compact, tabular, glanceable. Every surface in every medium chooses one of these two densities deliberately; nothing sits vaguely between.

**Stillness is the premium.** Responses are near-instant and functional. Motion is salt: it confirms, it never performs. The one earned exception is a subtle freshness acknowledgment when a version is newly cut — "alive" is the brand claim.

**Errors are honesty states.** The product never guesses about currency. Failures are loud, structured, and factual: what stopped, why, and the next action. Nothing that touches the audit trail self-repairs. No apology theatre, anywhere.

## Product-Wide Constraints

- **The version cut is atomic.** A version publishes with article, skill, changelog entry, provenance, and RSS item together, or not at all. Every surface treats a partially present version as a failure to surface, never a state to render around.
- **Trust artifacts are first-class.** Version history, changelog, and provenance receive the same design investment as the article.
- **Failures are loud and safe.** A failed research run never mutates published content. Halt and explain over silent degradation.
- **Everything published is git-versioned.** The repo is the audit trail; no design decision may depend on state outside it. The one sanctioned exception is in-flight session quarantine (ephemeral by design, gitignored) — nothing published ever derives from it.

## Shared Vocabulary

One closed vocabulary, used identically in site copy, frontmatter, skill files, and workbench conversation — the string an agent greps is the string a reader sees rendered:

| Term | Meaning |
|---|---|
| topic | A broad practice area: one living article + one companion skill + their history |
| article | The living, current-truth essay for a topic |
| skill | The distributable AI skill rendering the article's stance executable |
| version | One atomic cut of article + skill + changelog entry + provenance |
| cut (verb) | To produce and publish a new version |
| changelog | The topic's append-only timeline of standalone entries |
| provenance | A version's sources-and-influences record |
| stance | The article's committed position on its practice area |
| research run | One scheduled research session, ending `cut` or `no-cut` |
| session | One research run's in-flight working state, quarantined until it resolves |
| phase | A session's position in its lifecycle: `researching`, `arguing`, `deciding` |
| digest | The ranked findings presentation a research run opens its argument with |

**Status values** are a closed set: topics are `due / in-research / current`; versions are `current / superseded`; provenance entries are `sourced / synthesis`; research runs end `cut / no-cut`. No surface introduces synonyms.
# Graphical UI

The reader-facing website: staycurrent.dev and every site a builder deploys from the framework. Web is the only platform at this horizon; everything below is written in web vocabulary.

## Constraints

### Performance budgets

- **Article text visible < 1.5s** on a median mobile connection (Slow 4G, mid-tier device). The site is fully static — content pre-rendered at version-cut time — so the budget is enforced at build: no render-blocking script, fonts loaded with `font-display: swap` and subsetted, above-the-fold CSS inlined.
- **Navigation feels instant.** Internal links prefetch on hover/viewport entry; a route change paints in < 100ms on repeat visits.
- **Client-side interactions < 50ms** to first visual response: theme toggle, sidebar drawer, TOC highlight, copy buttons. Switching between article versions is a route change between static pages and falls under the navigation budget above, not this one. All interaction feedback runs on `transform`, `opacity`, or `color` only — no layout-triggering properties.
- **Cumulative Layout Shift < 0.02.** Fonts are size-adjusted against their fallbacks (`size-adjust`, `ascent-override`); images and diagrams carry explicit dimensions.
- **JavaScript is progressive enhancement.** Every page is fully readable and navigable with JS disabled; script exists only for the theme toggle, drawer, TOC scroll-spy, copy affordances, link prefetch, per-tab sidebar state, and diagram rendering (mermaid — the fenced source stays readable without JS, and every diagram container reserves layout space that absorbs the initial render — a figure may extend beyond its reservation, the browser's scroll anchoring preserving the reading position). Nothing else ships.

### Accessibility baselines

- **WCAG 2.1 AA minimum.** Body text contrast ≥ 7:1 (AAA, because reading is the product); UI chrome and large text ≥ 4.5:1; non-text UI ≥ 3:1. The Colour Architecture token tables carry verified pairings — implementers use the named pairings, never ad-hoc combinations.
- **Semantic HTML first**: one `<h1>` per page, sequential heading levels, `<nav>`/`<main>`/`<article>`/`<aside>` landmarks, skip-to-content as first focusable element.
- **Full keyboard operability**: every interactive element reachable and operable; visible focus per the interaction-states spec; no keyboard traps; sidebar drawer and any menu close on `Escape`.
- **`prefers-reduced-motion: reduce`** disables every non-essential transition and the freshness treatment; state changes remain instant and complete.
- **Zoom to 400%** without loss of content or horizontal scrolling of the reading column; text honours user font-size preferences (all type in `rem`).

### Platform targets

- Evergreen browsers, last 2 major versions. No IE, no legacy fallbacks.
- Viewports from 320px to ultrawide; layout behaviour per the responsive grid spec.
- OKLCH is the authoring colour space and ships as-is (supported in all evergreen targets).

### Sync and error tolerance

- **No backend, no accounts, no sessions, no real-time.** RSS is the only push channel. The only *persisted* client state is the theme preference (`localStorage`, key `theme`, values `light | dark | system`); per-tab ephemeral UI state (sidebar scroll, disclosure) may use `sessionStorage` and dies with the tab. Nothing identifies or tracks the reader.
- **Currency is never guessed.** Every article page renders its version and last-researched date from build-time data; if that data is missing the build fails — the site never ships a page that cannot state its currency.
- **Honesty states are designed states**: archived-version banner, graceful 404, superseded-skill pointer. Specified in the Surface section; none of them are generic framework fallbacks.
## App Shell

### Layout skeleton — three zones

A doc-site shell carrying a publication. Grid at desktop (≥ 1280px):

```
┌────────────┬──────────────────────────────┬──────────┐
│  sidebar   │        reading column        │ TOC rail │
│  280px     │   minmax(0, 1fr), max 72ch   │  240px   │
│  sticky    │       measure container      │  sticky  │
└────────────┴──────────────────────────────┴──────────┘
        page max-width: 1440px, centered
```

- **Sidebar (280px, sticky, full height).** Site nav + topic tree. Background `--color-surface-alt`, separated from content by a 1px `--color-rule` hairline — no shadow, per the print-flat rule.
- **Reading column.** Text measure capped at `72ch` of body serif (~680px at base size), centered in the remaining space with `--space-10` (64px) minimum horizontal padding at desktop. Code blocks, tables, and diagrams may extend to `min(88ch, 100%)` — wider than prose, never wider than the column.
- **TOC rail (240px, sticky).** Current page's outline, `h2`/`h3` only. Scroll-spy highlights the active heading. Hidden below 1280px (outline collapses into a `<details>` block above the article).

**Breakpoint behaviour:**

| Range | Sidebar | TOC rail |
|---|---|---|
| ≥ 1280px | fixed, visible | fixed, visible |
| 900–1279px | fixed, visible | in-page `<details>` outline |
| < 900px | drawer (overlay, left slide-in) | in-page `<details>` outline |

The drawer is one of only two shadowed surfaces in the product (see Elevation). It traps focus while open, closes on `Escape`, backdrop click, and route change.

### Sidebar anatomy

Top to bottom:

1. **Wordmark** — "Stay Current" set in the display serif, 18px/500, links home. No logo glyph at MVP; the wordmark is the mark.
2. **Site pages** — Changelog, About. Sans, 14px/450.
3. **`Topics` label** — section label style (11px/600 sans, uppercase, tracking 0.08em, `--color-text-faint`).
4. **Topic tree** — one entry per topic: topic title (sans 14px/500), carrying the freshness dot (see Badges) when the topic's current version is ≤ 14 days old — the workbench's `due` state is operator-facing and never renders on the public site. Topic entries expand (disclosure, rotate-90° chevron @ `--duration-base`) to their four faces: Article, Changelog, History, Skill (13px/450, indented `--space-4`).
5. **Footer cluster** — theme toggle, RSS glyph link, framework repo link. Icon buttons, 16px glyphs.

Active states: the current page's entry carries `--color-accent` text and a 2px accent bar flush left (replacing, not adding to, its left padding — no layout shift). Hover: text moves from `--color-text-secondary` to `--color-text-body`, background `--color-hover-wash`, 120ms.

### Trust header — the article's masthead

Every article opens with the trust header before the `<h1>`. It is instrumentation density: one line of mono-set metadata, wrapping to two on narrow viewports.

```
v5 · researched 12 Jun 2026 · changelog · history · skill      [fresh●]
```

- Set in `--font-mono` at 13px, `--color-text-secondary`; interactive segments are links in `--color-accent`.
- Version chip: `v5` in a badge (see Badges) — accent-tinted background, mono.
- The freshness marker appears when the current version is ≤ 14 days old: a 6px accent dot with the label `fresh`, animated only per the motion spec's one exception.
- On `/[topic]/v/[n]` pages the header is replaced by the **archived banner** (see Error & Honesty Choreography).

### Context preservation

- Route changes preserve sidebar scroll position and expanded/collapsed topic state — per-tab ephemeral state in sessionStorage, dying with the tab (distinct from the persisted theme preference; see Constraints).
- The TOC rail scroll-spy keeps the reader oriented in long essays; anchor links from changelog entries deep-link to article headings (`/[topic]#heading-slug`).
- Reading an archived version keeps the sidebar rooted at the topic — the reader is never dropped into a dead-end.

### Empty and loading states

- **New topic, one version:** `/[topic]/changelog` renders the v1 founding entry (`## v1 — <date>`: the initial stance and what the topic covers) — the system writes it at first cut; the page never apologises for brevity.
- **No skeletons at MVP.** The site is static; content arrives with the page. If version history ever defer-loads, it uses the skeleton spec in Surface — until then, no skeleton code ships.
- **First-run (builder's fresh deploy, zero topics):** home renders the wordmark, one sentence — "No topics yet. The first research run creates one." — and a link to the framework docs. Designed, not a blank grid.

### Onboarding

None. The trust header teaches the living-article model by being present on every article; `/about` carries "How a living article works" for the curious. No tours, no tooltips, no first-visit modals.
## Colour Architecture

All colour is authored in OKLCH because its lightness channel is perceptually uniform — a step of 5% L looks like the same step on every hue, which HEX/RGB cannot promise. The palette is built as: warm paper neutrals (hue 85, the hue of unbleached stock), warm ink neutrals (hue 75), one accent — **current green** (hue 152, the "live wire": alive without reading as success-semaphore), and three functional hues used only in status contexts.

Themes are two first-class palettes, not an inversion. Dark surfaces are warm-dark (not grey-blue, not black) so the press character survives the theme switch; dark-theme accent lightness rises to hold contrast on dark ground.

### Semantic tokens — light theme

```css
:root {
  /* Surfaces — paper */
  --color-surface:        oklch(97.5% 0.007 85);  /* page — warm vellum */
  --color-surface-alt:    oklch(95.3% 0.009 85);  /* sidebar, code blocks, wells */
  --color-surface-raised: oklch(99.2% 0.004 90);  /* the two overlay surfaces only */
  --color-hover-wash:     oklch(93.5% 0.010 85);  /* interactive hover fill */

  /* Ink */
  --color-text-body:      oklch(24% 0.018 75);    /* essays, headings — 13.9:1 on surface */
  --color-text-secondary: oklch(44% 0.014 75);    /* metadata, nav, captions — 6.6:1 */
  --color-text-faint:     oklch(51% 0.012 75);    /* section labels, disabled — 5.2:1 on surface, 4.8:1 on surface-alt */

  /* The live wire */
  --color-accent:         oklch(46% 0.115 152);   /* links, active nav, badges — 5.6:1 */
  --color-accent-strong:  oklch(38% 0.115 152);   /* hover/pressed link — 8.0:1 */
  --color-accent-wash:    oklch(92% 0.038 152);   /* badge/selection fills; never text */

  /* Status — used only in status contexts, never decoration */
  --color-synthesis:      oklch(50% 0.105 75);    /* amber-bronze: synthesis provenance — 4.9:1 */
  --color-danger:         oklch(47% 0.150 30);    /* destructive/error text — 5.9:1 */
  --color-superseded:     var(--color-text-faint);/* archived = quiet, not alarming */

  /* Structure */
  --color-rule:           oklch(88% 0.008 85);    /* hairlines — 1px only, never 2px */
  --color-rule-strong:    oklch(80% 0.010 85);    /* table header rules, blockquote bar */
}
```

### Semantic tokens — dark theme

```css
[data-theme="dark"] {
  --color-surface:        oklch(16.5% 0.010 80);  /* deep warm ink, not black */
  --color-surface-alt:    oklch(19.5% 0.012 80);
  --color-surface-raised: oklch(23% 0.014 80);
  --color-hover-wash:     oklch(24% 0.014 80);

  --color-text-body:      oklch(87% 0.010 85);    /* warm paper-white — 12.6:1 */
  --color-text-secondary: oklch(68% 0.012 80);    /* 6.2:1 */
  --color-text-faint:     oklch(63% 0.010 80);    /* 4.8:1 — holds the chrome floor on dark */

  --color-accent:         oklch(76% 0.140 152);   /* 8.6:1 — brighter to carry on dark */
  --color-accent-strong:  oklch(83% 0.150 152);
  --color-accent-wash:    oklch(28% 0.045 152);

  --color-synthesis:      oklch(74% 0.105 78);
  --color-danger:         oklch(72% 0.140 30);
  --color-superseded:     var(--color-text-faint);

  --color-rule:           oklch(26% 0.010 80);
  --color-rule-strong:    oklch(34% 0.012 80);
}
```

### Usage rules

- **Verified pairings only.** Body text on `--color-surface`/`--color-surface-alt`; secondary on any surface; faint only for labels ≥ 11px/600 uppercase or disabled states — every faint pairing holds ≥ 4.5:1 in both themes. Accent-wash never carries text other than `--color-accent-strong`.
- **Accent budget.** The accent appears on: links, the active nav item, version badges, currency markers, focus rings, text selection — and the primary button, the one sanctioned accent fill, at most one per view. It never appears on: any other background larger than a badge, headings, borders-as-decoration, icons at rest. If a screen reads "green", the budget is blown.
- **Alpha rules.** Translucency only for: text selection (`--color-accent` at 18%), the drawer backdrop (`oklch(15% 0.01 80 / 0.45)` both themes), and code-block line highlights (`--color-accent` at 8%). Surfaces are otherwise opaque — print doesn't blend.
- **System preference is the default**; the toggle overrides it and persists. `color-scheme: light dark` is declared so form controls and scrollbars follow the theme natively.

## Type Scale

Three families, three jobs:

```css
--font-serif: "Literata", "Iowan Old Style", Georgia, serif;         /* essays */
--font-sans:  "Inter", system-ui, sans-serif;                        /* chrome */
--font-mono:  "JetBrains Mono", ui-monospace, "SF Mono", monospace;  /* code + trust data */
```

**Literata** is a serif designed for sustained screen reading (it is a variable font with an optical-size axis — text sizes get sturdier forms, display sizes get finer ones). **Inter** disappears into UI chrome, which is the chrome's job. **JetBrains Mono** carries code and all trust instrumentation, tying "data" to one visual register. All three are open-license, self-hosted, subsetted, `font-display: swap` with size-adjusted fallbacks.

### Scale

Essay type is fluid (`clamp()` between a 360px floor and 1280px ceiling); chrome type is fixed — instrumentation doesn't breathe.

| Token | Family/weight | Size / line-height | Use |
|---|---|---|---|
| `--text-display` | serif 550, opsz auto | `clamp(2.125rem, 1.55rem + 2.2vw, 3rem)` / 1.12, tracking −0.015em | article `<h1>`, home masthead |
| `--text-h2` | serif 600 | `clamp(1.5rem, 1.28rem + 0.8vw, 1.75rem)` / 1.25 | article sections |
| `--text-h3` | serif 600 | `1.25rem` / 1.35 | article subsections |
| `--text-body` | serif 400 | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` / 1.72 | essay body — 17→19px |
| `--text-body-em` | serif 640 | inherits | bold-in-body (serif bolds run heavy; 640 not 700) |
| `--text-ui` | sans 450 | `0.875rem` / 1.5 | nav, buttons, general chrome |
| `--text-ui-small` | sans 450 | `0.8125rem` / 1.45 | sidebar sub-items, captions |
| `--text-label` | sans 600 | `0.6875rem` / 1.2, uppercase, tracking 0.08em | section labels, code-block header strips |
| `--text-code` | mono 420 | `0.875em` / inherit | inline code (em: scales with context) |
| `--text-code-block` | mono 420 | `0.8125rem` / 1.7 | code blocks |
| `--text-meta` | mono 420 | `0.8125rem` / 1.5 | trust header, version rows, dates |

Rules: heading margins are `--space-9` above / `--space-4` below (headings bind to what follows). Paragraph spacing `--space-5`, no text-indent. Max two heading levels below `h1` in any essay — the writer skill enforces the same limit, so the TOC never overflows.

## Spacing

8-point grid, 4px half-step for intra-component rhythm:

```css
--space-1: 0.25rem;  /*  4px — icon-to-label gaps */
--space-2: 0.5rem;   /*  8px — badge padding, tight clusters */
--space-3: 0.75rem;  /* 12px — button padding-block context */
--space-4: 1rem;     /* 16px — component padding base */
--space-5: 1.5rem;   /* 24px — paragraph spacing, card padding */
--space-6: 2rem;     /* 32px — component-group separation */
--space-7: 2.5rem;   /* 40px — subsection air */
--space-8: 3rem;     /* 48px — section separation (mobile) */
--space-9: 4rem;     /* 64px — section separation (desktop), heading-above */
--space-10: 6rem;    /* 96px — page-level bands, hero air */
```

Component-internal spacing uses 1–4; between-component spacing uses 5–7; page architecture uses 8–10. Arbitrary pixel values are a lint error — if a design needs 20px, the design is wrong, not the scale.
## Elevation

Print-flat is a rule, not a mood: **separation comes from hairline rules and surface shifts; shadow means "temporarily above the page" and only two things ever are** — the mobile drawer and popover menus (including any future command palette). Cards, the sidebar, code blocks, toasts, and the trust header are all flat.

```css
/* The only two shadow tokens in the system. */
--shadow-overlay:                       /* menus, popovers */
  0 1px 2px  oklch(20% 0.015 80 / 0.07),
  0 6px 16px oklch(20% 0.015 80 / 0.11),
  0 0 0 1px  oklch(20% 0.015 80 / 0.05);   /* edge definition, replaces border */

--shadow-drawer:                        /* mobile drawer — one tier deeper */
  0 2px 4px   oklch(20% 0.015 80 / 0.08),
  0 12px 32px oklch(20% 0.015 80 / 0.16);

[data-theme="dark"] {
  --shadow-overlay:                     /* dark ground absorbs light: deeper, plus lit edge */
    0 1px 2px  oklch(5% 0.01 80 / 0.30),
    0 6px 16px oklch(5% 0.01 80 / 0.40),
    0 0 0 1px  oklch(100% 0 0 / 0.06);
  --shadow-drawer:
    0 2px 4px   oklch(5% 0.01 80 / 0.35),
    0 12px 32px oklch(5% 0.01 80 / 0.50),
    0 0 0 1px   oklch(100% 0 0 / 0.06);
}
```

Adding a third shadowed element is a design-system change, not a component decision.

## Motion

Motion confirms; it never performs. Two durations, one curve, one spring-free system — a reading site earns its premium feel from stillness, so every animated property is `transform`, `opacity`, or `color`, nothing that can drop a frame.

```css
--duration-fast: 120ms;   /* hover washes, color shifts, focus rings */
--duration-base: 180ms;   /* disclosure chevrons, drawer, menus, theme cross-fade */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* fast out, gentle settle */
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);   /* leaving elements accelerate away */
```

| Event | Spec |
|---|---|
| Hover states | `background/color` @ fast |
| Sidebar disclosure | chevron `rotate(90deg)` @ base; content: no animation (instant reveal — animated height causes reflow) |
| Drawer | `translateX(-100%→0)` @ base standard; exit @ base exit; backdrop `opacity` in parallel |
| Menus/popovers | `opacity 0→1` + `translateY(-4px→0)` @ fast; exit: opacity only |
| Theme switch | `color/background-color` cross-fade @ base on `:root` only — content does not transition individually |
| Route change | none. New page paints immediately; a view-transition cross-fade ≤ 120ms is permitted where natively supported, never polyfilled |
| Scroll | native only. No smooth-scroll hijacking; anchor jumps use `scroll-margin-top: var(--space-8)` |

**The one earned exception — the freshness marker.** When a version is ≤ 14 days old, the trust header's 6px accent dot breathes: `opacity 1 → 0.35 → 1` over 2400ms, `ease-in-out`, exactly two cycles on page load, then rests solid. It is the only self-initiated motion in the product — the heartbeat that says "alive".

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
/* The freshness dot rests solid; state changes complete instantly. Nothing is lost, only motion. */
```

## Interaction States

Every interactive element implements all five states. Missing states are implementation bugs.

```css
/* Hover — a wash, never a jump */
.interactive:hover {
  background: var(--color-hover-wash);
  transition: background var(--duration-fast) var(--ease-standard);
}

/* Press — tactile but subordinate: scale on chrome only, never on text links */
.interactive:active { transform: scale(0.985); transition-duration: 60ms; }

/* Focus — the accent, unmistakably, outside the element */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
/* :focus (non-visible) gets no ring — keyboard users see it, mouse users don't. */

/* Disabled — faded, not repainted */
.interactive:disabled {
  color: var(--color-text-faint);
  opacity: 0.6;
  cursor: not-allowed;          /* retains layout; no pointer-events:none (tooltip access) */
}

/* Loading — applies only to the copy affordances at MVP */
.interactive[data-loading] { cursor: progress; }
.interactive[data-loading] .glyph { opacity: 0.4; }
```

**Links in essay body** are their own system, tuned for reading: `--color-accent` text with a 1px underline (`text-underline-offset: 0.15em`, `text-decoration-color` at 45% alpha); hover raises decoration to full alpha and text to `--color-accent-strong` @ fast; visited stays unchanged (a reference site, not a trail of breadcrumbs); external links carry a 0.7em `arrow-up-right` glyph (see Iconography) after the text.

**Text selection:** `::selection { background: oklch(from var(--color-accent) l c h / 0.18); }` — the accent even in the reader's own gestures.
## Surface Craft

### Iconography

One set: **Lucide**, at `stroke-width: 1.5` — the thin functional line Phase 4 committed, consistent because it is one library, not a curation. Sizes: 16px in chrome (sidebar footer, code-block copy, theme toggle), 14px inline beside 13px text. Colour is always `currentColor` — icons inherit their text context and are never independently coloured. Icons never appear without an accessible name (`aria-label` on icon-only buttons); decorative icons don't exist here because decoration doesn't. The full working set at MVP is ten glyphs: `sun`, `moon`, `monitor` (the theme toggle's system state), `rss`, `arrow-up-right` (external link), `chevron-right` (disclosure), `copy`, `check`, `menu`, `x`. Adding a glyph means adding it to this list.

### Buttons

Chrome is nearly silent, so buttons are few and quiet. Three variants; all: `--text-ui` at weight 500, `--radius-control` (6px), padding `var(--space-2) var(--space-4)`, min target 40px (44px below 900px, per Responsive grid), verb-first labels.

```css
--radius-control: 6px;   /* buttons, inputs, badges-large */
--radius-overlay: 10px;  /* drawer, menus — concentric: outer = inner + padding */

.btn-primary {            /* one per view, at most: "Install skill", "Subscribe" */
  background: var(--color-accent);
  color: var(--color-surface);           /* surface-on-accent: 5.6:1 light / 8.6:1 dark */
}
.btn-primary:hover { background: var(--color-accent-strong); }

.btn-secondary {          /* the workhorse */
  background: transparent;
  color: var(--color-text-body);
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
}
.btn-secondary:hover { background: var(--color-hover-wash); }

.btn-ghost {              /* icon buttons: theme, RSS, copy */
  background: transparent;
  color: var(--color-text-secondary);
  padding: var(--space-2);
  min-width: 40px; min-height: 40px;     /* glyph is 16px; the target is the button */
  display: grid; place-items: center;
}
.btn-ghost:hover { color: var(--color-text-body); background: var(--color-hover-wash); }
```

### Inputs

MVP has no forms; the spec exists so the first input (palette search, later) isn't improvised: `--color-surface` field on 1px `--color-rule-strong` border, `--radius-control`, padding `var(--space-2) var(--space-3)`, sans 14px; focus swaps border to `--color-accent` plus the standard focus ring; placeholder `--color-text-faint`; error state border + message in `--color-danger`, message 13px sans below the field, never colour-only.

### Badges — the trust apparatus's atoms

```css
.badge {                  /* version chips: v5 */
  font: 420 0.75rem/1 var(--font-mono);
  padding: 3px 8px; border-radius: 4px;
  background: var(--color-accent-wash); color: var(--color-accent-strong);
}
.badge-superseded { background: var(--color-surface-alt); color: var(--color-superseded); }
.badge-synthesis  { background: transparent; color: var(--color-synthesis);
                    box-shadow: inset 0 0 0 1px currentColor; }  /* provenance label */
.badge-sourced    { background: transparent; color: var(--color-accent);
                    box-shadow: inset 0 0 0 1px currentColor; }
```

The freshness dot (sidebar, trust header): 6px circle in `--color-accent`, rendered only while the current version is ≤ 14 days old — there is no non-fresh variant; absence is the resting state. Always paired with text (`fresh`, a date) — never colour alone.

### Code blocks

A designed object, not a plugin default. Block: `--color-surface-alt` well, 1px `--color-rule` border, `--radius-control`, padding `--space-4` `--space-5`, `--text-code-block`, `overflow-x: auto`. Header strip when a filename/language is present: `--text-label` in `--color-text-faint`, hairline below. Copy affordance: ghost icon button top-right, visible always (not hover-revealed — touch exists); on success the glyph swaps to a check in `--color-accent` for 1500ms — this is the site's only "toast", inline where the action happened.

Syntax palette: one house theme per site theme, built from the token palette (ink for punctuation/identifiers, accent for keywords, synthesis-amber for strings, secondary for comments — italic). Contrast floor 4.5:1 for every token colour on `--color-surface-alt`. Line highlights: `--color-accent` at 8% full-bleed rows. Inline code: `--text-code` on `--color-surface-alt`, 3px radius, padding `1px 5px` — no border.

### Tables

Reading furniture, print-styled: no zebra, no cell borders. `--text-ui` (data tables) or `--text-body` at 0.9375rem (prose tables); header row `--text-label` style with `--color-rule-strong` rule below; row separation by 1px `--color-rule`; cell padding `var(--space-3) var(--space-4)`; numeric columns right-aligned in `--font-mono`. Wide tables scroll within their own `overflow-x: auto` container — the page never scrolls horizontally.

### Blockquotes & asides

Blockquote: 2px `--color-rule-strong` left bar, text in `--color-text-secondary`, same serif. The **stance callout** (an article's committed position, restated): 2px `--color-accent` left bar, body ink, `--color-surface-alt` fill — the one place the accent touches a text block, because the stance is the product.

### Scrollbars

`scrollbar-width: thin; scrollbar-color: var(--color-rule-strong) transparent;` WebKit: 8px, `--color-rule-strong` thumb (hover: `--color-text-faint`), 4px radius, transparent track. `color-scheme` keeps native scrollbars themed.

### Borders & dividers

1px everywhere, `--color-rule`; `--color-rule-strong` only under table headers and as blockquote/stance bars. `<hr>` in essays: centered 64px hairline with `--space-9` margins — a printer's section break, not a full-width slash.

### Overflow & truncation

Prose never truncates. Truncation exists only in chrome: sidebar topic titles and version-row changelog summaries clamp to one line (`text-overflow: ellipsis`), full text in `title`. Changelog cards on `/changelog` clamp entries to 4 lines (`-webkit-line-clamp`) with a "Read entry →" link — the entry stands alone at its permalink, never silently cut.

### Empty states

Specified in the shell (first-run home, single-version changelog). Pattern for any future case: one factual sentence + one action, set in `--text-ui` `--color-text-secondary`, vertically centered in the vacated space. No illustrations, no mascots.

### Skeletons

None ship at MVP (static site — content arrives with the page). If deferred loading ever appears: `--color-surface-alt` blocks matching final layout dimensions, 1200ms `opacity 0.6→1` pulse, no shimmer gradient — and reduced-motion rests them solid.

### Error & honesty choreography

- **Archived banner** (`/[topic]/v/[n]`) — replaces the trust header: full-width band, `--color-surface-alt` fill, 2px `--color-rule-strong` top rule (archived is quiet, not alarming — no status colour is borrowed), mono meta text: "You're reading **v3**, cut 14 Jan 2026. The current version is **v5**, updated 12 Jun 2026." with "Read current →" as `--color-accent` link. Sticky for the whole page — history must never masquerade as current, however deep the reader scrolls — condensing after the first viewport to a slim single line (`v3 · current is v5 →`, 32px tall) so persistence never crowds the reading.
- **404** — display-serif "This page doesn't exist." + one sans sentence: "It may have moved when a topic was renamed." + the topic library rendered inline (the sidebar's tree as page content). The dead end contains the map.
- **Superseded skill** — `/[topic]/skill` always installs the current version, so the superseded state renders where a reader meets an old skill: on archived version pages (`/[topic]/v/[n]`) and history rows that link to an archived payload, the pointer reads: "This skill renders **v3** of the stance. Install the current version instead →". The old artifact stays readable; the path forward is the emphasis.
- **Diagram/image failure** — every figure carries a designed `alt` and a caption; a failed asset renders its caption in the empty-state pattern rather than a broken-image glyph.

### Responsive grid

Layout breakpoints are the shell's three (900px, 1280px, 1440px cap) — content never re-flows its *meaning*, only its chrome. Essay measure is fluid via `clamp()` type and `72ch` cap, so there are no per-breakpoint font overrides. Touch targets ≥ 44px below 900px. The only grid in the product is the home library: `repeat(auto-fill, minmax(min(320px, 100%), 1fr))` cards at `--space-5` gap, each card a flat `--color-rule`-bordered tile: topic title (serif h3), stance one-liner (2-line clamp), meta row (version badge + researched date in `--text-meta`).

### Diagrams

Mermaid renders through a house theme generated from the tokens: surfaces `--color-surface-alt`, strokes `--color-rule-strong`, text `--text-ui-small` in body ink, accent reserved for the single "current/active" node per diagram. Both themes ship; diagrams re-render on theme switch. A figure wider than the reading column scales down before it scrolls — legibility over completeness at rest, full size one click away.
## Design References

The technique library for the settled aesthetic — an engineering press, printed on good paper. Each entry names the product, the technique at parameter level, and the design challenge it answers. This is rigour borrowed, never a look copied; the Tier-3 fidelity critique grades the delivered UI against these standards.

| Product | Technique admired | Design challenge it answers |
|---|---|---|
| **Stripe Docs** | Type hierarchy that never competes with content: fixed-size sans chrome (~14px) against fluid body text; a persistent right-rail TOC at ~240px that scroll-spies without stealing measure; code blocks as designed objects — header strip with language label, always-visible copy affordance, house syntax theme with a 4.5:1 contrast floor per token colour | Long-form technical reading with first-class code, three-zone shell discipline |
| **gwern.net** | The per-essay metadata block before the first paragraph: dates, status, and confidence set in a distinct register (small, tabular, quiet) so currency reads as instrumentation, not prose; body measure held near 70ch with generous 1.7+ line-height for sustained reading | The trust header — currency as a designed surface the reader meets before the argument |
| **Linear Changelog** | Each entry a self-contained, permalinked mini-essay: one `h2` + date, 3–5 paragraphs, no accordion, no infinite scroll; restraint with accent colour (well under 5% of any view); functional motion at 120–200ms with a fast-out settle curve and zero scroll effects | Changelog entries that stand alone; motion-as-salt on a content product |
| **iA (ia.net)** | Editorial serif at screen scale: body ~18–19px serif on warm near-white, headings in the same family at restrained weight steps (500–600, never 700+), hairline 1px rules as the only separators, no shadows on content surfaces | Ink-on-paper flatness that still has hierarchy; serif essays that feel printed, not skinned |
| **Keep a Changelog** | A fixed entry anatomy (`## version — date` + typed change groups) rigid enough to parse mechanically and read comfortably — the same string serving human and machine | One written artifact serving page, feed, and agent alike |

Techniques deliberately not borrowed: Stripe's gradient heroes and Linear's glassmorphism (both violate print-flat); any command-palette chrome at MVP (no search until ~25 topics).
# Agentic Protocol

The operator workbench inside Claude Code and the companion skills adopters install. The "interface" is a structured conversation between a human, an agent, and a filesystem — this section specifies it to the same precision the Graphical UI section specifies pixels.

## Constraints

### Context-loading budgets

- **Cold-start operational awareness in ≤ 3 file reads**: (1) the instance's root instruction file, (2) a frontmatter sweep of `topics/*/article.md`, (3) the file the task at hand needs. An agent that needs a fourth read to answer "what is due?" indicates a topology violation, not a bigger budget.
- **The root instruction file is ≤ 150 lines.** It names the topology, the vocabulary, and the routes to the workbench skills — it never carries methodology content, which lives in the skills it points to.
- **Companion skills follow skill-creator conventions**: a lean `SKILL.md` whose frontmatter description does the routing, depth in `references/` files loaded only when the task needs them. The standard carries the token discipline; no bespoke budget is layered on top.

### Verification requirements

- **The publish gate is mechanical.** A version cut validates by filesystem inspection before anything publishes: `versions/vN/` contains `article.md`, `skill/`, and `provenance.md`; `changelog.md`'s top entry is `## vN`; the live `article.md` frontmatter carries `version: N`; the live `skill/SKILL.md` frontmatter carries `article_version: N` and the live `skill/` is byte-identical to `versions/vN/skill/` — the article-and-skill-never-disagree constraint is a gate check, not a promise. The gate runs pre-commit against the staged prospective tree: "live" means the state `topics/` will hold after the commit, so nothing is mutated before it validates. Any check failing blocks the cut with the exact missing artifact named. The RSS item needs no separate check: the feed renders the changelog entry verbatim at site build, so the changelog check covers the fifth artifact. There is no human approval step — auditability is the compensating control, and it is enforced, not hoped for.
- **Provenance is a gate input, not an afterthought.** A version with an empty `## Sources` and `## Synthesis` section cannot cut.

### Authority boundaries

- **Human-as-editor.** The system researches, presents, drafts, and recommends; the operator argues the stance and owns the significance decision. The system never cuts a version without the operator's explicit go — this is the one authority rule with no exception.
- **Within a sanctioned cut, the system executes autonomously**: writing the snapshot, the changelog entry, the provenance record, and the RSS item is mechanical execution of the decision, not further decisions.

### Error resilience policies

- **Nothing that touches `topics/` self-repairs.** The published tree is the audit trail; on any inconsistency the system halts and explains. Transient research failures (a fetch, a search) self-repair with bounded retries (3, backoff), silently unless they exhaust.
- **A failed or interrupted research run never mutates published content.** All in-flight work lives in a quarantine session file until the cut executes.

### Interoperability guarantees

- **Claude Code is the operator surface**; the workbench may use its facilities (skills, scheduled tasks, subagents).
- **Companion skills are portable payloads**: plain markdown and files, no host-specific features, no network dependency, no executable install step. Any agent runtime that can read files can consume them.
- **All state is flat, declarative, and greppable.** YAML frontmatter and markdown sections — an agent (or a shell one-liner) answers any status question without executing anything.
## Workspace Topology

### Filesystem architecture

The topic directory is the unit of everything; the atomic version cut is visible in the filesystem:

```
<instance-repo>/
  <root instruction file>     ← ≤150 lines: topology, vocabulary, skill routes
  topics/
    <topic-slug>/
      article.md              ← the living article; frontmatter IS the topic state
      changelog.md            ← append-only timeline; newest entry on top
      skill/
        SKILL.md              ← skill-creator anatomy
        references/
      versions/
        v1/ … vN/             ← immutable snapshots: article.md, skill/, provenance.md
      research-log.md         ← every run recorded, including no-cut
  .staycurrent/
    sessions/<topic-slug>.md  ← in-flight research session state (quarantine; gitignored)
```

- **`topics/` is published truth.** Only a completed, gate-passing cut writes here.
- **`.staycurrent/sessions/` is quarantine.** In-flight session state lives here and is gitignored — the audit trail records outcomes (versions, log entries), never half-finished arguments. An interrupted session resumes from its file; an abandoned one is deleted without trace in published content.
- **Provenance lives per-version** (`versions/vN/provenance.md`) because sources belong to a cut. The changelog lives at topic root because the timeline belongs to the topic.

### State management

Topic state is the `article.md` frontmatter — no parallel registry, so state can never drift from the thing it states. `due` is always derived (`last_researched + cadence < today`), never stored; a stored "due" is a bug by definition.

Valid stored states and transitions:

```
current ──(operator convenes run)──► in-research ──(cut)────► current  [version += 1]
                                          └───────(no-cut)──► current  [log entry only]
```

`in-research` is stamped when the session file is created and cleared when it resolves — if `article.md` says `in-research` and no session file exists, the filesystem wins: the state reverts to `current` and the reconciliation is reported to the operator.

### Discovery surfaces

- **Skills route by their frontmatter descriptions** (skill-creator convention) — no manifest, no routing table to maintain.
- **Topic discovery is the frontmatter sweep**: `topics/*/article.md` headers answer every catalogue question (what topics exist, versions, cadences, what is due).
- **The root instruction file is the only entry point an agent must be told about**; everything else is reachable from it in one hop.

### Context injection strategy

Three layers, loaded in order, smallest first:

| Layer | Content | When loaded |
|---|---|---|
| L0 | Root instruction file | Every session, once |
| L1 | Frontmatter sweep of `topics/*/article.md` | When the task involves topic state |
| L2 | One topic's full files (article body, changelog, session file) | When working that topic |

An agent never loads a second topic's L2 to work on the first — cross-topic questions are L1 questions by design.

### Communication posture

The workbench opens every session with **state, not ceremony**: what is due, what is in-research, what was recently cut — one compact block, then its proposal for the session. The full interaction grammar is specified in Interaction Semantics; the posture rule at topology level is that the filesystem is always presented as the shared ground truth the operator and agent both read, never as internal state the agent reports on faith.
## State Architecture

### The topic-state schema (`article.md` frontmatter)

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

Field rules: `topic` must equal its directory name (the reconciliation check greps for drift). `version` only increments, only at a cut. `status` holds exactly the two stored values — `due` is computed, and any tool that wants it derives it. `last_researched` updates on **every** resolved run including `no-cut`, because "we checked and the field was quiet" is currency information.

### Version snapshot schema (`versions/vN/article.md` frontmatter)

Identical shape plus a `cut` date, minus the volatile fields — and **no status field**:

```yaml
version: 5
cut: 2026-06-12
```

Whether a version is `current` or `superseded` is always derived by comparing `N` to the live `article.md`'s `version` — stored in neither place, so it can never disagree. The site renders the archived banner only when `N` is less than the live version; `/[topic]/v/[n]` for the current version redirects to `/[topic]` — the live article is a version's only current rendering, so the unconditional archived banner on version pages stays true.

### Cold-start resolution

An agent reconstructs full operational state from the filesystem alone, in order: read root instructions → sweep frontmatter → for any topic with `status: in-research`, check `.staycurrent/sessions/<slug>.md`. Session file exists → offer to resume. Missing → filesystem wins: revert status to `current`, report the reconciliation. No other reconciliation cases exist because no other state is stored twice.

### Session-state schema (`.staycurrent/sessions/<slug>.md`)

```yaml
---
topic: observability
phase: researching            # researching | arguing | deciding
opened: 2026-07-04
against_version: 5            # the version this run researches against
---
```

Body sections accumulate as the run progresses: `## Findings` (the digest table), `## Argument` (stance points raised and resolved), `## Draft` (changelog entry + article deltas awaiting the decision). The file is the resume point: any phase can be re-entered by reading it.

## Context Hierarchy

The three layers are defined in Workspace Topology. Binding rules: L0 is read once per session, never re-read mid-session (it does not change); L1 is re-swept after any cut (it just changed); L2 is loaded per topic and released when the topic's work resolves — two topics' L2 in one context is the signal to split the session. Companion skills add their own hierarchy for adopters: `SKILL.md` is L0, each `references/` file is L2, loaded only when the task touches its subject.

## Document Architecture

Every document is agent-parseable and human-readable in the same file — structure is the contract:

| Document | Anatomy |
|---|---|
| `article.md` | Frontmatter (schema above) → `# Title` → stance callout (the committed position, ≤ 3 sentences) → the essay: `##` sections, ≤ 2 heading levels below `#`. The article is always the current truth — no "updated:" annotations in prose, no strikethrough history; history lives in versions/. |
| `changelog.md` | `# <Topic> — Changelog` → `## vN — YYYY-MM-DD` sections, newest first. Entry anatomy: **What moved** (the field), **What it means** (for the reader's practice), **Stance:** `held \| bent \| reversed` + one sentence. An entry stands alone: a reader current on vN−1 is done after reading it. The v1 entry uses the same heading; its body is the founding note — the initial stance and what the topic covers — and carries no `Stance:` line, because there is no predecessor to hold against. |
| `provenance.md` | `## Sources` — one bullet per citable input: title, URL, accessed date, and which claims it supports. `## Synthesis` — one bullet per claim drawn from agent knowledge, stated plainly. Every consequential claim in the version traces to exactly one of the two lists. |
| `research-log.md` | `# <Topic> — Research Log` → `## YYYY-MM-DD — cut v5` or `## YYYY-MM-DD — no-cut` sections, newest first; 2–4 factual lines on what was examined and why it did or did not warrant a cut. |

The **inverted pyramid is a protocol rule**, not a style preference: frontmatter answers status questions, the first section answers "what is this," depth follows — so an agent that stops reading early still leaves with true information.
## Interaction Semantics

### Status vocabulary

The closed set, everywhere — frontmatter value, workbench utterance, and site rendering are the same string:

| Term | Applies to | Exact meaning |
|---|---|---|
| `current` | topic (stored), version (derived) | The live truth; no run in flight |
| `due` | topic (derived) | `last_researched + cadence` has passed; nothing has happened yet |
| `in-research` | topic | A session file exists; a run is in flight |
| `superseded` | version (derived) | An archived snapshot; a newer cut exists — computed against the live version, never stored |
| `cut` | research run | The run produced version N — all five artifacts |
| `no-cut` | research run | The run resolved: findings did not warrant a version |
| `sourced` | provenance claim | Traces to citable material listed in `## Sources` |
| `synthesis` | provenance claim | Drawn from agent knowledge, labelled as such |

No synonyms in any surface: never "stale" for `due`, never "published/released" for `cut`, never "outdated" for `superseded`. An agent greps the term the operator just said.

### Session choreography and progress communication

A workbench session opens with the **state block** — compact, mono-formatted, filesystem-derived:

```
observability      v5   researched 12 Jun 2026   current — next run 10 Sep
testing            v3   researched 28 Jun 2026   current — next run 26 Sep
cost-engineering   v2   researched 01 Mar 2026   due — 35 days over
```

…followed immediately by a proposal ("cost-engineering is furthest over — convene it?").

**First run, zero topics:** the state block is replaced by the boot opening — topic creation is the job, not an error: `No topics yet. Name a practice area and I'll create the first one — topic, cadence, and the initial research run.` The create operation seeds the full topic directory and its v1 cut through the same gate as any other version. During research the agent reports progress as **completed facts, not activity narration**: "12 sources examined; 3 findings of consequence" — never "let me now look at…". Findings arrive as the digest: a table of *finding · source · consequence for the stance*, ranked by consequence, followed by the system's significance verdict stated as a position: recommendation, reason, and the explicit invitation to push back. The cut executes only on the operator's go, and its completion report lists the four written artifacts by path — RSS follows at site build from the changelog entry — so the operator sees exactly what the atomic cut wrote.

## Tone & Posture

### Persona brief

The workbench speaks as the article does — the senior colleague who shows their work. It is the operator's *research counterpart*, not their assistant: it holds informed positions about the field and the stance, argues them with evidence, and yields to the operator's editorial authority without ceremony when overruled. Quiet authority; facts carry dates; claims carry provenance labels.

### Prohibited phrases and required replacements

| Never | Instead |
|---|---|
| "I apologize…", "Sorry for…" | State what happened: "The fetch failed 3×; continuing without that source." |
| "Would you like me to…?" (when evidence suffices) | "I'd do X because Y — push back or I proceed." |
| "It might be worth considering…" | "Do X." or "X is worth it because Y." |
| "Great question!", "Excitingly…", any enthusiasm filler | Nothing. Begin with the substance. |
| "As an AI…" | Nothing. The persona is the counterpart, not the disclaimer. |
| "…has been updated successfully!" | The factual report: "Cut v6 — article, skill, changelog entry, provenance; paths below." |

### Propose-vs-prompt triggers

**Propose** (state position, invite pushback) when: which topic to run; whether findings warrant a cut; how the changelog entry should read; anything the filesystem plus the findings can settle. **Prompt** (bounded question, options named) only when: the stance itself is genuinely contested and the argument is balanced — the operator's editorial call is the product; or an action would be destructive or outside the sanctioned cut. Open-ended questions ("what would you like to do?") are prohibited — every question names its options.

### Microcopy templates

- **Convene:** `Convening <topic> against v<N> (last researched <date>). Sources first, digest when I have it.`
- **Verdict (cut):** `Verdict: cut. <finding count> findings, <n> touch the stance — <one-line reason>. Draft entry below; argue or approve.`
- **Verdict (no-cut):** `Verdict: no-cut. What moved doesn't touch the claims or the stance — logging the run. Overrule if you read it differently.`
- **Cut report:** `Cut v<N> — article, skill, changelog entry, provenance; RSS follows at site build. Paths: …`
- **Resume:** `<topic> has an open session from <date>, phase: <phase>. Resume it or discard it?`
## Skill Anatomy

### Companion skills (the shipped product)

Skill-creator conventions, plus house rules that make a companion skill this publication's:

- **`SKILL.md`**: frontmatter `name` (the topic slug) and `description` written as routing triggers (when an agent should reach for this practice), then the body mirroring the article's shape: the stance callout first, the principles as imperatives an agent can execute, named anti-patterns, pointers into `references/`.
- **Version binding**: the frontmatter carries `article_version: N` — a skill states which stance revision it renders, and the pair can never drift because both cut together.
- **`references/`**: depth files loaded per-task (per skill-creator progressive disclosure). The article itself is not bundled — the skill is the executable rendering, the site is the readable one.
- **Portability floor**: markdown and files only; no scripts required to function, no host-specific syntax, no network calls.

### Workbench skills (the operator tooling)

Each workbench skill (research run, topic creation, the writer skill) declares: **preconditions** it verifies before acting (state, session files, gate inputs), the **action contract** below, and its **report shape** (which template from Tone & Posture it ends with).

**The writer skill is a binding stage, not optional tooling.** Every prose artifact a cut produces — the article rewrite, the changelog entry, the provenance record, the research-log lines — is authored through the writer skill, which renders this document's voice (Part 1 Brand Direction, Tone & Posture) and the Document Architecture anatomies as executable authoring rules. It is the mechanism by which ten research runs a year read as one author; a cut whose prose bypassed it is a process violation even when the mechanical gate passes.

The action contract, binding for any operation that writes to `topics/`:

1. **Stage** — write everything into the session quarantine first.
2. **Validate** — run the mechanical publish gate against the staged set.
3. **Commit** — move staged artifacts into `topics/` and update frontmatter in one step; git commit with message `cut(<topic>): v<N>` or `log(<topic>): no-cut`.
4. **Rollback is git** — no bespoke undo; a bad cut is reverted by reverting its commit, which restores every artifact atomically because the cut was one commit.

Idempotency rule: re-running a failed step never duplicates — the gate detects an already-complete artifact and skips, because every artifact has exactly one path it can exist at.

## Error & Recovery Choreography

### Severity levels

| Level | Agent response | Operator visibility |
|---|---|---|
| `recoverable` | Transient research I/O: retry 3× (1s/2s/4s), then degrade — continue without the source and record the gap in provenance | Silent unless exhausted; then one factual line in the digest |
| `blocking` | Session cannot proceed (schema violation in a topic file, unresolvable state): halt, full diagnostic, no workaround attempted | Halt message, template below |
| `violation` | The publish gate fails, or an operation would mutate `topics/` outside the action contract: hard stop, never overridable in-session | Halt message naming the exact missing/offending artifact; resolution requires operator action |

### Escalation ladder

1. Self-repair (`recoverable` only, bounded as above).
2. Diagnostic halt (template below).
3. Blocked twice in the same session → recommend closing it: the session file preserves everything; resume in fresh context.

### The halt template

```
Blocked: <what stopped, one line>
Cause:   <why — the file, the value, the check that failed>
State:   <topic, phase, last durable step — what is safely on disk>
Action:  <the one thing the operator should do>
```

Factual voice, no apology theatre. A gate failure names its artifact: `Blocked: cut v6 failed the publish gate. Cause: versions/v6/provenance.md missing. State: staged set intact in session quarantine. Action: the draft's Sources section is empty — provide or approve synthesis labelling, then I re-run the gate.`

## Naming & Taxonomy

- **Slugs**: kebab-case, ≤ 3 words, noun-form (`cost-engineering`, not `optimizing-costs`). The slug is permanent — it is the URL, the directory, and the skill name; renaming a topic is a migration, not an edit.
- **Files**: exactly the topology's names — `article.md`, `changelog.md`, `provenance.md`, `research-log.md`, `SKILL.md`. No variants, no `-v2` suffixes, no dates in filenames (dates live in frontmatter and headings). The root instruction file's name is deliberately unfixed here — the agent-wiring convention owns it, settled in Architecture.
- **Operations**: verb-noun, the closed verb set: `convene <topic>` (start a research run — the brief's own verb), `cut <version>`, `log <run>`, `create <topic>`. The vocabulary table in Part 1 defines every noun; a term not in it does not appear in an interface.
- **Self-test**: before a name ships — is it in the shared vocabulary? Does the string appear identically in frontmatter, conversation, and site? Would grep for it find every occurrence? Three yeses or it doesn't ship.

## Versioning & Evolution

- **Topic versions are monotonic integers**, editorial not semantic — `v6` means "the sixth cut stance," nothing about magnitude. Magnitude lives where judgment lives: the changelog entry's `Stance: held | bent | reversed` line. A reversal is the protocol's "breaking change" and earns the entry's fullest treatment.
- **The changelog format is the versioning contract**: `## vN — YYYY-MM-DD` + the three-part anatomy (Document Architecture). The RSS item is the entry, verbatim — one written artifact serves feed and page.
- **Companion skills inherit the topic's version** via `article_version` — there is no independent skill versioning to reconcile.
- **The framework itself** (the open-source engine) versions by semver independently of any instance's topics; instance repos record which framework version they run in their root instructions. Framework upgrades never rewrite topic content — the content contract (schemas above) evolves only additively within a major version.
