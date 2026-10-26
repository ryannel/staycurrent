# Reference exposure · first writing

Read all bounded parts separately with `python3 scripts/read-writing-reference.py <name> <part>`, each as its own tool result with 6,500-token allowance. Every END marker was received. No clipped reference part required recovery.

| Reference | Complete parts | Complete extracted-text SHA256 |
| --- | --- | --- |
| Sequence diagrams | 1–6 of 6 | 722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c |
| Indexes | 1–7 of 7 | d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1 |
| Storage and durability | 1–6 of 6 | 2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07 |

Studied finished reference drawings in three owned IAB tabs at `http://127.0.0.1:4584/review/examples/{sequences,indexes,storage}/`, created without visibility options. Read Sequence diagrams' focused-message / asynchronous-call presentation (Figure 3 and outbox explanation), Indexes' Figure 8 entry/table/visibility comparison and Storage's Figure 5 memory/WAL/disk boundary through its commit-record step. Reference settings stayed System and 1280×720. Playback was stopped before closing the tabs.

Adapted the references' progression: establish the concrete purchase, tell the reader where to look, let state differences carry the explanation, then explain the inference. Figure 1 distinguishes native and application identity; Figure 2 distinguishes commitment, the successful reply and cleanup; Figure 3 compares validation with replay; Figure 4 keeps one request fixed across new attempts. Figure labels stay out of the document outline. Models and observed native SQL are identified separately.

Read the supplied completed neighbour pages through one owned tab, as factual/prerequisite context only:

- http://127.0.0.1:4606/review/relational-rebuild/transaction-boundaries/
- http://127.0.0.1:4606/review/relational-rebuild/conflicts-and-retries/
- http://127.0.0.1:4606/review/relational-rebuild/distributed-transactions/
- http://127.0.0.1:4606/review/relational-rebuild/cockroachdb/keys-and-ranges/

No old manuscript, review feedback, previous plan, other worker notes or published Stay Current bodies were read. The supplied commission, plan, incoming responsibilities and exact link index were read. Current write/figures/continuity skills and the figure implementation/check guides were read. No independent reviewer or delegate was created.
