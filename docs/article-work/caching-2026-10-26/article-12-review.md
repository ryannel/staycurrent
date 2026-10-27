# Article 12 completion review

27 October 2026. Sole-agent review; no independent reviewer.

## Teaching against the reference standard

Gears and Load Balancing were read and interacted with earlier (plan.md).
This article starts with a concrete copy at each boundary, then follows the same
12 through a source change, Redis deletion, delayed delivery and disconnection.
The source, shared cache and processes retain their visual identity. Prose draws
the distinction between a change and knowledge of that change from those states.
The pending-read comparison makes a late refill visible on the naive side while
the guarded side stays empty; both explicitly return the old response to the
original caller. The lifetime bars share a scale and show why moving an observation
cannot make it younger. The reuse cycle derives its counts from visible processes
and repeated reads; one read per update exposes the no-saving case.

Each figure develops one decision. Connected prose covers why the mechanism works,
its limits, and how the pinned client behaves. All figures are explicit models;
the separate native lab verifies actual protocol/client observations. No promises
of immediate coherence, silent-disconnect detection, current-source truth, automatic
application deadline enforcement, or equal notification/read cost. Industry terms
are used in headings. Manual steps support causal inspection without a timer.

## Evidence and tests

Final native repeat passed all assertions using official Redis8.2.2, Node24.16.0,
node-redis6.3.0. Server GET delta verifies the local hit independently of client
statistics. Dependent GET/STRLEN and missing results invalidate on key changes;
maxEntries retains two results; detected disconnect clears; explicit reconnect
reads21; Redis expiry invalidates a longer-lived local entry. Raw prefix broadcast
receives an unread key separately from the integrated local-cache configuration.
Five-file zip integrity and byte comparison with source pass. Scoped runner owns
its Unix socket, temporary files, processes and signal cleanup. No throughput claim.

55 collection model tests pass. New tests check copy-boundary independence,
disconnect/reconnect clearing, pending-token rejection without rewriting the current
response, carried-deadline limits over varied times, and read conservation/cycle
counts. Earlier 51 tests remain passing.

## Browser review

Phone390px light: all four illustrations inspected. Hierarchy staleB12 after DEL,
detected disconnect clearing and later tracked15 verified. Keyboard Enter advances.
Pending late reply ends naive12/guardedEmpty/currentcaller12. Freshness default75
accepts until85; checkbox caps60 and declines. One read per process yields four
Redis reads with or withoutL1, four invalidations and no local hits. No overflow.
Desktop1280x1000 light/dark: hierarchy, pending comparison, lifetime bars, process
cards and totals inspected. Max fill59/TTL60 still ends60 when enforced. Twelve
processes/twenty reads gives240baseline,12Redisreads,12invalidations,24KiBassumed,
228localhits. Controls work with Home/End; no consoleerrors. Theme-safe colours,
visible keyboard focus, no automatic motion. Existing reduced-motion rule applies.

## Delivery

Build and all13sitecheckrules pass (117checkedpages); 55modeltests pass. Manifest12
available and article11directnextlink included. Exact commit/push/deploy and live
control verification in publication.md. Articles13–14 and referenceapp remain.
