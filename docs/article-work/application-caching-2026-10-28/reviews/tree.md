# Application caching: independent planned-tree review

Reviewed 28 October 2026 under `staycurrent-review`, using its value, practitioner
and teaching perspectives. Scope: the complete planned learning journey, article
ownership, prerequisites, route cost, practical depth and Redis framing. This is
the first independent whole-tree review, not an article prose or visual review.

## Fixed inputs

Reviewed all nine plans after the coordinator confirmed completion and freeze:
`root`, `fit`, `keys`, `freshness`, `versioned`, `misses`, `memory`, `redis` and
`operations`. All nine plan hashes and the canonical example hash match
[`tree-inputs.json`](tree-inputs.json). The assembled
[`application-caching-2026-10-28.yaml`](../../../coverage/application-caching-2026-10-28.yaml)
has SHA256 `54e6d77a6bf5f4773cb4a766f980e8ff389a317e99bb400c47f5576c4efde141`;
its nine article topics, titles, briefs and heading trees match the plans.
Also read the commission, current repository scope and canonical example.
No earlier review or worker verdict was used.

## Findings

**No critical or medium reader problem found in the frozen planned tree.** It
provides a coherent path from the first reusable answer to the decisions needed
to implement and operate a source-backed application cache. The plans justify
their boundaries through different reader decisions; neither additional pages
nor a merge is required before writing.

One optional handoff was resolved before freeze. The earlier keys plan routed
cached failure responses to the misses article, although that article did not
develop such a policy. The frozen wording instead states that this worked cache
propagates source failures. This removes an unsupported reading promise without
adding a subject or page. There is no outstanding low-severity finding.

## Coverage and ownership

The introduction supplies a useful answer at each branch: why reuse can help,
which requests can share, what changes invalidate the answer, why misses can
overload the source, and what limited memory changes. It does not merely advertise
children. Its concrete hit/miss, price-change and full-cache examples give a
newcomer enough understanding to choose the next question.

Each child earns its separate opening. Cutting **Deciding what and where to
cache** loses the uncached baseline, whole-request evaluation and placement
decision. Cutting **Cache keys** loses the identity and permitted-sharing contract,
including ambiguous encoding and mixed value formats. Cutting **Freshness and
invalidation** loses the distinction between insertion lifetime and source age,
the late-fill race, derived-answer dependencies and explicit current-read needs.
Cutting **Handling cache misses** loses the distinction between sharing one fill
and bounding source work across many keys and instances. Cutting **Cache memory
and eviction** loses byte accounting, admission and the workload evidence for a
retention policy. Cutting **Caching with Redis** leaves the reader without a
complete client path that handles unusable values, errors and deadlines. Cutting
**Operating a cache** removes the joined diagnosis and change/recovery judgement.

**Versioned cache fills** earns optional depth because its complete permission-to-
publish protocol and metadata counterexamples would interrupt the ordinary
freshness decision. The parent already offers a complete authoritative-revision
lookup design. The child explains its narrower guarantee, missing metadata,
non-reused tokens, delayed invalidations and restored state; it does not pretend
that rejecting an old publication makes every caller's result current.

The apparent overlaps have different jobs. Keys defines representation
compatibility; operations applies it during rollout and rollback. Freshness sets
permitted reuse; misses schedules refresh within that permission. Misses owns
source admission; memory owns admission of entries. Redis applies the earlier
decisions in code; operations uses their signals to choose an intervention.
Those are useful applications of an established mechanism, rather than planned
duplicate derivations. The detailed code and prose will still need to honour
these boundaries.

## Progression and reading cost

The eight-page main order places identity and freshness before refresh and
fallback, then capacity before the complete Redis adapter, and operation last.
That order avoids asking an implementer to make an unexplained validity or load
decision. The optional child is excluded from the default sequence. Its own
simple state model explains the atomicity it needs, with scheduling handed to
the misses owner.

| Reader task | Planned route and cost |
| --- | --- |
| Decide whether and where a cache earns its cost | Introduction + cache benefits: 2 pages. |
| Choose an ordinary freshness policy | Introduction + freshness: 2 pages; conditional publication adds the optional child, making 3. |
| Reconsider memory and retention | Introduction + memory: 2 pages; an existing reader can go directly to memory. |
| Implement and operate the complete worked design from newcomer level | The 8-page main route; 9 only if the reader chooses advanced publication mechanics. |

Merging freshness with its child would save one opening for the advanced reader
but impose metadata retention and protocol reasoning on every ordinary freshness
decision. Merging misses and memory would save one opening on the full route but
mix two distinct budgets and make a targeted overload or retention visit more
expensive. Keeping the client adapter together avoids requiring separate visits
for pool lifetime, decoding and deadline handling. The planned costs are
proportionate to the understanding gained.

The shop example remains coherent across the tree: north/P7, GBP 20 to GBP 22,
source revisions 1 and 2, format `v1`, the explicit P99 absence, and the separate
under-GBP-21 query. The canonical envelope and illustrative negative TTL do not
change the general reasoning. Checkout's transaction and stock checks remain
outside the cached display-card decision. Additional workload quantities are
explicitly invented or require recorded execution.

## Technical and reference calibration

The following primary-source checks support the consequential boundaries in the
plans, rather than establish a production implementation:

- [AWS's caching account](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
  supports testing cache loss and cold starts, bounding dependency demand, and
  treating format transitions as a source-load concern. Those decisions have
  owners in fit, misses and operations.
- [Meta's consistency account](https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/)
  identifies reordered fills and loss of remembered versions through eviction.
  The freshness parent exposes the race; the child addresses the metadata limit.
- [Scaling Memcache at Facebook, section 3.2.1](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf)
  describes deletion revoking a fill token. [Redis scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/)
  supplies atomic cache operations, while [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
  documents failover limitations. The child correctly limits its single-history
  reasoning and distinguishes erased from resurrected permission.
- [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/)
  supports memory-policy eligibility, rejected fills and excluded buffers.
  The memory plan keeps exact illustrative replacement traces separate from
  Redis's approximate behaviour.
- [Redis notifications](https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/)
  concern Redis changes and lose messages while disconnected. Freshness does not
  mistake them for a reliable source change stream.
- [Memcached's meta protocol](https://docs.memcached.org/protocols/meta/)
  supplies a concrete non-Redis context for conditional publication and refresh.
  Together with the local-cache and store comparisons, this keeps Redis a worked
  implementation rather than the definition of caching.

Calibrated teaching against bounded reference text: Sequence diagrams parts 2
and 3, Indexes part 1, Storage and durability part 2; inspected the provided
rendered captures of sequences figure 5, indexes figure 1 and storage figure 2.
These establish the relevant standard of a visible stable example, one changed
condition, and observable work or state. The caching plans identify comparable
connections to show: requests versus resident answers, loader versus waiters,
source observation versus insertion, and source/cache/caller outcomes. They do
not leave the central argument to an unplanned decorative illustration.

## Limits and disposition

The tree is ready to write. This judgement does not certify unwritten prose,
figure usability, code, client versions, execution evidence, production capacity
or a complete failover protocol. Those belong to the commissioned article and
rendered reviews. No build or server was run, no plan was edited by this reviewer,
and publication remains unauthorised. Retain this review when local writing
repairs leave its coverage and prerequisite decisions unchanged.
