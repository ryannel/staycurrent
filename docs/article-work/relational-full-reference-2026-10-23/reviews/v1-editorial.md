# Editorial review · article · Relational databases · v1

Inputs read: [assignment](../assignments/first-editorial.txt), [intended audience](../review-audience.md), the complete frozen [rendered article](http://127.0.0.1:4360/review/relational-full-reference/), and the complete rendered fixed references [Sequence diagrams](http://127.0.0.1:4350/review/examples/sequences/), [Indexes](http://127.0.0.1:4350/review/examples/indexes/) and [Storage and durability](http://127.0.0.1:4350/review/examples/storage/), including their figure descriptions, labels, controls, tables, code and source notes. Read AGENTS.md, the review skill and only its editorial perspective. Plans, author notes, older drafts, previous findings and other review reports were withheld and not inspected.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The headings name the question or distinction each section develops. The title suits a complete introduction. |
| 2. Plain sentences | finding | Mostly plain and connected; the application-obligations paragraph compresses several unfamiliar practices into a checklist (editorial-1). |
| 3. Terms | finding | Tables, keys, schema, joins, transactions, isolation, locks, pages, WAL, replicas and recovery objectives are introduced usefully. The later application-obligations paragraph assumes what binding parameters and borrowing connections mean (editorial-1). |
| 4. Openings | pass | The opening establishes what a relational database does, why shared facts need one, the limits to investigate and the shop example. Section openings connect the next question to that example. |
| 5. Reader-facing text only | finding | Figure 2's final caption sentence uses unexplained verification-workflow language (editorial-2). The draft banner is review framing, not treated as an article defect. |
| 6. Captions and labels | finding | The figures explain what is shown and distinguish illustration from execution; the purchase-protocol selector and playback labels are intelligible. One caption phrase is directed at production rather than the reader (editorial-2). |
| 7. One piece | finding | The facts → query → purchase → commit → request → copies → recovery → choice sequence is coherent, with stable names and a purposeful recurring purchase. The application-obligations paragraph interrupts its worked reasoning with a compressed list from several further topics (editorial-1). |

## Findings

### editorial-1 · medium · Relational databases — “A committed order and a successful request are different”, paragraph beginning “The application owns further boundaries”

Problem: After explaining the uncertain commit and outbox through concrete events, the article abruptly asks the newcomer to “bind her supplied values as query parameters”, “release borrowed connections”, and arrange a schema rollout that lets both versions understand the data. It supplies neither the meaning of the first two operations nor the failure each prevents. Authentication, authorisation, parameter binding, transaction duration, timeouts, connection reuse and schema compatibility arrive in one paragraph, followed by four links. These are presented as application duties rather than merely named future subjects.

Effect: A relational newcomer can follow the preceding purchase reasoning but must supply outside knowledge to understand what this paragraph tells them to do. In particular, they have not been told what a connection is borrowed from or how binding a value differs from putting it into SQL. The paragraph consequently reads as a coverage checklist inserted into the worked explanation. Its link destinations offer a later route, but do not make the obligations understandable at the point of reading.

Suggestion: Give the selected application boundaries a short causal explanation in the shop's terms, or reshape this passage into a genuinely intelligible invitation to the deeper subjects. Preserve the distinction between what the database guarantees and what the application must arrange, without requiring the newcomer to decode a list of practices.

Evidence: The full paragraph in the frozen [request section](http://127.0.0.1:4360/review/relational-full-reference/#request), between the outbox explanation and its further-reading paragraph. Earlier connection discussion only says that a request may wait for a free connection; it does not explain borrowing or returning one. In the fixed references, comparable practices receive the missing causal step—for example, Sequence diagrams explains what the worker's lease does and why a database lock is insufficient before naming the resulting responsibilities.

### editorial-2 · low · Relational databases — Figure 2 caption

Problem: The caption ends “The supporting native check reproduced both outcomes.” “Native check” is unexplained review terminology, and the caption does not identify or link a reader-usable check.

Effect: The reader has to infer what was checked and what “native” distinguishes. This briefly breaks the otherwise clear caption, whose preceding sentences already say that the animation is an illustration rather than a running database.

Suggestion: Express the verification in ordinary reader-facing terms, identifying the actual database execution if it belongs here, or leave the verification detail to the source note that already names PostgreSQL 18 and distinguishes execution from illustration.

Evidence: Final sentence of Figure 2's caption in the frozen [purchase section](http://127.0.0.1:4360/review/relational-full-reference/#purchase). The article's own Sources and further reading note gives the clearer statement that the history query and stock protocols were checked on a PostgreSQL 18 instance.

## Limits

This is an independent first editorial reading of v1, not technical verification or a visual/control review. I read the complete rendered article, including both purchase histories through its expanded “Both histories as text” disclosure, and the three complete rendered references. Figure descriptions, drawn text, captions and controls were read; I did not play every reference animation or exercise every variant. I used dedicated Chrome tabs without changing the visual reviewer's viewport or theme. Source plans, execution evidence and external technical sources were outside this assignment and were not consulted. No article or component was edited.
