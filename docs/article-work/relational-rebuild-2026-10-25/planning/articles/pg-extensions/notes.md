# Planning record

The accepted outcome and ownership fit one article. No new child, ownership change
or shared business fact is proposed. Briefs state understanding; the writer owns
paragraph development, drawings and final explanatory order.

## Inputs and reference exposure

Read all seven supplied input files, the private breakdown/write/continuity
skills and the reference-reader script. `read-writing-reference.py` delivered
Sequences 1–6, Indexes 1–7 and Storage 1–6 in separate results; all 19 END markers
were present without clipping. The first combined input result was clipped;
`reading-links.json` and the complete shop record were subsequently read in full.

One instruction-path exception: the initial lookup read the main repository's
`staycurrent-breakdown/SKILL.md` before the hidden private copy was discovered.
It matched the private skill subsequently read. No old target body, outline,
review, feedback or other worker's notes were read. Reported to the coordinator.

Used one owned Chrome tab in the fresh `📘 Extensions planning` session because
the inventory offered Chrome. No user tabs, viewport or theme settings changed;
the owned tab was closed. Studied finished reference drawings on port 4584:
Storage figure 5's separate memory/disk states and commit evidence; Indexes
figure 7's same-row comparison with counters and controls; Sequences figures 2
and 4's lifelines, staged messages and current-step explanation. The full reference
text supplied every figure's labels, captions and surrounding explanation.

Transferable teaching: develop one concrete meaning before adding support;
change one thing at a time; make the surviving information and resulting decision
visible; distinguish illustrative states from measured execution. The outline
identifies what must be visible without prescribing a visual design.

Read only the approved replacement previews, using the canonical suffix mapping
to `http://127.0.0.1:4606/review/relational-rebuild/`:

- `values/`: types, written forms, instants and missing-value semantics.
- `constraints/`: complete same-room exclusion, required endpoints and bounds.
- `postgresql/architecture/`: parent context and physical/native boundaries.
- `postgresql/indexes/`: classes, GiST/SP-GiST, candidates and rechecks; already
  introduces the reservation and built-in point probes.
- `postgresql/access-control/`: actual caller identities, protected schemas,
  ownership and privileged-code boundaries.
- `postgresql/backup-and-restore/`: complete restore operation and acceptance.
- `postgresql/upgrades/`: server compatibility, transfer and return boundaries.

All were available reviewed drafts. No older published body was followed.

## Example and continuity decisions

Keep `room_reservations`, `reservation_id`, `room_id`, `starts_at` and `ends_at`
consistent with the integrity prerequisite. R1/7001 is 2 November 2026,
10:00–11:00 UTC; independent 7002 is 10:30–11:30 and 7003 is 11:00–12:00.
Bounds are `[start, end)`, endpoints required and start strictly before end.
Do not reinterpret 7002 and 7003 as both accepted rows. The built-in `tstzrange`
and its range support do not require an extension; `btree_gist` supplies the
text equality class used alongside range overlap.

Spatial work can reuse the index prerequisite's mathematical points (1,1),
(3,3), (2,6), (7,5). A separate diagnostic point (4,4), a query point (0,0) and
distance 5 in arbitrary coordinate units make a bounding candidate fail the
distance test. These are local illustrative geometry probes, not real locations,
customers, deliveries or new catalogue rows. SRID 0 has no assigned geographic
units; do not call that example metres. Geometry/geography comparison supplies
the practical units decision without inventing a geographic shop extension.

Use the established logical runtime/migration separation if identities are
needed; do not assume a permission merely from a role name. All core shop
orders, payments, prices, stock and agreements remain as supplied. Continuity
pass on the complete outline found no new shared-fact requirement or unresolved
ownership boundary. Shared changes, if the writer later needs them, go centrally.

## Primary-source checks

Checked on 26 October 2026. These support the intended understanding; they are
not claims of executed local tests.

