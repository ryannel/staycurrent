# Practitioner review · article mode · batch08 · v01

Inputs read: [exact frozen manifest](v01/manifest.json), all complete article sources for r31, r32, r33, r34, r35, r57, their relevant components/model scripts, native verifiers/downloads, imported fixture data, mechanical observations and [applicability](v01/mechanical/applicability.md). Read the commission, shared example, per-piece briefs and individually bounded parent/sibling/child plans; identical context hashes already read in this assignment were reused. Read every final Sources/disclosure, including material outside the article body. Current exact preview: `http://127.0.0.1:4482/review/relational-collection/` and each manifest brief's assigned article route. Current review skill and practitioner perspective only. Author quality notes, history, earlier versions and peer findings were withheld.

Highest severity: none.

Independent INITIAL article coverage only; this is not final complete or corpus review.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r31 | 1. Correctness | pass | Backend/shared buffers/private work, page line pointers, ctid/xmin/xmax, snapshot visibility, both ordinary-index HOT conditions and BRIN exception are correct. |
| r31 | 2. Evidence | pass | Raw pageinspect output supports held/fresh prices and all three HOT cases. Drawing selects an index route rather than claiming a natural tiny-table plan. |
| r31 | 3. Coverage | pass | Traces request-to-heap/index, shared cache, unchanged PK maintenance, full-page failure of HOT, wide values and background responsibilities. |
| r31 | 4. Depth, both ways | pass | Enough physical understanding for native investigation; avoids making tuple addresses business identity or a cache miss a disk operation. |
| r31 | 5. Ownership | pass | Owns PostgreSQL process/page route; detailed vacuum, WAL operations and incident tooling stay r32/r36/r41. |
| r32 | 1. Correctness | pass | Vacuum eligibility, reusable space, two visibility bits, finite-XID freezing, multixacts and separate WAL/xmin horizons are accurate. |
| r32 | 2. Evidence | pass | One-page native counts show held1dead/0visible/2heap-fetches, then0dead/1visible/0fetches. Forced path and no wraparound incident are disclosed. |
| r32 | 3. Coverage | pass | Includes session/prepared/slot/feedback holders, all databases/catalogues, maintenance backlog, worker costs, anti-wraparound urgency and rewrite choice. |
| r32 | 4. Depth, both ways | pass | Separates diagnosis from settings; no missing decision-critical horizon/age understanding or unnecessary implementation derivation found. |
| r32 | 5. Ownership | pass | Owns vacuum/age, with index lifecycle and incident intervention left to r40/r41. |
| r33 | 1. Correctness | pass | Method/class/operator contract, GIN posting search, class-specific GiST/SPGiST, lossy BRIN and recheck-condition limits are correct. |
| r33 | 2. Evidence | pass | 50k-row worksheet/raw plans support500GIN hits and BRIN4/40candidate blocks with170/1790rejections; toy16-value model is labelled. |
| r33 | 3. Coverage | pass | Covers supported operators/types/collation, physical correlation/granularity, unsummarised ranges, pending-list writes and full-route cost. |
| r33 | 4. Depth, both ways | pass | Explains why an existing index is insufficient without drifting into each specialist semantic domain. No material depth defect found. |
| r33 | 5. Ownership | pass | Owns access-method choice; JSON representation, text/vector relevance, range/spatial contracts and index operations retain separate owners. |
| r34 | 1. Correctness | pass | Rows/loops/times versus accumulated inclusive buffers, partial consumption, joint statistics, casts, partial-index proof and forced cache modes are accurate. |
| r34 | 2. Evidence | pass | Raw worksheet output matches10→977estimate,500→960cast estimate,2048→25accesses,3accesspending route, ten heap fetches and IDs99001–99010. |
| r34 | 3. Coverage | pass | Includes query/parameter/session capture, first estimate error, knowledge versus access path, rare/common/empty values and spill/worker costs. |
| r34 | 4. Depth, both ways | pass | Enough practical plan repair to predict changed work; does not make forced generic mode a natural automatic outcome or timings a production ratio. |
| r34 | 5. Ownership | pass | Owns PostgreSQL execution repair, preserving general incident selection and CockroachDB work as separate scopes. |
| r35 | 1. Correctness | pass | JSON/jsonb representation, missing/JSON-null/SQL-NULL, NOT NULL plus guarded CHECK, operator class and row-update semantics are correct. |
| r35 | 2. Evidence | pass | Exact temporary worksheet proves extraction, rejected shapes,500matches/index routes and sequential stale replacement. Concurrent waits are explicitly not measured. |
| r35 | 3. Coverage | pass | Covers typed facts versus documents, raw-byte retention, unknown keys, reference limits, scalar/GIN choices, row contention and migration authority. |
| r35 | 4. Depth, both ways | pass | Enough validation and update detail for a deliberate document boundary; no unearned depth or missing consequential case found. |
| r35 | 5. Ownership | pass | Owns JSON representation/search/update judgement; integrity, live migration and text retrieval remain linked owner scopes. |
| r57 | 1. Correctness | pass | Finite half-open interval contract, same-room exclusion, PostGIS grid units/bounding candidates and extension package/database/dependency layers are accurate. |
| r57 | 2. Evidence | pass | Native ranges, actual two-connection conflict, PostGIS plan and same-host dump/restore support stated observations; no geographic/upgrade result invented. |
| r57 | 3. Coverage | pass | Includes empty/infinite intervals, race without preflight safety, native dependencies, privilege/schema paths, restore libraries, updates and non-casual removal. |
| r57 | 4. Depth, both ways | pass | Type/operator meaning and lifecycle both earn their space; range rule is not misrepresented as capacity>1 or arbitrary scheduling protection. |
| r57 | 5. Ownership | pass | Owns specialised types/extension lifecycle; vector retrieval, server upgrade and privileged-code mechanics retain their owners. |

