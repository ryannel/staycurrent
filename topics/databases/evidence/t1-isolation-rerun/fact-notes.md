# Fact-notes: isolation anomalies and the serialization failure (t1-isolation-rerun)

Environment: PostgreSQL 16.14 (`postgres:16-alpine`, image
`sha256:e013e867e712fec275706a6c51c966f0bb0c93cfa8f51000f85a15f9865a28cb`),
container `r4-t1`, `default_transaction_isolation` = `read committed`, Docker
29.4.3, arm64 Mac. All values below are copied exactly as printed in the raw logs.

**Scope note, stated first because it governs how this lab should be used.**
Round 3 established that transaction isolation is the one topic where a small lab
*lost* to published sources: the Postgres documentation and Kleppmann's Hermitage
already contain everything these experiments can show. This lab is therefore not
here to produce news. It is here because the article teaches a reader to
recognise a specific error and never shows it. The value on offer is the
artifact, not the finding.

---

1. **A lost update at Read Committed, with the amounts chosen so the wrong answer
   convicts itself.** An account starts at 100. Two concurrent sessions read it,
   compute a new balance client-side, and write: A withdraws 40, B withdraws 30.
   Whatever order they run in, the correct final balance is 30.
   Raw: `raw/02-lost-update-rc-asymmetric/`.

   ```
    id | balance |   last_writer
   ----+---------+-----------------
     1 |      70 | B (withdrew 30)
   ```

   The balance is 70, and `last_writer` names B. A's withdrawal of 40 did not
   happen — 70 is exactly 100 − 30, the result of B's stale read winning.

   **Why the amounts differ:** the round-3 version of this experiment used a
   1000 balance with two identical 100 withdrawals, giving 900 — a number that
   reads exactly like one correct withdrawal, so the anomaly is invisible in the
   result. That driver is preserved unchanged at
   `raw/01-lost-update-rc/` (it produced `balance = 900`), and this asymmetric
   version was written to replace it.

   **The row lock did not prevent it, and the timings prove the lock worked.**
   Session B's UPDATE blocked on session A's row lock and took
   `Time: 2557.109 ms (00:02.557)`, against `0.887 ms` for A's unblocked UPDATE
   and `1.353 ms` for B's own earlier SELECT. A's write landed first
   (`balance = 60`) and B then overwrote it with `70`. So B waited two and a
   half seconds for the lock, acquired it, and wrote a value computed from a
   read taken before A ever wrote. Raw: `raw/02-lost-update-rc-asymmetric/sessionA.log`
   and `sessionB.log`.

   Interpretation, not measured: row locking serialised the *writes* here and
   still lost the update, because the stale value was captured at read time.
   That is the mechanism behind the article's advice to close the gap between
   the read and the write rather than to lock harder.

2. **Write skew survives Repeatable Read and is caught at Serializable — both
   halves measured.** Two sessions each check that at least two doctors are on
   call, then each takes a *different* doctor off call. Because the two UPDATEs
   touch different rows there is no write-write conflict to detect.

   - At `REPEATABLE READ` both transactions commit and the invariant dies:
     `doctors_on_call_now = 0`, with `alice | f` and `bob | f`.
     Raw: `raw/05-write-skew-rr/`.
   - At `SERIALIZABLE` the second COMMIT is aborted and the invariant survives:
     `still_on_duty = 1`, with `alice | f` and `bob | t`.
     Raw: `raw/04-write-skew-serializable/`, `raw/03-sqlstate-verbose/`.

   Provenance note: the Repeatable Read run was added after the first draft of
   this file asserted the result without a round-4 raw file behind it. The
   omission was caught in draft review; the experiment was then run rather than
   the claim softened.

3. **The SQLSTATE the article names, on the page.** psql prints the message but
   not the code by default; with `\set VERBOSITY verbose` on the session that
   loses, the code is the first thing on the line.
   Raw: `raw/03-sqlstate-verbose/sessionB.log`.

   Verbatim (show-the-artifact excerpt):

   ```
   === STEP B4 (fed 09:44:37.502) ===
   COMMIT;
   Time: 0.663 ms
   ERROR:  40001: could not serialize access due to read/write dependencies among transactions
   DETAIL:  Reason code: Canceled on identification as a pivot, during commit attempt.
   HINT:  The transaction might succeed if retried.
   LOCATION:  PreCommit_CheckForSerializationFailure, predicate.c:4662
   ```

   And the state it protected:

   ```
    id | name  | on_duty
   ----+-------+---------
     1 | alice | f
     2 | bob   | t

    still_on_duty
   ---------------
                1
   ```

   Note: `LOCATION:` appears because `VERBOSITY` is `verbose`; an application
   would see the code and message, not the source location. The `HINT` is
   Postgres's own text, and it is the retry loop the article recommends, stated
   by the engine.

4. **A serialization failure needs two concurrent transactions.** An attempt to
   provoke `40001` from a single psql session returned no error at all — SSI has
   nothing to detect without a conflicting transaction. Recorded because it is a
   plausible way to try to reproduce this and it does not work.
   Raw: `environment.txt`.

---

## What this lab does NOT establish

- Nothing here is news relative to the Postgres documentation, and it should not
  be presented as if it were. See the scope note above.
- No timings from this lab are usable: four other Postgres containers were on the
  same Docker VM. Nothing here depends on timing — the results are final row
  values and an error code.
- MySQL's, Oracle's, and any other engine's isolation behaviour was not tested.
  The article's claims about InnoDB's Repeatable Read and Oracle's SERIALIZABLE
  remain source-derived.
- `Reason code: Canceled on identification as a pivot` is the reason this
  particular interleaving produced; SSI reports other reason codes for other
  shapes, none of which were exercised.
