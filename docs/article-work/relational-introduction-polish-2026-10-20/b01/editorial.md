# Editorial review: relational introduction

Reviewed the finished `src/articles/relational-next/a00.astro`, its imported a00 figures and their visible states at `http://127.0.0.1:4438/review/relational-next/`. Audience: an intelligent newcomer progressing towards expert relational-database practice within the wider corpus.

Read Sequence diagrams, Indexes, and Storage and durability in full, including their rendered figures, captions, controls and text alternatives, as the editorial standard. No planning documents, earlier drafts, writer reports, previous reviews or approvals informed this review. No source edits, builds or Git operations were performed.

## Verdict

One P2 repair and two P3 polish findings. The article is coherent and mostly clear: the shop gives the sections a common subject; the headings name recognisable questions; the figure instructions usually identify both the action and the result to watch. The remaining substantive editorial problem is the ambiguous language around retry identifiers.

## Findings

### E1 — P2: name the purchase-attempt identifier instead of calling it an identity

**Locations:** `src/articles/relational-next/a00.astro:80–81`; `src/components/relational-next/a00/DecisionFigure.astro:65,70`.

“Repeating the purchase with a fresh identity”, “Give the logical attempt a stable identifier”, “resolve that operation rather than invent another” and “Carry a corresponding stable identity” change nouns while explaining one important idea. “Identity” is especially ambiguous immediately after the section has discussed Mina’s signed-in identity and customer identifier. A newcomer has to infer whether this means another user, another order number or an identifier attached to the purchase attempt. Figure 3 briefly shows “Order attempt R103”, but does not explain R103’s role; its final narration repeats “fresh identity”.

**Repair:** name a purchase-attempt identifier once, give R103 that explicit role, then retain that noun through the paragraph and figure. For example: “Give this purchase attempt an identifier, such as R103, and reuse it for every retry. Store it with the order under a uniqueness rule, together with the result.” Explain that retrying the same purchase under a new attempt identifier can create a second order. Say what is carried to the payment provider using equally concrete wording. Preserve the existing qualification about an overlapping attempt still being able to commit.

### E2 — P3: replace compressed abstractions and the awkward constraint sentence

**Locations:** `src/articles/relational-next/a00.astro:75–78,93,96`.

“The application must preserve values and authority on either path” is hard to interpret on first reading. The next paragraph makes two useful concrete points—pass input separately from SQL text and check the user’s permission—so the abstract summary adds effort before that explanation. “A refused constraint” assigns the refusal to the wrong thing: the database refuses a change that violates a constraint. In the live-change section, “A new required column meets two older things” and “Add a representation that existing code can tolerate” weaken an otherwise concrete example with vague nouns.

**Repair:** remove the “values and authority” sentence or state the two obligations plainly. Change the constraint sentence to “If the database rejects the change because it violates a constraint, that change failed.” Keep the live-change instruction attached to the delivery-instruction column: “Existing orders have no delivery instruction, and older application instances never send one”; “Add the delivery-instruction column as optional first.” This is a small copy pass, not a request for more coverage.

### E3 — P3: remove editing history from the sources note

**Location:** `src/articles/relational-next/a00.astro:124`.

“With the added comparisons checked on 20 October” and “Figures 3–6 were added on 20 October” describe the revision process, although the reader has no earlier version to compare. The verification dates, illustrative-model boundary and separately checked SQL are useful; the figure-addition history is not.

**Repair:** use a final-state note, such as “Primary documentation checked on 19 and 20 October 2026. The shop and all six figures are illustrative.” Retain the explanation of what was checked on PostgreSQL and what the figures do not execute.

## Remaining observations

No additional editorial repair is requested for the article title, section headings, SQL labels, figure titles or control names. Figures 1 and 2 explain their changing rows and visibility clearly; Figures 3–6 consistently distinguish their illustrative states from executed database work. The reading-route table gives useful concrete destinations without requiring the introduction to explain every procedure.

Temporary browser tabs were closed. This reviewer did not alter viewport or theme settings.
