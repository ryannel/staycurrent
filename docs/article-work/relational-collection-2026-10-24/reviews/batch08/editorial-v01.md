# Editorial review · article · batch08 · batch08-v01

Inputs read: [frozen manifest](v01/manifest.json), [intended audience](v01/audience.md), the complete rendered articles listed below and the fixed references in full. Frozen at `2026-10-24T03:59:18.944329+00:00`. Highest severity: **medium**.

## Calibration and reading method

The reviewer read only the current review skill and editorial perspective, each frozen `audience.md`, manifest identity/input restrictions, the complete rendered pieces and the three fixed references. No plans, article/component source, mechanical receipts, author notes, peer reports, approvals or history were consulted. No builds, article edits or delegation were performed.

Reference text was read with exactly 19 separate `scripts/read-writing-reference.py` calls: sequences parts 1–6, indexes parts 1–7 and storage parts 1–6. Each call allowed 5,000 output tokens and returned its intact `END REFERENCE` marker. Complete-text SHA256 values were:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

All 34 rendered reference drawings were visually read at `http://127.0.0.1:4350/review/examples/`: sequences figures 1–13, indexes 1–11 and storage 1–10, with their full explanations/captions from the text. Initial misaligned sequence screenshot clips were recovered by centring the drawings and taking viewport observations; no clipped image was treated as complete. No viewport or theme setting was changed. This is editorial calibration, not a mechanics certificate.

Each article was read in complete bounded rendered DOM-text sections through its ending, with overlap recovering any clipped output. Final Sources and further reading was read from its full disclosure content, including when outside the article element. Every figure’s available text alternative and labels/caption were read; controls need not be played for this perspective. All 25 exact URLs were also revisited for the collection navigation/map disclosures: 20 leaf disclosures per page, 500 occurrences. Removing only whitespace variation and the current-location marker left 34 unique texts; every unique text was output and read with its per-piece membership, rather than silently dropping repeated wrappers. Frozen ready/planned availability was retained. Optional unassigned linked articles were not followed. Bounded notes were kept per piece before producing these reports.

