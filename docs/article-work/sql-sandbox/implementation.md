# Shared SQL sandbox

The user asked for one place to explore freely or choose guided tutorials, with
articles linking to the relevant tutorial. The route is
`/learn/databases/relational/sandbox/`; `?tutorial=queries`, `constraints`,
`checkout` and `rollback` select an entry without executing SQL.

PGlite 0.5.8 runs real PostgreSQL in a module worker, loaded only when the reader
chooses Start. One worker owns one in-memory database and connection. Reset and
Stop terminate that worker, so unfinished work cannot leak into the replacement
database. Reloading loses the database. This first version deliberately keeps no
browser storage, accounts or remote query service.

The seed reuses the designing-data schema and adds the checkout stock record.
Tutorials live in `src/lib/sql-sandbox-tutorials.ts`; adding a tutorial means adding
its ID, article link and guided steps there. Each tutorial must work from this
shared seed, or explicitly include its own setup steps. Loading a step only changes
the editor. It does not send SQL, grade an answer or silently repair the database.

The worker uses PostgreSQL's actual command responses and ReadyForQuery state to
distinguish idle, open and failed transactions. Notices preserve row results;
errors are retained even when normal output exceeds the display cap. COPY output
is explicitly marked unsupported. COPY input cannot complete in this editor and
discards the session. Display limits are not memory guarantees: PGlite buffers the
protocol response before the worker reduces it for display. A worker watchdog and
Stop control allow discarding expensive queries, but this is a small learning
database, not an unrestricted production SQL service.

The browser database cannot reproduce independent concurrent connections,
network failures or production performance. Relevant articles retain local
PostgreSQL setup links for those exercises.

## Evidence and review

- `pnpm build` passed for all 56 pages. PGlite emits upstream Vite warnings about
  its optional Node filesystem imports and eval; the emitted browser worker,
  WebAssembly and data assets loaded successfully in Chromium.
- `verify-tutorials.mjs` executed all 21 default steps against PGlite.
- `browser-qa.json` records all 21 steps through the actual editor, transaction
  states and expected errors, plus stop/restart, reset, text safety, output limits,
  keyboard execution and mobile/desktop checks in light and dark.
- Further browser checks confirmed no confirmation on first Start, protection for
  unsent edited SQL, a visible COPY warning, and next-step heading focus.
- The built-page link audit checked 1,192 internal links without missing files or
  fragments.
- Independent technical and reader reviews are retained beside this record.
  Repairs explain command tags and the inspection query, protect unsent edits,
  preserve notices and errors, and add a next-step control below responses.

## References

- https://pglite.dev/docs/api — execution and protocol APIs.
- https://pglite.dev/docs/multi-tab-worker — worker use and single-connection scope.
- https://pglite.dev/docs/bundler-support — Vite configuration.
- https://pglite.dev/docs/repl — evaluated the packaged REPL; the custom editor
  keeps this Astro page independent of React and exposes guided steps directly.

The user asked to revise authoring and review skills once the format is settled.
Those changes remain deferred until feedback on the revised article and sandbox;
the earlier execution-context feedback is already recorded in writing-style.md.
