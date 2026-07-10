import type { TopicFrontmatter, VersionSnapshot } from './types.js';
import { isIsoDate, normalizeDateValue } from './dates.js';

export interface FieldValidation<T> {
  value?: T;
  issues: string[];
}

// <int>d with at least 1 day — a 0d cadence would make every topic perpetually due.
const CADENCE_RE = /^[1-9]\d*d$/;
const STATUS_VALUES = new Set(['current', 'in-research']);

// Zero-width/format codepoints that render as nothing in a browser but are not
// whitespace under `.trim()` — U+200B (ZERO WIDTH SPACE), U+200C (ZERO WIDTH
// NON-JOINER), U+200D (ZERO WIDTH JOINER), U+2060 (WORD JOINER), U+FEFF (ZERO
// WIDTH NO-BREAK SPACE / BOM). A title or stance built only from these passes
// `value.trim() === ''` as non-empty while reading as blank to an actual
// reader — the exact G8 failure this strips before the emptiness test.
const ZERO_WIDTH_RE = /[​‌‍⁠﻿]/g;

/**
 * True iff `value` carries no visible content once zero-width/format
 * characters are removed — the blank check every `title`/`stance` field
 * shares (validator here, `createTopic`'s pre-write guard elsewhere).
 */
export function isBlankField(value: string): boolean {
  return value.replace(ZERO_WIDTH_RE, '').trim() === '';
}

/**
 * Validates a topic's live `article.md` frontmatter against the schema
 * `04-data-design.md` fixes for `topics/<slug>/article.md`, and the `topic ===
 * slug` reconciliation check `03-api-design.md`'s `loadTopic` names.
 */
export function validateTopicFrontmatter(
  data: Record<string, unknown>,
  slug: string
): FieldValidation<TopicFrontmatter> {
  const issues: string[] = [];

  const topic = typeof data.topic === 'string' ? data.topic : undefined;
  if (topic === undefined) {
    issues.push("field 'topic' must be a string");
  } else if (topic !== slug) {
    issues.push(`field 'topic' ('${topic}') does not match directory name ('${slug}')`);
  }

  const title = typeof data.title === 'string' ? data.title : undefined;
  if (title === undefined) {
    issues.push("field 'title' must be a string");
  } else if (isBlankField(title)) {
    issues.push("field 'title' must not be empty or whitespace-only");
  }

  const stance = typeof data.stance === 'string' ? data.stance : undefined;
  if (stance === undefined) {
    issues.push("field 'stance' must be a string");
  } else if (isBlankField(stance)) {
    issues.push("field 'stance' must not be empty or whitespace-only");
  }

  const version =
    typeof data.version === 'number' && Number.isInteger(data.version) && data.version > 0
      ? data.version
      : undefined;
  if (version === undefined) issues.push("field 'version' must be a positive integer");

  const status =
    typeof data.status === 'string' && STATUS_VALUES.has(data.status)
      ? (data.status as 'current' | 'in-research')
      : undefined;
  if (status === undefined) {
    issues.push(`field 'status' must be one of 'current' | 'in-research', got '${String(data.status)}'`);
  }

  const cadenceRaw = typeof data.cadence === 'string' ? data.cadence : undefined;
  if (cadenceRaw === undefined || !CADENCE_RE.test(cadenceRaw)) {
    issues.push(
      `field 'cadence' must match the pattern <int>d with at least 1 day, got '${String(data.cadence)}'`
    );
  }

  const lastResearchedRaw = normalizeDateValue(data.last_researched);
  if (lastResearchedRaw === undefined || !isIsoDate(lastResearchedRaw)) {
    issues.push(
      `field 'last_researched' must be an ISO date (YYYY-MM-DD), got '${String(data.last_researched)}'`
    );
  }

  if (issues.length > 0) return { issues };

  return {
    issues: [],
    value: {
      topic: topic as string,
      title: title as string,
      stance: stance as string,
      version: version as number,
      status: status as 'current' | 'in-research',
      cadence: cadenceRaw as `${number}d`,
      last_researched: lastResearchedRaw as string,
    },
  };
}

const VERSION_SNAPSHOT_FIELDS = new Set(['version', 'cut']);

/**
 * Validates a frozen `versions/vN/article.md` frontmatter: exactly `version` and
 * `cut` — any other key (`status` included) is rejected (`03-api-design.md`'s
 * `loadVersion` Errors; `04-data-design.md`'s Version Snapshot Frontmatter).
 */
export function validateVersionFrontmatter(
  data: Record<string, unknown>
): FieldValidation<VersionSnapshot> {
  const issues: string[] = [];

  const version =
    typeof data.version === 'number' && Number.isInteger(data.version) && data.version > 0
      ? data.version
      : undefined;
  if (version === undefined) issues.push("field 'version' must be a positive integer");

  const cutRaw = normalizeDateValue(data.cut);
  if (cutRaw === undefined || !isIsoDate(cutRaw)) {
    issues.push(`field 'cut' must be an ISO date (YYYY-MM-DD), got '${String(data.cut)}'`);
  }

  for (const key of Object.keys(data)) {
    if (!VERSION_SNAPSHOT_FIELDS.has(key)) {
      issues.push(
        `unexpected field '${key}' — snapshot frontmatter is exactly 'version' and 'cut'`
      );
    }
  }

  if (issues.length > 0) return { issues };

  return {
    issues: [],
    value: { version: version as number, cut: cutRaw as string },
  };
}
