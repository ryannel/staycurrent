# RL110 execution and evidence

19 October 2026. Status: drafting; independent review is separate.

## Reproduction

`python3 rl110-native.py all` from this evidence directory. Python 3 standard library and `/opt/homebrew/bin` PostgreSQL 18.6 are required. The harness rejects a different server version, creates unique `/private/tmp/staycurrent-rl110-*` directories and ports 56810–56815, stops every owned server in `finally`, and removes temporary data on success. Run modes sequentially because they reuse the bounded port set. No default service command is issued.

Canonical transcript: `rl110-native-all-observed.json`; page extraction: `rl110-observed.json`. Every selected entry retains its canonical event index. SQL, stdout and stderr are actual captured strings, not reconstructed output. The harness explicitly requires every expected rejection to fail. `pg_ctl` startup of the deliberately broken recovery copy is separately checked against its fatal log.

## Observations

The initial tuple occupied (0,1). A note-only HOT update produced (0,2), while its primary-key entry still referenced (0,1). Adding a note index made the next update non-HOT: the replacement occupied (0,3), and the primary-key index gained a reference to it. The independent old snapshot read original twice; the agreed price stayed 20.00.

## Scope and reset

Independent server processes share one Apple-silicon/macOS host and local storage. The drill does not establish power-loss durability, external orchestration/fencing, an external pooler, hosted-provider behaviour, large-scale timing, a cross-major binary upgrade or complete real-application acceptance. Each mode starts from a fresh owned source. Client transactions end or are interrupted before owned clusters stop. Successful final combined run removed its data directories; failed harness-development attempts are superseded by this transcript and described in `rl110-harness-notes.md`.

## Primary references

Consequential claims were checked against pinned PostgreSQL18 primary documentation on 19 October 2026. These links retain the reader's native reference homes; article Sources entries annotate their purpose.

- https://www.postgresql.org/docs/18/tutorial-arch.html
- https://www.postgresql.org/docs/18/query-path.html
- https://www.postgresql.org/docs/18/storage-page-layout.html
- https://www.postgresql.org/docs/18/ddl-system-columns.html
- https://www.postgresql.org/docs/18/storage-toast.html
- https://www.postgresql.org/docs/18/storage-hot.html
- https://www.postgresql.org/docs/18/transaction-iso.html
