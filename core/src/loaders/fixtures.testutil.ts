import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Creates a fresh tmp dir to use as an instance repo root (contains `topics/`). */
export function makeTmpRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'staycurrent-core-test-'));
}

export interface TopicFixtureOptions {
  topicField?: string;
  title?: string;
  stance?: string;
  version?: number;
  status?: 'current' | 'in-research';
  cadence?: string;
  lastResearched?: string;
  bodyMd?: string;
}

/** Writes topics/<slug>/article.md shaped per 04-data-design.md's frontmatter schema. */
export function writeTopicFixture(root: string, slug: string, opts: TopicFixtureOptions = {}): void {
  const topicDir = path.join(root, 'topics', slug);
  fs.mkdirSync(topicDir, { recursive: true });

  const frontmatter = [
    '---',
    `topic: ${opts.topicField ?? slug}`,
    `title: ${opts.title ?? 'Fixture Topic'}`,
    `stance: "${opts.stance ?? 'A committed one-sentence position for testing purposes.'}"`,
    `version: ${opts.version ?? 1}`,
    `status: ${opts.status ?? 'current'}`,
    `cadence: ${opts.cadence ?? '90d'}`,
    `last_researched: ${opts.lastResearched ?? '2026-01-15'}`,
    '---',
    '',
  ].join('\n');

  const body = opts.bodyMd ?? '# Fixture Topic\n\nStance restated.\n\n## Overview\n\nBody content.\n';
  fs.writeFileSync(path.join(topicDir, 'article.md'), frontmatter + body);
}

export function writeFile(root: string, relPath: string, content: string): void {
  const filePath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}
