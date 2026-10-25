# Batch 04 independent reader review

Reviewed fixed v01 pagination, transactions and locks under `review-source.json`, rendered at `http://127.0.0.1:4606/review/relational-rebuild/`. The assigned audience is an intelligent application engineer moving from query results and guarded writes to consistent reading and concurrent decisions. No source changes, builds, servers, commits or delegation.

The illustration-first and initial body observations were saved in `initial-notes.md` before consulting plans or example records. I then compared the three plans and shared example facts for promised understanding and boundaries, without another automatic body reading. This is an editorial/teaching/rendered review, not the independent practitioner verification.

## Findings

No Critical or Medium reader problem found.

**Low — stale availability wording.** In Transactions and isolation, the final paragraph of **Giving a decision a common lock** calls Locks, contention and deadlocks “the planned child article”, although the rendered Explore list and Next navigation link to its available draft. A reader can reasonably take the sentence to mean that the promised protocol is unavailable. Align that local wording with the available draft. The actual parent/child division is sound: the parent shows why an authority is needed and cautions about the snapshot; the child supplies the complete protocol.

## Reference judgement

These pieces can sit beside the fixed references in their explanatory development and prose. The judgement rests on the worked reasoning, not on mechanical checks:

- Pagination follows the reference Indexes' **Composite (multicolumn) indexes / Indexes and ORDER BY** approach of making column order concrete before stating general rules. Here the 202/201/103 tie visibly earns the complete cursor; mixed direction and NULL examples then derive their changed conditions. Figure 3 changes one ordering value, while Figure 4 changes only a stored value, so the distinction between continuation and a reproducible result stays visible. The retained-projection table gives a practical consequence rather than merely warning that cursors are not snapshots.
- Transactions follows Storage and durability's **Row versions and undo logs** method of keeping the old/new reader views concrete. Its own-work/committed panels establish the atomic boundary, then the report retains stock 1 while the committed database changes. The payment example does the harder work: it shows two independently acceptable 20.00 changes against 29.00, explains why neither serial order permits both, and carries the failed Serializable attempt into a fresh decision. Terms such as write skew and serialization anomaly name an understood outcome. Zero affected rows is clearly distinguished from a SQL error and is followed through whole-purchase rollback.
- Locks uses the participant/order discipline of Sequence diagrams' **Lifelines and messages** and its separation of selected order from elapsed time. The two columns and numbered steps identify the holder, waiter, commit and decision read; the P3/P7 deadlock adds explicit labelled curved arrows only when the cycle is the lesson. The unchanged-authority comparison explains why correct ownership order can coexist with a stale payment view. The subsequent idle-blocker chain and separate waiting budgets turn that understanding into diagnosis and bounded action. They do not suggest that deadlock detection is a general deadline.

The paragraphs remain connected and concrete. Qualifications about all participating writers, line changes, implicit locks and incomplete output sit beside the reasoning they change. They do not read as unrelated editorial patches. Titles and headings use established terms or plain descriptions of the task.

## Coverage

Followed every illustration's labels, captions and alternatives first, then read each body in context. The plans' promised progression is covered: unique result-row order and cursor fidelity; changing membership/values and retained output; atomic purchase versus guarded decision; statement/transaction snapshots versus serial outcomes; authority, snapshot timing, scope/strength, acquisition order, blocker evidence and waiting policy. The plans keep access-path design, driver mechanics, storage internals and request recovery with their named owners; the drafts respect those boundaries. Shared P3/P7 stock, order 103's 29.00 value, the independent payment attempts and the projected pagination rows agree with the shared example record.

Current manual interaction/render inspection included OFFSET insert/delete outcomes; the keyset moved-202 repeat; the Repeatable Read export's pending 103; provisional purchase stock; Serializable payment conflict; the Repeatable Read 40.00 payment outcome; the unchanged-lock/old-snapshot outcome; and deadlock cycle and endpoint. Enter advanced the focused Next controls and retained focus at an endpoint. The figures' result summaries agreed with their changing state.

Inspected desktop 1280×720/System (dark appearance), phone 375×812 in Light and Dark, including the long lock matrix, cursor tie comparison, keyset boundary, exported-value list and payment total. Phone matrices wrap within their columns; controls, current outcome and explanation remain usable together. Earlier schedule events require scrolling, but remain accumulated for comparison. The longer figures are not a substantive defect merely because their complete history exceeds a viewport; the references' composite-index and version figures also separate a sizeable mechanism drawing from controls. No clipping or contradictory visible state found in the inspected layouts.

## Retained evidence and limits

Retained the supplied author observations for all controls/options/keyboard and desktop1280/phone375 in both themes, plus the shared SQL contrast minima 4.846 light / 4.591 dark. I did not repeat the full mechanical matrix or recalculate those ratios. This report's current visual judgement is separate from those observations.

No fresh animation-cadence measurement or native SQL execution was performed. Hidden IAB screenshots sometimes repainted an earlier state after an action or theme change; DOM text/state confirmed the current result, and a subsequent capture showed it. One OFFSET selector call timed out after the intended final state had already been reached; the following state confirmed the deletion outcome. The viewport override applied to the most recently created tab, so phone checks used a dedicated owned review tab whose dimensions were explicitly confirmed. These browser limits are not evidence of a reader-visible article defect.

No collection-wide reading-route review or independent technical source audit is claimed. The article-wide teaching/body reading occurred once; post-plan work was scope comparison and bounded rendered checks. Before release I restored the active owned tab to 1280×720/System, stopped all Pause-labelled playback and closed all five owned tabs. The root was notified that the viewport/theme lease was released.
