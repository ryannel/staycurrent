You are writing one article of an illustrated collection on application caching with Redis, for the Astro site at /Users/ryannel/Workspace/staycurrent. Your article: **{{NUMBER}}. {{TITLE}}** (slug `{{SLUG}}`, article file `src/articles/caching/{{FILE}}.astro`, components in `src/components/caching/{{COMPONENT_DIR}}/`).

The reader is an intelligent software engineer who builds applications but has never designed or run a cache. The collection takes them to expert practitioner. Your article will sit beside Bartosz Ciechanowski's Gears and Sam Rose's Load Balancing, and is judged against them.

## Read, in this order, immediately before planning

1. `docs/article-work/caching-2026-10-27/brief.md` — the teaching, voice, figure and accuracy brief. It explains why each practice helps the reader.
2. The full text of https://ciechanow.ski/gears/ and https://samwho.dev/load-balancing/, and use at least three of their demonstrations in a browser (Playwright is available: `require('/private/tmp/claude-501/-Users-ryannel--claude-spares-spare-8pwsR4/0c4930a8-9d0f-4cdc-aeae-aee7b6568111/scratchpad/pw/node_modules/playwright')`). Pay attention to how each demonstration isolates one idea and how the prose tells the reader what to notice. Do not copy their text or artwork.
3. `docs/article-work/caching-2026-10-27/plan.md` — your article's entry is your scope. Read the neighbouring entries too, so you link rather than re-teach what they own.
4. The research dossier `docs/article-work/caching-2026-10-27/research/{{DOSSIER}}` for your article. Treat it as a starting point, not as verified truth: check anything consequential yourself.
5. `src/components/caching/shared/README.md` and the toolkit demonstration at `/learn/databases/caching/toolkit/`, which you build figures with.
{{PUBLISHED_CONTEXT}}

## Work

1. Plan before writing. Write `docs/article-work/caching-2026-10-27/articles/{{SLUG_DIR}}/plan.md`: the reader's starting situation, the sequence of questions the article answers, each figure (what single idea it shows, what the reader manipulates, what they should notice), and where you will stop because further depth would not change a practitioner's decision. Aim for the shortest route that actually gets the reader to expert practice in this subject.
2. Observe real behaviour wherever the article makes claims about what Redis does. Run Redis 8.10.3 (`/opt/homebrew/opt/redis/bin/redis-server`) only on port {{REDIS_PORT}} with a temporary directory and `--save ''`; shut it down when finished. Keep commands and output in `docs/article-work/caching-2026-10-27/evidence/{{SLUG_DIR}}.txt`. Say in the article which numbers are measured and which are illustrative.
3. Build the figures with the shared toolkit. Do not edit `src/components/caching/shared/`; extend locally and report gaps. Pure simulation logic goes in `.mjs` files you can test with node; test it.
4. Write the article. Re-read `brief.md`'s voice section and one section of each reference essay just before you start drafting prose, so the standard is fresh.
5. Preview: `CACHING_DRAFT_PREVIEW=1 pnpm dev --port {{DEV_PORT}}` then open `http://localhost:{{DEV_PORT}}/learn/databases/caching/{{URL_SLUG}}`. Screenshot every figure with `node /private/tmp/claude-501/-Users-ryannel--claude-spares-spare-8pwsR4/0c4930a8-9d0f-4cdc-aeae-aee7b6568111/scratchpad/pw/shot.cjs <url> docs/article-work/caching-2026-10-27/articles/{{SLUG_DIR}}/screens figure` (light, dark, desktop, phone; it reports console errors and overflow). Look at every screenshot. Exercise every control with a Playwright script and confirm each figure shows what the prose says it shows. Fix and repeat. Stop the dev server when done.
6. Read the whole article once more as the reader would, top to bottom, using the figures, and revise. Then re-read the references' openings and compare honestly: would your article sit naturally beside them?
7. Run `pnpm build` only if no other agent is building (check `pgrep -f "astro build"`); otherwise rely on the dev preview. Never edit unrelated files. Do not commit or push.

Write `docs/article-work/caching-2026-10-27/articles/{{SLUG_DIR}}/writer-report.md`: word count, figures, evidence gathered, claims you could not verify, any coverage-map gap or overlap, and toolkit gaps. Reply in under 150 words with the same headlines.
