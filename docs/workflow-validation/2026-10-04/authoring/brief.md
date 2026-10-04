# Commission: the extra work behind an index

Author: authoring_forward_test. Status: drafted for coordinator review. This is a prose-only trial; independent review belongs to the coordinator. No publication is authorised.

Reader: knows tables and SELECT, but not index internals. Question: why can adding an index reduce read work and increase write work?

Outcome: trace a customer lookup through a separate ordered index, then explain why inserting an order creates more work. Transfer case: predict the cost of adding a delivery-date index that the application never uses.

Content job: a focused relational mechanism explanation, 350–550 words. Scope is one ordinary additional ordered index. Exclude tuning recipes, a survey of index types, concurrency, recovery, query-plan diagnosis, and the wider distributed-systems programme. PostgreSQL is a labelled implementation example, not the definition of relational databases.

Example: orders 41 (customer 8, mug), 42 (customer 3, bowl), 43 (customer 8, plate), and 44 (customer 6, cup). Look up all customer 8 orders; both routes return 41 and 43. Insert order 45 (customer 8, spoon); a subsequent lookup must also find 45. References to order numbers in the teaching model identify records, not a universal physical address format.

Supporting visual: one static two-panel diagram, following the index explanation. First panel shows the four full records beside customer entries sorted as 3→42, 6→44, 8→41, 8→43. Trace customer 8 through its two entries to the two unchanged table rows. Second panel adds order 45 and entry 8→45, shading both additions. Keep the table arrangement unchanged so the picture cannot imply that adding an index sorts the table. Caption: “The lookup follows customer entries to full orders. A new order adds information in both places. Links and sizes are schematic.” A code-native figure would keep records and arrows exact while using the house paper and graphite treatment. No controls are needed: the relevant change fits in two still frames. Omit tree branches from this figure and label it a logical view; the prose explains navigation. No diagram produced in this trial.

Delivery: only brief.md, evidence.md, and draft.md in /private/tmp/staycurrent-authoring-trial/. These temporary notes are the authorised equivalent of the repository article-work record. No route, navigation, feed, or website edit. Related available reading is the relational explanation and Explore teaching reference; this assignment does not assess their coverage. Rendering, interaction, build, and theme checks are not applicable to this prose-only delivery.
