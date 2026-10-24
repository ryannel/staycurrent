# Operating and securing a CockroachDB cluster

Operate a secure CockroachDB cluster with evidence about identity, range health and planned removal.

## What the reader should understand

- Verify secure runtime identity, least privilege and tenant isolation
- Diagnose under-replication and remove a node without losing the survival budget

## Starting knowledge

For security: general least privilege and trusted application/tenant ownership (RL104); the needed secure deployment and SQL object/session context is introduced locally. For node health/removal: also CockroachDB ranges (RL123), general rebalancing and the topology’s survival budget (RL109).

This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.

## Neighbouring ownership

- Upgrading a CockroachDB cluster: Owns version transitions.
- CockroachDB backup and recovery: Owns backup recovery.
- CockroachDB query work and hot ranges: Owns SQL query performance.
- CockroachDB keys, ranges and replication: Supplies range, lease and replica understanding before node health/removal work.
- Rebalancing and cluster change: Supplies movement and failure-headroom understanding before node health/removal work.

## Prerequisite context

- Database access and least privilege: supplied complete draft source (r25.astro); rendered context at http://127.0.0.1:4368/review/relational-collection/access-control/. This is entry context, not an independent review verdict.

The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.

## Output

Body fragment: src/articles/relational-collection/r49.astro. Supporting components: src/components/relational-collection/r49/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.
