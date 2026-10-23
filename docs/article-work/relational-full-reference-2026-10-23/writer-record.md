# Writer record · complete fresh relational introduction

## Assignment and times

Started 23 October 2026 at 16:45:58 UTC. The complete first article source was present before the first native attempt at 16:55:07 UTC; no separate exact completion timestamp was captured. Native verification completed at 16:55:29.933 UTC. Preview requested after the complete first source, with the continuity pass and evidence record still in progress. Final handoff time and rendered checks will be appended after inspection.

Owned outputs: `src/articles/relational-full-reference/introduction.astro`, `src/components/relational-full-reference/` and this record/evidence. No site build/server, route/shared-file edits, commits, pushes, publication, reviewers or subagents were performed by the writer.

Inputs were limited to writer-input.md, reader-outcomes.json, example-facts.md, child-reading.json, current skills and linked figure guidance, AGENTS.md, README.md, docs/site-direction.md, the three fixed references, shared implementation infrastructure and primary technical sources. No older introduction, sample, experiment, feedback or other-agent history/status was opened. The canonical shop facts were supplied as the brief's extract; the larger record was not opened.

## Reference use

Used staycurrent-write, staycurrent-figures and staycurrent-continuity. Read the three fixed reference sources and studied rendered figures in a dedicated Chrome tab on port 4350. Initial navigation failed with connection refused; the coordinator restored the unchanged reference preview, after which it loaded successfully. Sequence diagrams supplied the pattern of introducing a concrete interaction, directing attention to one visible difference, and interpreting the result afterwards. Its waiting figure was inspected through a changed step. Indexes supplied the separation between the visible teaching model and native evidence, page-work reasoning and query-specific onward links; its scan and controls were inspected in the page. Storage and durability supplied the memory/log/page-file distinction and the explicit boundary between the durable record and the application's knowledge; its WAL figure was inspected in place. The article is newly written, with no required wording, order or visual imposed by the brief.

The source uses the existing Sql component, the shared stepper and site colour/control tokens. Figure 1 makes key relationships visible with small actual tables and labelled references. Figure 2 lets the reader compare ordered purchase events and resulting state under two protocols. Figure 3 draws the commit ordering in a static trace rather than adding a second player to a chronology that needs no alternative setting.

## Technical sources

All accessed on 23 October 2026 through the web tool. Sources appear in the article's Sources and further reading section. The main checks were:

- PostgreSQL 18 Concepts and Constraints: table/row/column meaning, keys and declared integrity.
- Tutorial Joins, Table Expressions and Comparison Functions: row multiplicity, grouping, absent rows and NULL.
- Tutorial Transactions, Transaction Isolation and UPDATE: all-or-nothing changes, Read Committed reads, update lock waiting, condition recheck and RETURNING.
- Using EXPLAIN, Introduction to Indexes, Database Page Layout and Resource Consumption: chosen work, measurement, index trade-offs, pages, buffers and spills.
- WAL introduction, WAL settings, MVCC introduction and protocol Message Flow: recoverable commits, configured durability and client uncertainty.
- Log-Shipping Standby Servers, Failover and Continuous Archiving: receipt/storage/replay distinction, asynchronous loss, old-writer authority and earlier-state recovery.
- SQLite Serverless, Appropriate Uses and Isolation: embedded arrangement and one writer at a time per file.
- CockroachDB Replication Layer and Transaction Layer: coordinated copies and cross-partition atomic decisions.
- DuckDB Why DuckDB: embedded analytical work and columnar vectorised execution.
- Amazon Builders' Library Making retries safe with idempotent APIs and AWS transactional-outbox guidance: stable identities, parameter mismatch and external-effect repetition.
- AWS Well-Architected recovery objectives: RPO/RTO definitions and workload ownership.

The first attempted DuckDB URL under /docs/stable/why_duckdb returned 404; the verified source is /why_duckdb. A guessed AWS backup-recovery RPO/RTO page was inaccessible; the source used is the Well-Architected recovery-objectives page. No inaccessible page is treated as verified.

## Native evidence

`node src/components/relational-full-reference/verify.mjs docs/article-work/relational-full-reference-2026-10-23/native-check.json`

The first sandboxed initdb attempt failed because shared memory creation was prohibited. Its temporary directory was removed by the script's finally block. The authorised owned disposable run then passed outside the sandbox, using PostgreSQL 18.6 (Homebrew), port 56823 and a unique temporary socket/data directory. It disabled inherited PG connection settings, connected explicitly to the owned socket, and asserted the returned data directory and port before creating tables. fsync and synchronous_commit were on; isolation was Read Committed. The server accepted no TCP connections.

The verifier imports the exact displayed history query and conditional-update statement and the same table facts as the article/figure. It checked all four returned history rows; the four-pair result from joining order 101's two lines to its two payments; the unsafe protocol's stock 0 with both orders 103 and 104; the protected protocol's observed lock wait, empty result for Tariq, stock P3=10/P7=0/P9=4 and only order 103; and rollback of an already-taken mug when tea cannot be reserved. It uses deterministic command boundaries and observes the wait before releasing Mina's transaction. The instance was stopped and all owned temporary files removed, independently checked after completion.

This verifies the named query/protocol outcomes, not performance, network loss, crash recovery, storage honesty, replicas, regional failure or system capacity. Those portions are conceptual explanations checked against documentation. The UI histories are illustrations rather than captured engine traces. No executable download is promised to the reader.

## Continuity pass

Reread the entire body from the newcomer's starting point, including table captions, figure controls and text histories. The opening states the shop and what a database contributes before introducing terms. Table meaning precedes keys, SQL precedes the changing row grain, atomicity precedes isolation, and the local commit precedes lost replies and multiple servers. Each deeper concept receives a local explanation before its onward link.

Facts retained: Mina is customer 1 and owns 101/103; Tariq is customer 2 and owns 102/104; Edda is customer 3 with no orders. Order lines use the `order_items` table name and `(order_id, line_no)` identity. Products retain P3 green tea at 4.50, P7 blue mug at 20.00 and P9 teapot at 35.00. Order 103's two lines total 29.00. Offered and agreed prices are explicitly different facts. No new price is asserted as a starting fact; 22.00 is a stated hypothetical later change. Figure 1 explicitly labels its stock as before order 103; later sections reset to that starting point for the race, and the protected final stock matches the shared facts. Order 104 does not commit in the protected history. Unsafe behaviour is named as a counterexample.

The existing finished children are linked and summarised using only child-reading.json metadata. A continuity check corrected the modelling link label to the metadata title, Relations, keys and normalisation. Their examples are not rewritten, and their metadata titles are used. The new seven proposed child scopes are not represented as finished destinations. No example extension was needed.

## Rendered completion and handoff

Author checks completed and browser restored by 2026-10-23T17:08:53.976712+00:00. Current source is the r04 preview at port 4360. Mechanical evidence and limits are kept separately in rendered-mechanical-receipt.md; teaching choices are in author-teaching-notes.md. The author check found and repaired focus/scroll ownership for tables and SQL and strengthened one light-theme text accent. These were local presentation repairs only. Figure facts, queries, protocol conditions and the native verifier's relevant inputs remain unchanged.

Continuity was checked again around those repairs: captions, result rows, event ordering, commit boundary and onward links still agree with the explanation. No unresolved fact extension or source dependency remains. The writer returns the complete draft for the coordinator's independent review, with no publication or delivery action taken.
