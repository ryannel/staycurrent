# Teaching corpus v03 — preparation receipt

Status: fixed-reference preparation complete; awaiting the coordinator's immutable final corpus release. This is preparation for the required third/last full corpus round, not a corpus judgement.

Read repository AGENTS.md, README.md, docs/site-direction.md, staycurrent-review/SKILL.md and only its teaching perspective. Read current staycurrent-write/SKILL.md solely for fixed reference delivery protocol, and the reference reader script. No current relational article, draft, plan, earlier review, findings, decisions, author notes or quality verdict has been read. Historical links in repository direction documents were not followed.

## Complete text delivery

Ran python3 scripts/read-writing-reference.py to obtain the inventory, then invoked each of the 19 numbered parts separately with 4,500 output tokens. Each result ended in its intact explicit END marker; none was truncated. All prose, listings, labels, captions and tables were read. The helper validated source/text hashes for each invocation. The following rendered-export provenance hashes were read from src/reference-articles/reading/manifest.json; they are not a claim to have rebuilt that export.

### Sequences

Source SHA256: 76271603ba4d560eac9c7398ea7c0a24e0d53f3cdaaa67bf0ec50c05654d95ba

Complete text SHA256: 722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c

Rendered export provenance SHA256: 6cac7de2d94fde8dc0952c0ce5c95532571e094a406c9b6293ee3f344686fac0

| Part | Character interval | Delivered intact END marker |
| --- | --- | --- |
| 1/6 | 0:8901 | END REFERENCE sequences PART 1/6 |
| 2/6 | 8901:17486 | END REFERENCE sequences PART 2/6 |
| 3/6 | 17486:26211 | END REFERENCE sequences PART 3/6 |
| 4/6 | 26211:35204 | END REFERENCE sequences PART 4/6 |
| 5/6 | 35204:44107 | END REFERENCE sequences PART 5/6 |
| 6/6 | 44107:52666 | END REFERENCE sequences PART 6/6 |

### Indexes

Source SHA256: 16b4f695d15e0dc8ba505133421e75e7733d265196a78fa3c892c020cc4bf172

Complete text SHA256: d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1

Rendered export provenance SHA256: bd3cfd9119eb777f06b956048d6e4d140c182b40296b10c18b3ec847bb92e7cd

| Part | Character interval | Delivered intact END marker |
| --- | --- | --- |
| 1/7 | 0:8745 | END REFERENCE indexes PART 1/7 |
| 2/7 | 8745:17715 | END REFERENCE indexes PART 2/7 |
| 3/7 | 17715:26516 | END REFERENCE indexes PART 3/7 |
| 4/7 | 26516:35406 | END REFERENCE indexes PART 4/7 |
| 5/7 | 35406:44391 | END REFERENCE indexes PART 5/7 |
| 6/7 | 44391:53229 | END REFERENCE indexes PART 6/7 |
| 7/7 | 53229:59821 | END REFERENCE indexes PART 7/7 |

### Storage

Source SHA256: 92d7c366afc9ad0cb8fbcfd98fc12b87ed7a5674ea73b558e15b9052ae19a004

Complete text SHA256: 2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07

Rendered export provenance SHA256: 82b729740dce14e2c536df086c98c9203979c14d74cbf792d6cfdf4d688f2e5c

| Part | Character interval | Delivered intact END marker |
| --- | --- | --- |
| 1/6 | 0:8938 | END REFERENCE storage PART 1/6 |
| 2/6 | 8938:17794 | END REFERENCE storage PART 2/6 |
| 3/6 | 17794:26709 | END REFERENCE storage PART 3/6 |
| 4/6 | 26709:35578 | END REFERENCE storage PART 4/6 |
| 5/6 | 35578:44552 | END REFERENCE storage PART 5/6 |
| 6/6 | 44552:52355 | END REFERENCE storage PART 6/6 |

## Actual styled drawings

Inspected on 24 October 2026 in one owned Chrome 1 tab (315244771), at http://127.0.0.1:4560/review/examples/sequences/, /indexes/ and /storage/. The existing System radio was selected at entry, resolving dark. No viewport override or theme change was applied. Actual drawings were read from screenshots, with their surrounding explanation read in full above. Browser DOM located actual figure surfaces and controls; it did not replace inspection of the drawings.

