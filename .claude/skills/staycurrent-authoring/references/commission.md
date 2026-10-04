# A brief another agent can execute

Use whichever of these questions helps an author understand the job. A brief is
context for judgement, not a form to complete or a predetermined article outline.
Keep it short enough that the central reader need stays visible.

- **Reader and question:** starting knowledge, why they arrived, and the bounded
  question the article answers.
- **Outcome:** what they should be able to explain, predict, diagnose, choose, or do.
  A slightly different case can help reveal whether the idea transfers.
- **Content job and scope:** field orientation, family introduction, explanation,
  practical work, comparison, product depth, or current assessment. Name tempting
  adjacent topics that belong elsewhere.
- **Example and evidence:** the scenario or dataset, important invariants, claims
  requiring research, product/version boundaries, and commands to reproduce if any.
- **Supporting media:** where the reader needs to see a relationship or vary an
  input. Describe the intended meaning, not merely “add a diagram.” Include initial
  state, meaningful changes, expected results, and simplifications for a model.
- **Place and delivery:** planned destination, related available reading, owned
  files, draft status, and any constraints from the user's request.

An overbroad brief says: “Write the definitive PostgreSQL article: architecture,
reads, writes, transactions, replication, performance, operations, alternatives,
and an interactive demo.” It offers no way to finish a coherent explanation.

A bounded brief says: “Explain why a long-running PostgreSQL transaction can delay
reclaiming old row versions. The reader knows SQL transactions but not MVCC. Follow
one row through an update and overlapping readers, then connect visibility to
cleanup. Verify engine-specific behaviour. Leave replication and a tuning manual
out. A reader should predict what changes when the older reader finishes.”

A comparison brief might ask: “Help a team compare Microsoft SQL Server, MySQL, and
PostgreSQL for a transactional application. Establish the workload, operating
environment, existing skills, and constraints before selecting dimensions. Explain
where a difference changes the decision and where evidence is insufficient. Separate
engine, edition, extensions, and hosting.” If the commission is a general market
orientation, show several contrasting situations rather than inventing a universal
winner or demanding a specific user's workload.

A practical brief names an observable result: “Reproduce two concurrent updates,
inspect the blocking, and explain the outcome.” Record the environment and actual
commands/results. An unrun example can be included as illustrative, but it cannot
pass as a verified practical exercise.

The brief and evidence stay out of the blind comprehension review. Ask that reviewer
to infer what the finished page teaches; compare their reading with the brief only
after their independent response.
