# Technical recheck of the body prose

Independent comparison on 15 October 2026 against the snapshots in
`/private/tmp/staycurrent-body-before/{pages,components}`. This review checks
whether making the prose more direct changes its technical meaning. It does
not require restoring longer qualifications where the necessary distinction
is still clear. No article files were edited by this reviewer.

## Indexes

Compared the revised article and both index figure components with the saved
baseline. No technical repair is required in this revision.

The pending-only partial-index example retains the important planning-time
restriction: it describes a reusable plan made without the status value, rather
than claiming every parameterized query can never use a partial index. Its
concrete explanation preserves the earlier predicate-implication reasoning.
Checked against PostgreSQL 18 [Partial Indexes](https://www.postgresql.org/docs/18/indexes-partial.html).

The selectivity paragraph now says “expected caching.” This correctly avoids
implying that the planner inspects the current contents of the cache before
choosing a plan. Width, distribution across pages and early stopping remain
part of the explanation; no universal fraction or speed result is asserted.
Checked against [Query Planning](https://www.postgresql.org/docs/18/runtime-config-query.html).

Changing a key still creates work at its new position, and changing the included
amount still requires index maintenance. The article does not say every update
to every column must produce new entries in every index. The separate visibility
paragraph and storage link retain the reason an index location alone does not
establish whether a row belongs in a reader's view. These statements agree with
the PostgreSQL 18 [HOT conditions](https://www.postgresql.org/docs/18/storage-hot.html).

The shorter captions preserve their relationships: the root selects leaf B,
three selected order references lead to two table pages, and date order restarts
inside each customer group. SQL, shown results, observation counts, figure data,
and the distinction between an index-only plan and zero heap fetches are
unchanged. No experiment rerun is needed for these prose edits.

## How a query runs

Compared the stable revised article and its two figures with the saved baseline.
The join multiplicities, blocking sort, aggregation, estimates and memory limits
retain their earlier meaning. The shorter hash-join passage explains a planner
estimate rather than an observed performance win. The figure's arrow now names
the retained hash table explicitly. The merge figure still emits every matching
pair. The examples still distinguish a forced diagnostic plan from the natural
choice, and measured row counts from server timing.

One practical regression needs a small repair. The closing instruction says to
“Reload the setup” before repeating the statistics experiment. `setup.sql`
creates ordinary tables in an empty database; it neither drops existing tables
nor removes the statistics object. Reloading it in the existing practice
database therefore fails and does not restore the initial statistics state.
The previous instruction to use a fresh setup was safer. Smallest repair:
“Start again in a new, empty practice database before repeating the statistics
experiment.” This follows the setup's existing contract; no new reset script
or experiment is necessary.

## Storage and durability

Compared the stable revised article and its three figures with the baseline.
The opening now starts with files and memory, then explains WAL as the way to
make a change recoverable. The detailed section still states all three settings
and reliable-storage assumptions. I suggested adding “With the default
durability settings” to the opening acknowledgment sentence so its assumption
appears before the guarantee. This does not require repeating the settings list.

The updated row-version explanation retains unfinished visibility, older
snapshots and conditional HOT behavior. Dirty-page writes remain distinct from
commit. WAL must be flushed before the corresponding page write; the commit
figure still allows page writeback before commit as well as after acknowledgment.
The crash cases retain the 20.00/22.00 outcomes and the application's uncertain
knowledge when the reply is lost. Shortening the captions has not changed those
relationships.

Checkpoints still establish a redo position and allow transactions to continue;
vacuum still reclaims obsolete versions rather than shrinking every table file.
The async-commit and fsync consequences remain distinct. The late durability
section still limits the guarantee to intact storage honoring flush requests.
Its closing “suitable copy elsewhere” appropriately permits recovery options
beyond the backup-and-archived-WAL example. No material storage correction is
required beyond making the opening assumption easier to see.

## Preservation check and limits

A direct source comparison confirmed that all three articles' frontmatter,
SQL-block expressions and ResultTable row data are unchanged. The revised
figure text preserves its numeric results and mappings. I did not rerun the
unchanged experiments or perform a new browser inspection for this prose pass.
The previous technical review records the executed checks and rendered fixes.

The technical explanation is preserved across the three revisions. The one
required repair is the query experiment's reset instruction; its source recheck
will be recorded below once the coordinator has applied it.

## Final source recheck

Verified the coordinator's final source on 15 October 2026. The execution article
now instructs the reader to start again in a new, empty practice database. This
resolves the reset problem without changing the setup or experiment SQL. The
storage opening now states “With the default durability settings” before its
acknowledgment guarantee; the exact configuration and storage assumptions remain
in the later section.

The B-tree paragraph now attributes child pointers to “The root and other
branching pages,” avoiding the implication that leaf pages have children. Removing
the second summary sentence about the 54,000-entry scan retains both its observed
plan choice and the explanation that the covering index supplies the amounts.

**Final verdict: technical meaning preserved; ready as a draft for this pass.**
No unresolved technical finding remains from the prose revision. This verdict
applies to the current source, including the final deltas above; the frozen
first-revision reader artifacts may still show the earlier wording. It does not
claim a fresh rendered audit or authorize publication.
