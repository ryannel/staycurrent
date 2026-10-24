# Visual review · article · batch09 · v01

Status: INITIAL VISUAL review completed for all five pieces. Playback and readable holds were verified by fresh rendered sampling. No final/corpus credit.
Highest severity: medium.

Inputs: frozen batch09-v01 manifest identity/restrictions; exact rendered articles and isolated media on http://127.0.0.1:4502/review/relational-collection/. Current review skill, visual perspective and figures/render guidance. Mechanical applicability read. Source, contextual plans, author quality notes, history, earlier versions and peer reports withheld. No builds, edits to articles or publication.

Calibration completed before article conclusions: all 34 rendered drawings with explanations at port 4350: Sequence diagrams 1–13 (ordered messages, waiting, request email, outbox, splitting, partial order, alt/opt, loop, par, TLS, fork/stair, batching, trust boundary); Indexes 1–11 (scan, entries/TIDs, B-tree, ranges, clustered second descent, selectivity, composite order, covering/visibility, write cost, splits, deletes); Storage 1–10 (page layout, buffers, old versions, no log, WAL, background writes, group commit, recovery, flush path, asynchronous commit). Read the teaching passages accompanying each; no claim to 19-text full-reference reading.

## Frozen rendered routes

Article base: `http://127.0.0.1:4502/review/relational-collection/`. Isolated media: the same base followed by `figures/{key}/`.

- r36: `postgresql/recovery/`
- r37: `postgresql/backup-and-restore/`
- r38: `postgresql/replication/`
- r39: `postgresql/logical-replication/`
- r43: `postgresql/upgrades/`

## r36 · PostgreSQL WAL, checkpoints and durability

First isolated reading: three SQL/code blocks (progress functions; transaction-local asynchronous commit; recovery log) and two tables read in full before prose. Figure 1 appears to separate inserted/written/flushed progress through Earlier/Purchase/Commit, with application outcome independent from table-page persistence; uncertainty was whether off showed an unavoidable crash outcome. Its own model note and subsequent prose correctly limit it to an allowed cut. Figure 2 makes the checkpoint record point back to a redo position while writes continue; its stacked phone form preserves sequence. The observation table maps operational questions to counters; acceptance table compares complete purchase/unlogged/unfinished state before and after restart. Context confirmed these readings.

| Check | Result | Note |
| --- | --- | --- |
|1 First reading alone | pass | Isolated route read and both interactive paths used before complete prose. |
|2 Form fits content | pass | Named WAL grid and backwards checkpoint relationship show the intended distinction; tables have real headings. |
|3 Readable at a glance | finding | Desktop/code readable; operational table becomes very tall and narrow at 375. See r36-visual1. |
|4 Interaction | pass | Six on and five off states inspected; every grid/outcome/explanation agrees. Back, Next, first/last disabled endpoints, Reset, keyboard Enter and Play/Pause used; focus stays on the invoked button, including endpoint. Full text alternative opened/read. |
|5 Themes and phones | finding | Actual 1280×720 and 375×720, Light/Dark verified. Both figures inspected at phone; state/controls remain together. Keyboard horizontal scroll verified for first SQL, recovery log and overflowing question table (scrollLeft 60.5/68.5/64). Acceptance table fits. Phone table effort is r36-visual1. |

Complete article read through final Sources disclosure; Sources opened/read. Native claims explicitly process crash on one host, not power-loss proof; models identified as illustrative. Download href observed (crash-drill.py); saving not tested. Mechanical rendered record names matching frozen hashes and both sizes/themes; fresh current inspection above replaces no check. Dark body rgb 220,215,204 on 38,35,32 and muted 168,162,148 on 38,35,32; light body 36,33,26 and muted 93,88,77 on 240,237,229; green checks use contrasting foreground. No meaningful text-contrast issue observed.

### r36-visual1 · medium · operational observation table at 375px

