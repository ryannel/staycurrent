# Versioned cache fills: writer handoff

Draft: `src/articles/application-caching/versioned-fills.astro`; metadata parent
`freshness`, order 35, Deep dive, draft. Figure implementation is confined to
`src/components/application-caching/versioned/`.

## Reference preparation

Read all 19 parts separately with 5,000-token output limits and checked each END
marker: sequences 1–6, indexes 1–7, storage 1–6. Studied the finished screenshots
of Sequence diagrams figure 5, Indexes figure 3 and Storage figure 5 at
`/private/tmp/application-caching-references/`.

The prose follows the references' concrete event, visible outcome, explanation
and changed-condition pattern. Figure 1 replays the same old card under three
rules, changing only the cache's publication decision. Participants stay in
fixed positions; the card travels and the reservation falls away when revoked.
The retained revision can also fall out before the delayed card arrives.

## Continuity pass

Reread the whole piece including caption, controls, events and source notes.
Canonical north/P7/en-GB/GBP, integer 2000→2200, revision 1→2 retained. Key `v1`
remains format, never source revision. Tokens A/B identify attempts; generations
count cache changes. Checkout stays outside the cached-card decision.

The parent supplies freshness and authoritative revision selection. This child
owns conditional publication. Waiting, coalescing and admission remain with
cache-misses. A rejected fill never proves that the saved result is acceptable
for a caller. Each new token requires a new source read, and reservation must
precede that read. Missing/different/ready all reject; no unconditional fallback.
The single-instance proof excludes revived tokens after snapshot restore or
failover. Delayed invalidation and old source snapshots remain explicit failures
of freshness, even when publication is valid.

The raw-product lab stores loading/ready prefixes on the canonical key, extending
the command-only lab convention. It is not a format-compatible modification of
the application's existing adapter envelope. Five seconds is an illustrative
loading cleanup timer; thirty seconds is ready-entry cleanup, not an age proof.

## Evidence and pending coordinator work

`../practice/versioned_lab.py` passed against Redis 8.10.3 using unchanged
`cache_lab.py` ownership helper. See `../evidence/versioned.json` and
`../evidence/versioned.md` for command trace, reproducible invocation and limits.
All consequential claims checked against the primary sources listed there.

No build, dense-prose check or rendered review was run by the writer, as directed
by the coordinator. Shared stepper, data-live readouts, finite transitions,
manual controls, reduced-motion override and text alternative are implemented.
Coordinator still owns desktop/mobile, themes, keyboard/options, dense-prose,
independent review and article inclusion checks. Figure has no h2/h3 inside it.
