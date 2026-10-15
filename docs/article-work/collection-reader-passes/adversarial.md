# Adversarial reader pass

Baseline: afbf6f7. All nine requested pages read in the commissioned order. One actionable P2 finding; no P0/P1 finding. This is an independent baseline review, not publication approval.

## Finding A1 — P2: classify uncertainty by outcome, not only connection failure

Page: `/learn/databases/relational/conflicts-and-retries/`, “Retry the decision, not the last statement”, retry-policy pseudocode. Baseline source location: `src/pages/learn/databases/relational/conflicts-and-retries.astro:83`.

Exact trigger:

```text
catch connection_failure_when_commit_may_have_been_sent:
  discard connection
  return recover_same_operation(operation_id, original_request)
catch other_failure:
  clean up the transaction
  return or raise that failure
```

The preceding prose correctly says a request deadline does not prove the database stopped. But this branch only recognises a connection failure. A client query deadline can expire while waiting for COMMIT without being classified as a broken socket. A reader adapting the pseudocode can send that indeterminate result to `other_failure`, clean up, and report an ordinary failure without recovering K14. Cleanup cannot undo a commit already accepted. The fuller main-article handler has the safer contract: once COMMIT may have been sent, require positive evidence of rejection before treating an error as known failure.

Smallest repair: name the branch for an unconfirmed outcome after possible COMMIT, and explain that the transaction helper must preserve both phase and evidence of a confirmed rejection. Include client timeouts as well as transport failures; keep known 40001/40P01 rejection handling distinct. Do not imply that every server-reported error proves rollback. PostgreSQL defines 08007 and 40003 as unknown outcomes; some listed codes are not emitted by every core path, so those names are classification evidence rather than a claimed reproduction.

Recheck with three inputs: a confirmed 40001 rejection, a dropped COMMIT reply, and a client deadline reached after sending COMMIT. The first retries the whole operation; the latter two preserve K14 and recover or remain pending.

Evidence: [frozen assembled text](adversarial/conflicts-and-retries.txt), [encounter log](adversarial/log.md). Official references: [node-postgres client configuration](https://node-postgres.com/apis/client) distinguishes `query_timeout` from server timeout settings; [PostgreSQL error codes](https://www.postgresql.org/docs/18/errcodes-appendix.html) identifies unknown-outcome codes; [connection status](https://www.postgresql.org/docs/18/libpq-status.html) supplies the driver's state context.

## Coverage and method

The assembled browser text was read sentence by sentence, including code lines, results, captions, source notes and labels. Subsequent pages arrived in two to four bounded chunks, with observations appended before continuing. Overview arrived as one full-page chunk; its retrospective section log is a granularity limitation. Closed disclosures were opened and recorded separately after the main text. No previous review records or other current reviewers' findings were consulted.

| Reading order | Passage coverage | Media and runtime evidence |
| --- | --- | --- |
| Relational overview | Introduction through sources; all sections | Five figures inspected as pixels; no controls |
| Designing your data | Opening/schema; identity/dependencies; all three normal forms; relationships/lossless joins; history; separation; types; enforcement; JSON; practice/variation/sources | Nine figures; both fact layouts, correction, next copy, price, reset; six proposals plus missing-quantity and extra-uniqueness counterexamples |
| Constraints | Opening/rules; required values; keys; references/deletion; concurrency; wider operation/sources; optional DDL/seeds | Three figures; all four quantities with and without NOT NULL |
| Tables and JSON | Objects/rows; all three representations; JSON type/null extraction; intermediate and final capacity rules; reads/indexes; stale replacement; offers; migration/final design/sources | Four figures; all five JSON probe values, pixels inspected |
| Querying your data | Result/grain; joins; missing matches; ON/WHERE; aggregates; multiplication and repair; EXISTS; plan; strategies; statistics/sources; setup and variation | Four figures; eight strategy/input combinations, full-panel screenshots; prediction recorded before answer |
| Pagination and large results | Ordering/ties; offsets; tuple boundary; API token; work/grain; moving membership; fixed export; effect/checkpoint/sources; optional examples | Fixed-view figure and all four change cases, pixels inspected |
| Transactions and concurrency | Atomicity/lifecycle; full handler branches; ordinary/conditional/locking writes; views; write skew; deadlock/retry; unknown outcome; payment/outbox; review/sources | Four figures; six concurrency method/end combinations and four recovery combinations, every step read; previous/reset exercised; complete handler and psql disclosures read |
| Isolation and snapshots | Ordinary views; two-read schedule; own writes; changed-row rejection; write skew; Serializable; shared control row; choice/sources | Two figures; all three events at both levels; reset; source-scope disclosure |
| Handling conflicts and uncertain outcomes | Waiting/cancel; deadlock; whole retry; lost reply; durable identity; SQL branches; active original attempt; retention/external effects; variation/response table/sources | Four figures; setup and answer disclosures; no interactive demo |

All figures were captured with Playwright and inspected through `view_image`. Evidence lives under [adversarial/](adversarial/): `*-figure-*.png`, targeted control screenshots, main text and `*-controls.txt`. Browser viewport was 1280 × 900. This was not a responsive/mobile or assistive-technology audit. Readable figure and panel screenshots supply the retained visual evidence. The coordinator moved redundant full-page captures to a temporary local archive after this pass; [the archive manifest](adversarial/full-page-archive.json) records their locations. Those full-page files are not required to inspect the figure evidence and are not durable repository artifacts.

Runtime interaction established what the browser models show. SQL was traced against each stated setup; this pass did not run a PostgreSQL server, a two-session schedule or a transport fault injector. Query-work and recovery model source were inspected after their rendered passages. Current implementation edits were not made by this reviewer.

## Preserved successful boundaries

The pages usually anticipate the concrete counterexample before it can mislead: historical prices versus current names; keys versus repeating products; NULL versus positive checks; fractional JSON inputs versus integer conversion; line–shipment multiplication versus grouping; keyset boundaries versus snapshots; locked writes versus stale decisions; stable views versus cross-row rules; known rollback versus uncertain commit. The source/setup resets between O14 examples are explicit. These are useful explanations to preserve, not invitations to add more caveats.

No unresolved practical inference was found in the first eight pages. Several initial questions were answered by the next passage, as recorded in the log; they were not promoted into findings merely because they arose.

## Narrow skill improvement

Add one prompt to the existing review guidance for a collection with both full and abridged implementations: “When a supporting article compresses a working control-flow example, trace the same ordinary, rejected and uncertain outcomes through both versions. Check that an abbreviated catch condition has not narrowed the guarantee.” A1 is a concrete instance: the full handler preserves uncertainty, while the supporting sketch initially routes only transport failure to recovery. Keep this as a review question, not a required catalogue of every SQLSTATE.

## Local repair recheck

After the independent baseline pass, reviewed the updated rendered page on port 4322. A1 is resolved: the catch now reads `unconfirmed_outcome_when_commit_may_have_been_sent`; its following paragraph requires the helper to report phase and confirmed rejection, including non-connection errors. The confirmed 40001/40P01 branch stays separate. A client deadline after possible COMMIT therefore reaches recovery rather than generic failure.

Also reread the coordinator's revised claim/reservation passage. It now names one handler and retained connection, separates new-order and existing-order branches, places the returned-row decision before the line INSERT, and explains cleanup of the existing-result branch. Traced new claim + zero stock → rollback/no line; new claim + successful reservation → line then commit; existing key → no reservation, read/compare/end. These changes agree with the later pseudocode and recovery illustration. No new issue found. Evidence: [updated assembled text](adversarial/repaired-conflicts.txt). This is an informed local recheck, not a new independent full pass.
