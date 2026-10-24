# Editorial review · article · batch06 · batch06-v01

Inputs read: [frozen manifest](v01/manifest.json), [intended audience](v01/audience.md), the complete rendered articles listed below and the fixed references in full. Frozen at `2026-10-24T03:06:43.273309+00:00`. Highest severity: **none**.

## Calibration and reading method

The reviewer read only the current review skill and editorial perspective, each frozen `audience.md`, manifest identity/input restrictions, the complete rendered pieces and the three fixed references. No plans, article/component source, mechanical receipts, author notes, peer reports, approvals or history were consulted. No builds, article edits or delegation were performed.

Reference text was read with exactly 19 separate `scripts/read-writing-reference.py` calls: sequences parts 1–6, indexes parts 1–7 and storage parts 1–6. Each call allowed 5,000 output tokens and returned its intact `END REFERENCE` marker. Complete-text SHA256 values were:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

All 34 rendered reference drawings were visually read at `http://127.0.0.1:4350/review/examples/`: sequences figures 1–13, indexes 1–11 and storage 1–10, with their full explanations/captions from the text. Initial misaligned sequence screenshot clips were recovered by centring the drawings and taking viewport observations; no clipped image was treated as complete. No viewport or theme setting was changed. This is editorial calibration, not a mechanics certificate.

Each article was read in complete bounded rendered DOM-text sections through its ending, with overlap recovering any clipped output. Final Sources and further reading was read from its full disclosure content, including when outside the article element. Every figure’s available text alternative and labels/caption were read; controls need not be played for this perspective. All 25 exact URLs were also revisited for the collection navigation/map disclosures: 20 leaf disclosures per page, 500 occurrences. Removing only whitespace variation and the current-location marker left 34 unique texts; every unique text was output and read with its per-piece membership, rather than silently dropping repeated wrappers. Frozen ready/planned availability was retained. Optional unassigned linked articles were not followed. Bounded notes were kept per piece before producing these reports.

## r15 · Row versions, storage and cleanup