## r31 · PostgreSQL processes, pages and row versions

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/architecture/](http://127.0.0.1:4482/review/relational-collection/postgresql/architecture/), `batch08-v01`; article identity recorded by manifest SHA256 `e4f7c2997af71828eba5c89479f102bb8e61a330a923f6389f211dc3564c8157` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r31.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate backend, physical address, shared/private work, visibility, HOT and wide values. |
| Plain sentences | pass | The P7 lookup and three physical update cases connect engine details to observable results. |
| Terms | pass | Backend, heap item/line pointer, ctid/xmin/xmax, buffers, HOT and TOAST are explained as used. |
| Openings | pass | The opening explains the query’s process, page and visibility boundaries and their practical implications. |
| Reader-facing text only | pass | Chosen route, scratch price and native observations are clearly labelled for the reader. |
| Captions and labels | pass | The lookup caption explains the illustrative route and tiny-table alternative; HOT controls and text outcomes identify both conditions. |
| One piece | pass | The lookup prepares addresses/cache, then snapshot visibility prepares the update/index chain and cleanup ending. |

### Whole-article judgement

The article follows one lookup far enough to distinguish logical identity, physical location and permitted visibility. Its HOT example then shows why changing a price can require new entries even when P7 is unchanged. TOAST and writer processes are connected to the same update, with deeper maintenance deferred sensibly. It meets the reference standard for its intended entrant.

### Findings

No editorial finding.

## r32 · PostgreSQL vacuum and transaction age

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/row-versions/](http://127.0.0.1:4482/review/relational-collection/postgresql/row-versions/), `batch08-v01`; article identity recorded by manifest SHA256 `06ea9c080795bb0377846c93b41bad8766b2dd4febef9bdf7d491ea94235e52c` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r32.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings clearly separate retained versions, visibility/statistics, finite IDs, holders and maintenance throughput. |
| Plain sentences | pass | The report and one-page counts keep most of the maintenance argument plain and concrete. |
| Terms | finding | Finding editorial-1 (medium): figure 1 introduces all-visible/all-frozen and freezing before their definitions. |
| Openings | pass | The opening gives vacuum’s three jobs and why a single file-size or recent-run observation cannot diagnose them. |
| Reader-facing text only | pass | Provenance and forced-route limits are reader-facing; no author instructions appear. |
| Captions and labels | finding | Finding editorial-1 (medium): figure 1’s final label and caption require the unexplained visibility/freezing distinction. |
| One piece | finding | Finding editorial-1 (medium): the early corrective freezing aside interrupts the retained-snapshot explanation; later sections otherwise develop coherently. |

### Whole-article judgement

The diagnostic selection is strong: retained history, reusable space, visibility, transaction-age safety and worker capacity remain distinct causes. The measured retained tuple and index-only counts make that selection concrete, and the final evidence-to-job table supports practical judgement. However, the first figure’s premature visibility/freezing correction breaks the otherwise orderly introduction. With that local prerequisite defect repaired, the argument and prose would sit comfortably beside the references.

### Findings

#### editorial-1 · medium · r32 · Figure 1 final label and caption in “The version that cannot go”

Problem: The first retained-snapshot figure says “The page can become all-visible”, then adds: “The last vacuum also requested freezing; an all-visible page is not automatically all-frozen.” At this point none of all-visible, all-frozen or freezing has been explained. The visibility-map bits are introduced several paragraphs later in “Space, visibility and statistics”; freezing is explained still later in “Why old transaction IDs matter”. The intended audience knows tuple layout and general cleanup, not this new distinction.

Effect: While following the report’s need for the 20.00 version, the reader is asked to absorb a corrective distinction between two unknown statuses and an unknown maintenance action. They must suspend the current explanation, retain an unexplained warning and wait for later definitions. The qualification reads as an inserted technical correction rather than a consequence of the snapshot reasoning it accompanies. This is a local prerequisite/coherence defect, not a claim that the later definitions are absent or technically wrong.

Suggestion: Keep the first figure focused on retained versus reclaimable versions, and place this distinction with the visibility-map/freezing explanation it changes. Alternatively, prepare the terms and their relevance before the figure asks the reader to interpret them. Preserve the valid distinction between all-visible and all-frozen.

Evidence: The exact first-return figure label/caption and the later definition passages, read as rendered. Compare the reference Indexes visibility-map explanation, which establishes what the bit means before asking the reader to vary it. Checks 3, 6 and 7 share this one canonical finding.

Pass condition: On a fresh reading from the specified entry, the first cleanup figure requires no unexplained visibility/freezing distinction, and the all-visible/all-frozen qualification appears alongside enough explanation to understand what it changes. Check the surrounding version-removal and later maintenance argument together.

## r33 · PostgreSQL index methods and operators

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/indexes/](http://127.0.0.1:4482/review/relational-collection/postgresql/indexes/), `batch08-v01`; article identity recorded by manifest SHA256 `bccdf1a4de82aaa74a789d584e9fe88b709afa21787a17bc56fbd8acdcbc2923` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r33.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings move from compared operations through class contracts, specialised search, summaries, rechecks and costs. |
| Plain sentences | pass | Tiny tag lists and min/max ranges keep the index-method discussion concrete. |
| Terms | pass | Access method, operator class/family, GIN representation, BRIN summary and exact/lossy recheck roles are explained at use. |
| Openings | pass | The opening establishes why indexing a column does not make every operation on it searchable. |
| Reader-facing text only | pass | Illustrative structures and forced-route native counts are distinctly identified. |
| Captions and labels | pass | Physical-order/range controls label what changes; caption explains candidate outline, matching tick and non-native units. |
| One piece | pass | Element extraction prepares class support; summaries prepare recheck counts; read savings then earn the maintenance discussion. |

### Whole-article judgement

The article develops an operation-first choice using concrete inverted lists, class support and a min/max range model. The native GIN/BRIN comparisons distinguish candidate work from matches and avoid equating equal index size with equal value. Costs and the final decision wording follow that evidence. It meets the reference standard.

### Findings

No editorial finding.

## r34 · Reading and repairing PostgreSQL plans

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/query-execution/](http://127.0.0.1:4482/review/relational-collection/postgresql/query-execution/), `batch08-v01`; article identity recorded by manifest SHA256 `bbde2cc0f3154d51108fcf6abd3b416d63dda6039926e3002f6cc5fff228713a` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r34.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings clearly distinguish observation scope, cardinality knowledge, access path, predicate proof and remaining work. |
| Plain sentences | pass | Exact estimates and buffer counts are explained through one deliberately skewed workload. |
| Terms | pass | ANALYZE contexts, loop/buffer scopes, joint statistics, custom/generic plans and partial-index proof are introduced before application. |
| Openings | pass | The opening supplies a testable cause as the goal and declares the synthetic tenant skew. |
| Reader-facing text only | pass | Forced plan modes and temporary diagnostic settings are scoped observations, not instructions to the writer. |
| Captions and labels | pass | Planning-context controls state known versus unknown status; the caption limits forced comparisons and text alternatives give all routes. |
| One piece | pass | Wrong estimates lead to statistics, correct knowledge without access leads to an index, and parameter knowledge then explains partial-index use. |

### Whole-article judgement

This is a connected repair investigation: better statistics first fix an estimate without eliminating the scan; corrected comparison enables an access path; partial-index use then depends on parameter knowledge. Counter scopes and skew checks make the numerical evidence interpretable. The piece reaches the promised practical judgement and could sit beside the references.

### Findings

No editorial finding.

## r35 · PostgreSQL JSON and structured alternatives

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/json/](http://127.0.0.1:4482/review/relational-collection/postgresql/json/), `batch08-v01`; article identity recorded by manifest SHA256 `74888dc2f3ff1fc9a0d3fb4e0990a066423d33b45b8b27d445a07ca5598c97b3` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r35.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings separate representation, text/binary form, absence semantics, shape enforcement, search and write ownership. |
| Plain sentences | pass | Product attributes, extraction outcomes and the stale two-path document give each abstraction a concrete result. |
| Terms | pass | JSONB, SQL/JSON null, extraction/containment, shape checks and row update boundary are explained consistently. |
| Openings | pass | The opening explains JSON as a stored value boundary distinct from an HTTP response. |
| Reader-facing text only | pass | Optional catalogue and anonymous scratch variants are named, and experimental limits serve the reader. |
| Captions and labels | pass | The two-path figure identifies what each editor sends and shows both final documents; the caption scopes sequential stale input. |
| One piece | pass | Facts determine structure; structure determines absence/validation/search; row ownership then explains contention and migration. |

### Whole-article judgement

The piece makes JSONB a design choice about facts, validation, operators and update ownership. Missing versus JSON null is made visible before constraints use those distinctions. The index examples and stale replacement document then connect storage shape to work and correctness. Its integrated argument and prose meet the reference standard.

### Findings

No editorial finding.

## r57 · Types and extensions in PostgreSQL

Exact input: [http://127.0.0.1:4482/review/relational-collection/postgresql/extensions/](http://127.0.0.1:4482/review/relational-collection/postgresql/extensions/), `batch08-v01`; article identity recorded by manifest SHA256 `8267d4026fad8efd145d8d57d015698e1e7c7517bb02ee7675b8757d8b1be10c` (manifest identity only; source was not read). Intended entry: see frozen audience entry for r57.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| Titles and headings | pass | Headings trace type operations, interval bounds, enforcement, spatial units and installation/lifecycle dependencies. |
| Plain sentences | pass | Room adjacency and grid distances give precise outcomes without decorative terminology. |
| Terms | pass | Domain/enum, range bounds, exclusion, spatial reference, two-layer extension installation and dependency removal are explained as needed. |
| Openings | pass | The opening states both the useful operator contract and the operational dependencies it creates. |
| Reader-facing text only | pass | The reservation and anonymous spatial cases are explicitly distinct; native checks and supported-file limits are reader-facing. |
| Captions and labels | pass | Proposal choices, UTC brackets, bounding square and precise circle all have explanatory labels/captions. |
| One piece | pass | Range and spatial examples establish the extension capabilities before installation, restoration and update/removal explain their continuing cost. |

### Whole-article judgement

The reservation develops a typed interval into an enforced concurrent rule; the spatial grid separately develops units and indexed candidates into a precise predicate result. Those concrete capabilities justify the installation, restore and change obligations that follow. The two examples are distinct but serve one contract-and-dependency argument. The whole piece meets reference quality.

### Findings

No editorial finding.

## Limits

This is fresh independent **initial editorial article-mode** coverage of the named complete first-return versions. It is neither corpus review nor final complete coverage. Technical truth, native execution, responsive/theme rendering, figure mechanics and downloads were not independently verified; reported observations are judged as explanations within the permitted rendered inputs. Sources were read as part of each finished piece, not opened as additional research. No browser download event/path/save waits were used. Only the reviewer’s temporary browser tab was used and closed at completion. No required editorial input or check is omitted.
