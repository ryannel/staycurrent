# Indexes

Status: in review, 15 October 2026. Independent review and rendered-page checks are
coordinated by the parent batch; this author's handoff does not mark the draft ready.

Route: `/learn/databases/relational/indexes/`.

The reader knows tables and simple filters. They should finish able to describe
what an ordered access path skips, choose a composite key for an actual predicate
and order, distinguish navigation from remaining work, and test whether read
savings justify storage and upkeep. The article must teach that reasoning locally.

The introduction must establish what an index contains, how its arrangement helps
find rows, and why maintaining it costs space and write work. The order-history
example develops that explanation through separate ordered entries and tree navigation; equality plus date/order arrangement; remaining status
filter; covering and visibility; selectivity; writes and maintenance; observed plans
and representative validation. PostgreSQL 18 is the implementation example. The
planned PostgreSQL index child retains specialised access methods and engine depth.

The two static figures answer spatial questions: how a root/leaf route leads to
scattered table rows, and why date ordering restarts for every customer in a
composite key. The runnable experiment supplies the counterfactual changes; a
second browser simulation would duplicate that evidence without improving the
argument. The first figure uses eight expressly invented rows; the composite
figure excerpts actual generated records, with dates abbreviated.

Read the original opening and first two mechanism changes of Sam Who's Load
Balancing, https://samwho.dev/load-balancing/, as a voice and progression reference.
The useful influence was keeping a concrete request visible while changing one
mechanism at a time, not a prose pattern or an identity to reproduce.

Files belong to this article and its uniquely named components. Collection status,
reading metadata, batch plan, final build and browser checks belong to the parent.
