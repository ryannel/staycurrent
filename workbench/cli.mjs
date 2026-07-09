#!/usr/bin/env node
// workbench/cli.mjs — the operator's real front door onto the milestone's
// capabilities (03-api-design.md, "workbench/cli.mjs — command contract";
// 01-ui-design.md, "Surface: workbench"; crash-window amendments per
// change-proposal-1's Addendum). Plain Node ESM, no framework: argument parsing,
// the `.staycurrent/sessions/` lifecycle, output formatting, and the two git
// commits this system ever makes (`cut(<slug>): v<N>`, `log(<slug>): no-cut`).
// Only content-core functions mutate `topics/`; this file never writes there
// directly — it is CLI plumbing around createTopic/stageCut/executeCut/convene/
// recordNoCut/discardSession/reconcile/runPublishGate.

import fs from 'node:fs';
import path from 'node:path';
import * as core from '../core/dist/index.js';
import {
  isValidSlugShape,
  topicDir,
  stagedDir as stagedDirPath,
} from './lib/paths.mjs';
import {
  dirExists,
  listFilesRel,
  listTopicDirSlugs,
  treesByteIdentical,
  readArticleVersion,
  readFrontmatterField,
  parseTopResearchLogEntry,
} from './lib/fsTree.mjs';
import { renderStateBlock, renderHaltTemplate } from './lib/format.mjs';
import { gitAddCommit, hasUncommittedChanges } from './lib/git.mjs';
import { writeSessionFile, sessionFileExists, deleteSessionFile } from './lib/session.mjs';

const root = process.cwd();

function out(line) {
  process.stdout.write(`${line}\n`);
}
function errLine(line) {
  process.stderr.write(`${line}\n`);
}
function outJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** A malformed invocation — wrong flags, missing values, stray positionals.
 * Caught by the dispatcher: one stderr line, exit 2. No misparse ever reaches a
 * core call or a commit (change-proposal-1 Addendum review patch). */
class UsageError extends Error {}

/** Plain one-liner usage/state error (exit 2 by default) — 03-api-design.md:
 * "Missing or malformed arguments exit 2 for every command." */
function usageError(message, code = 2) {
  errLine(message);
  process.exitCode = code;
}

/** Serialized typed-error shape for --json failure output (amended 03:
 * `{ error: 'ContentValidationError', topic, file, issues }`). */
function serializeError(e) {
  if (e instanceof core.ContentValidationError) {
    return { error: 'ContentValidationError', topic: e.topic, file: e.file, issues: e.issues };
  }
  if (e instanceof core.ContentNotFoundError) {
    return { error: 'ContentNotFoundError', topic: e.topic, path: e.path };
  }
  return { error: e.name ?? 'Error', message: e.message };
}

// ---------------------------------------------------------------------------
// Argument parsing — seven fixed commands, hand-rolled (slice scope: "plain Node
// ESM, no dependencies beyond node builtins + core"). A flag value that is
// missing or itself flag-shaped is a UsageError, never a silent misparse.
// ---------------------------------------------------------------------------

function takeFlagValue(args, idx, name) {
  const value = args[idx + 1];
  if (value === undefined || value.startsWith('--')) {
    throw new UsageError(`${name} requires a value`);
  }
  args.splice(idx, 2);
  return value;
}

function extractFlag(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return takeFlagValue(args, idx, name);
}

function extractRepeatable(args, name) {
  const values = [];
  let idx;
  // eslint-disable-next-line no-cond-assign
  while ((idx = args.indexOf(name)) !== -1) {
    values.push(takeFlagValue(args, idx, name));
  }
  return values;
}

function extractBooleanFlag(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return false;
  args.splice(idx, 1);
  return true;
}

/** After flag extraction, only the expected positionals may remain. */
function expectPositionals(args, count, usage) {
  if (args.length !== count) throw new UsageError(`usage: ${usage}`);
}

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

