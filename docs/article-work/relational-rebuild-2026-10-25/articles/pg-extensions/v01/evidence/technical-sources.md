# Technical sources and execution

Primary documentation checked26 October2026:

- https://www.postgresql.org/docs/18/rangetypes.html and functions-range.html: type construction, bound inclusion, emptiness, containment, adjacency and overlap.
- https://www.postgresql.org/docs/18/btree-gist.html: supplied text GiST comparisons; trusted installation eligibility; uniqueness limitation.
- https://www.postgresql.org/docs/18/datatype-geometric.html and functions-datetime.html: Cartesian point semantics and finite timestamp bounds.
- https://postgis.net/docs/ST_DWithin.html, ST_SetSRID.html, ST_Transform.html and postgis_administration.html: geometry/geography units, spheroid default, index-aware distance, reference-system labelling versus coordinate transformation and release-specific lifecycle.
- https://www.postgresql.org/docs/18/sql-createextension.html, view-pg-available-extension-versions.html, catalog-pg-extension.html and contrib.html: server provisioning versus per-database installation, chosen version, requires, fixed/relocatable schemas, trusted script authority and owner distinction.
- https://www.postgresql.org/docs/18/extend-extensions.html, ddl-depend.html, catalog-pg-depend.html, sql-dropextension.html and sql-alterextension.html: membership, recorded dependencies versus dynamic/string SQL, config-data registration, omitted member edits, update paths and cascade/restrict.
- https://www.postgresql.org/docs/18/app-pgdump.html and sql-createindex.html: logical reconstruction and matching index expressions.

PGlite: evidence/pglite-verifier.mjs and pglite-results.txt. Disposable in-memory instance from installed @electric-sql/pglite0.5.8; version() reported PostgreSQL 18.3/WASM. Imported bundled btree_gist. Verified article's finite half-open table definition, overlap lookup7001, refused overlap 23P01, refused closed/empty/explicit-infinity values 23514, permitted rolled-back adjacency, member-query count, point distance5 and√32, box admission of B. Arithmetic checks establish the diagram's Cartesian candidate/match sets. Instance explicitly closed in finally. No PostGIS runtime imported or execution claimed.

Native18.6: root-owned official postgres image pinned to sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6. Exact command, image/container metadata, source before/after hashes and scope in native-execution.json/root-fixture.json and update equivalents. Root executed each fixed script under env-i and explicit client paths as OS postgres; no network, mounts or published ports. Explicit Unix socket/database/user, asserted18.6/data directory/listen-empty. Source cluster system_identifier 7700942840420913198; restore7700942844569800780; update7700944001027076142. LocaleC/SQL_ASCII, all example values ASCII. Clusters were stopped in trap and containers removed by root; cleanup receipts retained.

Main native script cdea3f35692d4757feb7e29e282121c60d604036702c76018edb9e4924f61f7f completed install/type/dependency/removal/restore checks, then exited 3 on its final attempt to bootstrap1.0. This was a verifier-selection error: an advertised update source is not necessarily a fresh-installable version. Keep its transcript/receipt unchanged; do not call the full script a passing run. It established:

- Available/default btree_gist 1.8; available installable versions 1.2–1.8; no postgis availability row.
- Missing text GiST class 42704 before install; trusted sc_migrate installation; extension owner sc_migrate, gist_text_ops owner sc_owner, member dependency e.
- 7002 overlap true;7003 overlap false/adjacent true;7001 excludes11:00; protected 7002 refused 23P01 and 7003 permitted.
- Runtime read succeeds and CREATE EXTENSION is refused 42501.
- room_free index dependency on gist_text_ops, internal dependency on exclusion constraint; RESTRICT refused 2BP01; CASCADE removed rule/index, kept 1 row, allowed overlap yielding 2 rows; whole branch rolled back.
- Dump emitted CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA sc_ext with no VERSION. No extension member-by-member function definitions/library. Restore rebuilt7001, grants and exclusion; runtime containment/read succeeds,7002 refused 23P01,7003 permitted/rolled back. Restored extension owned by sc_owner, table by sc_migrate.

Focused update supplement c61ac53596b78d2ba359757a6e0267267cc3b009401894ff130db16cd6345dc5 passed exit 0. It joined advertised paths to fresh-installable versions and selected1.2--1.3--1.4--1.5--1.6--1.7--1.8. Observed extversion 1.2 then1.8; stored 7001 still contains 10:30, overlapping7002 refused 23P01, adjacent7003 permitted then rolled back. Reverse1.8→1.2 pathNULL. Earlier unaffected checks were retained.

Limits: single-container local Unix-trust tests; SET ROLE checks effective grants rather than authentication. Source/restore shared provisioned files, so no cross-platform/version compatibility, missing-software execution, production performance, host-failure survival or independent storage claim. Native schema exercised finite ordinary timestamps but did not include the displayed isfinite tightening; that exact DDL and its explicit-infinity counterexample were checked in PGlite. Spatial diagram and missing-file restore branch are labelled models.
