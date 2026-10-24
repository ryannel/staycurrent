# Visual review · article · r49–r53 · batch12-v01

Inputs read: [fixed manifest](v01/manifest.json), its permitted mechanical applicability, source-hash identities and native result records, the five current rendered articles at the manifest's 4534 URLs, and each corresponding isolated `/figures/r49/` through `/figures/r53/` route. Complete article prose, article-specific media disclosures, Sources and further reading, and publication disclosure were read. No product source, plans, author teaching notes, history, earlier versions, peer reports or quality verdicts were read. No product edits, builds, native reruns or publication were performed.

Highest severity: **medium**, r51 visual-1. r49, r50, r52 and r53: none. r51 also has one low polish finding.

This is initial article coverage of the five frozen first versions, not final/corpus coverage. The separately commissioned r44 facet is in [its narrow supplement](../batch11/visual-r44-firstreading-supplement-v01.md) and is not counted as a new full r44 review here.

## Calibration and order

Before conclusions or commissioned article prose, I inspected all **34 styled fixed-reference drawings and their rendered explanations** at 4350: Sequence diagrams Figures 1–13; Indexes Figures 1–11; Storage and durability Figures 1–10. I used complete figure captures, captions/explanations and stepped drawing states, including the sequence scope/asynchronous comparisons. The visual role has no 19-article full-text calibration requirement.

I then performed r44 Figure 1's four isolated Layout/Read combinations before its prose, as recorded in the supplement. For each batch12 piece in turn, I read every isolated figure/table/code example and used its controls before opening its complete article. Coverage comprises five figures, four tables and sixteen code blocks. The four players have 5, 6, 6 and 6 states respectively; r51's drawing is static.

## Checks

### r49 · Operating and securing a CockroachDB cluster

Current article: `http://127.0.0.1:4534/review/relational-collection/cockroachdb/operations/`

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | All four code examples, runtime-evidence table and five handover states inspected before prose. |
| 2. Form fits content | pass | Named node cards expose voting membership; the evidence table separates each attempt from its required result. |
| 3. Readable at a glance | pass | Voter, copying, handover, removed and unavailable states remain explicit in words. Code is short and ordered; operator sketches visibly retain placeholders. |
| 4. Interaction | pass | Every state, Next/Back, Play/Pause, Replay, Reset, text alternative and first/last keyboard focus checked. |
| 5. Themes and phones | pass | Current desktop and actual 375 px article/isolated rendering inspected in both themes; cards become two columns; meaningful text/outline contrast passes. |

### r50 · CockroachDB backup and recovery

Current article: `http://127.0.0.1:4534/review/relational-collection/cockroachdb/backup-and-restore/`

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Three code blocks, recovery acceptance table and six recovery states inspected before prose. |
| 2. Form fits content | pass | History labels establish target ordering; source/candidate cards distinguish authority from recovered data. The numeric table exposes the unchanged repeated-request result. |
| 3. Readable at a glance | pass | Capacity 3, remaining 3→2 and one B203 agree between drawing, table and prose. Code's external connection and recorded timestamp are deliberate parameters. |
| 4. Interaction | pass | All six states and all player/alternative controls checked; keyboard focus remains at both endpoints. |
| 5. Themes and phones | pass | Timeline labels wrap in reading order, candidate cards stack, and the four-column numeric table remains readable at 375 px in both themes. |

### r51 · CockroachDB schema jobs under load

Current article: `http://127.0.0.1:4534/review/relational-collection/cockroachdb/schema-changes/`

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Four code blocks, both tables and the complete dependency drawing inspected before prose. |
| 2. Form fits content | finding, low | Separate database/application lanes and authority/derivation boxes fit the distinction; the final conversion arrow does not follow the phone's stacked direction (visual-2). |
| 3. Readable at a glance | pass | Observation/meaning/next-check columns stay distinct; prices have explicit decimal/hundredths headings. Long phone table cells wrap without breaking words or losing columns. |
| 4. Interaction | not applicable to drawing | Static figure has no playback/options. Code regions are keyboard-focusable and horizontally scroll where needed. |
| 5. Themes and phones | finding, medium | The meaningful 18 px bold `×100` label falls below 4.5:1 in light theme (visual-1). Other sampled text and meaningful graphic colours pass. |

### r52 · Upgrading a CockroachDB cluster

Current article: `http://127.0.0.1:4534/review/relational-collection/cockroachdb/upgrades/`

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Three code blocks and all six upgrade/rehearsal states inspected before prose. |
| 2. Form fits content | pass | Three binary labels remain visibly separate from the cluster version and return/recovery statement. |
| 3. Readable at a glance | pass | The all-new-binary/old-cluster-version comparison and start-of-finalisation return boundary are explicit. |
| 4. Interaction | pass | All states and player/alternative controls checked, including keyboard endpoint retention and Replay. |
| 5. Themes and phones | pass | Three node cards still fit at 375 px; return statements and changing explanation stay adjacent to controls in light/dark. |

