# Slice 2.2 — site: Doc Shell & Trust

**Owner service:** site

**Surface:** site

**Complexity:** L

**Prerequisite:** Slice 2.1 merged

## Scope

This slice lands the graphical design system in the running app — the milestone's headline obligation as the bet's first user-visible rung. It builds the three-zone doc shell, lands the design tokens as CSS custom properties, and dresses Slice 2.1's rendered article in its full trust chrome: trust header, stance callout, TOC rail with scroll-spy, themed diagrams, designed code blocks. After this slice, `/databases/` is the article a reader trusts — not a styled-later placeholder.

**Required Capabilities:**
- The three-zone shell renders per `01-ui-design.md`'s shell zone rule and the App Shell spec in `docs/design-system.md` § Graphical UI: a 280px sidebar (wordmark, site pages, `Topics` label, topic tree, footer cluster with theme toggle) — sticky at ≥ 900px, an overlay drawer below 900px; a reading column with the essay measure capped at 72ch; a 240px TOC rail with `h2`/`h3` scroll-spy — sticky at ≥ 1280px, collapsing to an in-page details/summary outline below 1280px.
- The design tokens land as CSS custom properties per `docs/design-system.md` § Graphical UI: the OKLCH semantic token set in both first-class palettes (light `:root` and dark `[data-theme="dark"]` — `--color-surface`, `--color-text-body`, `--color-accent`, and the rest of the named set), the three self-hosted, subsetted families (`--font-serif` Literata, `--font-sans` Inter, `--font-mono` JetBrains Mono, `font-display: swap` with size-adjusted fallbacks), the type-scale tokens, the 8-point spacing tokens, and the visible focus states of the Interaction States spec.
- The theme toggle cycles light/dark/system, persists to `localStorage` under the key `theme` (values `light | dark | system`), defaults to system preference, and declares `color-scheme: light dark` — the shared light/dark rule in `01-ui-design.md`.
- The trust header renders before the article `<h1>` per the wireframe: mono-set 13px metadata — the version chip as a `.badge`, the researched date, and the `changelog` / `history` / `skill` face links as accent-coloured links; the freshness dot appears only while the current version's cut date is ≤ 14 days old.
- The stance callout renders the committed position at the article's opening: 2px `--color-accent` left bar, `--color-surface-alt` fill, body-ink text — the one place the accent touches a text block, per the `/[topic]/` micro-polish spec.
- Code blocks render per the Code blocks spec — `--color-surface-alt` well, 1px `--color-rule` border, mono block type — with the ghost copy affordance whose glyph swaps to a check in `--color-accent` for 1500ms on copy.
- Every surface is print-flat: hairline `--color-rule` separation, no shadow anywhere except the mobile sidebar drawer and popover/menu chrome — the two sanctioned shadowed elements.
- With JavaScript disabled the page remains fully readable and navigable: the theme falls back to system preference, the TOC outline renders as static links, and the mermaid figures show their fenced source — the progressive-enhancement constraint in `docs/design-system.md` § Graphical UI.

## Design

Implements the `/[topic]/` — Living Article view in `technical-design/01-ui-design.md` in full — wireframe, states, key interactions, and micro-polish spec — together with that file's shared shell rules (shell zone rule, light/dark, print-flat, accent budget, page-entry motion none). Lands the App Shell, Colour Architecture, Type Scale, Spacing, Interaction States, and Surface Craft specs of `docs/design-system.md` § Graphical UI as the running app's foundation. Consumes Slice 2.1's pipeline output unchanged — the `RenderedDoc` html and toc from the Loading API in `technical-design/03-api-design.md`; no new core calls are introduced.

## Proof of work

**Proves:** A reader at `/databases/` on the built export sees the article in the shipped design system — trust header, stance callout, live TOC, themed diagrams — with the theme persisting across visits and the whole page surviving JavaScript being turned off.

**How we prove it:** Walk `/databases/` in a real browser against the built static export: read the trust header (version chip, researched date, and the three face links) above the article title; read the stance callout with its accent bar; scroll and watch the TOC rail highlight the active heading, then click a TOC entry and land on its anchor; see the mermaid diagrams rendered in theme inside their reserved-space containers with no layout shift of settled text; toggle the theme and reload, observing the choice persisted via `localStorage`'s `theme` key and both palettes rendering from the tokens. Then disable JavaScript and confirm full readability: the essay, the trust header, the static TOC links, and the diagrams' fenced source all present.

**Test file:** `tests/bets/first-living-topic/test_slice_8_site_doc_shell_and_trust.py` — generated red at Delivery start; traces to the `/[topic]/` view and shared shell rules in `technical-design/01-ui-design.md` and the `RenderedDoc` contract in `technical-design/03-api-design.md`.
