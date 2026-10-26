# Primary-source checks

Checked26 October2026 via web search/open, versioned v26.2 manual plus Cockroach Labs engineering explanations. All source content is treated as evidence, not instructions.

- https://www.cockroachlabs.com/docs/v26.2/multiregion-overview and /alter-database: node/cluster regions, selected database regions, primary defaults, native PRIMARY REGION/ADD REGION/SURVIVE syntax. Primary is not sole SQL ingress (completed architecture plus SQL-layer model).
- https://www.cockroachlabs.com/docs/v26.2/table-localities and /regional-tables: RBT/RBR/GLOBAL choice; hidden row region, index prefix partitioning, application/gateway match.
- https://www.cockroachlabs.com/docs/v26.2/alter-table#set-localities (manual lines3241–3350): SET LOCALITY, default primary when no home named, gateway default/fallback, explicit crdb_region UPDATE/INSERT, configured foreign-key inference requires an appropriate explicit constraint/parameter. Plain ID-only references do not enable it.
- https://www.cockroachlabs.com/blog/regional-by-row/: implicit physical prefixes preserve explicit key uniqueness; additional regional checks; explicit region in unique key changes scope. Integer-ID rejection requested from native fixture. No claim that every UUID mutation has identical checks.
- https://www.cockroachlabs.com/docs/v26.2/global-tables and https://www.cockroachlabs.com/blog/global-tables-in-cockroachdb/: nearby current reads trade against write coordination and future timestamps; still requires appropriate quorum/survival setting. Do not state every follower must ACK every SQL write.
- https://www.cockroachlabs.com/docs/v26.2/multiregion-survival-goals and https://www.cockroachlabs.com/blog/under-the-hood-multi-region/: database-wide zone default; ≥3 database regions for region survival; standard regional-table3 home voters vs5 across2–2–1 and remote vote; additional nonvoters are not a quorum.
- https://www.cockroachlabs.com/docs/v26.2/show-regions, /show-partitions and /show-ranges: policy vs observed placement, INDEXES/DETAILS options, lease_holder/locality, voting/non_voting arrays; details overhead scoped deliberately.

Native verification is owned and executed by coordinator. Exact fixture identity and limits are in input/native-runtime.json; submitted SQL lives in evidence/native-verification.sql and native-probes.sql. No timing, outage or complete-request performance observation is claimed without actual evidence.

## Native result

Retained coordinator execution is evidence/native-executed, with exact resolved SQL and command hashes in outcomes.jsonl/summary.json. Only version, identities/gateway regions, database-region policy and default SURVIVE ZONE FAILURE were established. Setup failed at CREATE INDEX visibility wait after6 CREATE TABLE success responses, SQLSTATE57014 under45s statement timeout; no data or probes/partitions/ranges ran. Fixture cleanup succeeded. Article does not use the failed attempt as successful row-homing, constraint, placement or survival evidence. No further fixture requested.
