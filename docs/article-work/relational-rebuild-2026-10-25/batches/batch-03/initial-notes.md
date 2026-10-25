# First reader notes — batch 03

Recorded before consulting plans, example records, author notes or earlier verdicts. Fixed input: review-source.json; history, writes, application-sql first stable versions.

## Illustration-first observations

- History: figures 1–3 let me distinguish captured agreement from catalogue price, then effective time from the recorded account. Changing the recorded selector at effective 21 October midday visibly selects A4/22.00 instead of A1/20.00 without altering order 103. The two accounts and period boundary remain legible at 375 px. Figure 4 supplies alternative correction meanings; figure 5 makes local completion versus failed/pending copies concrete.
- Writes: the key-plus-price guard and replacement-versus-delta controls teach real differences, not cosmetic variants. B17's persistent source rows, committed catalogue and reconciliation equation make the interruption understandable without inventing an uncertain commit. Read and stepped the rejected-price guard, repeated stock addition and first-commit/stop states.
- Application SQL: the first diagram maps values and returned rows across the driver boundary. Loading shows the growing object result beside the number of requests; joined final state is grouped into two orders while caption explains that four joined rows repeat parent columns. Connection A/B makes independent borrowing's failure concrete. The lifecycle player separates connection state from what the caller knows; I stepped the missing-commit path through discard and retained keyboard focus on Next at its last state.

## Body reading

The three pieces have coherent concrete openings, established searchable terms in headings and connected explanations. History's half-open boundary, overlaps/gaps and two-query contrast provide the understanding needed to use its model. Writes explains EXCLUDED, duplicate source versus target identity, and why atomic bookkeeping differs from publishing an entire batch. Application SQL develops placeholders versus SQL structure, mappings, parent limiting, session ownership and cleanup in a usable progression.

No critical or medium reader problem identified in this first read. Possible optional visual enhancement: application SQL's joined load shows the assembled result, not the raw four rows with repeated parent columns; a reader supplies that intermediate arrangement from the caption and later SQL. The meaning is nevertheless explicitly supplied and builds on result-row prerequisites.

## Calibration and limits so far

Consulted bounded source passages and current rendered figures from Sequence diagrams (lifelines, waiting/outbox, chatty calls), Indexes (composite index comparison), Storage and durability (row versions). The batch uses the same concrete compare/change/conclude pattern, with more detailed import and cleanup mechanics appropriately developed in prose.

Current review used an owned hidden IAB tab. Desktop dark and representative phone light/dark layouts were visually inspected. This is not a foreground animation-timing observation. Existing mechanical control/theme/SQL contrast provenance is retained; no database experiments rerun. Plans and example records still withheld at this point.
