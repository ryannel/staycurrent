# Editorial review · article · batch07 · batch07-v01

Inputs read: [frozen manifest](v01/manifest.json), [intended audience](v01/audience.md), the complete rendered articles listed below and the fixed references in full. Frozen at `2026-10-24T03:52:10.018779+00:00`. Highest severity: **low**.

## Calibration and reading method

The reviewer read only the current review skill and editorial perspective, each frozen `audience.md`, manifest identity/input restrictions, the complete rendered pieces and the three fixed references. No plans, article/component source, mechanical receipts, author notes, peer reports, approvals or history were consulted. No builds, article edits or delegation were performed.

Reference text was read with exactly 19 separate `scripts/read-writing-reference.py` calls: sequences parts 1–6, indexes parts 1–7 and storage parts 1–6. Each call allowed 5,000 output tokens and returned its intact `END REFERENCE` marker. Complete-text SHA256 values were:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

All 34 rendered reference drawings were visually read at `http://127.0.0.1:4350/review/examples/`: sequences figures 1–13, indexes 1–11 and storage 1–10, with their full explanations/captions from the text. Initial misaligned sequence screenshot clips were recovered by centring the drawings and taking viewport observations; no clipped image was treated as complete. No viewport or theme setting was changed. This is editorial calibration, not a mechanics certificate.

Each article was read in complete bounded rendered DOM-text sections through its ending, with overlap recovering any clipped output. Final Sources and further reading was read from its full disclosure content, including when outside the article element. Every figure’s available text alternative and labels/caption were read; controls need not be played for this perspective. All 25 exact URLs were also revisited for the collection navigation/map disclosures: 20 leaf disclosures per page, 500 occurrences. Removing only whitespace variation and the current-location marker left 34 unique texts; every unique text was output and read with its per-piece membership, rather than silently dropping repeated wrappers. Frozen ready/planned availability was retained. Optional unassigned linked articles were not followed. Bounded notes were kept per piece before producing these reports.

## r23 · Connections, overload and capacity

