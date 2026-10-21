# Visual review · ARTICLE · a00 Relational databases; a03 Making concurrent changes correct · 80276a4

Inputs read: the two complete rendered pieces at `http://127.0.0.1:4333/review/relational-trial-3/` and `/transactions/`, including every figure, table, code disclosure, caption and text alternative; rendered figures and tables in the Sequence diagrams, Indexes, and Storage and durability reference routes; `.agents/skills/staycurrent-review/SKILL.md`, its visual perspective, and `.agents/skills/staycurrent-figures/SKILL.md` (coordinator-specified skill version 005ab6f). No isolated routes were supplied. Plans, briefs, writer notes, evidence records, previous versions, previous reports and other reviewers' findings were withheld and not read. No article source was read.

Highest severity: medium

Recorded UTC start: 2026-10-21 19:24:26 UTC. End: 2026-10-21 19:31:50 UTC. Duration: 7 minutes 24 seconds. Timing includes browser setup, inspection, evidence capture and report preparation.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | finding | The rows, examples and comparisons mostly explain themselves; a03 Figure 1 loses its request identities at step 3. First impressions are recorded below. |
| 2. Form fits the content | pass | Separate relations have real columns, visible keys and relationship arrows; comparisons change one protection while keeping the starting state. The two-column evidence tables fit their prose. |
| 3. Readable at a glance | finding | Code is formatted and appropriately disclosed; a00's two widest relation tables hide columns at 375 px without explaining the sideways scrolling. |
| 4. Interaction | finding | All eight options were manually stepped and automatically played to their final Replay state. Back, Next, Pause and Reset work and endpoint focus stays on the control. a03 Figure 1's fixed lanes misattribute the second request's work. |
| 5. Themes and phones | finding | Comparisons stack at 375 px and neither page overflows horizontally. Measured text contrast exceeds 4.5:1 in both themes. The small scrolling-affordance issue remains in a00. |

## First reading

The figure-only pass used rendered figures and their own labels/captions before the deliberate reading of their surrounding paragraphs. Full-page accessibility snapshots also exposed prose incidentally; I did not treat that as an isolated-figure viewing environment.

### a00 · Relational databases

- **Figure 1, five relation tables and relationship strip:** I read this as a snapshot of Mina's accepted order 103, with stock already reduced and no payment for that order. The separate tables make identities and stored values easy to find. The strip says customers have orders, orders have lines and payments, and lines refer to products. I initially looked for orders 101 and 102 after finding their payment rows; the caption explicitly explains that those historical orders are omitted. The PK/FK labels and recurring P7/P3 values are consistent. On a phone, the order_items and payments tables require sideways scrolling to see their final columns.
- **Quantity definition:** a short rule requiring a present positive integer. It reads as a column fragment, not a whole schema.
- **Order 103 SELECT:** a compact joining-and-summing example, grouped to one order/customer result. The table aliases remain easy to follow. In context, the displayed £29.00 result agrees with Figure 1.
- **Figure 2, joined result table:** repeated line and payment identities show the multiplication directly; its caption gives the doubled £79 totals. This is visibly a result relation, rather than four stored lines. No interaction is needed.
- **Wrong join and repair disclosure, both listings:** the first sums the multiplied rows; the second produces separate per-order totals before joining. The disclosure lets the walkthrough keep moving while preserving the concrete comparison. The surrounding paragraph correctly limits the inner join to orders with matching payments.
- **Figure 3, both options:** I expected a race between Mina's 103 and Tariq's 104. The stale path ends with zero stock and both accepted orders; the conditional path introduces a wait, rechecks zero and refuses 104. The committed-state heading explains why stock remains 1 while Mina's subtraction is pending. Changed values are underlined. The figure's own caption and text alternative state the model's limits and outcomes.
- **Complete order protocol:** this reads as one transaction reserving P7 and P3 and writing the two lines. The inline application branches are conspicuous comments. The surrounding prose explains that those comments require application behaviour rather than executing SQL branches.
- **Figure 4, write path:** a numbered path from finding P7 through memory, recoverable logging and later data-page writes. Its ordered-list form is enough for this level of detail; it does not claim a measured time scale.
- **Shortlist evidence table:** two useful columns pair each requirement with evidence to obtain. It looks like a checklist for evaluating an arrangement, with readable wrapped cells at 375 px.

### a03 · Making concurrent changes correct

