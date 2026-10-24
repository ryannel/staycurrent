# Editorial review · initial article mode · batch11 · v01

Inputs read: [frozen manifest](v01/manifest.json), its audience.md, and all five complete rendered first versions at http://127.0.0.1:4522/review/relational-collection/: r44 cockroachdb/keys-and-ranges/; r45 cockroachdb/transactions/; r46 cockroachdb/follower-reads/; r47 cockroachdb/query-performance/; r48 cockroachdb/locality/. Read all prose, headings, tables, SQL, figure captions/labels, article-specific disclosures, all scripted/control-dependent explanation states and final Sources outside articleDOM. Repeated navigation was read once with status/current-piece differences inspected.

Calibration for this coherent batches 10–12 assignment: all 19 separate bounded fixed-reference helper reads (6 sequences, 7 indexes, 6 storage), all END markers delivered and root audited; all 34 successful styled rendered drawings at 4350 (13+11+10), with explanations, root acknowledged before article study. Used current review skill and editorial perspective only.

Withheld: plans, source, mechanical/native receipts, approvals, history, author quality notes and peer results. No delegation, article edits, builds, download saving or publication.

Highest severity: low.

## r44 · CockroachDB keys, ranges and replication

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | finding | editorial-1: Figure 1’s double use of “orders” briefly obscures the comparison. Article headings themselves are clear. |
| 2. Plain sentences | pass | Logical keys, ranges and replica roles are expressed concretely without making printed keys look like actual byte encodings. |
| 3. Terms | pass | Range intervals, gateway, leaseholder, Raft leader, voters and column families are introduced before their consequences. |
| 4. Openings | pass | The first paragraphs establish why a range replica differs from a whole-table or whole-database copy. |
| 5. Reader-facing text only | pass | Native split evidence and model limits explain what the reader can infer. |
| 6. Captions and labels | pass | All four layout/read combinations and all three failure settings across four command states make their changed boundary explicit. Full command disclosure read. |
| 7. One piece | pass | A row’s two index orders lead to range ownership, routing, agreement and the hotspot that remains. |

Whole-article judgement: can sit beside the references. The secondary run reaching primary rows on either side of a split gives range ownership a useful consequence. “Splitting the surrounding range cannot turn one stock value into independent allowances” then returns the machinery to an application decision. The model/native split distinction remains clear throughout.

### editorial-1 · low · r44 · Figure 1 title

Problem: “Two orders for the same orders” uses the same noun first for sort arrangements and then for purchases.

Effect: the caption asks the newcomer to decode a pun before knowing what the two panels compare. The labelled primary/customer index panels resolve it, so this is a small reading cost.

Suggestion: name the primary and customer index order directly.

Evidence: frozen rendered Figure 1 caption and its two labelled index panels.

## r45 · CockroachDB transactions and retries

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings make the progression from provisional state to client retry and request identity clear. |
| 2. Plain sentences | pass | STAGING plus required writes is explained as one condition; cleanup is distinguished from a new outcome. |
| 3. Terms | pass | Intents, transaction/request identities, implicit commit and error classes receive working meanings. |
| 4. Openings | pass | The full tea/mug purchase and its required result establish what atomicity and retry must preserve. |
| 5. Reader-facing text only | pass | Forced errors and withheld replies are identified as injections rather than observed network failure. |
| 6. Captions and labels | pass | Both five-state acknowledgement branches and full commit disclosure distinguish insufficient evidence from abort. |
| 7. One piece | pass | The unsafe suffix retry motivates the complete decision, then the stable request claim handles uncertainty and effects. |

Whole-article judgement: can sit beside the references. The suffix retry that creates both lines while leaving tea stock at 12 makes the replay unit concrete. The request-key insertion then protects the complete purchase rather than being an unrelated deduplication aside. The special retry-savepoint discussion belongs with that established boundary. No findings.

