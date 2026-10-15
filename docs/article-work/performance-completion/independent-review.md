# Independent performance review

Read on 15 October 2026 as an application programmer familiar with basic SQL from the preceding articles. This reviewer did not author these pages or their lessons. The supplied artifact was assembled text extracted from the rendered pages, delivered one numbered chunk at a time from `/private/tmp/relational-completion-review/`. Observations were saved before reading the next chunk. The order was the main performance article, then its two supporting destinations. Optional disclosures were delivered separately after each article and were empty. This establishes text sequence, not live controls or visual rendering.

## First-reading log

- slow-queries 00: Title establishes performance as subject; no content yet, so no conclusion beyond scope.
- slow-queries 01: Opening explains the subject rather than merely promising diagnosis: work completed and caller waiting are distinct, with concrete pool/multiple-query/lock reasons. I can now explain why a slow request does not establish a slow query.
- slow-queries 02: Connects previous plan knowledge to request diagnosis. The questions orient investigation without introducing unexplained mechanisms. Curious how we measure the parts; naturally pending.
- slow-queries 03: Execution setting is explicit: invented timing traces, real SQL counts/plans, no network/concurrency proof in browser. Two examples named before they arrive.
- slow-queries 04: Heading sequence is plain and navigable; it moves outward request to database to data change to testing, no forced metaphor.
- slow-queries 05: Strong worked trace; totals and non-overlap are explicit and the 12→2 saving is derivable. Pool definition arrives before wait analysis. N+1 is explained without requiring the name. I supplied no hidden prerequisite. Useful curiosity: how to collect spans is not yet shown; bounded diagnosis can reasonably assume instrumentation.
- slow-queries 06: Setting/actor/permissions and one snapshot’s limitations are clear. query_age for inactive session is explained correctly where it matters. The external payment example motivates lock waits and avoids suggesting an unsafe early commit. A new reader can identify blocker and owner before acting.
- slow-queries 07: The state counts make the bad estimate/correct answer distinction derivable. I know why ANALYZE can change estimation without reducing required work. Question: what prevents autoanalyze between steps from refreshing statistics? It may be an intentionally controlled sandbox condition; need inspect lesson later. Does not obstruct prose. Parent/child measurement warning says 'can' appropriately.
- slow-queries 08: Maintenance distinction is explained concretely and the 'not instantly compact' line prevents a plausible bad inference. Plain headings/body read naturally; no ornamental claims. 'Row versions and vacuum' is onward reading rather than missing prerequisite.
- slow-queries 09: Testing section finishes diagnosis with comparable workload, offered load, tails and counter differences. Definition of p95 correctly limited to measured completions and timeouts called separately. Opening 'what must stay correct' supports earlier batching cardinality promise without teaching child detail prematurely. No blocking learning gap found.
- slow-queries 10/optional: Annotated next steps fit bounded main article. Optional file empty. First-reading verdict: coherent and actionable; pending factual check of sandbox stale statistics and actual environment. This was extracted assembled text, not an interaction observation.
- request-cost 00: Supporting article follows the main performance page in actual onward reading. I carry pool/query-span/command-count knowledge from that page.
- request-cost 01: Opening immediately introduces the subject as sequence from UI request to assembled response. It recaps the main page’s causal distinction briefly, sufficient for direct entry. Curious which bigger query is safe; appropriately pending.
- request-cost 02: ORM introduced before reference; alternatives avoid claiming all ORMs lazy-load. 'Generated SQL tells' gives concrete evidence.
- request-cost 03: Promise is appropriately bounded and differs from main article: derive actual related-record rows.
- request-cost 04: Plain heading sequence follows expected progression from repeated calls to batch to join alternative to lifecycle and verification.
- request-cost 05: Inputs arrive before calculation; €25 derivable. Authorized bounded parents and empty-order requirement are explicit. N+1 shows caller awaiting responses rather than unexplained snippets. Excellent preservation target.
- request-cost 06: Directly completes batching with map-back algorithm and parent-order retention; no need to invent missing application code. Meaning of ANY provided after its first query, one sentence away; acceptable because predicted rows can be derived from listed IDs. Bounded parent not bounded children insight useful and naturally follows.
- request-cost 07: Table removes mental cross-product work; six overall rows and two different amount sums have sufficient inputs. Strong 'all children' versus 'only amounts' branching. Question: last paragraph says paid €27 is screen’s needed behavior; overpayment business meaning not treated but not needed for query/cardinality. SQL aggregates all orders but immediately scopes authorized IDs for real system.
- request-cost 08: Preserves consistency while advocating batching. Explicit connection owner, BEGIN and cleanup supplied; not merely SQL statements. Potential edge: broken/unusable connection should be discarded instead of ordinary release, but text delegates actual cleanup to driver and does not present runnable unsafe code. Worth source verification, no required expansion yet.
- request-cost 09: Closes actual worked requirements including empty parent and third payment; clear distinction correctness/performance checks. Ending slightly restates main distinction but usefully grounds it in this screen. No unsupported learning inference.
- request-cost 10/optional: Readiness first impression: good supporting article, new substantive learning beyond parent. Optional text empty. Ready for technical SQL/driver checks.
- reporting 00: Sibling supporting article; carry performance main and batching knowledge, though it should still introduce reporting’s own decision.
- reporting 01: Introduces operational versus analytical question scale with concrete questions. I understand why same data may entail different work; no premature architecture recommendation.
- reporting 02: Explains shared resource contention rather than implying read locks necessarily block writes. Now able to explain why read-only reporting changes checkout performance.
- reporting 03: Opening establishes options and criteria coherently; wants correctness/freshness before storage. Different decision from parent performance article.
- reporting 04: Headings fit promised decision order, plain vocabulary.
- reporting 05: Grain explained through exact records before aggregation. Scope restriction taxes/refunds helps rather than hiding missing critical correctness. Date/time-zone boundary named before SQL. Zero-date omission explicitly taught.
- reporting 06: Strong causal reasoning: covering index still one entry per sale; reuse is motivated by ten identical requests. Minor exactness: 'a year ... 365' ignores leap year but illustrative can read as a possible year; not worth repair unless author prefers 'about 365'. work_mem described as per operation with concurrency, avoids universal hard cap.
- reporting 07: Excellent definition of MV compared with ordinary view, then exact correction rather than only addition. UNION result reader can derive. Potential variation sequencing: change correction after previous refresh → summary €55, live €60, fine 'waits for refresh' not claiming old €50.
- reporting 08: Publication versus snapshot time is well differentiated; 'carry cutoff' asks for deliberate definition. Concurrent refresh qualifying index assertion precise, should check docs. Delta example makes increments/deletes/retries meaningful before recommendation. Last paragraph supplies useful stopping point and avoids prescribing architecture.
- reporting 09: Carrying €50→€55 correction into replication is an effective continuous example, not another disconnected warning. Criteria for separate analytical store are qualitative with evidence demand, appropriate. Replica CPU/memory separate depends deployment; phrase 'provides' typically separate replica node but same-host possible; not material in context.
- reporting 10/optional: First-reading verdict: clear practical choice, sufficient correction/freshness reasoning, no blocking comprehension gap. Optional text empty. All three first readings now complete; source/technical review begins afterwards.

