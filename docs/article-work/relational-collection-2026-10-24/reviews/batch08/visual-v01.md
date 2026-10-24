# Visual review · article · r31, r32, r33, r34, r35, r57 · batch08-v01

Inputs read: [fixed manifest](v01/manifest.json), limited to identity, restrictions and mechanical provenance; the six complete rendered first versions at `http://127.0.0.1:4482/review/relational-collection/`; each corresponding isolated `/figures/{key}/` page before its article prose; the current review skill, visual perspective, figures skill and render-check guidance; [mechanical applicability](v01/mechanical/applicability.md), and each piece's supplied native transcript and environment record. All six articles were read through their final, expanded Sources and further reading disclosures. Source, plans, collection context files, author quality notes, other perspectives, earlier versions and earlier quality reports were withheld. No build, implementation edit or delegated work was performed.

Highest severity: **none**. No visual finding is raised for these six frozen pieces. This is initial article-mode visual coverage, not a final complete reading, corpus review or publication approval.

## Reference calibration

Before either assigned batch, I inspected all **34 rendered reference drawings**, with their captions and relevant neighbouring explanation, at `http://127.0.0.1:4350/review/examples/`: Sequences figures 1–13, Indexes figures 1–11, and Storage and durability figures 1–10. This was rendered exposure, not a reading of reference source. I sent the completed exposure report to the coordinator before beginning the assigned media.

The applied standard was a drawing that exposes the relevant comparison without requiring reconstruction: consistent entities and spatial meaning, a small visible change between steps, labels beside the objects they name, captions that distinguish a model from observation, and controls that keep the consequence near the choice. The index examples also supplied the standard for separating a candidate search area from the rows that actually answer a question. Storage examples supplied the standard for separating physical structures, visibility, acknowledgement and later maintenance. A colour or animation is useful only when its meaning is also available through words, shape or position.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | Pass | Every figure, table and displayed code example was inspected in isolation before the corresponding prose; initial meanings and uncertainties are recorded below. |
| 2. Form fits the content | Pass | Headed tables carry comparisons; diagrams carry process, page, time and spatial relationships. Physical tuple addresses, JSON paths, range boundaries and BRIN candidates remain distinct from logical identities or final answers. |
| 3. Readable at a glance | Pass | Desktop and phone inspection found no unreadable data label, hidden result or ambiguous NULL marker. Long SQL uses keyboard-operable local scrolling. Wide tables preserve their column structure and remain locally scrollable. |
| 4. Interaction | Pass | All HOT cases and steps, all BRIN intervals in both physical orders, all three plan contexts and all reservation choices were freshly exercised. Keyboard operation, text alternatives, playback/pause/reset and endpoint focus were checked where applicable. |
| 5. Themes and phones | Pass | Verified actual 1280 × 720 desktop and 375 × 812 phone dimensions, light and dark themes, local overflow and meaningful contrast. No whole-page horizontal overflow occurred at 375 px. |

## First reading and per-piece evidence

### r31 · PostgreSQL processes, pages and row versions

Rendered route: `/postgresql/architecture/`. Highest severity: none.

**First reading.** The first SQL block asks for P7's price. Figure 1 appeared to trace a request from an application to its connection's backend, then through an index address to a heap tuple and a visibility check, with table/index files supplying missing pages to a shared cache. It showed process and storage boundaries rather than several machines. The caption explicitly called the addresses illustrative and the index route chosen. Before prose, I wanted confirmation that the small table did not necessarily execute this plan and that a physical address was not P7's identity; both are explained in place.

