# Final confirmation: PostgreSQL and eight core articles

Completed 30 October 2026. This independent confirmation covers seventeen PostgreSQL
articles and the eight coordinator-owned core articles: twenty-five complete reads.
None was repaired by this reader. No author repair notes or earlier verdicts were
consulted before forming these judgements. No source edits, builds or agents were
used for this confirmation.

## Method and judgement

Each reading used the actual built prose-only export in
`/tmp/staycurrent-rendered-prose/relational--<key>.txt`, not a source approximation.
The export removes complete figures, including captions and controls, standalone
image containers, SVG and page navigation. Actual rendered SQL, other code and
ordinary textual tables remain. All twenty-five exports were read to their END
markers. Two initially clipped reads were recovered in full. A temporary display
helper removed only syntax-colour span/code markup and decoded HTML entities;
it preserved every prose paragraph, SQL value, code line and ordinary table.

The review tests explanation for an intelligent newcomer moving towards practice:
necessary premises, causal steps, results, limitations, consistent identities and
readable connections must remain after complete visual removal. It does not
require every native counter to be repeated in prose when the article retains
an ordinary evidence table or code listing. It is not a fresh native execution
or a general unrelated accuracy audit.

The completed reads found two focused remaining issues, both now corrected and
confirmed in source context below. The other twenty-three articles pass without
a substantive finding. With those bounded corrections, all twenty-five pass
the prose-independence confirmation. The coordinator owns the final rebuild and
rendered-export reconciliation for the two corrected passages.

## Findings and bounded confirmations

1. **pg-distribution — Foreign tables and remote work**, paragraph beginning
   “A second native query joins S’s orders and lines”: the export said the remote
   totals returned “before C’s sort”. It introduced remote S but never identified
   C as the querying server; earlier C named Edda’s customer group. The reader
   could therefore confuse the execution location with a customer shard. The
   coordinator replaced it with “before the querying server’s local sort” and
   removed the other C reference. I confirmed the corrected paragraph against
   the retained Remote SQL and following pushdown explanation. The undefined
   actor is resolved; no wider reread was necessary.

2. **query-results — Combining result rows with UNION**, ordinary comparison-table
   caption: “Paid-order IDs: 1, 2 · pending-order IDs: 1” misnamed the projected
   customer IDs as order IDs. The actual orders are 101/102/103. This contradicted
   the result-grain distinction being taught. The coordinator changed the caption
   to “Customer IDs from paid orders: 1, 2 · from pending orders: 1”. I confirmed
   it against the surrounding customer-list introduction, SQL label and body’s
   explicit customer-versus-order identities. The mismatch is resolved.

No substantive explanation gap remains identified in the assigned articles.

## Complete per-article coverage

Every entry below records a full built-export read, including code, tables,
evidence limits and sources, with its END marker reached.

### relational-introduction — Pass

Definitions develop tables/keys, NULL, joins, atomic purchase, guarded concurrent subtraction, connection and durability without illustrations. The before/after103 stock, pending/no-payment state and query outputs are explicitly stated; physical and distributed work remain distinct.

### data-modelling — Pass

Row grain, candidate/composite keys and participation precede complete ternary, anomaly and lossless-split examples. Current/agreed prices and independent membership versus actual offer policies are explicit; no diagram supplies the counterexample or repair.

### normalisation — Pass

The body states declared FDs, closure steps, all adviser keys, complete chase symbols/merges, BCNF enforcement trade and 3NF synthesis. MVD/JD counterexamples and higher-form assumptions are supplied directly; the formal reasoning survives complete visual removal.

### hierarchies — Pass

All five category identities and initial parentage are established. Recursive results, move/cycle protection, paths, closure pairs and nested bounds have explicit inputs and derived counts. DAG node/path semantics and protected rebuild authority remain coherent with retained SQL alone.

### values — Pass

Numeric conversion/rounding, Stockholm calendar arithmetic, text comparisons and package-weight NULL predicates provide their full inputs and outputs. Types, units, absence and operation-specific equality are explained independently; none depends on Figure children removed from the export.

### constraints — Pass

