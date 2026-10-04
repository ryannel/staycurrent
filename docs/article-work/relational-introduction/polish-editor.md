# Editorial review: relational introduction

Reviewed 4 October 2026. Scope: the whole `src/pages/learn/databases/relational.astro`, including the source of its table, relationship illustration, and reading components. I read the house style skill, editorial guide, content boundaries, and review protocol. I did not read earlier reviews. This is an editorial assessment of the source, not a browser, accessibility, or technical verification. No article changes were made.

I read the specified original passages in [Sam Who’s Load Balancing](https://samwho.dev/load-balancing/), [Bartosz Ciechanowski’s Gears](https://ciechanow.ski/gears/), and [Julia Evans’s cartoon essay](https://jvns.ca/teach-tech-with-cartoons/). The useful common ground is that an explanation stays with a recognisable situation long enough for the reader to understand what changed. Their informality also leaves room for direct observations instead of continually qualifying the explanation.

The introduction has enough substance for its job. The progression from IDs to joins, from valid records to a complete purchase, and from one purchase to competing buyers is intelligible. “Blue mug, 2” and the second buyer seeing zero stock do real explanatory work. Keep those passages. The headings identify the subjects plainly and should stay. More subjects, an SQL tutorial, or an interactive exercise would not fix the remaining weaknesses.

## Findings and suggested passages

1. **Medium, comprehension — Indexes, paragraph 2, source line 52.** “Organises those IDs with a way to locate” does not show why this avoids the search just described. A novice can reasonably wonder whether looking for C4 in the index means checking every index entry. Add one concrete property of a possible index, with a modest scope qualification. Suggested replacement for its first three sentences:

   > An **index** on the orders table’s customer ID gives the engine another way to find the orders. For example, an index can keep customer IDs in sorted order, with a way to locate the order records beside each ID. The engine can narrow its search to C4 and find that customer’s orders together, without checking every other customer’s orders.

   This needs the technical reviewer’s check. It explains a representative arrangement without bringing tree mechanics into the introduction. The maintenance paragraph already supplies a useful cost.

2. **Medium, comprehension — Concurrent access, paragraph 4, source line 79.** “Use a defined view” names an abstraction at the point where the reader needs a small consequence. The lock example is concrete; the versioning paragraph abruptly becomes a vocabulary summary. Explain what a view preserves, then retain the distinction from reserving stock. Suggested opening:

   > A report has a different need: it should be able to read records while purchases continue. Many engines keep older versions of records for this purpose. If a price changes during the report, a read using an earlier view can still see the old price. Which view a read uses depends on the engine and the transaction’s **isolation level**.

   Follow with a short return to the buyers: “Reading an earlier version does not reserve an item. Two buyers could still see the same stock value and both decide to buy.” Preserve the explanation that isolation concerns prevented interference as well as visibility, but avoid turning the paragraph into a catalogue of isolation levels.

3. **Medium, continuity and voice — End of Constraints into Transactions, source lines 61–67.** The order-without-lines example is the right bridge, but two abstract sentences surround it, and the SQLite detour then breaks the connection. Move the note link into the preceding paragraph, near the declared/enforced rules it qualifies. End this section with the example itself:

   > An order can name a real customer and still have no order lines. The rules above allow that, even though we have only recorded part of a purchase.

   The following “To record that purchase…” then continues a thought. This is preferable to adding another transition phrase.

4. **Medium, voice and scope — Transactions and Concurrent access, source lines 68–80.** The latter half accumulates warnings: forgotten operations, durability settings, backups, outside effects, isolation differences, rejected transactions, and ambiguous connection loss. Each can be justified separately, but together they make the introduction sound like a review response. Keep the payment example: it explains a real boundary using an action the reader understands. Keep one durability qualification. Move the lost-connection case into the linked follow-up outline, and cut the two general admonitions that open the last concurrency paragraph. A sufficient ending here is:

   > Waiting is one possible outcome of a conflict. Another is that the database rejects a transaction and the application has to try it again. Which outcome to expect depends on the statements and isolation behaviour we choose.

   This connects to the mechanism just taught. It does not require teaching safe retries here. In the durability paragraph, the two overlapping setup qualifications can become one concrete boundary, such as: “The protection depends on the engine, settings, and storage; a backup is still needed if the stored data itself is lost.” Have the technical reviewer approve the final wording.

5. **Low, voice — Opening, source line 19.** The first paragraph establishes the subject. The second repeats its capabilities in abstract language, especially “combine facts collected at different times.” Give one recognisable reason to ask a new question without starting a full shop tutorial:

   > The same records serve several purposes. A customer wants to see an order, the shop needs to check stock, and someone preparing a report wants to know which products sold last month. These requests may arrive while new purchases are changing the data.

   This makes the existing examples feel chosen together. It is an optional improvement, not a request to make every later section a checkout scene.

6. **Low, rhythm — When to use a relational database, source lines 86–90.** The fit and costs paragraphs earn their place. The last three paragraphs then alternate between products, adding a system, and operating responsibilities. Put the paragraph about adding another system immediately after the pressures that might justify one. Follow with the product examples and the brief route into the collection. This preserves all useful content while completing one thought before beginning the next. “Before adding another system, check what the existing engine can do” is also more direct than “it is worth finding out.”

## Keep in place

The historical price paragraph is useful depth, not an unnecessary caveat: it changes how a reader would model a purchase. The distinction between an orders index and the customer table’s key also earns its space. Keep the concrete stock-check sequence and the explanation of why delaying an already-decided write is insufficient. The logical-versus-physical table distinction is short and supports later reading. None of these needs expansion for this introduction.

Overall: targeted editorial repair, chiefly two missing explanatory steps and a lighter treatment of qualifications. No structural rewrite or additional course content is needed. These findings do not establish technical acceptance or publication readiness.
