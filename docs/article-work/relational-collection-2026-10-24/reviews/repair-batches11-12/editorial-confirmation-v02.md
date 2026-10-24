# Editorial confirmation · articles r44/r48/r49/r51/r52 · repair-batches11-12-v02

This is a fresh **informed repair confirmation**, not blind first coverage, a blind final reading or corpus credit. All seven editorial checks were applied to each complete current piece. The r49 reading additionally assesses its complete current coherence for the security-only entry audience and the prepared operational branch.

Highest severity: **medium**. The assigned repairs pass locally. There is one new first-use/opening finding in r49.

## Inputs read

- Assignment: `editorial-confirmation-v02-assignment.txt`; current `staycurrent-review/SKILL.md` and only `perspectives/editorial.md`.
- Frozen input identity: `v02/manifest.json`, version `repair-batches11-12-v02`, frozen 24 October 2026 at 07:39:44 UTC, 182 curated files. Manifest SHA-256 recorded by the rendered supplement and checked directly: `a4bdc2b72a6053938e4a555b77b87bffeb1c3e30bf6c4cea1d18d3979abf54eb`. The manifest supplies the article routes below. The manifest was read as input identity; its source, context and mechanical contents were not read.
- `v02/audience.md`, including the distinct security and node-maintenance starting knowledge for r49.
- Complete built HTML corresponding to the immutable preview `http://127.0.0.1:4550/review/relational-collection/`, read from its manifest-named output `/private/tmp/staycurrent-relational-batches11-12-v02-author/`. Routes: `cockroachdb/keys-and-ranges/` (r44), `cockroachdb/locality/` (r48), `cockroachdb/operations/` (r49), `cockroachdb/schema-changes/` (r51), `cockroachdb/upgrades/` (r52). Reading included opening, all sections, code, tables, captions, controls, disclosures, complete final Sources outside the article body, text alternatives and the reader-facing state-explanation strings from the built pages. No article-source or runtime-mechanics review was performed.
- `rendered-current-v02/manifest.json` and all four raw current image exports: `r44-figure1-split-customer.png`, `r44-figure1-phone.png`, `r51-figure1-complete.png`, `r51-figure1-phone-conversion.png`. These were independently viewed as rendered pieces; no associated author verdicts or measurement records were read.
- Focused fixed-reference calibration, from the same build's `review/examples/{sequences,indexes,storage}/index.html`: Sequence diagrams opening through lifelines, Figure 1 and its explanation, first-use labels, Figure 2's introduction/caption/control labels; Indexes opening, sequential-scan model/measurement distinction, index entries and row locations, Figure 2 and clustered-table explanation, B-tree introduction and Figure 3's labels/caption; Storage and durability opening, promise limits, Pages introduction, Figure 1's caption/qualifications, row-location explanation and the first Buffer pool drawing's text. These passages establish concrete headings, locally prepared vocabulary, directed figure reading and qualifications placed beside the reasoning they qualify. This focused confirmation did not reload every passage or drawing in all three references.

Withheld: plans, briefs beyond the permitted audience, source implementation, mechanical receipts, history, earlier versions, peer reports, author teaching/quality notes and approvals. No r19/r34 full-reference reload was required or performed.

## Checks · r44 · CockroachDB keys, ranges and replication

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title and section sequence name the key representation, range boundary, serving authority, agreement and remaining hotspot. |
| 2. Plain sentences | pass | The primary/secondary distinction is developed through the same three orders; the new Figure 1 title says directly which two arrangements are shown. |
| 3. Terms | pass | Primary order, secondary entries, range, gateway, leaseholder, Raft leader and non-voter are introduced before their consequential uses, against the stated general index/replication starting knowledge. |
| 4. Openings | pass | The opening establishes the ordered map and explains why a node is not an owner of an entire table or database. |
| 5. Reader-facing text only | pass | Model and native-run limits tell the reader what to infer; no editorial-process aside is present. |
| 6. Captions and labels | pass | “The same rows in primary and customer-index order” matches both visible panels. Layout/Read labels name the two independent choices; the state explanations say which primary ranges are fetched. |
| 7. One piece | pass | The split example prepares range ownership; the lease/majority distinction then supports the concluding diagnosis of different hotspot shapes. The changed caption fits that development. |

Assigned problem result: **confirmed repaired**. The actual desktop image shows Mina's adjacent secondary entries reaching primary rows 101 and 103 on different sides of the split, while the phone image shows the whole revised title wrapping intelligibly above Layout and Read. The title names the drawing's content without a pun to decode. The surrounding invitation to split before 103 and select Mina, all four selected-read explanations, and the following unchanged-answer paragraph remain aligned. Like Indexes' “Building an index on customer_id”, the title names the operation/arrangement the reader can inspect. The symbolic-key and one-node-run limits remain useful and placed with the model or observation they constrain.

