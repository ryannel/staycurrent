# Choosing a cache and naming its answers

Scope: `cache-benefits.astro`, `cache-keys.astro` and the new `stories/choice.mjs` scene module. Existing benefits/keys components are no longer imported by these two articles; they were left intact to avoid unrelated cleanup.

## Reference and continuity pass

Read the current write, figures, continuity and revise skills. Completed every bounded reference read through `scripts/read-writing-reference.py`: sequences parts 1–6, indexes 1–7 and storage 1–6, with each END marker present. Read both assigned articles in full, their coverage briefs and the shared example/design context. The parent owns rendered reference calibration and integrated browser checks.

The prose now explains decisions and consequences rather than reciting the diagram: reuse survives only while a copy is usable; a lower mean can coexist with unchanged slow misses; separate expiries can make prices appear to go backwards; a key preserves answer identity rather than request identity. Ordinary discussion uses the mug or product rather than a series of product codes. Actual key strings, encodings and runnable envelopes retain their necessary identifiers. Redis remains one concrete store among others.

The example contract is unchanged. The eight-request reuse trace still produces three cold misses and five hits. The request names in its drawing are mug, spoon and bowl, and its colours carry identity rather than server roles. The placement close-up retains A filling at 0 s, B at 10 s, a source update at 20 s and A refilling at 31 s, with a 30-second expiry from fill. These are illustrative schedules, not measured execution. No new source products or implementation assumptions were added to the shared example.

## Visual changes

Nine scenes replace the old controls and diagrams:

- `work`: three aligned pipelines reveal which source and assembly work disappears when saving a record or a finished answer.
- `reuse`: a short sequence of differently coloured requests warms an initially empty cache. App, Server, Cache and Database retain their roles; source reads and fills pass through the server.
- `cost`: short latency bars and ordered request dots distinguish mean and p95. Optional controls change hit count or source cost; the baseline teaches itself without input.
- `placement`: a close-up of the copies and expiry times makes the local/shared distinction without repeating an entire network diagram.
- `anatomy`: the parts of the key settle into clearly labelled fields.
- `encoding`: an ambiguous join becomes visible; a single optional contrast shows the field-preserving representation.
- `permission`: permitted and denied requests meet the same server check; a cache reply travels back through the server.
- `versions`: separate panels distinguish a source revision from a representation change.
- `outcomes`: alternative product, absence and failure results make clear which outcomes this adapter saves.

All scenes return desktop and portrait SVG layouts and finish in a meaningful state. Their animation timing belongs to the shared one-shot player. The module uses publication theme tokens, line drawings and purposeful coloured motion. Captions state necessary model limits rather than restating all objects.

## Technical checks and sources

Consequential role/identity claims were checked against primary documentation:

- [Azure cache-aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside): the application checks the cache, reads the source on a miss and fills the cache; local copies need not agree.
- [Redis keys and values](https://redis.io/docs/latest/develop/using-commands/keyspace/): binary-safe keys and application naming conventions.
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259): arrays and escaped string fields preserve the represented values; canonical bytes still require an agreed encoding convention.
- [OWASP authorisation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): permission must be checked on each request.

Preserved the existing primary citations, formulas, key constructor, envelopes, failure distinctions and operational caveats. No new benchmark or production-performance claim is made.

A deterministic Node sweep rendered every scene, optional variant and seven timeline points in both layouts; none produced NaN, Infinity or undefined. Assertions checked the eight-request trace (3 misses/5 hits), normal mean/p95 (6.6/25 ms), nineteen-hit mean/p95 (3.15/2 ms), and cheap-source mean/p95 (3/7 ms). Scoped `git diff --check` passed.

Build, rendered visual inspection, reduced-motion/control behaviour and prose lint are the parent's integration checks; this worker did not run independent builds or browser sessions.
