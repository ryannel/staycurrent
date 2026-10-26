# Independent combined first review — batch 43

**Version:** crdb-locality v01, “CockroachDB table locality and region survival”. All eight current article/component files match `review-source.json`; all ten snapshot source/executable hashes match `v01/evidence/source-hashes.json`.

**Scope:** One fresh first reading covering technical accuracy, practitioner judgement, teaching/writing and actual rendering. Figures/labels/captions preceded the body reading; `initial-notes.md` was saved before consulting the plan, ownership, example facts or technical evidence. No manuscript edits, delegation, second full reading, authoring-checks or previous quality verdicts.

## Findings

No critical or medium finding. No optional change needs to reopen this version.

## Teaching, writing and ownership

The article fulfils its decision: select a table locality from access patterns and a database survival goal from failures, then distinguish declared policy, actual placement and complete request behaviour. The supplied plan and incoming responsibilities are covered. The opening supplies the prerequisite routes for quorum reasoning and native gateways/ranges; it does not rederive those lessons. Query tuning, detailed follower-read protocols and cluster maintenance remain with their named owners.

The sequence teaches the consequential distinction visually. Figure 1 keeps products and price fixed while the gateway changes; Figure 2 makes the regional prefix visible in both primary rows and history entries; Figure 3 exposes West's stock dependency despite the North order; Figure 4 places GLOBAL's write cost above the repeated regional result; Figure 5 distinguishes votes from copies by removing the same home region under two policies. Figure 4 is appropriately a high-level trade-off model rather than a timestamp-protocol lesson.

This is comparable bounded teaching to Indexes / “Composite (multicolumn) indexes” (fixed query and changed arrangement), Storage and durability / “Write-ahead log” (authority and outcome separated from a nearby copy), and Sequence diagrams / “Trust boundaries” (a box boundary makes a request dependency visible). Those passages and finished drawings were inspected at the reference preview. Headings such as “Choosing a row's home region” and “Checking policy and placement” name their subject directly. The explicit duplicate-103 example earns the denser uniqueness explanation. The before-103 purchase reset is introduced before changing stock. The prose reads as one piece.

The original shared-example snapshot hash is `3622e871de36d5bfbda3b16fe2c2fc2dc2eef2d49d8749e3d320d0825f8893fb`, matching its input receipt. Orders, dates, lines, 29.00/no-payment outcome, post-purchase 10/0/4 stock, explicit North/West assignments and the independent three-status reference table agree with that input. No geography or customer residence is inferred from the invented region labels.

## Technical check and native provenance

Consequential claims agree with the applicable primary material checked:

- [ALTER TABLE, v26.2](https://www.cockroachlabs.com/docs/v26.2/alter-table#set-localities): explicit table/row homes, gateway default and primary fallback, hidden column, explicitly configured foreign-key inference and disabled-by-default automatic rehoming.
- [Regional by row engineering explanation](https://www.cockroachlabs.com/blog/regional-by-row/): implicit prefixes on every index preserve declared uniqueness; additional regional checks and explicit composite keys have different consequences.
- [Global tables, v26.2](https://www.cockroachlabs.com/docs/v26.2/global-tables) and [Global tables engineering explanation](https://www.cockroachlabs.com/blog/global-tables-in-cockroachdb/): current regional reads trade against write latency and timestamp waiting. The article does not claim a fixed duration or that every replica acknowledges every write.
- [Survival goals, v26.2](https://www.cockroachlabs.com/docs/v26.2/multiregion-survival-goals) and [multi-region engineering explanation](https://www.cockroachlabs.com/blog/under-the-hood-multi-region/): database-wide goal, zone default, three-region requirement and regional-table voter layouts. Figure 5's 2-of-3 versus 3-of-5 arithmetic is correct under its communicating-survivor assumption.
- [SHOW REGIONS](https://www.cockroachlabs.com/docs/v26.2/show-regions), [SHOW PARTITIONS](https://www.cockroachlabs.com/docs/v26.2/show-partitions), [SHOW RANGES](https://www.cockroachlabs.com/docs/v26.2/show-ranges) and [ALTER DATABASE](https://www.cockroachlabs.com/docs/v26.2/alter-database): supplied policy/inspection syntax and the distinction between voting, non-voting and leaseholder output. The expensive DETAILS query is deliberately scoped.

Inspected submitted SQL, authored/resolved SQL, actual setup/configuration outputs, outcome records, command records, runtime identity and cleanup. Seven executed-SQL hashes match `outcomes.jsonl`; both authored/resolved template pairs match `template-resolution.json`. Runtime was pinned CockroachDB v26.2.8, cluster `ba4cd26c-fbfd-48ad-b1e5-eb2890c6dc6e`, database `sc_crdb_locality`, user `sc_crdb_locality_writer`, nine labelled local processes inside the owned network-none container.

The successful native result establishes identities, gateway regions and database policy: North primary, all three regions, `SURVIVE ZONE FAILURE`. Authored setup returned six CREATE TABLE successes, then failed while waiting for CREATE INDEX schema visibility with SQLSTATE 57014 under the 45-second statement timeout. Data insertion, row/constraint probes, partitions, ranges and region-survival execution did not run. Cleanup returned success. The article accurately restricts its native claim to declared policy and labels the other examples as documented models; the incomplete experiment is an evidence limit, not successful proof of those consequences. No fresh runtime or default database was targeted for this review.

## Actual rendering and controls

Chrome was used in fresh owned tabs because the inventory exposed no IAB. Actual article viewports were verified as 1280×720 and 390×844; phone document width remained 390. Inspected all five figures, representative code/captions and the stacked phone layouts in light and dark. Labels remain readable; changing summaries stay beside the player or immediately below the relevant cards. Sampled secondary figure text against panel backgrounds gives 6.05:1 in light and 6.15:1 in dark, above 4.5:1.

Figure 1 was stepped through North/West routes, keyboard-advanced to the endpoint with focus retained, played with the visible Pause state, and reset. Figure 5 was exercised for West-zone loss, West-region loss under both goals, North-region loss and East-region loss under region survival; changed roles/counts/explanations agreed. Native select focus was retained during keyboard interaction. Text alternatives are present. The representative state checks found no clipping, contradictory state or unusable control.

**Limits:** This was proportionate current rendering, not a repeated exhaustive mechanical matrix. Exact playback dwell intervals and assistive-technology announcements were not instrumented. Native row-homing, integrity rejection, actual range placement, outages and request latency remain unobserved as described above; no real regional resilience follows from the shared-host fixture.

**Cleanup:** Both preview origins restored to System. Route player reset/stopped, selectors restored to North / Zone failure / None. Article verified at 1280×720, temporary viewport override cleared, both owned tabs closed and theme lease released to root. No build, commit or publication performed.
