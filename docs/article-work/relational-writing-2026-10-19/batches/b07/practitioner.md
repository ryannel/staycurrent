# b07 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
a08 is a narrow a08-P1 repair recheck retaining unaffected b06 work. a09 receives
an initial full review against the original relational-practice goal, actual a01
parent, available a10 sibling and supplied family scopes. No other perspective's
report, teaching-reference articles or old relational corpus was read. No article,
component, retained evidence, commit or publication state was changed.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a08 | Pass | None; a08-P1 resolved | None new |
| a09 | Pass | None | None |

## a08 — Choosing a relational database

**Pass, narrow repair recheck.** The only article change is the agreed paragraph
after the reservation statement. It now correctly distinguishes an empty claimed
row set from an INSERT that actually tests an existing request identity. A valid
replay uses its saved outcome after argument comparison; an empty result is not
automatically a new sold-out decision. Uncertain commit remains an application
protocol concern. The source and writer notes retain the same boundary and refer
to b06's additional native exhausted-stock observation.

This matches the independently observed outcomes: duplicate with stock remaining
raises 23505 and rolls back its decrement; duplicate after stock exhaustion returns
`INSERT 0 0` with no proposed row and no uniqueness error. SQL, models and native
observation hashes are unchanged. Retain b06's unaffected correctness, native
suite/export, working-model and family-boundary assessment; no repeat native or
browser run is needed for this prose repair.

## a09 — Choosing types and representing missing values

**Pass.** The article completes a practical set of representation choices for the
parent's booking schema. Each distinction has an input or requirement that exposes
its consequence. The result is useful relational engineering depth without a
type catalogue or specialist diversion.

### Correctness and useful depth

The fee contract separates unit, range, finite values and input policy from what
the column can store. Precision/scale, assignment rounding before range checking,
whole-cent validation before coercion and intermediate/calculation policy are
accurate. Decimal exactness is not confused with retaining an extra submitted
fraction or with exact division. Minor units retain currency/scale obligations;
floating point is tied to an explicit acceptable error rather than treated as
inherently unsuitable for every quantity.

Identity text retains leading zeroes and namespaces. Display spelling, search,
ordering and equality remain different decisions. Unicode normalisation is not
presented as case/accent policy; the canonicalisation model explicitly limits
itself to an ASCII code alphabet. PostgreSQL deterministic byte tie-breaking and
configured nondeterministic equality are correctly qualified. PostgreSQL text,
blank-padded char and MySQL collation pad attributes are distinguished without
pretending that the MySQL case was executed. Character count, byte count and
visible glyph are not conflated.

Dates, local clock readings, instants and elapsed durations lead to different
representations. The London repeated and skipped clock cases are correct. The
article names PostgreSQL's automatic resolution and refuses to treat that as the
booking policy. `timestamptz` display changes without retaining the original zone
or offset; recurring local schedules keep a named zone and an occurrence policy.
Precision loss through Date is separated from native timestamp storage.

Missing information is represented without invented facts. One nullable phone is
enough for the parent's current requirement; distinct unprovided/declined states
become useful only after the next action depends on them. Associated-value rules,
blank-input rejection, defaults, explicit null and partial-update omission are
kept distinct. Expression truth and constraint enforcement go to their owners.

Structured-value ownership is a sound basis for choosing columns, arrays, JSON
or related rows. Reference and independent-fulfilment requirements explain the
changed boundary rather than asserting that JSON is always wrong. JSON absence,
JSON null and SQL null remain separate through the demonstrated operations, and
the small older-payload reader has an explicit shape/version policy. Binary and
external-payload discussion preserves lifecycle, publication and restore
obligations without inventing cross-store atomicity.

### Independent execution and evidence boundaries

Read the complete snapshot, own plan, actual parent and available constraint
sibling prose, normalisation/history scopes, source record, handoff, retained
native/application results, component, model and both verifiers.

Ran `verify.sql` independently in a fresh own native PostgreSQL 18.6 database,
UTF8 and C/C locale, with UTC except its explicit Europe/London comparison. It
reproduced the recorded rounding/overflow, float-versus-numeric sum, exact bigint,
leading-zero conversion, text/char equality, Unicode normalisation/length,
London transition, session display, defaults, SQL-null/empty and JSON-null results.
Native output retained `.123456` fractional seconds. Both expected overflow
notices appeared. Closed the session and removed only my fresh review database;
the shared server and retained output file were unchanged.

Also independently ran the actual JavaScript verifier through installed PGlite
0.5.8, whose query result reports PostgreSQL 18.3 WebAssembly. Its assertions
passed for BigInt `9007199254740993`, decimal string `20.01`, code `007`, Date
`.123Z`, unsafe Number `9007199254740992`, BigInt JSON rejection, explicit string
encoding, missing versus present-null properties, whole-cent input policy and
the bounded older/current JSON shape reader. The application result agrees with
the retained JSON. No configured production driver mapping is inferred from this
particular JavaScript query API.

The article explicitly separates native 18.6, PGlite/PostgreSQL 18.3 and browser
model time-zone data. That is the correct scope for the mixed evidence: neither
the figures nor a different driver's default parsers are called native execution.
No retained result file was overwritten by either check.

Primary checks included PostgreSQL 18
[numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html),
[character types](https://www.postgresql.org/docs/18/datatype-character.html),
[UUID](https://www.postgresql.org/docs/18/datatype-uuid.html),
[collations](https://www.postgresql.org/docs/18/collation.html),
[normalisation/length functions](https://www.postgresql.org/docs/18/functions-string.html),
[date/time storage](https://www.postgresql.org/docs/18/datatype-datetime.html),
[transition resolution](https://www.postgresql.org/docs/18/datetime-invalid-input.html),
[defaults](https://www.postgresql.org/docs/18/ddl-default.html) and
[JSON types](https://www.postgresql.org/docs/18/datatype-json.html);
MySQL 8.4's [pad-attribute contract](https://dev.mysql.com/doc/refman/8.4/en/char.html);
and the ECMAScript
[safe-integer boundary](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_safe_integer).

### Working models and family boundaries

Independently enumerated all 30 exposed input/policy combinations in `model.ts`
and asserted their consequential differences. In my own Chrome tab on fixed
preview 4437, advanced all five figures to their conclusion and changed every
exposed input/policy combination there. All 30 endpoints preserve the comparison
step and match the model: fractional-cent rounding/rejection/overflow; exact or
canonical code equality; repeated London reading versus distinct instants;
nullable phone collapsing reasons versus explicit state preserving them; and
embedded options gaining reference or lifecycle obligations. The browser's London
mapping agrees with the independently checked native transition.

a01 already gives a complete first design with these same euros, exact membership
codes, finite session instant and nullable-phone assumptions. a09 deepens how to
preserve them; it does not silently change the parent's identity or booking rules.
The available a10 draft explicitly links representation/equality back here and
owns requiredness, checks, keys, references and their enforcement. a11 retains
dependency/reconstruction theory and derived-copy contracts; a12 retains agreement
history and effective periods. SQL-values owns arithmetic/casts/three-valued
expressions; a04 owns actual request/driver coordination; a06 owns changing old
stored data and callers. This division supplies a complete ordinary answer here
without requiring specialist type or document-store study. No new branch or
consolidation is needed.

## Scope and handoff

Both snapshots match rendered sources and all nine manifest file hashes are
unchanged. The new a10 sibling was read as source, not through an older build.
Browser checks used only the fixed 4437 preview; no shared build was run.
Presentation, playback, keyboard and phone assessment remain with the independent
teaching perspective. Both articles pass the practitioner gate; no required
repair recheck is requested.
