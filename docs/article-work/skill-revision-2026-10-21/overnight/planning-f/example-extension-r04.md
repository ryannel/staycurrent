# Proposed example delta: retain W-mix's request class

Status: local repair proposal for F-PLAN-04 / practitioner-1 against F-TREE-r03. This delta supplements the settled W-mix fixture; it does not replace earlier fixture records. The coordinator owns integration. All counts, durations and ranks below are arithmetic on the existing invented fixture. No collection, storage query or service execution is claimed.

## Retention choice and capture

Use complete caller duration/outcome records to produce the W-mix class comparison. The class is a **record field**, not a new metric label. Keep W0's metric labels, six possible worker/outcome groups, histogram tables and proposed classic/native queries unchanged. W0 never specifies which read variant each q identity requested: do not assign W0 a class, use its durations to guess one or claim its class-free buckets can recover one.

Remind and link the root's request-class definition before this choice. **Request metadata** means the options known when the caller starts. Capture the caller's requested variant before timing its outcome: requesting status alone maps to `request_class=status_only`; also requesting session details maps to `request_class=status_with_session_details`. These are the existing two variants, with machine-readable field values corresponding to the existing reader-facing names **status only** and **status with session details**. Both keep `operation=booking_status`. Preserve the captured value when writing the terminal record, including on an error or timeout; duration never determines the class.

Show one compact logical record-field table in the child's existing representation decision, without choosing a storage product or log format:

| Retained field | Meaning and use |
| --- | --- |
| Caller-operation identity | Existing `mix-before-op…` or `mix-after-op…` identity; one caller operation, one terminal record; detect duplicates and reconcile membership |
| `operation` | `booking_status`, selecting the operation independently of its variant |
| `request_class` | One of the two values captured from request metadata at caller start; preserve through export and retention |
| Terminal-event time | Time of caller success, error or timeout, used to select the stated half-open interval; for W-mix use its existing relative fixture clock |
| Caller duration | Caller start to complete reply, or the observed failed caller duration; elapsed time measured on the chosen elapsed-time clock, in ms |
| `outcome` | `success`, `error` or `timeout`, exactly once for the chosen caller observer |

The original fixture stipulates each operation's window membership but gives no individual arrival/terminal offsets. This proposal adds no offsets or replacement clock: a later instrument must retain terminal-event time, while the teaching projection below uses the existing known membership. Duration remains a subtraction on the elapsed-time clock, not a subtraction of timestamps from different observers.

## Selection and completeness

Retain one terminal duration/outcome record for **every** eligible caller operation, through each success, error and timeout path, including both classes. Keep the full windows available until the comparison is made. The chosen records are not sampled diagnostic traces: do not select them by latency, outcome or a trace-retention decision. OpenTelemetry documents trace selection by errors and overall latency, which is why a diagnostic trace collection cannot be assumed complete. [OpenTelemetry sampling](https://opentelemetry.io/docs/concepts/sampling/) was checked on 22 October 2026.

Follow records through instrumentation, export, retention and selection. Compare their unique caller identities and outcome totals to the independent caller ledger for the same interval; report missing/duplicate records and unavailable retention. Validate that captured class values survive too. Keep missing or invalid class metadata visible as **unclassified**, include those records in the eligible pooled totals and do not infer their classes from duration. Matching the total count alone does not establish that each class was captured correctly. If capture or retention is incomplete, the class comparison remains unresolved; obtaining a new matched interval with the required field is the next action. No selective trace set or class selector repairs the old information loss.

## Field to grouped evidence to pooled reconciliation

In the named **W-mix retained-record reconciliation table**, first select `operation=booking_status`, all eligible outcomes and terminal-event times in W-mix-before `[0,300000)` ms or W-mix-after `[300000,600000)` ms. Both windows already stipulate that every caller starts and completes inside its own interval; selecting by the terminal event introduces no membership change. Group by `request_class` and `outcome`. Form duration frequency tables from the retained caller durations; count successes, errors and timeouts separately before calculating ranks. The existing identity ranges supply the following compact projection of complete records, rather than a sample:

| Window and caller identities | Captured class value | Caller duration in every record | Outcome in every record | Record count |
| --- | --- | ---: | --- | ---: |
| Before: 0001–0990 | `status_only` | 40 ms | success | 990 |
| Before: 0991–1000 | `status_with_session_details` | 400 ms | success | 10 |
| After: 0001–0900 | `status_only` | 40 ms | success | 900 |
| After: 0901–1000 | `status_with_session_details` | 400 ms | success | 100 |

The abbreviated identities use their existing `mix-before-op` or `mix-after-op` prefix. Each row represents every identity in its range once. W-mix explicitly stipulates complete all-success windows, so zero errors and timeouts below are known fixture values, not an interpretation of absent outcome series.

| Window | Request class | Duration frequency | Total | Successes | Errors | Timeouts | Exact p99 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Before | Status only | 990 × 40 ms | 990 | 990 | 0 | 0 | 40 ms |
| Before | Status with session details | 10 × 400 ms | 10 | 10 | 0 | 0 | 400 ms |
| Before | Pooled booking-status reads | 990 × 40 ms; 10 × 400 ms | 1,000 | 1,000 | 0 | 0 | 40 ms |
| After | Status only | 900 × 40 ms | 900 | 900 | 0 | 0 | 40 ms |
| After | Status with session details | 100 × 400 ms | 100 | 100 | 0 | 0 | 400 ms |
| After | Pooled booking-status reads | 900 × 40 ms; 100 × 400 ms | 1,000 | 1,000 | 0 | 0 | 400 ms |

Reconcile before `990 + 10 + 0 unclassified = 1000` and after `900 + 100 + 0 unclassified = 1000`. Class success counts sum to the pooled 1,000 successes in each window; class errors and timeouts each sum to zero. Each total matches its independent eligible caller ledger, with 1,000 starts, 1,000 terminal successes and zero opening/closing in-flight work, duplicates, missing records or unknown classes. This is the fixture's completeness stipulation, not an observed operational audit.

Recombine the class frequency counts before ranking pooled durations. Rank 990 is 40 ms before and 400 ms after. Neither averaging class p99s nor assigning classes using 40/400 ms performs this reconstruction. The class durations are the source of the distributions; the pre-captured request option is the source of class membership. Their conjunction yields the unchanged class distributions and changed mixture already taught by the root.

## Placement and integration

The root retains its existing W-mix interpretation table and next-view decision. In the child, “Keep groups useful and small” introduces capture and the field/label distinction; “Choose what information to retain” makes the explicit complete-record choice and works this table; “Follow every denominator through the pipeline” applies count and metadata checks; “Assemble a comparison you can defend” uses the retained field and reconciliation to perform the promised comparison.

During central integration, replace the old W-mix placement sentence “The child only reminds and links this root comparison in its final evidence worksheet” with: “The child reminds and links the root comparison, retains its predefined class in complete caller duration/outcome records, works selection and pooled reconciliation in its representation section, and uses that evidence in its final worksheet.” Keep the existing statement that no new instrumentation label is proposed; clarify that W-mix now proposes the complete record field instead. No fixture times, identities, counts, outcomes, rank conventions, other fixtures, metric queries or article boundaries change. This is a proposed retention extension only; no executable data module is added.
