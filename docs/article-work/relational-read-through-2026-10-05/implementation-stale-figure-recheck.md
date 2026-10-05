# Isolated reading of the stale-object figure

I read only `src/components/explainers/design/JsonStaleWrite.astro` and the supplied independent-reader voice reference. I treated the intended reader as an engineer beginning relational databases.

The example begins with P7 containing material ceramic and finish gloss. Both editors read that object before either change. A changes finish to matte and commits, leaving the stored object with ceramic and matte. B still holds the earlier ceramic-and-gloss copy. B changes material in that copy to stoneware and submits the entire stoneware-and-gloss object. B commits after A, leaving the stored object with stoneware and gloss.

I understood that B intended to change material, but its submitted object also carried the old finish value. Replacing the whole stored object therefore removed A's matte finish. The order of the writes does not prevent this: B writes after A has released the row lock, and the figure explicitly says the lock does not substitute the newer finish into the object B supplies. The caption also makes clear that this schedule has no overlapping writes and no waiting writer.

The alternative uses `jsonb_set(attributes, '{material}', '"stoneware"'::jsonb)`. I read its first argument as the attributes column of the row being updated. It reads the current stored object, which already contains A's matte finish, rather than B's saved copy. It changes material alone, so the final object contains stoneware and matte. The figure states both which object the expression uses and which field it preserves; I did not need to infer either from knowledge of PostgreSQL.

I did not supply outside knowledge to explain the outcome. I would need additional teaching to explain Read Committed generally or the wider rules for row locking, but neither is needed to follow the explicitly ordered events here. The SQL fragment is not a complete update statement; its role in this example is still clear from the accompanying explanation.

No material comprehension issue found. The figure gives the initial values, both editors' copies and changes, the submitted replacement, the reason the finish changes back, and the object used by the alternative.
