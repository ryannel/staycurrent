# Relational rewrite: reviewable draft checkpoint

19 October 2026. The commissioned 54 articles are written under
`src/drafts/relational/`: 31 family/distributed investigations, 13 PostgreSQL
and ten CockroachDB. This checkpoint saves the articles, practical worksheets,
observations and independent reviews. Final review reconciliation and rendered
checks are still being sealed; status remains drafting.

## Open the review build

From the repository root:

```sh
RELATIONAL_DRAFT_PREVIEW=1 pnpm dev --host 127.0.0.1 --port 4323
```

Open <http://127.0.0.1:4323/review/relational/>. The directory offers task paths
with explicit implementation choices, then the complete shelf. The environment
flag is required. A normal `pnpm build` emits none of these review routes;
existing published articles and navigation remain the live reading.

## Follow the work

- `commission.md` and `briefs/` record scope and expert-ability breakdowns.
- `registry.json` lists all 54 source and preview paths.
- `evidence/` retains actual SQL, commands, replies and version/scope notes.
- `lab/` holds disposable native cluster worksheets and reproduction notes.
- `review/` preserves uncued readings, technical/editorial repairs and the
  independent assembled-collection audit, including the original findings.

The coverage map remains `docs/coverage/relational.md`. Writing exposed a missing
native index-lifecycle home; RL119 now owns it. No extra page was required.
The shared distributed-systems programme and full FD04/05/06 teaching remain
planned rather than available destinations.

Publication is separate from saving these drafts. The retained observations
cover bounded native experiments, not production capacity, independent-region
latency, host power loss or arbitrary extension/client compatibility.
