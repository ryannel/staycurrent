# Scenario and continuity decisions

Shared facts: independent P7 catalogue price20.00→22.00; post-103 stock P3=10, P7=0, P9=4; order103 stays pending, no payment, agreed mug price20.00 and two-line total29.00. No business effective times, measured XIDs, LSNs or physical addresses invented. No shared extension or ownership changes requested.

Figure1 local conditions: report R is read-only Repeatable Read and its first ordinary SELECT precedes the update. Local price B-tree prevents HOT; chosen same-page old/new placement. Extra-snapshot option is an independent retention branch. Later vacuum includes index cleanup and reaches the qualifying all-visible state only when no other retention remains. This is a model, not a native trace.

Figure2 is an independent anonymous heap model, not extra shop products:6pages×4equal-sized units,6live+18obsolete, then18free; rewrite2pages×4units holds6live+2free. No tuple-size or packing observation claimed.

Figure3 is a tiny-table transaction-count model with P7 at22.00 and no dead version or retaining horizon; boundary age20m→180m→0→20m, live business value unchanged. All live tuples can freeze and the page becomes all-frozen.200m marks an illustrative forced-autovacuum setting, not a stop/wrap limit. Later age of the conservative recorded boundary does not unfreeze the tuple.

Autovacuum arithmetic is a separate million-row workload with estimated size fixed and1,000updates/deletes/s, base50, factors0.2/0.01; cap not binding;200,050/10,050changed tuples give about200/10seconds to eligibility. No timing or scheduler prediction. Age margin example50mXIDs/10,000XIDs/s=5,000s≈83min, not production capacity.

Neighbour boundaries: parent retains first tuple visibility/HOT explanation; replication retains standby and slot policy; operations retains wider request diagnosis; schema-change retains detailed rewrite/index rollout. Article supplies retention/age diagnosis and verification, as incoming ownership requests.
