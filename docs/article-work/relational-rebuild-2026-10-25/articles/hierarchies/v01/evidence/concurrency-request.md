# Native two-session verifier requested

After hierarchy-example.sql and native-checks.sql run successfully in the owned fixture, use two real connections at Read Committed, both SET search_path=hierarchy_lab,public. Baseline parents 10=0,20=0.

1. Unprotected counterexample: BEGIN A/B; both run a recursive UNION-of-ID subtree membership check for their target (A moving10 newparent20; B moving20 newparent10) and observe false before either change. A UPDATE categories parent_id20 WHERE category_id10, B UPDATE categories parent_id10 WHERE category_id20; COMMIT each. Ordinary parent FK/checks permit both updates. Assert parent10=20 and parent20=10. Restore baseline in a fresh transaction; derived caches were intentionally bypassed and must not be consulted for this counterexample.
2. Protected: A BEGIN; SELECT move_tree_node(10,20); leave transaction open. B BEGIN; dispatch SELECT move_tree_node(20,10) asynchronously. Confirm B is waiting on A via explicit backend PID / pg_blocking_pids (bounded wait). A COMMIT. B must error `new parent is inside the moving subtree` then ROLLBACK. Assert topology valid, 10 parent20 and20 parent0, assert_derived succeeds. Record actual PID relation and results, not timing claims. Reverse or repeat not required.

All tests use the supplied function unchanged. Need retain executable native harness plus outputs/version/provenance/cleanup. No user/default target. Root owns fixture and runner.
