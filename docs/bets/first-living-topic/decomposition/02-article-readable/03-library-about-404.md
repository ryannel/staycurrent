# Slice 2.3 — site: Library, About & 404

**Owner service:** site

**Surface:** site

**Complexity:** S

**Prerequisite:** Slice 2.2 merged

## Scope

This slice completes the milestone's route set around the article: the `/` topic library, `/about/`, and the designed 404 — the way in, the explanation, and the honest dead end. It builds each on Slice 2.2's shell and tokens, and it makes the sidebar's face links live, with the routes that land in Milestone 3 reaching the designed 404 — the accepted mid-ladder state the milestone index records.

**Required Capabilities:**
- `/` renders the topic library per the `/` — Topic Library view in `01-ui-design.md`: a responsive card grid (auto-fill columns per the Responsive grid spec), each card carrying the title in serif `--text-h3`, the stance one-liner clamped to two lines in `--text-ui-small`, and a meta row of version `.badge` plus researched date in `--text-meta` mono; clicking a card navigates to `/[topic]/`.
- The first-run empty state renders when zero topics exist: the designed sentence "No topics yet. The first research run creates one." with the framework-docs link — the Empty States pattern, never a blank grid.
- `/about/` renders the "How a living article works" prose per the `/about/` view spec — the shared vocabulary (topic, article, version, cut, changelog, provenance, stance) explained for the curious reader, at the essay measure, with the utility-page `<h1>` convention.
- Any unmatched route under the static export renders the designed 404 per the 404 — Not Found view: the display-serif line "This page doesn't exist.", one sans sentence below it, and the topic tree inline as page content — never a bare host-default error page.
- The sidebar's topic entry expands to its four faces (Article, Changelog, History, Skill) per the Sidebar anatomy in `docs/design-system.md` § Graphical UI; the changelog, history, and skill face routes reach the designed 404 until Milestone 3 lands them — the accepted mid-ladder state.

## Design

Implements the `/` — Topic Library, `/about/` — About, and 404 — Not Found views in `technical-design/01-ui-design.md` — wireframes, states (including the first-run empty state), interactions, and micro-polish specs — on Slice 2.2's shell, tokens, and components, with the card grid per the Responsive grid spec and the sidebar face-link disclosure per the Sidebar anatomy in `docs/design-system.md` § Graphical UI. The library's cards render from `listTopics`' `TopicSummary` sweep in `technical-design/03-api-design.md` — title, stance, version, and `last_researched` are that shape's fields.

## Proof of work

**Proves:** A reader can enter through the library, learn how the product works at `/about/`, and never hit an undesigned dead end — every miss, including the face links whose routes arrive in Milestone 3, lands on the designed 404.

**How we prove it:** Walk the built export in a real browser: open `/` and see the databases card — serif title, two-line stance clamp, version badge and researched date — and click through to `/databases/`; open `/about/` and read the "How a living article works" prose; request a nonexistent URL and land on the designed 404 — the display-serif line, the sentence, and the inline topic tree, not a host default; expand the sidebar's databases entry and follow a changelog/history/skill face link, landing on the same designed 404 — the accepted mid-ladder state until Milestone 3. The first-run empty state is proven through the same real pipeline against a temporary zero-topic copy of the tree — the designed sentence renders in the vacated grid, and the repository's own `topics/` is never touched.

**Test file:** `tests/bets/first-living-topic/test_slice_9_site_library_about_404.py` — generated red at Delivery start; traces to the `/`, `/about/`, and 404 views in `technical-design/01-ui-design.md` and the `TopicSummary` shape in `technical-design/03-api-design.md`.
