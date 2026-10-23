# Teaching review · article · Relational databases introduction · v1

Inputs read: [frozen manifest](../frozen-v1.json); [audience](../review-audience.md); complete [reader outcomes and parent/child scope context](../reader-outcomes.json), [shared example facts](../example-facts.md) and [published child metadata](../child-reading.json); complete current [article source](../../../../src/articles/relational-full-reference/introduction.astro) and rendered article at `http://127.0.0.1:4360/review/relational-full-reference/`; all three owned figures and their shared data. Read the complete fixed [Sequence diagrams](../../../../src/reference-articles/sequences.astro), [Indexes](../../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../../src/reference-articles/storage.astro) references, including their tables, code and complete figure text from the rendered reference pages. Read AGENTS.md, README.md, docs/site-direction.md, the review skill and only the teaching perspective file. No previous versions, feedback, other reviews, decisions or author notes were consulted.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | finding | Core terms receive usable first explanations, but the first set of shop tables combines two moments without establishing the distinction; teaching-1. |
| 2. Order | pass | Facts lead to a useful SQL result, then the decision behind a purchase, physical work, durability, application boundaries, distribution, recovery and the first shortlist. The difficult race receives the most help. |
| 3. Examples | finding | Mina, order 103 and P7 carry the easy and awkward cases well; the mixed starting state makes the later purchase require an unnecessary reconstruction; teaching-1. |
| 4. Showing | pass | The linked tables, query and exact answer, two stock histories, commit ordering, recovery comparison and arrangement table show the major distinctions. Later mechanisms remain concise previews with useful child handoffs. |
| 5. Judgement | pass | The reader can distinguish a stock constraint from a concurrency protocol, a commit from a successful request, recovery paths, and first system candidates. Changing conditions and evidence are named. |
| 6. Gradual exposure | pass | Each topic supplies a useful introductory answer before directing the reader to implementation or working depth. Child links follow the problem they deepen. |
| 7. Placement of additions | not applicable | First version; no coordinator-named additions. Ordinary placement and order were assessed under checks 1, 2 and 6. |

## Findings

### teaching-1 · medium · First shop figure and transition to the purchase

Problem: Figure 1 presents the shop's related tables with order 103 and both of its lines already present, while its products caption says the stock is from *before* order 103: P7 is 1 and P3 is 12. The surrounding introduction asks the reader to read the records describing Mina's purchase, and the order-history answer subsequently returns those existing lines. At the start of “A purchase changes several facts together”, the article then says accepting the order must add that order and its lines while changing these same stock values. The later “Start again just before order 103” establishes a rewind for the race, but does not explain the two moments already combined in Figure 1.

Effect: A newcomer must decide whether `pending` means an order whose stock has not yet been taken, whether the first tables represent an unfinished purchase, or whether the figure combines before and after facts solely for illustration. That uncertainty occurs just before the article teaches that stock and order rows commit together. It makes the running example harder to follow and obscures exactly what state the transaction changes.

Suggestion: Give the first related-table illustration one coherent moment, for example after order 103 with its resulting stock, and explicitly rewind to the pre-purchase state before showing the transaction. Alternatively, separate and clearly label the before-stock view from the completed records. The reader should not have to invent a pending-order lifecycle to reconcile the figures.

Evidence: [ShopFacts.astro](../../../../src/components/relational-full-reference/ShopFacts.astro) renders order 103 and its two lines alongside the caption “products · current offers; stock before order 103”; [data.mjs](../../../../src/components/relational-full-reference/data.mjs) supplies P7 stock 1 and P3 stock 12. The article's “SQL asks for a result” returns order 103, then [introduction.astro:41](../../../../src/articles/relational-full-reference/introduction.astro#L41) says the purchase must add it and reduce those counts. Figure 2's text explicitly states that stock and orders change together at commit. This is a teaching-state continuity finding, not a claim that the separately labelled historical facts are individually false.

## Limits

This is the assigned complete teaching assessment of v1, not technical certification or a visual/control review. I read scripted figure histories and rendered labels, including both complete current race histories, without playing animations. I inspected the current tables in their rendered context, but did not change viewport/theme or systematically assess responsive layouts and all animation variants. Native checks and mechanical receipts were not needed for this teaching finding and were not used as substitutes for reader judgement. Published children were assessed through the permitted complete scope/metadata inputs; their prose was not reviewed. No files other than this report were changed, no build was run, and no additional agents were arranged.
