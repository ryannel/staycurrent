# r01 writer record

## Assignment and limits

Work is isolated to `/private/tmp/staycurrent-relational-20261024-r01`. Read the supplied assignment, brief, example facts, links, prerequisite introduction and current write/figures/continuity skills. No original repository, history, prior article versions or other drafts inspected. No delegation, build, server, commit or publication.

## Reference delivery

Completed 19 separate `python3 scripts/read-writing-reference.py <name> <part>` calls, each with a 6,000-token result allowance. Every END marker was present; none required clipping recovery.

- sequences parts 1–6; complete text SHA256 `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`
- indexes parts 1–7; SHA256 `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`
- storage parts 1–6; SHA256 `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`

Rendered study used own temporary in-app tabs directly at port 4350. No inventory of user tabs; no viewport or theme changes. The existing viewport was 1280 × 720 and System theme resolved dark. All three temporary tabs were explicitly closed after study.

Studied each finished drawing with its introducing and interpreting passage:

- Sequence diagrams figures 1–13: message chain; waiting bars (including 3 s); email call with/without waiting; complete outbox; dense drawing and separate booking/email views; early worker order; alt/opt; polling loop; parallel requests; TLS handshake; central booking; repeated customer calls; trust boundaries.
- Indexes figures 1–11: scan rows/counters; sorted entries and TIDs; tree path; range links and stopping key; clustered secondary lookup; selectivity and page visits; composite order; covering/visibility (including INCLUDE and vacuumed state); write cost; sequential/random splits; delete/vacuum/rebuild.
- Storage figures 1–10: filling pages; buffer slots and eviction; PostgreSQL and InnoDB old-version states; hypothetical no-log loss; WAL before reply; dirty eviction; shared flush groups; crash after flush; durable flush path; asynchronous commit loss.

The first sampled completion clock was 2026-10-23 23:12:42 UTC. A start clock was not sampled, so no precise reference-study duration is claimed. Readiness sent to root after this sample; design/source remains gated on root acknowledgement and final-plan readiness.

## Observations from references

Definitions immediately earn their place in a concrete example. The prose gives a reason to inspect a particular part of a drawing, then develops what that observation means. Preserved rows and positions make comparisons readable. The drawings expose the mechanism, while counters and explanations describe current state. Captions disclose simplifications and the boundary between models and measurements.

## Prerequisite and source research during hold

Read complete supplied r00 source. Inspected its customer/orders and order-line/product receipt figures at port 4368 without viewport/theme changes; closed the temporary introduction tab. Its reader already knows row meaning, primary/foreign/composite keys, the line's agreed price, joins, aggregation, transaction and last-mug examples. The r01 article can build on these without repeating the introduction.

Primary checks are recorded in `evidence/source-check.md`. Root acknowledged all text chunks/rendered delivery and the unchanged frozen r01 boundary, but explicitly retained the final-plan hold. No design or source was created during that hold.

23:16:04 UTC clock sampled while still holding for final-plan clearance. Source checking and supplied-prerequisite reading are complete; no article or figure design/source has begun.

## Design and writing

Root released r01 after its unchanged node, facts and entrance were cleared; the remaining plan check concerned an unrelated entrance. First design clock sampled at 23:21:17 UTC. The first complete draft source preceded the 23:26:55 UTC clock sample; the preview request followed that sample. This is approximately six minutes between the first design sample and the completed first-draft sample, not a claim about all task time.

The article builds on the introduction rather than re-teaching its complete receipt/transaction material. Figure 1 makes determinants explicit; Figure 2 exposes the edit, insertion and deletion consequences of the same copied names; Figure 3 preserves the distinction between catalogue and agreed price. The comparison has presets rather than temporal steps, so no stepper is applicable. Presentation is new CSS using supplied theme tokens; there is no reused model or mechanical claim from an earlier article.

Author reread checked the explanation, captions, current controls and prerequisite progression. Moved the precise overlapping-key/BCNF discussion into a named disclosure so the common shop argument can continue without an unearned formal detour. The dependency is plain notation rather than syntax-highlighted SQL. No external review was arranged.

## Continuity pass

- All recurring rows in figures are imported from `src/lib/relational-collection/core.json`; selected columns are explicit. No stock or payment facts are needed here.
- Mina's name is repeated on four line-shaped sheet rows, Tariq's on one; Edda has no sheet row but keeps her customer row.
- A possible name change has no invented authoritative new name. Deletion is explicitly hypothetical and does not amend the core. The worksheet's deliberately inconsistent name is labelled as such and rolled back to its savepoint.
- The core line identity remains `(order_id, line_no)`. The surrogate definition is an explicit variant; it retains that business identity with UNIQUE.
- The price comparison enters accepted extension E3 before using 25.00 on 21 October at 09:00 UTC. Order 103 retains unit price 20.00 and total 29.00. No later correction history is needed for this explanation.
- Customer/current-name, order, line and product facts are kept distinct. A missing order is not a reason to lose a customer. Historical invoice fields are general possibilities, not new shop data.
- No shared-fact or tree amendment is proposed. Neighbours own value semantics, constraint enforcement and lifecycle policy.

