# Teaching review · article mode · r31, r32, r33, r34, r35, r57 · batch08-v01

Inputs read: [fixed manifest](v01/manifest.json) and teaching restrictions; frozen briefs and each bounded plan RL110, RL111, RL112, RL113, RL114 and specialist-extensions in full, including relevant neighbour/child boundaries. Commission and canonical example hashes match the earlier completed readings (example matches batch07). Full rendered pieces at http://127.0.0.1:4482/review/relational-collection/postgresql/{architecture,row-versions,indexes,query-execution,json,extensions}/, all explanatory disclosures and final Sources outside the article.

Highest severity: none

## Calibration


This coherent 25-piece assignment calibrated once against all three fixed references in full. The helper `scripts/read-writing-reference.py` delivered exactly 19 separate bounded text outputs: sequences 1–6, indexes 1–7, storage 1–6. Every individual call had a 5,000-token output budget and its END marker was read; none was clipped. Complete-text SHA256: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Separate rendered study at http://127.0.0.1:4350/review/examples/ covered all 34 drawings and their explanations: sequences figures 1–13, indexes 1–11, storage 1–10. Actual changing/completed states were inspected. A mispositioned tall screenshot crop was recovered with bounded crops; the long crowded sequence drawing's lower portion was read separately. No global viewport or theme changes. Root received the complete calibration report for public-output audit. The comparison standard is explanatory progression through concrete changing state, controlled variations and awkward cases, and practical judgement supported by the mechanism, with illustrative/observed boundaries explicit.

## r31 · PostgreSQL processes, pages and row versions

Entry: General row versions, indexes and WAL.

Whole article: The request route ties processes, shared pages, physical address and snapshot visibility together. HOT then answers the surprising index-address question introduced at the start, without turning the architecture piece into a maintenance manual.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Backend, shared buffers, line pointer, tuple, ctid/xmin/xmax, private operation memory and HOT conditions have local meaning; the entry supplies basic index/WAL concepts. |
| 2. Order | pass | Connection/process → lookup/address → shared/private work → visibility → HOT variants → wide values/background cleanup. |
| 3. Examples | pass | P7 lookup and explicit scratch update carry old/new snapshots and all three HOT cases; product versus physical identity stays clear. |
| 4. Showing | pass | Process/cache lookup diagram, observed reader/address table and complete HOT-case alternative show what the index locates and what changes. |
| 5. Judgement | pass | Reader can trace the request, avoid treating buffer reads as drive reads or ctid as identity, and identify the specific reason HOT is unavailable. |
| 6. Gradual exposure | pass | Architecture-level explanation answers first; vacuum age, durable write ordering and operational waits are handed to named owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r32 · PostgreSQL vacuum and transaction age

Entry: PostgreSQL tuple layout and general cleanup.

Whole article: Vacuum’s separate jobs are developed from one retained version into space, visibility and finite-ID safety. The final evidence-to-maintenance table is supported by the earlier causal distinctions.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Safe horizon, two visibility bits, freezing, relfrozenxid age and multixact age are explained before diagnostic conclusions; session/slot retention scopes are distinguished. |
| 2. Order | pass | Retained tuple → reuse/visibility/statistics → age safety → actual horizon holders → maintenance capacity → chosen remaining work. |
| 3. Examples | pass | Scratch P7 report/update carries failed versus successful cleanup; one-page covering read supplies heap-fetch contrast; quiet-table age is the awkward non-churn case. |
| 4. Showing | pass | Three-state horizon drawing, measured dead/all-visible/heap-fetch table, age/horizon queries and maintenance decision table expose the changing boundaries. |
| 5. Judgement | pass | Reader can distinguish retention from insufficient maintenance, visibility from freezing and tuple-age from WAL retention, then choose an appropriate next investigation. |
| 6. Gradual exposure | pass | Local explanation is sufficient to select maintenance; risky incident intervention and index/schema rewrite execution stay with their owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r33 · PostgreSQL index methods and operators

Entry: General index mechanics, plans and typed values.

