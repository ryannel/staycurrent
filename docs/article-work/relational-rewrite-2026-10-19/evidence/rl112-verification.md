# RL112 execution and evidence

19 October 2026. Status: drafting; independent review is separate.

## Reproduction

`python3 rl110-native.py all` from this evidence directory. Python 3 standard library and `/opt/homebrew/bin` PostgreSQL 18.6 are required. The harness rejects a different server version, creates unique `/private/tmp/staycurrent-rl110-*` directories and ports 56810–56815, stops every owned server in `finally`, and removes temporary data on success. Run modes sequentially because they reuse the bounded port set. No default service command is issued.

Canonical transcript: `rl110-native-all-observed.json`; page extraction: `rl112-observed.json`. Every selected entry retains its canonical event index. SQL, stdout and stderr are actual captured strings, not reconstructed output. The harness explicitly requires every expected rejection to fail. `pg_ctl` startup of the deliberately broken recovery copy is separately checked against its fatal log.

## Observations

GIN containment returned 100 rows; GiST overlap returned six. The ordered BRIN minute query returned 60 through eight lossy heap blocks. The same answer in the scattered copy used 1,724 lossy blocks and rejected 49,936 rows by recheck. An index-only query changed from zero to one heap fetch after a note update. No sequential/index preference was forced.

## Scope and reset

Independent server processes share one Apple-silicon/macOS host and local storage. The drill does not establish power-loss durability, external orchestration/fencing, an external pooler, hosted-provider behaviour, large-scale timing, a cross-major binary upgrade or complete real-application acceptance. Each mode starts from a fresh owned source. Client transactions end or are interrupted before owned clusters stop. Successful final combined run removed its data directories; failed harness-development attempts are superseded by this transcript and described in `rl110-harness-notes.md`.

## Primary references

Consequential claims were checked against pinned PostgreSQL18 primary documentation on 19 October 2026. These links retain the reader's native reference homes; article Sources entries annotate their purpose.

- https://www.postgresql.org/docs/18/indexes-types.html
- https://www.postgresql.org/docs/18/indexes-opclass.html
- https://www.postgresql.org/docs/18/indexes-multicolumn.html
- https://www.postgresql.org/docs/18/gin.html
- https://www.postgresql.org/docs/18/gist.html
- https://www.postgresql.org/docs/18/brin.html
- https://www.postgresql.org/docs/18/indexes-index-only-scans.html
