// Write-side helpers shared by Cut mechanics (`core/src/cut/`) and Session mechanics
// (`core/src/session/`). The Loading API (`loaders/shared.ts`) only ever reads; this
// module is the write counterpart content-core needs once it starts mutating
// `.staycurrent/staged/` and `topics/` (03-api-design.md, Cut mechanics — "only
// content-core functions mutate topics/").

import fs from 'node:fs';
import path from 'node:path';
import { CORE_SCHEMA, dump } from 'js-yaml';

/** Today's date as an ISO YYYY-MM-DD string (UTC calendar day). */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Writes a frontmatter + body markdown file, serializing `data` through js-yaml's
 * CORE_SCHEMA dumper — the write-side mirror of `loaders/shared.ts`'s CORE_SCHEMA
 * parser, so a value this module writes reads back byte-for-byte the same shape it
 * was given (no timestamp coercion in either direction). `lineWidth: -1` disables
 * folding so a long `stance`/`title` string stays a single plain scalar line rather
 * than wrapping into a YAML block style.
 */
export function writeMatterFile(filePath: string, data: Record<string, unknown>, body: string): void {
  const yamlBlock = dump(data, { schema: CORE_SCHEMA, lineWidth: -1 }).trimEnd();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `---\n${yamlBlock}\n---\n\n${body}`);
}

/**
 * Replaces one top-level `field: value` line inside `raw`'s frontmatter block,
 * leaving every other byte of the file — the rest of the frontmatter, and the
 * entire body — untouched. Used for the single-field stamps Cut/Session mechanics
 * make (`status`, `last_researched`) so a stamp never risks reformatting content a
 * loader or a human authored (03-api-design.md: convene/recordNoCut/discardSession/
 * reconcile all stamp the working tree, never rewrite it wholesale).
 *
 * Callers only ever invoke this after validating the file's frontmatter schema, so
 * `field` is guaranteed present; the two throws below guard a structural bug in that
 * assumption rather than a documented content-validation case.
 */
export function replaceFrontmatterField(raw: string, field: string, value: string): string {
  // CRLF-aware: gray-matter (the read path) accepts CRLF files, so the write path
  // must too — a '---\r' line is a fence, and a replaced line keeps its CR so the
  // file's line-ending convention survives the stamp untouched.
  const lines = raw.split('\n');
  const stripCr = (line: string): string => (line.endsWith('\r') ? line.slice(0, -1) : line);

  if (stripCr(lines[0]) !== '---') {
    throw new Error(`replaceFrontmatterField: '${field}' — file does not start with a frontmatter block`);
  }
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (stripCr(lines[i]) === '---') {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) {
    throw new Error(`replaceFrontmatterField: '${field}' — no closing frontmatter delimiter found`);
  }

  for (let i = 1; i < endIdx; i++) {
    if (stripCr(lines[i]).startsWith(`${field}:`)) {
      const cr = lines[i].endsWith('\r') ? '\r' : '';
      lines[i] = `${field}: ${value}${cr}`;
      return lines.join('\n');
    }
  }
  throw new Error(`replaceFrontmatterField: field '${field}' not found in frontmatter`);
}

/**
 * Inserts one `## <heading>` section at the top of the log — the newest-first,
 * append-only-at-top shape `research-log.md` and `changelog.md` share
 * (04-data-design.md). `bodyLines` become the section's body, one array entry per
 * line, matching the grammar `loadResearchLog`/`loadChangelog` parse back out.
 *
 * Normally the entry lands immediately after the H1 line; a log whose first line is
 * already a `## ` heading (no H1) gets the entry inserted above it — never after,
 * which would silently reattribute the new body to the old entry.
 */
export function prependLogSection(raw: string, heading: string, bodyLines: string[]): string {
  const entry = `${heading}\n\n${bodyLines.join('\n')}\n`;

  const firstEol = raw.indexOf('\n');
  const firstLine = firstEol === -1 ? raw : raw.slice(0, firstEol);
  if (firstLine.trimStart().startsWith('## ')) {
    return `${entry}\n${raw}`;
  }

  const rest = firstEol === -1 ? '' : raw.slice(firstEol + 1).replace(/^\n+/, '');
  return `${firstLine}\n\n${entry}\n${rest}`;
}

/**
 * Builds a directory's contents in a hidden temp sibling, then renames it into
 * place — the atomic-seed rule from change-proposal-1's review: a crash mid-seed
 * leaves only a dot-prefixed temp directory that no slug-addressed path ever
 * resolves to, never a partial `<slug>/` tree that blocks retries or masquerades
 * as an authored draft.
 *
 * Returns true when `finalDir` was created by this call; false when the rename
 * found `finalDir` already present (lost a race — the caller decides whether that
 * is an idempotent success or a conflict). Build errors clean up the temp
 * directory and propagate.
 */
export function buildDirAtomically(finalDir: string, build: (tmpDir: string) => void): boolean {
  const parent = path.dirname(finalDir);
  fs.mkdirSync(parent, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(parent, `.tmp-${path.basename(finalDir)}-`));

  try {
    build(tmpDir);
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw err;
  }

  try {
    fs.renameSync(tmpDir, finalDir);
    return true;
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    // Only a rename refusal counts as "lost the race" — a build error above
    // propagates unconditionally.
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOTEMPTY' || code === 'EEXIST' || code === 'EPERM') return false;
    throw err;
  }
}
