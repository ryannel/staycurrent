# Brief

Audience: readers who know tables, basic SQL and indexes, but have not learned partitioning. This is a focused explanation within the databases field.

Central question: how can dividing a table into separately stored groups reduce the work a database has to do, and what determines whether that division helps?

Opening outcome: a direct entrant should understand that a partition holds a subset of rows, that a rule assigns rows to partitions, and that queries can skip a group only when its contents cannot contribute to the answer. They should be ready to reason about the choice of partition key.

Scope: opening and transition into the first section, using table partitioning within one database. Stop once the reader can see why choosing a grouping rule requires knowing the queries. No implementation walkthrough or distributed-systems coverage.

# Database partitioning

Table partitioning divides a table's rows into separately stored groups called partitions. Each group has the same columns, and SQL can still address the whole table. The useful change is that the database can sometimes handle a group as a unit: leave it out of a query, or remove it when its contents are no longer needed. [MySQL's partitioning overview](https://dev.mysql.com/doc/refman/8.4/en/partitioning-overview.html) describes these uses.

Consider a table of orders, with an order date in every row. If we divide it by month, an order dated 12 March goes into the March partition, along with its customer, total and other fields. An April order goes into a different partition. The date is the *partition key*: the value our grouping rule uses to decide where a row belongs.

Now ask for the orders placed in March. The database can compare that date condition with the partitions' boundaries. February cannot contain a March order, so the query can skip February's rows entirely. This is called *partition pruning*. The query still names the orders table; the database works out which parts it needs. [PostgreSQL's table partitioning documentation](https://www.postgresql.org/docs/18/ddl-partitioning.html) explains this mechanism.

But ask for all orders from one customer, without a date condition, and that customer might have orders in every month. The monthly split gives the database no month it can safely skip. Indexes can help find the customer's rows within those partitions, but dividing the table has not made this query a search of just one group.

The grouping rule therefore matters as much as the act of splitting. To choose it, we need to look at which rows our queries need together.

## Choosing the partition key

In the orders table, grouping by date puts each month's orders together. Grouping by customer would put each customer's orders together instead. A monthly sales report and a customer's order history ask for different sets of rows; choosing a partition key starts with deciding which of those requests the layout should help.

---

Evidence checked against PostgreSQL 18 and MySQL 8.4 documentation on 15 October 2026. The orders scenario is an invented teaching example. The passage explains possible pruning, not a measured speed improvement. Read through the opening and transition against the brief; implementation and publication checks do not apply to this standalone excerpt.
