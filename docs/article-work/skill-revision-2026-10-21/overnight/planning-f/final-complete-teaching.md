# Teaching review · complete tree reading · latency percentiles · F-TREE-r02

Highest severity: medium

## Scope and input binding

Fresh blind teaching reading of the complete proposed two-article learning journey, root → child. This is a judgement of plans, proposed explanations and proposed media, not article prose. Applied all seven teaching checks. Finding numbers begin at teaching-2 as assigned; no earlier findings were supplied or read.

Working source root: `/private/tmp/staycurrent-skills-night-f`.

Frozen manifest read: `/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/planning-f/tree-r02-manifest.json`, version `F-TREE-r02`, frozen `2026-10-22T01:27:46.746137+00:00`. All four frozen inputs matched their manifest SHA-256 hashes during this reading:

| Input, relative to working source root | SHA-256 |
| --- | --- |
| `docs/coverage/latency-flow.yaml` | `b40d4fc67a2ef18d15d9f1653922c6ae3fe6c77d2e241d837cccc7062edf5714` |
| `docs/coverage/latency-flow-child.yaml` | `5e8754a75d1b807cc28a3f9bd309fd5fc42aacc8a995a1acf322b955a541bf74` |
| `docs/coverage/latency-flow-example.md` | `7072b62d2d9a54f6b6cc25a552bdf6ca4a6b7699b8b247c4fd419ce4dd4748c2` |
| `docs/article-work/latency-flow-trial/commission.md` | `debfe7b4d4f4866a8253fdb0dec770fa05a3e9b118afde709f157ddb75ecddaa` |

The complete embedded child and standalone child are structurally equal after YAML parsing.

Also read local `AGENTS.md`, `README.md`, `docs/site-direction.md`, `.agents/skills/staycurrent-review/SKILL.md` and only its teaching perspective. Read all three fixed reference articles in full, including their captions, tables, code examples, figure descriptions and component calls. Followed their teaching-bearing component sources and scripted narration: SequencePlayer and the article's booking/waiting/email/outbox/order/fragments/scope/loop/par/design scenarios; all eleven Indexes figure components and their fallback/step text; Storage StepFigure and its ten article scenes, including alternative controls' step text. No browser was used.

Reference source hashes:

| Reference | SHA-256 |
| --- | --- |
| `src/reference-articles/sequences.astro` | `76271603ba4d560eac9c7398ea7c0a24e0d53f3cdaaa67bf0ec50c05654d95ba` |
| `src/reference-articles/indexes.astro` | `16b4f695d15e0dc8ba505133421e75e7733d265196a78fa3c892c020cc4bf172` |
| `src/reference-articles/storage.astro` | `92d7c366afc9ad0cb8fbcfd98fc12b87ed7a5674ea73b558e15b9052ae19a004` |

Withheld and not read: earlier versions, findings, reports, decisions, planning records, writer's notes, other candidate cases, coordinator opinions and agent inventories. References in the plans to planning-record files were not followed.

## UTC intervals

- First recorded review timestamp: `2026-10-22T01:31:16Z`.
- Reading, cross-article progression and input-binding checks: `2026-10-22T01:31:16Z` to `2026-10-22T01:32:55Z`.
- Assessment and report preparation: `2026-10-22T01:32:55Z` to `2026-10-22T01:34:01+00:00`.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | finding | The observation, population and percentile are introduced from requests and percentages; the root's cause section nonetheless relies on tracing vocabulary whose explicit introduction is in the child. See teaching-2. |
| 2. Order | pass | Boundary → ordered observations → objective → comparable populations → retained information → cause is a sensible root progression. The child establishes timers, outcomes and window membership before aggregation and comparison. |
| 3. Examples | pass | W0 carries the basic arithmetic and aggregation. Independent named fixtures handle retries, timeouts, interval edges, stage pairing, changed request mix and omitted offered work without silently modifying W0. |
| 4. Showing | finding | Rank strips, threshold counts, mixed-class tables, outcome ledgers and collection audits specify concrete views. The concurrent-path part of the root's cause explanation lacks its corresponding worked representation. See teaching-3. |
| 5. Judgement | pass | The reader is asked to identify what a chart describes, test the declared objective, separate mix changes from within-class changes and name missing evidence before accepting an improvement. Conditional decisions appropriately stop short of inventing a cause or successful benchmark. |
| 6. Gradual exposure | pass | Interpretation is owned by the root; instrumenting, representation, collection auditing and traffic generation belong to the child. The root offers enough high-level histogram context before the deeper query workflow. Neither database tuning nor a third article is required to complete the commissioned measurement decisions. |
| 7. Placement of additions | pass | No change inventory was provided, so every current proposed explanation/media placement was assessed without assuming an addition history. The W-mix table belongs after pooling and before histograms; the child reminder belongs in the final comparison worksheet. Other media sit with the decisions they resolve. The showing gap is recorded separately. |