Required/check/unique/reference examples state both accepted and rejected changes. Composite tenant and room-overlap rules supply concrete mismatches and boundaries; the two-payment race states both decisions and forty-against-twenty-nine outcome before the transaction remedy.

### history — Pass

A1–A4 prices, effective boundaries, recording periods and both query instants are stated before their results. Corrected catalogue versus captured agreement, deletion scope and external/backup obligations are self-contained with explicit illustrative limits.

### query-results — Pass after bounded correction above

Join grain, four-way line/payment multiplication, safe aggregation, zero absent-summary policy and UNION occurrence semantics are explained completely. The reviewed export’s ordinary-table caption misnamed customer IDs as order IDs; the bounded correction above resolves it.

### pg-architecture — Pass

Complete backend→plan→buffer→heap/index→snapshot→write/cleanup explanation. Invented TIDs and HOT chain are introduced in body, both readers and price outcomes established; buffer hits, visibility and durability remain distinct without figures.

### pg-vacuum — Pass

The retained-report case supplies snapshot setup and both cleanup outcomes. Reusable space, visibility maps, freezing/XID/MultiXact age and trigger arithmetic are independently defined, with maintenance evidence and acceptance conditions tied to the right obligation.

### pg-indexes — Pass

Every access method states what information it retains and which operator it can prove. Concrete GIN equality recheck, four-point search, half-open reservation and sorted/mixed BRIN cases establish inputs and outcomes; native work limits remain explicit.

### pg-plans — Pass

Native SQL, excerpt and exact row/loop/buffer counts are retained as textual evidence. Estimation, index, rewrite, spill and prepared-plan examples each state the change and observed limit; no omitted diagram supplies a required counter or causal step.

### pg-json — Pass

Typed-detail/JSON alternatives, missing/SQL-null/JSON-null and safe validation are fully established. Diagnostic tags, response shape and stale-client update all state concrete inputs and outcomes; index operator limits do not rely on a picture.

### pg-wal — Pass

Inserted/written/flushed positions, checkpoint redo boundary and asynchronous acknowledgement are explained through body-defined schedules. Native restart states distinguish acknowledged P7 from unfinished P9 and process stop from power loss; no diagram-only stage remains.

### pg-backup — Pass

Base/consistency WAL/later archive dependencies and the named restore cut are established in body. Actual paused/gap outcomes and payment reconciliation retain distinct database/provider effects and acceptance facts; the recovery path remains complete without figures.

### pg-replication — Pass

A and B, U/C and retained-versus-replayed outcomes are established in prose before settings and promotion. Fresh read, required history, fencing, promotion and fresh-copy/rewind return are connected without pictures; native scope is explicit.

### pg-logical-replication — Pass

Publication/subscription/slot and replica identity precede a complete two-side setup. Snapshot/stream alignment, price-filter membership, incompatible schema and duplicate-target repair each state inputs and results; progress and authority limits remain independent.

### pg-schema-change — Pass

Lock queue, current-row price race, constraint installation/validation and index readiness/validity each explain causal setup and resulting state. Maintenance and return boundaries remain connected without visual transitions; native versus documentation evidence is explicit.

### pg-operations — Pass

Request/pool/backend boundaries and H/W’s exact conflicting table locks are introduced before cancellation reasoning. Native outcomes establish which intervention ends which dependency; demand, storage and deadline examples state their own units and inputs.

### pg-access — Pass

Tenant population, freely settable runtime context and protected support mapping are explicit independent trust arrangements. Grants/RLS/view/definer examples supply effective identities, expected rows and bypass limits; SQL and counterexamples carry the complete access explanation.

### pg-upgrades — Pass

Initial shop state, transfer choices and source-closure/final-history acceptance lead coherently to target-only22.00 and the closed simple-return route. Link-mode boundary and sequence/collation/stream limits are explained in text rather than pictures.

### pg-distribution — Pass after bounded correction above

The reviewed export’s FDW remote-aggregate paragraph named an undefined querying server C after earlier C named Edda’s customer group; the bounded correction above resolves it. All other routing, co-location, fan-out and gate examples stand alone.

### pg-text — Pass

Token positions, prepared queries, phrase gaps and GIN rechecks are explained with retained SQL/results. Full product document/stock inputs precede weighted ranks and top-k eligibility; representation refresh and quality/cost checks are independent.

