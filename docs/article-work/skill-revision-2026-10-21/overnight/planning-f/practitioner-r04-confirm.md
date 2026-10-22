# Practitioner confirmation · tree · latency-flow · F-TREE-r04

Inputs read: the four complete files and SHA-256 values bound by [tree-r04-manifest.json](tree-r04-manifest.json): the canonical tree, standalone child, shared example and commission in `/private/tmp/staycurrent-skills-night-f`. All four hashes match. Also read that checkout's AGENTS.md, README.md, site direction, review skill and practitioner perspective, breakdown skill and continuity skill. Earlier reports, decisions/history beyond the supplied accepted problem, other cases and agent inventories were withheld. This is an informed focused confirmation, not an independent complete first reading.

Highest severity: none.

## Scope

Confirm supplied accepted problem **F-PLAN04 (medium)**: the promised matched class-distribution comparison previously lacked a retained discriminator. Check the four changed child briefs — “Keep groups useful and small”, “Choose what information to retain”, “Follow every denominator through the pipeline” and “Assemble a comparison you can defend” — in both the canonical tree and standalone child. Read their surroundings, the root's W-mix comparison and the complete shared example, including the new retained-record extension and downstream worksheet requirements. The embedded child and standalone child are structurally equal, checked with Python/PyYAML.

The applied checks below cover the repair, surrounding explanation and dependencies. They do not repeat the earlier complete technical assessment or establish prose, rendered-media or implementation quality.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | The request option determines class before duration/outcome is known; complete records support the stated grouped and pooled reconstruction. Class-free W0 buckets cannot supply a discarded discriminator. Primary sources checked below. |
| Evidence | pass | W-mix is explicitly invented; record completeness and zero errors/timeouts are fixture stipulations. No instrumentation, query, service or load-generator run is claimed. |
| Coverage | pass | The repair follows capture, export, retention, interval selection, grouping, per-outcome counts, pooled reconciliation and the decision when the information is unavailable. Unknown classes remain visible. |
| Depth, both ways | pass | A logical record schema and worked frequency reconstruction provide the missing practical judgement without requiring a storage product, new metric label or algorithm tutorial. |
| Ownership | pass | The root owns interpretation of the changing mixture; the child owns retaining and auditing its evidence. The repair preserves the two-article boundary and creates no new owner or route. |

## Accepted problem result

**F-PLAN04: confirmed repaired.**

The first changed brief captures `request_class=status_only` or `status_with_session_details` from whether the caller requests session details. It defines the request metadata before using the field, links the root's predefined classes and carries the field unchanged into caller duration/outcome records, including errors and timeouts. Duration is explicitly excluded as the class discriminator. W0's unspecified class membership is not retrofitted.

The representation brief and example extension retain caller-operation identity, operation, captured class, terminal-event time, caller duration and outcome. Selection uses `operation=booking_status`, matched half-open five-minute terminal-event windows and all eligible outcomes. W-mix already stipulates that each operation starts and completes inside its own window, so this selection does not change membership. The extension expressly avoids inventing individual event offsets. Window timestamps and elapsed-duration measurement retain separate purposes.

Completeness is a requirement through collection and retention, not an assumption that emitting a record makes it available. The plan requires one terminal record per eligible caller operation, independent-ledger identity/outcome reconciliation, duplicate/missing-record checks and preservation of class metadata. Selected diagnostic traces cannot stand in for this complete population. Missing or invalid classes remain **unclassified**, stay in pooled eligible totals and leave the class comparison unresolved; matching only the pooled count does not prove correct class capture. The prescribed next action is a new comparable interval with the field retained, not inference from duration.

The worked extension supplies the field-to-frequency step that the promised comparison needs:

| Window | Status only | Status with session details | Unclassified | Pooled total | Success/error/timeout totals | Pooled nearest-rank p99 |
| --- | --- | --- | ---: | ---: | --- | --- |
| Before | 990 × 40 ms | 10 × 400 ms | 0 | 1,000 | 1,000 / 0 / 0 | 40 ms at rank 990 |
| After | 900 × 40 ms | 100 × 400 ms | 0 | 1,000 | 1,000 / 0 / 0 | 400 ms at rank 990 |

Every identity range is disjoint and exhaustive within its separately prefixed window. Before, `990 + 10 + 0 = 1000`; after, `900 + 100 + 0 = 1000`. Each window reconciles to its stipulated independent ledger of 1,000 starts, 1,000 terminal successes and zero opening/closing in-flight work. Errors/timeouts are known zeros here, not absent-series assumptions. Within-class nearest-rank positions are 981 and 10 before, 891 and 99 after; their constant-valued distributions yield 40 and 400 ms respectively. Pooling frequency counts before ranking yields 40 then 400 ms. Averaging or adding class p99s is not used. A small read-only Python arithmetic check reproduced these ranks and pooled values; it was not a service or instrumentation test.

The denominator brief carries the same class-plus-unclassified reconciliation into the pipeline audit. The final worksheet explicitly reuses the worked selection and reconciliation, carries the request option through retention and refuses to reconstruct the promised class comparison from W0's class-free histogram or a selected trace set. Its mixture-only conclusion applies to the complete stipulated W-mix distributions. The root additionally says that matching real class p99s alone would not prove unchanged full distributions. These dependencies agree.

## Sources checked

- [OpenTelemetry sampling](https://opentelemetry.io/docs/concepts/sampling/), checked 22 October 2026, especially “Tail Sampling”: selection may depend on errors, overall latency and span attributes. This supports the distinction between diagnostic trace retention and the complete population required here.
- [Prometheus data model](https://prometheus.io/docs/concepts/data_model/), checked 22 October 2026, “Metric names and labels”: labels supply the dimensions for filtering and aggregation. A dimension never captured in W0 is unavailable for a later class grouping.
- [Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/), checked 22 October 2026, “Overview”: histograms retain bucket counts, whereas precomputed quantile scalars cannot be pooled into the corresponding population quantile. The repair consistently reconstructs W-mix from retained duration frequencies.

Class capture from the stated request option is the plan's instrumentation design, not an asserted OpenTelemetry semantic convention. Its adequacy here follows from the fixture's predefined read variants and explicit retained fields.

## Continuity and applicability

The affected continuity chain is sound: root request-class definition → child reminder and metadata capture → representation/selection → denominator audit → comparison worksheet. Machine field values are mapped to the existing reader-facing class names. Outcome and terminal-event/window teaching precede the worked grouping. W-mix identities remain separate from W0, W-overlap and every other independent fixture.

W0 retains its original values, worker partition, labels, histogram boundaries and proposed classic/native query shapes. No class label is added to its metric. W-retry, W-timeout, W-edge, W-stages, W-arrivals, W-overlap and the independent sampling illustration retain their values and roles. The supplied repair changes retention and the affected workflow briefs rather than scope, article boundaries, reading order or public route state.

**Earlier complete technical and route judgements remain applicable to their unchanged areas; this repair creates no reason to widen them.** This conclusion concerns applicability, not a reapproval based on reading earlier reports. The affected technical example and its downstream decision have received the local confirmation above. Teaching placement/coherence confirmation remains a separate perspective responsibility.

## Findings

None. No new practitioner finding number is used; `practitioner-2` remains available.

## Limits

Planning-only confirmation. No article prose, rendered figures/controls, running service, Prometheus execution, load-generator execution, build or publication was checked or performed. The source checks establish the cited representation and selection behaviour; the fixture supplies the arithmetic and stipulated completeness. A later implementation must verify actual field capture, terminal paths, export/retention, timestamp policy and native query behaviour before claiming operational evidence. No source content or planned article was edited.