The second SQL block exposes `ctid`, `xmin` and `xmax`. The three-row observed table showed the old report retaining 20.00 at `(0,1)` while a fresh reader obtains 25 at `(0,2)`. Figure 2 appeared to compare three reasons for retaining or replacing index addresses: a same-page heap-only replacement, a price-indexed ordinary replacement, and a replacement forced onto another page. Stepping each case made commit, old-snapshot visibility and later cleanup different events. I initially needed the explanation of a redirect after pruning and the ordinary-index condition for HOT. Prose and the three-outcome text disclosure resolve those points, including BRIN's special rule. The 25.00 change is explicitly a scratch experiment, not the collection's dated price correction.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | Both SQL blocks, both figures, the observed table, all three case choices and the four steps of each case were inspected before prose. The subsequent complete reading confirmed their apparent lessons and limitations. |
| 2. Form fits the content | Pass | The lookup distinguishes backend, shared buffers, index and heap pages, files and visibility. The HOT drawing labels the primary-key entry and each heap item/page; a changed physical location is not presented as a changed product identity. The observed result has real Read/Price/ctid headings. |
| 3. Readable at a glance | Pass | Item numbers, old/current versions, addresses and price results remain readable. Full-page and price-indexed cases retain the extra page or index addresses they need. The short lookup fits the phone; the inspection query's approximately 21 px overflow is local and keyboard reachable. |
| 4. Interaction | Pass | All 12 case/step combinations were used. Native-select keyboard operation changed case. Next into the last step and Back into the first retained button focus, with the endpoint announced disabled. Play advanced; Pause held the state during a subsequent 1.8 s observation; Reset restored step 1 and stopped playback. The text disclosure describes all three outcomes, and Figure 1 has a complete semantic image description. |
| 5. Themes and phones | Pass | Both figures, the observed table and both code panels were checked at desktop and phone widths in both themes. The phone lookup is a named, focusable horizontal-scroll region: 322 px visible width, 550 px content, with keyboard movement reaching the approximately 228 px far edge. No page overflow. Old tuple text remains legible rather than fading below the text threshold. |

Playback timing was checked from fresh state samples, not inferred from a stale screenshot. A desktop sample run of 24 observations approximately 500 ms apart recorded about 3.57 s between the first two state entries and about 8.18 s before leaving the longer second explanation. These are observed intervals, not an assertion of an exact timer constant. The longer explanation therefore had materially more reading time; Pause and manual steps remained available. Hidden-preview throttling limits precision, as noted below.

Qualified mechanical evidence: [native transcript](v01/mechanical/r31/native.txt), [environment](v01/mechanical/r31/environment.json). The recorded fresh-reader/retained-report result and tuple flags support the three displayed cases, including same-page HOT, the ordinary price-index case, and movement to `(1,1)` when the original page is full. This reviewer did not re-run the database experiment.

### r32 · PostgreSQL vacuum and transaction age

Rendered route: `/postgresql/row-versions/`. Highest severity: none.

**First reading.** Figure 1 appeared to show a horizon, not an immediate-delete animation: an older report still needs the 20 version after a writer creates 25; after that report ends, old space becomes reusable. Its final caption kept vacuum's visibility work separate from freezing. The observed table made the consequence concrete through dead tuples, all-visible pages and index-only heap fetches. Before prose, I needed to know what had actually been requested and whether all-visible meant all-frozen; the caption and explanation explicitly separate those claims.

The first code panel appeared to inspect relation and database transaction ages; the second to locate transactions holding a backend horizon; the third to inspect prepared transactions and replication slots. The final headed table mapped different evidence to the next maintenance question. The complete reading explained why these sources of retention differ and why a stable visible row count does not mean there is no cleanup or age work.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | The three-stage drawing, observed four-column table, all three SQL panels and final maintenance-question table were read in isolation before prose. |
| 2. Form fits the content | Pass | The horizon sequence exposes retained and reusable physical versions without pretending commit alone permits cleanup. Headed tables separate measurements from diagnostic questions; the drawing does not equate visible and frozen pages. |
| 3. Readable at a glance | Pass | Stage labels and retained/current versions remain visible. Phone table headings wrap without merging the measured quantities. The three code panels have local overflow, with content widths approximately 395, 482 and 459 px against a 343 px phone panel. |
| 4. Interaction | Pass | No interactive model or playback is present. Each overflowing code panel was keyboard focused and scrolled with ArrowRight, and retained focus; displayed SQL and the final evidence table remain selectable/readable semantic text. |
| 5. Themes and phones | Pass | All media were inspected in light/dark at desktop/phone dimensions. Both tables stayed within the phone width; code scrolled locally. Dead versions, NULL-related diagnostic text and captions remained above the text contrast threshold. |