## Technical and rendered review

### Repairs requested

1. **The selective-index lesson checks a different run from the one the reader
   sees.** The fifth `performance-estimates` step combines the state-restoring
   update, ANALYZE, CREATE INDEX and EXPLAIN in one submission. Independent
   execution through the same raw protocol as the sandbox returned a sequential
   scan with 10 output rows, 9,990 filtered rows and 581 buffer hits. Only a later
   EXPLAIN returned an index-only scan. The existing author verification executes
   that later JSON-plan query and checks it, while its own recorded literal step
   response contains the sequential scan. This contradicts the lesson’s expected
   “verified run used an index-based path.” Split preparation and plan observation
   into separate steps and validate the first actual plan returned to the reader.
   The later plan also reports 5,000 heap fetches after the updates; an index-only
   scan name must not imply zero table access. The explanation need not teach the
   complete visibility-map mechanism here, but should avoid that inference or
   explicitly prepare a cleaned-up table if that is the intended example.

2. **Repeated monitoring needs a fresh observation.** The main article says to
   repeat observations from `pg_stat_activity`. PostgreSQL can retain the observed
   activity snapshot within an explicit monitoring transaction. In a query editor
   that holds such a transaction open, repeating the statement can show stale
   blockers while `clock_timestamp()` makes the computed ages increase. Add a
   short instruction to sample in autocommit, end the monitoring transaction, or
   clear its statistics snapshot before another sample. This is a bounded
   operational repair, not a request for a separate monitoring tutorial.

The coordinator received both findings before this record was completed. At this
revision the performance lesson needs repair; the article prose is ready subject
to the small monitoring addition. Request-cost and reporting have no material
unresolved findings from this review.

### Technical evidence

