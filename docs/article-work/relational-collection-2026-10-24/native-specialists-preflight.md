# Native specialist preflight

Checked 2026-10-23 23:05 UTC (24 October locally). Operational inventory only; no server started, existing database contacted, installation changed, build run or publication performed. Repository inputs read: `commission.md` and `native-environment.json` only.

## PostgreSQL and extension files

`/opt/homebrew/opt/postgresql@18/bin/postgres --version` and `pg_config --version` report **PostgreSQL 18.6 (Homebrew)**. The opt link resolves to `/opt/homebrew/Cellar/postgresql@18/18.6_1`. `pg_config --sharedir` reports `/opt/homebrew/share/postgresql@18`; `--pkglibdir` reports `/opt/homebrew/lib/postgresql@18`.

| Extension | Exact file evidence | Inventory result |
| --- | --- | --- |
| pgvector | `/opt/homebrew/share/postgresql@18/extension/vector.control`: `default_version = '0.8.7'`, `module_pathname = '$libdir/vector'`; matching `vector--0.8.7.sql`; `/opt/homebrew/lib/postgresql@18/vector.dylib` contains version string `0.8.7` | Present, arm64 Mach-O bundle |
| PostGIS | `/opt/homebrew/share/postgresql@18/extension/postgis.control`: `default_version = '3.6.4'`, `module_pathname = '$libdir/postgis-3'`; matching `postgis--3.6.4.sql`; `/opt/homebrew/lib/postgresql@18/postgis-3.dylib` contains `3.6.4` and `3.6 USE_GEOS=1 USE_PROJ=1 USE_STATS=1` | Core extension present, arm64 Mach-O bundle. No additional `postgis*control` files or PostGIS libraries found in these active directories; raster/topology/SFCGAL availability is not established. |
| postgres_fdw | `/opt/homebrew/share/postgresql@18/extension/postgres_fdw.control`: `default_version = '1.2'`, `module_pathname = '$libdir/postgres_fdw'`; SQL base `postgres_fdw--1.0.sql` and upgrades `1.0--1.1`, `1.1--1.2`; `/opt/homebrew/lib/postgresql@18/postgres_fdw.dylib` | Present, arm64 Mach-O bundle. Control, SQL and library links resolve into the PostgreSQL 18.6_1 Cellar installation. |
| Citus | No paths containing `citus` or `columnar` found in the active share/library directories or PostgreSQL 18.6_1 installation; `/opt/homebrew/opt/citus` absent | No local Citus version or extension files established. This is bounded installation evidence, not a whole-machine absence claim. |

`/opt/homebrew/opt/pgvector` and `/opt/homebrew/opt/postgis` are also absent; this does **not** negate the directly installed files above.

## Library evidence and limits

`otool -L` reports these direct links:

- **vector:** `/usr/lib/libSystem.B.dylib` only.
- **PostGIS:** `/opt/homebrew/opt/geos/lib/libgeos_c.1.dylib` (Mach-O current version 1.21.0), `/opt/homebrew/opt/proj/lib/libproj.25.dylib` (25.9.9), plus system libSystem, libc++, libxml2, zlib and ICU libraries. `geos-config --version` reports **3.15.0**, and `proj` reports **9.9.0**; their opt links resolve to `/opt/homebrew/Cellar/geos/3.15.0` and `/opt/homebrew/Cellar/proj/9.9.0`. GEOS additionally links `@rpath/libgeos.3.15.0.dylib`; that file exists beside its C library. PROJ additionally links system SQLite/curl and `/opt/homebrew/opt/libtiff/lib/libtiff.6.dylib` (Cellar **4.7.2**).
- **postgres_fdw:** `/opt/homebrew/Cellar/postgresql@18/18.6_1/lib/postgresql/libpq.5.dylib` (Mach-O current version 5.18.0), plus libSystem. libpq additionally links gettext `libintl.8.dylib`, OpenSSL `libssl.4.dylib`/`libcrypto.4.dylib`, Kerberos `libgssapi_krb5.2.2.dylib` and system LDAP. Those Homebrew files exist; opt links identify Cellar versions **gettext 1.0**, **openssl@4 4.0.3**, **krb5 1.22.2_2**.

Mach-O compatibility/current versions are linker metadata, not interchangeable with project release versions. This inventory did not exhaustively resolve transitive dependencies or load modules into PostgreSQL. It certifies neither `CREATE EXTENSION` success nor query behaviour, optional feature support, active database versions, or benchmarks. The next meaningful check is extension creation and representative SQL in an explicitly owned disposable cluster using this exact PostgreSQL binary, with its own data directory, socket directory and port. postgres_fdw examples should use owned endpoints only. PostgreSQL documents its per-database [extension setup](https://www.postgresql.org/docs/18/postgres-fdw.html); pgvector likewise requires [per-database enabling](https://github.com/pgvector/pgvector#installation), and PostGIS distinguishes [installation from enabling](https://postgis.net/docs/postgis_installation.html).

## Missing-extension options

The present vector and core PostGIS files need a disposable loading check before any installation work. The upstream pgvector instructions support PostgreSQL 13+ and explicitly allow selecting the intended `PG_CONFIG`; do not infer compatibility merely from a formula name. The current PostGIS installation documentation lists PostgreSQL 12–18, but its development documentation is not evidence that these particular local files load.

Citus needs a separate environment. The simplest owned disposable option, **if a suitable container runtime is already available**, is a pinned Citus image with private data and a non-conflicting loopback port; the [upstream README](https://github.com/citusdata/citus#running-citus-using-docker) documents a single-container starting point and `shared_preload_libraries = 'citus'` for local installations. Runtime availability and arm64 image support were not checked. Otherwise use an owned disposable Linux VM and the [official PostgreSQL 18/Citus packages](https://www.citusdata.com/download/); this avoids changing the global Homebrew installation. [Citus 14 release notes](https://www.citusdata.com/updates/v14-0/) establish PostgreSQL 18 support, not successful loading on this Mac. Pin and record the actual Citus/PostgreSQL versions when provisioning later. No provisioning was attempted.
