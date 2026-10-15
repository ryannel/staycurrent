# PostgreSQL completion

Commissioned 15 October 2026 as the implementation branch of the relational
collection. Each page assumes basic relational concepts and supplies its own
orientation before introducing implementation vocabulary.

- Architecture follows one indexed product read and a conditional stock update
  through backend process, planning, buffers, heap versions, locks, WAL, checkpoint
  and cleanup. It joins mechanisms already introduced elsewhere without turning
  into a catalogue of every PostgreSQL subsystem.
- Indexes compares the information B-tree, GIN and BRIN store for three questions
  about one event table. The new skill is matching method and operator class to
  ordering, contained-value lookup or physical range elimination. General ordered
  key design remains in the family article.
- Row versions connects a changed tuple location, a retained reader and a covering
  plan's heap fetches to MVCC, visibility-map maintenance, HOT and cleanup.
- Recovery separates WAL generation, insert/flush positions, durable commit, page
  writes, checkpoints and replay. The browser shows WAL from a rolled-back update;
  server durability is explained with explicit configuration and storage conditions.

Four independent lessons use their own pg_path_, pg_method_, pg_visibility_ and
pg_wal_ tables. Their 22 steps include setup, predictions, interpretation,
variations and reset. VACUUM is a standalone command. Raw protocol preserves the
WAL lesson's deliberately open transaction across steps. No browser experiment
claims multiple server processes, independent concurrent sessions, physical-disk
flushing, crash recovery or replication.

Coordinator owns independent review, assembled responsive/theme inspection, build,
registry updates, publication and commits. Owned pages retain draft/noindex until
that publication pass.