Qualified evidence: [native transcript](v01/mechanical/r32/native.txt), [environment](v01/mechanical/r32/environment.json). The recorded held-report case has one dead tuple, zero all-visible pages and two heap fetches; after release and the recorded maintenance it has zero dead tuples, one all-visible page and zero heap fetches. These are scoped observations, not a claim that every vacuum must produce those exact counts.

### r33 · PostgreSQL index methods and operators

Rendered route: `/postgresql/indexes/`. Highest severity: none.

**First reading.** The small array table and inverted element-to-row table appeared to separate stored row values from GIN's searchable entries. The array containment query and the narrower `jsonb_path_ops` example showed that an index method's supported operation matters. The observed GIN plan extract looked like candidate acquisition followed by heap work, rather than proof that every access is index-only.

Figure 1 appeared to be a toy BRIN range model. In increasing order, range summaries bound small groups usefully; mixed values make the same min/max summaries admit more candidates. Candidate outlines and individual match ticks separated possible rows from final matches. The result text counted candidates, matches and rechecks. Before prose, the main uncertainty was whether its tiny cells were actual page/block measurements. Its caption and the separate observed BRIN table expressly distinguish the toy values from PostgreSQL's measured block/recheck counts. The complete reading preserves that distinction.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | Both small data tables, observed BRIN table, three code/plan panels, both physical-order choices and the BRIN interval controls were inspected before prose. |
| 2. Form fits the content | Pass | Rows and inverted entries use separate headed tables. The four BRIN range groups expose min/max information and the same selected interval; solid outlines mark candidates and ticks mark actual matches. The observed table is labelled as a separate execution. |
| 3. Readable at a glance | Pass | Values outside the answer remain readable. The 5–6 comparison gives 4 candidates/2 matches/2 rechecks in increasing order and 16/2/14 in mixed order, immediately exposing the cost difference. All three code panels remain locally readable on a phone. |
| 4. Interaction | Pass | Freshly exercised every valid interval from 1 through 16 in both orders: 136 intervals per order, 272 cases in total. Result counts agreed with independent min/max candidate and actual-match counts derived from the displayed groups. Reversed endpoints clamp to a valid interval; selecting from 16 with a lower through value produced 16–16. All three native menus also operated with Space, arrow and Enter. The HTML cells and current textual summary provide the full non-colour meaning. |
| 5. Themes and phones | Pass | Both physical orders, figures, tables and code were checked in both themes and widths. The observed BRIN table is about 372 px wide in a 343 px phone area: keyboard ArrowRight reached approximately 29 px, exposing the final heading and retaining table focus. Tab from the preceding plan panel reaches that scrollable table. No page overflow or unreadable dimmed values. |

Qualified evidence: [native transcript](v01/mechanical/r33/native.txt), [environment](v01/mechanical/r33/environment.json). The recorded 50,000-row fixture returns 500 matches for GIN; its comparison exposes unsupported containment work rather than disguising a B-tree scan as equivalent support. The BRIN record returns ten rows in each ordering, with four versus forty lossy blocks and 170 versus 1,790 rows removed by recheck. The drawing's miniature counts do not claim to reproduce those block counts.

### r34 · Reading and repairing PostgreSQL plans

Rendered route: `/postgresql/query-execution/`. Highest severity: none.

**First reading.** Four code panels appeared to be a sequence of diagnostic/repair tools: capture execution counters without per-node clocks; collect joint common-value statistics; collect expression statistics; and build a pending-only index with a prepared query. The hypothetical-counter table appeared to prevent two distinct arithmetic errors: multiplying already accumulated buffer counts by loops and adding parent work to included child work.

