# Adversarial editor review: Modelling history and time

**Verdict: pass, with non-blocking consolidation recommendations.** No additional article or nested article is justified. The seven-heading plan is a coherent treatment of the assigned brief; none of the recommendations below requires expanding its scope.

Reviewed `breakdown.yaml`, `context.yaml` and the fresh commission. Read the three fixed reference articles in full, including their embedded figure descriptions and reader instructions. This is a planning review, not rendered-figure or executable-SQL validation. No existing relational corpus or previous tree was consulted.

## Findings

### 1. Bring the first as-of predicate beside the correction rows

Location: “Correct yesterday without rewriting what was known”, lines 35–51; “Prove the as-of answers before accepting the model”, lines 97–110.

The worked correction compares two answers, but the first representative SQL predicate is currently promised only in the final section, after constraints, relationships and product facilities. A newcomer should be able to see how the chosen point on each axis selects an assertion before being asked to reason about intersecting periods or temporal joins. Put one labelled effective-time/recorded-time selection beside the before/after rows and diagram. The final worksheet can reuse it rather than introduce it.

This is a move and a small cut in the last section. It loses no useful understanding and reduces the reader's need to hold an unexplained query operation in mind. It follows the references' pattern: present a concrete operation, point to what to watch, then explain the outcome before adding another mechanism.

### 2. Teach historical reference choices once, then use them

Location: “Give identities and periods an exact meaning”, lines 31–34; “Preserve historical relationships and explain corrections”, lines 71–75; opening comparison, lines 15–19.

The early identity section already lists four reference promises; the later relationship section returns to the ordinary foreign key and the as-of distinction. Keep stable entity identity versus assertion identity in the early section, plus the single order-price warning needed by the running example. Consolidate the full reference-choice comparison into the later relationship section, where selecting one point versus covering an entire interval gives the comparison a practical consequence. Link back to the agreement snapshot instead of explaining it again.

Lost useful understanding: none if the order's fixed agreed price remains visible from the opening onwards. The early section loses a taxonomy before the reader has seen why most of its alternatives matter. The later section retains the decision and its consequences. Do not create a separate historical-relationships child: that would add navigation while reintroducing the same entities and axes.

### 3. Make the final worksheet a test of the taught model, not a second tutorial

Location: “Prove the as-of answers before accepting the model”, lines 99–107.

The plan asks for every valid/recorded boundary, gaps, termination, historical joins, snapshots, rejected writes and competing corrections. This is defensible as an evidence checklist, but risks making the article end with another long walkthrough. Use one compact expected-answer table for the existing rows and short probes for the gap and termination extensions. Keep the detailed engine commands and concurrent schedules in the accompanying evidence. The article should show the essential predicates, expected cardinalities and one consequential failure outcome, then direct readers to the full exercise.

Lost useful understanding: none of the promised cases needs to disappear. What leaves the main reading is repetition of nearly identical boundary checks and execution detail. Keep enough rows visible to prove half-open boundaries, the changed answer after correction, absence before first recording and the unchanged order agreement. Keep concurrency verification coordinated with its transaction owner so this section does not introduce a second protocol lesson.

## Article and section cost

- **Retain this article outside the modelling parent.** Folding it into “Preserve the past the question actually needs” would force the parent either to carry the full correction, two axes, interval constraints and historical relationships or to leave readers unable to implement their chosen representation. That is substantial useful understanding to lose. The parent needs a short choice and a link; this article earns its own destination.
- **Retain the opening comparison.** It is the stopping rule for complexity: readers can see when an audit record or immutable agreed fact answers their question without paying for two-axis history. Keep it one decision table attached to the same contract/order case; separate pattern articles would duplicate introductions and increase navigation cost.
- **Retain exact periods before the correction.** Half-open boundaries, gaps and open ends are prerequisites for the row-level example. Avoid turning date/time choices into a general date-and-time tutorial; one business-date policy and one instant caveat suffice here.
- **Retain the complete correction and enforcement sections.** These supply the mechanism-level judgement the commission asks for. Cutting the two-axis overlap rule would leave a deceptively plausible one-axis constraint that cannot preserve the intended old assertions. Cutting the remaining two-writer counterexample would conceal the limit of declarative protection. The protocol hand-off is appropriate.
- **Retain provenance and deletion as compact modelling decisions.** The article owns what an answer means after correction, termination or purge. It should not acquire access-control, erasure or recovery procedures already assigned to operations.
- **Retain the bounded feature comparison.** Two product examples tied to the same invariants are enough. The section's stated limits already prevent a vendor catalogue. Fold a PostgreSQL syntax alternative into a table rather than repeat the full worked constraint sequence; preserve the SQL Server timing caveats because those change the interpretation of an as-of answer.

## Teaching judgement and recheck conditions

The plan has the strongest useful features of the references: one small recurring case; each added mechanism motivated by a question; before/after rows and a diagram that can be checked against one another; expected outcomes rather than a feature list; and a distinction between a model and an observed run. The article can remain linear without further children.

The recommendations improve presentation economy but do not expose a structural coverage gap. A recheck is needed only if repair removes substantive requirements, creates child articles or expands the product comparison into independent tutorials. No article writing or publication is authorised by this verdict.