### pg-vector — Pass

Query/product coordinates and each metric are explicit. HNSW detour and IVFFlat boundary examples introduce complete chosen distances; stock/global-top-k and filtered ANN shortfalls are distinct, with exact baseline, recall denominator and native limits explained in prose.

### pg-extensions — Pass

Reservation7001 and independent overlaps/touching attempts establish the rule before btree_gist dependency. Coordinate/distance candidate arithmetic, extension files versus objects and restore/update/drop outcomes are all explicit outside illustrations.

## Fixed version and hashes

The [captured manifest](confirmation-pg-core-eight-manifest.json) contains each
actual export path, route, source path, complete source/rendered/text SHA-256
values and removed-media counts from the current exporter manifest. Every
export file’s bytes were verified against its manifest text hash. The source
and rendered hashes identify the built version fully read; the manifest also
records each current source hash after the two bounded corrections. Those
corrections do not retrospectively change the built version reviewed. The
coordinator can reconcile their new rendered hashes without repeating unaffected
full-article checks.

In the table, “export SHA-256” is the actual text-file hash; syntax-colour markup
removal was only a display transformation and does not change this recorded hash.

| Article | Built source SHA-256 | Export SHA-256 |
| --- | --- | --- |
| relational-introduction | `9b6d4dab04ebe37830da426c43616cd959b74169acd604fb77424ae1a5c939f1` | `56804161d24127d3fc2c0c04680fcbc618b90f18a96cdd1f5d7ac9ed92048376` |
| data-modelling | `ff73cd8a995f3607800d738a6519f152a879c75455591ccdef33c9b2519e6a1c` | `69a69553b8acc489a0b10b5a06b561b9d9354e6e3db7758aee824c3e52c443fc` |
| normalisation | `ff106ba39a8368a75773776e1114a6385fe505659b88070559f8d785da254ddc` | `a8d5424190a6ba15ae4299a0146052bb1638ba63ec17079d44d6c736c20cfb6f` |
| hierarchies | `f8d5c6a09d9c3ed4340e90d90dae657b31a7b119ddbdaccb848d8319b28ff115` | `c15b1d7578748843ce673f4c57b0b927569c1949985c3ffa40e6465d9f84c945` |
| values | `6fc5d9b2dfc30a2c783c23ca219d0905b1e2de151c46ab0e28c672e23a903743` | `f92875ae9770a4dbb3eb8a2e98cdc9bd301208fe43f4b3ca67951358e3aa6fd7` |
| constraints | `4694ce78bcfdd83bb3146d96b3f6ec9b0026ce74b6a6bfab90de2738032582c3` | `5db50a5c8a5b346c14d097e77ea9acf3e83ae5a31b30de8b76d77405476e685a` |
| history | `c30807502e2fa31ff495c32a7ca64547a17e343fbeb5568418f73c827fe7a9cc` | `a00d1f7c186c9106b7687e3679171071f76aa7328fe15719afdb1ca0f5353675` |
| query-results | `0bc3d983ccdff68e24b513240776d04cafd1b67b88852969b77052507dd06bd4` | `28eafec9993e899cbdb8b63b44747e1abe248c9225c03cfecb9e4a5cc7f1f584` |
| pg-architecture | `b97a9eb4ed6b84ed5f959a6192aad9a1f40d478ff3862e83825b1908c3a7bd89` | `b7056cfe47366f3ad0f45bed6d6bfb7a7dda52990fc9ab2db23fbe74b75be8b0` |
| pg-vacuum | `5f963b137bc72c9a7c81d7de4fc80496ad53f34486faac6a639e52b3b0943e66` | `135d308d73a4f2a2969ffafa4e2a34fbdb2633cb7c8ae6847b9a6bccfab78a94` |
| pg-indexes | `ac21d7529ec0fae77019aee573ab1530ad2cc840f3ca4fe3cdf093c24bef0b13` | `3713c2188b32554e71849f0667b95fd010f77f4af88666afcb5120b04a023111` |
| pg-plans | `c0f255e193eef6fbb311110760a4fa9fd3365aeaa748388f8a7d6c2c3446ce49` | `1f4f5d90e1b8b4245d977cc324c1b25fe504876328814924c26d360e80d9aea0` |
| pg-json | `cf38e09c48d131ea9cbcb0c83a5dbf002d4a542d83a0f19021068f2093ac4025` | `947b5ce8a8266817ba9088bac7a2af17a39cba55261408b684171ad22dfb89b7` |
| pg-wal | `c2c65a1919c73b2221e2c86870e4116d9bd181ce483b33f6939bd082e70e5f63` | `8a2fbabdd9e1a069185c9e026b05a391062faab5f1e14dca90e394be65c9271c` |
| pg-backup | `c2e83b2f1e1577b834ae556b235377495199f27c25f18cf942da03cfac81fb39` | `17c9df9351186ef7712b2b4580e108fdde212088c1017d488ea30017904a8410` |
| pg-replication | `1fa92ad54203a62080325840afd2f7a941086cc4b2ad10e8502c0161d47465c3` | `b6727e6263c71ac27628e4647a48a583cc5ca31540e72a582bac717356eb2bb7` |
| pg-logical-replication | `9ebc78c18e4f9816a6ae92406256e09cfbb16e6c6c1195de2b820b8052a2448b` | `78919ba4a9e0705f8a2de89ee9c34d12cf31c16f420ad48c8af39d179ede372e` |
| pg-schema-change | `82d4d19b600c6c236a41f41d7c34ef75a2b9ab2fb4126bf01d813cdcc6c0adb4` | `7ee7580a723e4652beb459439e33692a68c0491d221a71031c539e6ad4aeee4a` |
| pg-operations | `39970a24f0199c1c55e99880f4b1ac89785cc8adff169fb1ef2449db66e6573a` | `11de5b00b9f296bd2f87688ac157820945c735704ba696af7526dfbba603182d` |
| pg-access | `064619581b68114699f73b68c676fe10ae59d9015ecb2f55a2c703d4cd16a714` | `df2c39eff67bc050f99d53fafb3b38d01787dc077354848900e5a336879eb973` |
| pg-upgrades | `9d65b71556827a5101f60ff49c06795096d800f4f009d5c4caf0ea4945e9bb04` | `3a756d51c29f8006f05f28c3ea51c001ba6a3cea4b59bfad423c4501a1e48099` |
| pg-distribution | `75a3b8a72fec29e8b4440723a622e0e84a808044cf571d29f2715bec4f9fdfd2` | `4e8eb2a76b11c0c782583bf78cb97a4edb0d17f2c1438810acd3647eb64792c9` |
| pg-text | `8ea617fd9efd69acfc2e7194f14cd90479e9a01bf6abb7d83c793e0184d5e835` | `ad6496364233e9212df19fc63c84fbd5c345fe172f279119a2e0441c6f62d453` |
| pg-vector | `a5021f4d67ff196816c964243cadeba3cdd1d2f8c3c45588da506aceccf5ef2c` | `0e9e74609d14fbb95bc889a90600c7b117edce1c9fae32e456240980704d7a28` |
| pg-extensions | `402c8010851901bf07c5fc80525c7ae913c591c9f7e8962310c93ed6d3950ae5` | `5b29ed0aa076acc5b5c3c5d5a5218915afd601315d78b6500faf2dd5726041ee` |

Bounded corrections confirmed against current source:

- `src/articles/relational-rebuild/query-results.astro`: `f479bd4c67735e67ba102b1576a52573f12d6ed4a2a3a95b7e399a77b382d0dc`.
- `src/articles/relational-rebuild/pg-distribution.astro`: `32ae6c6ec9d7d6c2270d251a9c2da48345a62461bda1e632316fef8530f19cf2`.

## Limits retained

The confirmation retains every article’s distinction between conceptual examples
and observed execution: single-node or one-host fixtures do not establish
production capacity, independent failure domains or external outcomes. Fixed
example identities, prices, stock, line values, snapshot choices and query
multiplicity remain coherent across these twenty-five readings. Supported
prerequisite links remain useful extensions; none of the confirmed local
explanations needs a removed diagram to supply its next causal step.
