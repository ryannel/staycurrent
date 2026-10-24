# Teaching reference preparation

Assignment: fresh independent complete-corpus teaching review; reference-only preparation. No current collection pieces, plans, source, evidence, findings, decisions, author notes or history have been read. No corpus article judgement or coverage is claimed.

## Text receipt

Read current `staycurrent-review/SKILL.md`, only its teaching perspective, and the reference-preparation assignment. Read each of the nineteen helper parts in a separate bounded tool output; every expected END marker was present and no output was clipped.

| Fixed reference | Parts read | Complete text SHA256 |
| --- | --- | --- |
| Sequence diagrams | 1–6 of 6 | 722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c |
| Indexes | 1–7 of 7 | d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1 |
| Storage and durability | 1–6 of 6 | 2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07 |

## Calibration from the text

- Starting point: begin with the useful question and an ordinary concrete action. Explain the local vocabulary as the reader needs it: message/lifeline before fragments; pages and row locations before index trees; memory and pages before durability mechanisms.
- Order: progressively change one aspect of the same example. A later section names what the earlier drawing could not yet explain, making the next mechanism necessary. Indexes first locates entries, then explains how a search reaches them; Storage first loses an acknowledged change, then introduces the log that prevents the loss.
- Examples: Mina's R17 booking, customer 42's orders and P7's price change retain identifiable objects across easy and awkward cases. The awkward case reveals the limit of a tempting rule: a missing status reply; scattered matching rows; a committed change surviving without the client seeing its reply.
- Showing: figures have explicit reading tasks before them, named controls, state descriptions and interpretation afterwards. The reader is told what to watch, what to change and what the changed result means. Tables make engine differences comparable when prose would make the reader retain too much. Source listings and text alternatives remain available without interrupting the main explanation.
- Judgement: mechanisms lead to decisions with changing conditions. A B-tree pays when work avoided exceeds visits added; an outbox moves failure handling rather than removing failure; asynchronous commit suits data whose loss can be accepted or rebuilt. Conclusions include costs and a way to inspect the real system, rather than a recipe without a stopping rule.
- Gradual exposure: an article gives the local answer before handing operational diagnosis or deeper mechanisms to a companion. The handoff names the unanswered question. High-level summaries remain useful without requiring every companion.
- Placement: added material should answer the uncertainty created at that point in the argument, using the established example and terms. Needed detail may be substantial; its test is reader understanding and practical use, not length.

Illustrative models and measured results are explicitly separated. The small order table stays visible; larger PostgreSQL results test the pattern while identifying environment and limits. Storage's client/flush model states its simplifying assumptions and compares its output with observed throughput. Such provenance prevents a reader mistaking teaching state transitions for a trace of real execution.

## Required preparation still pending

The text contains labels, captions, step explanations and controls, but it does not establish how the drawings look. All 34 actual styled reference drawings/explanations remain to be independently studied (Sequence 13, Indexes 11, Storage 10), including meaningful changed states. No CUA selection, creation, navigation or other viewport action has been performed because the visual reviewer holds the exclusive lease. Await root's public-output audit/ack, explicit lease grant or exact raw current render exports, and later the complete frozen ready manifest before reading any collection input.

## Completed rendered calibration after explicit lease grant

Root audited and acknowledged nineteen complete text deliveries. Later root granted the exclusive CUA lease. Independently studied all 34 actual styled drawings and their explanations in own Chrome browser 1 tab 315244708 at the three port-4350 reference URLs. Confirmed actual viewport 1488 × 973 and resolved dark theme with System selected. No viewport or theme change. Native-app inventory reported the Mac locked, but the browser DOM/screenshot surface remained available.

- Sequence figures 1–13: static message ladder and sign-in boundaries; stepped activation/wait states and 3-second wait; waiting versus unattended provider call; completed outbox flow; crowded/booking-only/email-only diagrams; early versus late poll; returning/new/invalid guards; scheduled versus never-ending loop; completed parallel replies versus absent status; TLS 1.2/1.3 round trips; central/delegated control; individual/batched customer calls. Actual rendered arrows, frames, labels, notes and surrounding explanations were read, scrolling tall figures in sections.
- Indexes figures 1–11: scan and constructed sorted index; customer 42 and 5 tree branches; bounded and widened ranges; secondary-key lookups through clustered upper levels; scattered/grouped matching rows; composite order variants; uncovered, vacuumed covering and subsequently updated page states; insert with one/four indexes and indexed-total update; sequential/random split totals; scattered/oldest deletion and vacuum/rebuild states. Counters and changing page/entry arrangements make the work avoided visible.
- Storage figures 1–10: 100-byte versus 2,000-byte page filling; full buffer pool and eviction; PostgreSQL/InnoDB old versions; acknowledged write lost without a log; log flushed before acknowledgement and later page write; background writer behind/up to date; grouped/unshared flushes; crash before/after flush; honoured/ignored flush; asynchronous commit before/after WAL writer. Read changing lane contents and explicit application outcome as well as explanation.

Control study was teaching calibration, not a full mechanics certification. Some End-key jumps immediately began playback again, so stable manual Reset/Next steps were also used for buffer eviction, row versions, WAL, recovery and flush comparisons. Several tall figures required separate upper/lower viewport readings. All 34 drawings were visually studied; none was inferred solely from extracted captions. Each reference was reloaded before leaving to reset touched controls, verified initial range values (sequence 0 except its near-zero fractional start, indexes 1, storage 0), and own tab was closed. Exclusive CUA lease released to root. No current collection reading occurred before this calibration was complete.
