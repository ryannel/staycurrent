# Coordinator reading

21 October, approximately 20:34–20:36 UTC. Initial trial-3 articles, commit `80276a4`, rendered at the isolated port 4340 preview. This is my own judgement, informed by the earlier discussion and reports; it is not a blind independent review. Independent reviewers receive no findings from this record.

## Initial observations

The concrete shop example is doing useful teaching. In a00 the joined rows make the doubled totals visible, and the accidentally correct zero balance gives the reader a reason to inspect intermediate results. In a03 the relation `remaining + reservations = capacity` makes the missing owner as important as the counter. These explanations have specific facts and consequences; they should survive any attempt to remove AI-sounding prose.

The initial concurrency article has a strong line through duplicate clicks, a last-place race, conditional change, snapshots and multi-row decisions. The distinction between an ordinary stable view and ownership of a row is necessary. The counted-reservation paragraph makes a difficult assertion about a fresh command after a lock wait without showing the actual before/after sequence beside it. That asks a newcomer to supply the mechanism; a compact schedule would help more than another warning sentence.

Several passages still sound like a model satisfying an editorial checklist:

- a00's first schema caption ends “not additional stock reservations” before reserving stock has been explained. It answers an unstated objection and interrupts the schema lesson.
- a03's savepoint paragraph moves from retaining a failed booking's decrement to sequences and table-definition commands. The exception is technically consequential somewhere, but it arrives without a worked case connecting it to the booking. This is a coherence defect, not simply an objection to caveats.
- “Changing a live database owns that compatibility sequence” and “Recovering database requests safely owns that protocol” express the publication's division of work. The reader needs a useful description of what the destination explains.
- “Keep conditional on a demonstrated need to spread ownership or survive a specified wider failure while working” compresses the subject, continued service and decision into shorthand. Ordinary complete sentences would be easier to act on.
- “application-library value conversions” in a00's evidence table names a concern without making the prototype check understandable.

There is repeated boundary text around every a03 figure: committed state versus pending work; selected schedule; no timing/storage/other requests; model rather than database. The distinction matters. Its current repeated form adds reading cost. A later writing experiment should test whether one shared explanation plus local exceptions preserves the boundary more fluently. This is a hypothesis, not permission to remove material provenance.

Useful contrastive explanations also appear: an aborted transaction versus an unknown commit result, and crash recovery versus an earlier restore. These contrasts explain actual decisions. They should not be mechanically rejected as AI rhetoric because they contain “not” or “rather”.

## Implications for the experiments

Do not define quality as an absence of banned words. Track whether a paragraph gives the reader a concrete fact, an intelligible cause and its consequence, or a useful decision. Watch for caveats attached to satisfy coverage and for noun phrases which require the reader to reconstruct their meaning.

Keep these initial observations out of blind reviewer inputs. Compare later repairs with this record and with the independent findings. I have read the displayed prose of a03 in order and most a00 text; I have not yet independently operated every figure state or completed a technical reproduction. No native behaviour is certified by this reading.

## Repaired version A-r01

Approximately20:53–20:59 UTC, static preview4341. The revised recovery section now names the checks on orders, payments and stock before reopening traffic. It is more intelligible than the original abstract acceptance/gate language. The count-after-wait schedule and observer history add words but explain mechanisms the newcomer otherwise has to supply; cutting their length alone would be a poor optimisation.

I inspected a03 Figure1 at375×812. Its request lanes can be above the viewport while the tables and Next button remain visible. After the first Next, the nearby explanation says that R10 took a place and recorded its owner, and the changed committed rows are visible. That summary is sufficient for this step; distance by itself does not establish a defect. Each step still needs to make its consequential change understandable beside the controls. I reset the viewport after inspection. Shared-origin theme preferences changed during concurrent browser reviews, so my screenshots were observations of the displayed state, not isolated theme tests.

Round2 practitioner found the commissioned sequence/schema-boundary flags absent after repair A07. The original qualification was badly placed; removing it lost required coverage. A good repair must preserve the qualification at a causal point where it helps the reader. This is evidence against treating removal or word reduction alone as a prose improvement. A07 permitted integration or removal but did not explicitly restate the canonical coverage requirement in the repair outcome; both coordinator handoff and reviser scope checking matter.

## B/C repaired reading

Personally read both complete displayed bodies at static4342, including the new engine-contract paragraphs, late testing/recovery sections and root closing navigation. Used plain rendered text to recover the middle section truncated by the long accessibility tree. Earlier figure inspection and the independent current visual receipts remain separate; I did not personally reproduce every control state or native execution here. This is informed coordinator judgement, not a blind editorial report.

The first atomicity argument now continues from the duplicate click through savepoints to constraints without departing for generated numbers or deployment scripts. The retained qualifications follow the named-engine comparison and answer two concrete variations: changing how booking numbers are generated, and mixing a schema command into a deployment transaction. That is a successful change of placement, rather than merely adding a link or deleting the caveat. It preserves the useful technical truth.

The prices example now makes the application-library check intelligible. “Same customer and requested action” continues the uncertain-request example more naturally than “payload matching”. The linked articles now explain procedures rather than “own” them, and the closing reading route is explicitly a first walkthrough. These remove signs of editorial assembly without flattening necessary contrasts: timeout versus rollback, stable view versus ownership, and committed deletion versus recovery are central lessons.

The examples still carry the explanation. The doubled join totals and accidentally correct zero balance, a consumed place without an owner, the post-wait fresh count, and Ravi's changed restart decision each reveal something specific. I find no pervasive stock AI voice or inflated abstraction in this version. Some local reminders and repeated figure boundary text could be smoother, but they do not justify another wholesale rewrite or a wording-only review loop. Independent final reading remains pending at this point; this personal assessment cannot substitute for it.
