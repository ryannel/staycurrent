# Independent media interpretation

15 October 2026. Reviewer did not author the capacity or choices pages. The initial
pass uses isolated browser screenshots of figures and tables, including captions
inside figures, before opening surrounding prose. It is an informed technical
reader's interpretation, not a novice user test. Initial crops are in
`/private/tmp/relational-media-isolated/`; surrounding article text is read only
after each initial interpretation is recorded here.

## First impressions, before article context

### Scaling: copied and divided tenants

The first figure shows both tenant 7 and tenant 8 on A and B. A is the writer;
checkout writes and writer-required reads go there. Changes travel A to B, where
eligible catalogue reads and replay occur. I infer that B can take some read work
but does not divide responsibility for writes. The caption explicitly confirms
copied rather than divided data and avoids promising a doubling of capacity.

The second figure assigns tenant 7 to shard A and tenant 8 to shard B, with each
shard handling its tenant's reads and writes. I infer separate authoritative
subsets. The caption supplies the missing replication relation: each shard may
still need copies for recovery. This prevents the two boxes from implying that
sharding itself creates redundancy.

The comparison table asks where the next checkout goes and what remains shared.
It makes the surviving bottleneck tangible: a larger server and read replicas
retain the writer; shared compute retains a service write path/storage rules;
shards retain routing and cross-owner work. I can distinguish arrangements without
inferring that every product called a cluster has the same write topology.

### Replication: saved, replayed and acknowledged

The price table lets me derive three states: A has committed €25 while B still
reads €20; B has saved log position 2 but still reads €20; only after replay does
B's new ordinary read return €25. This clearly separates a recoverable log copy
from query-visible replay. The phrase "new ordinary read" avoids promising that
an already-open old snapshot changes when replay catches up.

The acknowledgement table is explicitly conditional on configured synchronous
standbys. remote_write confirms a filesystem write but leaves OS-failure durability
and replay unfinished. on confirms durable storage and leaves replay unfinished.
remote_apply includes durable application but leaves other replicas and older
reader snapshots outside that promise. The last column is important: no row reads
as "every replica is current" or "all failures are survived".

No repair indicated by these isolated desktop crops. Context comparison and phone
inspection are still pending at this point in the record.

### Partitioning and sharding: placement and cutover

The child-table example groups two October orders from different tenants together,
with a November order in another table. I infer division by date rather than by
tenant; nothing in this table promises different servers or independent writers.

The owner table puts orders, lines, products and stock for tenant 7 together on A,
and the corresponding tenant 8 records on B. The local-operation column makes the
purpose of co-location explicit: a tenant checkout can stay with its owner.

The copy comparison shows why an initial copy is insufficient: order 1's amount and
revision changed, order 2 was deleted, and order 3 was inserted. It includes all
three mutation shapes rather than making catch-up look like insert-only copying.

The cutover table makes authority a staged gate. During copying A accepts writes
under generation 1 and B accepts none. During the final boundary A admits no new
work and drains earlier work while B still accepts none. After cutover B accepts
generation 2 and A rejects stale authority. I infer a deliberate write pause and
exclusive owner transition, supported by a final source position and matching
state. Merely changing routing metadata would not satisfy the depicted procedure.

No misleading overlap or missing owner relation found in these desktop tables.

### Choices: starting points and stale search state

The product table gives an application need, a useful starting point and the
evidence that could change it. I read it as conditional selection guidance, not a
feature ranking: offline single-device work starts at embedded SQLite; shared
service work starts at a server database; existing deployments are evaluated
before migration. The final column prevents those starting points from becoming
unconditional endorsements. It does not by itself teach product-specific isolation
or licensing differences; that is an appropriate question for the surrounding text.

The additional-system table follows one product's authority and search copy.
Initially both are version 1 active. Committing withdrawal changes the catalogue
to version 2 inactive while search can still offer version 1. Applying withdrawal
changes search; replaying an older update must not restore the offer. I infer that
delivery lag and out-of-order replay are separate cases. The last row is clearly
a required outcome ("Must retain version 2"), not a claim that every search system
automatically implements it. I now need the prose to explain the enforcement.

### First phone inspection

