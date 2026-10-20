# Results · skill trial · 20 October 2026

Two articles were regenerated from their plans with the skills at f37ab71, without reading the live drafts, then reviewed by the four fixed article perspectives until they passed.

## Outcome

| | a00 live, first review (c01) | a00 trial, first review (d01) | a03 trial, first review (d01) |
| --- | --- | --- | --- |
| Distinct required problems | 7 | 5 | 4 (plus 1 shared-layout) |
| Of which figure form or layout | 3 | 0 | 1 (a table clipping at desktop widths) |
| Correctness bugs | 1 | 0 | 1 (move listing broke capacity under concurrency) |
| Rounds to pass | 3 | 3 | 3, final one-phrase fixes by the coordinator |

| Article | Live words (`wc -w`) | Trial words, first draft | Trial words, final |
| --- | --- | --- | --- |
| a00 | 4,515 | 5,259 | 5,862 |
| a03 | 4,225 | 4,925 | 6,112 |

Teaching's placement check (check 7) found every repair addition belonged where it was placed, so the growth was judged teaching rather than drift.

## What the new skills changed

- **Figures arrived in the right form.** No reviewer asked for a figure to be redesigned. Example data was in real tables with keys, step holds were 3.4 to 14 s, keyboard focus held at both ends, and contrast problems were limited to faint highlights and outlines.
- **The running example needed a ruling.** a03 switched to class bookings to match its children and drifted from a00's names. Three perspectives caught it. The figures skill's consistency rule worked as a check but did not prevent the drift.
- **Scope checks replaced a length cap without friction.** No addition was judged to belong in a child article.

## What still went wrong

1. **Terms used before they are explained** was the most common failure: isolation levels, snapshot, row lock, write-ahead log, replica, pages, replication lag, lock, predicate. Three perspectives raised it on both pages, and it recurred in repairs.
2. **The writers' own evidence missed two correctness bugs.** Both verify scripts passed, yet the practitioner's reproduction found that the move listing broke capacity under a repeated concurrent move and that a `FOR UPDATE` claim was false. In both cases the writer's example data happened to hide the failure.
3. **Repairs introduced new required problems** twice: the Serializable row in the new protection table, and the same table clipping after its text grew. Rechecks caught both.
4. **Every subagent had a hidden browser pane.** Reviewers fell back to headless Chromium and page timers, as the skill now allows.

## Proposed skill changes (not applied)

1. **Write skill: a terms pass before returning.** List each technical term with the sentence where it is first used and the sentence where it is explained; fix any term used first.
2. **Figures skill: adversarial evidence.** A verification script must include at least one case that would fail if the protection were wrong, with data chosen so the failure is visible (for example, capacities where a missed recheck would overbook rather than hit a constraint by chance).
3. **Figures skill: wide prose tables.** A table with more than three prose columns should be cards at every width, not a table that collapses only on phones.
4. **Stepper:** add `reset()` and fix the `.relational-draft [data-step]` style clash (proposed as a separate session).

## Deferred outside the trial

- a18's Figure 4 repeats the trial a03's Figure 5 and should point to it if the trial a03 is adopted (practitioner-12).
- a19 names its instructors Mina and Tariq; rename to Lena and Ravi if the trial a03 is adopted.
- The draft breadcrumb skips the parent (editorial-18).
- Adopting either trial page means moving it into src/articles/relational-next/ and its components alongside.
