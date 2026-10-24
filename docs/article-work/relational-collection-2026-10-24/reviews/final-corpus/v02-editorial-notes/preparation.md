# Editorial corpus v02 · preparation receipt

Reviewer: `/root/collection_corpus_editorial_v02`.

Status: prepared; awaiting the coordinator's exact frozen current 58-piece manifest and intended audience. No current collection article, plan, author note, repair record, decision, previous review or output has been read. This receipt is calibration, not a collection verdict.

## Instructions and permitted inputs

Read `AGENTS.md`, `.agents/skills/staycurrent-review/SKILL.md` and only the assigned `perspectives/editorial.md`. Read `scripts/read-writing-reference.py` to use the bounded reference reader, and the fixed reference export manifest for provenance. No other perspective file was read.

## Complete fixed reference reading

Each part was requested in a separate tool result, with a 5,000-token output allowance. Every listed END marker appeared intact; no part was clipped and no recovery was required.

| Reference | Parts read, with END markers | Complete text SHA256 |
| --- | --- | --- |
| Sequence diagrams | 1/6, 2/6, 3/6, 4/6, 5/6, 6/6 | `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c` |
| Indexes | 1/7, 2/7, 3/7, 4/7, 5/7, 6/7, 7/7 | `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1` |
| Storage and durability | 1/6, 2/6, 3/6, 4/6, 5/6, 6/6 | `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07` |

Read the references as finished prose and teaching, including their full introductions, section development, code, tables, captions, labels, scripted step text, qualifications and sources. The helper validated the fixed source and text hashes before every part.

## Rendered drawing inspection and release

Used only CUA for UI interaction in one agent-created Chrome tab, ID `315244727`, at the reference routes on `http://127.0.0.1:4350`. Visited sequences, indexes and storage only. Did not open or act on a user tab. System theme remained selected; no theme, viewport or global preference was changed. Chrome did not support an explicit visibility option, so the tab was created with ordinary Chrome tab options in the reviewer session.

Inspected screenshots of every numbered drawing: sequences 1–13, indexes 1–11, storage 1–10. Read the completed sequence interactions and completed index drawings, as well as the storage memory/disk lanes, page filling, buffer eviction, old-version cleanup, WAL, dirty-page eviction, grouped flushes, recovery, flush path and acknowledged-loss drawing. For page filling, inspected both the initial 100-byte state and the completed 2,000-byte state. Full scripted alternative text was already read in the reference exports. This preparation was editorial calibration, not an exhaustive visual/mechanical verification of every alternate setting.

Touched playback controls and storage row size. Reset all touched sequence controls to zero; all touched index controls to their initial step 1; restored storage row size to 100 B and all ten storage controls to zero. The final storage selection readback matched the initial options: 100 B, PostgreSQL, fell behind, 16 clients, 5 ms, group commit on, after flush, honours flushes, before WAL writer. Closed the private tab after reset. Reference UI use is released.

## Editorial calibration

1. Titles name the subject or reader's practical question economically. Section headings are specific enough to navigate without turning the article into a list of slogans.
2. Plain prose still develops an argument. Sequence diagrams first shows Mina's four messages, then explains what their order lets the reader know. Indexes moves from the book analogy to page arithmetic, and later uses that arithmetic to choose an index. A short comprehensible sentence does not compensate for an undeveloped explanation.
3. Terms arrive beside things the reader can already identify. Participants, lifelines and messages are named against the booking. A TID is unpacked into page and item, with the concrete `(0,3)`. Storage names a dirty page by comparing the copy in memory with its file.
4. Openings establish the subject, why someone needs it, the main trade and enough setting for the running example. They do not rely on a neighbouring article to make the opening claim intelligible.
5. Reader-facing limitations explain what the model or evidence supports. The references distinguish invented rows, modelled figures and measured page counts in prose useful to a reader, without narrating writing or review work.
6. Captions say what is shown and what to compare. Controls name the changed condition. The prose tells the reader where to look before the figure and interprets the result afterwards: the page-read counters in Indexes, the nested waits in Sequences, the flush before the reply in Storage.
7. Qualifications belong with the reasoning they alter. Sequence diagrams explains partial ordering where it redraws the worker's poll; Storage ties the durability promise to an honest flush and a surviving disk in its opening, then develops each limit. Engine-specific differences are organised where they change the practical choice, rather than collected as interrupting objections.

The eventual full reading will apply all seven ordered checks to each of the exact 58 pieces, assess cross-article terms, names and running example, and support each whole-article judgement against the reference standard with passages. No current-collection judgement has yet been made.
