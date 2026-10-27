# Repair 1: Cache keys and cached values

Reviews addressed: `review-teaching-1.md` (T) and `review-technical-1.md` (X), with the
orchestrator's notes. Nothing committed. Evidence appended to
`evidence/keys-and-values.txt` (HSETEX re-check and the big-reply `PING` run on Redis
8.10.3, port 7113; model checks). Screens: `screens/` (8 figures, both themes, desktop
and 375 px) and `screens/interact-repair-1/`.

## Shape of the revision

- The article has 8 figures, up from 7. Prose without code is about 5,780 words, about
  the same as the draft, although the revision adds the cross-version invalidation and
  Bloom filter material. The second half now has a figure in every explanatory section
  except formats and "Keeping values small", which are both short.
- Article 7's material is cut to a sentence each, each with a link to `how-redis-works`:
  - `DEL` against `UNLINK`, and the lazy-free settings;
  - `KEYS`;
  - compact hashes and `HIMPORT`;
  - listpack encodings.

## Required findings

| Finding | What I did |
| --- | --- |
| T-R1: wrong `ArticleRef` import | Now imports `shared/ArticleRef.astro`. |
| T-R2 / X-R3: versioned keys need invalidation under every live version | Fixed once, in the versions section. **Figure 4 now has writes:** two product changes a second, each deleting the cached copy, and a fourth option. "A new key; a change deletes its own version" shows about 100 stale reads, up to about 9 a second, lasting until about 44 s. "…deletes both versions" shows zero stale reads, at almost no extra database cost. Changes to the figure: a new stale-reads readout, a stale series on the chart, and a stale ring on instances. Prose covers the overlap and rollback, and links to `invalidation`. The closing bullet and the "habits" paragraph say to delete under every live version. New test in `models.test.mjs`. |
| X-R1: HSETEX rule | Replaced with the verified rule, with no mention of the documentation conflict. HSETEX changes only the fields it names: EX/PX sets their TTL, KEEPTTL keeps it, and neither clears it. The key's TTL and other fields are untouched. Re-observed on 7113. Sources cite `t_hash.c` at 8.10.3. |
| X-R2: "write volatile fields with HSETEX every time" | Now reads: every write of a volatile field must carry its TTL (`HSETEX … EX`, or `HSET` and `HEXPIRE` in one transaction), including the full rebuild. A plain `HSET`, or `HSETEX` without EX, clears the TTL, and the stock then lives as long as the key. HINCRBY keeps it. "Quietly become permanent" is gone. |

## Suggested findings

| Finding | What I did |
| --- | --- |
| T-S1: Figure 2 hides the key | Added a step: a note on the € lane, "key: listing:shoes:popular". Its explanation says it is the pound shopper's key. |
| T-S2: "drag it to zero" | Now "drag it to zero and press Reset". Verified: 100% / 100% after Reset. |
| T-S3: Figure 1 legend | The first two legend entries are drawn as grid cells, filled and dashed. "Deleted, waiting for the next view" is added. |
| T-S4: Figure 4 rings unexplained | Added a legend: hit, miss, stale copy, failed. The caption explains the ring. |
| T-S5: missing-id lookups look like real ones | Missing-id lookups are now hollow grey dots, with their own legend entry. The prose and the text alternative say so. |
| T-S6: Figure 5 duplicate bar | Replaced with two stacked bars, uncompressed and compressed: transfer, then decompression, then **JSON parsing (measured)**. This also gives the "serialisation size versus CPU" idea a figure. On the fast link, parsing outweighs transfer at every size. A local `stackedBars` was added in `draw.mjs`, because the shared toolkit draws single bars only. |
| T-S7: no figure in "Strings or hashes" | New **Figure 6**, `StringOrHash.astro` with the pure `string-hash-model.mjs`. The same product is shown as a string and as a hash, with four operations: page, price, sale, listing of 12. It highlights what moves, and shows the commands, bytes moved and command count. The memory table is gone; its numbers are in the panel headers. The listpack 64/65-byte result stays as a sentence. |
| T-S8: `v1` key in the redis-cli example | Now `listing:shoes:popular:EUR`. |
| T-S9: article 7 material | Cut as listed above. |
| T-S10: zstd dictionaries | One clause in the compression bullets. zstd's README is added to Sources. |
| T-S11: tenant | Added to the list. The data-leak sentence now covers the last three items. |
| T-S12, S13, S14, S15, S17 | All applied. |
| T-S16: overloaded paragraphs | Both split or rewritten. The key-hazards paragraph is now three short paragraphs. The versions paragraph is now four, one idea each. |
| X-S1: large-value stalls are about element count | Now reads "a hash, set, sorted set or list with many elements". |
| X-S2: a big GET hurts through the reply write | Rewritten: the lookup takes about 1 µs, and the reply is written a slice at a time. Another client's `PING` rose from about 0.2 ms to between 1 and 2 ms. I re-ran this on port 7113 (1.35 ms median). The reviewer measured 2.1 ms. |
| X-S3: Valkey lazy-free defaults | **Skipped.** The DEL/UNLINK decision now belongs to article 7, and this article only points there. Flag this for article 7. |
| X-S4: compact hashes and field TTLs do not combine | **Skipped.** Compact hashes are now one sentence pointing to article 7, so the clash no longer arises here. Flag this for article 7. |
| X-S5: "about five times" | Now "up to about five times". |
| X-S6: Rails wording | Now "the mechanism Rails uses for record changes with its separate cache version". |
| X-S7: listpack limit | Now "every field name and value". |
| X-S8: compression also saves Redis's write time | One sentence added after Figure 5. |
| X-S9: `--bigkeys` advice | Now says they can run against a live server, with `-i 0.1` on a busy one. Checked against the redis-cli documentation. |

## Other changes

- **Figure 8 (negative caching) has a third option, "Check a filter of real ids".** It
  turns the Bloom-filter defence against a flood of random missing ids into something
  the reader can watch:
  - Random ids reaching the database: 100% falls to 0.6%.
  - No markers pile up.
  - The prose gives the filter's costs, with a short derivation of about 10 bits per id
    at 1%. It also covers adding new ids, and why a standard filter cannot remove ids.
  - Bloom (1970) is added to Sources. There is a new model test.
- All figure numbers after 5 shift by one.
- Deploy figure numbers have changed because the model now has writes. The text and
  alternatives are updated:
  - strict failures peak at about 30 a second and end at about 50 s;
  - tolerant mode peaks at about 35 database reads a second;
  - versioned mode peaks at about 18.

## For a decision

- The hollow grey dot for a missing-id lookup and the orange miss ring share a shape.
  They differ by colour, lane and direction, and by a legend entry. A reader with
  colour-vision deficiency could still confuse them.
- Other drafts trigger dev-server reloads mid-run, so the stock `shot.cjs` failed with
  "element not attached". I used `scratchpad/pw/kv2-shot.cjs`, which retries. Two
  interaction readouts that a reload reset were re-run, and they match the model tests.
