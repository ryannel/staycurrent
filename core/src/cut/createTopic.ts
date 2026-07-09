import fs from 'node:fs';
import path from 'node:path';
import type { CreateTopicOptions, StagedCut } from '../types.js';
import { ContentValidationError } from '../errors.js';
import { assertValidSlug } from '../slug.js';
import { buildDirAtomically, todayIso, writeMatterFile } from '../write.js';

const FOUNDING_STANCE_STUB = 'Stance pending — authored during the founding research run.';
const FOUNDING_BODY_STUB = 'Content pending — authored during the founding research run.';
const FOUNDING_CHANGELOG_STUB =
  'The founding note: initial stance and what this topic covers — pending the founding research run.';

function buildSkillMd(slug: string, articleVersion: number): string {
  return (
    '---\n' +
    `name: ${slug}\n` +
    'description: >\n' +
    '  Routing triggers pending — authored during the founding research run.\n' +
    `article_version: ${articleVersion}\n` +
    '---\n\n' +
    `# ${slug} Skill\n\n` +
    'Stance callout pending — mirrors the article once authored.\n'
  );
}

/** Writes the complete founding skeleton into `dir` (a temp dir, renamed into place after). */
function writeFoundingSkeleton(dir: string, slug: string, title: string, today: string): void {
  const skillMd = buildSkillMd(slug, 1);

  writeMatterFile(
    path.join(dir, 'article.md'),
    {
      topic: slug,
      title,
      stance: FOUNDING_STANCE_STUB,
      version: 1,
      status: 'current',
      cadence: '90d',
      last_researched: today,
    },
    `# ${title}\n\n${FOUNDING_STANCE_STUB}\n\n## Overview\n\n${FOUNDING_BODY_STUB}\n`
  );

  fs.writeFileSync(
    path.join(dir, 'changelog.md'),
    `# ${title} — Changelog\n\n## v1 — ${today}\n\n${FOUNDING_CHANGELOG_STUB}\n`
  );
  fs.writeFileSync(path.join(dir, 'research-log.md'), `# ${title} — Research Log\n\n`);

  fs.mkdirSync(path.join(dir, 'skill', 'references'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'skill', 'SKILL.md'), skillMd);

  writeMatterFile(
    path.join(dir, 'versions', 'v1', 'article.md'),
    { version: 1, cut: today },
    `# ${title}\n\n${FOUNDING_BODY_STUB}\n`
  );
  fs.mkdirSync(path.join(dir, 'versions', 'v1', 'skill', 'references'), { recursive: true });
  // Byte-identical to the live skill/SKILL.md — the freshly seeded skeleton must
  // not itself trip gate check 5 (skill-byte-identical).
  fs.writeFileSync(path.join(dir, 'versions', 'v1', 'skill', 'SKILL.md'), skillMd);
  fs.writeFileSync(path.join(dir, 'versions', 'v1', 'provenance.md'), '## Sources\n\n## Synthesis\n\n');
}

/**
 * Seeds `.staycurrent/staged/<slug>/` with the founding topic skeleton, so the
 * founding v1 goes through the same `cut` gate as any later version
 * (03-api-design.md, `createTopic`). The skeleton is the complete gate-shaped tree,
 * stub content throughout — it deliberately fails `runPublishGate` (empty
 * provenance, check 6, at minimum) so `gate <slug>` doubles as the founding run's
 * TODO list from the first minute.
 *
 * Seeding is atomic: the skeleton is built in a temp sibling and renamed into
 * place, so a crash mid-seed never leaves a partial staged tree that blocks a
 * retry (change-proposal-1 review patch).
 */
export function createTopic(root: string, slug: string, opts: CreateTopicOptions): StagedCut {
  assertValidSlug(slug);

  const topicDir = path.join(root, 'topics', slug);
  if (fs.existsSync(topicDir)) {
    throw new ContentValidationError(slug, `topics/${slug}`, [
      `a topic already exists at topics/${slug}`,
    ]);
  }

  const stagedDir = path.join(root, '.staycurrent', 'staged', slug);
  const alreadyStaged = (): ContentValidationError =>
    new ContentValidationError(slug, `.staycurrent/staged/${slug}`, [
      `a staged tree already exists at .staycurrent/staged/${slug}`,
    ]);
  if (fs.existsSync(stagedDir)) throw alreadyStaged();

  const today = todayIso();
  const created = buildDirAtomically(stagedDir, (tmpDir) =>
    writeFoundingSkeleton(tmpDir, slug, opts.title, today)
  );
  if (!created) throw alreadyStaged();

  return { dir: stagedDir, topic: slug, version: 1 };
}
