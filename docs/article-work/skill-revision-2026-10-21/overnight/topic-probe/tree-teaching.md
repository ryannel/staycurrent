# Teaching review · tree · latency percentiles root and measurement child · LAT-TREE-r01

Inputs read: the four inputs bound by [tree-r01-manifest.json](tree-r01-manifest.json), frozen 2026-10-21T22:36:34.572080+00:00, candidate D-02 unchanged: complete root (including its nested child), complete standalone child, canonical shared example and commission. Confirmed the manifest once: all four SHA-256 hashes matched. Read frozen AGENTS.md, README.md, site direction, review SKILL.md and only its teaching perspective; all three fixed reference articles in full, with their figure descriptions, controls and scripted teaching steps from the relevant components/models. No prior approvals, findings, reports, planning records, other candidate outputs, agent inventories or coordinator quality opinion were consulted.

UTC record: preparatory input/reference reading began before the first captured clock reading. Captured review interval 2026-10-22T01:47:36Z–2026-10-22T01:49:39Z; reference/figure-step reading finished by 2026-10-22T01:48:48Z. The uncaptured preparatory start is a timing limit, not an inferred timestamp.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| T1 · Starting point | finding | Root supplies statistical and population prerequisites; child leaves the time-series concept implicit while using it to define labels and explain queries (teaching-4). |
| T2 · Order | pass | Ranked complete requests precede boundaries, outcomes, mix, pooling, representation loss and evidence judgement; child proceeds from recording to cohort reconstruction, histogram projection, querying, resolution and test validity. |
| T3 · Examples | pass | The same history operation carries the journey; core, pending, failure, mix, eligibility and scheduled-demand variations retain explicit identities and changed conditions. |
| T4 · Showing | pass | Briefs specify selected ranks, counts, timeline boundaries, pending bounds, failed averages, identical coarse ranges, event predicates, cumulative buckets, interpolation and intended/actual dispatch. |
| T5 · Judgement | pass | Release comparison and measurement handover connect each limitation to accepting a recorded result, investigation or collecting better evidence; neither claims causality or future guarantees. |
| T6 · Gradual exposure | pass | Root completes the conceptual decision independently; child owns recorder/query implementation, cumulative representation, estimation, format choices and offered-demand checks. |
| T7 · Placement of additions | not applicable | No coordinator-named additions were supplied for this first complete tree review; every planned passage/figure was assessed in its current position under T1–T6. |

## Whole planned journey

The root starts with a visible discrepancy that the reader can calculate, then qualifies what those calculations describe before using them for a budget. Pending and failed requests change the accounting in place; class mix changes the causal interpretation. The pooling example and identical-range-count counterexample earn their separate roles: one shows why percentile summaries cannot be combined, the other why retained distribution detail can still be inadequate. Returning to these cases in the final decision makes the cautions actionable.

The child builds on these meanings rather than resetting the statistics lesson. Its event fixture makes the start-cohort objective reproducible, while the separate histogram/query fixture keeps terminal observation, scraping and estimation visible. The later-completion fixture explains the ownership of a request across windows; the eligibility fixture checks the recording gate without changing the canonical traffic; the pause experiment makes missing offered demand observable without assigning durations to unsent requests. Database/resource diagnosis, general monitoring architecture and long-term reliability policy have named boundaries outside this commission. The standalone and nested child carry the same teaching route.

## Findings

### teaching-4 · medium · Child, “Observe terminal durations in Prometheus” → “Combine observations before asking for p99”

Problem: the introductory brief defines a label as a dimension of a **time series**, but never plans to explain a time series or how a metric name and complete label set identify one. Later briefs ask the newcomer to initialise label combinations, add selected series, retain `le`/class/outcome dimensions and interpret sampled counter histories. These operations depend on that missing data-model step; the root teaches request distributions, not Prometheus series.

Effect: a reader new to the measurement tool has to supply the connection between one terminal observation, the several cumulative bucket/count series it changes, repeated scrape samples of those totals and the groups selected by the query. Defining `rate`, `sum` and `by (le)` separately does not establish what their inputs represent.

Suggestion: at the existing child introduction, explain one series as timestamped readings for one metric name and complete label set. Follow one eligible terminal through a small before/after exposition or labelled diagram, showing which cumulative series change and how later scrapes sample them; reuse that identity when explaining `sum by (le)`. This belongs to the measurement child immediately before bounded labels/cumulative buckets. No new article is needed.

Evidence: standalone child lines 85–108 introduce counter/scrape/label and cumulative buckets, but no series definition; lines 126–145 select and combine series. The nested child repeats this dependency at root lines 177–231. Calibration: the fixed Indexes reference explains an entry and row location before building/searching the structure; Sequence diagrams explains participant/lifeline/message before reading the arrows; Storage explains memory/disk and pages before following their movement. Here the missing unit is what a scrape/query holds and groups.

## Limits

This is a review of planned teaching progression and figure/worked-example briefs, not finished prose, implemented media or execution evidence. The 100-request comparison and single-request timing split remain explicitly writer-supplied extensions; their eventual complete data and explanations require article review. No service, recorder, Prometheus query, browser, build or development server was run. Technical implementation correctness, supported versions, native execution, actual fixture output, visual usability and publication readiness are not established. No source plans were edited and nothing was committed or pushed; only this report was written.
