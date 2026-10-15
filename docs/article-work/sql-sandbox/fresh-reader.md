# SQL sandbox: independent reader review

Reviewed on 15 October 2026 at `http://127.0.0.1:4322/learn/databases/relational/sandbox/`, for an engineer comfortable with application code but with little database practice. I read the review skill, its first-reading guidance and the context-free voice reference. I received no author rationale or other review findings.

This is an independent source and browser review, not a fully blind sequential reading: I read `sandbox.astro` and `sql-sandbox-tutorials.ts` together before opening the rendered page. That exposed expected answers before their optional disclosures. I then ran every supplied step of all four tutorials in Chromium, starting each tutorial from a fresh page load, and inspected a full-page desktop screenshot at a 1280-pixel viewport. I did not test a human novice or mobile layout. The preview already labels Start as creating a fresh database and says that completed runs do not grade edited SQL.

The page supports its core practice outcome. I can send SQL, inspect records, watch an accepted and rejected update, commit a complete purchase, and recover a failed transaction. No material conceptual blocker appeared on the supplied paths. The following observations distinguish understandable results from the additional knowledge needed to adapt the examples.

## Reading observations

1. The opening establishes the useful contract immediately: SQL goes in; rows, command results or errors come back. The browser-tab lifetime warning makes experiments feel bounded. The picker describes an actual outcome for each tutorial. I know that choosing another tutorial starts again rather than continuing my purchase.

2. The query tutorial builds an understandable chain. Product IDs appear before the join, and the join supplies the names the earlier result lacked. The distinction between the agreed line price and the current catalogue price survives the calculation. The suggested O12 variation gives a concrete reason to change the query. I can predict O13's €44 total from the preceding two lines.

3. The first displayed result also introduces the unexplained tag `SELECT 2`. Later responses use `UPDATE 1` and `INSERT 0 1`. I supplied PostgreSQL command-tag knowledge to interpret these. A beginner can infer the SELECT count from the table, but the INSERT response is the only visible success evidence for the two writes and its zero is potentially misleading. The expected-answer disclosure says both inserts succeed but does not decode the response. Add a short human-readable statement count beside the raw tag, or a nearby explanation that two `INSERT 0 1` responses mean two successful inserts of one row each. Recheck whether a reader can identify success without first opening the expected answer.

4. The constraints tutorial explicitly says the historical line edit is a constraint experiment rather than a whole checkout. That avoids teaching an incomplete stock workflow by accident. The invalid update is introduced as a deliberate error before it runs. The final read of quantity 3 gives direct evidence of what survived; readers need not accept the prose on trust.

5. The general editor note explains batches and transaction boundaries before the checkout exercise. Its position is useful, though the note asks a beginner to absorb several rules at once. The guided paths then demonstrate the important distinction: a rejected standalone update leaves no transaction open, whereas a failure after BEGIN leaves a failed transaction. The visible status badge agrees with both cases.

6. Checkout begins with a query containing three parenthesised SELECTs, `count(*)`, and aliases. The prose explains the three returned numbers but does not explain how this unfamiliar query obtains them. I can follow the experiment using the supplied query; adapting it requires knowledge I supplied myself. A sentence such as “Each inner SELECT produces one value; the names after AS label the three result columns” would reduce that gap. Explaining why the counts restrict themselves to O14 would make it easier to inspect another attempted purchase. This is a guidance improvement, not a blocker to completing the provided checkout.

7. “Run it once” and “Continue only after the reservation returned one row” make the application decision explicit. The zero-row rollback advice is initially inside What to look for, but the next step repeats the condition in visible prose. A reader who uses the disclosed answer understands that a successful SQL command can still fail to reserve anything. Keep that distinction if the guide is shortened.

8. The rollback tutorial clearly separates the intentionally failed line from the intentionally refused read. “It is not evidence that the stock row is missing” prevents a plausible wrong interpretation. Taking the place of the catch block connects the SQL sequence to familiar application structure. The instruction not to add mugs back gives the failure exercise a practical consequence.

9. The final checkout asks me to compare with the beginning, but the five-run history has already dropped the initial inspection by run 6. The expected answer and earlier instruction retain the numbers, so the comparison remains possible. A small starting-versus-current comparison would remove the need to recall or reopen them; retaining a special baseline is optional, not necessary for correctness.

## Rendered interaction

The separation between loading and executing is clear in the button labels and the repeated note. The transaction badge makes persistent state visible beside the editor. Responses retain their run number and the submitted SQL in a disclosure, so an edited query can be traced back to its actual command.

The layout creates substantial vertical travel. In the desktop screenshot of checkout step 3, the guide and next-step button are above the editor, while the response is well below the Run button and schema disclosure. The large picker remains above the guide. Comparing the instruction, returned row and next step requires scrolling across several screen regions. This does not make the database semantics wrong, but it makes the central learning loop harder to sustain. A compact active-session picker, a next-step control near the newest response, or a more compact guide/editor arrangement would help. Preserve the explicit distinction between loading and running if controls move.

## Observed outcomes

All supplied steps completed with the stated results. The query tutorial returned the two products, two order lines, their names, and a total of 44.00. The constraints path changed quantity to 3, received SQLSTATE 23514 for zero, and still read 3. Checkout moved from `(3, 0, 0)` to `(1, 1, 1)` and left no transaction open after COMMIT. Rollback produced 23514, then 25P02 for the deliberate read in the failed transaction, then returned to `(3, 0, 0)` after ROLLBACK. The badge changed from open to failed to no transaction in the expected places.

Ready as a draft from this reader perspective. The command-tag explanation is the most useful small repair because it clarifies the database's actual acknowledgement. The inspection-query explanation and shorter distance between guide and responses would improve independent exploration. These findings do not assess concurrency, performance, or publication readiness.