Problem: “Observations that answer different WAL questions” compresses three prose columns to a 407px table with a 343px viewport. Interpretation cells wrap mostly one to three words per line, leaving individual rows hundreds of pixels tall.
Effect: comparing the question, observation and interpretation requires long vertical traversal and horizontal adjustment; the table loses its quick operational lookup value on a phone.
Suggestion: retain readable column widths in a horizontally scrollable table, or use a labelled per-question layout at phone width.
Evidence: current 4502 article at 375×720/Light; keyboard scroll reaches 64px. The checkpoint-log and buffer-writing interpretation rows extend across the viewport while their question cells are off to the left.

Limits: automatic advance and readable holds were verified using ordinary screenshots and host timestamps (record below). Hidden DOM-only samples could stay stale. No native execution was rerun. No browser download-event/path/save API used. Controls and Sources reset, System checked,1280×720 verified, owned tab closed at first lease release.

## r37 · Restoring PostgreSQL to a recovery target

First isolated reading: code gives base/verify commands, XID 753 exclusive pause/timeline 1 settings and three-line recovery outcome. Six-state figure appears to fence old writers, restore before capacity mistake, lose B203 too, reconcile booking/decrement once, repeat stable request and transfer authority only after acceptance. Capacity/remaining/copy counters make the lost later booking clear; no unresolved uncertainty after the full prose/Sources. Table independently compares original 1/0/one, restored 3/3/absent and reconciled 3/2/one twice. All six states exercised with keyboard Enter Next to disabled endpoint; full text alternative read. Complete article and Sources read at exact 4502. Desktop dark initial drawing inspected. Current remaining checks completed in the table below.

## r38 · PostgreSQL physical replicas and promotion

First isolated reading: basebackup command seeds standby, SQL exposes sent/write/flush/replay and promotion/recovery-state. Figure separates primary durable commit from standby OS-write, flush and replay; fresh read becomes 103 only on replay. All 20 states (five each for local/remote_write/on/remote_apply) used with keyboard Next. The earliest success changes at the expected state; text alternative fully read and consistent. Initial question was whether “on” meant every standby: own note and complete prose qualify one selected synchronous standby. Complete article/Sources read; conceptual/native distinctions explicit. Desktop dark viewed. Current remaining checks completed below.

## r39 · PostgreSQL logical replication and change feeds

First isolated reading: publication/subscription and FULL command read, native sequence-counterexample table read. Three identity options all used and desktop-dark screens inspected. Primary-key case finds row_no 1, none refuses source UPDATE before a message, FULL matches whole old values. Full text alternative read. Publisher shows packed “Old:1,before” and “New:1,after”, rather than real row_no/value columns; context clarifies these but newcomer must decode tuples. Complete article/Sources read; FULL explicitly documented, not native. Current remaining checks completed below.

## r43 · Upgrading and migrating PostgreSQL

First isolated reading: transfer-route table contrasts logical rebuild, compatible-file upgrade and logical stream; six-line preflight command has genuine shell continuations and explicit copy/check; unchanged report table shows 10139.50/39.50/0,10240/40/0,10329/0/29. Figure compares fenced old and candidate before/after new accepted probe, while original shop rows remain equal. Both inspection options used, text alternative read, desktop-dark screenshots viewed. Context confirms separate physical/file and logical/history return boundaries; no uncertainty left. Complete prose/Sources read at exact 4502. Current remaining checks completed below.

## Completed current per-piece checks (r37/r38/r39/r43)

Each was inspected freshly at its 4502 article route in 1280×720/Light, 375×720/Light, 375×720/Dark, 1280×720/Dark; actual dimensions and effective theme read each time. Current text-colour pairs measured from rendered DOM: light muted 6.05:1, body 13.73:1 on figure surface; dark muted 6.15:1, body 10.89:1. Green arrow text 5.52:1 light/8.77:1 dark where used. Disabled controls excluded from meaningful text thresholds. No text-contrast defect found in these samples; ratios do not certify every pixel or unknown system rendering. No document-wide horizontal overflow at either width. Static code/table contents read in isolation before prose; current overflow exercised by keyboard rather than assumed from receipts.

