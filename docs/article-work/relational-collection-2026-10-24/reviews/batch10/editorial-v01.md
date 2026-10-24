# Editorial review · initial article mode · batch10 · v01

Inputs read: [frozen manifest](v01/manifest.json), its audience.md, and complete rendered first versions at the manifest’s preview http://127.0.0.1:4516/review/relational-collection/:
r40 postgresql/schema-changes/; r41 postgresql/operations/; r42 postgresql/access-control/; r54 postgresql/sharding/; r55 postgresql/full-text-search/; r56 postgresql/vector-search/. Every article’s prose, headings, tables, SQL, figure labels/captions, article-specific disclosures, scripted step explanations and final Sources outside the article element were read. The repeated collection navigation was read once and status/current-piece differences inspected.

Calibration: complete Sequence diagrams, Indexes and Storage and durability through exactly 19 separate bounded helper reads (6+7+6), every END marker delivered. Root audited and acknowledged 19/19 before article study. All 34 rendered reference drawings (13+11+10), captions, labels and explanations were studied at 4350; root acknowledged completion before article study. This is one coherent 16-piece calibration assignment with batches 11/12. Current review skill and editorial perspective only were used.

Withheld: plans, source, mechanical/native receipts, approvals, history, author quality notes and peer results. No builds, edits to articles, downloads or publication.

Highest severity: low.

## r40 · PostgreSQL schema changes under load

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title names the operational question; queue, work type, validation and index readiness are economical section subjects. |
| 2. Plain sentences | pass | “The migration has not changed a row, yet it has become an obstacle to new work” states the queue consequence directly. |
| 3. Terms | pass | Lock modes, scan/rewrite, valid/ready and the integer unit receive the meaning needed for subsequent reasoning. |
| 4. Openings | pass | The two costs and exact decimal-to-integer conversion establish purpose and prerequisites before commands. |
| 5. Reader-facing text only | pass | Reproduction and observation limits explain what the reader may infer; no editing history appears. |
| 6. Captions and labels | pass | Both lifecycle figures identify their scope; the timeout/keep-waiting choices and all scripted explanations make the changed dependency explicit. |
| 7. One piece | pass | One price conversion carries installation, backfill acceptance, caller coexistence and final handover. Qualifications sit beside the decisions they change. |

Whole-article judgement: can sit beside the references. The empty SKIP LOCKED batch that still leaves line(103,1) missing supplies a concrete reason for the complete acceptance query. The failed concurrent build then develops a different retained state without breaking the main operational argument. Both figures and the full dependency disclosure were read, including all five timeout states and the keep-waiting alternative. No findings.

## r41 · Operating and diagnosing PostgreSQL

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings follow request identity, observed state, dependency and intervention. |
| 2. Plain sentences | pass | The distinction between a busy backend and useful progress is precise and connected to the application queue. |
| 3. Terms | pass | Acquisition/ownership, session states, transaction horizons and signal outcomes are explained where required. |
| 4. Openings | pass | Two borrowed connections and the third request without a backend make the diagnostic gap understandable immediately. |
| 5. Reader-facing text only | pass | Native-drill scope and reproduction details support interpretation. |
| 6. Captions and labels | pass | All five recovery states, the full recovery disclosure and the figure distinguish pool availability from root blocking. |
| 7. One piece | pass | A single incident connects monitoring evidence, cancellation, rollback, termination and the eventual stock outcome. |

Whole-article judgement: can sit beside the references. “One pool slot is now available; B is still blocked” develops the central distinction through an observed consequence. The later no-stock retry accounts for business outcome as well as queue recovery. Alternative diagnostic branches are tied to evidence that would select them and do not read as appended objections. No findings.

## r42 · PostgreSQL roles, policies and privileged code

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The sequence moves from role membership to row scope, execution identity and object lookup. |
| 2. Plain sentences | pass | The forged 999 price is an economical counterexample to a less familiar name-resolution vulnerability. |
| 3. Terms | finding | editorial-1: ACL appears unexpanded in the deployment acceptance guidance. |
| 4. Openings | pass | The same SQL seeing different rows under a helper identity gives a concrete reason to examine the complete authority path. |
| 5. Reader-facing text only | pass | Test and local-authentication limits describe the evidence’s reach without production history. |
| 6. Captions and labels | pass | Both complete five-state lookup branches and disclosure explain session/effective identities and which relation supplied the returned value. |
| 7. One piece | pass | Membership, row policies, owner bypass and the corrected helper build a coherent authority argument. |

Whole-article judgement: can sit beside the references, with optional local terminology polish. The distinction between safely binding shop 20 and authorising shop 20 is useful, then the temporary-table example shows a separate boundary. The corrected helper’s owner, session-based policy and qualified relation each answer an established problem. The explanation does not imply FORCE contains the owner.

### editorial-1 · low · r42 · Keep the deployment boundary testable

Problem: “Inspect the stored function owner, security mode, configuration and execution ACL” uses ACL without expanding it; the later “existing functions still need their own ACL repair” relies on the same abbreviation.

