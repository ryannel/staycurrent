# Teaching review · breakdown · Understanding latency percentiles · latency-root-v1

Candidate: D-02. Bare topic: **Latency percentiles**.
Started UTC: 2026-10-21 21:52:42. Completed UTC: 2026-10-21 21:54:39.

Inputs read: [root-manifest.json](root-manifest.json), [commission.md](commission.md), and all three manifest-named immutable snapshot files: [root plan and contextual child stub](snapshots/root-v1/docs/coverage/latency-percentiles.yaml), [canonical example](snapshots/root-v1/docs/coverage/latency-percentiles-example.md), [registry](snapshots/root-v1/docs/article-work/latency-skill-trial/registry.json). All three snapshot SHA-256 hashes match the manifest. There is no parent or sibling plan; the child has only the contextual stub, as commissioned.

Calibration: the assigned archived staycurrent-review skill and only its teaching perspective; Sequence diagrams, Indexes, and Storage and durability read in full as source, including inline tables/listings, figure captions and instructions, plus the figures' authored scenario/state/narration definitions and imported Indexes SQL listings. These are the fixed references under `/private/tmp/staycurrent-skills-night-topic/src/`. No planner records, earlier reports/findings, other experiments or coordinator opinions read. Commission links to planning-record.md and example-proposal.md were not followed.

Highest severity: **medium**.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Applicable to the whole root and child hand-off. Latency and distribution lead to ranks/percentiles; measurement boundaries, logical requests and attempts precede budget accounting; histogram follows the pooling problem. No database or statistics prerequisite is assumed. |
| 2. Order | pass | Applicable to planned progression. Ranked requests → whose wait → useful budget → pooling → evidence limits → decision is coherent. The hardest rank/aggregation/sample concepts have explicit displays. The two missing demonstrations are recorded under showing. |
| 3. Examples | finding | The shop, fixed core distributions, deliberately uneven instance split and separately labelled small-window extension carry the argument. The all-success, unclassified core cannot itself carry the failure and workload-mix cases in teaching-1 and teaching-2. |
| 4. Showing | finding | Sorted requests, request timeline, Budget table, two-instance counterexample and count/window comparison specify what the reader should inspect. The budget section does not specify changing-state/worked evidence for two consequential exceptions; see teaching-1 and teaching-2. |
| 5. Judgement | finding | The final release record provides the right categories and accept/investigate/measure-again outcomes, distinguishing arithmetic from causal and future claims. Its outcomes-and-class checks need the earlier worked support identified below. |
| 6. Gradual exposure | pass | Applicable. The root answers interpretation and aggregation before offering the Prometheus implementation. The child continues the same example and owns buckets, query operations, estimator error and coordinated omission, with explicit worked displays. Its headings are correctly uncommissioned. |
| 7. Placement of additions | not applicable | No coordinator-named additions were supplied. This is a first independent review of the frozen plan. |

## Findings

### teaching-1 · medium · Count requests that meet the budget — Budget table and outcome accounting

Problem: The only specified Budget table compares 990/1,000 with 980/1,000 in datasets where every request succeeds. The brief requires failed and timed-out requests to remain visible and says fast errors cannot improve compliance, but it does not require an outcome-bearing worked variation. The example record permits such an extension and constrains its correctness without actually commissioning one.

Effect: The newcomer can repeat the rule yet has no planned calculation showing how a fast error and a caller deadline affect the timely-success numerator and eligible-request denominator. The article's practical decision requires this distinction precisely when a favourable latency summary may conceal failed work.

Suggestion: Extend the existing Budget table with a small, explicitly labelled shop variation containing timely success, fast failure and caller deadline. Show every eligible logical request's membership in the numerator and denominator, and the resulting fraction; preserve unknown eventual completion as unknown. Keep this in the root beside the budget definition, where the reader needs the distinction.

Evidence: Root budget brief specifies only the two core fractions; canonical example's Core datasets states that every request succeeds, none retries and none is unfinished, and its outcome extension is conditional rather than a required worked case. Commission explicitly requires evaluating the budget without concealing failed or timed-out attempts.

### teaching-2 · medium · Count requests that meet the budget — changed request mix

Problem: The brief asserts that a changed mix can move the overall percentile while each class is unchanged and instructs the writer to separate classes, but specifies no worked comparison that makes this happen. Neither core dataset identifies classes. The final Release comparison record asks for matching classes without providing that missing demonstration.

Effect: A newcomer must supply the relationship between class counts, the pooled ranked set and the apparent release change. This weakens the promised ability to recognise a workload-mix explanation rather than merely remembering that mix should be checked.

Suggestion: Add a compact, labelled variation of the same history operation with two meaningful request classes. Keep each class's durations fixed, change their counts, then show the class results and pooled percentile in both windows. Place it with the existing mix discussion; it can reuse the ranked-set explanation without adding a new statistics topic or child.

Evidence: Root budget brief's final sentence and the final decision brief require class comparison; canonical core tables contain duration/count columns only. In the reference Indexes article, SelectivityFigure holds the same rows fixed while changing their placement, exposing exactly why the practical judgement changes; the latency plan specifies that sort of contrast for instances and sample counts but not mix.

## Limits

This judges specified teaching, ownership and progression, not unwritten prose, an implemented child, observed telemetry or a causal release regression. Numerical examples are explicitly constructed. No build, server, rendered-page inspection, control use or service execution was performed; reference figures were read through their authored definitions, not visually verified. Technical/source verification and implementation/visual quality remain outside this teaching breakdown judgement. Only this report was written; no plan or source was changed and nothing was committed, pushed or published.
