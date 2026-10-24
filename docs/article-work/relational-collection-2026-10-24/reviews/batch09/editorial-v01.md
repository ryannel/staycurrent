# Editorial review · article · batch09 · batch09-v01

Inputs read: [frozen manifest](v01/manifest.json), [intended audience](v01/audience.md), the complete rendered articles listed below and the fixed references in full. Frozen at `2026-10-24T04:46:36.956472+00:00`. Highest severity: **none**.

## Calibration and reading method

The reviewer read only the current review skill and editorial perspective, each frozen `audience.md`, manifest identity/input restrictions, the complete rendered pieces and the three fixed references. No plans, article/component source, mechanical receipts, author notes, peer reports, approvals or history were consulted. No builds, article edits or delegation were performed.

Reference text was read with exactly 19 separate `scripts/read-writing-reference.py` calls: sequences parts 1–6, indexes parts 1–7 and storage parts 1–6. Each call allowed 5,000 output tokens and returned its intact `END REFERENCE` marker. Complete-text SHA256 values were:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

All 34 rendered reference drawings were visually read at `http://127.0.0.1:4350/review/examples/`: sequences figures 1–13, indexes 1–11 and storage 1–10, with their full explanations/captions from the text. Initial misaligned sequence screenshot clips were recovered by centring the drawings and taking viewport observations; no clipped image was treated as complete. No viewport or theme setting was changed. This is editorial calibration, not a mechanics certificate.

Each article was read in complete bounded rendered DOM-text sections through its ending, with overlap recovering any clipped output. Final Sources and further reading was read from its full disclosure content, including when outside the article element. Every figure’s available text alternative and labels/caption were read; controls need not be played for this perspective. All 25 exact URLs were also revisited for the collection navigation/map disclosures: 20 leaf disclosures per page, 500 occurrences. Removing only whitespace variation and the current-location marker left 34 unique texts; every unique text was output and read with its per-piece membership, rather than silently dropping repeated wrappers. Frozen ready/planned availability was retained. Optional unassigned linked articles were not followed. Bounded notes were kept per piece before producing these reports.

## r36 · PostgreSQL WAL, checkpoints and durability

