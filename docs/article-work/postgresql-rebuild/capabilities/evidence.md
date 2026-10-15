# Capability investigations: author evidence

Checked 15 October 2026. This record supplements the source research in
`../capabilities-research.md`. It records author verification; independent editorial,
media and integrated-site review belongs to the coordinator's review record.

The four articles investigate different questions with connected fixtures:

- **JSON:** when variable attributes still have queryable structure; correlated
  array predicates, JSON_TABLE, expression matching, and a type invariant.
- **Full-text search:** how words become positioned lexemes; phrase meaning,
  weighted ranking, eligibility, stored updates, GIN candidates and spelling.
- **Vector search:** what distance orders, how filtering consumes candidates, and
  how actual HNSW plans and recall differ from an exact eligible baseline.
- **Types and extensions:** how ranges make overlap and temporal coverage
  enforceable, then how geographic distance and relational eligibility compose.

The browser has four independently resettable lessons, 29 steps in total. It runs
JSON, text search and temporal constraints directly. Its vector lesson is an
explicit arithmetic model of candidate filtering. The actual pgvector and PostGIS
experiments run on a separate PostgreSQL server and have downloadable SQL.

## Runtimes and repeatable checks

The browser check uses the repository's PGlite 0.5.8, reporting PostgreSQL 18.3.
`browser-verify.mjs` sends simple queries through the raw protocol, matching the
sandbox transaction boundary. It registers the bundled `btree_gist` extension.
Every lesson starts on a new database; intentional SQLSTATE failures, idle
transaction state, important rows and plans, editable variations, and setup resets
are asserted. The final run passed all four lessons.

```sh
node docs/article-work/postgresql-rebuild/capabilities/browser-verify.mjs
```

`browser-observed.json` preserves the outputs. Additional cases establish that a
JSON capacity may be absent, but JSON null fails the numeric check and SQL NULL
fails the column constraint. Booking ranges reject empty, unbounded and explicit
`[-infinity,infinity)` inputs. Non-null range endpoints alone would not reject
explicit timestamp infinity; `isfinite` supplies that separate rule.

The isolated server is PostgreSQL 18.6, Homebrew, aarch64 macOS, listening on
`/private/tmp/staycurrent-pg-rebuild/socket`, port 55438. All author work uses
database `pg_capability_lab`. No server restart or configuration change was made.
The `pg` client is loaded from the temporary lab installation under
`/private/tmp/staycurrent-pg-lab/node_modules/pg/`.

```sh
node docs/article-work/postgresql-rebuild/capabilities/verify.mjs
node docs/article-work/postgresql-rebuild/capabilities/range-concurrency.mjs
node docs/article-work/postgresql-rebuild/capabilities/vector-run.mjs
node docs/article-work/postgresql-rebuild/capabilities/spatial-run.mjs
```

These are local reproduction commands, not site build requirements. Server access
requires the local socket and installed extensions. Each script preserves observed
results in the adjacent JSON file. The final four-lesson server run also passed.
The concurrency script uses three real connections: writer A holds an overlapping
booking, writer B waits on its transaction, and the observer reads that wait. After
A commits, B receives exclusion violation 23P01. This is separately observed server
behaviour, not a multi-session claim about the browser.

## What the experiments established

| Investigation | Preserved observation |
| --- | --- |
| JSON containment | Ceramic-and-blue selects products 1 and 4. |
| Correlated offers | Separate seller/price tests accept products 1 and 2; one matching offer accepts only 1. |
| JSON index expression | Whole-document GIN leaves the direct tags predicate as a sequential scan; GIN on `attributes->'tags'` serves the same 500 matches. |
| Numeric JSON | Guarded numeric extraction avoids treating string `"350"` as a number; the numeric expression index serves 200 high-capacity rows. |
| Text positions | “Running on roads” becomes run at 1 and road at 3. Both-word and two-position queries match; adjacency does not. |
| Text eligibility/update | Published tenant 7 results exclude draft and tenant 8 rows; editing document 2's title changes the stored search value and eligible results. |
| Text GIN | The 10,000-document fixture produces 50 matches through the GIN index. |
| Vector exact order | Eligible points 1 and 3 are the closest two; limiting all-tenant candidates first can lose point 3. |
| Temporal overlap | Adjacent half-open Cedar bookings succeed; overlapping Cedar bookings fail; the same interval in Birch succeeds. |
| Temporal coverage | Two adjacent authorisation ranges jointly cover an assignment. Removing needed coverage or introducing a one-day gap fails with 23503. |
| Spatial eligibility | At 1,000 metres only North qualifies; at 3,000 metres North and Far north qualify. North has rooms with 12 and 6 seats; only the 12-seat room passes the eight-seat requirement. The EXISTS predicate asks for at least one suitable room. |
| Spatial index | On the grid, the GiST bitmap produces 189 candidates; exact distance removes 66, leaving 123. |

