# SQL-change and lock-label repairs

For a17-P1, the conflict-policy paragraph now separates ignored proposals from inserted rows. It records the three independently observed receipt cases: an invalid reference on ignored bank-1 returns no row and leaves order 101; a new reference to missing order 999 fails with 23503; a negative amount on conflicting bank-1 fails with 23514. The evidence and source ledger are retained. No query, figure or native harness changed.

For T18-1, the empty reservation read now says that A runs its locking read and no rows were locked. B also reports no rows locked in that branch. The stable class-row branch still acquires and waits for its lock. All 45 states were compared; only the three misleading labels changed. Direct assertions, the full model verifier and the build passed. No SQL, results, player controls or CSS changed. Retain the unchanged b17 passes.

Both perspectives still owe a17/a18 narrow rechecks. Both owe a19 full initial review.
