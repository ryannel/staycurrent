# Research digest: DDIA and best-in-class pedagogy teardown

> Discovery input to the `databases-catalogue` bet (researched 2026-07-16). Pressure-tests the
> catalogue's foundations-first spine against the field's canonical curricula. The carve
> verdicts below are binding inputs to Design Foundations.

## DDIA structure (Kleppmann)

**1st edition (3 parts, 12 chapters):** Part I Foundations (reliable/scalable/maintainable →
data models & query languages → storage & retrieval → encoding & evolution) · Part II
Distributed Data (replication → partitioning → transactions → the trouble with distributed
systems → consistency & consensus) · Part III Derived Data (batch → stream → future).

**Pedagogical logic:** Part I = how one node represents, stores, and moves data; Part II =
what changes on many nodes ("spread the data, then what guarantees survive, then why it's
hard, then what theory says is achievable"); Part III = deriving one dataset from another —
explicitly downstream, framing caches, indexes, and materialized views as derived data. Unit
of instruction is the mechanism + its guarantee; products appear only as inline exemplars.

**2nd edition (Kleppmann + Riccomini) — the author re-carving his own material:** Ch 1
promotes the organizing axes to the front — OLTP vs OLAP, cloud vs self-hosted, and
**single-node vs distributed** as *the* framing device, plus systems-of-record vs derived
data. Ch 2 pulls **nonfunctional requirements and capacity/load modeling to the very front**.
The distributed cluster keeps its order.

Two structural facts leaned on: (a) in both editions transactions sit *after*
replication/partitioning (a narrative choice, not a primitive-location claim); (b) capacity
moved to the front, not into a serving bucket.

## Comparative teardown

| Resource | Order | Primitive/product line | To borrow |
|---|---|---|---|
| Petrov, *Database Internals* | **Two parts only:** Storage Engines (incl. single-node transactions & recovery) → Distributed Systems (incl. distributed transactions) | Pure internals; products as citations | The cleanest 2-core model; **transactions split across the seam** |
| CMU 15-445 (Pavlo) | ~21 single-node lectures (storage → indexes → execution → concurrency control → recovery) then ~3 distributed | Component stack; products in a capstone potpourri | Single-node-first weighting; naïve-then-optimize |
| CMU 15-721 (advanced OLAP) | Decomposes real engines into shared primitives | "Product = a bundle of primitives" made literal | The tech-profile register's exact form |
| MIT 6.5840/6.824 | MapReduce → GFS → Paxos/Raft → linearizability → distributed txns → Spanner | One landmark paper per mechanism | Anchor each mechanism to a real artifact |
| Kleppmann Cambridge notes | RPC → clocks/causality → broadcast → replication/quorums → consensus → 2PC → linearizability | Pure theory | The dependency chain: time → order → agreement |
| System Design Primer | CAP up front → components → Database → **Cache → Asynchronism** | Component + trade-off catalog | Per-component "Disadvantages"; latency/powers-of-two reference cards |
| Alex Xu (v1/v2) | **Estimation first**, then primitives just-in-time inside worked designs | Case-study-driven | Estimation as the recurring numeric muscle; per-design wrap-ups |

Through-lines: the internals-pedigree resources (Petrov, CMU) both use the **single-node ↔
distributed seam** as the primary cut; nobody with an internals pedigree makes
"derived & serving" a co-equal foundational part — it is downstream everywhere serious.

## Carve verdicts (binding on the catalogue's structure)

1. **Keep the single-node ↔ distributed seam** — the field's consensus axis (Petrov's whole
   book, CMU's whole course, DDIA-2E's opening frame).
2. **Capacity/estimation moves to the front as a lens** (DDIA-2E Ch 2, Xu Ch 2) — a
   requirements discipline applied throughout, never a serving-bucket topic.
3. **Transactions split across the seam** (Petrov's cut, contra DDIA's narrative placement):
   single-node isolation + concurrency control + WAL/recovery in the single-node movement,
   with an explicit forward reference; cross-partition atomicity (2PC/Saga/idempotency/outbox)
   in the distributed movement.
4. **Caching / CDC / materialized views are a downstream capstone, not a peer pillar** — each
   is a composition of parts 1–2 (a cache = derived copy + invalidation; CDC = a replication
   log exposed; a materialized view = a precomputed query kept fresh).
5. **Data models & query languages need an explicit home** (DDIA Ch 2, CMU L01–02 both open
   here) — the on-ramp into the engine families; the biggest omission in a naive carve.
6. Query execution folds into the OLTP/OLAP piece (it is what actually distinguishes
   analytical engines); encoding/schema-evolution is out of scope for this resource's reader.

## Device kit (adopted house-wide)

Guarantee-first vocabulary · explicit "when NOT to use X" per mechanism and engine ·
back-of-envelope numbers up front + latency/powers-of-two reference cards · failure-mode-first
framing in the distributed movement · decision tables and comparison matrices ·
"product = bundle of primitives" made literal in profiles · naïve-then-optimize derivations
(log → hash index → SSTable → LSM → B-tree) · one landmark artifact per mechanism
(Raft→etcd, LSM→RocksDB) · recurring anchor systems traced through every layer.

## Sources

- [DDIA 1st ed. (O'Reilly)](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) — 3-part/12-chapter structure; transactions in Part II.
- [DDIA 2nd ed. (O'Reilly)](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/) — the re-carve.
- [DDIA 2E Ch 1](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/ch01.html) — single-node vs distributed as opening axis; systems of record vs derived data.
- [DDIA 2E Ch 2](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/ch02.html) — nonfunctional requirements/capacity up front.
- [system-design.space DDIA 2E summary](https://system-design.space/en/chapter/ddia-book/) — ordered 2E chapter list.
- [Petrov, *Database Internals* (O'Reilly)](https://www.oreilly.com/library/view/database-internals/9781492040330/) — the two-part model.
- [Database Internals chapter notes (GitHub)](https://github.com/Akshat-Jain/database-internals-notes) — transactions split: Ch 5 single-node, Ch 13 distributed.
- [MIT 6.5840](https://pdos.csail.mit.edu/6.824/) and [schedule](https://pdos.csail.mit.edu/6.824/schedule.html) — paper-per-mechanism order.
- [CMU 15-445](https://15445.courses.cs.cmu.edu/) and [Fall 2024 schedule](https://15445.courses.cs.cmu.edu/fall2024/schedule.html) — single-node stack then distributed tail; vector indexes as an index primitive.
- [CMU 15-721 Spring 2024](https://15721.courses.cs.cmu.edu/spring2024/schedule.html) and [Modern OLAP slides](https://15721.courses.cs.cmu.edu/spring2024/slides/01-modernolap.pdf) — engines decomposed into shared primitives.
- [Kleppmann Cambridge course](https://www.cl.cam.ac.uk/teaching/2425/ConcDisSys/) and [lecture notes (PDF)](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) — time → order → agreement chain.
- [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer) — component order; Disadvantages blocks; reference cards.
- [ByteByteGo — SDI volumes 1 vs 2](https://blog.bytebytego.com/p/system-design-interview-books-volume) and [Xu vol 2 ToC](https://x.com/alexxubyte/status/1504120488842317829) — estimation-first, case-study organization.
