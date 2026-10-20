# Practitioner review — b29

## a37 — Maintaining and upgrading a relational service

**Verdict: REPAIR.** One required model acceptance-gate repair, a37-P1. All native procedures, complete prose, remaining model mechanisms and family scope pass. One optional narration refinement is separately recorded.

Read the complete article, context/family plans, source ledger, writer handoff, both retained native runs, complete executable rehearsal, pure models and renderer. Applied the original newcomer-to-expert relational-practice goal. Rechecked the actual a07 maintenance/responsibility/incident boundaries and previously reviewed a38/a39 procedures. The parent still gives a useful controlled-change decision; this article owns maintenance diagnosis and one complete bounded copy-upgrade case. Replica replacement, recovery-copy restoration, live data movement, physical layout, index design and full plan investigation remain with their owners. Managed-service duties are concrete but do not imply an RDS execution. The scope and useful depth are appropriate.

### Required repair

**a37-P1 — Keep the rejected space gate rejected when no work has started.** Location: `src/components/relational-next/a37/model.mjs:23` and `:28`; Figure 2, **14 GB available for the change**, final state.

The preceding state correctly establishes a required extra peak of 22 GB, available allowance of 14 GB, and an 8 GB shortfall with `NO-GO`. The final state correctly says “Provision room or revise the operation”, resets actual allocation to zero because no work started, and instructs the reader to wait. But its panel named **Acceptance gate** changes to **“Within space allowance”** because the shared gate compares actual allocation (now zero) with available space. I reproduced and visually inspected this final state in the immutable browser preview.

Not allocating anything does not make the unchanged proposed 22 GB operation fit. Keep the final tight-branch gate `NO-GO` against the required peak, while retaining the separate zero-allocated observation. A label such as “NO-GO: required peak 22 GB exceeds 14 GB” would express the decision. Preserve the invented sizes, correct sufficient-space branch and independent native evidence.

Acceptance implication: a narrow model/source/rendered recheck can retain every native result below; no full database rerun is needed for this gate-only correction.

### Optional advice

**a37-O1 — Make the released-report sentence branch-specific.** At `model.mjs:16`, the released branch's report panel correctly says “Report has ended”, but the shared result still says “the old report could still see pending”. Prefer “New requests see paid; the earlier report has ended” in this branch. The later removal state already teaches the correct mechanism; this is a local narration improvement rather than an additional acceptance blocker.

### Independent native verification

Ran the inspected unmodified portable rehearsal against the pre-existing **binary directories only**, creating its own fresh maintenance18/old17/new18 clusters, private temporary directory and three unused loopback ports. Full reviewer evidence: `/private/tmp/rel3-prac-a37-native-1792468001.json`. It reports `passed: true`, `cleaned: true`, `remaining_servers: []`. All three stopped-server status checks returned no running server, and I separately verified its temporary root no longer exists. The shared 57319 service, other data directories and installed software were untouched. Retained author evidence was not overwritten.

Inspected actual commands, returned facts, failures and logs rather than accepting the summary alone. Meaningful checks all passed:

- A real repeatable-read read establishes the 4,000-row snapshot; the writer commits all paid statuses. Vacuum reports 4,000 dead versions not yet removable, and the current paid-row query returns 4,000. Releasing the snapshot permits the next vacuum to remove 4,000 while retaining 4,000 current tuples. Heap file length is 1,990,656 bytes before and after the nontruncating vacuum.
- Analyse reports catalogue estimate 4,000, dead estimate zero and completed vacuum/analyse timestamps. Every displayed monitoring query executes on 18.6. There is no claim that those estimates measure recoverable bytes or that this tiny analyse proves a faster workload.
- A held reader causes the separate `VACUUM FULL` command to fail at its 200 ms lock timeout, before rewriting. After releasing it, concurrent primary-key reindex completes with `indisvalid = true`. Submission uses separate psql commands, avoiding the exploratory transaction-block error retained in run1.
- Target 18.6 `pg_upgrade --copy --check` rejects the disposable regproc-column dependency. Old 17.6 restarts with count 2 and total 4,000. Removing only that throwaway object and repeating the check succeeds.
- The actual stopped-source/stopped-destination copy upgrade succeeds. New 18.6 preserves exact `101:2200,102:1800`, count 2, total 4,000. The deliberately wrong three-row validation returns false. Stopping new and restarting old returns the original 17.6 facts, demonstrating the pre-new-write return path.
- The emitted missing-statistics and full analyse commands both succeed. New subsequently accepts 103/500 and returns 3/4,500; old still returns 2/4,000. Independent old files are therefore distinguishable from up-to-date accepted history. No pool cutover or real customer write is claimed.

Own upgrade-command time was 1.887 seconds; logical old/final-new file lengths were 39,868,588 / 41,488,933 bytes. These reproduce the bounded scale and accounting of the retained runs, without treating time as an outage guarantee or file lengths as peak physical allocation. Checksums, C locale/UTF8, local fixture authentication, timeouts, memory limits and table-local autovacuum override are visible in the harness. Production extension upgrades, link/clone execution, crash interruption, replica transitions, hosted changes and new-state restore remain explicitly unexecuted acceptance prerequisites.

### Primary contracts and models

Verified the consequential contracts against PostgreSQL 18 [routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html), [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html), [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html), [concurrent REINDEX](https://www.postgresql.org/docs/18/sql-reindex.html), [progress reporting](https://www.postgresql.org/docs/18/progress-reporting.html), [replication slots](https://www.postgresql.org/docs/18/view-pg-replication-slots.html), [cluster upgrading](https://www.postgresql.org/docs/18/upgrading.html), [pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html), [release 18 notes](https://www.postgresql.org/docs/18/release-18.html) and [collation refresh](https://www.postgresql.org/docs/18/sql-altercollation.html). The important qualifications are correct: nontruncating reuse versus rewrite, phase-specific progress, invalid concurrent-index remnants, supported exact transfer mode, the link-mode new-start boundary, target-tool instructions, incomplete statistics transfer and rebuild before collation-version refresh. No unsupported binary downgrade is offered.

Also checked RDS [valid targets](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.MajorVersion.html), [major preparation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.MajorVersion.Process.html) and [engine-upgrade contract](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html). The article properly requires source/deployment-specific controls, replica and recovery checks instead of exporting the local copy drill's guarantees to a hosted transition.

Independently enumerated all four pure models/eight branches/36 complete frames, checked their causal states and then exercised all 36 rendered states in the immutable 4439 preview. Verified retained versus released snapshots, 14/22 GB forecast arithmetic, copy versus shared-link startup safety, and accepted-order 103 versus blind reversal. Initial selections and model states agree. Next/Back/End, same-step branch selection, Reset and Play/Pause work; dynamically generated panels are styled. Apart from a37-P1, panel facts, branch outcomes, prose and evidence boundaries agree. The allocation model remains explicitly invented; the figures do not execute commands.

Both article sources equal their frozen batch snapshots. All three a37 component hashes match the b29 manifest after review. No source edits, build, Git operation, browser download or other-role report reading occurred. Own browser tab closed; 4439 released.
