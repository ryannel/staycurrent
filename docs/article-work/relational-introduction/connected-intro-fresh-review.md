# Fresh reader review: relational introduction

Reviewed 4 October 2026 as an intelligent engineer new to relational databases.

The introduction is useful in its own right. I can explain why its mechanisms belong together, and can apply several of them to a changed situation without opening another article. I found no blocking gap in the connected argument. The remaining suggestions below would make the next step easier rather than repair a broken introduction.

## What I read, and limits

I read the rendered introduction at `http://127.0.0.1:4321/learn/databases/relational/` through the browser's accessibility tree, including the complete body, captions, source notes, and collapsed collection group labels. I inspected desktop screenshots of the opening and relationship illustration. I followed the query-results and checkout links and read the rendered contents of both destinations. I did not open every collection group, exercise the checkout experiment, inspect mobile or dark-mode rendering, or check the linked external documentation. This is a reader assessment, not independent factual verification or complete visual QA.

I did not read plans, briefs, discussion, evidence files, other reviewer reports, or editorial examples. I loaded the required house-style skill entry but did not follow its example references, preserving the fresh-reader restriction. Source fallback was unnecessary; the local rendered site was available.

## The connected argument I took away

Tables give records a consistent shape, and keys give them stable identities. Those identities let orders refer to customers and products, avoiding repeated copies of facts we want to maintain in one place. The price paid is a useful exception: keeping history is a different requirement from maintaining a current shared fact.

Separating records creates the need to put information together again. The join example supplies an actual answer, “Blue mug, 2,” so the term describes something I have just understood. SQL describes the requested result; the engine chooses how to obtain it. Indexes then address the work involved in finding records, with costs for storage and writes.

Efficient lookup does not ensure meaningful data. Constraints protect declared values and references. Those rules still permit a partially recorded purchase, which creates the need for a transaction. Atomicity keeps the intended operations together, durability addresses surviving failure, and the payment-service example marks the boundary of what the transaction can undo.

Even a complete transaction can act on an outdated decision. The two-buyers example therefore introduces concurrency as a further requirement. Locking before the check explains how the decision is protected; locking only the later write would be insufficient. That distinction makes the explanation materially more useful than a list of transaction properties.

The choice section follows from these mechanisms. Shared records, varied questions, and coordinated updates are reasons to consider this family. Index maintenance, contention, and reporting work are costs to examine. Product choice and operating responsibilities remain separate decisions.

## Missing understanding and prioritized findings

1. **P3 — The query section could provide a small next step that is available now.** I understand the join in words, but I have not seen what the request looks like or how a result appears with two order lines. That is an acceptable boundary for this introduction. It becomes slightly frustrating because the natural next link, “Writing queries whose results you understand,” is only an outline. Moving or repeating the existing PostgreSQL joins reading link beside this section would give an interested newcomer an immediate continuation without expanding the introduction.

2. **P3 — The last concurrency paragraph changes scale quickly.** The stock example is concrete; multiple versions, isolation levels, rejected transactions, and uncertain outcomes after a lost connection arrive in two paragraphs. I can understand the distinctions, but cannot yet reason through their implementation. The existing checkout draft is the useful continuation. Linking it beside this section, as well as under “Where to go next,” would connect that new curiosity directly to available reading.

Neither point is a prerequisite gap for the argument that follows. I would not require SQL syntax, every isolation level, or storage mechanics before accepting this as an introduction. The constraints-to-transactions and transactions-to-concurrency transitions are particularly clear.

## A changed situation I can reason through

Suppose the shop changes the blue mug's catalogue price from €20 to €25 after Ada bought two. I can keep P7 as its identity and update the shared product record once. Ada's order lines must retain the price she paid if the application needs an accurate receipt; joining to today's product price would answer a different question. A later query can combine the current product name with the quantity and historical purchase price. This follows from the introduction's distinction between current shared facts, historical facts, and joins; it does not depend on the deeper checkout article.

I can also predict that an orders-by-customer index would not necessarily help a new report selecting yesterday's orders. The report asks for a different route through the data, and another index would add write work. I do not yet know the right index to build, but I know what evidence I would need to investigate.

## The two destinations I chose

- **Writing queries whose results you understand** (`/learn/databases/relational/query-results/`). I wanted to see a real query and understand its result after the prose join example. The destination explicitly says the article has not been written. It offers a short scope covering multiplied join rows, filtering, aggregation, and missing values, plus navigation back to the introduction. This is useful information about future coverage, not available instruction. The origin's “Planned reading” label and destination's prominent notice make that honest.
- **Two buyers trying to reserve the last mug** (`/learn/databases/relational/checkout/`). I wanted to see how the locking explanation translates into database work. The link opens a substantial working draft titled “The last blue mug,” with a guarded-update SQL example, an interactive experiment, illustrations, and further explanation of versions and recovery. The controls are rendered, but I did not run them in this review. It is actual available reading, and its draft status is visible. Its simplified one-product order model differs from the introduction's order-line model, but the shared purchase problem makes the move understandable.

The collection is visibly a plan, while the separate “Where to go next” section offers existing reading. I would leave the page with a coherent initial understanding even if none of the planned articles were available yet.
