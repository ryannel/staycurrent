// `.staycurrent/sessions/<slug>.md` lifecycle — CLI-owned quarantine state:
// the workbench owns this path; content-core never reads or writes it.
// Creation happens at `create`/`convene`; deletion at `log`/`discard`
// and `cut`'s cleanup. No core function ever touches this path — this module is
// the entirety of that ownership.

import fs from 'node:fs';
import { sessionFile, sessionsDir } from './paths.mjs';

/**
 * Writes the session-state frontmatter verbatim per the
 * `.staycurrent/sessions/<slug>.md` schema: `topic`, `phase`, `opened`,
 * `against_version`. The body's `## Findings`/`## Argument`/`## Draft` sections
 * accumulate as the run progresses (written by the research and writer agent
 * skills under `.claude/skills/`, not this CLI) — a freshly opened session
 * starts with no sections at all.
 */
export function writeSessionFile(root, slug, { phase, opened, againstVersion }) {
  fs.mkdirSync(sessionsDir(root), { recursive: true });
  const content =
    '---\n' +
    `topic: ${slug}\n` +
    `phase: ${phase}\n` +
    `opened: ${opened}\n` +
    `against_version: ${againstVersion}\n` +
    '---\n';
  fs.writeFileSync(sessionFile(root, slug), content);
}

export function sessionFileExists(root, slug) {
  try {
    return fs.statSync(sessionFile(root, slug)).isFile();
  } catch {
    return false;
  }
}

export function deleteSessionFile(root, slug) {
  fs.rmSync(sessionFile(root, slug), { force: true });
}