All fifteen authored performance lesson steps were independently executed through
`execProtocolRawStream` rather than relying on the author’s convenience-API check.
The temporary runner was `/private/tmp/check-performance-independent.mjs` and used
the exact `performanceTutorials` definitions. Every command succeeded; all runs
ended outside an explicit transaction. Assertions confirmed the 5,000 actual rows
after the population change, three batched children, six initial joined rows,
independent totals of 25/25, 8/8 and 0/0, and six Ada combinations after the third
payment while her ordered total stays 25 and paid becomes 27. Report correction
returned live 55 versus stored 50, then stored 55 after refresh. Every setup was
rerun successfully. The indexed-plan assertion exposed finding 1; rerunning only
EXPLAIN established the difference described above.

The first-reading question about automatic statistics is resolved by the lesson’s
explicit controlled single-session setting without a background autovacuum worker.
It is not a claim that a normal server’s statistics remain unchanged indefinitely.

Primary sources checked after the first reading:

- [PostgreSQL 18 monitoring statistics](https://www.postgresql.org/docs/18/monitoring-stats.html)
  confirms monitoring privileges, activity versus query age, and transaction-local
  observation caching with `pg_stat_clear_snapshot()`. The caching behaviour is
  the evidence for finding 2.
- [PostgreSQL 18 materialized-view refresh](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html)
  confirms replacement of stored contents, concurrent-reader behaviour, an already
  populated view, a qualifying unique index over all rows, and one refresh at a
  time per view. Reporting states those conditions accurately.
- [node-postgres transactions](https://node-postgres.com/features/transactions)
  and [pooling](https://node-postgres.com/features/pooling) support the request-cost
  article’s one-client transaction boundary, explicit cleanup, and the difference
  between pool-level convenience queries and an acquired client. The article
  correctly delegates exact driver cleanup to the documented implementation.
- [PostgreSQL 18 EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
  supports estimated versus executed rows, execution of statements under ANALYZE,
  and the distinction between planner costs and elapsed time. The main article
  consistently treats invented endpoint traces as illustrative rather than
  measurements of the browser runtime.

### Writing and media judgement

The opening of the main page explains performance immediately through useful work
and caller waiting. Its 180 ms table gives each interval a distinct boundary, and
the later monitoring section follows a waiting update to the handler that holds
the lock. This is patient explanation without repeatedly announcing conclusions.
Keep that progression intact during the monitoring repair.

Request-cost’s strongest sequence gives the three parent identities, the exact
line quantities and prices, and Sam’s empty order before asking readers to
interpret any SQL. The line–payment table then exposes the four combinations
directly. The two repairs—separate child batches for records, preaggregation for
totals—answer different response requirements. The article is not merely a
repetition of the main page’s N+1 example.

Reporting carries a single historical correction from the live aggregate to a
stored result and then to a remote copy. This makes freshness and incremental
maintenance concrete without turning the article into a replication survey.
The difference between refresh completion time and source snapshot time is
especially useful. The original worry about a “year” having 365 days is not a
material finding: the wording describes an illustrative year, not a calendar rule.

Inspected supplied full-page screenshots and native-width crops from 390 px and
1,280 px captures in both themes. Body text, heading wrapping and tables remain
legible; the request-cost four-column table fits the phone capture. Long SQL is
contained in a horizontal region instead of overflowing the document. The
development Astro toolbar overlays a few screenshot lines; this is a development
capture limitation, not evidence of production content. I did not operate the
scroll region or live controls in this review; the coordinator’s browser pass
must establish their interaction and keyboard behaviour.

## Repair recheck

The coordinator split index preparation and observation into steps 5 and 6. On
15 October, I reran the exact revised lesson through the raw protocol. Step 6's
first response now contains an Index Only Scan and the stated heap fetches; no
helper query is needed to obtain the promised plan. All sixteen performance
lesson steps, the batching variation, stored-report correction and resets passed.
The expected text explains that index-only access can still visit table pages
to establish visibility, so its name is not mistaken for a zero-heap-work claim.

Reread the revised monitoring paragraph together with its blocker example and
the following wait-category paragraph. Autocommit, ending the transaction, and
clearing the statistics snapshot are placed beside the instruction to repeat
observations, where the operator needs them. The paragraph is longer but remains
one connected explanation of interpreting an observation. The revised plans
paragraph states that preparation completes before the next read; it preserves
the selective-versus-broad comparison without dwelling on verifier history.

Both findings are resolved. Final judgement: ready as a draft on technical,
comprehension and writing grounds, with live browser control verification still
belonging to the coordinator. This is independent review evidence, not a claim
that every novice or every server environment has been tested.