function cmdStatus(args) {
  const json = extractBooleanFlag(args, '--json');
  expectPositionals(args, 0, 'status [--json]');

  // The CLI probes `.staycurrent/sessions/` itself and supplies the facts —
  // core never reads that path (03-api-design.md, `reconcile`). Reconciliation
  // runs per-slug so one malformed topic aborts only its own reconcile, never
  // the sweep: its `malformed <slug>: …` line comes from listTopics' errors and
  // every valid row still prints (one broken directory never blinds the
  // catalogue).
  const reverted = [];
  for (const slug of listTopicDirSlugs(root)) {
    try {
      const report = core.reconcile(root, slug, { sessionExists: sessionFileExists(root, slug) });
      reverted.push(...report.reverted);
    } catch (e) {
      if (e instanceof core.ContentValidationError || e instanceof core.ContentNotFoundError) {
        continue; // reported by the sweep below
      }
      throw e;
    }
  }

  const sweep = core.listTopics(root);

  if (json) {
    outJson({ reverted, topics: sweep.topics, errors: sweep.errors });
  } else {
    for (const slug of reverted) {
      out(`reconciled ${slug}: in-research had no session file — status reverted to current`);
    }
    if (sweep.topics.length === 0 && sweep.errors.length === 0) {
      out('No topics.');
    } else {
      for (const line of renderStateBlock(sweep.topics)) out(line);
    }
    for (const e of sweep.errors) out(`malformed ${e.slug}: ${e.message}`);
  }

  process.exitCode = sweep.errors.length > 0 ? 1 : 0;
}

// ---------------------------------------------------------------------------
// create <slug> --title <t>
// ---------------------------------------------------------------------------

function cmdCreate(args) {
  const json = extractBooleanFlag(args, '--json');
  const title = extractFlag(args, '--title');
  if (title === undefined) throw new UsageError('usage: create <slug> --title <title>');
  expectPositionals(args, 1, 'create <slug> --title <title>');
  const slug = args[0];

  if (!isValidSlugShape(slug)) {
    return usageError(`'${slug}' is not a valid slug — must be kebab-case, at most 3 words`);
  }

  let staged;
  try {
    staged = core.createTopic(root, slug, { title });
  } catch (e) {
    if (e instanceof core.ContentValidationError) {
      return usageError(e.issues.join('; '));
    }
    throw e;
  }

  // Session-file creation is CLI-layer (03-api-design.md, `create`): against_version
  // is 0 for a founding run — no published version exists yet to research against.
  writeSessionFile(root, slug, { phase: 'researching', opened: todayIso(), againstVersion: 0 });

  if (json) {
    outJson(staged);
  } else {
    out(
      `Created staged topic ${slug} — draft at .staycurrent/staged/${slug}/. ` +
        `Session: .staycurrent/sessions/${slug}.md`
    );
  }
  process.exitCode = 0;
}

// ---------------------------------------------------------------------------
// convene <slug>
// ---------------------------------------------------------------------------

function cmdConvene(args) {
  const json = extractBooleanFlag(args, '--json');
  expectPositionals(args, 1, 'convene <slug>');
  const slug = args[0];
  if (!isValidSlugShape(slug)) return usageError(`'${slug}' is not a valid slug`);

  let result;
  try {
    result = core.convene(root, slug);
  } catch (e) {
    if (e instanceof core.ContentNotFoundError) {
      return usageError(`unknown slug '${slug}'`);
    }
    if (e instanceof core.ContentValidationError) {
      return usageError(e.issues.join('; '));
    }
    throw e;
  }

  writeSessionFile(root, slug, {
    phase: 'researching',
    opened: todayIso(),
    againstVersion: result.againstVersion,
  });

  if (json) {
    outJson(result);
  } else {
    out(
      `Convened ${slug} against v${result.againstVersion} — in-research. ` +
        `Session: .staycurrent/sessions/${slug}.md`
    );
  }
  process.exitCode = 0;
}

// ---------------------------------------------------------------------------
// gate <slug>
// ---------------------------------------------------------------------------