## Whole learning-journey judgement

The proposed journey is coherent and substantially fulfils the commission at plan level. A newcomer can start by naming the timed events and eligible work, sort a small finite population, see the relationship between a percentile and an explicit objective, and recognise why an attractive chart can describe a different population. W-mix supplies a particularly useful decision: the pooled p99 rises while neither stipulated read variant changes, yet more requests receive the slower variant. The plan asks for matched class distributions, counts and errors as the next evidence, rather than treating equal class p99s as proof about their complete distributions.

The continuation has a practical organising thread: produce evidence and audit where it may lose work. W-retry makes the operation-versus-attempt denominator tangible; W-timeout keeps a failed caller duration distinct from an unknown successful completion; W-edge demonstrates that equal counts need not mean equal cohorts. The same W0 then supports a concrete representation choice, bucket resolution, worker aggregation and an external count audit. Sampling support and W-arrivals extend the question to evidence that never entered the completed histogram. The final worksheet brings these decisions back to accepting or withholding a performance claim.

These are useful boundaries within two articles. The references calibrate the desired help: one concrete situation, introduce the abstraction beside it, then show what changes before asking the reader to judge. Most of this tree meets that standard in its planned media. The two local cause-section gaps below should be resolved before calling the teaching plan complete. They do not require widening the commission or moving the measurement workflow into the root.

## Findings

### teaching-2 · medium · root, “Follow the slow requests to a cause”, latency-flow.yaml:233

Problem: The root asks the reader to use “correlated request records/traces” to choose a causal investigation, but does not assign an introduction to a trace or to how records are recognised as belonging to the same caller operation. The explicit trace definition is in the child's “Keep groups useful and small” subsection (standalone child lines 33–34). On the intended root-first route, that explanation is still ahead; the root also promises to serve someone interpreting an existing dashboard without requiring the measurement continuation.

Effect: The reader can learn that stage percentiles cannot be added yet still has to supply the observability concept needed to obtain the paired evidence. “Look at traces” becomes an unexplained next action at the exact point where the root is meant to help select a measurement that distinguishes causes.

Suggestion: Give the root a short local introduction to linked records from one operation, the common identity used to pair its stages and what elapsed intervals those records reveal. Let the child remind and develop that idea for labels and selection policy. A simple pair of identified request records can do this without introducing a tracing product or tutorial.

Evidence: Root lines 229–235 promise a move from symptoms to paired causal evidence; the shared W-stages fixture supplies paired durations but no definition of tracing. The child's later definition cannot prepare the root-first reader. This is a planned prerequisite/ownership gap, not a judgement of unwritten sentence quality.

### teaching-3 · medium · root, “Follow the slow requests to a cause”, latency-flow.yaml:232

Problem: The brief requires explaining “sequential sums and concurrent critical paths at the single-request level” before reading aggregate stage metrics, but the named W-stages table only contains two serial stages with no overlap or gap. Neither this heading nor the shared example specifies a concurrent dependency/timing case or the figure/worked example that will show which overlapping work determines caller completion.

Effect: The serial arithmetic shows why adding stage p95s fails, but cannot show how even individual stage durations relate to elapsed request time when work overlaps. The intended newcomer must supply the dependency/overlap model to understand the critical-path qualification and apply the root's stage-measurement judgement to concurrent requests.

Suggestion: Specify one compact, explicitly invented single-operation timeline or worked dependency example next to this explanation: identify overlapping intervals and the point the caller waits for, then compare elapsed time with the sum. Keep it separate from W0 and the serial W-stages fixture. The existing serial table can continue to own the aggregate-percentile counterexample.

Evidence: Root lines 230–234 assign both serial and concurrent reasoning. `latency-flow-example.md:33` explicitly stipulates that all W-stages work is serial, without overlap. The root's initial caller/service timeline is required to show nested spans and queue time, but is not assigned a concurrent branch or join. Unlike the other hard parts, this one is named without a concrete showing brief.

## Limits

No prose exists, so this assessment cannot establish final coherence, wording, actual term introductions, figure legibility or control behaviour. It evaluates the complete proposed teaching journey and whether its briefs provide enough help. All fixture arithmetic is treated as invented teaching data, not observed execution. No Prometheus query, instrumentation, service, load generator or native performance result was executed or certified. No build, server, browser, team, commit or push was used. No input was edited. Practitioner and value review are outside this assignment; no technical-source validation is implied by the teaching passes.
