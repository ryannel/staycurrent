# Completeness and depth recheck — c02

## Decision

**Pass. C-D1 is closed. No required completeness or depth finding remains.**

Retain the complete 38-article assessment in `../completeness.md` and its per-article coverage notes. This is a focused repair recheck, not a new full-corpus reading or a repetition of unchanged native/UI checks.

## C-D1 — first practical environment entrance

The revised a02 section, “Start with a database you can inspect and reset”, now supplies the prerequisite bridge missing from c01:

- It names a running PostgreSQL 18 server, the client tools and a role allowed to create the exercise database; it links the official platform packages/installers and says to include the command-line tools.
- A collapsed macOS/Linux path selects one PostgreSQL 18 installation for both server and client commands, checks their versions, creates a private directory and starts a fresh socket-only peer-authenticated practice server. It clears inherited host-address/service/options selectors and sets the host, port and OS role for the existing exercise commands.
- Windows and existing-lab-server readers receive the alternative connection boundary, with host/port/role options applied consistently. The prose explicitly distinguishes starting a server from creating and connecting to a database.
- A visible `SELECT version(), current_database(), current_user;` check gives the expected engine, database and role before the fixture is loaded, with useful first distinctions for missing tools and failed connections.
- The unchanged schema/reset exercise then supplies the data. Closing instructions distinguish leaving psql, dropping the exercise database and stopping/removing the optional private cluster. Removal is conditional on a successful waited stop; failure retains the directory for investigation.

This is the smallest coherent kind of repair requested: a short visible prerequisite/connection bridge with an optional local procedure, inside the existing SQL article. It requires no additional article or installation survey. a00 and a08's unchanged incoming promises of a disposable starting environment are now supported.

## Evidence checked

Read the changed a02 source, its regenerated reading export and the setup/cleanup evidence:

- `../c02-exact-setup.json`: the complete a02 source hash and both displayed snippet hashes independently match the current source. The recorded run substitutes only the selected installed PostgreSQL 18 binary path plus a directory marker. Despite deliberately conflicting inherited selectors, it reaches PostgreSQL 18.6, `sql_working` and the intended OS role; loads the original fixture; returns the seven expected order/status rows; resets it; drops the exercise database; waits for shutdown and removes its own temporary directory. Exit status is zero.
- `../c02-native-setup.json`: the separate fresh-cluster run records the selected 18.6 tools, peer-authenticated initialisation, private socket, empty TCP listen-address setting, fixture/expected rows/reset, drop, waited stop, final “no server running” status and removal. Its directory mode is 0700.
- Both recorded temporary directories are absent on inspection. I did not start another server: the exact-snippet run already resolves the new execution question, and unchanged SQL/concurrency results remain retained.

On the actual frozen preview at `http://127.0.0.1:4438/review/relational-next/sql/`, read the visible prerequisite and connection check, expanded the private-server instructions and expanded cleanup. Both rendered snippets preserve the source's shell quoting, line continuation and commands. No download was clicked or executed.

Checked the complete c02 manifest against current files: all **183 hashes match**. Compared with c01, only a01 and a02 differ; the other 181 frozen files, including query modules and figures, remain unchanged. Read a01's added closing first-application link to a02 and a02's added closing link to transactions: these preserve the already approved parent-first route and introduce no new completeness concern. The independent structure/teaching reviewers own their S01 assessment.

The execution evidence establishes the stated fresh local path on macOS with PostgreSQL 18.6. It does not claim execution of platform installers, Windows startup or a Linux installation; those remain the official platform instructions and the portable procedure's stated prerequisites. No new production or hosted guarantee is inferred.

## Scope and cleanup

No new optional coverage expansion is proposed. The c01 conclusion that the collection supplies the commissioned relational practitioner route stands with its one prerequisite repair completed.

No article, component, shared source, build, Git or database state was changed by this recheck. Only this report was written. The temporary Chrome review tab was closed; existing tabs were left alone. No server was started or stopped by this reviewer. The shared 4438 preview is released for other reviewers and remains untouched.
