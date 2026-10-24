# Practitioner repair confirmation · article · r23/r24/r26/r32 · repair-batches07-08-v02

Inputs read: the [assignment](practitioner-confirmation-v02-assignment.txt), current `staycurrent-review` skill and practitioner perspective only; the exact [v02 manifest](v02/manifest.json), its four complete article sources, components, scripted state text, core data, audience, commission, example, briefs, relevant tree passages and parent/sibling/child plans; its mechanical records. All **124 manifest files matched their SHA-256 values**. No earlier article versions, author teaching notes, peer reports or earlier quality verdicts were read. Historical hash strings in the permitted mechanical receipts were used only to qualify identity.

This is an **informed repair confirmation**, with all five practitioner checks applied to each current piece, its additions, surrounding argument and affected dependencies. It is not blind initial coverage, a final complete practitioner review or corpus coverage. No delegation, product edits, build, publication or native rerun was performed.

Highest severity: none

## Exact rendered inputs

Read the complete current HTTP pages, including the final Sources, disclosures, text alternatives and script text outside the article body. Each response was byte-identical both to the 4538 author alias and to the named immutable output directory `/private/tmp/staycurrent-relational-repair07-08-v02-final-author`.

| Piece | Confirmation URL below `http://127.0.0.1:4540/review/relational-collection/` | HTTP bytes | SHA-256 |
| --- | --- | ---: | --- |
| r23 | `connections-and-capacity/` | 71,247 | `f59bfe6b7c79a4dba504fadcb751822adfc0b66172448ea5bbc8c0d5947fbd04` |
| r24 | `slow-queries/` | 73,083 | `e3156a719c0041fd13674557491a69b60a96535262a9b0a5f61bc24b516333d2` |
| r26 | `partitioning-and-sharding/` | 74,398 | `9c99f943288066d56c2a2ec114c96ba67bcd111d5c6c9cb31cc5c83ad3398ef2` |
| r32 | `postgresql/row-versions/` | 70,068 | `1af8f53c187854d96e4076aed212f800518f49bb6e56a2e26eaa8b33a9a51808` |

Focused reference calibration: Storage and durability’s row-version explanation/drawing and measurement disclosure (`storage.astro` 107–121, 352–356); Indexes’ covering-index/visibility explanation and figure description (`indexes.astro` 191–200); Sequence diagrams’ focused diagrams and explicit labels (`sequences.astro` 264–273). These calibrate explanation, limits and readable meaning at the repaired areas. No full three-reference calibration or unrelated r19/r34 reading was needed for this focused assignment.

## Checks · r23

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | The memory paragraph now gives a per-operation base, the multiplied hash allowance and PostgreSQL 18’s 2.0 default. It distinguishes those limits from whole-query/server allocations and includes multiple operations, parallel execution and concurrent queries. |
| Evidence | pass | Memory is documented behaviour, not measured sizing. Burst, deadline, Little’s-law and headroom numbers remain labelled illustrative arithmetic. Unchanged admission mechanics retain qualified model evidence. |
| Coverage | pass | The correction fits the fleet connection budget, overload bounds, cancellation/retry costs, bottleneck table, capacity envelope and failure headroom. It does not turn pool size into a claim about useful concurrency. |
| Depth, both ways | pass | The short hash allowance qualification supplies the missing operational understanding without introducing a false server memory formula or a tuning prescription. |
| Ownership | pass | The article answers admission/capacity judgement locally; diagnosis remains r24/RL103 and engine observation remains RL120. Detailed execution/memory mechanisms remain in RL87 and the engine branch. |

**Accepted critical memory problem: confirmed repaired.** PostgreSQL 18’s [Resource Consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-WORK-MEM) documents the base allowance and concurrent operations/sessions; the adjacent `hash_mem_multiplier` entry establishes the formula and default. Its parallel-worker section supports the added concurrency qualification. The current paragraph makes no benchmark or fixed preallocation claim.

**Optional Sources problem: confirmed repaired.** The final Sources now tell the reader to vary connection, queue and work limits and compare waiting/completion. They do not use internal 18-case QA as reader-facing assurance.

## Checks · r24

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | A is Pool 1,200 / SQL 200 / Other 100; B is Other 100 / Lock wait 1,200 / SQL 200; C is Other 100 / SQL execution 1,400. Each is 1,500 ms. Labels follow interval order, and the flex weights retain the intended relative durations. |
| Evidence | pass | Figure 1 remains an invented comparison, separate from Figure 2’s observed native lock/cancellation sequence. The download response matches the unchanged executed source exactly. |
| Coverage | pass | The repaired labels support the article’s main choice between acquisition, blocking and expensive execution. The following trace uncertainty, blocker ownership, bounded intervention and recovery discussion still applies. |
| Depth, both ways | pass | Separate labels preserve every duration without making the reader infer the short Other interval from prose. The figure adds no spurious timing precision or engine performance claim. |
| Ownership | pass | Triage and bounded first intervention are useful locally; deeper lock protocols, plans, admission and native operational tools retain their explicit handoffs. |

