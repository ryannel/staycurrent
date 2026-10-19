# RL122 execution and evidence

19 October 2026. Status: drafting; independent review is separate.

## Reproduction

`python3 rl110-native.py all` from this evidence directory. Python 3 standard library and `/opt/homebrew/bin` PostgreSQL 18.6 are required. The harness rejects a different server version, creates unique `/private/tmp/staycurrent-rl110-*` directories and ports 56810–56815, stops every owned server in `finally`, and removes temporary data on success. Run modes sequentially because they reuse the bounded port set. No default service command is issued.

Canonical transcript: `rl110-native-all-observed.json`; page extraction: `rl122-observed.json`. Every selected entry retains its canonical event index. SQL, stdout and stderr are actual captured strings, not reconstructed output. The harness explicitly requires every expected rejection to fail. `pg_ctl` startup of the deliberately broken recovery copy is separately checked against its fatal log.

## Observations

The executed route was PostgreSQL 18.6 to 18.6 custom-format dump/restore with btree_gist 1.8. CONNECTION LIMIT 0 denied a normal source application login while permitting controlled superuser maintenance. The target restored two orders, total 45.00, and sequence value 2 already called. Its next generated value was 3 for o83; the new total was 75.00 across three orders. Duplicate r81 and a negative price were denied. The old source remained at two orders. No major binary upgrade, changed collation, third-party extension or hosted client was tested.

## Scope and reset

Independent server processes share one Apple-silicon/macOS host and local storage. The drill does not establish power-loss durability, external orchestration/fencing, an external pooler, hosted-provider behaviour, large-scale timing, a cross-major binary upgrade or complete real-application acceptance. Each mode starts from a fresh owned source. Client transactions end or are interrupted before owned clusters stop. Successful final combined run removed its data directories; failed harness-development attempts are superseded by this transcript and described in `rl110-harness-notes.md`.

## Primary references

Consequential claims were checked against pinned PostgreSQL18 primary documentation on 19 October 2026. These links retain the reader's native reference homes; article Sources entries annotate their purpose.

- https://www.postgresql.org/docs/18/upgrading.html
- https://www.postgresql.org/docs/18/pgupgrade.html
- https://www.postgresql.org/docs/18/app-pgdump.html
- https://www.postgresql.org/docs/18/collation.html
- https://www.postgresql.org/docs/18/sql-altercollation.html
- https://www.postgresql.org/docs/18/logical-replication-restrictions.html

## Additional major-version rehearsal

The coordinator subsequently built PostgreSQL 17.6 from the official source tarball
under /private/tmp and ran `lab/postgresql_major.py`. `rl122-major-observed.json`
retains the successful 17.6→18.6 compatibility check and copy-mode upgrade, runtime
role insert allocating3, total75, duplicate/negative rejection, and independent
old-source read still at45. Both temporary clusters stopped and were removed.
The fixture has UTF-8/libc C locale, matching checksums and no optional extensions.
It supplements rather than replaces the separate 18.6 btree_gist migration.