Effect: the stated audience can follow the authority explanation but may need a small external lookup to identify which stored grants the acceptance check means.

Suggestion: expand access-control list at first use, or name the function’s execution grants directly.

Evidence: both quoted phrases in the complete frozen rendered r42; the audience supplies general least privilege but does not explicitly supply PostgreSQL ACL terminology.

## r54 · Where distributed PostgreSQL work runs

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title and headings name work placement, per-server snapshots and move authority. |
| 2. Plain sentences | pass | The receipt gives the four distribution arrangements a concrete shared question. |
| 3. Terms | pass | Application shards, foreign tables, co-location and reference tables receive local explanations; fence/epoch rests on the declared distributed-work prerequisites. |
| 4. Openings | pass | The same receipt assembled on one or several servers makes the work boundary and its cost legible. |
| 5. Reader-facing text only | pass | Citus sketches, native FDW observations and the scratch ownership drill are clearly distinguished. |
| 6. Captions and labels | pass | The snapshot timeline and all six handover explanations identify what each price/revision measures and which writer remains active. |
| 7. One piece | pass | Placement leads to remote execution, independent snapshots, skew and movement of the same tenant boundary. |

Whole-article judgement: can sit beside the references. The returned A 20/B 19 pair that never coexisted gives the remote snapshot claim explanatory force. The handover’s revision/journal then demonstrates why copying rows or changing a route is insufficient. The different Citus and application-managed mechanisms stay distinct without leaving the reader to reconcile conflicting guarantees. Both figures and the full handover disclosure were read. No findings.

## r55 · Full-text search in PostgreSQL

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Search-document construction, input language, eligible ranking and measured work form a clear route. |
| 2. Plain sentences | pass | The unavailable Blue mug and disclaimer-bearing Teapot carry the explanation without decorative language. |
| 3. Terms | pass | Vectors/queries, configuration, lexemes, positions, weights, rank, precision and recall gain meaning through the examples. |
| 4. Openings | pass | The first result shows immediately why lexical correctness can disappoint the shopper. |
| 5. Reader-facing text only | pass | Fixture and execution-order qualifications support the reader’s interpretation. |
| 6. Captions and labels | pass | All three search choices and their five states, the full search disclosure and the ranking-work figure explain matching versus eligibility versus usefulness. |
| 7. One piece | pass | The same corpus supports configuration, phrases, rank and the final judged search tasks. |

Whole-article judgement: can sit beside the references. The phrase spanning title/description gives positional representation a real consequence. The 200 matches/100 eligible/5 returned example then explains why LIMIT does not remove ranking work. The ending returns to the initial poor Teapot answer with concrete evaluation and structured-data choices. No findings.

## r56 · Vector search in PostgreSQL

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The sequence separates distance, exact baseline, approximation, filters and meaning. |
| 2. Plain sentences | pass | “Returning the visited candidates in strict distance order does not prove that an unvisited point was farther away” states the crucial limit plainly. |
| 3. Terms | pass | L2, other metrics, HNSW/IVFFlat budgets and recall are developed before design choices depend on them. |
| 4. Openings | pass | Two distinct failure types are stated and then shown through toy geometry and measured retrieval. |
| 5. Reader-facing text only | pass | Version, fixture and forced-path limits identify the evidence’s scope. |
| 6. Captions and labels | pass | Both four-state filter branches, geometry disclosure and all recall rows identify eligibility, counts and the absence of semantic evidence. |
| 7. One piece | pass | Exact filtered membership precedes approximate retrieval, representation lifecycle and human usefulness; no late passage breaks that progression. |

Whole-article judgement: can sit beside the references. The empty result from filtering after LIMIT establishes a query-set error before approximation appears. The 20-row/50% recall result then demonstrates a different failure with a fixed baseline. The final two evaluation sets follow naturally from that distinction. No findings.

## Limits

This is initial article coverage, not the independent final complete reading and not corpus credit. It makes an editorial judgement, not a certification of PostgreSQL/Citus/pgvector mechanics, timings, download saving or accessibility.

CUA reading used 1280×720/System. A disappearing 4350 reference listener first produced unstyled Storage attempts; root restored it, and all ten styled drawings were then studied successfully before articles. Later concurrent IAB activation caused 0-width/control errors. Root paused other browser actors and authorised a supported 1280×720 viewport override; successful normal screenshots and control states were then obtained. r55/r56 outstanding media were completed after recovery. Failed observations were not counted and are not article defects. No article build or contents were changed.

Final exposure audit: recovered r40’s complete alternate keep-waiting branch, including its distinct fourth-step explanation, and r42’s corrected-helper initial state. No judgement changed. Explicit viewport override reset afterwards; actual 1280×720/System and a native screenshot verified. Successful study/audit tabs 2 and 3 closed. The original failed reference tab 1 remains trapped on a connection-refused dataURL: supported close and safe known-reference navigation are both rejected by CUA’s current-URL policy. This cleanup limitation does not affect the completed reading; no bypass was attempted.
