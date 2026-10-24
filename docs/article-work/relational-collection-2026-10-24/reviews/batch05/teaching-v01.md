# Teaching review · article mode · r22 and r25 · batch05-v01

Inputs read: [fixed manifest](v01/manifest.json), its teaching input restrictions and identity; frozen `context/commission.md`, `context/example.md`, `context/briefs.json`; bounded RL100 and RL104 nodes of the frozen tree, including their child plans, and prerequisite/neighbour brief metadata. Complete rendered r22 at http://127.0.0.1:4418/review/relational-collection/schema-changes/ and r25 at http://127.0.0.1:4418/review/relational-collection/access-control/, including final Sources outside the article and each explanatory disclosure. Exact first-return version; later previews were not used.

Highest severity: none

## Calibration

This coherent 25-piece assignment calibrated once against all three fixed references in full. The helper `scripts/read-writing-reference.py` delivered exactly 19 separate bounded text outputs: sequences 1–6, indexes 1–7, storage 1–6. Every individual call had a 5,000-token output budget and its END marker was read; none was clipped. Complete-text SHA256: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Separate rendered study at http://127.0.0.1:4350/review/examples/ covered all 34 drawings and their explanations: sequences figures 1–13, indexes 1–11, storage 1–10. Actual changing/completed states were inspected. A mispositioned tall screenshot crop was recovered with bounded crops; the long crowded sequence drawing's lower portion was read separately. No global viewport or theme changes. Root received the complete calibration report for public-output audit. The comparison standard is explanatory progression through concrete changing state, controlled variations and awkward cases, and practical judgement supported by the mechanism, with illustrative/observed boundaries explicit.

## r22 · Live schema changes and backfills

Entry: constraints, application transactions and bulk changes. Whole article: coherent and sufficient for its promised general migration decisions. It begins with caller compatibility and authority, makes the race and late-row problem concrete, then earns final acceptance and contraction. The PostgreSQL bridge is enough implementation to make the protocol inspectable; deeper live-lock mechanics are handed to their owner after the general answer.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Backfill, trigger timing, NEW, NOT VALID and SKIP LOCKED are introduced with the property each supplies. |
| 2. Order | pass | Domain/equivalence precedes write authority; authority precedes filling; filling precedes acceptance and retirement. The hardest convergence argument gets the race, late row and separate final check. |
| 3. Examples | pass | The five original order lines carry conversion, incorrect saved values, a held row, late insertion and receipt acceptance; scratch variants are labelled. |
| 4. Showing | pass | Conversion and compatibility tables, competing edit figure, late-row state drawing and executable batch/acceptance SQL expose state and outcomes. All-steps disclosure read. |
| 5. Judgement | pass | Reader can choose the authority at each stage, distinguish progress from proof, stop under load, and identify the irreversible caller boundary. |
| 6. Gradual exposure | pass | High-level expand/migrate/contract answer arrives first; detailed engine locks/jobs remain with PostgreSQL/CockroachDB children. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r25 · Database access and least privilege

Entry: schema constraints, application connection ownership and tenants. Whole article: the task-to-authority argument holds together. The same catalogue task and two distinct P7 rows carry both successful work and attempted escapes. The reader learns why command grants, tenant identity and privileged exceptions are separate decisions before seeing acceptance tests.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Role/login/ownership, schema USAGE, PUBLIC, policy predicates and effective/session identity receive local explanations before the conclusions need them. |
| 2. Order | pass | Tasks → owner separation → object grants → false tenant context → trusted policy → explicit exceptions → acceptance and upkeep. |
| 3. Examples | pass | Shop 10 Blue mug versus shop 20 Copper mug makes spoofing observable; migration and support exceptions and positive/negative runtime tests exercise awkward paths. |
| 4. Showing | pass | Authority table, policy comparison, complete role/grant/policy examples and acceptance table show the actual boundary. Closed comparison explanation read. |
| 5. Judgement | pass | Reader can derive grants, identify who chooses the tenant context and test the real runtime connection, including inherited/privileged paths and future objects. |
| 6. Gradual exposure | pass | General authority model is answered locally; product-specific privileged routines and secure cluster operation are handed onward where detail is needed. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## Limits

Fresh independent initial teaching perspective only, across this batch's exact first-return versions; not corpus, final complete, practitioner, editorial or visual coverage. Source, mechanical/native receipts, writer notes, prior reports/decisions and later versions were withheld. No builds, article edits, downloads or publication. Rendered text and disclosures were read through Sources; scripted text alternatives were read without requiring exhaustive control playback. No optional unavailable neighbour was treated as compulsory finished reading. No claim that native experiments or production behaviour were independently verified.
