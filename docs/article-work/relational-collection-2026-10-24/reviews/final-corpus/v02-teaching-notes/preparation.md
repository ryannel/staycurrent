# Teaching corpus round 2 · preparation receipt

Preparation completed on 24 October 2026 before release of the frozen current collection. This is reference calibration, not a judgement on the collection.

## Permitted inputs read

- `AGENTS.md`.
- `.agents/skills/staycurrent-review/SKILL.md`.
- Only the teaching perspective, `.agents/skills/staycurrent-review/perspectives/teaching.md`.
- All three fixed writing references, through separate numbered bounded outputs from `scripts/read-writing-reference.py`.

| Reference | Complete bounded parts | Text SHA256 | Completion check |
| --- | --- | --- | --- |
| Sequence diagrams | 1–6 of 6 | `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c` | Every END marker observed; no clipped script output |
| Indexes | 1–7 of 7 | `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1` | Every END marker observed; no clipped script output |
| Storage and durability | 1–6 of 6 | `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07` | Every END marker observed; no clipped script output |

The text included the complete introductions, sections, figure instructions, worked examples, surrounding transitions, code, comparison tables, limitations and sources. I have not read any current collection article, plan, commission, author note, history, decision or earlier report during preparation.

## Actual drawings studied

Used CUA only for browser interaction in independently created Chrome tab `315244724`, at the unchanged default viewport and System theme. Preview origin: `http://127.0.0.1:4350`. Inspected the rendered drawings directly using screenshots of their figures, rather than inferring their appearance from captions or source.

- `/review/examples/sequences/`: all 13 figures. Read the basic four-message path, activation and waiting bars, email call, outbox worker, crowded and focused drawings, ordering alternatives, guarded paths, loop, parallel requests, TLS ladders, fork/stair, repeated versus batched lookups, and trust boundaries. Compared the instructed alternatives, including 3-second waiting, no-wait email, both focused drawings, late poll, invalid details, never-ending polling, missing parallel reply, TLS 1.3, delegated control and one batched lookup.
- `/review/examples/indexes/`: all 11 figures. Studied the six-page scan, sorted entries and TIDs, B-tree descent, linked-leaf range, secondary-to-clustered lookup, range spread, column order, visibility map, write costs, splits and deletion/rebuild. Compared scattered and customer-ordered rows at the same 22% match, all three composite orders, covering before/after vacuum and an unrelated update, HOT/non-HOT costs, and whole-page deletion before rebuild.
- `/review/examples/storage/`: all 10 figures. Studied page fill, buffer hits and eviction, row versions in the table and undo, hypothetical loss without a log, durable WAL commit before the table page is written, query/background writing, group commit, three crash moments, flush layers and asynchronous commit. Compared wide rows, both version stores before cleanup, background writer outcomes, sharing off, all crash moments, dishonest flush and both asynchronous flush outcomes.

All touched selections were restored to their initial defaults. All reference sliders were reset (sequence sliders to 0, index sliders to 1, storage sliders to 0). The owned tab was closed and released. No viewport, theme or global preference was changed; no user-owned tab was acted on.

## Calibration for the seven checks

1. **Starting point.** An unfamiliar noun gets a concrete referent before the explanation depends on it: message and lifeline; page and row location; memory and disk. A link can deepen an explanation, but it must not substitute for the premise a reader needs immediately.
2. **Order.** Each reference begins with the useful answer, then adds one complication to an established example. Hard mechanisms have observable intermediate states: nested waiting, index descent and fetch, commit record followed by flush followed by reply. I will follow each completed route from the introduction and check what it assumes at every hand-off.
3. **Examples.** Mina's repair, customer 42's orders and P7's price change remain recognisable as the mechanism changes. Awkward cases alter the example rather than starting an unrelated one: missing reply, poor column order, another row clearing a page's visibility bit, and power failing before or after a flush.
4. **Showing.** The reader is told what to watch, sees the change, then gets its implication. Drawings earn their space by making order, location, count or survival visible. A static table or worked trace may serve this equally well; animation itself is not the criterion.
5. **Judgement.** Mechanisms end in a usable decision with a boundary: which flow needs its own diagram; when a scan or index is cheaper; when extra covering columns cost too much; which data may tolerate recent loss. Invented small models and observed larger runs are explicitly distinguished.
6. **Gradual exposure.** The parent provides enough of the answer for its own decision before offering deeper mechanisms. The indexes reference announces the clustered lookup, first teaches the B-tree, then returns to that lookup. Companion links take detailed failure analysis, maintenance and engine operation once the parent has supplied their immediate meaning.
7. **Placement of additions.** I will judge each coordinator-named addition on its reader effect, ownership and point in the argument, without earlier findings. Extra length earns its place when it supplies the missing causal step or comparison; an insertion needs to carry the explanation forward rather than require the reader to resume an interrupted argument.

## Awaiting release

No collection verdict has been formed. Ready for the coordinator's exact frozen complete 58-piece manifest, corresponding plans and commission, neutral list of added passages/figures, and numbering allocation. The eventual report will record all seven ordered checks for every piece, trace every finished route from the introduction, and directly inspect every actual current figure under the permitted inputs.
