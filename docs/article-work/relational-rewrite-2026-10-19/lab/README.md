# Reproduce the CockroachDB worksheets

These worksheets use native CockroachDB 25.4.17 on macOS ARM64. The upgrade
also needs 25.3.7. Download binaries from Cockroach Labs' official release
archive. This platform is experimental; these are local teaching experiments.
Python 3 and PostgreSQL's `psql` client must be on PATH. The source-migration
case also uses `initdb` and `pg_ctl` from PostgreSQL 18.6.

Keep this layout together, either in the repository or in the worksheet bundle:

```text
lab/
  cockroach_lab.py
  cockroach_scenarios.py
  cockroach_extra.py
  cockroach_restore.py
  cockroach_atomicity.py
  cockroach_identity.py
evidence/
```

The scripts write observations into `evidence/`. Run from an extracted copy if
you want to retain the committed observations beside your new run. Binaries,
certificates and database files are not included in the bundle.

```sh
python3 lab/cockroach_scenarios.py \
  --bin /absolute/path/to/cockroach-v25.4.17/cockroach \
  --old-bin /absolute/path/to/cockroach-v25.3.7/cockroach \
  --phase all

python3 lab/cockroach_restore.py \
  --bin /absolute/path/to/cockroach-v25.4.17/cockroach

python3 lab/cockroach_atomicity.py \
  --bin /absolute/path/to/cockroach-v25.4.17/cockroach
```

`--phase native` skips the version upgrade and starts directly on 25.4.17. It
still runs the query, concurrent transaction, schema-job, backup, regional,
membership and PostgreSQL migration cases. `all` additionally tests the staged
25.3.7→25.4.17 upgrade, supported return before finalisation and rejected old
binary after finalisation. The available experimental grace period permitted
the recorded local runs; use the licensing requirements of your own installation.

The scripts use temporary directories, fresh lab certificates and loopback
ports 56901–56909, 57901–57909 and 56920. The separate destination-cluster
restore uses ports 57001 and 58001. Leave these ports free. None of these
commands operates the default PostgreSQL service or an existing Cockroach store.

The main run starts three processes, adds six for the regional test, stops the
three eu-labelled processes, rejoins them, then decommissions one discovered
node ID. Finally it stops its owned processes and removes the temporary data
and private keys. This is real database behaviour on one host, with shared
storage and networking. It measures neither geographical survival nor WAN
latency, host power loss or production capacity.

The retained concurrent schema observation starts with 200,000 rows. The
reproduction script now uses 50,000 to bound runtime. The recorded first RESUME
was too early (`pause-requested`); a separate recorded request after `paused`
succeeded. The script now waits for `paused` before resuming. A rerun supplies
its own job IDs, timestamps, node IDs, placement and measurements.

`cockroach_restore.py` has a separate smaller fixture and a separately initialised
destination cluster. Its source has one order at 20.00 and two places remaining.
It restores real records, demonstrates missing identity and grants, repairs the
read-only runtime role, then verifies allowed reads and denied mutations. A later
guarded reservation decrements capacity and inserts r82 together. An incremental
restore retains both changes; an earlier restore needs coupled reconciliation,
whose second replay does not consume another place. Its
clusters share a host, lab CA and temporary external-file directory.

`cockroach_atomicity.py` puts two distinct table ranges on singleton replicas at
different nodes, deliberately sacrificing resilience to isolate a participant
outage. Its TLS protocol shim discards an actual COMMIT completion before
returning to the caller, then stops the SQL gateway. A new gateway observes
both changes. A second transaction changes the healthy participant provisionally,
but cannot finish its required write while the other process is unavailable.
Rollback and return leave the prior committed pair intact. This is an observed
application boundary; the shim does not expose internal STAGING/intent records.

`cockroach_identity.py --bin <25.4.17-binary>` runs the independent secure-join
and login-authority case. A new node with the wrong CA cannot join; correcting
its lab trust lets it join without disabling TLS. It replaces a client certificate,
proves the old certificate still works, disables the former SQL login, then tests
a new read-only identity. The login probes are fresh connections; existing pooled
sessions and PKI revocation are outside this experiment.

## PostgreSQL major-upgrade supplement

`postgresql_major.py` is a separate worksheet kept in the repository. Its old
installation is `/private/tmp/staycurrent-pg17/bin`; its new one is
`/opt/homebrew/opt/postgresql@18/bin`. The old installation was built from
<https://ftp.postgresql.org/pub/source/v17.6/postgresql-17.6.tar.bz2> using
`./configure --prefix=/private/tmp/staycurrent-pg17 --without-icu --without-readline
--without-zlib --without-openssl`, `make -j4`, then `make install`. The new
installation reports PostgreSQL 18.6 Homebrew. No optional extension is used in
this upgrade fixture. The independent 18.6 dump/restore worksheet tests
`btree_gist` separately.