Exact input: [http://127.0.0.1:4440/review/relational-collection/storage/](http://127.0.0.1:4440/review/relational-collection/storage/), `batch06-v01`; article identity recorded by manifest SHA256 `71382ec8b70495bd72eccc21b3ca3928f5e10bb2a070a0af9dac89babeb720bf` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r15.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate versions, page addresses, alternative storage, reuse, write work and diagnosis. |
| Plain sentences | pass | The 20.00/25.00 readers and measured file sizes explain otherwise abstract physical costs in connected prose. |
| Terms | pass | Heap, snapshot, ctid, TOAST, undo, vacuum, HOT and write amplification are explained as used. |
| Openings | pass | The logical-row/physical-version distinction establishes both concurrency benefit and retained-space cost. |
| Reader-facing text only | pass | Scratch history and native measurement limits are relevant provenance; no planning instructions appear. |
| Captions and labels | pass | The figure names R’s retained snapshot and Q’s fresh one; the caption explains omitted structures and the six text steps cover cleanup. |
| One piece | pass | Each later section answers an implication of retaining a version; cleanup diagnosis follows the measured reuse/rewrite contrast. |

### Whole-article judgement

The article turns one price update into an explanation of retained snapshots, unstable physical addresses, undo storage, reusable gaps and index work. Its measured unchanged file after deletion makes the distinction from compaction concrete. The final diagnostic section follows those mechanisms instead of listing generic tuning advice. It fulfils its promise at the intended entry and could sit beside the references.

### Findings

No editorial finding.

## r18 · Write-ahead logs and crash recovery

Exact input: [http://127.0.0.1:4440/review/relational-collection/crash-recovery/](http://127.0.0.1:4440/review/relational-collection/crash-recovery/), `batch06-v01`; article identity recorded by manifest SHA256 `3d00487474ce393239fe13d6fe0c4d9a9bebdd33aef6a53660c5e42334b521ca` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r18.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish write ordering, reply knowledge, durable storage, replay, acknowledgement policy and service outage. |
| Plain sentences | pass | The complete purchase provides a concrete object for WAL, commit and recovery; the prose states causal dependencies directly. |
| Terms | pass | Dirty page, WAL, flush, checkpoint, redo and LSN are explained at their introduction. |
| Openings | pass | The opening explains how a commit can survive while table pages remain in memory, then supplies purchase acceptance. |
| Reader-facing text only | pass | Observed process restart and conceptual power cuts are plainly distinguished for the reader. |
| Captions and labels | pass | The three cut labels and text outcomes explain both recovered data and application knowledge; the caption states the chosen cut’s limits. |
| One piece | pass | The storage and checkpoint qualifications change the promise under discussion rather than interrupting it with unrelated corrections. |

### Whole-article judgement

The two WAL ordering obligations lead naturally into the three crash cuts, their identical or different recovered purchases, and the client’s uncertainty. Flush semantics and checkpoint replay then explain the practical limits of that result. The acknowledgement comparison and complete-outage ending are earned by the same promise. The explanatory development and prose meet the reference standard.

### Findings

No editorial finding.

## r19 · Backup, restore and reconciliation

Exact input: [http://127.0.0.1:4440/review/relational-collection/backup-and-restore/](http://127.0.0.1:4440/review/relational-collection/backup-and-restore/), `batch06-v01`; article identity recorded by manifest SHA256 `bbeeadb389ee1d296cf92ecc2446d2341500c04d22ed28a1585e95e417a87185` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r19.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings name failure choice, chain dependencies, target proof, source closure, complete reconciliation and recovery testing. |
| Plain sentences | pass | 103 and later valid 107 give each recovery claim a concrete effect on orders, lines and P3 stock. |
| Terms | pass | RPO/RTO, logical/physical base, PITR, timeline, fencing and reconciliation are introduced in context. |
| Openings | pass | The opening immediately demonstrates why restoring before a mistake can also remove a valid purchase. |
| Reader-facing text only | pass | The scenario/native-time distinction and local-drill limits explain evidence a reader needs to interpret. |
| Captions and labels | pass | The timeline and six-stage alternative state what is restored, excluded, fenced and reapplied; the caption identifies external-effect limits. |
| One piece | pass | The gate explanation prepares the closed-history enumeration, which prepares operation-level and external acceptance. |

### Whole-article judgement

The piece carries the reader from the failure a backup must survive to a demonstrably correct target and then to the work that target excludes. Order 107 and its single stock decrement make reconciliation more than a row-copy slogan. Source fencing and external authorities belong to the same service-recovery argument. Its selection, examples and practical judgement meet the reference standard.

### Findings

No editorial finding.

## r20 · Replicas, lag and read routing

Exact input: [http://127.0.0.1:4440/review/relational-collection/replicas-and-read-routing/](http://127.0.0.1:4440/review/relational-collection/replicas-and-read-routing/), `batch06-v01`; article identity recorded by manifest SHA256 `89bb704386ae4ed90135ad14637360530aabb07817a51e99c8a164f39281cf9b` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r20.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish progress, synchronous waits, read promises, snapshot barriers, replay conflict and retention. |
| Plain sentences | pass | The missing 103 result concretely explains why having durable bytes is different from serving the purchase. |
| Terms | pass | Received, durable, replayed, synchronous selection, barrier and history identity are explained before being relied on. |
| Openings | pass | The opening gives the replica’s roles and the immediate just-written-order freshness question. |
| Reader-facing text only | pass | Native positions and paused replay are presented as scoped observations, not a production performance claim. |
| Captions and labels | pass | All four progress rows and the fresh-query result are labelled; the caption separates conceptual positions from native LSNs. |
| One piece | pass | The retained old snapshot counterexample belongs with the barrier ordering, and reporting/retention costs follow read-route choices. |

### Whole-article judgement

The progress model develops into actual read routing rather than stopping at a definition of lag. The native durable-but-unreplayed purchase and retained old snapshot provide two different counterexamples. The later report conflicts and slot retention show costs of the selected role. The complete piece is coherent and reaches the promised practical judgement at reference quality.

### Findings

No editorial finding.

## r21 · Failover and fencing

Exact input: [http://127.0.0.1:4440/review/relational-collection/failover/](http://127.0.0.1:4440/review/relational-collection/failover/), `batch06-v01`; article identity recorded by manifest SHA256 `03d4987bb04a93ee06abbc80478867a14c4676b8e143bf8a31163a99fb549098` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r21.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings identify suspicion, fence, available history, missing purchase, traffic and former-primary return. |
| Plain sentences | pass | Old sessions and the absent acknowledged 103 make authority and history consequences concrete. |
| Terms | pass | Failover/promotion, fence, synchronous candidate selection, timeline and rejoin are explained consistently. |
| Openings | pass | The opening separates promotion from a safe transfer and explains why silence can leave two writers. |
| Reader-facing text only | pass | The unsafe scratch counterexample and separate fenced purchase drill have explicit observational limits. |
| Captions and labels | pass | Route-only versus enforced-fence controls identify the changed protocol; both histories are supplied as text. |
| One piece | pass | History acceptance follows fencing, reconciliation precedes traffic, and rejoin restores the redundancy the switch consumed. |

### Whole-article judgement

The old client that can still write gives the authority problem a visible shape. The separately stopped candidate makes missing history a different problem, and purchase reconciliation explains the consequence before traffic opens. Timeline, connection handling and fresh-base rejoin complete that transfer. The piece could sit beside the references in argument, examples and prose.

### Findings

No editorial finding.

## Limits

This is fresh independent **initial editorial article-mode** coverage of the named complete first-return versions. It is neither corpus review nor final complete coverage. Technical truth, native execution, responsive/theme rendering, figure mechanics and downloads were not independently verified; reported observations are judged as explanations within the permitted rendered inputs. Sources were read as part of each finished piece, not opened as additional research. No browser download event/path/save waits were used. Only the reviewer’s temporary browser tab was used and closed at completion. No required editorial input or check is omitted.
