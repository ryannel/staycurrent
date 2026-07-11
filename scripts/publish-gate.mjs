#!/usr/bin/env node
// scripts/publish-gate.mjs — CI's full-tree publish gate (04-publish-workflow.md;
// 02-data-flows.md's Publish Flow (CI); 03-api-design.md § Versioning &
// Compatibility: "CI calls runPublishGate directly against each committed
// topics/<slug>/ in its own workflow step ... the same code path the `gate`
// and `cut` commands use — ADR 0003").
//
// Plain Node ESM, no framework — a thin invocation, never a re-implementation
// of gate logic in workflow YAML. Runs the identical `runPublishGate` content-
// core exports (the same function workbench/cli.mjs's `gate`/`cut` commands
// call) against EVERY topics/<slug>/ directory in the tree, not just what a
// push touched — the repository, not the operator's machine, is the trust
// boundary (04-publish-workflow.md's Scope). `runPublishGate` never throws
// for a content violation (only for a nonexistent `dir`), so a malformed
// topic surfaces as GateFailure entries here, never an uncaught exception.
//
// Exit 0, one summary line, when every topic passes every check. Exit 1,
// listing every failing topic + check + message, when any topic fails any
// check — a gate failure must name every offending artifact across the
// whole tree in one run, not stop at the first.
//
// Fails closed on a vacuous tree, same doctrine as the site's getTopicSlugs:
// a `topics/` directory absent at the resolved root exits non-zero naming
// the root (a mis-resolved root — e.g. a bad STAYCURRENT_REPO_ROOT or a
// checkout gone wrong — must never silently green-light a deploy). A
// `topics/` directory that exists but yields zero gateable topic
// directories also exits non-zero: this repository always carries at least
// one topic, so an empty topics/ can only mean a broken checkout or a
// scaffold-only state the site cannot build from anyway
// (change-proposal-4) — never a legitimate "nothing to gate" no-op.

import fs from 'node:fs';
import path from 'node:path';
import { runPublishGate } from '../core/dist/index.js';

const root = process.env.STAYCURRENT_REPO_ROOT
  ? path.resolve(process.env.STAYCURRENT_REPO_ROOT)
  : process.cwd();
const topicsDir = path.join(root, 'topics');

/**
 * Every directory directly under topics/ — mirrors listTopics' own directory
 * enumeration (symlinks resolved via stat, so a symlinked topic is never
 * silently skipped), deliberately NOT listTopics itself: listTopics excludes
 * a topic whose frontmatter fails to parse, reporting it as a sweep error
 * instead — exactly the kind of hand-edited, un-gated commit this full-tree
 * gate exists to catch (04-publish-workflow.md: "a hand-edited commit that
 * never went through `workbench/cli.mjs cut` must still be caught here").
 * runPublishGate's own frontmatter-schema check (one of the ten) is what
 * catches it, so every directory under topics/ must reach runPublishGate,
 * not just the ones listTopics considered well-formed.
 */
function listTopicSlugs(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return entries
    .filter((entry) => {
      if (entry.isDirectory()) return true;
      if (entry.isSymbolicLink()) {
        try {
          return fs.statSync(path.join(dir, entry.name)).isDirectory();
        } catch {
          return false;
        }
      }
      return false;
    })
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

/** True when `dir` exists and is a directory (symlinks resolved via stat). */
function isExistingDirectory(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

function main() {
  if (!isExistingDirectory(topicsDir)) {
    console.error(
      `publish-gate: topics/ not found at resolved root ${root} — refusing to green-light a deploy.`
    );
    return 1;
  }

  const slugs = listTopicSlugs(topicsDir);

  if (slugs.length === 0) {
    console.error(
      `publish-gate: topics/ exists at ${topicsDir} but contains no topic directories — refusing to green-light a deploy.`
    );
    return 1;
  }

  const failLines = [];

  for (const slug of slugs) {
    const dir = path.join(topicsDir, slug);
    const result = runPublishGate(dir);
    if (!result.ok) {
      for (const failure of result.failures) {
        failLines.push(`FAIL ${slug} ${failure.check} (${failure.path}): ${failure.message}`);
      }
    }
  }

  if (failLines.length > 0) {
    console.error(
      `publish-gate: ${failLines.length} failure(s) across ${slugs.length} topic(s):`
    );
    for (const line of failLines) console.error(line);
    return 1;
  }

  console.log(`publish-gate: PASS — ${slugs.length} topic(s), all ten checks green.`);
  return 0;
}

process.exit(main());
