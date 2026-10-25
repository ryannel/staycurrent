# Example and continuity

Use the shared independent physical-storage replay: catalogue P7 20.00 → 22.00. Order 103 remains pending, no payment, agreed mug price 20.00, total 29.00; post-103 stock stays P3/P7/P9 10/0/4. P3/P9 prices remain 4.50/35.00. No currency is assigned. There are no shared business-fact or ownership changes to reconcile.

Local illustration choices, not observations:

- Heap page 12 holds P3 at item 1, P9 at item 2 and P7's earlier tuple at item 3. A same-page new P7 tuple uses item 4. A full-page independent replay instead uses page 13/item 1. Other tuples occupy the full page; their business data are unspecified.
- Four buffer slots, chosen pin/usage counts and clock start at slot 2. The sweep skips pinned slot 2, decrements slot 3 from usage 1 to 0, and reuses clean slot 4 at usage 0. Slots and file page identity are separate.
- Symbolic creator C and writer W, with no invented numeric XIDs or business timestamps. A read-only Repeatable Read report establishes its ordinary snapshot before W updates; a later snapshot begins after W commits.
- A schematic B-tree root/leaf route, not the plan asserted for the tiny products table. No measured page-read count or rate.
- Three independent HOT comparisons: PK only/space, additional price B-tree, PK only/no same-page space. The first can use a HOT chain and later redirect. Non-HOT replays add ordinary index entries and require coordinated cleanup.
- The write schedule holds the data file behind the commit WAL until a later page write. Later pruning dirties the page and creates new WAL; durable commit does not prove the cleanup is durable. No timings, LSNs, crash experiment or default performance claim.

Observed evidence is separate. Native 18.6 used actual P7 (0,3) → (0,4), and a distinct full-page fixture used P7 (0,1) → (1,1). The full-page test's extra `fixture-*` keys and PLAIN padding are isolated physical-test rows, not additions to the shared shop. The PGlite SQL check has its own actual starting CTID (0,2). None of these addresses is substituted into the drawings.

Complete author continuity reread: each new term has a definition or supplied prerequisite; query stages remain within the backend; shared pages are not private snapshots; logical product identity is distinct from physical tuple identity. The article owns first visibility/HOT and page traversal, and links native plan repair, access-method choice, retained-horizon maintenance, durability controls and incident diagnosis to their supplied owners. Canonical link destinations follow input/reading-links.json. No unresolved dependency blocks the first version.
