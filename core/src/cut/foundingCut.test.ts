import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTopic } from './createTopic.js';
import { executeCut } from './executeCut.js';
import { runPublishGate } from '../runPublishGate.js';
import { loadTopic } from '../loaders/loadTopic.js';
import { loadVersion } from '../loaders/loadVersion.js';
import { makeTmpRoot } from '../loaders/fixtures.testutil.js';

// The coverage requirement carried from review: close the fixture loop end to end —
// the real producer (createTopic) feeding the real gate (runPublishGate) and the
// real loaders (loadTopic/loadVersion), with no fixture writer standing in for any
// of them. Mirrors what the writer skill (a later slice) will do by hand: author
// the founding TODO list's remaining content, then re-gate to PASS.

describe('founding-cut fixture loop', () => {
  it('takes createTopic\'s skeleton from a failing gate to a passing one, cuts it, and reads it back through the real loaders', () => {
    const root = makeTmpRoot();
    const slug = 'cost-engineering';

    const staged = createTopic(root, slug, { title: 'Cost Engineering' });

    // 1. The freshly seeded skeleton fails the gate — the founding TODO list.
    const firstGate = runPublishGate(staged.dir);
    expect(firstGate.ok).toBe(false);
    expect(firstGate.failures.map((f) => f.check)).toEqual(['provenance-non-empty']);

    // 2. Author the minimal remaining content (the writer skill's job in a later
    // slice) — only the empty provenance the founding skeleton deliberately left.
    fs.writeFileSync(
      path.join(staged.dir, 'versions', 'v1', 'provenance.md'),
      '## Sources\n\n' +
        '- [Cost Engineering 101](https://example.com/cost-eng) — accessed 2026-01-01 — supports: the founding stance\n\n' +
        '## Synthesis\n\n- Magnitude beats optimization for the first 90% of savings.\n'
    );

    // 3. Re-gate: now passes.
    const secondGate = runPublishGate(staged.dir);
    expect(secondGate.ok).toBe(true);
    expect(secondGate.failures).toEqual([]);

    // 4. executeCut moves the staged set into topics/<slug>/.
    const report = executeCut(root, slug, secondGate);
    expect(report.version).toBe(1);
    expect(fs.existsSync(path.join(root, 'topics', slug, 'article.md'))).toBe(true);

    // 5. The real loaders read the cut result back without throwing.
    const topic = loadTopic(root, slug);
    expect(topic.frontmatter.topic).toBe(slug);
    expect(topic.frontmatter.title).toBe('Cost Engineering');
    expect(topic.frontmatter.version).toBe(1);
    expect(topic.frontmatter.status).toBe('current');
    expect(topic.body.html).toContain('Cost Engineering');

    const version = loadVersion(root, slug, 1);
    expect(version.meta.version).toBe(1);
    expect(version.provenance.sources).toHaveLength(1);
    expect(version.provenance.synthesis).toHaveLength(1);
    expect(version.skillDir).toBe(`topics/${slug}/versions/v1/skill`);
  });
});