## r46 · CockroachDB isolation and follower reads

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings distinguish statement changes, protected decisions, historical views, replica eligibility and retention. |
| 2. Plain sentences | pass | The opening old-but-consistent mug view makes freshness a practical contract. |
| 3. Terms | pass | Write skew, exact/bounded historical views, closed timestamps and applied state are explained before use. |
| 4. Openings | pass | The purchase and separate instructor rule have explicit roles in the article. |
| 5. Reader-facing text only | pass | The single-node limitations identify the gap between SQL semantics and real follower routing. |
| 6. Captions and labels | pass | All eight time/applied/retention combinations were read; labels and notes expose which condition prevents a whole answer. |
| 7. One piece | pass | Isolation and freshness stay joined by what an operation is authorised to decide; the history-resource discussion follows the chosen timestamp. |

Whole-article judgement: can sit beside the references. Ada/Tomas makes the weaker isolation consequence tangible, then P7/order 103 shows why a coherent historical answer is unsuitable for purchase confirmation. The replica model separates closed promise, applied state and retained versions without suggesting an old response proves failure. No findings.

## r47 · CockroachDB query work and hot ranges

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings identify access-path work, its write cost and two different hotspot shapes. |
| 2. Plain sentences | pass | The ten-row result remains the anchor for the 120/20/10 decoded-row comparison. |
| 3. Terms | pass | SQL versus KV work, index join, stored values and hash buckets receive the distinctions the diagnosis requires. |
| 4. Openings | pass | Result size versus executed work immediately establishes the question. |
| 5. Reader-facing text only | pass | Fixture identity and observations are separated from production performance. |
| 6. Captions and labels | pass | All three access-path states identify entries, primary fetches and finish work; arrows and counts have explicit scope. |
| 7. One piece | pass | Reducing candidates and lookups leads naturally to write cost, hot index ends and irreducible shared-row decisions. |

Whole-article judgement: can sit beside the references. Covering status removes an established primary lookup and explains the byte saving using the unselected payload. The later hash index has an explicit four-span read cost rather than becoming a generic scaling prescription. Final diagnosis holds answer and concurrency contract fixed. No findings.

## r48 · CockroachDB table locality and region survival

| Check, in prescribed order | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Locality, survival and observed placement remain separately named questions. |
| 2. Plain sentences | pass | The directory’s ordinary home_region string is an effective concrete distinction from actual row placement. |
| 3. Terms | pass | Database/node regions, table/row/GLOBAL policies, regional keys and voting placement are developed locally. |
| 4. Openings | pass | Two shops with different ordinary access regions make the need for row homes clear. |
| 5. Reader-facing text only | finding | editorial-1: one sentence about actions the author did not take reads as a production note. |
| 6. Captions and labels | pass | All six locality/operation states were read; captions explicitly distinguish access contracts from observed replica maps. |
| 7. One piece | pass | Defaults, uniqueness and remote agreement costs are attached to the locality decisions they change; observed placement is measured against desired policy. |

Whole-article judgement: can sit beside the references, with optional removal of one distracting process sentence. The duplicate regional primary-key attempt connects access optimisation to preserved business identity. The shared-range observation is handled honestly and usefully: accepted settings are not passed off as proof of complete convergence. The final proposed failure exercise tests complete purchases and recovery outcomes.

### editorial-1 · low · r48 · Give the database region information

Problem: after explaining the licence conditions of the native example, “No account, licence registration or existing cluster was used” reports author actions rather than a locality or reproducibility property the reader needs.

Effect: it briefly turns the early conceptual progression towards the author’s production process. The preceding version/product/entitlement condition already supplies the useful limitation.

Suggestion: remove that sentence, or retain only a concrete reader requirement in the reproduction material if one is needed.

Evidence: quoted sentence in the frozen rendered opening section, between the region-information example and table-locality explanation.

## Limits

Initial article coverage only: this is not independent final complete reading or corpus credit. Technical mechanisms, native timing, actual download saving, accessibility and production placement were not certified by this editorial assignment.

All successful piece media study used the exclusive fixed 1280×720/System browser window after root-authorised recovery of the shared-IAB 0-width environment. Broken earlier browser observations were not product evidence. No theme or article content was changed. The reference preview restoration before article study is an environment qualification shared with the batch10/12 reports.