Figure 1 appeared to ask what the planner can prove. A supplied pending value admits the partial ordered route; an unknown status parameter cannot prove that route covers all permitted answers; fixing pending in the statement restores the proof for a generic plan. The displayed condition, proof, route and scoped counter change together. Before prose, the uncertainty was whether this demonstrated an automatic generic-plan switch or a universal speed gain. The caption explicitly says modes were forced and disclaims both conclusions. The prose also explains the index-only node's ten heap fetches, so the label is not presented as zero heap work.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | All four SQL panels, the hypothetical arithmetic table, all three figure contexts and the all-routes disclosure were read before prose. |
| 2. Form fits the content | Pass | A compact condition/proof/route comparison exposes the decision better than an invented full plan tree. Hypothetical arithmetic and measured results are labelled separately. The figure names the actual operation and the scope of its buffer counts. |
| 3. Readable at a glance | Pass | The selected condition remains alongside its explanation and result on a phone. The table keeps Reported/What it establishes headings. The first code panel has approximately 68 px local phone overflow; the other three fit. |
| 4. Interaction | Pass | All three choices produced matching conditions, proofs, routes and counts: custom pending and generic fixed-pending give the ordered index route with three local accesses and ten returned; generic unknown-status gives scan, top-N sort and Limit, with 2,048 accesses and 1,000 candidates sorted. Native-select keyboard operation changed to the unknown-status case. The disclosure contains all three observed routes. No playback applies. Code scrolling retained keyboard focus. |
| 5. Themes and phones | Pass | All code, the table and the figure were checked at desktop and phone widths in both themes. No figure label or result clipped, no whole-page overflow, and muted explanatory text met text contrast. |

Qualified evidence: [native transcript](v01/mechanical/r34/native.txt), [environment](v01/mechanical/r34/environment.json). The record supports the 10→977 estimate change for 1,000 actual rows, expression estimate 500→960 without creating a search path, and the three-versus-2,048 local-access comparison. It records the same returned pending IDs 99001–99010 and the ten heap fetches. None of these observations is represented as a general latency ratio or automatic plan-mode decision.

### r35 · PostgreSQL JSON and structured alternatives

Rendered route: `/postgresql/json/`. Highest severity: none.

**First reading.** The representation-choice table appeared to choose a structure from the fact's identity and update needs. The optional-attributes code supplied a separate catalogue variant. The extraction table separated four inputs—missing key, JSON null, JSON string and SQL NULL column—under existence, JSON extraction and text extraction headings. The shape-check code looked like a constraint fragment; its guarded numeric conversion was visible. The three index candidates and observed-route table appeared to distinguish support for containment, key existence and extracted scalar equality.

