# Application caching: shared example

Agreed with the coordinator, 28 October 2026. These are invented teaching facts,
not measurements of a running service. Redis is the worked implementation of an
application cache; the general principles apply to other suitable implementations.

## The shop and its source

The application serves product cards for shop `north`. Its authoritative database
holds product `P7`, a blue mug priced at **GBP 20.00**. Use integer
`price_pence: 2000` in code and `revision: 1`. A later committed update changes the
price to **GBP 22.00**, with `price_pence: 2200` and `revision: 2`.

A cached product card contains the display name and display price. Checkout reads
the authoritative source within its normal transaction and stock checks. Reading
the source alone does not reserve stock. The cached card
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

For derived-answer invalidation, a north-shop query lists products priced below
GBP 21.00. P7 belongs to the result at revision 1 and leaves at revision 2. The
query and product card are separate cached answers affected by the same update.

The application adapter uses this envelope (the command-only lab stores the raw
product object to keep its command trace small):

```json
{"schema":1,"context":{"shop":"north","id":"P7","locale":"en-GB","currency":"GBP"},"kind":"product","product":{"id":"P7","name":"Blue mug","price_pence":2000,"currency":"GBP","revision":1}}
```

An absent P99 uses the corresponding context and `kind: "not-found"`, with no
`product`. Adapter examples use a labelled five-second negative TTL alongside
the thirty-second positive TTL. Both are illustrative settings. Any per-process
request limits, source limits, client pool size and time budgets are local
example choices, not measurements of a production fleet's capacity.

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
experiment supplies them. Label the requesting browser `App` and the backend process `Server`. When
placement requires two backend processes, use `Server A` and `Server B`. The
introductory placement comparison adds a load balancer: it routes the first
request to A and the next to B, with each reply returning to the app. Both request
the same unchanged product. This routing order is an illustrative scenario,
not a promise about every load-balancing policy.

Figure 1 follows one P7 request through a miss, source read, fill and reply,
then stops. Figure 2 introduces north's products P8 and P9; no extra prices or
product attributes are needed there. P7 is coral, P8 purple, and P9 teal, with
the key printed on each request.
Figure 2 sends the same key-and-server trace through local and shared arrangements.
Each completed fill precedes that key's next request. Each local process learns
all three keys (six total misses); the shared cache learns them once (three).
No updates, expiry, eviction or concurrent same-key cold fills occur in this
placement scenario. After warming, all subsequent requests hit in both layouts.

