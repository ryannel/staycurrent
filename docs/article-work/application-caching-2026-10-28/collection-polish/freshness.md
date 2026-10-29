# Freshness and conditional-fill polish

## Scope and references

Revised `freshness.astro` and `versioned-fills.astro`; added the eight scene definitions in `stories/freshness.mjs`. The coordinator owns the shared StoryFigure player, integration, rendered review and build. No protocol code, native lab, shared example or other article was changed here.

Read the updated write, figures, continuity and revise skills. Read all fixed references completely using the reference reader: Sequences parts 1–6, Indexes parts 1–7, Storage parts 1–6, with all END markers. Read both assigned articles completely, their coverage briefs, the shared example, approved introduction and bounce helpers, and the previous technical review.

## Repairs

The prose now starts with the mug's changed price and explains the consequences. Removed procedural figure walkthroughs, repeated timing inventories and App A/B naming. Kept the important age-versus-ordering distinction, dependency invalidation, source snapshots, clock assumptions, missing-state rules, recovery history, token limitations, code and native evidence. Redis remains one concrete implementation of the broader mechanism.

The new scenes are one-shot watchable animations with phone-specific layouts, semantic static alternatives and shared Pause/Replay controls:

| Article | Scene | Teaching change |
| --- | --- | --- |
| Freshness | `age` | Two aligned clocks reveal that insertion does not renew the source observation. Three optional cases change fill delay or source lag. |
| Freshness | `race` | A reader and merchant have visible request origins. The old result waits at the reader while commit and deletion happen, then arrives late. |
| Freshness | `dependencies` | A changed price invalidates both a card's value and a filtered list's membership. Lines denote dependencies, explicitly. |
| Freshness | `outbox` | The pending record survives a failed deletion and is completed only after retry succeeds. |
| Freshness | `revisions` | A source revision lookup selects one cached revision; the earlier copy is left unused. |
| Versioned fills | `knowledge` | Stacked, divided comparisons show retained knowledge rejecting a fill and unsafe missing-as-zero accepting it. |
| Versioned fills | `token` | Reuses the race geography; reserving before the read allows deletion to revoke the late fill. |
| Versioned fills | `unheard` | Reuses that same geography with delayed invalidation, exposing the token's actual limit. |

Colours distinguish reader work, edits and revocation. Motion has a cause and a stable end state. No interactions are required to understand any scene. The age variants remain optional because they make a useful controlled comparison.

## Technical evidence

Rechecked primary sources for the mechanisms represented by changed visuals:

- Redis [SET](https://redis.io/docs/latest/commands/set/): conditional reservation and expiration options.
- Redis [Lua scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/): atomic script execution, while the source read remains outside that operation.
- Meta [Cache made consistent](https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/): reordered fill/invalidation and loss of newer-version knowledge on eviction.
- AWS [Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html): recording the source update and pending work in one transaction; retries and repeated delivery.

Retained the earlier technical review and native experiment evidence in `reviews/technical.md`. No native lab results were regenerated or embellished. The figures are illustrative schedules, not executions measured against Redis. Metadata-loss tests remain induced deletion; replica lag remains a source model; neither real eviction load nor failover was measured.

## Checks and limits

- Completed a final whole-article continuity pass in bounded reads.
- `node --check` passes for the new module.
- Swept all eight scenes, all three age variants and 101 times per variant: 1,010 render states, each producing both layouts with no invalid numeric geometry.
- `git diff --check` passes.
- Browser visual checks, accessibility/interaction integration, article linter and build remain with the coordinator. In particular, review the two-row race on phones, age-limit labels in the lag variant, and outbox retry at its intermediate states.

### Rendered-review repair

The coordinator's phone review found source routes crossing Reader server/Server labels and dependency lines crossing their label. Moved the affected server labels above their nodes; raised the held-answer marker to preserve clear space. The transport geometry and matching animation remain unchanged. Removed the redundant Dependencies label (the caption still defines the lines) and started branches below the Database label. Syntax and whitespace checks pass; rendered confirmation remains with the coordinator.
