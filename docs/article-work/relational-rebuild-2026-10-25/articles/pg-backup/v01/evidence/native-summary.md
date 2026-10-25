# Native author verification · completed

Coordinator inspected and executed the guarded author verifier in the exact owned fixture from fixture-guards.json. No worker lifecycle/provision/install command ran. Root reports fixture removed after evidence capture. The three author verifier source hashes were identical before and after execution:

- native-drill.sh ac238a809131643ef5f57646e6296457afeae3d2380b055b7b770e0be1f3ded0
- seed.sql f6ca1c27e7df4f497767a35b1c0abc67b5cd2ee1658d52cc2008fd629c5a2794
- reconcile.sql 7ba92beac3c47c19c7ed05bf3ad2feb0c680927331b7323aecf04cd526c4436c

Observed runtime: PostgreSQL18.6 (Debian18.6-1.pgdg13+2), aarch64 Linux, official pinned image, sysid7700753450331590705. Source timeline1. Separate source/restore/gap data directories and Unix sockets; networknone/nohostports. Same retained container storage/failure boundary.

Passed source/logical/prepare/paused/reconcile phases all exit0, with exact commands/outcomes in native-*-execution.json and actual text in captured-*.txt/native-*.txt.

1. Plain full base with streamed WAL and SHA256 manifest verified at creation, before copy and again at end. `captured-verify-base.txt`, `captured-verify-before-copy.txt`, `native-final-manifest.txt` each report successful verification.
2. Named before_price_mistake deliberately created after completed base. Paused native recovery: recovery=t, pause_state=paused, replay LSN0/5000090. Facts20.00|pending|29.00|0.00|10,0,4; payment operation mapping absent. Logs explicitly report stopping at named point and pausing. These real positions are evidence only; article figures remain models.
3. Gap test withheld required post-backup segment000000010000000000000005 only from copied archive; confirmed no bundled copy and no streaming. Explicit target after_payment. Startup exit1; server logs consistency/read-only readiness then `FATAL: recovery ended before configured recovery target was reached`. Original archive/base unchanged. Binary withheld WAL not exported into article evidence.
4. Logical custom dump taken before mistake restored into new template0 database sc_pg_backup_logical. P7 price20.00, stock10/0/4; payment504 count0; all six public tables owned by sc_pg_backup_writer; plpgsql1.0 only.
5. Root fenced original business DB by ALLOW_CONNECTIONS=false from separate owned control DB and removed ordinary source clients. Reconnect to source DB refused with FATAL. Source server remained running; this was not physical shutdown or a measured distributed/provider authority boundary.
6. Target resumed from accepted paused point and completed recovery on timeline2. Guarded reconciliation run twice leaves20.00|pending|29.00|10.00|10,0,4 and exactly one payment504, with immutable operation mapping. Thus due19.00, original stock retained. No provider call occurred; accepted10.00 remains supplied hypothetical evidence.

Limits: no power failure, machine/storage loss, independent archive failure domain, production performance/RTO, real application identity handover, real provider, extra tablespace, third-party extension or incremental execution tested. Native flags/procedures for those boundaries are documented or described as requirements, not observed claims. PGlite separately verifies SQL mismatch/atomic rollback and blind-replay counterexample. Root owns cleanup and canonical integration.