## Native verification

First local run at 2026-10-24 01:26:09 CEST was blocked by the sandbox's `shmget` restriction during initdb. The owned directory was cleaned on failure. Root inspected and ran the exact runner with local database permissions; exit 0. Actual records inspected at 23:26:55 UTC.

PostgreSQL 18.6 Homebrew, Apple silicon, native aarch64 darwin25.6.0. Runner clears inherited environment with `env -i`, creates a marked disposable directory, disables TCP, uses an owned Unix socket, and checks `SHOW data_directory` before data changes. `evidence/native-environment.txt` records the checked owned directory. The exact downloadable worksheet is the executed file; stdout/stderr is in `evidence/modelling-result.txt` and startup log in `evidence/server-log.txt`.

Observed: five reconstructed rows with symmetric EXCEPT ALL empty; four name edit locations; two conflicting copied current names after one deliberately inconsistent edit; Edda sheet 0/customers 1; Tariq sheet 0/customers 1 after flat-sheet deletion; two business duplicates accepted with surrogate-only identity versus one stored after UNIQUE rejected the second; catalogue25.00/agreed20.00; order103 total 29.00. All assertions passed and final ROLLBACK completed. Root's runner trapped shutdown/removal; direct path absence checked afterwards. No existing instance, production credentials, performance numbers or timing claims are involved.

## Final native and download evidence

The first reconstruction check generated the flat sheet with the same join being tested. Ordinary author finishing replaced it with an independent explicit five-row flat fixture, then root inspected and reran the exact runner. The final native record was inspected at 23:33:18 UTC; all assertions and counterexamples passed again. The final owned directory `/private/tmp/staycurrent-r01-pg.RmBOGH` is absent after cleanup.

Root's final HTTP receipt is `evidence/download-check.json`: status 200, text/plain attachment. Response bytes match the exact executed worksheet, SHA256 `534f12aa6f5fa158e8bdb52324f2d64c468ce67d578c8703532b4e594e08e916`. Draft endpoint needs its trailing slash; the article uses it. The worksheet remains in the gated article namespace, outside public/.

## Coordinated rendered checks

Root supplied the integrated page at `http://127.0.0.1:4368/review/relational-collection/modelling/` and granted the QA lease. Initial settings: 1280×720, System selected, resolved dark. All three figures were visually inspected in the finished article at 1280×720 and 375×812, light and dark. Final matrix screenshots are in `evidence/screenshots/`; DOM-derived dimensions and theme tokens are in `evidence/browser-metrics.json`.

A rendered defect was found and fixed: shared `.visual-essay section` margins added 64 px above and below each nested figure panel. The final namespace-specific selectors override that margin (computed 0 after integration). The narrow comparison also revealed that explanations should name the sales sheet/customers rather than use left/right; both explanations were updated and checked on the refreshed final page.

Every comparison option was exercised: four name-cell edit locations versus one; Edda independently present; and both order 102 representations crossed out while Tariq's customer row remained. Pointer clicks and sequential keyboard Tab, Space and Enter were checked. Selection uses aria-pressed, with only one selected option; the explanation is aria-live polite. The all-comparisons text alternative and optional BCNF disclosure were opened by keyboard and inspected. Focus remained visible. All changing explanation text and data states agree with the captions and surrounding prose.

No page or figure horizontal overflow at either width in either theme. Narrow panels stack; the dependency arrows turn downwards and all labels remain readable. Plain DOM text and the comparison's text alternative expose the meaning without colour alone. No animation is present, so reduced-motion timing is not applicable. All six principal token foreground/background pairs in each theme exceed 4.5:1 (including the accent used for meaningful outlines/arrows); ratios are in `evidence/contrast.json`. The selected light button's actual computed colours were also recorded in browser metrics and match those tokens. Decorative internal rules carry no unique meaning.

This was visual/keyboard inspection and token-based contrast calculation, not an assistive-technology user study or an automated full-page accessibility verdict. Root owns builds and site checks; this writer did not run them. Native observations apply to the small owned experiment, not performance or arbitrary future schemas.

Restored System theme (resolved dark), reset the viewport override to 1280×720 and closed the temporary QA tab. Lease explicitly released to root before final record preparation. No further article/figure/source change is pending. Final source hashes are in `evidence/final-source-hashes.txt`.

Final record completed at 2026-10-23 23:34:10 UTC (24 October locally).