| Reference | Actual drawing inspected | Contribution to teaching |
| --- | --- | --- |
| Sequences | 1. Mina books a repair | Four messages establish order before more notation. |
| Sequences | 2. Who is waiting | Nested activation/wait bars connect database work to Mina's wait. |
| Sequences | 3. Sending the email inside the request | Provider wait makes the request's extra cost visible. |
| Sequences | 4. A job in the database | Request/worker split distinguishes commit from later delivery. |
| Sequences | 5. One crowded diagram, or two | Crowded drawing gives a concrete reason to split questions. |
| Sequences | 6. The same messages in another order | Independent rows expose drawn order versus guaranteed order. |
| Sequences | 7. Checking Mina's details | Faded alt/opt branches retain the alternatives beside the chosen path. |
| Sequences | 8. Polling in a loop | Pass count and retained wait reveal the wasted last wait. |
| Sequences | 9. Two requests in parallel | Sections plus join note separate independence from completion. |
| Sequences | 10. Round trips before the first request | TLS ladder and clock turn round trips into a latency floor. |
| Sequences | 11. The same booking, fork or stair | Central arrows connect shape to who holds the flow. |
| Sequences | 12. One call per repair | Customer-call loop exposes repeated network work. |
| Sequences | 13. What crosses the browser when Mina signs in | Boxes and message contents support the boundary reading. |
| Indexes | 1. Sequential scan for customer 42 | Visible checks make answer size versus scan work countable. |
| Indexes | 2. Building an index on customer_id | Sorted keys/TIDs retain links to scattered heap rows. |
| Indexes | 3. B-tree search for one customer_id | Highlighted levels show one page per level. |
| Indexes | 4. Range scan along the leaf pages | Linked leaves and first out-of-range key explain stopping. |
| Indexes | 5. Finding customer 42's orders in a clustered table | Four arrows through upper levels expose extra descents. |
| Indexes | 6. Page visits as the range widens | Page distribution and scan bars explain why location matters. |
| Indexes | 7. Column order in a composite index | Reordered entries connect key order to work avoided. |
| Indexes | 8. Index-only scan and the visibility map | Values and per-page bits separate coverage from visibility. |
| Indexes | 9. One insert, one update, up to four indexes | Separate page rows expose write costs and a split. |
| Indexes | 10. The same keys, inserted in order and at random | Paired page fills expose fragmentation as keys arrive. |
| Indexes | 11. Deleting two-thirds of the rows from an index | Entries, removed pages and file counts distinguish reuse from shrinking. |
| Storage | 1. PostgreSQL rows and line pointers filling three pages | Opposing growth shows fixed page capacity. |
| Storage | 2. PostgreSQL: four buffer slots above the table file | Memory slots and file pages distinguish hit, read and eviction. |
| Storage | 3. Where the old version of P7 waits | Reader chips and undo panel compare two old-version locations. |
| Storage | 4. A database without a log | Memory loss after COMMIT makes missing durability concrete. |
| Storage | 5. PostgreSQL: the price change with a write-ahead log | Lanes show log flush before reply and later page write. |
| Storage | 6. PostgreSQL: who writes the dirty page a query needs to evict | Dirty outlines and query status connect background writing to waiting. |
| Storage | 7. Commits sharing log flushes | Alternating groups explain throughput and individual latency together. |
| Storage | 8. PostgreSQL: crash recovery at three moments | Recovery and connection loss distinguish outcome from client knowledge. |
| Storage | 9. PostgreSQL: the flush path | Four layers identify volatile copies before flush returns. |
| Storage | 10. PostgreSQL: the price change with synchronous_commit off | Reply and old restored price show the deliberate loss window. |

All 34 actual drawings were inspected. Next/Reset and step scrubbers were used to follow changing state; selected alternate configurations were examined, including index coverage plus vacuum and PostgreSQL/InnoDB old versions. This is calibration by reading actual figures, not exhaustive mechanical testing of every control combination. A timed browser call interrupted one sequence batch; the owned tab was rebound and figures 9–13 were explicitly inspected afterwards, so interrupted output was not counted as delivered visual inspection. No build or native execution evidence was produced or claimed.

## Cleanup and release boundary

Sequence and index Reset controls were invoked before leaving their pages. Storage's engine choice was restored to PostgreSQL; all ten storage step inputs were verified at minimum after Reset. The sole owned tab was closed. No user or other agent tab was changed. No product edit, build, native execution, Git, publication or delegation action was taken.

Ready for the immutable manifest, commission, permitted parent/sibling/child plans and locations of additions without earlier findings. After release I will read all 58 pieces, apply all seven teaching checks in order to every piece, follow the actual finished routes from the introduction, and inspect all actual current drawings. No corpus verdict is made here.