The server verifier also checks optional trigram similarity and embedding revision
guards: an update carrying source revision 5 cannot overwrite a row now at revision
6; revision 6 succeeds. This verifies the SQL boundary, not an embedding service.

### Vector results require the plan beside the count

The real experiment uses pgvector 0.8.7, 10,000 deterministic synthetic 16-dimensional
vectors, and 200 tenant-7 rows. The exact eligible top ten is saved before the HNSW
index is created. The query vector comes from row 123, outside tenant 7.

| Settings | Actual plan | Returned | Exact top-ten hits |
| --- | --- | ---: | ---: |
| ef_search 40, iteration off | HNSW; 40 candidates removed by tenant filter | 0 | 0 |
| ef_search 200, iteration off | Sequential scan plus top-N sort | 10 | 10 |
| ef_search 40, strict iteration | HNSW; continued candidate exploration | 10 | 9 |

The middle run does not demonstrate improved ANN recall: the planner chose an exact
path. Strict ordering in the final run orders visited results, but does not prove
the exact nearest set. Graph construction varies; an earlier build returned ten
exact hits for strict iteration. The article reports the preserved final run and
asks readers to inspect their own plans and counts. These observations establish
mechanisms and failure modes. They are not a latency benchmark or evidence about
the semantic quality of an embedding model.

## Local extension installation

The coordinator authorised installation into the isolated Homebrew PostgreSQL 18
runtime. Package installation makes extension files available; each experiment
then enables its extension in `pg_capability_lab`. The server itself was left
running throughout.

pgvector source was downloaded from the tagged 0.8.7 archive:
`https://github.com/pgvector/pgvector/archive/refs/tags/v0.8.7.tar.gz`.
In `/private/tmp/pgvector-0.8.7`:

```sh
make -j2 PG_CONFIG=/opt/homebrew/opt/postgresql@18/bin/pg_config
make install PG_CONFIG=/opt/homebrew/opt/postgresql@18/bin/pg_config
```

PostGIS source was downloaded from
`https://download.osgeo.org/postgis/source/postgis-3.6.4.tar.gz`. Installing the full
Homebrew PostGIS formula would have pulled in its larger GDAL dependency tree.
The lab instead installed GEOS and PROJ and built the required core extension:

```sh
HOMEBREW_NO_AUTO_UPDATE=1 /opt/homebrew/bin/brew install geos proj
./configure --with-pgconfig=/opt/homebrew/opt/postgresql@18/bin/pg_config \
  --with-geosconfig=/opt/homebrew/bin/geos-config \
  --with-projdir=/opt/homebrew/opt/proj --without-raster --without-topology \
  --without-sfcgal --without-protobuf --without-address-standardizer --without-json \
  CPPFLAGS=-I/opt/homebrew/opt/gettext/include \
  LDFLAGS=-L/opt/homebrew/opt/gettext/lib
make
make -C postgis install
make -C extensions/postgis install
```

The first compilation needed the explicit gettext include/library paths. A parallel
build also raced while generating `topology/topology.sql.in`; after touching that
generated file, the serial build completed. Only the core PostGIS extension and
its extension SQL were installed. The package command installed GEOS 3.15.0 and
PROJ 9.9.0; its image-library dependencies were handled by Homebrew. PROJ includes
a substantial installed data directory. `spatial-observed.json` records the actual
`PostGIS_Full_Version()`: PostGIS 3.6.4, PGSQL 180, GEOS 3.15.0, PROJ 9.9.0 and
LIBXML 2.9.13. These build details belong here rather than in the reader's lesson.

The pinned PGlite package did not expose pgvector or PostGIS bundles. The browser
therefore does not claim to execute either extension. It does expose `btree_gist`;
the coordinator registers that module in the shared worker. No `pg_trgm` browser
registration is needed by these lessons.

## Source and review boundaries

The primary-source ledger, version choices and access date are in
`../capabilities-research.md`. Additional HNSW mechanism checking used the authors'
[paper](https://arxiv.org/abs/1603.09320), especially search-layer and query
algorithms in the [PDF](https://arxiv.org/pdf/1603.09320), accessed 15 October 2026.
The article explains upper-layer routing, descending to denser layers and bounded
candidate exploration without claiming to reproduce every pgvector implementation
detail. PostgreSQL 18 temporal constraints and the PostGIS metre-based geography
examples were checked by execution, as well as against their current primary docs.

No hosted extension allowlist, production migration, extension upgrade, restored
extension database or semantic embedding model was tested. The adoption passages
identify those as checks for the reader's target system. The author has completed
SQL verification and root depth checkpoints; the coordinator owns final independent
reading, theme/phone inspection, integrated build and publication.
