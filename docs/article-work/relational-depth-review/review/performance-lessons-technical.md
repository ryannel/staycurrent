# Index-order and join-work lesson review

Independent review, 15 October 2026. Read both complete lesson contracts,
generation queries, native/PGlite verifier, evidence and the recorded plans.
No independent fresh-reader notes were consulted. I did not author these
lessons or rerun the mutating author verifier.

**Result: accepted; no blocking finding.**

For `index-order`, the fixture derives the documented counts and identities:
customer 42 has 60 rows, 15 after the February boundary, with newest IDs 59041
through 50041. The paid variation removes pending IDs 55041 and 50041 and
needs candidates 49041 and 48041 to return ten rows. The verifier compares the
complete result rows across index replacements, so this is not an assertion
that fewer plan nodes automatically mean a correct result. The final pending
variation correctly reports three matches and preserves the observed bitmap
plus sort, rather than promising that an order-capable index must be selected.

For `join-work`, each customer's ten orders produce thirty line rows and
product quantities 30/20/10. The narrow plan's three inner rows across ten
loops accounts for that work. The broad hash plan's build side is the orders
input, and the observed 30,000 joined lines account for the larger totals.
The merge experiment changes only local planner options and retains the broad
SQL/result. The intermediate request distinguishes three thousand joined
matches from the thirty thousand line rows still scanned. Those differences
are visible in both engine records.

Caller and cleanup contracts are adequate for a one-connection sandbox. The
setups replace only dedicated fixture tables. Ordering and result-field
expectations are explicit. The merge step names its BEGIN/SET LOCAL/ROLLBACK
boundary and tells an editor to roll back if a changed statement fails before
cleanup. No toy latency result is described as a production speedup, and plan
variation is distinguished from result correctness.

Writing judgement: the sequence teaches why a changed access path helps the
same request before changing the request itself. Predictions concern real
records and counts. The pending-plan exception gives readers a reason to
inspect their output instead of memorising a join/index label. The lessons
do not duplicate the PostgreSQL prepared-plan and spill exercises.

A small optional setup improvement was suggested to the author: add explicit
target-column lists to INSERT … SELECT so the generated fields can be mapped
without relying on the earlier CREATE TABLE order. This is readability work,
not a correction to the actual generated data. The author applied it to all
three fixture inserts and reports that both native and PGlite verification
passed again for all eleven steps and the additional variation.

Root's integrated browser execution remains a separate check of lesson
discovery, SQL transport and result presentation.
