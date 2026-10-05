# Practice guide and transfer exercises: final technical review

Checked 5 October 2026. Informed independent review of `practice.astro`,
`Prediction.astro`, the JSON download and the three new transfer exercises.
No article or component source was edited. The coordinator owns Docker
dogfooding; this reviewer did not operate its service or practice container.

## Repairs required

1. **The Windows route has an unstated shell prerequisite.** The guide includes
   Windows Docker Desktop, but the multiline start command uses Bash backslash
   continuation. Pasting it into the usual PowerShell terminal fails. Put this
   short command on one line, or explicitly supply the shell-specific form.

2. **The retry SQL omits the command that makes the successful purchase durable.**
   The displayed claim opens a transaction; the reservation snippet creates its
   line. The lookup follows, but no displayed SQL snippet supplies `COMMIT;` for
   that branch. Prose describes commit, and the later pseudocode includes it,
   but a reader pasting the shown SQL remains inside the open transaction. Their
   own lookup can return the provisional order without demonstrating committed
   recovery. Supply the successful-branch end explicitly, after the reservation
   check and line insert. The duplicate branch also needs its explicit transaction
   end. This is an existing article gap exposed by making its practice route
   concrete, rather than an error in the new recovery answer.

## What passed

The container route has coherent boundaries: an explicit PostgreSQL major,
required practice password, no published host port, a TCP readiness probe,
container-local `psql`, downloads copied before `\i`, and a checkpoint of two
base orders. It explains shell versus psql prompts, separate article databases,
expected constraint rejection, rollback after transaction failure, temporary
tables disappearing on reconnect, and the disposal implied by `--rm`. The query
extension now runs through `\i` in the interactive session, so its temporary
filter tables remain usable. Pagination retains its own transaction boundaries.
These conclusions use the [official image documentation](https://hub.docker.com/_/postgres)
and [PostgreSQL's psql documentation](https://www.postgresql.org/docs/18/app-psql.html)
read in the earlier technical pass; they do not claim this reviewer executed Docker.

The exercises ask for a prediction supported by facts, then reveal a reasoned
answer through native `details`. They require no additional runtime. The receipt
variation correctly separates the current product name from the historical line
price: Sea-blue mug, quantity 2, EUR 18.00 and EUR 36.00. The schema cannot retain
the original printed name after that catalogue field changes. The join variation
correctly produces nine pairs and EUR 192.00; separate summaries return EUR 64.00
and three shipments. Distinct amounts lose a separate EUR 20.00 purchase line
and return EUR 44.00. Both were independently executed.

The recovery answer is sound: an empty ordinary read cannot establish the end of
an active original transaction. A conflicting uncommitted unique-key insert can
make the repeated claim wait; after a committed conflict, a subsequent Read
Committed query can read the matching completed order. A known deadlock rejection
requires cleanup and a whole-transaction retry with the same intent. These points
are supported by [uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html),
[Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html), and
[retry handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html).
The execution check reproduced the already-committed duplicate branch without
another stock reservation; it did not reproduce a wait, deadlock, or lost reply.

The new JSON download contains the article constants verbatim in displayed order,
excludes the alternative `relatedRows` setup, and creates `mug_details` once during
the migration. Its earlier ceramic filters precede the stoneware update. Executing
its statements individually on the base schema leaves P7 with
`{"material":"stoneware"}` and typed capacity 350. The five sample-value cases
belong to a query-local CTE and do not change products.

Execution evidence and source hashes are in
[practice-final-technical-results.json](practice-final-technical-results.json).
The runtime was PostgreSQL 18.3 through PGlite 0.5.8 in one session. The reviewer
supplied the missing successful-branch `COMMIT` for the duplicate recovery check;
that check therefore does not erase the reported reader-path gap.

## Handoff

The three exercises and JSON download are ready as drafts on technical evidence.
The guide and retry practice path need the two bounded repairs above, followed by
a source recheck. Docker execution and rendered interaction checks remain with
the coordinator. Review does not authorise publication.

## Bounded repair recheck

Rechecked the revised source on 5 October 2026 without further execution. Both
technical findings above are resolved: the startup command is a single line,
and the retry practice now displays the successful branch's `COMMIT;` and names
the existing-order branch's matching `COMMIT;` or conflicting `ROLLBACK;`.
The guide distinguishes the container from its article databases and keeps
`\q` outside the terminal-command block. It tells readers that the JSON download
executes the full path, whereas stepping through the article starts with base
records only. Query readers are told to rerun SELECT queries while skipping
record-creation blocks. SQL asset imports now use `?url&no-inline`, consistent
with the coordinator's reported ordinary-download check. The coordinator also
reports running the downloaded scripts and variations on PostgreSQL 18.6;
this reviewer has not independently repeated that execution.

The guide, exercises and JSON download are now ready as drafts on this technical
review. The earlier results file remains evidence of its recorded revision,
rather than a new execution of the repaired prose.

The reader-session packet correctly states that no human observations have been
collected. It keeps facilitator history away from the participant, records prior
experience and assistance, limits its initial scope, and preserves unfinished
setup when Docker is absent. One prompt should move out of the participant's
advance packet: step 4 names the exact current-name, agreed-price and historical-
name distinctions before reading starts. Giving the full packet upfront can cue
what the reader is meant to notice, despite the facilitator instruction to keep
observation targets unrevealed. Keep that specific teach-back question in the
facilitator's end-of-session notes, or replace the advance version with a neutral
request to explain what the example helped the reader understand. This affects
the interpretation of a future human session; it is not a claim that such a
session has already happened.
