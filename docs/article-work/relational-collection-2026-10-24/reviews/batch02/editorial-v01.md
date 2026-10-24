# Editorial review · initial article batch · r03, r05, r06, r07, r09, r13 · batch02-v01

Inputs read: the complete assignment in `editorial-assignment.txt`; `staycurrent-review/SKILL.md` and only its `perspectives/editorial.md`; frozen `v01/audience.md`; manifest version, preview, key and input-list metadata; the six complete rendered pieces at the frozen preview, including code, tables, figures, text alternatives, the r03 deferral disclosure and every final Sources disclosure. The final Sources disclosures were read from the rendered page DOM even where outside the article element. No files inside `context/`, `source/` or `mechanical/` were read. No earlier versions, reviews, author notes, decisions or history were read.

Reference calibration: read all three fixed references in full through 19 separate adequately budgeted outputs from `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7, storage 1–6. Every output's END marker was present. Studied all 34 rendered drawings alongside their explanations at `http://127.0.0.1:4350/review/examples/`: 13 sequences, 11 indexes, 10 storage. Used a temporary background tab without changing viewport or theme. Reported completion of this calibration to the coordinator before reviewing the assigned articles.

Frozen rendered inputs:

- r03: `http://127.0.0.1:4384/review/relational-collection/constraints/`
- r05: `http://127.0.0.1:4384/review/relational-collection/query-results/`
- r06: `http://127.0.0.1:4384/review/relational-collection/aggregates-and-windows/`
- r07: `http://127.0.0.1:4384/review/relational-collection/large-results/`
- r09: `http://127.0.0.1:4384/review/relational-collection/application-sql/`
- r13: `http://127.0.0.1:4384/review/relational-collection/transaction-boundaries/`

Highest severity: none

This is initial independent editorial coverage of all six complete pieces: all seven checks separately for each, followed by a whole-article judgement against the references. It is not a repair confirmation, practitioner review, visual review or final complete review.

## r03 · Constraints and tenant boundaries

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title names the two connected subjects. “One identity, one row”, “The shop is part of the identity” and “Integrity does not grant access” identify the progression economically. |
| 2. Plain sentences | pass | Declarations are followed by concrete consequences. The contrast between separate UNIQUE declarations and a composite primary key is explained in ordinary sentences. |
| 3. Terms | pass | Constraint, composite identity, parent, child and tenant are explained where needed; required and optional reference components are distinguished. Prerequisite keys, NULL and transactions are used within the declared audience. |
| 4. Openings | pass | The opening defines a constraint, identifies the shared enforcement boundary and explains why the whole forbidden state must be expressed. The tenant variant has a clear purpose before it appears. |
| 5. Reader-facing text only | pass | No repair or planning history occurs in the article. The worksheet and Sources material explains provenance and how to repeat the examples. The review shell explicitly marks the collection as draft. |
| 6. Captions and labels | pass | “Line to follow” and Stored/Attempted shop labels identify the variable. The caption explains the two parent lookups and distinguishes the illustration from PostgreSQL's execution order. Table captions state the cases compared. |
| 7. One piece | pass | The argument moves from one row to identities, references, tenant scope, authority and multi-row protocols. Qualifications about NULLs, defaults and access occur beside the reasoning they change. The deferral disclosure is a contained extension of reference enforcement. |

### Whole-article judgement

This could sit beside the references in explanatory development and prose. It repeatedly turns a declaration into an observable consequence before broadening the rule. “Separate declarations of UNIQUE (order_id) and UNIQUE (line_no) would mean something else” earns the composite-key explanation with a small counterexample. The two P7 products then make the tenant key necessary, rather than introducing tenant scope as a list of advice. “A caller allowed to insert arbitrary values could supply a completely consistent shop 20 order and product pair” supplies the missing reasoning between integrity and authority.

The later protocol section does not simply accumulate caveats: the paid-order and class-capacity examples show why the earlier declarations cannot carry every business rule. The final testing section converts these distinctions into useful practice. I found no reader stall or article-wide failure requiring a finding.

### Findings

None.

