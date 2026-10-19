# a09 — sources and execution evidence

Checked 19 October 2026. All organisations, bookings, fee contracts and input policies are invented. Figures model choices; they do not execute database requests.

## Primary sources

- [PostgreSQL 18 Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html): integer bounds; numeric precision/scale and assignment rounding; floating-point approximation; special values. Worked rounding and overflow also executed natively.
- [PostgreSQL 18 Character Types](https://www.postgresql.org/docs/18/datatype-character.html): character rather than byte limits, text versus blank-padded char, no performance advantage to char; input truncation caveats remain with SQL expression owner.
- [PostgreSQL 18 UUID](https://www.postgresql.org/docs/18/datatype-uuid.html): 128-bit value, accepted input forms and standard output. Allocation and identity design remain with parent.
- [PostgreSQL 18 Collation Support](https://www.postgresql.org/docs/18/collation.html): deterministic byte tie-breaking and deliberately configured nondeterministic equality.
- [PostgreSQL 18 String Functions](https://www.postgresql.org/docs/18/functions-string.html): character/byte length and NFC normalisation.
- [MySQL 8.4 CHAR and VARCHAR](https://dev.mysql.com/doc/refman/8.4/en/char.html): collation PAD SPACE/NO PAD and trailing-space equality/duplicate keys. Documentation comparison only; no MySQL runtime used.
- [PostgreSQL 18 Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html): timestamp/timestamptz, UTC instant representation without original zone, session-zone output, microsecond resolution, named zones, interval months/days/time.
- [PostgreSQL 18 Invalid or Ambiguous Timestamps](https://www.postgresql.org/docs/18/datetime-invalid-input.html): automatic transition resolution is not input rejection or application policy.
- [PostgreSQL 18 Default Values](https://www.postgresql.org/docs/18/ddl-default.html): omission or explicit DEFAULT requests default. Explicit NULL remains a separate input.
- [PostgreSQL 18 Arrays](https://www.postgresql.org/docs/18/arrays.html): homogeneous element types and query/update support; arrays are not element identities or foreign keys.
- [PostgreSQL 18 JSON Types](https://www.postgresql.org/docs/18/datatype-json.html): SQL NULL and JSON null are different; valid syntax is distinct from the illustrated shape policy.
- [ECMAScript Number.MAX_SAFE_INTEGER](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_safe_integer): safe-integer boundary. Exact coercion, BigInt JSON rejection and Date precision outcomes executed in Node.js 24.16.0 through the installed PGlite API.

## Executed native database observations

Runtime: PostgreSQL 18.6 Homebrew aarch64, disposable database `rel3_a09_run1`, cluster/port from shared runtime.md. UTF8, database datcollate/datctype C/C. UTC except explicit session override to Europe/London, restored to UTC. No shared server configuration changed. Database dropped on completion.

Fixture: `src/components/relational-next/a09/verify.sql`; retained output: `native-results.txt` beside this record.

- Numeric(8,2) stores 20.005 as 20.01; rejects 999999.995 after rounding. Integer rejects 2147483648.
- Float8 0.1+0.2 outputs 0.30000000000000004; numeric sum 0.3.
- Text 007 remains 007; integer conversion gives 7.
- C text equality distinguishes M007 from trailing-space/case variants; char(5) comparison ignores trailing padding.
- Precomposed/decomposed e-acute differ raw, agree after NFC; precomposed value is one character and two UTF8 bytes.
- UTC 00:30 and 01:30 on 25 October 2026 both display as London local 01:30.
- Ambiguous local 01:30 resolves to 01:30 UTC; nonexistent March local reading is accepted under engine rule.
- Instant display changes from UTC 00:30+00 to London 01:30+01 without changing the instant.
- Omitted/default, SQL null and empty string distinguished. The exact displayed contact_example state-default snippet also executed at the end of the fixture.
- Missing JSON key extraction yields SQL null; JSON-null value extraction remains a JSON value; SQL-null column remains SQL null.
- Native instant retains .123456 microseconds.

The initial evidence query used removed `SHOW lc_collate`; it was corrected to read pg_database before the complete final fixture run. Final retained output is the successful run. No article outcome rests on that failed metadata read.

## Executed application boundary

Fixture: `src/components/relational-next/a09/verify.mjs`; run with Node.js 24.16.0. Installed PGlite 0.5.8 reports PostgreSQL 18.3 wasm32. Retained stdout: `application-results.json` (JSON only); exit status 0 also covers assertions after stdout.

- Query API returns bigint as JS BigInt, numeric as string and timestamptz as Date.
- Native JS BigInt identifier is 9007199254740993n. Coercing to Number produces 9007199254740992.
- Plain JSON.stringify rejects BigInt. Explicit string identifier survives JSON round trip.
- Date outputs .123Z from .123456 input; original microseconds do not survive.
- Leading-zero code preserved as text; parsed JSON retains missing versus present-null property.
- A small explicit whole-cent input validator rejects 20.005 before query, accepts 20.00, and accepted value round trips.
- Small JSON shape reader accepts old empty object as no notes, accepts v1 text list, refuses null notes and unknown version. It is an example policy, not a general JSON-schema implementation.

## Figure verification

`model.ts` transpiles with installed esbuild. All 30 combinations of exposed controls produce three nonempty labels, values, details and narration steps. Semantic checks additionally compare rounded amount, rejection, exact/canonical code outcome, repeated London time, nullable/state collision and embedded/row change consequence.

Both article and component transform with installed @astrojs/compiler 2.13.1 without diagnostics. Native component script transpiles. No shared build or dist operation performed. Central promotion/browser review remains with orchestrator.

## Root playback repair, 20 October 2026

B07 teaching P2: playback now budgets all three visible stage labels, values and details plus the current narration, at 180 words per minute with three seconds for inspection (minimum six seconds). It no longer counts narration alone. Manual controls, focus behaviour, prose, models and retained native/application evidence are unchanged.
