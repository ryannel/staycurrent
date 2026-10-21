# Repair decisions · skill trial 2 · r01

Coordinator: the session that arranged trial 2, 21 October 2026. Version reviewed: b5586b8. Four fresh reviewers, one per perspective, each saw both pages for the first time.

| Perspective | a00 required | a00 optional | a03 required | a03 optional |
| --- | --- | --- | --- | --- |
| Practitioner | 2 | 7 | 1 | 4 |
| Teaching | 1 | 2 | 1 | 4 |
| Editorial | 2 | 5 | 4 | 5 |
| Visual | 1 | 4 | 5 (one shared component) | 2, plus 1 on both |

Distinct required problems after merging duplicates: a00 5, a03 10 plus 1 shared component.

Each decision below names the problem. The fresh reviser chooses the repair with staycurrent-revise; suggestions in the reports are options, not instructions.

## Shared decision · the race histories (both articles)

practitioner-9, teaching-7, visual-1, visual-6, visual-7 and visual-13 are one problem seen from four sides. The two articles draw the same kind of race in two figure languages, both hide the order of events at the outcome, and a00 teaches the race mechanism at a03's depth.

- **Ownership.** a00 gives the high-level answer: two sessions read before either writes, the oversell, and that a protection exists, with one protection shown working. Comparing protections, the Read Committed recheck and the 40001 retry belong to a03. a03's race figure should build on a00's rather than replay it, for example by inviting the reader who has seen the oversell to predict the protections.
- **One figure language for histories.** In both articles a history is drawn as rows in time order, one column per session, with a wait shown as its own state and a waited statement's result on the row where it arrives, after the commit that released it. At the outcome step every row is visible without scrolling, at 375 px and at 1280 px. Phones keep both session columns rather than stacking whole sessions.

## Accepted · a00

| Findings | Decision |
| --- | --- |
| practitioner-1, teaching-1 | Accepted, required. The oversell is not a visibility problem: both reads happen before either write, and the write does not check the value read. Say what actually happens. |
| practitioner-2 | Accepted, required. Losing one machine is answered by a replica and failover, as Figure 6 says. Distributed SQL is for requirements a simpler service cannot meet; keep the route advice consistent with that. |
| editorial-1 | Accepted, required. Section endings that list a child's contents in its heading phrases. Point onward the way the reference articles do. |
| editorial-2, teaching-2 | Accepted, required. Figure 3's misleading query must be visible to the reader, and `GROUP BY` and `WITH` need a plain explanation where they first appear. |
| visual-1 | Accepted, required. See the shared decision. |
| practitioner-4, visual-2 | Accepted. Figure 5: a missing order after a lost reply does not prove the first attempt failed (see a03 practitioner-3); the before-COMMIT drawing must agree with its explanation, and no committed row is shown as removed. |
| practitioner-5 | Accepted. Engine defaults: do not imply that InnoDB's Repeatable Read prevents the read-then-write oversell. |
| practitioner-6 | Accepted. The corrected "still due" query must not drop orders without lines, the fault the figure has just taught. |
| practitioner-7, practitioner-10, teaching-3, visual-5 | Accepted together. Read the plans for the reader: name scans as the plan does, give one page count and say what it includes, say where a listing is trimmed, and include the estimates the brief asks for if they help that reading. |
| practitioner-8 | Accepted. `SET NOT NULL` takes a lock that blocks the table while it scans; the staged change must say so. |
| practitioner-9 | Accepted. See the shared decision. |
| editorial-3, editorial-4, editorial-5, editorial-6, editorial-7 | Accepted. The remedy the Figure 1 paragraph promises; headings; terms used before explanation; repeated provenance (say it once in captions and Sources, not in the prose each time); Figure 6 card wording. |
| visual-3, visual-4 | Accepted. Figure 3 shows the dropped rows and the missing total rather than telling them, with plain words instead of `⋈`; listings fit the column at desktop width. |

## Accepted · a03

| Findings | Decision |
| --- | --- |
| practitioner-3 | Accepted, required. Correctness, reproduced on PostgreSQL 18.6: not finding R8 after a lost reply means only that the first attempt has not committed yet, not that a repeat is safe. State what the application can safely conclude and do, consistent with a22. Add the in-flight case to `verify.mjs`. |
| editorial-8 | Accepted, required. Headings should name their subjects as a reader would look for them. Keep every registry anchor. |
| editorial-9 | Accepted, required. Link text that quotes other articles' heading claims as sentence subjects. |
| editorial-10 | Accepted, required. Compressed sentences, including the opening. |
| editorial-11 | Accepted, required. Link text must name what the reader will find. Trial pages link to the live collection by design; describe the target in plain words rather than quoting an old heading. |
| teaching-4, editorial-14 | Accepted, required. The counting variation is the article's case for a row that starts matching. Show it or cut it to its one point and leave the run to a18, which owns it; either way, no request number may mean two different bookings. |
| visual-6, visual-7 | Accepted, required. See the shared decision. |
| visual-8 | Accepted, required. Prose tables with more than about three columns become labelled cards at every width, as the figures skill says. |
| visual-10 | Accepted, required. Listings, including their comments, fit the column at desktop width. |
| practitioner-11 | Accepted. Report the load test as what one run showed, not as a fact about every run; the reviewer's rerun differed. |
| practitioner-12 | Accepted. In Figure 3 the statement that failed was COMMIT; name the option and prose accordingly. |
| practitioner-13 | Accepted. `innodb_rollback_on_timeout` concerns lock-wait timeouts, not duplicate-key errors. |
| practitioner-14 | Accepted. The durability paragraph assumes storage honours a flush; say so briefly or link to the article that owns it. |
| teaching-5 | Accepted. The anomaly table must not suggest Repeatable Read stops the counting failure. |
| teaching-6 | Accepted. Show the deadlock and its lock-order fix compactly in the shared history form, rather than only telling it. Hand the full protocol to a18. |
| teaching-7 | Accepted. See the shared decision. |
| teaching-8, editorial-15 | Accepted. Terms used before explanation (locks, waiting, sessions, error codes), and a starting-point sentence for readers who arrive at a03 directly. |
| editorial-12, editorial-13, editorial-16 | Accepted. Asides that read as patches; the engine cards' lead-in ("other engines" before PostgreSQL's own levels); "worksheet" and the run record in the final teaching section. |
| visual-9, visual-11 | Accepted. Committed-rows tables stay inside the figure card; instructors marks its key. |

## Coordinator

| Finding | Decision |
| --- | --- |
| visual-12 | Accepted and repaired in `src/components/editorial/Prediction.astro`: the summary now uses the site's accent (link) colour instead of the explorables blue. Only the trial a03 uses this component. |
| Writers' proposed example extensions | Merged into `docs/coverage/relational-example.md`: a00's scaled copy, `delivery_country` and deletion timeline; a03's load clients and swap. a03's optional instructor counter stays in prose only. |
| a00 writer's recovery-timeline question | The example record's timeline (a00's) is canonical for the collection; a07's 09:10 timeline is recorded as a disagreement for when a07 is next revised. |

## Not a finding

The review banner's "38 of 38 drafts available" is shared route text for the live collection (editorial, Limits). Trial pages reuse the layout by design.
