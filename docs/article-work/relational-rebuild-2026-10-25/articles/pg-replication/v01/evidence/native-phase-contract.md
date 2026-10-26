# Root-owned native drill

Run SQL-only `native-phases.sh` inside root's network-none pinned PostgreSQL18.6 container with absolute VERIFY_PG_BIN and exact root-observed VERIFY_SYSTEM_ID. Successful attempt03 used7700762140330237984; the earlier fixture identifiers are confined to archived attempt evidence. Retain root's image digest/container identity/resources, provision commands, phase stdout/errors and server logs outside it. No host/default database target. Root owns all provision/basebackup/start/stop/promote/return/cleanup commands.

Use the agreed data/socket/cluster paths in the script. DB sc_pg_replication, fixture superuser sc_pg_replication_writer; distinct applications shop_a/shop_b; owned physical slots shop_a/shop_b. Normal durability, logged tables and hot_standby on. Same-container process drill only; no machine independence, power loss, storage loss or real external fence test.

1. Provision primary. Run seed before clones. It creates a minimal products/order103/lines/payments projection; unrelated rows and unused columns are omitted. Retain identity/settings.
2. Root creates full A/B copies with pg_basebackup -R -C -S, corrects ports/socket/cluster_name, starts both. Run streaming.
3. Root stops B cleanly and confirms no automatic restart. Run durable-gap: pauses A replay, configures FIRST1, commits price22 using on; checks synced receive past conservative postcommit boundary while replay/read remain behind. Samples article sender/receiver/slot SQL.
4. Run remote-apply: a separate no-op UPDATE22 waits at SyncRep with A replay paused. Confirms wait, resumes replay, bounds completion and checks fresh22. This is the visibility counterexample to durable receipt alone.
5. Run ready-to-stop: final application boundary saved and A replay checked. Root stops primary cleanly with no further application writes, confirms exclusion/no restart, then waited pg_ctl promote A. Retain commands/logs.
6. Run promoted: checks non-recovery, current WAL filename timeline,22 and unchanged shop facts; separately reports latest checkpoint timeline without assuming it has advanced. Resets copied synchronous names explicitly. B stays stopped; its omission of C follows the controlled schedule, not a second promotion experiment.
7. Root preserves former-primary directory/evidence, creates a new full base copy of A at primary with -R/new slot shop_returned/application_name shop_returned; correct primary label/path/socket/port and start in recovery. Run returned: verify upstream, role and22; set explicit synchronous policy and pass remote_apply commit against returned copy. This tests fresh-copy return, not rewind.
8. Root retains evidence, then removes the owned fixture container/resources and records cleanup. No pruning or unrelated Docker changes.

Every phase should run under root's finite external timeout (60 seconds sufficient for this tiny fixture). SQL condition loops last about10seconds plus connection overhead. No measured latency/capacity claim. Source script phase hashes/results retained with article; guards reject mismatched sysid/version/path/cluster/listener.