## Checks · r48 · CockroachDB table locality and region survival

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings separate region information, row/table homes, reference reads, survival and inspection. |
| 2. Plain sentences | pass | The two shops make the locality choice concrete; removed shared-fact/author-process language leaves direct transitions. |
| 3. Terms | pass | Node region labels, primary region, REGIONAL BY TABLE/ROW, crdb_region, GLOBAL, survival goal and voters receive local explanations before the inspection conclusions. |
| 4. Openings | pass | Two different shop homes establish why row and table homes differ; the opening explicitly separates access efficiency from surviving failure. |
| 5. Reader-facing text only | pass | Remaining statements about the projection, empty reference table, licence grace period and incomplete placement observation describe the evidence's usable scope. |
| 6. Captions and labels | pass | Table policy and Operation name the choices; all six explanatory alternatives distinguish read/update contracts, and the caption explicitly excludes a replica map or measured route. |
| 7. One piece | pass | Policy choice leads into regional key/rule consequences, then survival arithmetic, desired-versus-observed placement and an appropriate deployment test. The cuts introduce no jump. |

Assigned problem result: **confirmed repaired**. The prose now moves directly from the order projection to the default region behaviour, and from GLOBAL's SQL to what an empty inspection table can establish. It retains the useful limits: CockroachDB 25.4.17 and ephemeral no-key conditions; no shop 20 purchase history added; empty reference table; six local processes on one host; policy acceptance distinct from the shared range's observed five voters and incomplete convergence. The final inspection and deployment exercise develop those limits into an action for the reader. This resembles the fixed Indexes reference's explicit invented-versus-measured boundary and Storage's qualification of the durability promise: the limitation changes the reader's interpretation and is not an account of writing the article.

## Checks · r49 · Operating and securing a CockroachDB cluster

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title accurately promises both authority and maintenance; the sections name the task, forbidden neighbour, range health and safe removal. |
| 2. Plain sentences | pass | Connection trust, effective SQL authority and the fixed tenant policy are connected explanations. The new two-paragraph health entry is plain and locally useful. |
| 3. Terms | finding | The opening uses “range” and its “majority” before the security-entry reader has either preparation or explanation; see editorial-1. The later operational definitions are sound as an editorial sequence. |
| 4. Openings | finding | The security example is prepared, but the parallel range-health example assumes the operational model before the explicit branch; same issue, editorial-1. |
| 5. Reader-facing text only | pass | The new branch tells the reader which preparation to use and why. Fixture, identity-model and one-host limits qualify actual operational conclusions. |
| 6. Captions and labels | pass | The removal caption says when the replacement can vote; the full states distinguish copying, membership transition, completed replacement and spent failure allowance. |
| 7. One piece | pass, with opening finding | After the opening issue, security acceptance is complete before the operational branch begins. That branch prepares range health and removal, and the concluding scope and onward maintenance/recovery links follow their consequences. |

Assigned transition problem result: **confirmed repaired locally**. “The connection and permission tests above can be used on their own” makes the two entry paths explicit. The next sentences name and link Keys, ranges and replication (`/review/relational-collection/cockroachdb/keys-and-ranges/`) and Rebalancing and cluster change (`/review/relational-collection/rebalancing/`), explaining what each supplies. The following paragraph defines a node, range, replicas and leaseholder, distinguishes lease movement from replica copying, and explains the allocator's dependence on eligible capacity. These are connected preparation, not unexplained lists of unfamiliar nouns.

The complete downstream operational reading works: per-range availability leads to unavailable/under-replicated distinctions; intended placement is compared with actual voters, localities, leases and capacity; draining is distinguished from permanent decommissioning; the A/B/C-to-B/C/D example makes the next failure tangible; the preflight and completion paragraphs use precisely those earlier distinctions. The full security reading likewise retains effective identity after pool setup, a populated forbidden neighbour and permitted edit, then separate backup/changefeed routes. The native scope explains what these mechanisms cannot prove in an actual deployment. This sustains the references' approach of deriving a practical reading from one worked example. The sole new issue occurs before that otherwise coherent branch, as detailed below.

