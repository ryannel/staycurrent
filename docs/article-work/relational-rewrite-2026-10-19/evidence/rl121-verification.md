# RL121 execution and evidence

19 October 2026. Status: drafting; independent review is separate.

## Reproduction

`python3 rl110-native.py all` from this evidence directory. Python 3 standard library and `/opt/homebrew/bin` PostgreSQL 18.6 are required. The harness rejects a different server version, creates unique `/private/tmp/staycurrent-rl110-*` directories and ports 56810–56815, stops every owned server in `finally`, and removes temporary data on success. Run modes sequentially because they reuse the bounded port set. No default service command is issued.

Canonical transcript: `rl110-native-all-observed.json`; page extraction: `rl121-observed.json`. Every selected entry retains its canonical event index. SQL, stdout and stderr are actual captured strings, not reconstructed output. The harness explicitly requires every expected rejection to fail. `pg_ctl` startup of the deliberately broken recovery copy is separately checked against its fatal log.

## Observations

Fresh app sessions read t4 under context and were denied a t5 insert, DELETE and ALTER. Changing the app context to t5 exposed t5, demonstrating the stated trust limit. The fixed tenant4 credential still read t4 after that context change and was denied a t5 insert. The owner read two rows before FORCE and zero after; the bypass role and superuser read two. Temporary config substitution returned attacker for the unsafe definer and trusted for the repaired one.

## Scope and reset

Independent server processes share one Apple-silicon/macOS host and local storage. The drill does not establish power-loss durability, external orchestration/fencing, an external pooler, hosted-provider behaviour, large-scale timing, a cross-major binary upgrade or complete real-application acceptance. Each mode starts from a fresh owned source. Client transactions end or are interrupted before owned clusters stop. Successful final combined run removed its data directories; failed harness-development attempts are superseded by this transcript and described in `rl110-harness-notes.md`.

## Primary references

Consequential claims were checked against pinned PostgreSQL18 primary documentation on 19 October 2026. These links retain the reader's native reference homes; article Sources entries annotate their purpose.

- https://www.postgresql.org/docs/18/user-manag.html
- https://www.postgresql.org/docs/18/ddl-priv.html
- https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html
- https://www.postgresql.org/docs/18/ddl-rowsecurity.html
- https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY
