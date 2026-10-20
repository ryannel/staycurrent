# What this run says about the review skill

A test of the fixed-perspective review skill (uncommitted on 20 October 2026) on the relational introduction, a00. Before this run, the a00 page had already passed a four-role review on the same day (`relational-introduction-polish-2026-10-20/b01`, `b02`).

## Did the fixed perspectives catch the shop table?

Yes. The visual reviewer flagged "Four kinds of fact in the shop" as a required finding (c01 visual-1). Nobody told it about the table. The finding appears in its first-reading record (`c01/visual-first-reading.md`, item T1), written before it read any prose. It names the packed `name = value` cells, the TEA/MUG key mismatch and the missing rows used later. It also noted the cells wrapping mid-pair at phone width.

Three caveats about what this proves:

- **The check names the problem.** Visual check 2 gives this exact case as its example ("a small table per relation instead of a single table that packs each relation's columns into one cell as `name = value` lists"), and the write skill says the same. So this run shows the reviewer follows the check. It does not show the check would catch an unnamed failure of the same kind.
- **The perspective also caught failures the checks don't name.** That is better evidence that the perspective generalises. Figure 4 found a primary-key row by scanning rows already stored in key order. Figure 5's early branch contradicted itself. Two figures ended on steps that changed nothing. The earlier review had passed all of them.
- **No other perspective saw the table.** Teaching passed "Showing", and editorial did not judge form. The earlier "interaction" role reviewed only interactive figures, so the static table fell between roles. A perspective that owns everything the reader looks at, including static tables and code, closed that gap.

## Results of the run

| Build | Practitioner | Teaching | Editorial | Visual |
| --- | --- | --- | --- | --- |
| c01 (same HTML as the live b02) | pass, 4 optional | 1 required, 4 optional | 3 required, 10 optional | 3 required, 5 optional |
| c02 (after repair) | pass, 2 optional | pass, 3 optional | pass, 7 optional | pass, 4 optional |
| c03 (narrow round) | pass, 1 optional | pass, none | pass, 2 optional | pass, none |

The new review found seven required problems in a page the earlier process had passed. The editorial and visual perspectives found six of them. The three optional findings from the c03 rechecks were one-phrase wording fixes, which the coordinator applied after c03 (recorded in `repair-decisions.md`). The final source passes `pnpm build`.

## Changes the review skill should consider

1. **Playback timing contradicts itself.** Visual check 4 and the write skill both say automatic playback should "leave time to read all visible text". The writer followed that literally: it timed the whole visible text at 180 words a minute and got holds of 34–42 s per step. The visual review then flagged the result as unusably slow. Reword both skills: time each step from the text that changed at that step, and let the reader pause.
2. **The report shape has no place for the first reading.** Visual check 1 asks for a record of first readings, but the fixed report has only one-line check notes. This run asked for a separate `visual-first-reading.md`. Name that file, or a section for it, in the report shape, so runs keep the record in the same place.
3. **Keep the running example consistent across figures.** Visual check 2 asks for keys that "visibly connect across examples". It does not ask that the example's values stay consistent across figures. Order 104 was refused in Figure 3 but present in Figure 5. The `purchase_attempt` column appeared in a caption but not in the tables. Only the c02 rechecks caught these, and two perspectives raised the same thing. Add consistency of the running example's rows and columns, from figure to figure, to visual check 2 or teaching check 3.
4. **Article mode has no length counterweight.** All four article perspectives can only add. The two repair rounds grew the article source by about a quarter (about 3,500 to 4,360 words, counted the same way before and after). Teaching judged proportion only because the coordinator asked it to in the recheck. Either ask teaching or practitioner to judge proportion in every article recheck, or run value in article mode when a repair adds a figure or section.
5. **State a contrast threshold.** Visual check 5 says only "readable". The c02 reviewer measured light-theme text at 3.15:1 and rated it optional. As calibration, name the usual 4.5:1 for body text and 3:1 for large text and graphics.
6. **Finding ids collide across rounds.** Each recheck restarts at `-1`, so "editorial-1" means different things at c01 and c02. Prefix the build (`c02 editorial-1`) or continue the numbering.
7. **Say who repairs shared page text.** Editorial raised wording in the draft layout's "Read the collection" box. That box is no writer's file, so the coordinator had to fix it. Say that findings on shared layout or site text go to the coordinator.
8. **Note when the browser was hidden.** The visual reviewer, running as a subagent, had a hidden browser pane both times. Animation runs at about one frame a second there, and screenshots can be stale. Its timings came from page timers, which ran on time. The visual perspective should either say that playback and animation need a visible window, or ask the coordinator to confirm them.

## Smaller observations

- The practitioner perspective ran the article's evidence again on a disposable PostgreSQL 18.6 cluster without being asked, and found a real correctness issue (practitioner-1: an abandoned transaction keeps its locks until the server notices). Its inputs could say that this kind of reproduction is welcome when a database can be run locally.
- Teaching and editorial read figure step text from the built scripts rather than by playing the figures. That was enough for their checks, but editorial's input "as rendered" is ambiguous for scripted figures. The skill could say that reading step text from the build is acceptable.