Product comparison, search-copy sequence and cutover gate retain their columns
and align rows clearly at 390 px in both themes. Their container width is 358 px,
equal to scrollWidth, so no horizontal scrolling is needed or available in these
cases. Text wraps into taller cells rather than clipping. The cutover table's
four-column headers take several lines but remain associated with their cells;
the title "Required evidence" still guides the rightmost column. I can follow
both the authority transition and version sequence without horizontal memory work.

## Comparison with the surrounding articles

Read after recording the interpretations above: scaling sections "Copies for
reads", "Divide the writes" and "What a cluster shares"; replication sections
"Copying a change" and "What success confirms"; partitioning sections "Local
partitions and pruning", "Choosing a shard key", "Moving live data" and
"Verification and cutover"; product comparison's "Where the database runs"; and
the additional-system sections "What another copy changes" and "Deliver changes
without forgetting them". These were the rendered text captures in
`/private/tmp/relational-completion-review/`, not author briefs or evidence notes.

The scaling prose confirms the figures' distinction. It follows a stale profile
read to explain why eligible reads are a subset, and follows a large tenant to
explain why ten more shards do not divide that tenant's own work. The shared-storage
paragraph explicitly distinguishes internally replicated storage from independent
write owners. The pictures do not imply capacity or redundancy that the text then
has to retract.

The replication prose identifies positions 1 and 2 as illustrative numbers and
explains real WAL positions separately. It explicitly requires replay of the
commit record for a new snapshot and preserves older snapshots' isolation rules.
The acknowledgement table is preceded by the synchronous-standby configuration
condition and followed by the requirement that a confirming copy survive the
chosen failure. Its "durable" cells therefore do not promise universal recovery.

The partitioning text says the child tables share a server, so the date table does
not accidentally teach distributed partition placement. The co-location table
matches the checkout's related rows. The live-copy example derives every visible
change, including deletion, and explains why equal row counts are insufficient.
The cutover text requires stopping admissions, resolving earlier writers, applying
through a final source position and comparing equivalent states before changing
authority. It also explains that the single-connection lesson cannot prove a
distributed protocol, and that checking a cached generation separately from a
write is insufficient. These qualifications directly support the table's owner
gate rather than weakening a misleading visual promise.

The product table sits inside a comparison of deployment shapes. The surrounding
SQLite discussion allows server-backed SQLite applications while explaining local
file ownership and serialised writes. Thus "shared service" is a starting point
for investigation, not a claim that SQLite cannot serve website users. The
existing-product rows express the value of known operations while requiring a
demonstrated limitation to motivate migration.

The withdrawal table's required outcome is implemented in the next section by an
atomic version comparison and replacement. The explanation limits that rule to
events carrying complete derived state, distinguishes increment events, and
requires retained inactive/deletion-version information to reject old active
events. It also says a real destination must support the conditional operation or
equivalent ordering. The table therefore teaches an invariant the engineer must
provide, rather than attributing automatic stale-event protection to search.

No factual or explanatory repair was needed in the reviewed media or its immediate
context.

## Responsive and theme inspection

Captured all eleven teaching aids at 1280 px and 390 px in light and dark themes
from the actual local browser at port 4326. Inspected each aid at desktop size and
phone size, with both themes represented in the visual inspection. Table rows,
column headings and captions remain legible. The replication and sharding boxes
stack vertically on the phone; the replication label still names direction A to B,
so movement of the boxes does not reverse the relation. Dense tables wrap into
taller cells without losing row alignment.

Recorded dimensions in `metrics.json` and `metrics-capacity-first.json` under
`/private/tmp/relational-media-isolated/`. Every media container's scroll width
equals its available width: 640 px on desktop and 358 px on the phone. The page
widths also remain 1280 px and 390 px. No sideways movement is required at these
viewports. The table wrappers are keyboard focusable; because none overflowed,
this pass did not exercise keyboard or pointer horizontal scrolling. It does not
claim a screen-reader, zoom or narrower-viewport audit.

The reviewed media is ready. This pass is independent interpretation and responsive
inspection of these five pages only; it does not repeat the SQL verification or
review the PostgreSQL and operations articles authored by this reviewer.
