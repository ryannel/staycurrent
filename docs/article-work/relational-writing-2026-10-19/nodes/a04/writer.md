# a04 writer handoff

Status: ready for orchestrator promotion and browser/independent review.

- Staged fragment: `docs/article-work/relational-writing-2026-10-19/nodes/a04/article.astro`.
- Owned components: `src/components/relational-next/a04/BoundaryPlayer.astro`, `scenes.mjs`, `verify.mjs`.
- Evidence: `sources.md` beside this report, including pinned native runtime, exact outputs, source links and limits.

The article follows Mina’s shop order 103 from a00. It relies on a03 for stock/concurrency and transaction durability guarantees, and gives practical high-level answers before introducing a20–a23. All supplied h2/h3 anchors are retained. Imports are relative to the final `src/articles/relational-next/a04.astro` destination. No final fragment, shared registry or wrapper edited. Shared wrapper owns the bottom child list.

Read the three fixed reference source articles in full including figure setups, captions and explanations, and inspected the reference preview’s sequence-player controls and index comparison. Their same-example/one-change pattern informed the draft. Five original interactive comparisons carry request, representation, pool occupancy, uncertainty and external-intent explanations. Manual steps, 4.5-second playback and preserved-step variant comparison keep causes readable. Mobile styles stack state comparisons and retain wrapping controls; actual promoted browser checks remain pending.

Native run2 used Node 24.16.0, pg 8.23.1, PostgreSQL 18.6, process Europe/Stockholm and database UTC. Exact values, bound injection-shaped text, null/undefined and time conversion, scoped read, rollback, exhausted pool and release/reuse all passed. Illustrative schedules and unperformed acceptance cases are explicitly labelled. Both Astro files compile with zero diagnostics. No shared full build, commits or nested reviewers.

Browser review targets after promotion:

1. Figure 1 final-step response comparison changes user knowledge while committed state remains.
2. Figure 2 step 3 exact versus rounded identifier; path labels update with choice.
3. Figure 3 step 2 pool occupancy changes when client release moves.
4. Figure 4 same missing-ack evidence with different final database outcome.
5. Figure 5 final-step discoverable intent and repeated external-effect caveat.
6. 390px/light+dark: state cards stack, 44px controls wrap, long values wrap, source tables scroll within their regions, no body overflow. Full text alternatives and keyboard focus work.

Tree proposals: none. Existing child ownership is sufficient. The parent can teach the first useful integration case without another branch.

## Orchestrator repair after B03

The orchestrator repaired the shared player's endpoint focus and narration-aware
pacing, and reduced empty phone event space. Article, scene data and native driver
verification are unchanged. Root checked all twenty endpoint transitions; see
`batches/b03/root-a04-repair.md`. Independent repair recheck remains required.