## r05 · Joins and the meaning of a result row

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title makes result meaning the subject. “Two independent collections”, “Total before combining” and “Whether a match exists” name distinct decisions. |
| 2. Plain sentences | pass | The pairing explanation, repeated contributions and accidental correct balance are precise and connected. SQL is interpreted rather than left to explain itself. |
| 3. Terms | pass | Grain is introduced as “one row per …”; CTE, left/inner join, correlated subquery and EXISTS are explained in use. |
| 4. Openings | pass | The opening gives the pairing rule and its practical stakes, then fixes the report and starting data. |
| 5. Reader-facing text only | pass | No production or repair instructions appear in the body. The final disclosure explains the executable experiment and the limits of the figures. |
| 6. Captions and labels | pass | The line–payment pair label makes the changed grain explicit. The ON/WHERE comparison names the selected condition and displays its resulting rows; text alternatives explain both answers. |
| 7. One piece | pass | One still-due report supplies the main reasoning. Existence tests extend the same distinction between pairing and the question being asked. Qualifications about missing line totals and SUM(DISTINCT) resolve concrete ambiguities already raised. |

### Whole-article judgement

The piece meets the reference standard. The strongest passage is “Subtracting gives zero, the correct balance for the wrong reason”: the exact 79.00/79.00 counterexample explains why checking an answer's plausibility is insufficient. The corrected report then earns its separate totals and retained unpaid order. “An order with only non-card payments already found matches at the join, so no missing placeholder row was created” explains the tempting OR repair instead of merely forbidding it.

The final section gives reusable checks grounded in the worked example. It does not ask the reader to infer a general method from unexplained syntax. No substantive editorial defect found.

### Findings

None.

## r06 · Aggregates, windows and ordered results

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title accurately connects the subjects. The headings distinguish counting, filtering, retained rows, sequence, frames and ranks. |
| 2. Plain sentences | pass | The prose attaches each SQL choice to the result it changes, including the two independent jobs of ROWS and the tie-breaker. |
| 3. Terms | pass | Aggregate, window, partition, peer, frame and unbounded/current boundaries receive usable explanations. CTE and result grain are established by the assigned predecessor. |
| 4. Openings | pass | The first paragraph gives the collapse/retain distinction. The next sets out why ordering and ties change the question, before introducing the labelled extra headers. |
| 5. Reader-facing text only | pass | The extra headers and separate score illustration are declared as examples. The Sources disclosure explains the experiment and figure status without exposing editing history. |
| 6. Captions and labels | pass | “Frame” and “Current order” state the controls' variables. The table, current-row marker and count explain membership. The grouping/window comparison labels the output grain. |
| 7. One piece | pass | The piece builds from order totals through retained order rows to sequence, peers, frames and rank. Qualifications are integrated: missing lines follow the CTE definition, window filtering follows window input, and tie-breakers are revisited where ranking changes their meaning. |

### Whole-article judgement

This is a coherent article at the reference standard. The 21.70-per-line versus 36.17-per-order comparison gives the denominator practical meaning. The window section carries that established row meaning into a new operation: “The same 68.50 appears on both rows. Summing the customer_total output would count Mina's total twice”. The frame comparison then uses the smallest extension needed to show peers.

“There are two changes in that second expression, and each has a job” is a necessary explanatory passage, not an interrupting patch: it prevents the figure from teaching that ROWS alone resolves tied positions. The later advice to omit IDs from a ranking order follows from the same peer definition. No substantive editorial defect found.

### Findings

None.

## r07 · Pagination and consistent exports

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title states the paired application needs. “A boundary is not a snapshot” and “One view for an export” make the central distinction easy to locate. |
| 2. Plain sentences | pass | Boundary comparisons, changed-list histories and export costs are expressed directly. Technical qualifications are connected to a concrete consequence. |
| 3. Terms | pass | LIMIT/OFFSET, total order, keyset/seek pagination, API cursor and database cursor are distinguished. Snapshot basics are within the declared starting knowledge and are refreshed in the export section. |
| 4. Openings | pass | The opening distinguishes scrolling from exporting before introducing mechanisms; the later headers and independent histories are identified. |
| 5. Reader-facing text only | pass | The repeatable experiment's prerequisites and limitations serve the reader. There are no author decisions or repair notes. |
| 6. Captions and labels | pass | “Between requests” and “Continue with” identify separate choices. The fixed first response and saved boundary are stated beside the figure. Snapshot controls and schedule text explain which view changes. |
| 7. One piece | pass | Continuation correctness, scan work, membership movement, snapshot choice and retention cost form one argument. The difference between a plain cursor's query view and related queries' view is explained at the cursor example. |

### Whole-article judgement

The article belongs beside the references. Cancelling 101 makes the offset defect visible; moving 103 then shows the limit of keyset continuation using the same boundary. The sentence “Deduplicating IDs in the client can suppress repeats but cannot recover omissions” earns its place from those histories. The cost section also clearly distinguishes the simple observed row counts from a universal performance claim.

The export discussion continues the opening promise through implementation and practical cost. “Saving only IDs and later joining them to current orders preserves a membership list, but lets field values change underneath it” explains precisely why a superficially durable export may not preserve its promised answer. No substantive editorial defect found.

