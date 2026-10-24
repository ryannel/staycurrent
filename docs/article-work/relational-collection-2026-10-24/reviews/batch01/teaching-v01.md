# Teaching review · article batch · r00, r01, r02 · batch01-v01

Inputs read: the fixed [manifest](v01/manifest.json); all four files in its `context/` (commission, complete tree, briefs/outcomes and authoritative example); the complete rendered r00 introduction, r01 modelling and r02 values at `http://127.0.0.1:4370/review/relational-collection/` and its `modelling/` and `values/` destinations, including Sources, captions, controls and disclosure text. No article source, writer notes, mechanical results, other quality reports, earlier drafts, decisions or repair history were consulted. The manifest identifies the frozen version as `batch01-v01`, frozen at 2026-10-23 23:39:05.372082 UTC.

Calibration: complete fixed reference text delivered in 19 separate bounded outputs with `python3 scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6, each with a 6,000-token command budget. Every END marker was present. Text hashes were sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`, indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1` and storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`. All 34 finished default reference drawings were studied with their explanations at port 4350 in owned temporary browser tabs: sequences 1–13, indexes 1–11 and storage 1–10. Large drawings were read across views; initially obscured finished storage states were recovered explicitly. Root separately confirmed its actual-delivery audit passed 19/19 outputs. That audit supplied no article quality findings.

Timing: preparation began before the first recorded clock reading; its exact start was not captured. Full reference readiness was reported at 2026-10-23 23:44:38 UTC. The complete frozen article reading and relevant figure/control study followed, finishing by 23:46:55 UTC. Report and tab cleanup were complete at 23:48:14 UTC. This is fresh independent complete first coverage in ARTICLE BATCH mode, not a confirmation or a final blind reading.

Highest severity: none.

## r00 · Relational databases

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Begins with stored application facts; table, column, type, primary/foreign key, schema, NULL and SQL are introduced before the argument depends on them. |
| 2. Order | pass | Identity and order-line grain precede joins; joins precede aggregation and multiplication; grouped changes precede the two-buyer race. Atomicity is established before its limits become the question. |
| 3. Examples | pass | The shop carries normal matches, Edda with no orders, order 101's two independent many sides, unpaid order 103 and two competing purchases. The rewind before 103 is explicit. |
| 4. Showing | pass | Customer selection shows zero/many related orders; receipt steps show inputs becoming two result rows; private/committed views show the atomic boundary; the race contrasts two complete unsafe purchases with one admitted conditional update. |
| 5. Judgement | pass | A reader can distinguish identity, reference integrity, query grain, atomicity and concurrent admission, and can explain why a non-negative stock check and a transaction alone do not prevent the saved-value race. Fit and cost are tied to those examples. |
| 6. Gradual exposure | pass | The introduction supplies usable answers before handing deeper result construction, isolation, locks, log ordering, retries, outboxes and recovery to their owners. The next-route choices follow questions already encountered. |
| 7. Placement of additions | not applicable | No coordinator-named additions were assigned. The whole current piece was nevertheless judged in its delivered order. |

### Whole-piece judgement

The introduction develops an initial working model, rather than presenting a catalogue of database features. The receipt establishes why keys matter to a query's result as well as to stored identity. Order 101 then provides an intelligible reason to distrust a naive total, while the worked report gives the high-level answer before deferring its full SQL. The stock example makes the distinct jobs of constraints, atomicity and isolation necessary. The reader has grounds for choosing a next route and for recognising where the introductory protocol stops.

### Findings

None. No `teaching-1` finding is opened for r00.

## r01 · Relations, keys and normalisation

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Uses the introduction's orders, lines, keys and agreed price; defines grain, candidate/super/natural/surrogate keys and functional dependency when introduced. The formal normal-form disclosure defines its extra terms locally. |
| 2. Order | pass | Row meaning leads to identifying values, then determinants, anomalies, decomposition and named normal forms. The reason to split has been demonstrated before the classification is supplied. |
| 3. Examples | pass | One sales sheet derived from the same five lines carries update, insertion and deletion cases; the surrogate variant tests business identity; the later catalogue price tests apparent duplication. |
| 4. Showing | pass | The determinant map locates each dependency, the alternative designs expose four name-edit locations versus one and the loss of Tariq versus his retained customer row, and the price comparison preserves 20.00 while the catalogue becomes 25.00. Reconstruction is worked through named keys and a complete query. |
| 5. Judgement | pass | The reader can choose a grain and minimal identifying set, challenge sample-only uniqueness, separate independently changing facts, check a retained association and distinguish an agreement from a maintained derived copy. |
| 6. Gradual exposure | pass | Core modelling reasoning stays here; enforcement, lifecycle decisions, value semantics and measured query work are handed to their owners after the local decision is answered. More formal overlapping-key/BCNF detail remains optional. |
| 7. Placement of additions | not applicable | No coordinator-named additions were assigned. All current passages and figures were assessed for their place in the argument. |

