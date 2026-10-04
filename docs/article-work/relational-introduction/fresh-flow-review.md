# First-reader review: Relational databases

I read the article source as a first reader with engineering experience but no assumed knowledge of relational databases. The local preview did not respond, so this review covers the prose in `src/pages/learn/databases/relational.astro`. I did not inspect the imported illustrations, other articles, plans, or previous reviews. This limits what I can say about how the visual examples support the text.

## The argument I take away

A relational database gives an application a shared description of its information and several ways to work with that information safely. Tables keep records in a consistent shape. IDs connect facts that belong in different tables. Queries combine those facts to answer questions. Indexes make some questions cheaper. Constraints reject declared mistakes, transactions keep related changes together, and concurrency controls address requests that overlap.

The running shop example makes those jobs feel connected. The article's strongest underlying point is that storing a purchase, finding what was bought, and keeping stock correct require different mechanisms. None of those mechanisms relieves the application designer of deciding what the data means or what counts as a correct operation.

## What I could explain to another person

- **Tables and identities.** I can explain the difference between adding a product row and adding a weight column. The statement that an ID survives a name change, and is not a position on disk, gives the primary key a clear purpose.
- **Why information lives in several tables.** An order points to its customer, while order lines connect the order to its products. Correcting contact details in one place is a concrete benefit. The following paragraph about preserving the price paid is especially useful: I understand why removing every repeated value would be the wrong goal.
- **What a join does.** It matches product IDs on order lines with product IDs in the products table to obtain product names. I understand the matching idea, though I could not yet demonstrate its result with confidence for several rows.
- **Why indexes are a tradeoff.** They can avoid examining unrelated rows, but consume space and add work when records change. The observation that reading a whole table can be preferable prevents the mistaken conclusion that every query needs another index.
- **Constraints versus transactions.** A constraint rejects a declared invalid value or reference. A transaction groups several operations so a failed purchase does not leave only some database changes behind. The examples give these two mechanisms separate jobs.
- **Why transactions are not enough.** Two buyers can both see the last item before either updates it. Keeping each buyer's changes together does not by itself explain how their competing decisions are coordinated. I also understand why a payment service lies outside the ordinary database transaction boundary.

## Where I lose the thread

The last paragraph of “Tables, rows, and columns” moves from a simple logical model into engines, row-oriented storage, pages, and memory. I understand its warning that a table does not dictate a storage layout, but pages do not help me answer the next question about relationships. This feels like an early side branch before I have seen the basic model do useful work.

“Queries and joins” explains a match, then moves directly to execution plans. I want one completed question and answer between those steps: which order lines are selected, which products match, and what the resulting rows look like. The prose gives me the ingredients without letting me follow an entire query. An imported illustration may supply this; I could not verify that from the article source alone.

The SQLite paragraph interrupts the constraints explanation. I have just learned that a primary key supplies a “unique, non-missing identity,” then encounter an engine where some declarations allow missing values. The qualification is credible and potentially important, but I am now thinking about exceptions before I have seen the ordinary rules reject an invalid order. Moving this detail into a note or a later engine discussion would help preserve the main explanation.

The concurrency section starts with the strongest unresolved problem in the piece, then gives several partial answers: locks, record versions, isolation levels, rejected transactions, retries, and uncertain outcomes after connection loss. I follow why each issue matters, but the original two-buyer example never reaches an outcome. “A write lock can make another writer wait” leaves me unsure whether the second buyer waits and then succeeds, waits and then discovers there is no stock, or must restart. The linked follow-up promises to address exactly this, so the gap is acceptable for an overview, but it should be made explicit where the example pauses.

## What remains mostly a name

Schema and primary key are sufficiently explained. Execution plan is intelligible as a sequence chosen by the engine, but I have no example of two possible sequences. An index's organisation remains abstract: I know its benefit and cost but cannot explain how its arrangement determines which questions it helps. “Multiple versions” and “isolation level” are the least settled concepts. I cannot yet say what a consistent view includes or give an example of something one isolation level permits and another prevents.

The final references to document-shaped values, text search, and vector retrieval broaden the product discussion, but add little to my understanding of relational databases. For an unfamiliar reader, that paragraph reads as a pointer to future choices rather than an explanation I can use now.

## Verdict

This is a coherent introduction with a clear order and a useful distinction between the jobs of different database mechanisms. The customer, order, product, and stock examples carry most of the explanation successfully. I finish understanding why an application might choose a relational database and why correctness involves more than putting records into tables.

It is strongest as a conceptual overview. It is less complete as a first worked encounter: I have not followed one concrete query to its answer or one competing purchase to its outcome. A small completed join example would strengthen the central explanation more than additional terminology. The storage paragraph and SQLite exception are the main interruptions to an otherwise steady progression.

## Questions I want answered next

1. What exact rows come back when I join one order's lines to the products table, and what does the SQL look like?
2. How does the second buyer discover that the last item has already been taken, and which parts must the application arrange?
3. How do I decide which facts belong in their own table and which historical values should be copied into a purchase?
4. Why does one index help a date-range query but fail to help a different question?
5. What concrete change in behaviour do I get when I choose an isolation level?
6. What requirement would make me reconsider the relational approach rather than simply choose a different relational product?
