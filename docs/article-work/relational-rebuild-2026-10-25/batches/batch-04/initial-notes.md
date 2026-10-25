# Batch 04 blind reader notes

Version: fixed v01 manifest in review-source.json. First read on 25 October 2026; no plans, old drafts, author notes or earlier verdicts consulted. Browser render: main preview at :4606, initially 1280×720/System (dark system appearance).

## Illustration-first observations, before the body reading

Pagination: the first five-row baseline, numbered positions and returned-row outlines explain the repeated 201 / missed 103 under OFFSET. The tie comparison makes a concrete and useful distinction: timestamp-only excludes 103, while the complete pair retains it and excludes boundary 201. The keyset change options teach both its immunity to earlier insertion/deletion and its failure to preserve identities when their keys move. The export timeline then changes a value rather than an identity and explains paid versus pending across fresh versus shared snapshots. Those are genuinely different questions; the figures preserve that distinction. No blocking inference gap identified at this stage.

Transactions: own provisional work versus committed database is a useful first distinction. The two-stock-operation comparison gives the losing guarded write an explicit zero-row result; the report comparison gives statements different moments while preserving the transaction's atomic commit. The payments figure then changes the unit of reasoning from one row to a total: separate payment identifiers can both be valid individually while their sum exceeds 29.00. The serializable alternative says a whole decision retries, and the static authority diagram identifies the order row before any payment exists. No blocking inference gap identified at this stage.

Locks: the schedule matrix keeps two participants and numbered steps explicit; the lifetime comparison distinguishes statement completion from transaction completion and ordinary reads from lockers. The order authority and snapshot comparisons separately show mutual exclusion and decision visibility. The deadlock drawing's two curved arrows directly show the closed cycle, with P3/P7 labels on the edges; the alternate order removes the second edge. The matrix has substantial height, especially with six steps, so controls and earlier events cannot all occupy the 720-pixel viewport together. This is an observation to assess in context, not yet a defect: event accumulation lets the reader scroll back, and the state summary remains beside the controls.

Representative interactions so far: offset insertion/deletion final states, transaction provisional stock, Serializable payment step 4, deadlock step 4. Enter advances the focused Next button; current state and text agree. A selector call timed out after the pagination deletion had actually reached step 3; the following AX state confirmed the expected final result. No animation cadence judgement yet. Full-page accessibility snapshots necessarily exposed body text while locating controls; the deliberate first reading was confined to illustrations/labels/captions/controls.

## Initial body observations

Pending at the time this illustration-first record was saved.

Body first reading completed before plans/reference calibration:

Pagination's argument follows a strong causal chain: what positions mean; why the tie needs both values; what the complete order entails; what the token must preserve; why changing data still defeats reproducibility; then the snapshot/retention costs. Mixed direction and null examples are worked rather than appended cautions. The previous-page example gives the nearest-row order and display reversal separately. No substantive stall found.

Transactions makes atomicity and isolation different problems through the same mug; it explains zero changed rows as a successful SQL command with a failed business condition, and carries the losing purchase to rollback. The later payments example earns the move from stable reads to serializable decisions by showing the total and asking for a serial order. Technical words appear after the concrete result. One low editorial/cross-reference inconsistency: Giving a decision a common lock calls Locks, contention and deadlocks “the planned child article”, but the Explore list already links to that available draft. No substantive stall found.

Locks explains why a shared authority must represent absent future payments, then separately why its snapshot must follow acquisition. Its paragraph about an unchanged guard gives the reason Repeatable Read can acquire the lock yet retain the wrong total, avoiding an unexplained exception. The cycle, consistent acquisition order, idle blocker chain and deadline distinctions then build naturally. Broader operations (administrative writers, line edits and payment moves) are attached to the protocol that they can invalidate rather than collected as unrelated warnings. No substantive stall found.

The illustrative drawings are consistently described as selected schedules, not measured engine executions. The argument's prose is generally plain, connected and concrete. Reference calibration and promised-scope comparison remain pending; no conclusion on that basis was made here.
