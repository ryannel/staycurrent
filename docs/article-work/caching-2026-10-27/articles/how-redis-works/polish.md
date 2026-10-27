# How Redis works: polish pass, 2026-10-28

## Changes

- Figure 1 (`eventloop-model.mjs`): `rates()` now counts only live clients and measures over whole event-loop turns. Before, it counted requests from clients the slider had removed and could cut a batch in half. Node results: 1 client 9,300 req/s at 7% busy; 14 clients about 129,900 (shown as 130,000) at 100%; 40 clients 133,200 at 100%.
- Figure 1 slider starts at 1 client; the readout waits 4 s of model time before showing rates.
- Nine other review items applied in the article and figure files (ScanFigure and label edits included).
- Valkey lazy-free: already covered; sharpened to name `lazyfree-lazy-user-del`, and Valkey `src/config.c` added to Sources.
- Hash-field expiry: was missing. Added a paragraph and the Redis `src/t_hash.c` source. Verified against that source and a local run (see `evidence/how-redis-works.txt`, "Polish 2026-10-28"): `listpack` 42 bytes to `listpackex` 80 bytes for a three-field hash after `HEXPIRE`.

## Checks

- `node --test models.test.mjs` in the figure folder: 11 of 11 pass. `pnpm test`: 23 of 23 pass.
- Preview on port 4427 with `CACHING_DRAFT_PREVIEW=1` (the entry is `planned`, so the route 404s without it).
- Figure 1 stepped in the page: 1 client 9,300 and 7%; 6 clients 56,000 and 43%; 14 clients 130,000 and 100%; 40 clients 130,000, 100% and 115.6 µs wait.
- Mobile 375 px: no horizontal overflow, all nine figures 343 px wide, Figures 1 and 3 screenshotted and working.
- Console: no script errors. The 404s logged were from two wrong URLs I tried before finding the route.
- Dev server stopped; port 4427 free.

## Open

- At 375 px the "100% busy" label in Figure 1 touches the queue boxes beside the Redis box. Cosmetic.
- `pnpm build` passes (site check all ok).
- Nothing committed.
