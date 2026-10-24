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