**Accepted Figure 1 label problem: technical and textual portion confirmed repaired.** The rendered HTML contains every category and duration outside the narrow bars, in order; the bars are `aria-hidden` and the ordered labels carry their meaning. Labels wrap independently of duration, while durations have `white-space: nowrap`. Category distinction also uses dashed, heavier and ordinary borders. Current pixel readability on desktop/phone and in both themes belongs to the separate visual confirmation and is **not certified by this HTTP/source check**.

The native Figure 2 sequence, its claim boundaries and the entire download section were reread. [PostgreSQL signalling documentation](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL) supports the query/session distinction and the limitation of a successful signal return. The unchanged source and receipt agree on an idle holder retaining its lock, a cancelled waiter entering an aborted transaction, both rollbacks and a fresh update to stock 0. No production timing is inferred.

## Checks · r26

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Four headed tables, shop-scoped captions and reference explanations match the canonical order/customer, both lines and both referenced products. Shop 20/P7 cannot satisfy shop 10’s reference. Current script outcomes agree with the displayed data. |
| Evidence | pass | Placement and key layouts are explicitly conceptual designs. Three routing outcomes were checked against the current compiled script; no native placement or distributed execution is claimed. |
| Coverage | pass | Stored fields and same-shop references are legible as relations in the explanation; the surrounding co-location caveat, hot-tenant/key distinction, fan-out, index work, global invariants and ownership movement remain consistent. |
| Depth, both ways | pass | Selected fields/rows answer the placement question without requiring reconstruction of relation strings or a full schema lesson. Customer identity is explained beside the order rather than falsely stored as a name in it. |
| Ownership | pass | The generic locality decision remains r26’s answer. The r54/specialist-sharding handoff explicitly owns actual PostgreSQL distribution, constraints and movement; RL106 owns cross-partition commit and RL123 owns CockroachDB keys/ranges. |

**Accepted packed-relations/missing-P3 problem: confirmed repaired for practitioner meaning and mechanics.** In all choices the static tables show:

- Shop 10/order 103 has `customer_id = 1`, status pending; the explanation identifies customer 1 as Mina Shah in `customers`.
- Its line 1 is P7 × 1 at `unit_price = 20.00`; line 2 is P3 × 2 at `unit_price = 4.50`.
- Shop 10’s products include P7 Blue mug, catalogue Price 20.00, and P3 Green tea, 50 g, catalogue Price 4.50. Product Price and each line’s `unit_price` are separate stored fields, even where their present values agree. Nothing recomputes the agreed price from a later catalogue state.
- Shop 20’s P7 is Copper mug at 18.00, with a different composite identity. The captions and reference explanation carry the shared shop/order fields rather than silently omitting them.

I independently checked the frozen `core.json` against the authoritative example and inspected the current compiled inline `shop-route` handler from the immutable output. A small DOM stub exercised its three registered click callbacks: receipt selected A only and rejected the cross-shop join; P7 without shop selected A/B and returned both distinct mug identities/prices; catalogue selected A/B and required combining results before a global order/limit. Pressed states were mutually exclusive. This was a **mechanical script check**, not browser interaction or visual evidence. The text alternative states the same routes and references. The frozen all-states receipt is corroborating author evidence only.

