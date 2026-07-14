# Retrospective — first-living-topic

The founding bet: build the embedded content-core, seed the databases living topic,
render it through the site's trust apparatus, ship distribution and the fail-closed
publish pipeline, and prove the research loop closes once end to end. It did — 19/19
board, four milestones, fifteen slices, closed by a live research run resolving as an
honest no-cut through the real gate with zero hand-edits.

## Patterns mined from the slice records

- **[R1] The gate validated integrity but not schema — the same defect, twice.**
  change-proposals 6 and 7 are one finding in two stores: a gate-passed cut could
  land content (blank stance; bullet-prefixed changelog `**Stance:**`) that the site
  loaders then reject at render, after the staged tree is gone and with no sanctioned
  repair. Caught only because slice reviews sandboxed the real machinery. The
  recurrence promoted it from a patch to [ADR 0006](../../architecture/decisions/0006-gate-shares-the-loaders-schema-path.md):
  the gate now validates through the loaders' own code path. **Process signal:** when
  a fix closes a hole in one store, sweep the sibling stores in the same pass rather
  than waiting for the second incident.

- **[R2] Fixture-root builds leak into and flake against the shared real build dirs.**
  The `.next` cache not keyed on `STAYCURRENT_REPO_ROOT`, `out/`/`public/` restored
  only when they pre-existed, dates authored in local time vs the gate's UTC — the
  same class of test-hygiene defect surfaced in slice 10's and slice 4.2's site-build
  halves, and only one sibling test (`test_topic_versions_fixture`) had the hardenings.
  Captured as maturity **G9** (git-config fragility + non-xdist-safe shared build
  dirs). **Process signal:** the first fixture-root-build test to get a hardening
  right should have its pattern promoted to a shared helper immediately, not
  re-discovered per slice.

- **[R3] The review gate earned its keep every slice.** Every slice's four-lens review
  (and the milestone experience audits) found real defects the worker's green missed —
  a false "Copied", a dead mermaid box on the changelog page, duplicate DOM ids, the
  gate holes above, the archived banner occluded on mobile. This is the process
  working as designed (cheap execution under a strong gate), not a defect — recorded
  so the next bet keeps the review depth rather than trimming it under time pressure.

## Follow-through audit

No previous bet — this is the first. Nothing to audit; R1–R3 seed the next
retrospective's audit.

## Significant discoveries (do queued bets need re-pitching?)

- **The framework-extraction bet has two hard constraints already on file** (discovery
  notes): a zero-topic instance cannot build (Next's static export needs ≥1 `[topic]`
  route), and there is no canonical framework-docs URL yet. Extraction must solve the
  zero-topic first-run before "the first research run creates one" is literally true
  for a fresh instance. Re-pitch input, not a blocker to the next topic bet.
- **The skill-design bet's premise is intact and sharper** (change-proposal-2): one
  topic likely yields several focused skills, not one — the companion-skill unit is
  still undesigned, and v1 ships an honest placeholder. No queued bet's premise was
  invalidated.

## Readiness

Green is not live. The site works against the local shipping build (the served
`out/`), and the loop closed with a real no-cut. **Not yet done:** the trunk merge,
the first GitHub Pages deploy, the `staycurrent.dev` DNS binding, and the deployed-
origin walk + red-check PR experiment that close Milestone 3's front-door proof at the
real URL. A real *v2 cut* has been exercised only in the rehearsal (fixture tree) and
not live — the live run honestly resolved no-cut. Carried forward as an explicit item,
not assumed.

## Action items

- **first-living-topic-R1** — When the next content-schema or gate change lands, verify
  gate↔loader parity holds across *all* content stores in one pass (ADR 0006 is the
  standard). Owner: content-core.
- **first-living-topic-R2** — Close maturity G9: neutralize git config on fixture
  commits and gate any parallel build behind per-worker output dirs before enabling
  xdist; promote the fixture-root-build hardenings to one shared helper. Owner: test-infra.
- **first-living-topic-R3** — At the first live v2 cut (next research run that moves a
  stance), confirm the deployed site shows the new version standing alone with the prior
  archived — the one loop path the live run did not exercise. Owner: operator.
