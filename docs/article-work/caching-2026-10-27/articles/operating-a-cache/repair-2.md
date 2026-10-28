# Repair, round 2: Operating a cache

Source: `src/articles/caching/operating-a-cache.astro`. Figures are in `src/components/caching/operating-a-cache/`. Nothing is committed and the shared toolkit was not edited.

New evidence is under "Repair round 2" (R2-1 and R2-2) in `evidence/operating-a-cache.txt`. The scripts are `evidence/operating-a-cache-scripts/acl-round2.sh` and `acl-round2-supplement.sh`. Redis 8.10.3 ran on ports 7111, 7181 (replica), 7182 and 7183 (Sentinels). Every process was shut down and its directory deleted. The dev server on 4421 was stopped.

Checks:

- The model tests pass (8).
- `pnpm check` is clean and `pnpm test` passes (23).
- There is no horizontal overflow at 375 px or 1280 px.
- No console errors.
- Every figure was screenshotted in light and dark, at desktop and phone widths (`screens/`). Control states are in `screens/states/` (`*-r2-*`).

Length: the prose, excluding figure text and sources, is 6,958 words. Before this round it was 6,961, so the article has not grown. Figure 5's figure text is about the same length as before.

## Blocking

| Finding | What I did |
| --- | --- |
| B1 Figure 5 counts client buffers twice | **Subtracted the slice.** `sizing-model.mjs` now exports `CLIENT_SHARE = 0.02`. `chain()` returns `clients` and `dataBytes`, and products = (maxmemory − clients) ÷ 2,130. I verified the reviewer's numbers from the model; the tests below assert them.<br><br>In the figure:<ul><li>The data segment's key is now "cached data", with its amount (850 MB at 1 GB, 15%).</li><li>The client slice shows its own amount and is marked illustrative (20 MB).</li><li>The node readout reads "870 MB maxmemory (850 MB for data)".</li><li>The second row, formerly "maxmemory", is now "Cached data: maxmemory less client buffers".</li><li>The aria label, caption and text alternative say the same.</li></ul>All 15 combinations were exercised; the readouts are logged in my run. The prose now says: 870 MB less about 20 MB leaves 850 MB for about 418,000 products, 81%, 186 queries; 242,000 at the 50% reserve, still about a third more load (186 → 244); 84% of the catalogue at 4 GB, 98% hits. The "about 80" steps (79, 84) and 512 MB at 50% (314, over capacity) are unchanged. New test assertions cover maxmemory, client slice, data, products = floor(data ÷ 2,130), 418,406, 81.4%, 186, 241,969, the one-third rise, 314, 84% and 98%. |
| B2 ACL example locks out admin, breaks replicas and Sentinel, does not persist | Replaced the three `ACL SETUSER` lines with one ACL file deployed to every node and three `redis.conf` lines (`aclfile`, `masteruser`, `masterauth`). The file defines:<ul><li>an `admin` user;</li><li>a `replica` user (`+psync +replconf +ping`);</li><li>a `sentinel` user, with the rule from the redis.io ACL page;</li><li>`shop`;</li><li>`metrics`;</li><li>`user default off`.</li></ul>The prose now says:<ul><li>Disable the default user only once everything has its own user.</li><li>Users are not replicated, which is the coordinator's addition, so the same file must go on every node.</li><li>`masteruser` is set on every node, because any node can become a replica.</li><li>Sentinel uses `sentinel auth-user` and `sentinel auth-pass`.</li><li>`aclfile` can be set only at start-up; change users later by editing the file on every node and running `ACL LOAD`.</li></ul>I tested this exact sequence from fresh servers (R2-1). Results:<ul><li>No connection worked without credentials (NOAUTH).</li><li>`admin` could still run `ACL LIST`, `CONFIG SET` and `CONFIG GET`.</li><li>The replica synchronised as `replica`, and `shop` worked on both nodes.</li><li>Sentinel with `auth-user` saw a healthy primary. A Sentinel without it marked the primary `s_down`.</li><li>After `SENTINEL FAILOVER`, the promoted replica accepted `shop` writes. The old primary rejoined as a replica, using `masteruser`, and received them.</li><li>After a restart, the users were back from the file and the default user was still off.</li><li>`ACL SAVE` on one node changed only that node's file.</li></ul>The supplementary run (R2-2) showed:<ul><li>A replica without `masteruser` stays `master_link_status:down` (NOAUTH).</li><li>`CONFIG SET aclfile` is refused as immutable.</li><li>`ACL LOAD` picks up an edited file.</li><li>`ACL SAVE` without an aclfile errors.</li></ul> |

## Minor

| Finding | What I did |
| --- | --- |
| M1 "almost like no limit" at 300/600 | Rewritten from the model's figures. At 300, about one request in six is served (17 to 18%), against nearly one in three at 60. At 600 almost none are. Both still end when Redis returns. The reviewer's "half" was not quite right: 18% is about 60% of 30%. |
| M2 Why 0.2 s | One sentence added. A fifth of the one-second timeout leaves the rest for other work and for bursts. Allow the whole second, as 300 does, and any other delay misses the deadline. |
| M3 `PING`/`@transaction` | Fixed: `@connection` covers `PING`, and `@transaction` covers `MULTI`/`WATCH`. I confirmed this with `ACL CAT` (R2-1). |
| M4 Key names leak | Added half a sentence. `shop`'s `SCAN` and `RANDOMKEY` returned `other:secret` even though `TYPE` was refused (R2-1). |
| M5 `cluster|shards` | Now "`+cluster|slots` or `+cluster|shards`, whichever it uses". This is backed by the RR1 cluster-node check. |
| M6 metrics and `CLIENT SETINFO` | Added `+client|setinfo` to `metrics`. It returned OK (R2-1). |
| M7 Fork pause | Now "The fork call itself pauses the server for `latest_fork_usec`". |
| M8 Fragmentation gap | Now "between `used_memory` and `used_memory_rss`". |
| M9 Choice label | The label is now "Reserve outside maxmemory", with options "15%: no snapshots or replica", "25%: ElastiCache default" and "50%: snapshots under heavy writes". |
| M10 Trims | Applied, and used to pay for B2:<ul><li>The Valkey bullets are shortened.</li><li>The `FLUSHALL` paragraph is two sentences.</li><li>The pool paragraph is split, with the defaults kept in one clause.</li><li>The TTL paragraph's last sentence is cut.</li></ul>Further small cuts:<ul><li>an unsupported claim in "Failure testing";</li><li>a duplicated link sentence in the opening section;</li><li>the CLUSTER SLOT-STATS/HOTKEYS detail, which the Cluster article owns;</li><li>the SRE "add load slowly" aside;</li><li>a tighter close.</li></ul> |
| M11 Figure 4 axis | The axis title is now "Seconds into the recording, from 150 s". A longer wording clipped at 375 px. |

## Choices recorded

- **B1: subtract the slice, rather than remove it.** Subtracting keeps the figure consistent with the 24 MB lesson.
- **B2: an ACL file, rather than `ACL SETUSER` with `CONFIG REWRITE`.** One file, deployed everywhere, also answers the "users are not replicated" point. `CONFIG REWRITE` would have to be repeated on each node.
- **B2: the Sentinel user goes in the file.** The orchestrator allowed just naming it, but listing it makes the example complete and tested. The line is long; the `<pre>` scrolls and now has `tabindex="0"` and an aria label.
