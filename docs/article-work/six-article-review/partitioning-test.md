Audience: A software engineer who understands tables, SQL and indexes but is new to partitioning.

Intended outcome: The reader can explain how dividing rows into partitions changes database work, and judge whether a proposed division suits the queries and maintenance they need. This excerpt introduces table partitioning within one database; it stops as the article begins examining the choice of partition key.

# Partitioning a table

A table can hold years of records even when most of our work concerns a small part of its history. **Partitioning** gives the database separately stored groups of rows within that table. Each group is a partition, and a rule determines which rows belong to it. Queries can still address the whole table. The division gives the database smaller pieces to read and maintain independently. [Table partitioning](https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes?view=sql-server-ver17).

Consider an orders table divided by the date an order was placed, with one partition for each calendar month. An order placed on 14 March 2026 belongs to the March 2026 partition, along with its customer ID, total and other columns. February's orders occupy another partition. A report asking for March's orders can exclude February before reading any of its rows: the partition's date range tells the database that none can qualify. PostgreSQL calls this **partition pruning**. [PostgreSQL 18: partition pruning](https://www.postgresql.org/docs/18/ddl-partitioning.html#DDL-PARTITION-PRUNING).

The month also becomes something we can manage as a unit. If our retention policy allows us to remove all of February's orders, PostgreSQL can drop that partition without deleting its rows individually. We have arranged the data so that the boundary of the storage matches the boundary of the work. [Partition maintenance](https://www.postgresql.org/docs/18/ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE-MAINTENANCE).

But a customer's orders may span every month. Knowing the customer ID gives us no month to exclude. We still need a way to find that customer's rows within the partitions, and indexes can help with that. Dividing a table into smaller pieces does not by itself reduce the amount of data a query needs. [Partitioning and query performance](https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes?view=sql-server-ver17#queries).

## Choosing what belongs together

The order date is our **partition key**: the value used to assign each row to a partition. We chose it because monthly reports and removing old orders both follow dates. If most of our work instead concerns one customer at a time, grouping rows by customer deserves a closer look. That would bring a customer's history together, but leave February's orders spread across the customer groups. Choosing a key means deciding which work we want the grouping to help.
