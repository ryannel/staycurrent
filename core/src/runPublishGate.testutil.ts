import fs from 'node:fs';
import path from 'node:path';

/** ISO YYYY-MM-DD `days` before today (UTC), for deterministic-enough fixture dates. */
export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export interface GateFixtureOptions {
  n?: number; // the version this call seeds under versions/vN/; default 1
  version?: number; // live article.md frontmatter `version`; default = n
  stance?: string; // live article.md frontmatter `stance`; default a valid one-sentence stance
  cadence?: string; // default '90d'
  lastResearched?: string; // default 10 days ago
  omitLastResearched?: boolean; // drop the last_researched line entirely
  topicField?: string; // live article.md frontmatter `topic`; default = slug
  changelogHeading?: string; // '## vX — {date}' template; default matches n
  cutDate?: string; // versions/vN/article.md `cut`; default 30 days ago
  omitVersionArtifact?: 'article' | 'provenance'; // omits one artifact from versions/vN/
  emptyProvenance?: boolean;
}

/**
 * Writes a topic-shaped directory at `dir` (basename must be the intended slug),
 * complete and gate-passing by default. Each option deliberately breaks (or seeds
 * further state for) exactly the one check its test targets.
 */
export function writeGateFixture(dir: string, slug: string, opts: GateFixtureOptions = {}): void {
  const n = opts.n ?? 1;
  const cutDate = opts.cutDate ?? isoDaysAgo(30);
  const lastResearched = opts.lastResearched ?? isoDaysAgo(10);
  const version = opts.version ?? n;
  const topicField = opts.topicField ?? slug;
  const stance = opts.stance ?? 'A committed one-sentence position for gate testing.';
  const cadence = opts.cadence ?? '90d';

  fs.mkdirSync(dir, { recursive: true });

  const article = [
    '---',
    `topic: ${topicField}`,
    'title: Fixture Topic',
    `stance: "${stance}"`,
    `version: ${version}`,
    'status: current',
    `cadence: ${cadence}`,
    ...(opts.omitLastResearched ? [] : [`last_researched: ${lastResearched}`]),
    '---',
    '',
    '# Fixture Topic',
    '',
    'A committed one-sentence position for gate testing.',
    '',
    '## Overview',
    '',
    'Body content.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'article.md'), article);

  const headingTemplate = opts.changelogHeading ?? `## v${n} — {date}`;
  const heading = headingTemplate.replace('{date}', cutDate);
  const changelog = [
    '# Fixture Topic — Changelog',
    '',
    heading,
    '',
    'The founding note: initial stance and what this topic covers.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'changelog.md'), changelog);

  const versionsDir = path.join(dir, 'versions', `v${n}`);
  fs.mkdirSync(versionsDir, { recursive: true });

  if (opts.omitVersionArtifact !== 'article') {
    fs.writeFileSync(
      path.join(versionsDir, 'article.md'),
      `---\nversion: ${n}\ncut: ${cutDate}\n---\n\n# Fixture Topic\n\nFrozen body.\n`
    );
  }

  if (opts.omitVersionArtifact !== 'provenance') {
    const provenance = opts.emptyProvenance
      ? '## Sources\n\n## Synthesis\n\n'
      : '## Sources\n\n' +
        `- [Example Source](https://example.com/fixture) — accessed ${cutDate} — supports: the fixture's claim\n\n` +
        '## Synthesis\n\n' +
        '- A synthesized claim stated plainly.\n';
    fs.writeFileSync(path.join(versionsDir, 'provenance.md'), provenance);
  }
}
