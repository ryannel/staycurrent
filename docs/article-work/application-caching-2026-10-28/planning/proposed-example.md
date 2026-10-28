# Application caching: proposed shared example

Agreed with the coordinator, 28 October 2026. These are invented teaching facts,
not measurements of a running service. Redis is the worked implementation of an
application cache; the general principles apply to other suitable implementations.

## The shop and its source

The application serves product cards for shop `north`. Its authoritative database
holds product `P7`, a blue mug priced at **GBP 20.00**. Use integer
`price_pence: 2000` in code and `revision: 1`. A later committed update changes the
price to **GBP 22.00**, with `price_pence: 2200` and `revision: 2`.

A cached product card contains the display name and display price. Checkout reads
the authoritative source for its current price and stock decision. The cached card
does not authorise a sale. The catalogue is public; examples involving restricted
results introduce their access rules explicitly.

The source supplies a complete product representation for the requested shop,
locale and currency. Examples do not imply that translating names or converting
currency is performed by Redis. The concrete starting representation is
`en-GB` and `GBP`.

## Keys and values

Use `product:v1:north:P7:en-GB:GBP` as the baseline key: representation version,
shop, product, locale and currency. `v1` is the value format, not the product's
revision. A diagram can shorten the displayed key to `P7` once its caption names
the omitted context. Code and key-design examples use the complete key.

The key-design article may introduce shop `south`, whose independent `P7` costs
GBP 18.00, to expose a collision. Keep that variation labelled; it does not change
the north shop's price. Product `P99` initially does not exist and can later be
created to explain cached absence. A timeout or source failure is not evidence
that P99 does not exist.

## Reads, changes and time

Baseline reads use cache-aside: try the cache, read the source on a miss, build the
card and save a copy for later reads. All accepted product changes commit at the
source. Start the update example by deleting the corresponding cache key after
commit, then explore what that ordering leaves unresolved.

The baseline entry has a **30-second TTL from insertion**. This is an illustrative
setting, not an unconditional guarantee that the source data is at most 30 seconds
old. The freshness article owns source-read duration, replica lag, late fills,
age limits and any stronger contract. Do not silently restart a data-age allowance
when a value moves between cache layers.

Use this exact stale-fill interleaving where it is needed:

1. A read obtains revision 1 and pauses before filling the cache.
2. Another request commits revision 2 at the source.
3. Deleting the cached key succeeds.
4. The paused request fills the cache with revision 1.

Version checks or refresh leases must be explained with their own ownership and
failure limits. The source/cache pair is not one transaction. Strong current reads
may need to bypass the cached value.

Each figure declares any extra workload numbers it needs. Keep rates, latencies,
byte counts and capacity limits labelled as invented unless a recorded native
experiment supplies them. Introduce a second application instance as `App B` when
placement, concurrent fills or local copies require it; the initial instance is
`App A`.

## Planning evidence

All 19 bounded reference parts were read with their END markers: sequences 1–6,
indexes 1–7 and storage 1–6. Rendered captures inspected from the coordinator's
reference preview: sequences figure 5, indexes figure 3 and storage figure 5,
under `/private/tmp/application-caching-references/`. These support a consistent
teaching approach: show the same state as one event or setting changes, label the
work saved, and explain each result beside the drawing.

Primary sources checked for the proposed boundaries:

- [AWS Builders' Library: Caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/): useful reuse, local and external copies, cold starts and protecting dependencies when a cache fails.
- [Redis SET](https://redis.io/docs/latest/commands/set/): the worked store can save a value with an expiry in one command. A command does not synchronise a separate source.
- [Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/): memory limits, eviction choices and the implementation's approximate policies.
- [Redis client-side caching](https://redis.io/docs/latest/develop/reference/client-side-caching/): tracking concerns copies of Redis data held by its clients; it does not automatically track the shop's separate source database.
- [Memcached meta protocol](https://docs.memcached.org/protocols/meta/): refresh ownership and stale serving have implementations beyond Redis, so those decisions belong to the general subject.

The root plan derives seven contextual children from distinct reader decisions.
Their planners should develop any justified further depth. No article count or
historical proposed tree sets the required scope. The root is not a full comparison
of products or a general Redis course; its children preserve the application-cache
role throughout.
