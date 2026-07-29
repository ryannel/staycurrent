import type { ProfileAxes, TopicFrontmatter, TopicRegister, VersionSnapshot } from './types.js';
import { isIsoDate, normalizeDateValue } from './dates.js';

export interface FieldValidation<T> {
  value?: T;
  issues: string[];
}

// <int>d with at least 1 day — a 0d cadence would make every topic perpetually due.
const CADENCE_RE = /^[1-9]\d*d$/;
const STATUS_VALUES = new Set(['current', 'in-research']);

// databases-catalogue bet additive fields (04-data-design.md, "The additive
// frontmatter schema"). `register`'s closed set and `axes`' eight recognized
// keys are the only two extraction rules with a fixed vocabulary.
const TOPIC_REGISTER_VALUES = new Set<TopicRegister>(['foundation', 'profile', 'hub']);
const PROFILE_AXES_KEYS = [
  'consistency_model',
  'partition_strategy',
  'query_language',
  'scaling_axis',
  'latency_profile',
  'durability_guarantee',
  'transaction_support',
  'operational_maturity',
] as const;

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

// --- databases-catalogue bet: additive display fields (04-data-design.md,
// "The additive frontmatter schema"; extraction rule per field in
// 03-api-design.md's `validateTopicFrontmatter` entry). Every one of these is
// extracted-if-valid-else-absent and never raises an issue — a malformed or
// missing additive key degrades to `undefined`, never a validation failure. ---

function extractArea(data: Record<string, unknown>): string | undefined {
  return typeof data.area === 'string' && !isBlankField(data.area) ? data.area : undefined;
}

function extractRegister(data: Record<string, unknown>): TopicRegister | undefined {
  return typeof data.register === 'string' && TOPIC_REGISTER_VALUES.has(data.register as TopicRegister)
    ? (data.register as TopicRegister)
    : undefined;
}

function extractMovement(data: Record<string, unknown>): string | undefined {
  return typeof data.movement === 'string' && !isBlankField(data.movement) ? data.movement : undefined;
}

function extractReadingOrder(data: Record<string, unknown>): number | undefined {
  return typeof data.reading_order === 'number' &&
    Number.isInteger(data.reading_order) &&
    data.reading_order > 0
    ? data.reading_order
    : undefined;
}

function extractPrereqs(data: Record<string, unknown>): string[] | undefined {
  return Array.isArray(data.prereqs) && data.prereqs.every((entry) => typeof entry === 'string')
    ? (data.prereqs as string[])
    : undefined;
}

function extractCore(data: Record<string, unknown>): boolean | undefined {
  return typeof data.core === 'boolean' ? data.core : undefined;
}

function extractAxes(data: Record<string, unknown>): ProfileAxes | undefined {
  if (typeof data.axes !== 'object' || data.axes === null || Array.isArray(data.axes)) return undefined;
  const raw = data.axes as Record<string, unknown>;

  const axes: ProfileAxes = {};
  for (const key of PROFILE_AXES_KEYS) {
    const value = raw[key];
    if (typeof value === 'string' && !isBlankField(value)) {
      axes[key] = value;
    }
  }
  return Object.keys(axes).length > 0 ? axes : undefined;
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

  // Additive display fields (databases-catalogue bet) — computed only once the
  // seven required fields are known-good; none of the seven below can ever add
  // to `issues`, so they are safe to extract unconditionally from here on.
  const area = extractArea(data);
  const register = extractRegister(data);
  const movement = extractMovement(data);
  const readingOrder = extractReadingOrder(data);
  const prereqs = extractPrereqs(data);
  const core = extractCore(data);
  const axes = extractAxes(data);

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
      ...(area !== undefined && { area }),
      ...(register !== undefined && { register }),
      ...(movement !== undefined && { movement }),
      ...(readingOrder !== undefined && { reading_order: readingOrder }),
      ...(prereqs !== undefined && { prereqs }),
      ...(core !== undefined && { core }),
      ...(axes !== undefined && { axes }),
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
