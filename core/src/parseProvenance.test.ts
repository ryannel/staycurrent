import { describe, expect, it } from 'vitest';
import { ContentValidationError } from './errors.js';
import { parseProvenance } from './parseProvenance.js';

describe('parseProvenance', () => {
  it('parses well-formed Sources and Synthesis bullets', () => {
    const raw = [
      '## Sources',
      '',
      '- [Vitess docs](https://vitess.io) — accessed 2026-06-01 — supports: sharding claim',
      '',
      '## Synthesis',
      '',
      '- Convergence is a market trend, not a technical inevitability.',
      '',
    ].join('\n');

    const record = parseProvenance(raw, 'databases', 'topics/databases/versions/v5/provenance.md');

    expect(record.sources).toEqual([
      {
        title: 'Vitess docs',
        url: 'https://vitess.io',
        accessed: '2026-06-01',
        supports: 'sharding claim',
      },
    ]);
    expect(record.synthesis).toEqual(['Convergence is a market trend, not a technical inevitability.']);
  });

  it('allows Sources-only or Synthesis-only (combined non-emptiness is the gate\'s concern, not the parser\'s)', () => {
    const sourcesOnly = parseProvenance(
      '## Sources\n\n- [A](https://a.example) — accessed 2026-01-01 — supports: x\n\n## Synthesis\n',
      'databases',
      'provenance.md'
    );
    expect(sourcesOnly.sources).toHaveLength(1);
    expect(sourcesOnly.synthesis).toHaveLength(0);
  });

  it('throws ContentValidationError naming the offending line for a malformed Sources bullet', () => {
    const raw = '## Sources\n\n- just a title, no link or accessed date\n';
    expect(() => parseProvenance(raw, 'databases', 'topics/databases/versions/v5/provenance.md')).toThrow(
      ContentValidationError
    );
    try {
      parseProvenance(raw, 'databases', 'topics/databases/versions/v5/provenance.md');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const validationError = err as ContentValidationError;
      expect(validationError.topic).toBe('databases');
      expect(validationError.file).toBe('topics/databases/versions/v5/provenance.md');
      expect(validationError.issues[0]).toContain('just a title, no link or accessed date');
    }
  });

  it('throws ContentValidationError for a Synthesis bullet not starting with "- "', () => {
    const raw = '## Synthesis\n\n* not a dash bullet\n';
    expect(() => parseProvenance(raw, 'databases', 'provenance.md')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError for an unexpected heading before the first recognized section', () => {
    const raw = '## Notes\n\n- something\n\n## Sources\n';
    try {
      parseProvenance(raw, 'databases', 'provenance.md');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toBe(
        "unexpected heading '## Notes' — provenance carries only ## Sources and ## Synthesis"
      );
    }
  });

  it('throws ContentValidationError for an unexpected heading after a recognized section — never silently absorbed', () => {
    const raw =
      '## Sources\n\n- [A](https://a.example) — accessed 2026-01-01 — supports: x\n\n## Appendix\n\n- stray bullet\n';
    try {
      parseProvenance(raw, 'databases', 'provenance.md');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain("unexpected heading '## Appendix'");
    }
  });

  it('throws ContentValidationError for a calendrically impossible accessed date', () => {
    const raw = '## Sources\n\n- [A](https://a.example) — accessed 2026-02-30 — supports: x\n';
    try {
      parseProvenance(raw, 'databases', 'provenance.md');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain("invalid accessed date '2026-02-30'");
    }
  });
});
