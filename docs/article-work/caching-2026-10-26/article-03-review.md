# Article 3 — Cache expiration and eviction

Completed 26 October 2026. Sole-agent writing and review, not independent review.

## Technical evidence

Read Redis SET, EXPIRE, TTL and GETEX documentation, eviction reference, and the
pinned 8.2.2 redis.conf memory-policy and LFU sections. Exact links in article.
Latest documentation includes LRM policies absent from this pinned baseline;
they are not included in the article's policy discussion.

Executed final expiration-and-eviction.sh on official Redis 8.2.2. Assertions
confirm GET and SET KEEPTTL preserve PEXPIRETIME, plain SET removes TTL, GETEX
sets a new lifetime, expired TTL returns -2, and EXISTS returns 0. Under measured
baseline plus 256 KiB maxmemory, 100 writes with 600-second TTLs produced 51
observed evictions and zero expirations. Counts are observations, not universal
outcomes. noeviction and volatile-lru with no eligible keys rejected new SETs
while preserving the existing readable key. Output in evidence directory.
The worksheet only creates/removes its own network-isolated disposable container.

Three new model tests establish fixed versus sliding freshness, the working-set
capacity threshold, policy-dependent outcomes, resident capacity/uniqueness,
and byte admission displacing multiple keys. Exact LRU and non-decaying resident
LFU are labelled teaching models, explicitly different from Redis approximations.

## Teaching judgement against references

The price stays the stable object while one timing choice changes. A time scrubber
shows both increasing source-observation age and renewed expiry. This follows the
Gears progression of manipulating one cause while retaining familiar geometry.
The loading-delay figure makes a hidden timing assumption visible before replicas
and layered caches complicate the prose. The stacked lengths use a fixed scale.

The eviction trace follows the Load Balancing approach of replaying a workload
under changed resource/selection decisions. A short scan and a lasting demand
shift challenge both recency and frequency. The byte diagram then removes the
equal-size assumption and demonstrates why an admission decision matters before
a victim-ranking decision. All central arguments can be followed in figures;
prose develops their limitations and practical command/configuration choices.

The article avoids a list of tuning recommendations: it develops a freshness
contract, working-set evidence and admission costs. Native examples distinguish
expiry, eviction and rejected fills. It deliberately defers concurrent refill
races, source failure and detailed Redis memory accounting to their articles.

## Browser verification

Desktop dark/light and 390×844 light screenshots inspected. All four figures fit;
phone document width equals viewport width (390). Request tiles, selectors and
buttons wrap; copy/source states remain side by side; capacity widths stay in
proportion. Explicit labels work for all selects and ranges. No console errors.

- Fixed TTL 6, time 24: 5 reads/4 hits, current £15.
- Sliding TTL 6, time 24: 1 read/8 hits, saved £12, loaded 24 seconds ago,
  deadline at 30; source £15. Keyboard End controls time.
- Loading delay keyboard End: 12 + 6 = 18 seconds, with matching bar lengths.
- Hot-pair trace, capacity 2: LRU 4 hits/6 reads, model LFU 5 hits/5 reads.
- Three-key cycle: capacity 2 gives 0 hits/9 reads; capacity 3 gives 6 hits/3 reads.
- Capacity 4 layout reviewed on phone; Back/Reset and option changes work.
- Byte trace: admission gives 0 hits/7 reads; bypass gives 3 hits/4 reads.
  Back to request 4 explicitly shows A and B displaced, C occupying 2 units and
  L occupying 6. Next/reset verified on phone.
- Future request outcomes are concealed until reached. No automatic animation;
  TTL bar transition respects the shared reduced-motion rule.

Final verification: pnpm build passed all 13 site-check rules; all eleven
collection model tests passed; git diff --check passed.
