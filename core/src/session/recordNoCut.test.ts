import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { recordNoCut } from './recordNoCut.js';
import { writeCompleteTopic } from '../cut/topicFixtures.testutil.js';
import { loadResearchLog } from '../loaders/loadResearchLog.js';
import { loadTopic } from '../loaders/loadTopic.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { makeTmpRoot, writeTopicFixture } from '../loaders/fixtures.testutil.js';

describe('recordNoCut', () => {
  it('reverts status to current, bumps last_researched, and returns the ResearchLogEntry with no version field', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');
    // writeGateFixture has no status option — stamp it in-research directly.
    const articlePath = path.join(root, 'topics', 'databases', 'article.md');
    fs.writeFileSync(
      articlePath,
      fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
    );

    const entry = recordNoCut(root, 'databases', {
      lastResearched: '2026-07-09',
      researchLogLines: ['Checked the field for movement.', 'Nothing warranted a cut.'],
    });

    expect(entry).toEqual({
      date: '2026-07-09',
      outcome: 'no-cut',
      lines: ['Checked the field for movement.', 'Nothing warranted a cut.'],
    });
    expect(entry).not.toHaveProperty('version');

    const topic = loadTopic(root, 'databases');
    expect(topic.frontmatter.status).toBe('current');
    expect(topic.frontmatter.last_researched).toBe('2026-07-09');
  });

  it('appends the exact research-log grammar loadResearchLog parses, newest first', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');
    const articlePath = path.join(root, 'topics', 'databases', 'article.md');
    fs.writeFileSync(
      articlePath,
      fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
    );

    recordNoCut(root, 'databases', {
      lastResearched: '2026-07-09',
      researchLogLines: ['Line one.', 'Line two.', 'Line three.'],
    });

    const entries = loadResearchLog(root, 'databases');
    expect(entries).toEqual([
      {
        date: '2026-07-09',
        outcome: 'no-cut',
        lines: ['Line one.', 'Line two.', 'Line three.'],
      },
    ]);
  });

  it('a second no-cut run inserts its entry above the first — newest first', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');
    const articlePath = path.join(root, 'topics', 'databases', 'article.md');
    const stampInResearch = () =>
      fs.writeFileSync(
        articlePath,
        fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
      );

    stampInResearch();
    recordNoCut(root, 'databases', { lastResearched: '2026-06-01', researchLogLines: ['First run.'] });
    stampInResearch();
    recordNoCut(root, 'databases', { lastResearched: '2026-07-09', researchLogLines: ['Second run.'] });

    const entries = loadResearchLog(root, 'databases');
    expect(entries.map((e) => e.date)).toEqual(['2026-07-09', '2026-06-01']);
  });

  it('throws ContentValidationError when the topic is not in-research', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases'); // default status: current

    expect(() =>
      recordNoCut(root, 'databases', { lastResearched: '2026-07-09', researchLogLines: ['x', 'y'] })
    ).toThrow(ContentValidationError);
  });

  it('throws ContentNotFoundError when research-log.md is missing — and leaves the article untouched', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'no-log', { status: 'in-research' });
    const articlePath = path.join(root, 'topics', 'no-log', 'article.md');
    const before = fs.readFileSync(articlePath);

    expect(() =>
      recordNoCut(root, 'no-log', { lastResearched: '2026-07-09', researchLogLines: ['x', 'y'] })
    ).toThrow(ContentNotFoundError);

    // Read-before-write ordering: the failed resolution left no partial state —
    // status is still in-research, last_researched unbumped, byte-for-byte.
    expect(fs.readFileSync(articlePath).equals(before)).toBe(true);
  });

  describe('input validation — the write side is no laxer than the read side', () => {
    const setup = (): string => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases');
      const articlePath = path.join(root, 'topics', 'databases', 'article.md');
      fs.writeFileSync(
        articlePath,
        fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
      );
      return root;
    };

    it.each([
      ['a calendrically impossible date', '2026-13-99'],
      ['a date carrying a newline', '2026-07-09\nforged: line'],
      ['a non-date string', 'yesterday'],
    ])('rejects %s as lastResearched, touching nothing', (_label, badDate) => {
      const root = setup();
      const articlePath = path.join(root, 'topics', 'databases', 'article.md');
      const before = fs.readFileSync(articlePath);

      expect(() =>
        recordNoCut(root, 'databases', { lastResearched: badDate, researchLogLines: ['a line'] })
      ).toThrow(ContentValidationError);
      expect(fs.readFileSync(articlePath).equals(before)).toBe(true);
    });

    it('rejects empty researchLogLines', () => {
      const root = setup();
      expect(() =>
        recordNoCut(root, 'databases', { lastResearched: '2026-07-09', researchLogLines: [] })
      ).toThrow(ContentValidationError);
    });

    it('rejects a line that would forge a log heading', () => {
      const root = setup();
      expect(() =>
        recordNoCut(root, 'databases', {
          lastResearched: '2026-07-09',
          researchLogLines: ['## 2020-01-01 — cut v99'],
        })
      ).toThrow(ContentValidationError);
    });

    it('rejects a line with an embedded newline (which could smuggle a heading)', () => {
      const root = setup();
      expect(() =>
        recordNoCut(root, 'databases', {
          lastResearched: '2026-07-09',
          researchLogLines: ['innocent\n## 2020-01-01 — no-cut'],
        })
      ).toThrow(ContentValidationError);
    });
  });
});
