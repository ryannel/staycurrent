import type { Tutorial } from '../sql-sandbox-tutorials';

export const postgresqlVersionTutorials: Tutorial[] = [{
 id: 'pg-snapshot-membership',
 title: 'Derive which transactions a snapshot excludes',
 description: 'Change a snapshot’s active list and boundary, then connect that membership decision to two stock versions.',
 articleHref: '/learn/databases/relational/postgresql/row-versions/',
 steps: [
  {
   title: 'Read the three parts of a saved snapshot',
   instruction: 'This lesson uses explicit snapshot values to inspect PostgreSQL’s membership rule. It does not create simultaneous browser connections or reproduce commit timing. The snapshot 784:786:784 means no transaction below 784 was still active at capture, 786 is the upper boundary, and 784 was active between those boundaries. The IDs come from the article’s separate server experiment. Run this read-only query; no table setup is needed.',
   sql: `SELECT pg_snapshot_xmin('784:786:784'::pg_snapshot) AS lower_bound,
       pg_snapshot_xmax('784:786:784'::pg_snapshot) AS upper_bound,
       ARRAY(SELECT pg_snapshot_xip('784:786:784'::pg_snapshot)) AS active_ids;`,
   expected: 'Lower bound 784, upper bound 786, active list {784}. The snapshot records activity when it was captured; it is not updated when those transactions later finish.',
  },
  {
   title: 'Test IDs on each side of the boundary',
   instruction: 'Predict the membership result for each ID. A committed insertion by 783 predates this snapshot. Writer 784 was active at capture. Transaction 785 had already finished, while 786 lies at the upper boundary. The function tests snapshot membership; it does not establish whether an arbitrary transaction actually committed.',
   sql: `SELECT xid,
       pg_visible_in_snapshot(xid::text::xid8, '784:786:784'::pg_snapshot) AS before_snapshot
FROM (VALUES (783), (784), (785), (786)) AS transactions(xid)
ORDER BY xid;`,
   expected: '783: true; 784: false; 785: true; 786: false. An older numeric ID can be excluded while a newer one is included. Allocation order is not commit order.',
  },
  {
   title: 'Apply the decision to two stock versions',
   instruction: 'The invented rows below describe physical versions: the earlier version was created by committed 783 and replaced by 784; the new version was created by 784 and has no replacement. Assume 784 eventually commits. For this bounded example, accept a version only when its creator belongs before the snapshot and its replacement does not. This is a teaching expression, not PostgreSQL’s complete tuple-visibility algorithm: own writes, aborted creators and tuple lock flags need additional handling.',
   sql: `WITH versions(label, available, creator, replacer) AS (
  VALUES ('earlier', 3, 783, 784), ('replacement', 1, 784, NULL)
)
SELECT label, available,
       pg_visible_in_snapshot(creator::text::xid8, '784:786:784'::pg_snapshot)
       AND (replacer IS NULL OR NOT pg_visible_in_snapshot(
         replacer::text::xid8, '784:786:784'::pg_snapshot)) AS selected_by_report
FROM versions ORDER BY available DESC;`,
   expected: 'Earlier version, available 3: true. Replacement, available 1: false. The saved report view excludes both the removal of the earlier version and the creation of its replacement.',
  },
  {
   title: 'Compare the saved view with a later snapshot',
   instruction: 'After 784 commits, imagine a new snapshot 786:786: with an empty active list. Predict both results for 784. The report continues using its old snapshot; taking a later snapshot is a separate action. As a variation, test 786 instead: it is excluded by both snapshots because it is at or beyond their upper boundaries.',
   sql: `SELECT pg_visible_in_snapshot('784'::xid8, '784:786:784'::pg_snapshot) AS saved_report,
       pg_visible_in_snapshot('784'::xid8, '786:786:'::pg_snapshot) AS new_reader;`,
   expected: 'Saved report: false. New reader: true. Substituting 786 gives false for both. To include a committed 786, a later snapshot also needs an upper boundary beyond 786 and must not list it as active. This read-only lesson leaves no transaction open.',
  },
 ],
}];