### Findings

None.

## r09 · SQL at the application boundary

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title accurately scopes the subject. Each heading names a meaningful contract or risk at that boundary. |
| 2. Plain sentences | pass | Driver syntax is interpreted, including the one-element tuple, context ownership and the distinction between a cancellation request and completed cleanup. |
| 3. Terms | pass | Driver, placeholder, identifier composition, result conversions, pool, autocommit, SQLSTATE and ORM are introduced with their immediate role. Prerequisite transaction boundaries are refreshed. |
| 4. Openings | pass | The opening supplies concrete ways sound SQL can still fail and then establishes driver, language and ownership questions. The purchase rewind is signposted. |
| 5. Reader-facing text only | pass | Code comments address correct use. Experiment details disclose versions, scope and limits rather than narrating production work. |
| 6. Captions and labels | pass | Figure 1 shows one value position with two inputs. Figure 2's Request outcome selector and ownership labels explain its choice; its caption distinguishes a model from a protocol capture. |
| 7. One piece | pass | Parameter structure, returned-result meaning, transaction ownership, business refusal and cancellation are connected stages of application responsibility. The ORM section returns to the same command and result questions. |

### Whole-article judgement

The article meets the reference standard. The malicious product ID first changes the unsafe query and then becomes an ordinary unsuccessful lookup under binding; the reader sees the protection's mechanism and boundary. “fetchone() returning None means there is no next row; a row containing a missing column is a tuple containing None” makes a small but useful result distinction explicit.

Transaction ownership is developed through the pool/context example and the second-connection counterexample. The no-stock section then explains why catching inside the context can commit earlier work. The cancellation section follows that same ownership to completion rather than adding unrelated timeout tips. The scope is broad, but each section returns a concrete application decision. No substantive editorial defect found.

### Findings

None.

## r13 · Transactions and isolation

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The subject is named plainly. The sequence from “What must stay true” to “Choosing the protection” makes the design method visible. |
| 2. Plain sentences | pass | The stock and instructor schedules are explained in active, connected sentences. The serial-order cycle is made concrete through Ada and Tomas. |
| 3. Terms | pass | Invariant, atomicity, snapshot, write skew and Serializable are defined through their examples. Isolation levels are introduced before their distinct outcomes are used. |
| 4. Openings | pass | The opening distinguishes atomicity from isolation and identifies the three promises developed by the article. The separate instructor example is announced before use. |
| 5. Reader-facing text only | pass | Rewinds and separate histories orient the examples. The experiment disclosure states what was run and observed without importing repair or authoring history. |
| 6. Captions and labels | pass | Figure 1 identifies logical views and denies a time/page interpretation. Figure 2 identifies the shared rows, read facts and chosen victim while explaining that real execution may differ. Both complete step-text disclosures were read. |
| 7. One piece | pass | The argument develops from invariant to atomic group, conditional update, stable read, multi-row anomaly and protected decision. Restrictions on each mechanism appear where its apparent promise would otherwise become misleading. |

### Whole-article judgement

This could sit beside the references. “Stock is non-negative throughout, so CHECK (stock >= 0) has no reason to reject either write” separates two superficially similar rules with the last-mug example. The purchase recipe then makes application branches part of the transaction's correctness before moving to snapshots.

The instructor example earns the greater abstraction. The opposed requirements “Ada must come first” and “Tomas must come first” explain why both departures cannot have a serial explanation. The retry is equally concrete: a fresh count of one means stay, rather than repeat the failed update. “Serializable would happily run an unconditional ‘turn myself off’ transaction after Ada's transaction” is necessary to the practical judgement being taught and is attached to that reasoning. The final table gathers choices already demonstrated, rather than introducing unexplained recommendations. No substantive editorial defect found.

### Findings

None.

## Limits

This review judges the complete rendered writing against the assigned audience and fixed references. It does not establish technical truth through fresh primary-source research, reproduce SQL/driver experiments, inspect implementation, verify downloads or test every interactive state. Such work belongs to the separately commissioned practitioner and visual perspectives. Read the available figure alternatives and complete step disclosures; also inspected the 11 assigned article figures as rendered for captions, labels and their relation to prose. No viewport or theme changes were made.

The frozen review navigation and its planned neighbours were observed as the supplied shell. Linked unassigned drafts and planned articles were not read as compulsory closure. No corpus-wide consistency verdict is claimed. No article edits, delegation, build, commit, push or publication was performed. This clean initial editorial assessment does not replace the remaining article-review schedule or authorise publication.