function cmdGate(args) {
  const json = extractBooleanFlag(args, '--json');
  expectPositionals(args, 1, 'gate <slug>');
  const slug = args[0];
  if (!isValidSlugShape(slug)) return usageError(`'${slug}' is not a valid slug`);

  const dir = stagedDirPath(root, slug);
  if (!dirExists(dir)) {
    return usageError(`nothing staged for '${slug}' — run \`create\` or \`convene\` first`);
  }

  const result = core.runPublishGate(dir);

  if (json) {
    outJson(result);
    process.exitCode = result.ok ? 0 : 1;
    return;
  }

  if (result.ok) {
    const n = readArticleVersion(path.join(dir, 'article.md'));
    out(`PASS ${slug} v${n}`);
    process.exitCode = 0;
  } else {
    for (const f of result.failures) out(`FAIL ${f.check}: ${f.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// cut <slug>
// ---------------------------------------------------------------------------

function cmdCut(args) {
  const json = extractBooleanFlag(args, '--json');
  expectPositionals(args, 1, 'cut <slug>');
  const slug = args[0];
  if (!isValidSlugShape(slug)) return usageError(`'${slug}' is not a valid slug`);

  const staged = stagedDirPath(root, slug);
  const topics = topicDir(root, slug);
  const stagedPresent = dirExists(staged);
  const topicsPresent = dirExists(topics);

  if (!stagedPresent && !topicsPresent) {
    return usageError(`unknown slug '${slug}' — no staged tree and no topics/${slug}/`);
  }

  const commitMessage = (n) => `cut(${slug}): v${n}`;

  const finishSuccess = (report) => {
    // Sibling crash window (change-proposal-1 Addendum): when the landing is
    // already committed (commit landed, cleanup lost) there is nothing to
    // commit — skip the commit and fall through to cleanup, rather than dying
    // on git's nothing-to-commit error. Both re-entry halves now recover.
    if (hasUncommittedChanges(root, `topics/${slug}/`)) {
      gitAddCommit(root, `topics/${slug}/`, commitMessage(report.version));
    }
    if (dirExists(staged)) fs.rmSync(staged, { recursive: true, force: true });
    if (sessionFileExists(root, slug)) deleteSessionFile(root, slug);

    if (json) {
      outJson(report);
    } else {
      out(`Cut v${report.version} — article, skill, changelog entry, provenance; RSS follows at site build.`);
      for (const p of report.paths) out(p);
      out(commitMessage(report.version));
    }
    process.exitCode = 0;
  };

  // Only `cut` renders the halt template (03-api-design.md, binding rules). `cause`
  // and any `extraFailures` are built directly from GateFailure's `check` +
  // `message`, never a paraphrase — the same rule `gate`'s FAIL lines follow.
  const failHalt = ({ blocked, cause, state, action, failures = [] }, jsonValue) => {
    if (json) {
      outJson(jsonValue);
    } else {
      out(renderHaltTemplate({ blocked, cause, state, action, extraFailures: failures.slice(1) }));
    }
    process.exitCode = 1;
  };

  if (stagedPresent) {
    const gateResult = core.runPublishGate(staged);

    if (!gateResult.ok) {
      const first = gateResult.failures[0];
      failHalt(
        {
          blocked: `cut ${slug} failed the publish gate.`,
          cause: `${first.check}: ${first.message}`,
          state: `staged set intact at .staycurrent/staged/${slug}/; topics/ untouched`,
          action: `resolve the failing check(s) below, then re-run \`cut ${slug}\`.`,
          failures: gateResult.failures,
        },
        gateResult
      );
      return;
    }

    if (topicsPresent && treesByteIdentical(staged, topics)) {
      // Converged re-entry (03-api-design.md, `cut` Behaviour): a crash landed the
      // fs sync but the git commit was lost. Skip executeCut — its monotonicity
      // check would rightly refuse a same-version landing — and go straight to
      // the commit + cleanup (finishSuccess also covers the other crash half,
      // where the commit landed and only the cleanup was lost).
      const version = readArticleVersion(path.join(staged, 'article.md'));
      finishSuccess({
        topic: slug,
        version,
        paths: listFilesRel(staged).map((rel) => `topics/${slug}/${rel}`),
        removed: [],
      });
      return;
    }

    let report;
    try {
      report = core.executeCut(root, slug, gateResult);
    } catch (e) {
      if (e instanceof core.ContentValidationError) {
        // Zero-authoring cut: gate passed but the staged version does not exceed
        // the live version. `topics/` was never touched — executeCut throws before
        // its first write. --json prints the serialized typed error (amended 03).
        failHalt(
          {
            blocked: `cut ${slug} would not advance the version.`,
            cause: e.issues.join('; '),
            state: `staged set intact at .staycurrent/staged/${slug}/; topics/ untouched`,
            action: 'author new content into the staged tree before cutting, or discard the run.',
          },
          serializeError(e)
        );
        return;
      }
      throw e;
    }
    finishSuccess(report);
    return;
  }

  // No staged tree — topicsPresent must be true (the both-false case exited above).
  const gateResult = core.runPublishGate(topics);
  if (gateResult.ok) {
    const n = readArticleVersion(path.join(topics, 'article.md'));
    if (json) {
      // The degenerate CutReport (amended 03): nothing written, nothing removed.
      outJson({ topic: slug, version: n, paths: [], removed: [] });
    } else {
      out(`Nothing to cut — v${n} is complete.`);
    }
    process.exitCode = 0;
    return;
  }

  const first = gateResult.failures[0];
  failHalt(
    {
      blocked: `the committed topic ${slug} fails its own publish gate.`,
      cause: `${first.check}: ${first.message}`,
      state: `no staged tree at .staycurrent/staged/${slug}/; topics/${slug}/ holds the broken tree`,
      action: `repair topics/${slug}/ (see failing checks below), then re-run \`cut ${slug}\`.`,
      failures: gateResult.failures,
    },
    gateResult
  );
}

