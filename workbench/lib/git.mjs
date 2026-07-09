// The only two git commits this system ever makes (03-api-design.md, Cut
// mechanics: "cut and log are the only two commands that construct git commits").
// content-core never shells out to git (executeCut/recordNoCut are fs-only) — this
// is the one module in the whole system that does.

import { execFileSync } from 'node:child_process';

/** `git add <addPath> && git commit -m <message>` in `root`. Errors propagate raw
 * — an unexpected git failure is outside this command contract's exit-code ladder
 * and should surface as a loud internal error, not be swallowed. */
export function gitAddCommit(root, addPath, message) {
  execFileSync('git', ['add', addPath], { cwd: root, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', message], { cwd: root, stdio: 'pipe' });
}

/**
 * True iff `git status --porcelain -- <pathspec>` reports anything — staged,
 * unstaged, or untracked. The crash-window probe both committing commands share
 * (change-proposal-1 Addendum): `cut` skips its commit when the landing is
 * already committed (commit landed, cleanup lost), and `log` detects a resolved-
 * but-uncommitted run (resolution applied, commit lost).
 */
export function hasUncommittedChanges(root, pathspec) {
  const out = execFileSync('git', ['status', '--porcelain', '--', pathspec], {
    cwd: root,
    encoding: 'utf8',
  });
  return out.trim().length > 0;
}
