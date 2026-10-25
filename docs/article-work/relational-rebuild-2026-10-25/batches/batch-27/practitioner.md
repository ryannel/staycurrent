# Practitioner review — pg-json v01

Reviewed 26 October 2026. Independent first review of the frozen batch-27 version at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/json/`. No article edits, delegation or publication.

## Finding

**Medium — Figure 4 gives containment an “anywhere” meaning.** In `src/components/relational-rebuild-pg-json/JsonFigures.astro:58`, the rendered first box says “Fragment anywhere in the document” above `doc @> '{"tags":["gift"]}'::jsonb`. That predicate preserves the operand's nesting: a document whose only matching tags are under `{"description":{"tags":["gift"]}}` does not satisfy this operand. A reader using the figure to choose a search can reasonably infer a recursive search and miss documents, or misunderstand why the earlier nesting-preserving operand matters. The surrounding prose correctly discusses whole-document indexing; the box should preserve the distinction between the index's coverage of the document and the predicate's required structure. Evidence: PostgreSQL 18 [JSON types, containment and existence](https://www.postgresql.org/docs/18/datatype-json.html#JSON-CONTAINMENT), especially its false `{"foo":{"bar":"baz"}} @> {"bar":"baz"}` example and structure-matching rule. Confirmed in the current desktop rendering. A bounded label repair is sufficient.

## Coverage

Read the article, supplied plan, prerequisite and neighbouring ownership, incoming responsibility, original shared-example snapshot and current applicable facts. The progression from alternative detail homes through type-preserving extraction, guarded constraints, predicates, index expressions, updates and promotion fulfils the brief. It preserves P3/Japan, P7/300 ml, independent gift/ceramic memberships and order 103's agreed prices and 29.00 total. Local probes and the 330 ml/care variations are clearly separate. General modelling, NULL semantics, access-method machinery, concurrency protocols and migration procedures remain with their owners.

Checked consequential claims against PostgreSQL 18 documentation: [JSON types](https://www.postgresql.org/docs/18/datatype-json.html), [JSON functions](https://www.postgresql.org/docs/18/functions-json.html), [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [expression evaluation](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL), [arrays](https://www.postgresql.org/docs/18/arrays.html), [composites](https://www.postgresql.org/docs/18/rowtypes.html), [expression indexes](https://www.postgresql.org/docs/18/indexes-expressional.html), [HOT](https://www.postgresql.org/docs/18/storage-hot.html) and [row locks](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS). No other substantive technical or prerequisite-depth finding.

Inspected the verifier and its completed/closed receipt: 13 exact SQL panels and 61 recorded checks in PGlite 0.5.8, reporting PostgreSQL 18.3/WebAssembly. The article and figure hashes match both the review manifest and execution receipt; metadata matches the manifest. Original shared-example hash is `44656a905fac8edd2306a441e32bb91f54d7e250efaecc1b80e5c4049cd13d31`; verifier hash is `0f3fc76f3a6c1b8b438042c2e886927acdc234cc4e8fef9a20669b6352c2fcbc`. Reused that evidence without rerunning it.

In an owned IAB tab at actual 1280 × 720, resolved dark/System theme, checked all seven extraction inputs at the contract stage and all four predicate questions against the recorded semantics. Inspected the index map and conceptual update schedule. Calibrated bounded source passages and rendered drawings against Indexes' range scan, Storage's page explanation and Sequences' ordering example.

## Limits

This is practitioner coverage, with relevant teaching/editorial/figure checks; the independent reader owns the full phone/theme, playback and keyboard matrix. Kept the existing viewport and theme as coordinated. No fresh SQL execution, native server plans, timings, physical-write measurement or overlapping-session test. The article accurately identifies its figures and schedule as illustrative and its execution as WASM; the sequential update receipt is not concurrency evidence. Root owns build, integration and acceptance.