## Checks · r51 · CockroachDB schema jobs under load

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The sections name design choice, job evidence, resource budget, semantic acceptance, uniqueness and DDL boundaries. |
| 2. Plain sentences | pass | The decimal-to-hundredths example develops one chosen compatible design, then distinguishes its completion from application acceptance. |
| 3. Terms | pass | STORED, authority, job states, progress fraction and CONCURRENTLY are explained at their consequential uses against the migration starting knowledge. |
| 4. Openings | pass | The opening explains why statement, job, workload and final data provide different evidence, then gives exact familiar prices. |
| 5. Reader-facing text only | pass | The host-setting aside is gone. The 64 MiB failure, 256 MiB process-local retry and synthetic workload limits remain relevant evidence about the operation. |
| 6. Captions and labels | pass | The complete current figure names both lanes, the independent acceptance question and writable decimal/derived hundredths. The phone conversion uses downward arrows and retains the same direction and ×100 meaning. |
| 7. One piece | pass | Computed-column limits are attached to that design; resource observations prepare the operational advice; value acceptance precedes application receipts and uniqueness acceptance. The cut leaves this chain intact. |

Assigned problems result: **confirmed repaired editorially**, with visual certification reserved. The raw complete drawing visibly presents “Decimal price / Writable authority → ×100 → Stored hundredths / Derived; cannot be assigned independently”; the phone export preserves that reading vertically. Both retain the explicit conceptual caption and integer-only-interface limit. The complete current prose consistently maintains decimal write authority through the SQL, the forbidden independent assignment, acceptance query and final boundary. The two-lane drawing does not imply that job success proves receipt correctness or retires old callers.

The removed host-setting aside causes no lost explanation: the surviving text reports the deliberately constrained process allowance, repeated BulkAdder failure, rerun and functional concurrency scope. Its “not a minimum production sizing rule” qualification changes the interpretation of the observation and belongs there. As in the reference's invented/observed distinction, it earns its place. No live colour measurement or contrast threshold is certified by this editorial reading.

## Checks · r52 · Upgrading a CockroachDB cluster

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | “Check cluster health and application behaviour before each restart” explicitly names the two checks and when to perform them. |
| 2. Plain sentences | pass | Binary version, compatibility version, preserved return interval and finalisation are kept distinct through the rehearsal. |
| 3. Terms | pass | Finalisation and compatibility version are introduced at the start; the intended reader already has the operational/range model, and temporary stop versus decommissioning is restated where needed. |
| 4. Openings | pass | Two versions explain why all-new binaries are insufficient and why the acceptance interval matters. |
| 5. Reader-facing text only | pass | Version pinning, licence conditions and tiny local-run scope qualify the example and its production use. |
| 6. Captions and labels | pass | Binary labels, cluster-version states and return/recovery messages distinguish each stage; the caption identifies a conceptual transition and omitted patch numbers. |
| 7. One piece | pass | Supported path and return policy prepare the player; restart health, return rehearsal, finalisation and history recovery follow the same boundary. The concrete heading fits its existing content. |

Assigned problem result: **confirmed repaired**. Both the contents text and visible section title give the concrete health/application question. The following paragraphs implement it: degraded range margin, routing/reconnection, safe temporary stop and rejoin, binary and cluster-version inspection, representative semantic checks, and permission to continue based on evidence. The later mixed-version rehearsal and finalisation acceptance depend on exactly that preparation. No wording asks the reader to infer what a vague “operating state” heading means. This is the same direct naming standard as the references' “Index entries and row locations” and “Replies and activation bars”.

## Findings

### r49 editorial-1 · medium · opening, first paragraph

Problem: The opening says “A range may still have a majority, but no room for another failure.” The specified security-entry reader knows general least privilege and tenant ownership, but need not yet know CockroachDB ranges, voting replicas or what this majority counts. The article's useful preparation and definition arrive only after the two security sections, at “Read health at the range”.

Effect: A reader entering for the independently usable security path must supply the operational model to understand the second example in the article's initial comparison. The later branch solves preparation before the health procedure, but it does not explain this earlier first use. This is a small location with a substantive prerequisite effect, rather than a request to teach the whole operational model twice.

Suggestion: Express this opening failure-margin example in ordinary terms intelligible without range/voter terminology, or explain the minimum meaning locally. Preserve the focused range/lease/allocator preparation at the operational branch.

Evidence: The complete rendered first paragraph and `v02/audience.md`'s separate starting knowledge for security versus node health/removal. Compare Sequence diagrams' first paragraph, which explains lifelines/messages before depending on them, and the current r49 health entry, which itself demonstrates the needed local preparation.

## Limits

The read-only HTTP attempt was blocked by the local network sandbox; the exact manifest-named built HTML was used instead. No browser or CUA action was taken, preserving the visual reviewer's exclusive lease. Current raw r44/r51 rendered exports resolved the affected caption/authority reading without a live window. Other figure judgements concern complete built text, labels and alternative explanations rather than new live pixel/control inspection. No timing, animation playback, keyboard operation, live contrast ratio, theme sweep, download saving, native execution, technical source challenge, publication or deployment is certified here. No peer or author verdict was reused. The new r49 finding requires a local repair and fresh relevant confirmation; this report does not provide completion approval.