### Whole-piece judgement

This earns its continuation from the introduction. It turns the introductory advice about keeping facts separate into a method: state the row's meaning, ask what must determine each fact in every valid future state, try independent changes, and reconstruct the original associations. The anomaly figure is especially useful because it shows why repetition of a customer ID is appropriate while repeated editable current names are troublesome. The agreed-price case then prevents that reasoning becoming a blanket prohibition on repeated-looking values. The final maintenance contract makes deliberate denormalisation a decision with obligations rather than an unexplained exception.

### Findings

None. No `teaching-1` finding is opened for r01.

## r02 · Values, missing data and equality

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Builds from the introductory typed columns and row identity. Cast notation, numeric precision/scale, instants, zones, collation, Unicode normalisation, predicates and unknown are explained at their first consequential use. |
| 2. Order | pass | Known amounts, times and text comparisons establish representation choices before absence changes comparison. NULL filtering precedes substitution, ordering, checks and uniqueness. |
| 3. Examples | pass | Core receipt arithmetic carries exactness; a labelled rounding calculation exposes a changed charge; S501 and the 25-hour local day expose time choices; P7/p7 and the two café encodings expose equality; the three delivery notes carry missing/empty/non-empty cases. |
| 4. Showing | pass | SQL and explicit results show floating-point inequality, rounding order and Unicode equality; the two clocks show one instant; the NULL figure retains all three source rows and traces condition result to WHERE inclusion under changed predicates. |
| 5. Judgement | pass | The reader can choose exact representation and a rounding boundary, distinguish an event instant from a local schedule, align lookup and uniqueness equality, and deliberately include/exclude missing values. CHECK/NOT NULL and optional-code examples show why comparison, presence and uniqueness are separate decisions. |
| 6. Gradual exposure | pass | Values owns the semantics. Join absence queries, full aggregate behaviour and constraint implementation receive explicit hand-offs after enough local reasoning to understand the choice. |
| 7. Placement of additions | not applicable | No coordinator-named additions were assigned. All delivered examples and figures were assessed in place. |

### Whole-piece judgement

The article develops practical choices through small counterexamples instead of relying on a list of type recommendations. Its strongest sequence is equality, negation, explicit absence testing, inclusion policy and substitution: order 103 visibly disappears from both ordinary comparison answers, then returns when the question explicitly includes NULL. The known absence of payment rows gives zero substitution a reason that an unknown payment amount would lack. Earlier sections similarly show how two exact calculations can still implement different charging rules, and how identical-looking text can differ under an identity rule. These are sufficient grounds for the intended representation and predicate decisions.

### Findings

None. No `teaching-1` finding is opened for r02.

## Batch continuity observations

The finished route r00 → r01 → r02 preserves prerequisites and gives each return to a shared fact new work. The introduction establishes the order-line key and price agreement; modelling uses them to derive dependencies and test duplication; values uses the same agreement to make exact arithmetic meaningful. r01's lossless reconstruction relies on joins already taught in r00. r02's NULL explanations extend the introductory marker without requiring a later join article first.

The example boundaries remain legible: r00 rewinds before the purchase race, r01 labels the later-price history and schema alternative, and r02 labels class, delivery-note and scratch-code variants. The teaching reader is not asked to reconcile them as one execution. Planned neighbours are visibly distinct from the three available drafts. These are continuity observations about this batch; they do not assess the unwritten collection as finished teaching.

## Limits

This report judges teaching against the permitted frozen context and rendered work. It does not independently verify SQL execution, source claims, download contents, mechanical receipts, responsive layout or exhaustive control combinations; those belong to the commissioned practitioner/visual work. All article prose and disclosure/step text were read, so playback was not required to recover hidden teaching. Relevant controls were also used: r00 receipt and transaction endings, unsafe/conditional race outcomes and Edda; r01 all three anomaly choices; r02 changed NULL predicates. All nine article figures were inspected in context. No viewport or theme setting was changed by this reviewer; another reviewer held that lease, and a later screenshot reflected its light-theme change. Reference drawings were studied in their finished default scenarios, not exhaustively across every option. Owned temporary tabs were closed on return. No source, plan or skill was edited; no build, commit, push or publication was performed.