// ---------------------------------------------------------------------------
// log <slug> --line <text>… [--date <iso>]
// ---------------------------------------------------------------------------

function cmdLog(args) {
  const json = extractBooleanFlag(args, '--json');
  const lines = extractRepeatable(args, '--line');
  const date = extractFlag(args, '--date');
  expectPositionals(args, 1, 'log <slug> --line <text>… [--date <iso>]');
  const slug = args[0];
  if (!isValidSlugShape(slug)) return usageError(`'${slug}' is not a valid slug`);

  // Checked by the CLI before any core call — it owns the session files
  // (03-api-design.md, `log` Exit codes).
  if (!sessionFileExists(root, slug)) {
    return usageError(`no open session for '${slug}'`);
  }

  const finishSuccess = (entry) => {
    deleteSessionFile(root, slug);
    const staged = stagedDirPath(root, slug);
    if (dirExists(staged)) fs.rmSync(staged, { recursive: true, force: true });

    if (json) {
      outJson(entry);
    } else {
      out(`Logged no-cut for ${slug} — last_researched ${entry.date}. Commit: log(${slug}): no-cut`);
    }
    process.exitCode = 0;
  };

  // Converged re-entry (amended 03): a crash between recordNoCut's filesystem
  // writes and the git commit leaves the resolution applied but uncommitted —
  // status already `current`, the session file still present, uncommitted
  // changes under topics/<slug>/. Skip recordNoCut (it would rightly refuse a
  // non-in-research topic) and proceed straight to the commit and cleanup.
  const articlePath = path.join(topicDir(root, slug), 'article.md');
  const liveStatus = readFrontmatterField(articlePath, 'status');
  if (liveStatus === 'current' && hasUncommittedChanges(root, `topics/${slug}/`)) {
    gitAddCommit(root, `topics/${slug}/`, `log(${slug}): no-cut`);
    const applied = parseTopResearchLogEntry(path.join(topicDir(root, slug), 'research-log.md'));
    finishSuccess(
      applied ?? {
        date: readFrontmatterField(articlePath, 'last_researched') ?? todayIso(),
        outcome: 'no-cut',
        lines: [],
      }
    );
    return;
  }

  const lastResearched = date || todayIso();

  let entry;
  try {
    entry = core.recordNoCut(root, slug, { lastResearched, researchLogLines: lines });
  } catch (e) {
    if (e instanceof core.ContentValidationError || e instanceof core.ContentNotFoundError) {
      if (json) {
        outJson(serializeError(e));
      } else {
        errLine(e.message);
      }
      process.exitCode = 1;
      return;
    }
    throw e;
  }

  gitAddCommit(root, `topics/${slug}/`, `log(${slug}): no-cut`);
  finishSuccess(entry);
}