Whole article: Operators, stored representation and actual candidate work remain one argument. The tiny inverted index and ordered/mixed BRIN cases give the abstract method names practical meaning.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Access method and operator class are defined and differentiated; containment, summaries, candidates and rechecks are explained before interpreting plans. |
| 2. Order | pass | Whole-value versus element operation → operator-class contract → specialised frameworks → BRIN state → native rechecks → write costs. |
| 3. Examples | pass | Tiny A/B/C tags carry element extraction and conjunction; fixed 50,000-row fixture carries B-tree/GIN and ordered/mixed BRIN comparisons. |
| 4. Showing | pass | Posting-list tables, BRIN candidate figure, native plan extract and same-answer recheck table show why equal index size can hide unequal heap work. |
| 5. Judgement | pass | Reader can select by supported operator/class, assess candidate and recheck work, and balance read savings against maintenance. |
| 6. Gradual exposure | pass | Provides general method selection, then hands linguistic ranking, approximate recall, range/spatial semantics and live lifecycle operations to specialists. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r34 · Reading and repairing PostgreSQL plans

Entry: General execution plans and PostgreSQL storage/index methods.

Whole article: One skewed workload separates estimation, access-path and parameter-knowledge problems. Each repair predicts a different observable effect and preserves the answer; counter scope is explained before arithmetic is used.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | EXPLAIN ANALYZE versus statistics ANALYZE, row/loop/buffer scopes, custom/generic planning and partial-index proof are explained locally. |
| 2. Order | pass | Actual query/environment → counter scope → first estimate error → access mismatch → parameter proof → both sides of skew → remaining work. |
| 3. Examples | pass | 99,000 paid shop-10 and 1,000 pending shop-20 rows carry correlation, casts and prepared plans; counter arithmetic and paid/empty/common variants expose traps. |
| 4. Showing | pass | Hypothetical counter table, native count/access comparisons and three-route proof disclosure show the cause and changed work, not only preferred plan names. |
| 5. Judgement | pass | Reader can identify a cause, choose statistics versus access repair, inspect actual prepared context, verify answer and compare parameter/cache/concurrency conditions. |
| 6. Gradual exposure | pass | Plan-focused answer stays local; service waiting and native operations remain with the incident owner. Specialist join/memory follow-up is proportionate to the stated plan entry. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r35 · PostgreSQL JSON and structured alternatives

Entry: Row meaning, values and PostgreSQL index contracts.

Whole article: Representation, absence, validation, indexed operation and update boundary build coherently. The stale-document case gives a concrete reason why convenient path syntax does not establish independent concurrency.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | JSONB versus JSON, extraction operators, existence, null variants, shape checks and jsonb_set are explained before use. |
| 2. Order | pass | Fact boundary → physical/text representation → absence distinctions → shape rule → index operation → update ownership → migration. |
| 3. Examples | pass | Declared P7/P3/P9 attributes carry valid representation; anonymous missing/null/wrong-type and stale left/right documents carry awkward cases without changing shop history. |
| 4. Showing | pass | Representation and extraction tables, validation SQL and rejected shapes, observed route table and stale/current-input update figure show all key distinctions. |
| 5. Judgement | pass | Reader can choose columns/rows/documents, validate relied-on shape, select query/index contracts and prevent stale replacements under an explicit protocol. |
| 6. Gradual exposure | pass | Answers JSON boundaries locally; cross-row enforcement, general index details and live migration retain their own owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r57 · Types and extensions in PostgreSQL

Entry: Typed values, constraints and PostgreSQL operator/index contracts.

Whole article: Independent room and spatial examples are connected by one question: which type/operator/index contract must survive deployment and restore? The operational half follows from dependencies introduced at the outset.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Range endpoint notation, overlap, exclusion, geometry/geography units, SRID labelling versus transformation and extension’s two installation layers are locally explained. |
| 2. Order | pass | Type meaning → interval contract → concurrent exclusion → spatial units/candidates → installation → restore → upgrade/removal dependencies. |
| 3. Examples | pass | R1 adjacency/conflict and R2 overlap supply boundary cases; A/B/C/D grid points distinguish bounding candidates from exact distance, with explicit anonymous geography limits. |
| 4. Showing | pass | Half-open interval SQL/figure and two-connection outcome, spatial candidate figure/filtered plan and dependency-refusal example show more than a successful API call. |
| 5. Judgement | pass | Reader can choose precise interval/spatial semantics, enforce the stated room rule, prepare restored dependencies and avoid treating CASCADE as a migration. |
| 6. Gradual exposure | pass | Core type/extension lifecycle is answered here; vector retrieval, privileged code and server-major upgrade procedures remain with their specialist owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## Limits

Fresh independent initial teaching perspective only, for the exact first-return versions named above. This is not corpus, final complete or any other perspective coverage. Source, mechanical/native receipts, writer notes, earlier reports/decisions and later versions were withheld. No builds, article edits, downloads or publication. Complete rendered text, all explanatory disclosures and final Sources outside the article were read. No claim of independent native execution or production verification. No global viewport/theme changes.