## Evidence and applicability

All manifest-listed bytes and each applicable mechanical source/verifier hash were independently compared with the frozen packet, with no mismatch; see [hash audit](../practitioner-working-v01/hash-applicability.json). This includes fixtures/imported data and model code, not just prose. Current actual download-href HTTP bytes were independently fetched with bounded reads and compared with frozen files; all matched ([HTTP evidence](../practitioner-working-v01/current-http.json)). No browser download-event/path/save API was used and actual saving is unverified.

Native results below are reused author observations. Their exact source, data, version, environment, verifier and acceptance queries were inspected; no success flag was treated as an independent verdict. No unresolved technical hypothesis required another native run, so no ceremonial native rerun was performed. No reviewer-owned PostgreSQL instance was started. These records do not measure production throughput, geographic latency, power loss or independent physical failure domains.

Exact `verify.py` controllers and, where offered, complete SQL worksheets were read. All use PostgreSQL18.6 Homebrew/8kB pages, a generated private Unix socket with TCP disabled, inherited `PG*` removal and `SHOW data_directory` ownership before setup; stop/removal are confined to generated paths. r31 uses pageinspect and a retained Repeatable Read reader; tuple flags distinguish same-page HOT from same-page ordinary and moved-to-page1 updates. r32 uses pgstattuple/pg_visibility and deliberately discourages sequential scans for its covering route. r33/r35 use50,000 generated temporary rows; r34 uses100,000 with99,000paid-shop10/1,000pending-shop20 and explicit forced cache modes. All reported plan counts/estimates and result identities were compared with raw output, not inferred from index existence. Diagnostic settings are reset in the worksheets.

r57 uses btree_gist1.8, PostGIS3.6.4, GEOS3.15.0, PROJ9.9.0 with network disabled. Its verifier observes a transactionid wait then23P01 after the first reservation commits, confirms one survivor, and dumps/restores into another database on that same private instance. The spatial plan returns A at500grid metres and filters D at989.95; it is a local SRID0 model, not geography. The restored predicate and exclusion refusal are checked. This is no extension or server upgrade test.

Current rendered use read every figure, walked all three HOT modes through pruning/cleanup, compared ordered/mixed BRIN5–6 (4versus16candidates for2matches), selected all three prepared-plan contexts and all reservation proposals. Static vacuum, JSON boundary and spatial examples were read in current rendering. Controls and prose match the native/model contracts.

## Primary sources checked

- PostgreSQL18 [HOT](https://www.postgresql.org/docs/18/storage-hot.html), [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html): physical/version mechanics, pruning and retained/freezing horizons.
- [BRIN](https://www.postgresql.org/docs/18/brin.html) and [JSON types/indexing](https://www.postgresql.org/docs/18/datatype-json.html): summary candidates, maintenance and class-specific search.
- [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [CREATE STATISTICS](https://www.postgresql.org/docs/18/sql-createstatistics.html), [partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html): row/buffer scopes, expression/joint estimates, join-estimation limitation and predicate proof.
- [Range types/exclusion](https://www.postgresql.org/docs/18/rangetypes.html), [CREATE EXTENSION](https://www.postgresql.org/docs/18/sql-createextension.html) and [PostGIS ST_DWithin](https://postgis.net/docs/ST_DWithin.html): interval rules, supporting-file/trusted-install boundaries and indexed distance units.

## Findings

None. No practitioner finding number allocated.

## Limits

Native receipts are reused observations, not fresh reviewer execution. No production capacity, WAN timing, external effect, independent storage/power boundary or user-relevance result is accepted from these fixtures. Installed capability alone establishes neither a successful experiment nor production acceptance. Actual browser saving is unverified. No build, article edit, publication or global machine setting was performed. The report does not replace independent teaching, editorial, visual, final-complete or corpus coverage.
