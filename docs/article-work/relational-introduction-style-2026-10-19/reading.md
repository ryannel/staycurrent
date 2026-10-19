# Reader review

Reviewed 19 October 2026. I read RL76 as an intelligent reader new to relational databases, then compared it with the supplied Sequence diagrams, Indexes, and Storage and durability articles. Those three supplied articles were the only style references. I read the article source and the two figures, and operated Figure 2 in the rendered page: two statements followed by commit, two followed by rollback, and one followed by commit.

The introduction gives me a useful model. I can explain why a booking carries a customer identifier, how the join returns Ada’s name, why the purchase needs two changes, and why an offline desktop application and several application servers lead to different database choices. The opening teaches the subject before asking me to choose a product. The prose mostly moves at the reference articles’ pace, and the later worksheet gives the selection advice something I could actually do.

Three small teaching gaps remain.

## 1. Switching from commit to rollback can look like undoing a commit

At RL76 line 57, the instruction is to complete both statements, choose Commit, inspect the result, and then choose Roll back. Doing this changes the displayed stored state from one place with an order back to two places without one. The controls let me switch freely between those outcomes.

I can read that sequence as “rollback undoes the commit I just made”. Line 55 says that commit makes changes permanent, but the action I have just performed appears to contradict it. Nothing beside the control says that I am comparing alternative endings of the same request. This matters more than terminology: a reader who thinks a committed order can still be rolled back has the wrong model of a transaction.

Say before the figure that these are alternative endings, each starting from the original state, and that rollback cannot undo a transaction already committed. The display can stay as it is. In the reference articles, changing a figure’s setting is framed as changing one condition of the example; the model’s relationship to the run is clear.

## 2. The first picture never identifies its cards as rows

Figure 1, at line 21, shows three cards named customers, bookings and sessions. Each card contains one record, with field names running vertically. The text calls them tables and later calls the middle one a card. As a newcomer, I have to infer that the card is one row from a larger table rather than the table itself.

The opening has introduced rows and columns, so this is the point where I expect to see what those words mean. Add a sentence such as “Each card shows one row from its table; the labels are its columns.” A table drawing would also work, but is not necessary to fix this gap. The caption’s instruction to read from the booking outwards is otherwise clear, and the following query walks the same matches successfully.

The reference figures are careful about this mapping: Indexes identifies its invented table, rows and pages before counting them; Storage says which slots stand in for the real buffer pool. RL76 needs the same small statement of what its marks stand for.

## 3. The conditional update needs one worked pair of buyers

Lines 63–78 introduce two buyers who might both read one remaining place, then replace that pattern with a conditional UPDATE. I understand the application’s branch on the affected-row count. I cannot yet explain why two overlapping UPDATEs do not both pass the same condition. The article has changed the code but has not followed the two buyers through the changed behaviour.

One short worked passage would close this: start with one place, let the first purchase successfully change it to zero and commit, then show that the other purchase cannot also take that place and must fail or retry. Keep the exact waiting or retry behaviour qualified by the engine and isolation choice. The linked isolation article can supply those details; this introduction only needs to establish that checking and taking the place form one protected database operation.

This is the largest difference from the reference articles’ teaching. Their repairs are followed through: the included index column still needs a visibility check, the log survives where the dirty page did not, and the worker changes when Mina gets her reply. Here a single before-and-after outcome would make the repair equally understandable.

## Later sections

The architecture sections are less visual than the references, but I did not find a further comprehension failure that requires another figure. The deployment table makes the embedded/server distinction explicit, and the regional section names both the survival requirement and its communication cost. A topology figure could help, but adding one is an editorial choice rather than a reader blocker.

I would keep the current structure. The three local repairs above would make the introduction’s figures and the concurrency example carry their full meaning without turning it into a longer mechanism article.

## Recheck after repair

Rechecked the updated article on 19 October 2026. All three findings are resolved.

The instruction before Figure 2 now calls commit and rollback alternative endings, states that each starts from the original state, and explicitly says that rollback cannot undo a committed transaction. That resolves the misleading sequence without changing the model.

The paragraph before Figure 1 now identifies each card as one row and its labels as columns. I can map the opening vocabulary to the picture without guessing.

The new two-buyer passage follows the first update from one place to zero, the second buyer’s wait, and its condition being checked after the first commit. Naming PostgreSQL’s default isolation level gives the worked behaviour a clear setting. The next paragraph allows other engines to return a retry error while keeping the same requirement: the second purchase cannot take the place already sold. I can now explain why the conditional update repairs the earlier read/read race.

These additions fit the surrounding explanation. They supply the missing steps and do not require a broader rewrite. No further reader finding remains from this review.
