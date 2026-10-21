# Continuity pass · trial a03 · d04

Run with [staycurrent-continuity](../../../../.claude/skills/staycurrent-continuity/SKILL.md) after the d04 repairs, on the working tree of 20 October 2026. Line numbers refer to `src/articles/relational-trial/a03.astro` after the repair. The pass included figure captions, control labels and step text in `src/components/relational-trial/a03/model.mjs`.

The article says it builds on the introduction's "Transactions and competing buyers" section (line 21), so terms that section teaches may be used with a reminder.

## 1. Terms

| Term | First use | Explained | Result |
| --- | --- | --- | --- |
| transaction, commit, rollback | 20 (opening) | 40, with a reminder of the introduction at 21 | ok: the introduction teaches them |
| invariant | 30 | 30 | ok |
| lock | 41 | 41 | ok |
| savepoint | 45 | 45 | ok |
| row versions | 49, "clearing away old row versions" | 133 (Figure 4) | **fixed**: 49 now says "data that later changes have replaced" |
| constraint (check, unique, foreign key) | 52 | the introduction; 52 now names it in bold with a one-line reminder | **fixed**: the term was unnamed before the table |
| exclusion constraint | 59 | 59, by purpose ("for overlapping bookings"), in a pointer to the constraints article | ok |
| schedule | 63 | 63 | ok |
| lost update | 66 | 66 | ok |
| write skew | 69 | 69 | ok |
| predicate | 70 | 70 | ok |
| `SELECT … FOR UPDATE` | 71 | 71 | ok |
| locking read | 130 (MySQL paragraph); Figure 3 and 4 step text | not named before | **fixed**: 71 now names `FOR UPDATE` a locking read |
| isolation, Read Committed, Repeatable Read, Serializable | 21 ("default isolation level"), 75–79 | 75–79 | ok: 21 only names the default |
| snapshot | 78 | 78 | ok |
| serialisation failure, 40001 | 85 | 85 | ok |
| recheck at Read Committed | 72 ("looked again only at R7", plain words); 96 | 96 | ok: the d04 repair uses plain words before 96 |
| business rejection | 97 | 97 | ok |
| version number check | 97 | 97 | ok |
| coordination row | 104 | 104 | ok |
| `default_transaction_isolation`, database role | 113 (table), 127 | 127 now says "the database role, or account, it connects as" | **fixed** |
| InnoDB | 130 | 130 ("MySQL's InnoDB") | ok |
| deadlock, 40P01 | 144 | 144 | ok |
| 25P02 | 147 | 147 | ok |
| 23505 (unique-key error) | 43 (listing comment), 110 | 43 and 156 | ok |
| write-ahead log | 170 | 170 | ok |
| replica, promoted | 174 (table) | not explained | **fixed**: 170 names "replicas"; the table now says "when it takes over" |
| `synchronous_commit`, `fsync` | 171–176 | by their effect in the table | ok |
| archived (log) | 172 | not explained | left: plain enough in context, and the backup article owns it |
| VACUUM | Figure 4 step text | not explained | **fixed**: "PostgreSQL's clean-up process, VACUUM" |
| `pending_payment`, worker | 185 | 185 | ok |
| request identifier | 164 | 164–167 | ok |

## 2. One name per thing

- Protections: "One conditional statement", "Unique constraint", "Lock the rows you counted", "Lock the class row first (coordination row)", "Run at Serializable" match Figure 3's control and the table. The d04 vendor paragraph says "take the lock" and "run at Serializable", which are the same names.
- Figure 5 options: "Opposite lock orders" and "Both lock class 21 first" match prose and controls.
- "locking read" is now one name for `FOR UPDATE` across prose (71, 130, 136) and Figure 3 and 4 step text.
- "bookings" in prose and `reservations` in SQL: one row of `reservations` is always "a booking". Unchanged and consistent.

## 3. The example

Checked against [relational-example.md](../../../coverage/relational-example.md):

- Customers Mina, Tariq and Edda, instructors Lena and Ravi, classes 21 and 22 with their capacities, R7 to R12: all match.
- The `FOR UPDATE` count case lowers class 22's capacity to 2 and says so in the text; the repeated move raises class 21's to 3 and says so. Both are listed as stated variations in the record.
- The d04 repair names Mina and Edda as the two bookers in the count case. `verify.mjs` inserts R10 for customer 1 and R11 for customer 3, so the names match the run.
- Outcomes against earlier figures: Figure 5 starts from Mina's R8 in class 21 after "Put the condition in the change", consistent with Figure 3. No refused booking reappears as accepted.
- The shop paragraph (line 204) uses `stock` and order lines, as the introduction does.
