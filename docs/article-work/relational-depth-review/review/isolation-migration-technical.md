# Isolation and live-migration technical review

Independent review by the operations/choices contributor, 15 October 2026.
I did not author these repairs and did not read the uncued reader's log.

## Isolation repair

Read the assembled article source, downloadable `session-worksheet.sql`,
native verifier, `observed.json` and the author's evidence record. Checked the
new schedule against the surrounding explanations of snapshots, own writes,
changed-row failures and write skew, rather than reviewing added paragraphs
in isolation. PostgreSQL's transaction-isolation and explicit-locking rules
support the explanations. I did not rerun the author's mutating verifier or
overwrite its original observation record.

**Result: no blocking technical or explanatory finding.** The repair supplies
the previously missing practical ending without moving engine internals into
the family article.

Specific checks:

- The price schedule establishes the first read before B commits. The observed
  20/22 and 20/20 outputs have the expected statement/transaction-view meanings,
  and the fresh 22 read prevents an inference that B failed to write.
- The Repeatable Read display schedule keeps A uncommitted while B performs
  its own conditional write. Their target rows differ. BEGIN alone is correctly
  distinguished from the statement that establishes each snapshot.
- The Serializable record has provisional RETURNING rows followed by B's
  40001 at COMMIT. The article calls that the observed branch, not a guaranteed
  victim or error location. The alternate statement-error path stops work and
  rolls back the failed attempt.
- The retry retains A's committed change instead of resetting the fixture.
  It repeats B's condition, obtains zero rows, and commits that successful
  evaluation. This preserves the difference between rejection and a rule
  that no longer permits the requested change.
- The control-row experiment waits on an unchanged shared row, then starts a
  separate Read Committed flag statement. The observer actually detects a
  lock wait. The Repeatable Read counterexample is valid precisely because
  the control row was locked without being updated; it does not falsely
  promise a changed-row serialization error.
- The downloadable worksheet specifies connection ownership and every pause.
  It warns against top-to-bottom execution on one connection. Resets finish
  both participants before updating flags, and the abandonment path releases
  both transactions. The native verifier uses its own schema and closes all
  clients, with assertions covering final flags and retry results.

Writing judgement: the original conceptual path remains clear with disclosures
closed. The added main-path result paragraphs explain what the practical trial
proved; optional detail carries command scheduling. “A rejection during COMMIT
may already have ended B's transaction” resolves a real cleanup ambiguity
without obscuring the successful retry. The control-row counterexample adds
useful depth because it changes one condition and derives a different result.
There is no need for another diagram here: existing snapshot, write-skew and
control-row media already carry the relationships, while the ordered table
supplies the operator sequence.

Rendered inspection and download-link verification remain with the assembled
preview checks. No new diagram was introduced by this repair.

## Migration repair

Read the revised `schema-changes.astro` in context with its unchanged
compatibility, validation and cutover sections, plus the native verifier,
observation record and worksheet. No change to the trigger/backfill mechanism
is needed. Two small reproduction repairs were sent to root:

1. The article says B sends the bounded DDL block printed above, which includes
   COMMIT. To demonstrate the subsequent 25P02 state, tell the operator to send
   through ALTER and pause before COMMIT. A client that continues executing
   after a statement error could send that COMMIT and end the failed
   transaction; the next SELECT would then no longer demonstrate 25P02. The
   worksheet already leaves COMMIT out of that failing block.
2. Make A's old-writer BEGIN explicitly READ COMMITTED in the worksheet and
   native trial, as B's already is. The main text names this requirement, but
   a reader with a different configured default could otherwise observe the
   changed-row rejection discussed in the isolation article instead of the
   promised successful later write. Record or set the native level as well.

Other findings:

- The old cached-value counterexample produces an actual disagreement after
  a correct old-writer trigger update. It isolates why the new-column writer
  must not restore stale application data.
- In the writer-first schedule, B selects the original missing IDs 1 and 2,
  waits for A, then its outer null condition rejects the now-filled row 1.
  Its remaining result is exactly 2/Ring bell, and the next batch copies 3.
  The warning against interpreting a short batch as completion follows from
  those concrete records.
- The reversed schedule establishes a genuine row wait, then shows A's
  trigger synchronising Reception after B's copy commits. It is not inferred
  merely from two sequential updates.
- The native lock evidence distinguishes B's ungranted AccessExclusiveLock
  from C's later ordinary read. The observed blocker IDs support the exact
  chain A → B → C. The two-second timeout releases C before A's transaction
  ends; absence/presence of the added column is checked around the retry.
- Reset instructions finish both participating sessions before recreating the
  fixture. The worksheet's ten-second manual timeout is clearly separated
  from the two-second automated run and from a production recommendation.
- The existing browser lesson remains a sequential compatibility exercise.
  The repair does not pretend its single connection observes the server races.

Writing judgement: the additions replace the original compressed recheck
paragraph with a mistake, its exact consequence, and two corrected schedules.
That is substantive depth rather than an appended migration checklist. The
DDL discussion follows a fresh read affected by the queue, making the timeout's
purpose clear. The A/B schedule table is enough media for these records.

Recheck: both reproduction clarifications are now present. The article tells B
to pause before COMMIT; A's worksheet and both native backfill schedules name
READ COMMITTED explicitly. These resolve the findings. Root reports the native
schedule passed again after the explicit-level change. Technical source review
is accepted. The continuous rendered reread is recorded separately in
`assembled-editorial.md`; browser layout checks remain with root.