The co-location caveat agrees with [Citus 13’s distribution-column documentation](https://docs.citusdata.com/en/stable/sharding/data_modeling.html), and the surrounding sequential-key/range trade agrees with [CockroachDB 25.4’s hash-sharded index documentation](https://www.cockroachlabs.com/docs/v25.4/hash-sharded-indexes). These support the conceptual boundary; they do not establish observed placement. The r54 plan’s configuration/constraint/movement scope remains an appropriate next step.

## Checks · r32

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Figure 1 now shows retention, removal and reusable space only. Later prose defines both map bits, then freezing, and accurately reports the fixture’s requested FREEZE and actual all-frozen result. |
| Evidence | pass | The explanatory schedule and observed physical results remain distinct. The unchanged verifier, data, environment and output support the relocated observation and unchanged dead-tuple/report/heap-fetch facts. |
| Coverage | pass | The repair preserves the distinctions between horizon retention, reusable space, bloat, visibility, statistics and finite-ID safety. Later retained-holder, maintenance-budget and intervention sections remain consistent. |
| Depth, both ways | pass | Readers no longer need future visibility/freezing vocabulary to read the first cleanup figure. The later observation now has the definitions needed to interpret it and does not add unnecessary native detail. |
| Ownership | pass | r32 gives the maintenance diagnosis; layout/general version prerequisites remain RL110/RL92, rebuild operations remain RL119 and incident recovery remains RL120. |

**Accepted first-figure prerequisite problem: confirmed repaired.** Neither all-visible, all-frozen nor freezing appears in the current Horizon figure. Its final state says reusable space/old tuple removed and preserves P7 25.00 for current readers. The following native paragraph still establishes retained 20.00, one live plus one dead tuple, and removal after the report ends.

**Relocated actual freeze observation: confirmed supported.** I read the full frozen verifier, native output, environment record and freeze-observation record, rather than relying on the applicability summary alone. The final command is `VACUUM (FREEZE, VERBOSE, TRUNCATE OFF) products`, followed by `SELECT 'released-map',* FROM pg_visibility_map_summary('products');`. The actual output is `released-map|1|1`. [pg_visibility](https://www.postgresql.org/docs/18/pgvisibility.html) specifies the result columns as `all_visible`, then `all_frozen`: this records one page in each category. It is not merely an inference from successful vacuum completion.

[VACUUM’s FREEZE option](https://www.postgresql.org/docs/18/sql-vacuum.html) and [routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND) support requested freezing and modern flag-based treatment of `xmin`. The latter explicitly distinguishes ordinary from aggressive freezing. The current article makes the observation specific to this second fixture vacuum; it does not say every vacuum freezes every page. [Visibility-map documentation](https://www.postgresql.org/docs/18/storage-vm.html) supports the later bit definitions and the possibility that page changes clear map information.

## Qualified unchanged evidence

- **r23:** Admission component `dada9374…`, burst model `33c4d50a…` match the original mechanical hashes. The old 18-case model and browser scenario records apply to unchanged mechanics, not to current pixels or the new memory paragraph. As a fresh bounded challenge, Node **v24.16.0** imported the frozen model and checked all 18 pool/queue/work combinations for final accepted/refused counts, round count, unique conservation of eight request IDs and pool/work/queue bounds. All passed. No native database capacity was measured.
- **r24:** `incident.py` is still SHA-256 `7369e8d8798d560dd05a49db0bdb76bb466ce1545330f6959b431f43b427dc5e`. The current rendered download link returned HTTP 200, 7,367 bytes with that exact hash. The private PostgreSQL 18.6 receipt’s fixture and intervention sequence still match the source and article. Its macOS/Python 3.14.5 scope, Linux limit and absence of production timing remain stated. No execution or browser save was repeated.
- **r26:** The Routing component changed, so an old component hash was not used to certify its new fields or outcomes. Those were checked from canonical data, current rendered HTML and the current compiled handler. The mechanism remains a deliberately chosen placement model, with no native receipt to reuse.
- **r32:** Verifier SHA-256 `f2ee23e1c05f9dc164b1e7b1c502a3e8f2d2fc706b5905448d9d57ce29a7d789` matches the original hash. Native output is `c1576ee203d3c08ecfb4026dabc47025c696d65f63704a3e7044cae0dee9b24b`. The independent scratch P7 20→25 fixture, Repeatable Read report, covering index, disabled table autovacuum, forced index route, owned Unix-socket/TCP-disabled PostgreSQL 18.6 environment and final FREEZE still apply. The output still supplies held `1|1`, map `0|0`, report 20.00; released `1|0`, map `1|1`; heap fetches 2 then 0. These are one-row functional observations, not natural plan choice or production performance.

## Findings

No new practitioner findings. No finding number was consumed. The accepted r23, r26 and r32 problems pass this perspective’s confirmation; r24’s semantic repair passes, with its visual readability judgement explicitly outside this checker’s evidence.

## Limits

CUA was not used because the independent editorial reviewer held the shared viewport lease. No tabs, viewport/theme defaults, database services or global settings were changed. No native instance was needed or started, and none was left running. The current routing callbacks were mechanically exercised, but keyboard, real browser control behaviour, visual layout and light/dark desktop/phone readability were not independently observed here. The separate visual confirmation must supply those judgements. Browser download saving remains unverified; HTTP bytes/source identity were checked without download-event/path/save APIs.

The source/HTTP checks, official documentation and qualified unchanged receipts support the focused practitioner results above. They do not replace a fresh blind final practitioner review, unrelated full-article experiment reproduction, visual confirmation or corpus coverage. The whole collection was not reassessed. Assignment ends on return.
