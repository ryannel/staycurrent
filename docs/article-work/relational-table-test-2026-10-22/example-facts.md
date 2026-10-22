# Shared shop facts for this opening

Extracted from docs/coverage/relational-example.md. The shop sells tea and tea things. These facts keep the example consistent; they do not prescribe what to show or how to teach it.

Customers: customer 1 is Mina Shah; customer 2 is Tariq Aziz; customer 3 is Edda Berg.

Orders: 101 and 103 belong to Mina (customer 1); 102 belongs to Tariq (customer 2). Edda has no orders in this example. Orders 101 and 102 are paid; order 103 is pending.

The stored table names are customers and orders. customers uses customer_id and name; orders uses order_id and customer_id (and other columns the wider collection develops). An order's customer_id refers to its customer in customers. Customers may share a name; their identifiers distinguish them.

Choose what serves the commissioned explanation. Ask the coordinator if further example facts are needed.