| Piece |1 First alone |2 Form fits |3 Readable |4 Interaction |5 Themes/phones |
| --- | --- | --- | --- | --- | --- |
|r37 |pass: first notes above |pass: chronological history plus three acceptance counters |pass: table of four rows fits readable scan; first code remains one long command but scrolls |pass: six states, keyboard Next endpoint, Back/Reset/Play/Pause; full text alternative |pass: four layouts; all 3 overflowing code blocks focus and scroll (40/28.5/40px); table keyboard 22px; figure counters/state/controls visible together |
|r38 |pass: 20 states before prose |pass: primary/selected copy with explicit durable vs visible status |pass: compact statuses and named commit selector |pass: all 4 modes and 5 states; Play/Pause/Back/Reset keyboard; remote-flush phone comparison on vs remote_apply changes permitted reply while read remains absent |pass: four layouts; three code regions keyboard scroll 40/25.5/39px; stack preserves primary→standby meaning |
|r39 |pass: all 3 identity cases before prose |finding r39-visual1 |finding r39-visual1; other code/table readable |pass: all 3 options and text alternative; Space/End/Enter selected full and retained select focus |pass: four layouts;3 code blocks keyboard 40/40/38.5px; native sequence table fits 343px with readable 3columns |
|r43 |pass: both inspection cases/tables/code before prose |pass: unchanged row report separated from authority probes |pass: six actual command continuation lines; before/after report compact; route prose wraps but remains readable |pass: both options, full text alternative; Space/End/Enter selected after and retained focus; no playback controls, correctly not applicable |pass: four layouts; command keyboard 40px; both phone tables inspected, report fits; before/after phone candidate changes visible with its explanation |

### r39-visual1 · medium · Figure 1 Publisher and Subscriber row representation

Problem: old/new rows appear as packed tuples “Old:1,before” and “New:1,after”, without row_no/value column headings. Subscriber strings repeat the tuple form.
Effect: a newcomer must map tuple positions back to the preceding prose to know what identifies the old row and which value changes. The comparison is precisely about column identity, so hiding the columns adds decoding.
Suggestion: show tiny old/new row tables with real row_no/value headings and visually distinguish the identifying column; retain the useful no-message/refused branch.
Evidence: exact 4502 isolated and in-article Figure 1, all 3 options, desktop and 375px in both themes. The article names identity_case(row_no,value), but those headings never appear over the illustrated row values.

Findings for r37/r38/r43: none. r36-visual1 and r39-visual1 are the two supported substantive findings.

Review limits for all five: current rendered reading and control operation were performed; no native database execution rerun and no claim of independently proving the documented database mechanics. Mechanical applicability is qualified by the frozen manifests and statements read, rather than source inspection. Download links were readable; browser saving not tested. Automatic advance, readable holds and keyboard Play/Pause operation were observed with screenshot refresh and host timestamps; no foreground performance benchmark is claimed. These are initial article-mode findings, not final/corpus approval.

## Playback limit resolved by fresh rendered sampling

AX/DOM sampling alone did not refresh the hidden page. Ordinary viewport screenshots between samples did. On current 4502 r36, the 606px hold rail filled 66.7→328→586px under 4.08s, then step 2/6 appeared with an 8.31s rail (111.8→232→359px). Play read Pause, no form ancestor existed and browser warning/error logs were empty. On r37 the first hold was 7.095s, step 2 appeared at 8227ms with 9.12s hold; on r38 first hold 4.35s, step 2 at 5066ms with 7.635s hold. Pause, keyboard Next/Back and Reset worked after each. These current observations establish automatic advance and readable holds, not a foreground benchmark. The hidden-refresh method remains an environmental qualification, not an outstanding check.
