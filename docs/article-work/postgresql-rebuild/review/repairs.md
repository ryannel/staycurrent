# Review repairs and decisions

The progressive first-reading log is preserved separately. This file records what
changed in response; it does not replace those observations with retrospective
approval.

| Finding | Repair | Recheck |
| --- | --- | --- |
| Architecture's first concurrency schedule uses a reservation command not yet shown | Moved an explicit guarded UPDATE before that schedule | Accepted in the final continuous editorial reread |
| Query prediction does not identify tenant 0/1 before use | Opening now names tenant 0 as the 45,000-row tenant and tenant 1 as a 50-row tenant | Accepted in the final continuous editorial reread |
| Top-five priority answer depends on optional setup | Visible prose now gives `(job_id * 37) % 101` before the query | Accepted in the final continuous editorial reread |
| GIN candidate diagram's key/reference spacing is tight | Wider key column and explicit gap | Revised 390px figure inspected; key/reference spacing is clear |
| Two old GIN documentation URLs return 404 | Replaced with PostgreSQL 18's merged GIN page | HTTP source-link check passes |
| Logical-failover section silently returns to A-primary/B-standby after B was promoted | Added an explicit separate scenario and return to the original topology | Accepted in the final continuous editorial reread |
| WAL-stream label overlaps standby box on desktop | Renamed generic `.transfer` to `.pg-scale-transfer`; shared explorables CSS had imposed a 200px width inside a 6rem track | All four variants recaptured; coordinator inspected desktop light and phone dark, with the WAL label clear |
| Booking's bounded-range check admits explicit timestamp infinities | Added `isfinite` guards and tested empty, unbounded and explicit-infinite values | Author PGlite edge-case assertions pass |
| Citus documentation has inconsistent commit-protocol default wording | Checked tagged 14.2 executor/transaction code and described the verified multi-worker modification path | Independent capabilities/scaling review verified the tagged source and accepted the stated boundary |

The coordinator also checked each article at a depth checkpoint. JSON's constraint
section gained a concrete repair before successful validation; vector search gained
a fuller account of HNSW's layers and bounded candidate search. These changes retain
the original examples rather than appending unrelated feature lists.

Independent core review found no blocking technical issue. It requested an explicit
inspection point in the two-connection schedule: the row-version chapter now tells
readers to pause after step 5 for the retained heap state and inspect again after
step 6, with reset instructions for repeating the disposable trial.

The independent capabilities/scaling reviewer found a vector-figure label crossing
the x-axis. The query label moved below the axis; the x=1 label moved farther down,
and point 3's label moved clear of the diagonal guide. A research-note claim about
two qualifying North rooms was corrected to the actual 12-seat qualifying room;
the article and fixture had the correct 12/6-seat data throughout.

The capabilities/scaling reviewer rechecked the repaired vector figure at both
widths in both themes and accepted it without further findings. The coordinator
also inspected the phone light version and retained the repaired light/dark phone
captures under `visual/`. The evidence-note correction is independently accepted.
The core review's inspection-point repair was checked against the six-step
schedule: step 5 vacuums while A holds its snapshot; step 6 commits A and vacuums
again. The added instruction selects exactly those two recorded states.

A transaction-ID ring and layered HNSW sketch were suggested as possible reductions
in mental work. Neither reader reported a failed inference at those passages.
The chapter text supplies circular ordering and layered traversal, and the vector
figure already carries the filtered-neighbour result. Those optional additions are
not required to resolve the observed learning gaps in this commission.

The final eleven-page editorial reread is complete and accepted in
`final-reading.md`. It found no new consequential issue. The coordinator adopted
its optional wording change from “cold tenant” to “small tenant” in the query
chapter, avoiding an unnecessary implication about cache state. No SQL, result,
condition or layout changed in that edit. All required repairs are resolved.
