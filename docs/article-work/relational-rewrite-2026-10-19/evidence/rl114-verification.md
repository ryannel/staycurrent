# RL114 execution and evidence

19 October 2026. Status: drafting; independent review is separate.

## Reproduction

`python3 rl110-native.py all` from this evidence directory. Python 3 standard library and `/opt/homebrew/bin` PostgreSQL 18.6 are required. The harness rejects a different server version, creates unique `/private/tmp/staycurrent-rl110-*` directories and ports 56810–56815, stops every owned server in `finally`, and removes temporary data on success. Run modes sequentially because they reuse the bounded port set. No default service command is issued.

Canonical transcript: `rl110-native-all-observed.json`; page extraction: `rl114-observed.json`. Every selected entry retains its canonical event index. SQL, stdout and stderr are actual captured strings, not reconstructed output. The harness explicitly requires every expected rejection to fail. `pg_ctl` startup of the deliberately broken recovery copy is separately checked against its fatal log.

## Observations

json retained both seat fields; jsonb retained B2. The null/existence query returned false, true, false. Whole-value containment used GIN for 100 matches; extracted equality scanned until an expression B-tree was added, then returned the same 100 through that index. The wide value occupied 3,235 bytes with 41,459,712 bytes of TOAST relation storage. One changed field advanced WAL by 4,200 bytes. Same-offer tests returned true/false where independent tests returned true/true. A numeric level insert was rejected.

## Scope and reset

Independent server processes share one Apple-silicon/macOS host and local storage. The drill does not establish power-loss durability, external orchestration/fencing, an external pooler, hosted-provider behaviour, large-scale timing, a cross-major binary upgrade or complete real-application acceptance. Each mode starts from a fresh owned source. Client transactions end or are interrupted before owned clusters stop. Successful final combined run removed its data directories; failed harness-development attempts are superseded by this transcript and described in `rl110-harness-notes.md`.

## Primary references

Consequential claims were checked against pinned PostgreSQL18 primary documentation on 19 October 2026. These links retain the reader's native reference homes; article Sources entries annotate their purpose.

- https://www.postgresql.org/docs/18/datatype-json.html
- https://www.postgresql.org/docs/18/functions-json.html
- https://www.postgresql.org/docs/18/storage-toast.html
- https://www.postgresql.org/docs/18/arrays.html
- https://www.postgresql.org/docs/18/rangetypes.html