- **Starting classes and reservations tables:** class 21 has its last place, class 22 has two places and R7 already belongs to owner 2. The key arrow connects the tables. The nearby owner mapping resolves who 2 is; the figure itself mostly needs the identities rather than full customer names.
- **Figure 1, both options:** the starting view suggests two lanes for Mina's first and second attempts. The first change creates R10. At step 3 the left lane switches to “Second decrement committed” or “Second decrement pending”, although the right lane is labelled “Mina’s second request”. At the final step the rejection also appears on the left while the rollback appears on the right. I had to use the explanation and final tables to reconstruct the attempt boundary. The separate-commit and transaction results themselves are clear: 0 + 2 differs from capacity 3, whereas 1 + 2 agrees.
- **Unsafe booking listing:** the opening comment makes the earlier shared read explicit, followed by a literal overwrite and distinct reservation identities. It is a short counterexample, not a recommended recipe.
- **Figure 2, both options:** two consistently named request lanes lead to either two committed reservations for one place, or a waiting conditional update which later creates no R9. The tables distinguish committed state from pending work. This comparison stands on its own.
- **Conditional booking listing:** the returned class row feeds the reservation insert, making the connection between a successful decrement and an owner concrete. The surrounding prose supplies the acceptance and no-row meanings.
- **Optimistic comparison listing:** a deliberately smaller old-value comparison. Its title and nearby paragraph correctly identify it as only a step within a complete booking.
- **Figure 3, both options:** Lena and Ravi both count two and change distinct rows. Repeatable Read leaves both false; Serializable rejects Ravi, then its additional last step rereads one and leaves him available. The extra step shows why retrying the decision matters, rather than ending at the error. The selected-victim qualification and text alternative agree with the displayed path.
- **Lena departure listing:** count, conditional application decision, update and commit appear in their required order. The comment makes the branch visible rather than implying SQL automatically applies it.
- **Exact schema and starting rows disclosure:** a longer but coherent fixture, reasonably kept closed. It makes uniqueness, the composite instructor key and the initial rows inspectable together.
- **Native worksheet results table:** two columns cleanly distinguish forced cases from observed outcomes; the later limits prevent treating those rows as a universal proof. It remains readable on a phone.
- **Final audit SELECT:** a compact calculation comparing remaining places plus reservation count with capacity. The output name agrees describes the test directly.

The reference pieces provided a useful comparison for explicit state, labelled outcomes, real rows and restrained controls. Their richer storage and index drawings answer deeper physical questions; neither reviewed article needs that density for its existing comparisons.

## Findings

### visual-1 · medium · a03, Figure 1, steps 3 and 4 under both Protection options

Problem: The figure introduces fixed lanes labelled “Mina’s request” (initially ready to book R10) and “Mina’s second request”. It then places the second request's decrement and R11 rejection in the first lane, while the second lane shows the pending R11 insertion and rollback. At step 3 the explanation explicitly says the second request commits its decrement, but that event is displayed under the first request's heading.

Effect: The reader has to abandon the lane identities and reconstruct the two attempts from the explanation and committed tables. This weakens the visual explanation of precisely which transaction owns the decrement that must be rolled back. Figure 2's stable request identities make the inconsistency particularly noticeable.

Suggestion: Keep the first lane on R10's accepted result after step 2, and put all of R11's decrement, insertion failure and rollback in the second lane; alternatively use a single chronological lane if the intended comparison is entirely sequential.

Evidence: [phone view of step 3](visual-a03-lanes-phone-light.png). The same lane assignment was observed at desktop width and under One transaction.

### visual-2 · low · a00, Figure 1 at 375 px, order_items and payments

Problem: These tables extend beyond their scroll areas, cutting off column headings and values at the right edge. At the initial horizontal position order_items hides quantity and unit_price, and payments hides method. The page gives no visible “scroll to see more columns” cue. The surrounding article stays within the viewport, so there is also no page-level cue that anything is missing.

Effect: A phone reader can overlook data used by the next explanation, or need to discover the independent sideways scroll areas by trial. The data is available and this does not invalidate the example.

Suggestion: Add a small persistent scrolling hint or edge treatment to wide relation tables, or use a phone layout that reveals all fields while retaining their column identities.

Evidence: [375 px relation tables in light theme](visual-a00-phone-light.png). The rendered order_items table measured about 536 px inside a roughly 315 px scroll area; document width remained 375 px.

## Limits

- The browser was hidden. `visible: false` itself was unsupported in the subagent, so tabs were created with the options argument omitted; no visible-window review was possible. Screenshots were checked against current rendered DOM state and actual viewport width, rather than used to infer animation speed.
- Playback timing was checked through the running DOM hold transitions and observed state advancement, not source code. Every non-final state in every option was inspected while playing; recorded holds ranged from 3.5 to 7.14 seconds. All eight options also reached their final Replay states through automatic playback. Pause remained available and the paused states stayed unchanged while other checks ran. See [rendered hold evidence](visual-timing.json) and [check summary](visual-checks.json). Hidden-pane scheduling can still affect perceived animation smoothness.
- At 1280 px and 375 px I inspected actual rendering in dark and light themes. Colour calculations used rendered foreground colours and composited ancestor backgrounds for visible figure, table and listing text, including muted labels and code. The observed minima were a00 light 6.03:1, a00 dark 6.15:1, a03 light 6.61:1 and a03 dark 6.83:1. This was not a screen-reader or a platform-specific touch-gesture audit.
- The browser served the fixed version identified by the coordinator. I did not independently inspect repository source or database verification scripts, rerun SQL, or verify technical claims against external sources; those are outside this visual input set.
- One click on the a00 shortlist table accidentally followed its nested performance link. Only that page's header was exposed before returning; it was not used as review evidence.
- Temporary viewport overrides were reset, review tabs closed and playback stopped. The coordinator's preview server was reused and left running. No article files were edited, committed or pushed.
