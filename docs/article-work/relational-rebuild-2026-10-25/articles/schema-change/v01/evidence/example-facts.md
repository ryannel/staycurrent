# Selected example and continuity

Independent representation migration approved in the shared record: products.price numeric(8,2) to integer price_hundredths, same unspecified currency. P3 4.50/450; P7 20.00/2000; P9 35.00/3500. Disposable SQL fixture uses post-order-103 stock 10/0/4, but no stock operation is taught or performed. Article keeps order 103's agreed line values and total 29.00 unchanged.

Independent stale-worker variation: worker reads P7 at 20.00; bridge commits 22.00/2200; stale 2000 assignment fails the relation. Conditional and current-row transformations retain or recover 2200. Figure order is conceptual, SQL ordering is sequential; no concurrent observation implied.

Independent late arrival P11 Tea strainer, 8.00/800, stock 0. It is not import B17. Explicit text-key ordering P11 < P3 < P7 < P9, checked with COLLATE C in SQL. Bridge initialises both forms; prohibited old-only insert provides the counterexample.

No shared scenario extension requested or needed. Technical exceptional-value discussion identifies NaN admitted by the supplied PostgreSQL price check; it adds no baseline business fact. Conversion requires an audited finite source domain and preserves the original finite range while return remains promised.

Continuity pass: bridge introduced before use; source and destination units explicit; drain applies to all writers and admitted work; partial data retains old reads; snapshots and preserved write rules distinguished; pause, reader return and old-only writer restoration distinguished; old NOT NULL insert dependency prepared before new-only writes; return ends at cessation of old-field maintenance, not merely at DROP. Engine-native operations stay with assigned owners.
