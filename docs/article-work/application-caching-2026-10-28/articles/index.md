# Application caching introduction

Draft prepared 28 October 2026 after coordinator RELEASE of the independently
reviewed complete tree. Not authorised for publication.

## Reference work

Read all nineteen parts separately with `read-writing-reference.py`, each tool
call allowing 5,000 output tokens. Every END marker arrived: sequences 1–6,
indexes 1–7, storage 1–6. Inspected rendered sequence Figure 1, index Figure 3,
storage Figures 2 and 3 in `/private/tmp/application-caching-references/`.

The opening follows the references' definition, concrete work saved and price
paid. Hit/miss and source change use the same boxes with changed contents, as
Storage follows P7 through memory and persistent state. The identity drawing
shows the actual wrong value, and the memory comparison exposes the displaced
cards and subsequent source reads. Child links follow a locally useful explanation.

## Primary claims checked

- Microsoft Cache-Aside pattern: application lookup/read/fill responsibility,
  source change then invalidation, separate copies and local caches.
  https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
- Redis GET, SET, DEL, EXPIRE: string lookup, SET EX in one command, deletion and
  expiry from the assigned lifetime. These commands are shown as shapes, with a
  clearly non-runnable encoded-card placeholder rather than an adapter claim.
  https://redis.io/docs/latest/commands/get/
  https://redis.io/docs/latest/commands/set/
  https://redis.io/docs/latest/commands/del/
  https://redis.io/docs/latest/commands/expire/
- Redis Key eviction: finite memory, disposable source-backed copies and policy.
  https://redis.io/docs/latest/develop/reference/eviction/
- Amazon Builders' Library: coalescing, cold-cache demand and dependency limits.
  https://aws.amazon.com/builders-library/caching-challenges-and-strategies/

No native database behaviour or performance is claimed. Workload arithmetic is
explicitly invented: 20 ms source/assembly, 1 ms lookup, 1 ms fill; 90 hits and ten
misses give (90+220)/100 = 3.1 ms and ten source reads. The operation table uses
1,000 and 2,000 requests/s with 90% hits, giving 100 and 200 source reads/s. Its
latency numbers illustrate an incident rather than deriving queuing behaviour.

## Continuity and scope

Complete piece reread from first lookup through operation. Baseline remains
north/P7/en-GB/GBP at 2000 pence, revision 1; change is 2200, revision 2. The root
uses human GBP prices rather than code values. South's independent GBP 18.00 is
labelled and only exposes identity. Format v1 is distinct from source revision.
Checkout retains normal source transaction and stock checks. The catalogue is
public. The 30-second insertion TTL is never claimed as an unconditional source
age guarantee. Delayed fills are introduced briefly and referred to freshness;
the full race and version protocol remain in their owning children.

Figure-local invented facts: four callers within App A; 4 KiB cache with four
1 KiB entries and one 3 KiB result. Memory sizes include keys and bookkeeping,
and specified victims do not predict Redis eviction. No new shared source fact
was needed. All links use coordinator-supplied keys and `hrefFor`.

## Figure evidence and remaining checks

Six figures: two shared-stepper walks with complete ordered text alternatives;
two static placement/identity drawings; selectable source-work and byte-budget
comparisons with static text alternatives. Controls use native buttons/selects,
focus styles, theme tokens and responsive grids. Mobile identity flow stacks.
Source count, cached/source values and caller reply remain visible in the walks.

Coordinator owns build, dense-prose, actual 375px/desktop light/dark captures,
keyboard/control exercise and independent review. No build or rendered-pass claim
is made by this writer. No server, subagents, commit or publication was started.