// ---------------------------------------------------------------------------
// discard <slug>
// ---------------------------------------------------------------------------

function cmdDiscard(args) {
  const json = extractBooleanFlag(args, '--json');
  expectPositionals(args, 1, 'discard <slug>');
  const slug = args[0];
  if (!isValidSlugShape(slug)) return usageError(`'${slug}' is not a valid slug`);

  const sessionExisted = sessionFileExists(root, slug);
  const staged = stagedDirPath(root, slug);
  const stagedExisted = dirExists(staged);
  const topics = topicDir(root, slug);
  const topicsPresent = dirExists(topics);

  let reverted = false;
  if (topicsPresent) {
    try {
      core.discardSession(root, slug);
      reverted = true;
    } catch (e) {
      if (e instanceof core.ContentValidationError) {
        // status wasn't in-research — nothing to revert here; fall through.
      } else if (e instanceof core.ContentNotFoundError) {
        // Race: topic vanished between the dirExists check and the call.
      } else {
        throw e;
      }
    }
  }
  // A staged-only founding draft (no topics/ entry) skips the core call entirely
  // — there is no stamp to revert (03-api-design.md, `discard` Design rationale).

  // Exit 2 only when none of the three exist: no session file, no in-research
  // stamp, and no staged tree (amended 03 — an orphaned staged tree is
  // discardable).
  if (!sessionExisted && !stagedExisted && !reverted) {
    return usageError(`nothing to discard for '${slug}'`);
  }

  if (sessionExisted) deleteSessionFile(root, slug);
  if (stagedExisted) fs.rmSync(staged, { recursive: true, force: true });

  if (json) {
    outJson({ topic: slug, discarded: true });
  } else if (reverted || !topicsPresent) {
    // The contract's verbatim response — fully true when a stamp was reverted;
    // for a staged-only draft (nothing published exists) the claim is vacuous
    // and the line is the founding-draft case's specified response.
    out(`Discarded session for ${slug} — status reverted to current. Nothing published changed.`);
  } else {
    // A published topic whose status was already current: never claim a revert
    // that did not happen (change-proposal-1 Addendum review).
    out(`Discarded session for ${slug} — nothing published changed.`);
  }
  process.exitCode = 0;
}

// ---------------------------------------------------------------------------
// dispatch
// ---------------------------------------------------------------------------

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const rest = argv.slice(1);

  const commands = {
    status: cmdStatus,
    create: cmdCreate,
    convene: cmdConvene,
    gate: cmdGate,
    cut: cmdCut,
    log: cmdLog,
    discard: cmdDiscard,
  };

  const handler = commands[command];
  if (!handler) {
    errLine(
      `unknown command '${command ?? ''}' — usage: status | create <slug> --title <t> | ` +
        `convene <slug> | gate <slug> | cut <slug> | log <slug> --line <text>… | discard <slug>`
    );
    process.exitCode = 2;
    return;
  }

  handler(rest);
}

try {
  main();
} catch (e) {
  if (e instanceof UsageError) {
    errLine(e.message);
    process.exitCode = 2;
  } else {
    errLine(`internal error: ${e && e.message ? e.message : String(e)}`);
    process.exitCode = 1;
  }
}
