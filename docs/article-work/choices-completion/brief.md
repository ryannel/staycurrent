# Choosing products and adding systems

Commissioned within the 15 October relational completion request. These are the
last two articles in the aligned family tree, independent of the PostgreSQL deep dive.

The product reader has an application to build or migrate. They should be able to
turn deployment, correctness, access patterns and operating obligations into a small
candidate comparison, then test the uncertain assumptions. Compare PostgreSQL 18,
MySQL 8.4/InnoDB, SQL Server 2025 and SQLite using explicit versions and conditions.
Use concrete differences without assigning a universal winner or ranking features.
Explain the boundary between engine, edition and hosted service. A sandbox lesson
can help formulate acceptance cases; it cannot establish another engine's behaviour.

The additional-system reader has relational application data and a new search need.
Develop search inside PostgreSQL first, then trace what changes when search runs
from a separately maintained copy. Carry freshness, updates/deletes, replay and
rebuild through a concrete product example. Distinguish built-in capability,
extension and separate service. Stop at a justified engineering choice; this does
not commission a general distributed-systems programme or a vendor survey.

Review must challenge the actual guarantees of the worked copy and the usefulness
of the comparison. SQL examples use PGlite as an identified PostgreSQL runtime.
Multi-engine and distributed performance tests are not implied by their execution.