Exact input: [http://127.0.0.1:4502/review/relational-collection/postgresql/recovery/](http://127.0.0.1:4502/review/relational-collection/postgresql/recovery/), `batch09-v01`; article identity recorded by manifest SHA256 `3050fb6c5a812d630abc60e3aac4fd55d9702d6a1811baae659b221cfe5eb6b3` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r36.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish WAL stages, acknowledgement, checkpoint recovery, counters, native crash and tested promise. |
| Plain sentences | pass | Concrete positions, purchase acceptance and short log extracts support plain causal explanation. |
| Terms | pass | LSN, write/flush functions, checkpoint/redo relation, counter scopes and unlogged behaviour are explained at use. |
| Openings | pass | The opening states how WAL permits confirmation before page-file writes and declares complete purchase acceptance. |
| Reader-facing text only | pass | Native process-stop and conceptual loss cuts have explicit, relevant evidential limits. |
| Captions and labels | pass | Commit-mode controls say what changes; record-group and checkpoint captions explain scale, order and retention scope. |
| One piece | pass | Progress prepares settings, checkpoint mechanism prepares counters, and the native log is interpreted before its limitations are drawn. |

### Whole-article judgement

The article develops distinct WAL positions into commit-setting and checkpoint decisions, then teaches how to interpret the corresponding observations. The restart log and complete purchase/unlogged/unfinished acceptance avoid treating startup alone as success. Its final tested-promise distinction follows the actual experiment. It could sit beside the references.

### Findings

No editorial finding.

## r37 · Restoring PostgreSQL to a recovery target

Exact input: [http://127.0.0.1:4502/review/relational-collection/postgresql/backup-and-restore/](http://127.0.0.1:4502/review/relational-collection/postgresql/backup-and-restore/), `batch09-v01`; article identity recorded by manifest SHA256 `a9c2eafe6e9fa09bb7059cbcfa8dd6793262f40bc2df525f1eae336e09007adf` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r37.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings name base/continuation, archive success, target identity, saved-only restore, closed history and full reconciliation. |
| Plain sentences | pass | The S503/B203 capacity values make exclusion and one-time replay concrete. |
| Terms | pass | Cluster’s PostgreSQL meaning, archive contract, XID target/inclusivity, timeline, pause and gate are explained before dependence. |
| Openings | pass | The opening immediately states both the physical chain and later-valid-work acceptance problem. |
| Reader-facing text only | pass | Scenario times, command placeholders and same-host/native limits are reader-facing and explicit. |
| Captions and labels | pass | The timeline and capacity/copy counters explain the target and retry; text history supplies the entire order including fencing. |
| One piece | pass | Conceptual sections retain one recovery argument; the full figure restores event order while focused native descriptions explain each obligation. |

### Whole-article judgement

Base verification, actual target exclusion and a deliberately missing required WAL segment give the recovery chain concrete success and failure evidence. Closing the source and reconciling B203 with exactly one capacity decrement then complete the service promise. The figure makes the chronology explicit. Selection, explanatory development and prose meet the reference standard.

### Findings

No editorial finding.

## r38 · PostgreSQL physical replicas and promotion

Exact input: [http://127.0.0.1:4502/review/relational-collection/postgresql/replication/](http://127.0.0.1:4502/review/relational-collection/postgresql/replication/), `batch09-v01`; article identity recorded by manifest SHA256 `ba774bab80958789f4a4df8e1d9913527ad3b4f48c40137a00ff45e43a644cfc` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r38.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate seeding, progress, acknowledgement choice, retention, promotion/fence and rejoin. |
| Plain sentences | pass | Concrete paused replay and a deliberately unreplicated scratch row explain different outcomes precisely. |
| Terms | pass | Physical seed, standby signal, reported receive/flush/replay, synchronous set, timeline and rewind are introduced consistently. |
| Openings | pass | The opening states both the durability/visibility distinction and the candidate-history risk. |
| Reader-facing text only | pass | Conceptual acknowledgement model and executed scratch boundaries are clearly distinguished. |
| Captions and labels | pass | The mode selector and caption explain the earliest allowed reply; text alternatives cover all illustrated modes and fresh-read requirement. |
| One piece | pass | The purchase teaches progress before the scratch loss teaches candidate acceptance; rejoin follows the authority transfer. |

### Whole-article judgement

The native on/remote_apply comparison turns acknowledgement names into observable waits. Stopping the candidate before a locally acknowledged scratch write then isolates a different failover-loss issue. Fencing, promotion and fresh-base return finish that authority story. The piece is coherent, practical and at the reference standard.

### Findings

No editorial finding.

## r39 · PostgreSQL logical replication and change feeds

Exact input: [http://127.0.0.1:4502/review/relational-collection/postgresql/logical-replication/](http://127.0.0.1:4502/review/relational-collection/postgresql/logical-replication/), `batch09-v01`; article identity recorded by manifest SHA256 `06f93b4dfa3cc16c4905f6c3fa6eb62df25c982cc098b3d41cf7421a63460bc4` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r39.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate stream setup, identity, selection, independent state, conflicts, retention and effects. |
| Plain sentences | pass | The no-identity update, missing column, sequence duplicate and local-row conflict give each limit a concrete consequence. |
| Terms | pass | Publication/subscription, replica identity, FULL, DDL, apply conflict, logical slot and output consumer are explained as used. |
| Openings | pass | The opening establishes selected row streaming as distinct from a physical cluster copy and names the responsibilities that move. |
| Reader-facing text only | pass | Conceptual FULL case and native tested cases are scoped; no author process or repair history appears. |
| Captions and labels | pass | The identity choices and panels say where failure occurs; text alternatives distinguish publisher failure from subscriber matching. |
| One piece | pass | Each counterexample develops a responsibility left by the row stream, then slot lifecycle and effect checkpoints follow from consumption. |

### Whole-article judgement

The piece gives selective replication a clear contract and shows its boundaries through several small failures rather than unsupported general cautions. Replica identity, schema, sequences and local writes are distinct cases the reader needs before accepting a writable destination. The slot and external-consumer ending follows the same stream responsibility. It could sit beside the references.

### Findings

No editorial finding.

## r43 · Upgrading and migrating PostgreSQL

Exact input: [http://127.0.0.1:4502/review/relational-collection/postgresql/upgrades/](http://127.0.0.1:4502/review/relational-collection/postgresql/upgrades/), `batch09-v01`; article identity recorded by manifest SHA256 `cc6682f6a2ad51b9a188cfdf3d23edceb3ad21240d8066608f6f25aca5cc44c0` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r43.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings distinguish transfer selection, compatibility, mode, source closure, acceptance, return and renewed protection. |
| Plain sentences | pass | The unchanged shop report and before/after request probes make physical and logical return boundaries concrete. |
| Terms | pass | Minor/major, dump/upgrade/logical routes, copy/link/clone/swap and admission gate roles are explained before use. |
| Openings | pass | The opening establishes application/history acceptance and the two independent return boundaries. |
| Reader-facing text only | pass | The actual 17.6-to-18.6 copy rehearsal and unexecuted route limits are reader-facing, with no editing history. |
| Captions and labels | pass | The inspection-point control names the changed history; both copies’ gate/probe labels and the caption explain the return problem. |
| One piece | pass | Compatibility prepares conversion, closure prepares accepted capture, and new writes motivate the later return and recovery obligations. |

### Whole-article judgement

The article compares routes, then works through one actual copy upgrade with compatibility failure, closed writes, candidate acceptance and a target-only probe. Restarting the preserved old copy in quarantine makes the missing-history return problem concrete even though the shop rows still match. The concluding protection work follows that new authority. It meets the reference standard.

### Findings

No editorial finding.

## Limits

This is fresh independent **initial editorial article-mode** coverage of the named complete first-return versions. It is neither corpus review nor final complete coverage. Technical truth, native execution, responsive/theme rendering, figure mechanics and downloads were not independently verified; reported observations are judged as explanations within the permitted rendered inputs. Sources were read as part of each finished piece, not opened as additional research. No browser download event/path/save waits were used. Only the reviewer’s temporary browser tab was used and closed at completion. No required editorial input or check is omitted.
