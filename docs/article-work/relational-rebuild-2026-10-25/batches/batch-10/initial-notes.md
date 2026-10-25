# Blind reader notes — batch 10

Fixed first versions: storage-durability/v01 and incidents/v01. Read on the main preview at port 4606. These notes were saved before reading plans, example facts, author notes, mechanical receipts or earlier verdicts. No older manuscripts were read. I used staycurrent-review with teaching, editorial, practitioner and visual perspectives.

## First illustration reading

Storage: Figure 1's page copied into one buffer lets me explain why P3 can hit after P7 misses without treating a buffer miss as a physical drive read. Figure 2 makes the two concurrent prices visible, then contrasts PostgreSQL's table versions with InnoDB's undo reconstruction. Figure 3 holds the table at 20.00 while U and C reach the durable log before success. Figure 4 independently displays what the caller heard and what recovered; selecting the earlier cut changes the recovered price to 20.00, while selecting the early asynchronous reply shows success followed by recovered 20.00. The checkpoint strip and amplification map are simpler conceptual summaries; their captions prevent quantitative readings. No missing central connection found in the figure sequence.

Incidents: Figure 1 displays a 600 ms acquisition interval inside a 1,000 ms request; the 300 ms statement is another contained part, not an extra second to add. Figure 2 makes the population count legible: three borrowed clients with database statements, two callers outside the database, then one pool caller leaving without releasing H. Releasing H precedes completing readers and returning clients. Figure 3 visibly crosses the repair's six-GiB requirement before the volume reaches zero. Figure 4 carries the recovery prediction all the way to useful completions. No contradiction found between the selected states and their explanations.

## Body reading and reference calibration

Both pieces build a connected explanation around one small example. Storage introduces a page before cache, a snapshot before retained versions, and dirty memory before WAL and the commit wait. The distinctions among logical history, retained physical versions and backups follow naturally from that example. Its headings use normal terms such as “Row versions and cleanup”, “Asynchronous commit” and “Crash recovery and checkpoints”. The four cleanup states avoid compressing “old version removed” into “file shrank”. The prose acknowledges the scope of the model where it changes an inference, rather than treating an invented schedule as a measurement.

Incidents states a practical purpose early: choose an action whose effect can be predicted and checked. Its paragraphs connect each observation to the next question. “A full pool establishes where the later callers wait; it does not yet explain why the earlier borrowers remain there” is then developed by the holder model. Later sections distinguish a stopped scheduler from stopped running work, and disappearance of a lock from recovery of service. The two-row report result stays subordinate to the incident question instead of becoming another plan-analysis lesson. The section “When a live change triggered the incident” applies the same reasoning without restarting the whole explanation.

Comparable fixed reference passages and drawings consulted: Storage's opening, buffer explanation and WAL Figure 5 with its before/after explanation; Sequence diagrams' opening and “Replies and activation bars”/Figure 2; Indexes' opening, “Sequential scan”/Figure 1 and index-entry/row-location explanation. The current pieces use the same concrete watch/change/explain pattern. Their shorter treatment is coherent at article level; I found no article-wide prose or teaching failure against those examples.

## Current findings

No substantive editorial, teaching or rendered defect identified in the blind reading. Potential optional polish only: incidents “take an excluding lock” (Storage delay and running out of space) is less standard than the exclusive-lock terminology used elsewhere; the surrounding VACUUM FULL example still makes the consequence clear.

## Browser scope so far

Actual IAB screenshots and controls, at 1280×720 and 390×844, using both dark and light appearances. Storage: all four buffer and version stages, both engine selections (InnoDB middle states and PostgreSQL cleanup), all six WAL stages, default crash recovery plus before-durable and asynchronous outcomes; representative phone crash state, checkpoint strip and amplification map. Incidents: complete six-stage chain at desktop, representative phone states with keyboard Enter and visible focus, timing chart at desktop and phone, space chart at desktop/light and phone/dark, and desktop recovery path. Manual stepping, selector changes and resets observed. Playback cadence, numerical contrast, every mobile state and the full mechanical matrix remain unclaimed at this point. No builds or content edits made.