Exact input: [http://127.0.0.1:4476/review/relational-collection/connections-and-capacity/](http://127.0.0.1:4476/review/relational-collection/connections-and-capacity/), `batch07-v01`; article identity recorded by manifest SHA256 `96608afcec88efee1005f28f962c2b8037bc484da4f36f7858c9b4406547ed32` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r23.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate connection counts, fleet budget, queue policy, bottleneck, measurement and recovery headroom. |
| Plain sentences | pass | The eight-request burst and bounded arithmetic explain what a larger pool changes without implying a measured server capacity. |
| Terms | pass | Open/borrowed/running, admission, deadline scopes, work_mem and Little’s law are explained with their counted boundary. |
| Openings | pass | The opening states why a session is not another processor or another independently writable row. |
| Reader-facing text only | finding | Finding editorial-1 (low): the Sources sentence about all 18 checked figure combinations and accompanying evidence exposes internal QA wording. |
| Captions and labels | pass | Connection, queue and work controls explain their variables; captions explicitly state invented rounds and the deadline model’s scope. |
| One piece | pass | Queue location leads to deployment-wide budgets and end-to-end deadlines before the capacity test and failure-state budget. |

### Whole-article judgement

The burst model gives a concrete reason to separate admission from useful work. The article then develops actual deployment overlap, request budgets, resource diagnosis, measurement and recovery headroom. The Little’s-law calculation is appropriately scoped and does not become a sizing prescription. It meets the reference standard overall, with one optional Sources wording cleanup.

### Findings

#### editorial-1 · low · r23 · Sources and further reading

Problem: “The figure’s finite schedule is checked across all 18 combinations of pool, queue and work limits in the accompanying evidence” reports an internal figure-QA receipt rather than telling the reader how to use or reproduce the explanatory model.

Effect: The reader briefly encounters the publication’s production process inside a list otherwise devoted to the model’s evidential scope and further reading. It adds little to their capacity judgement and weakens the clean reader-facing finish.

Suggestion: Remove that production sentence, or replace it with a reader-usable explanation or linked repeat method if that is intended. Keep the useful declaration that the arithmetic is illustrative and is not a benchmark.

Evidence: The exact first-return Sources disclosure, read in full. The fixed references explain model assumptions and reproducible measurements rather than reporting private figure-check completion. Optional polish; the article’s argument remains complete.

## r24 · Diagnosing a database incident

Exact input: [http://127.0.0.1:4476/review/relational-collection/slow-queries/](http://127.0.0.1:4476/review/relational-collection/slow-queries/), `batch07-v01`; article identity recorded by manifest SHA256 `1805fc34da804ff97dff718f5d9edf77ffc10fbf13435f6c01daa7c74accc9de` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r24.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings name the observed interval, evidence, blocker owner, cancellation state and distinct causal branches. |
| Plain sentences | pass | Three equal-duration requests and the idle lock holder make the diagnostic alternatives precise. |
| Terms | pass | Acquisition/ownership intervals, activity states, blocker PID, cancellation and transaction cleanup are explained when used. |
| Openings | pass | The opening separates symptom from hypothesis and gives an immediate reason different causes need different interventions. |
| Reader-facing text only | pass | Experiment instructions and OS/version limits describe repeatable reader evidence. |
| Captions and labels | pass | The timelines share an explicit scale and units; the cancellation figure distinguishes sent signal, stopped statement and ended transaction. |
| One piece | pass | Each intervention follows its hypothesis; the resumed-demand discussion belongs after removing the lock obstacle. |

### Whole-article judgement

The article teaches a diagnostic method through three timed alternatives and one observed lock experiment. Cancelling the idle holder without freeing its transaction is an effective counterexample; it changes the reader’s next action. Pool waiting, execution and controlled recovery are distinct branches of that method. It could sit beside the references.

### Findings

No editorial finding.

## r26 · Sharding and distributed SQL

Exact input: [http://127.0.0.1:4476/review/relational-collection/partitioning-and-sharding/](http://127.0.0.1:4476/review/relational-collection/partitioning-and-sharding/), `batch07-v01`; article identity recorded by manifest SHA256 `f27733dd2b4993c2e644f1ec02921f5a47ac390ee13f336cceab3541d7da2b38` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r26.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish division mechanisms, tenant keys, workload, key mapping, global work and coordination. |
| Plain sentences | pass | Two distinct P7 products and order 103 keep identity, locality and fan-out consequences concrete. |
| Terms | pass | Tenant, partition/replica/shard, shard key, hash/range mapping, co-location and fan-out are explained consistently. |
| Openings | pass | The opening gives the capacity purpose and the communication/coordination cost of dividing owners. |
| Reader-facing text only | pass | Placement choices are expressly models; no author directions or hidden production history appear. |
| Captions and labels | pass | Routing buttons identify the request scope, and captions explain chosen co-location, omitted replicas and abstract key layouts. |
| One piece | pass | Identity prepares routing; routing prepares key/skew choices; global queries and indexes then expose the cost of crossing that choice. |

### Whole-article judgement

The article derives distribution from work rather than treating more nodes as a conclusion. The tenant-key example makes local receipts and ambiguous unscoped products tangible; the ordered/hash comparison then exposes an independent write/read trade. The final coordination and trial requirements arise from those examples. Selection, development and prose meet the reference standard.

### Findings

No editorial finding.

## r27 · Transactions across partitions

Exact input: [http://127.0.0.1:4476/review/relational-collection/distributed-transactions/](http://127.0.0.1:4476/review/relational-collection/distributed-transactions/), `batch07-v01`; article identity recorded by manifest SHA256 `a3f0a7f98f171193131317b120f15792af2c128c296c9f922314296b44101208` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r27.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings clearly separate local-commit failure, replica agreement, prepare, uncertain decision and recovered authority. |
| Plain sentences | pass | The stock/order split and exact failure outcomes keep the protocol explanation concrete. |
| Terms | pass | Participant, consensus scope, two-phase commit, prepare and coordinator decision are introduced before their failure reasoning. |
| Openings | pass | The opening supplies the multi-row promise and distinguishes it from agreement within one replica group. |
| Reader-facing text only | pass | The conceptual protocol, native prepared-participant fixture and CockroachDB mechanism are explicitly separated. |
| Captions and labels | pass | The history selector and durable decision/participant panels name the changed failure cut; text alternatives cover all outcomes. |
| One piece | pass | The unresolved participant’s two possible histories motivate blocking; recovery/fencing and the fixture’s limits answer that uncertainty. |

### Whole-article judgement

The two-local-commit counterexample earns the distributed protocol. Prepared promises, the participant’s indistinguishable histories and durable decision delivery form a connected explanation rather than a catalogue of mechanisms. PostgreSQL’s building blocks are properly limited, and integrated distributed SQL is described without equating its native protocol to the model. The whole piece meets reference quality.

### Findings

No editorial finding.

## r28 · Time, snapshots and distributed reads

Exact input: [http://127.0.0.1:4476/review/relational-collection/distributed-reads/](http://127.0.0.1:4476/review/relational-collection/distributed-reads/), `batch07-v01`; article identity recorded by manifest SHA256 `8dd376577a62ebce6e60305f01fbc0c2e5fabef8bc2c6034105b1f8cfde308e4` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r28.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings name common view, timestamp meaning, clock limits, uncertainty, safe history, freshness and retention. |
| Plain sentences | pass | The stock/order mixed read and 100/110/115/120 model explain otherwise abstract snapshot obligations plainly. |
| Terms | pass | Logical/hybrid clocks, uncertainty, safe frontier and closed timestamp are explained with the guarantees they provide. |
| Openings | pass | The opening states why individually valid partition answers can make an invalid combined observation. |
| Reader-facing text only | pass | The numeric timestamps are consistently declared illustrative; no measured clock or distributed execution is claimed. |
| Captions and labels | pass | Read timestamp and B’s safe history controls name independent inputs; the caption defines the frontier and retained-history assumption. |
| One piece | pass | The common-snapshot need prepares the frontier, clock discussion and freshness choices; qualifications remain attached to those guarantees. |

### Whole-article judgement

The piece first establishes the failure of mixed current queries, then explains what a common timestamp still needs from each replica. Clocks and TrueTime are introduced to distinguish ordering promises, not as a substitute for applied history. Historical locality, read-your-write and retention return to the original operation’s needs. It fulfils its promise beside the references.

### Findings

No editorial finding.

## r29 · Regional placement and survival

Exact input: [http://127.0.0.1:4476/review/relational-collection/regional-placement/](http://127.0.0.1:4476/review/relational-collection/regional-placement/), `batch07-v01`; article identity recorded by manifest SHA256 `98b8f2e014faab44c7ec41ef4423f7ec32b498e9ad80d3e3ae538c2216d90ca0` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r29.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings identify failure domains, remote vote, home-region access, global rule and whole-service survival. |
| Plain sentences | pass | Five votes in a 2/2/1 layout and the last voucher provide concrete arithmetic and consequences. |
| Terms | pass | Failure domain, quorum, majority intersection, home, voter roles and entitlement allocation are explained as used. |
| Openings | pass | The opening separates copy location from the actual read/write dependency path. |
| Reader-facing text only | pass | Region names carry no assumed deployment or timings; conceptual configurations are labelled. |
| Captions and labels | pass | Outage and communication controls identify different failures; captions restrict voting possibility to one group and dependency arrows to non-timed paths. |
| One piece | pass | The majority example prepares remote cost, locality prepares the global-rule exception, and acceptance follows all participating dependencies. |

### Whole-article judgement

The communicating-majority model explains survival before the article asks what that survival costs a local purchase. The home-region and global-voucher sections then reveal different remote dependencies with clear business consequences. The complete-service and recovery discussion follows those same obligations. The piece meets the references’ explanatory and prose standard.

### Findings

No editorial finding.

## r30 · Rebalancing and cluster change

Exact input: [http://127.0.0.1:4476/review/relational-collection/rebalancing/](http://127.0.0.1:4476/review/relational-collection/rebalancing/), `batch07-v01`; article identity recorded by manifest SHA256 `145dfe855260bcabfde9faea1b563f68d9e18cbec682af74b3fdbdafaa44c284` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r30.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish movement, snapshot/tail, membership, resource surplus, failure budget, removal and version change. |
| Plain sentences | pass | The A–B–C to B–C–D schedule and 600 MiB backlog arithmetic make the transition costs concrete. |
| Terms | pass | Authority/replica/range movement, non-voting destination, joint majority, catch-up surplus and drain/decommission are explained through their roles. |
| Openings | pass | The opening establishes why an empty node does not immediately add usable capacity. |
| Reader-facing text only | pass | Conceptual states and constant-rate arithmetic are explicitly distinguished from native operations and measurements. |
| Captions and labels | pass | The panels show membership, authority and destination readiness separately; the rate caption gives units, assumptions and net-surplus calculation. |
| One piece | pass | The snapshot example prepares safe membership; catch-up prepares resource/failure budgets; removal and upgrade follow the same transition obligations. |

### Whole-article judgement

One replica replacement carries the argument from copied state through concurrent writes and safe voting membership. The net catch-up calculation then explains why useful progress can coexist with a growing gap. Removal and software change apply the same resource and authority reasoning rather than adding disconnected advice. It could sit beside the references.

### Findings

No editorial finding.

## Limits

This is fresh independent **initial editorial article-mode** coverage of the named complete first-return versions. It is neither corpus review nor final complete coverage. Technical truth, native execution, responsive/theme rendering, figure mechanics and downloads were not independently verified; reported observations are judged as explanations within the permitted rendered inputs. Sources were read as part of each finished piece, not opened as additional research. No browser download event/path/save waits were used. Only the reviewer’s temporary browser tab was used and closed at completion. No required editorial input or check is omitted.
