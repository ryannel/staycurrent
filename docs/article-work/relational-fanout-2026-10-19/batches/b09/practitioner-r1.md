# Practitioner review — b09, round 1

Reviewed a28–a31 and their supplied contexts against the original relational-practice goal. No other review report was read. These are planning verdicts; rehearsals, concrete commands and observed behaviour remain to be checked when written.

## a28 — Improving performance under concurrent load

**Pass. No required repair.** A single measurement boundary connects arrivals, completions, outstanding work and latency, including work that survives caller timeout. The steady-state qualification and closed-loop demand example prevent attractive load-test numbers from concealing overload. Serial hot records, aggregate operator memory, background work and deferred maintenance are tied to distinct interventions. Admission changes must account for moved queues, rejected work and fairness, so reduced database latency cannot alone establish improvement. This is sufficient workload judgement without a separate queueing or capacity-theory branch.

## a29 — Changing schemas without breaking applications

**Pass. No required repair.** Runner transaction boundaries, queued DDL, invalid index remnants and lost DDL replies make this a usable procedure plan rather than a catalogue of online features. Staged enforcement distinguishes new-write protection from old-row validation, and replacement-column work retains dependency and reconciliation gates. Rehearsal includes interruption and repetition, with the recovery record distinguished from the application postcondition. The cited PostgreSQL 18 [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) and [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html) pages were checked as suitable primary sources for these operation-specific restrictions; this does not establish the unexecuted procedures. No per-command child is necessary.

## a30 — Running reliable data changes

**Pass. No required repair.** The work-coverage argument explicitly handles identifiers allocated before later commit, changing eligibility and catch-up work, avoiding a false completion claim from a high-water mark alone. Source-version guards prevent stale conversion from overwriting a newer address, while dispositions and durable progress participate in the recovery contract. The import/correction contrasts preserve input identity and valid intervening edits without expanding into separate ingestion curricula. Reconciliation checks meaning and versions as well as counts. No required capability is missing.

## a31 — Moving databases with a controlled cutover

**Pass. No required repair.** Both a bounded write pause and live capture remain complete choices. Snapshot/capture continuity, unreplicated state, delayed writers and final-boundary evidence are explicit, and routing changes are not confused with fencing. The destination-write boundary makes the return path honest: accepted destination writes must survive any reversal. Compatibility and rehearsal cover the application's meaning and access, not only row transfer. Ongoing replication and recovery procedures have clear owners. The plan can stop here without an engine-pair migration curriculum.

## Batch verdict

All four plans pass. No required repair or additional article is identified.