### r53 · Moving a SQL application to CockroachDB

Current article: `http://127.0.0.1:4534/review/relational-collection/cockroachdb/migration/`

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Both code blocks and all six migration/return states inspected before prose. |
| 2. Form fits content | pass | Matching labelled facts on the two authority cards make missing order/request/stock effects directly comparable. |
| 3. Readable at a glance | pass | Present/absent, request outcome 103 and P7/P3 stock 1/12→0/10 remain consistent. Code names the engine-specific division results. |
| 4. Interaction | pass | Every state, player/alternative control, Replay, Reset and first/last keyboard focus checked. |
| 5. Themes and phones | pass | Cards stack at 375 px; the current authority summary and explanation remain directly above the controls. Both themes and code scrolling checked. |

## First reading

**r49.** The identity query appeared to check the login, effective role and grants. The policy code appeared to derive row access from one of two fixed runtime identities. The table made permitted and forbidden neighbour tests concrete, including a permitted edit rather than blanket refusal. The range/node code appeared to inspect placement before maintenance; the final commented shell commands were clearly operator sketches with a node placeholder. The figure appeared to require a real voting replacement before removing A, then showed why a later failure of B consumes the next-failure allowance. Copying D did not appear to be a vote. No unresolved visual ambiguity remained after the prose established the identities, fixture and maintenance scope.

**r50.** The first code example appeared to create a full/incremental chain retaining revisions; the second to inspect that collection and required files; the third to select an explicit recorded point. The external connection and target timestamp needed the deployment context supplied by the article, rather than being literal ready-made values. The figure appeared to distinguish a point-in-time restoration from recovery of a usable service: restoring T excludes both the mistake and later valid B203, fencing closes enumeration, reconciliation consumes one place, and repetition consumes none. The table showed 0/3/3 becoming 1/2/3 and staying there. The prose resolved which class/session and operation identity those numbers represented; it did not change the visual reading.

**r51.** The first code example appeared to add stored hundredths derived from a decimal, not a separately writable number. The two lanes appeared to separate database job completion from application acceptance, while the last pair of boxes retained decimal write authority. Job observation rows told me what each status did and did not establish. The price table provided ordinary labelled comparisons: 4.50→450, 35.00→3500, 20.00→2000. The later query appeared to find missing/unequal derivations, and the final code to request a unique source identity. The exact domain and duplicate fixture needed prose and were supplied there. On the phone I noticed that the final arithmetic arrow kept pointing sideways despite its vertically stacked boxes; this did not prevent understanding the derivation. The measured light-theme label contrast was established after the initial reading.

**r52.** The policy code appeared to hold automatic finalisation before replacing binaries. The inspection code distinguished running build tags from cluster version; the final code explicitly began the separate version transition. The figure's six states appeared to show an old population, one new binary, a rehearsal of returning that node, all new binaries with the old compatibility version, finalisation starting, and finalised recovery choices. The all-new-binary/old-version state was the useful comparison, and the return warning changed when finalisation began. The prose confirmed that reading and bounded the documented/native evidence.

**r53.** The arithmetic code made a concrete semantic mismatch visible before discussing a full migration. The request table definition appeared to permit a temporarily absent outcome while retaining a reference for a non-null outcome; whether this was sufficient enforcement was a contextual question, answered explicitly by the prose's trusted-writer application contract. The six figure states appeared to transfer one write authority with a closed copied history, accept Mina's complete purchase, then close the new history and reconcile its complete effect before returning. Matching facts exposed why simply reopening old PostgreSQL would be wrong. The prose explained the separate rehearsal, whole-state acceptance and deliberate absence of external provider effects without contradicting the isolated figure.

## Findings

### r51 · visual-1 · medium · Figure 1, light-theme arithmetic label

Problem: The meaningful `×100` text in `→ ×100 →` is **18 px, bold 700**, coloured `rgb(39, 122, 115)` over the figure's gradient from `rgb(242, 239, 230)` to `rgb(234, 229, 217)`. Its worst contrast is **4.06:1**, below the required 4.5:1 for text of this size. This is the arithmetic label, not merely the arrow stroke; the bold size is below the large-text threshold. The dark counterpart passes at 7.17:1.

Effect: The conversion label receives less readable contrast than the surrounding explanation and misses the required normal-text contrast standard on both desktop and phone in light theme.

Suggestion: Use a darker label colour that reaches 4.5:1 across the complete light gradient, or another treatment that meets the appropriate text threshold. Arrow strokes can retain their separate graphic styling.

Evidence: Fresh current rendered DOM/computed styles on the exact 4534 r51 article, with light/dark and 1280/375 px figure captures. WCAG relative-luminance calculation from the resolved foreground and both gradient endpoints gives the worst ratio above. No source inspection was used.

