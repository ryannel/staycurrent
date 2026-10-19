# Independent account before reading the collection

A practitioner should be able to turn a business rule into a relational model: choose row identity, express cardinality, keep facts in one defensible home, and decide which invariants the database can enforce. They should be able to write a query whose result they can explain, including missing rows, duplicates, nulls, aggregation and ordering. They should know when a query answers the wrong question even though it executes successfully.

They should be able to predict the work behind a query well enough to investigate a slow one. That includes reading a plan, distinguishing estimates from observations, reasoning about indexes and physical row layout, and checking whether an apparent improvement survives realistic data, concurrent work and write costs.

They should be able to protect a multi-step change against competing transactions. They need a concrete account of snapshots, locks, isolation and retries, including what an application must do after an uncertain commit. A business invariant, a transaction boundary and the external effects of a request must stay connected.

They should be able to explain what a committed change survives, operate within that guarantee, and recover a service with evidence. Backups, replay, replicas, failover and restore targets have different jobs. A recovery plan should account for acknowledged writes, application dependencies and the verification required before accepting traffic again. They should also be able to change schema and data while old and new application versions overlap, and recognise a change that needs a controlled interruption.

They should be able to choose a conventional single-node or primary-and-replicas relational deployment for a stated workload, and recognise when distribution changes the problem. A distributed implementation adds placement, coordination, contention across ranges, locality and partial failure. SQL compatibility alone does not establish equivalent transaction, durability or operational guarantees. They should know how to test the particular guarantee they depend on instead of relying on a product category.

Finally, they should be able to separate a model they have reasoned through from a product behaviour they must check. A worked example should give them enough state to reproduce a result, change one assumption and explain why it changes. The collection should make the next useful investigation discoverable without requiring every reader to study every engine.
