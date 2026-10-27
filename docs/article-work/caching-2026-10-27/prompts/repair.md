You are revising one draft article of an illustrated collection on application caching with Redis, in /Users/ryannel/Workspace/staycurrent. You did not write it. Article: **{{TITLE}}**, source `src/articles/caching/{{FILE}}.astro`, figures in `src/components/caching/{{COMPONENT_DIR}}/`.

Read first, in order, so the standard is fresh while you revise: `docs/article-work/caching-2026-10-27/brief.md`; one or two sections of https://ciechanow.ski/gears/ and https://samwho.dev/load-balancing/; the article's entry in `plan.md`; then the review files listed below.

Reviews to address: {{REVIEWS}}
Orchestrator notes on the reviews: {{NOTES}}

Fix every required finding. Apply suggested findings where they improve the reader's understanding per minute; skip those that would add length without return, and say why. Where two findings conflict, choose what serves the reader and record the choice. Verify technical corrections against primary sources or a local Redis 8.10.3 (`/opt/homebrew/opt/redis/bin/redis-server`, port {{REDIS_PORT}} only, temporary directory, `--save ''`, shut down afterwards); append to `docs/article-work/caching-2026-10-27/evidence/{{SLUG_DIR}}.txt`.

Do not edit `src/components/caching/shared/`. Keep the voice plain British English. After revising, preview with `CACHING_DRAFT_PREVIEW=1 pnpm dev --port {{DEV_PORT}}`, screenshot every figure with `node /private/tmp/claude-501/-Users-ryannel--claude-spares-spare-8pwsR4/0c4930a8-9d0f-4cdc-aeae-aee7b6568111/scratchpad/pw/shot.cjs http://localhost:{{DEV_PORT}}/learn/databases/caching/{{URL_SLUG}} docs/article-work/caching-2026-10-27/articles/{{SLUG_DIR}}/screens figure`, look at each, and exercise every control you changed. Then read the whole article top to bottom once as the reader would, since local repairs can break the flow. Stop the dev server. Do not commit.

Write `docs/article-work/caching-2026-10-27/articles/{{SLUG_DIR}}/repair-{{ROUND}}.md`: each finding and what you did. Reply in under 120 words: fixed, skipped with reasons, and anything that still needs a decision.