### r51 · visual-2 · low · Figure 1, phone direction of final derivation

Problem: At 375 px the Decimal price and Stored hundredths boxes stack vertically, but their intervening `→ ×100 →` still points horizontally. The upper dependency lanes correctly switch to down arrows.

Effect: The final mapping is a little less immediate to follow than the two lanes above it; readers must use position and words rather than the arrows' direction.

Suggestion: Give the stacked conversion a downwards direction while retaining its arithmetic label.

Evidence: Current full figure captures at actual 375 × 720 in both themes, compared with the actual 1280 × 720 desktop figure. The boxes and label are visible together in the complete capture.

No other visual findings are proposed for these five initial versions.

## Interaction and rendering evidence

All current desktop checks used actual **1280 × 720**; all phone checks used actual **375 × 720**, verified after changes. Each article's document scroll width was 375 at phone width. I inspected isolated media and then current in-place article figures, including both phone themes. All sixteen code blocks were inspected on desktop; phone code stays in bounded, focusable `overflow-x: auto` regions rather than widening the article. Fresh keyboard ArrowRight use moved overflowed code in each piece (observed positive scroll offsets on widths 380–522 versus 343 px regions), with focus on the code region. The four tables were inspected at phone width in both themes.

Every player was stepped manually through its complete state population. Text alternatives were opened and read, then closed. Enter from the penultimate Next retained focus on Next at the last state; Enter on Back from the second state retained focus on Back at the first. The endpoint controls reported `aria-disabled=true` without removing that focus. Replay visibly returned to state 1 with Pause available. Reset visibly returned to state 1. A separate attempt to target an already-disabled Next through the locator was blocked by the browser tool's disabled-element guard; it is not counted as an additional action or product defect.

Background playback was observed with fresh screenshot refreshes, current rendered text and host timestamps, rather than inferred from a loop or hidden JavaScript state:

| Piece | Observed Play progress | Observed Pause hold |
| --- | --- | --- |
| r49 | State 1→2 by 7.58 s; later paused at 3 | State 3 unchanged over 14.55 s |
| r50 | State 1→3 by 17.73 s | State 3 unchanged over 23.71 s |
| r52 | State 1→2 by 5.52 s; later paused at 3 | State 3 unchanged over 11.21 s |
| r53 | State 1→4 by 27.59 s | State 4 unchanged over 13.86 s |

These are background observation intervals, not claimed transition durations or foreground timing guarantees. They show real incremental advancement over seconds and working pause, alongside direct manual access to every result and a complete text alternative. I found no text/result disagreement in any state.

Resolved current body, code, figure and table colours were inspected in both themes for every article. Apart from r51 visual-1, sampled normal-text combinations meet 4.5:1: the quiet article annotation is 6.61:1 light / 6.83:1 dark; common figure text against the worst gradient endpoint is 8.51:1 / 10.34:1; code is 13.73:1 / 10.89:1. r49 voter-card text is 8.36:1 / 7.36:1 and its meaningful accent outline is 3.99:1 / 5.11:1. Meaningful common accent graphics exceed 3:1. Disabled control opacity was distinguished from content text. No warning, NULL marker or dimmed data row was silently excluded from a failing body-text result.

## Qualified mechanical inputs and limits

The mechanical applicability file and all inspected result/source-hash JSON identities match the fixed manifest. Each piece's article/component identities in its mechanical receipt match the corresponding frozen-manifest hashes. I read the current native results as bounded author mechanical evidence, not as independent teaching/visual verdicts: r49 secure runtime/RLS and four-process removal; r50 full/incremental revision history, file counterexample and closed-history reconciliation; r51 derived pairs, concurrent backfill and failed/repaired unique rule; r52 mixed versions, same-store pre-finalisation return, held compatibility and observed finalisation; r53 division and deferred-definition difference, full base comparison, overlapping/repeated requests, both fences and complete reverse reconciliation. These support the displayed code's fixture-specific execution context; this review did not independently reproduce the database runs or perform the practitioner perspective.

The current captions/Sources distinguish conceptual players from native execution and keep one-host, tiny-fixture, entitlement, external-effect and performance limits visible. No offered public download exists for these five pieces. No download event/path/save API was used; actual browser saving is unverified. Repeated identical collection navigation templates were not expanded afresh twenty times per piece; all article-specific content and disclosures were read.

CUA was used only under the coordinator's exclusive lease. Before release I reset controls and closed disclosures, selected System, restored actual 1280 × 720, cleared the temporary viewport override, verified actual 1280 × 720 again and closed all own tabs; the resulting tab inventory was empty. The lease was explicitly released. No required initial visual check is replaced by a historical screenshot or another reviewer's judgement.
