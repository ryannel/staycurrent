# Repair decisions · skill trial · d02

Version reviewed: f786105. Reports in this folder. Every d01 finding is confirmed fixed except the rejected and deferred shared-layout items.

| Perspective | a00 | a03 |
| --- | --- | --- |
| Practitioner | pass, 1 optional | 1 required, 3 optional |
| Teaching | pass, 1 optional | 1 required, 1 optional |
| Editorial | pass, 2 optional | 1 required, 6 optional |
| Visual | pass, 1 optional | pass, 2 optional |

Check 7 (placement of additions): teaching found every addition belongs where it was placed. Practitioner agrees the "Choosing a protection" table does not duplicate a18.

## Accepted for one narrow round (d03)

| Findings | Decision |
| --- | --- |
| practitioner-8, teaching-10, editorial-21 (a03) | Accepted, required; raised by three perspectives. Serializable protects a writer only if it runs at Serializable (for example via `default_transaction_isolation` on its role or database) and its refused transactions are retried or rerun. Narrow the row and the closing argument to that; if neither can be arranged, say no row protects the rule and the lock is needed. |
| practitioner-9 (a03) | Accepted and treated as required: the sentence is false. With a matching row present, the second `FOR UPDATE` count waits, then rechecks only its locked rows and overbooks. State what actually happens; add the case to verify.mjs. |
| practitioner-10, teaching-11, editorial-27 (a03) | Accepted. Use a00's names (`stock`, order lines) in the shop paragraph, match a00's listing order or drop the ordering claim, and soften "cannot deadlock" to agree with the deadlock section. |
| editorial-22, editorial-23, visual-17 (a03) | Accepted. One name per protection across the table and Figure 3; one name per Figure 5 option in prose and controls; define "victim" or avoid it; drop a single-option select; text summary includes the deadlock. |
| editorial-24, editorial-25, editorial-26 (a03) | Accepted. Split the predicate paragraph and do not use FOR UPDATE before it is introduced; fix "R8 was back in class 21"; say how an application recognises the retryable 23505/23P01 case. |
| visual-16 (a03) | Accepted. The "Choosing a protection" table must show every column at 375 px (stack or reflow); listing comments not clipped. |
| practitioner-11, teaching-9, editorial-19, visual-15 (a00) | Accepted. "last column" becomes "last row". |
| editorial-20 (a00) | Accepted. Explain "pages" and "replication lag" at first use, or reword. |
| a00 malformed markup | Accepted (noted by teaching and practitioner). Close the paragraph before "PostgreSQL 18 offers …". |
| a00 Sources entries | Writer to confirm: "Index types", "Using EXPLAIN" and the list of the eight articles left Sources during d01. Restore them if dropped by accident. |

## Outside the trial

| Finding | Decision |
| --- | --- |
| practitioner-12 | Deferred to whichever version of a03 is adopted: a18's Figure 4 should then point back to a03's Figure 5 instead of repeating it. |
| teaching-5 leftover, writer's tree proposal | Deferred likewise: a19 names its instructors Mina and Tariq; rename to Lena and Ravi if the trial a03 is adopted. |
| editorial-18 | Deferred, shared layout. |

## Recheck at d03

Practitioner and editorial on a03 and a00; teaching on a03; visual on a03 only for visual-16 and Figure 5's labels.
