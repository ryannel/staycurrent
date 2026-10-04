# An index gives each new order another job

Your shop keeps an orders table. Order 41 is a mug for customer 8; order 42 is a bowl for customer 3; order 43 is a plate for customer 8; order 44 is a cup for customer 6. To show customer 8 their purchases, you ask for every order whose customer number is 8.

Without a useful way to locate those orders, the database can check every row. It finds 41, passes over 42, finds 43, and checks 44 too. Stopping at the first match would miss the plate. Four rows are easy enough, but the same approach must also examine unrelated orders as the shop grows.

Now add an ordered index on customer number. Picture a separate collection of customer numbers and references to their orders: customer 3 points to order 42, customer 6 to order 44, and customer 8 to orders 41 and 43. The index keeps the customer numbers together without rearranging the full orders table. The database can find the entries for customer 8, follow their references, and retrieve the mug and plate. This is a simplified view of the lookup described in [SQLite’s documentation](https://www.sqlite.org/queryplanner.html#lookup_by_index); the form of a row reference depends on the engine.

There is still a search to do inside the index. An ordered tree makes that search manageable by keeping directions to smaller sections. Each step narrows where to look, until the database reaches the entries it needs. PostgreSQL’s B-tree indexes use this arrangement, with references to table rows at the bottom. Other index designs organise their information differently. [PostgreSQL’s B-tree structure](https://www.postgresql.org/docs/18/btree.html#BTREE-STRUCTURE)

Then customer 8 buys a spoon: order 45. Saving the order now includes maintaining its index entry. The database must find the appropriate place for customer 8 and record the reference to 45. Otherwise a later lookup through the index could miss the spoon. The extra structure also occupies storage. In PostgreSQL, if the index page receiving an entry has no room, the database may split it and update the directions above it. That is further work caused by keeping the search structure useful.

This helps explain why frequent customer lookups can benefit while a stream of new orders pays extra maintenance. It does not promise a faster read on our four-row table: using an index has costs too, and the database may choose a scan. Nor does every write become slower overall; an index can help an update find its target rows. [PostgreSQL’s index introduction](https://www.postgresql.org/docs/18/indexes-intro.html)

Suppose we add another index, this time on delivery date, but never search or sort by that date. Each new order still needs a place in that index. The application pays for keeping another route through its data available, even though its reads never take that route.
