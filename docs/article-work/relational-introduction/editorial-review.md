# Editorial review — revised relational introduction

Reviewed 4 October 2026 by reader A. Editorial result: no material repair required for the commissioned overview. This is one independent editorial opinion, not publication approval or a substitute for technical and fresh-reader review.

## Input boundaries and revision

I first recorded the table-only reading in `table-reader-a.md`, before opening the revised brief or article. I then read `brief.md`, the review protocol, content structure, editorial guide, teaching-aid guidance, and house writing references. I read the actual opening and early round-robin explanation in [Sam Who's Load Balancing](https://samwho.dev/load-balancing/), Disc and Transmission in [Bartosz Ciechanowski's Gears](https://ciechanow.ski/gears/), and the character, scene, and missing-etcd discussion in [Julia Evans's cartoon essay](https://jvns.ca/teach-tech-with-cartoons/). I did not read other reviewers' reports or the superseded article.

I read the article prose without its media, then the assembled page at `http://127.0.0.1:4321/learn/databases/relational/`. Browser review used Chrome at its existing 1488 × 970 viewport; I did not change the shared viewport. The assembled page was dark. The isolated new table was inspected in both themes; the relationship aid had previously received my separate light/dark reading. I did not test a screen reader, phone layout, keyboard focus, external database references, or the build in this editorial role.

Repository HEAD: `189ff3059cfe136634103e9c0b48a87bb2f54c23`.

Reviewed dirty-file SHA-256 values:

- `src/pages/learn/databases/relational.astro`: `e6f14f54bf1c4e2a14240e30fc7bed6e707f2602b6ea47d94aa6d422de1f05c9`
- `src/components/explainers/RelationalTableExample.astro`: `da86297d9a79b0d34ef4c11bac40295d88d6f61d2ae6462b133c293ef1797e22`
- `src/components/explainers/SketchRelational.astro`: `4214341eccc63fc8bdfdd42a69bb630f8e4101baf19fd9cd4f565d599d7e7d45`

## Does it do the commissioned job?

Yes. The opening names the system and its representation, then explains why applications need more than saving and retrieving unchanged records. A newcomer does not have to decode an operation to learn what the technology is. The shop remains an accessible source of examples rather than the article's organising task.

The sequence builds a coherent picture. Rows and columns lead to schemas and identity. Identity makes the references between separate tables understandable. Shared facts explain why those references are useful; the purchase-price paragraph then prevents “avoid every duplicate” becoming the inferred rule. Queries show how the separated facts become useful answers, and their potential work motivates indexes. Constraints, transactions, and concurrency controls answer three distinct correctness questions. The final section derives fit from those capabilities and distinguishes the family from product and deployment choices.

The text stands alone. The relationship prose says which records refer to which, and the query prose explains a join without requiring SQL syntax. Removing the images would make the layout and references less immediate, but would not remove a necessary proposition. No experiment must be operated to understand the article.

Depth fits an overview. It explains what indexes save and cost, what a transaction groups, why all-or-nothing work does not settle concurrent decisions, and how locks can cause waiting. The multiple-version and isolation paragraph is brief, but enough to mark the next level of study without turning this into an isolation survey. The discussion of outside services and ambiguous lost connections prevents overreading the transaction promise.

## Voice, headings, and support

The title and deck describe the actual subject. Section headings give each mechanism a purpose instead of presenting a vocabulary list. The longer concurrency heading wraps to two lines at this viewport but remains legible. The article does not repeatedly restart its scenario.

The references use concrete observations to earn an abstraction. This article does the same within its overview scope: an extra product makes a row, changing a name does not change identity, copied contact details create update work, and an index saves searching at a maintenance cost. The text is more compact and less conversational than those reference essays, but it explains enough to justify that compactness. It does not need their full simulation-led structure.

The two aids arrive where they help. The table makes row/column organisation visible as those terms are introduced. The relationship sketch removes the mental work of holding four references at once. The full-page caption also explicitly resolves the possible card-versus-table ambiguity from my earlier isolated reading. The table caption resolves the per-item-price ambiguity. Both aids look static. Neither interrupts the later explanation with unrelated mechanics.

No additional diagram is necessary to meet this brief. The later paragraphs explain mechanism purpose and tradeoffs; a detailed index or locking diagram would change the teaching scope unless it addressed a demonstrated reader failure. The linked deeper draft is the appropriate next route for tracing competing updates.

## Findings

No material findings. The following are optional refinements; acceptance does not depend on applying them.

| ID | Location | Observation and reader consequence | Optional repair | Verification |
| --- | --- | --- | --- | --- |
| E1 | `relational.astro:19`, third opening paragraph | The mechanism inventory previews several terms before their definitions and repeats work the headings later do. It is a reasonable roadmap, but delays the first concrete table explanation slightly. | If tightening, shorten this to one sentence about organising, querying, and changing shared data, or remove its final sentence. Preserve the first two opening paragraphs. | Read in source and assembled header. |
| E2 | `relational.astro:27`, physical-layout paragraph | “Engine” is the one central implementation word used without an explicit gloss. Most engineers can infer it, but this reader is allowed to be entirely new to databases. | Introduce it as the software that stores and retrieves the data, then keep the existing logical/physical distinction. | Read prose without media. |
| E3 | `relational.astro:80`, category overlap | “Vector retrieval” and “document-shaped values” introduce new territory in the closing paragraph. The point about overlapping capabilities still works, but these examples are less immediately meaningful than tables, names, and orders. | Optionally use a plainer example such as searching text or keeping nested product details, leaving vector retrieval to the field guide. | Read conclusion and onward links in context. |

The planned-reading line clearly distinguishes future coverage from available articles. The two next-reading descriptions give a concrete reason to follow each link. I did not verify those destination pages or external technical claims in this role.