Figure 1 placed two editors' independent paths above one stored row, then compared B's stale full replacement with applying `jsonb_set` to the stored value. The nested short code and final-document table made the lost left change and retained pair of changes explicit. The following update code supplied the stored-expression form. Before prose, I wanted to know whether this was a measured concurrent schedule and whether paths supplied independent locks. The figure caption explicitly calls it a sequential native check, disclaims concurrent wait timing and states the common row-lock boundary. The prose preserves those limits and distinguishes stronger-isolation retries and other business rules.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | All four tables (including the figure's result table), all five code/preformatted panels (including its stored-row example), and the two-editors/one-row drawing were inspected before prose. |
| 2. Form fits the content | Pass | Real column headings preserve the NULL comparison. The common stored row is drawn once beneath both editors; the final-document table exposes the two different consequences without implying independent path locks. The JSON characters are rendered literally, not parsed away as markup. |
| 3. Readable at a glance | Pass | SQL NULL, JSON null, JSON string and absence remain distinct, including phone and dark views. Final JSON wraps in the small result column, with the explanatory loss/retention label immediately beneath it. The five code panels are short enough to inspect; four require local phone scrolling, while the nested stored-row panel fits. |
| 4. Interaction | Pass | No model controls or playback apply. The wide extraction table is keyboard reachable and ArrowRight reached its approximately 155 px far edge with focus retained on TABLE. Each overflowing code panel was keyboard scrolled to its far edge: approximately 44, 179, 131 and 60 px. This exposes complete checks, casts and candidate definitions rather than dropping their right-hand ends. |
| 5. Themes and phones | Pass | All four tables, figure and five code panels were inspected in light/dark phone and desktop layouts. The extraction table is 498 px in a 343 px phone area, locally scrollable rather than squeezing away its headings. The page remains exactly 375 px wide. Both final JSON values, labels and explanatory text remain legible in both themes. |

Qualified evidence: [native transcript](v01/mechanical/r35/native.txt), [environment](v01/mechanical/r35/environment.json). The extraction results, accepted/rejected shape cases, 500-match index comparisons, stale replacement result and stored-expression result correspond to the displayed examples. The shape SQL is introduced as a schema variant/fragment, not an independently runnable complete table definition; the three indexes are explicitly candidates to compare, not instructions to create them all.

### r57 · PostgreSQL ranges, spatial search and extensions

Rendered route: `/postgresql/extensions/`. Highest severity: none.

**First reading.** The first code panel's adjacent half-open UTC intervals returned false for overlap. Figure 1 appeared to compare adjacent same-room, overlapping same-room and overlapping other-room requests against one existing reservation, on the same 18:00/19:00/20:00 axis. The reservation DDL combined room equality and interval overlap under an exclusion constraint; its nonempty, finite, lower-inclusive and upper-exclusive restrictions were visible.

The spatial query and plan extract appeared to separate an index's square candidate region from the exact distance predicate. Figure 2 made this concrete: A is inside the circle, D inside the square but outside the circle, B and C outside the box. Before prose, I wanted to know whether this was geographic distance and whether the square alone determined the answer. The caption states Cartesian metre-grid numbers and SRID 0, not a map; the drawing's symbols and explanation separate the square's candidates from the distance result. The last code panel appeared to compare host-available extension files with database-installed objects. The complete reading explains those distinct scopes.

| Check | Result | Evidence |
| --- | --- | --- |
| 1. First reading alone | Pass | Both figures, all three reservation choices and all five SQL/plan panels were inspected before prose. |
| 2. Form fits the content | Pass | Aligned time intervals reveal adjacency and overlap; the room/result labels explain the conjunction. The spatial circle and square preserve one scale and explicitly identify A/D/B/C. The plan extract and caption identify its omitted costs/timings and replacement of the printed binary point constant with `origin`. |
| 3. Readable at a glance | Pass | Room IDs, half-open endpoints, outcome words, point labels and legend remain readable. A's 500 m and D's approximately 989.95 m distance explanations support the visible decision. Code stays formatted and local rather than wrapping its predicates into ambiguous fragments. |
| 4. Interaction | Pass | All three reservation choices were used: R1 adjacent allowed; R1 overlap refused; R2 overlap allowed. Native keyboard selection changed the case meaningfully. The spatial drawing's semantic description supplies the points, candidate test and answer. Its named phone scroll region retained focus and keyboard movement reached the approximately 131 px far edge (309 px visible, 440 px content), revealing the right-hand labels. All four overflowing code panels were keyboard scrolled, including the far ends of the exclusion checks, spatial query and extension queries. No playback applies. |
| 5. Themes and phones | Pass | Both figures and all code were checked at desktop and phone sizes in both themes. Time rows retain a shared scale; spatial geometry uses local horizontal scrolling. The phone page stays 375 px wide, with complete point meaning also available in text. Meaningful shapes, lines and result labels remain visible in light/dark. |

Qualified evidence: [native transcript](v01/mechanical/r57/native.txt), [environment](v01/mechanical/r57/environment.json). The recorded environment includes `btree_gist` 1.8 and PostGIS 3.6.4 with GEOS 3.15 and PROJ 9.9, network off. The native record distinguishes the adjacent false-overlap result, exclusion refusal, unprotected two-row counterexample, lock wait followed by exclusion refusal, and the spatial index condition plus exact filter returning A and rejecting D. The figure's small request selector does not pretend to simulate that concurrency protocol or geographic units.

## Shared contrast, evidence and verification limits

Fresh browser inspection included computed foreground/background colours, ancestor surfaces and opacity for text under figures, tables and code. The lowest active body/caption text observed was approximately **6.05:1 in light** and **6.15:1 in dark**, above 4.5:1. Main table text measured about 15:1 light and 12.1:1 dark; code text about 13.73:1 light and 10.89:1 dark. Old tuples, skipped BRIN values, NULL markers and explanatory notes were included rather than exempted as secondary information. Meaningful diagram outlines, axes, arrows, candidate marks and match/rejection symbols were inspected against their surfaces at the 3:1 graphics requirement; state meaning also remains in labels, ticks, position and result text. Faint decorative table separators are not the only means of identifying rows or states. The disabled first/last Back/Next buttons are visibly inactive; their lower-contrast opacity is not used for data or active controls.

The qualified applicability record identifies the frozen 4482 preview and unchanged native inputs; it does not stand in for current rendering. I read all six native transcripts and environment records, then compared the actual displayed results. The supplied environment was PostgreSQL 18.6 on Homebrew aarch64 macOS with 8 kB pages, an owned private Unix socket, TCP disabled, recorded ownership checks and recorded shutdown/removal. Reused receipts establish only those recorded executions. I did not run their verifier implementation, inspect its source or reproduce native database work. Fresh current browser use supplied all visual and interaction evidence in this report.

Actual download hrefs were taken from the rendered links and checked with bounded HTTP retrieval. All five returned HTTP 200 and the following byte counts/hashes, matching the permitted manifest/receipts. Downloaded SQL implementation was not read as an extra input.

| Piece / rendered href under the preview | Bytes | SHA-256 |
| --- | ---: | --- |
| r33 `/evidence/r33/index-methods.sql` | 1,894 | `4e0eba75882dc0ee079a067ec1aedde1efc6687126268bda1f7f206d1b7b31b7` |
| r34 `/evidence/r34/plan-repairs.sql` | 2,213 | `1dd7746217f4edf4b981a00fb365610dcd3459ea8a0de8a38e90e39e3e39767c` |
| r35 `/evidence/r35/json-boundaries.sql` | 3,272 | `5cec3c2cf3bb71ef54eb40a265a28ed72991185d6e67773a9aea77caab351d99` |
| r57 `/evidence/r57/ranges.sql` | 1,957 | `3a461563b21d9314607cb1e6c0d2b89f0a5260b4c8015c5acaa4838d155a1f39` |
| r57 `/evidence/r57/spatial.sql` | 1,145 | `18b2eee6396291665d8baf3cc67a2c73bafe77c7246d65e966d6e3c28e05104f` |

These checks establish served bytes, not actual browser saving. Actual saving/download-manager behaviour is **unverified**, as required by the assignment. r31/r32 do not offer these worksheet downloads. No browser download event/path wait was used.

## Findings

None for these six pieces under this perspective and version.

## Limits and cleanup

- The in-app preview ran in the background. Hidden panes can throttle animation and leave screenshots stale, so playback conclusions use fresh DOM state samples and observed times, with explicit Pause/Reset checks. This does not establish frame-perfect animation timing or screen-reader announcement behaviour in every browser.
- Viewport testing covered actual 1280 × 720 and 375 × 812 dimensions, light/dark themes, native keyboard control use and ordinary scrolled viewport screenshots. It does not establish every device size, zoom setting or operating-system assistive-technology combination. No full-page-plus-clip screenshots were used.
- Contrast measurements concern the rendered computed colours and surfaces, including data opacity; they are not a complete automated accessibility audit. Semantic image descriptions, headed tables, disclosures and visible keyboard focus were inspected directly.
- All interactive models were restored to default: r31 first HOT case/step 1 with playback stopped; r33 increasing order, 5–6; r34 custom pending; r57 adjacent R1. Article disclosures were returned closed after use; navigational collection groups retain their normal default state. Local scroll state was reset/reloaded before leaving each piece.
- The shared viewport/theme lease was explicitly returned to the coordinator after verifying **1280 × 720**, **System**, default r57 case, all five code scroll offsets zero and Sources closed. The viewport override was then cleared and 1280 × 720 verified again. Only this reviewer's temporary tab was closed. No content or preview was changed.

All five required checks apply to each of these six initial frozen articles. No independent final-reading or corpus credit is claimed.