- [PostgreSQL 18 range types](https://www.postgresql.org/docs/18/rangetypes.html):
  built-in range/multirange types, bound semantics, indexed operators and
  same-resource exclusion using `btree_gist`. Keep detailed custom range/type
  authoring outside this commission.
- [btree_gist](https://www.postgresql.org/docs/18/btree-gist.html): scalar GiST
  classes, including text, useful in mixed exclusions; trusted installation with
  database CREATE. It does not provide ordinary B-tree uniqueness enforcement or
  a general performance advantage.
- [PostGIS data management](https://postgis.net/docs/using_postgis_dbmanagement.html)
  and [ST_DWithin](https://postgis.net/docs/ST_DWithin.html): geometry's coordinate
  reference system determines units; geography distance uses metres and defaults
  to spheroid measurement. ST_DWithin includes an index-aware box comparison.
  Do not equate a bounding-box predicate with the full spatial predicate.
- [ST_SetSRID](https://postgis.net/docs/ST_SetSRID.html) and
  [ST_Transform](https://postgis.net/docs/ST_Transform.html): labelling coordinates
  differs from transforming them; transformation can require PROJ support/data.
- [CREATE EXTENSION](https://www.postgresql.org/docs/18/sql-createextension.html):
  server files precede database installation; installation authority depends on
  component privileges and trusted eligibility. The caller owns the extension;
  trusted installation has distinct member ownership. Protect target and
  prerequisite schemas. IF NOT EXISTS checks a name, not the desired version or
  equivalent definition. Automatic prerequisite installation selects defaults.
- [Available versions](https://www.postgresql.org/docs/18/view-pg-available-extension-versions.html)
  and [pg_extension](https://www.postgresql.org/docs/18/catalog-pg-extension.html):
  distinguish available versions and requirements from per-database installed
  version, owner, exported-object schema and configuration relations. An extension
  itself has a database-wide unqualified name.
- [Extension packaging](https://www.postgresql.org/docs/18/extend-extensions.html):
  logical dumps use CREATE EXTENSION instead of copying member definitions;
  supporting files remain necessary. Local edits to member definitions are not
  preserved by that mechanism. Registered configuration relations have special
  data-dump treatment. Update scripts define paths; version names do not imply
  ordering and downgrade paths need not exist.
- [Dependency tracking](https://www.postgresql.org/docs/18/ddl-depend.html):
  dependency refusal protects recorded relationships, but string-body routines
  need not record references inside their bodies. Application queries are another
  reason to inventory consumers beyond catalogue edges.
- [ALTER EXTENSION](https://www.postgresql.org/docs/18/sql-alterextension.html)
  and [DROP EXTENSION](https://www.postgresql.org/docs/18/sql-dropextension.html):
  ownership, update-script requirements, relocation limits, default RESTRICT and
  recursive CASCADE. A successful removal says nothing about preserved business
  behaviour. Avoid presenting CASCADE as the repair for an update problem.
- [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html) and
  [pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html): a selective
  extension dump is not dependency closure; a server upgrade needs compatible
  external modules, whose binary compatibility pg_upgrade cannot fully establish.
  The general migration procedure stays with its owner.
- [PostGIS administration](https://postgis.net/docs/postgis_administration.html):
  PostGIS supplies geometry/geography through its extension, and its own upgrade
  procedure can include multiple components or dump/reload. Use release-specific
  vendor instructions rather than treating generic ALTER EXTENSION as sufficient
  for every extension. Do not copy this manual's development version examples as
  current deployment recommendations.

## Evidence handoff and limits

No native system was used in planning, and no extension lifecycle observation is
asserted. The coordinator reports PostgreSQL 18.6 with bundled contrib available
for writing. A focused native `btree_gist` fixture can establish installation
identity, overlap/enforcement outcomes, dependency refusal, precise CASCADE
consequences in a disposable branch, dump/restore and any actually available
update path. Preserve the exact version, commands, catalogue state and failures;
do not predeclare an update path or manufacture an observed missing-package case.

Inspect actual dump contents and restored version: do not assume the dump pins
the source extension version. Test restored rejection behaviour as well as
accepted rows. A physical recovery target or standby needs compatible extension
software too; this is the software dependency, not another WAL/recovery tutorial.

PostGIS is not established as available by the supplied environment. Its example
may remain a sourced model with clearly labelled SQL until run on an owned
compatible installation. No PostGIS plan, timing, privilege result or lifecycle
test may be inferred from core point or contrib tests. Any later native work,
rendered checking and integration are arranged by the coordinator.
