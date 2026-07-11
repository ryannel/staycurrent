import type { SiteConfig } from './types.js';
import { ContentValidationError } from './errors.js';
import { listTopics } from './loaders/listTopics.js';
import { loadChangelog } from './loaders/loadChangelog.js';

// The feed caps at the 50 most recent entries site-wide — a fixed constant,
// not a `config` field (03-api-design.md, `buildRss` design rationale:
// "revisit if the ~25-topic ceiling this project already assumes elsewhere
// ... is raised").
const MAX_ITEMS = 50;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * `entry.date` (YYYY-MM-DD) as RSS 2.0's required RFC-822 `pubDate` — parsed
 * and rendered in UTC explicitly (never the running machine's local
 * timezone), the same determinism rule `services/site/lib/format-date.ts`
 * documents for the trust header: the exact same changelog entry must
 * produce the exact same feed byte-for-byte regardless of which machine (or
 * CI runner) builds it. A cut date has no time-of-day component, so every
 * item's clock time is stated as midnight UTC.
 */
function toRfc822(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const day = DAY_NAMES[date.getUTCDay()];
  const dayOfMonth = String(date.getUTCDate()).padStart(2, '0');
  const month = MONTH_NAMES[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}, ${dayOfMonth} ${month} ${year} 00:00:00 GMT`;
}

/** Escapes the five XML predefined entities for a value placed in element text. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface FlatEntry {
  topicTitle: string;
  topicSlug: string;
  version: number;
  date: string;
  bodyHtml: string;
}

/**
 * Builds the site-wide `rss.xml` feed body (03-api-design.md, `buildRss`):
 * every `ChangelogEntry` across every topic, newest first, capped at the 50
 * most recent — "the RSS item is the entry, verbatim" (design system). Sole
 * caller: `services/site`'s `prebuild` script, which reads `site.config.json`
 * and writes the returned string to `public/rss.xml` — this function stays
 * pure (no fs write of its own) so it is testable without a real build.
 *
 * Fails closed exactly like the site's own `sweepOrThrow` (`lib/content.ts`):
 * a non-empty `errors` from the internal `listTopics` sweep means the feed
 * never builds from a partially valid catalogue, so `ContentValidationError`
 * propagates and the site's prebuild — and with it `next build` — fails.
 */
export function buildRss(root: string, config: SiteConfig): string {
  const sweep = listTopics(root);
  if (sweep.errors.length > 0) {
    const detail = sweep.errors.map((e) => `${e.slug}: ${e.message}`).join('; ');
    throw new ContentValidationError(
      '*',
      'topics/',
      [`listTopics reported ${sweep.errors.length} invalid topic(s): ${detail}`]
    );
  }

  // Flatten before formatting so the cap/sort compares raw ISO dates (which
  // sort correctly as plain strings) rather than the RFC-822 strings the
  // items are eventually rendered with (which do not).
  const flat: FlatEntry[] = sweep.topics.flatMap((topic) =>
    loadChangelog(root, topic.topic).map((entry) => ({
      topicTitle: topic.title,
      topicSlug: topic.topic,
      version: entry.version,
      date: entry.date,
      bodyHtml: entry.bodyHtml,
    }))
  );

  // Newest first; `Array#sort`'s guaranteed stability keeps same-day entries
  // in `listTopics`' own slug-ascending order, mirroring
  // `services/site/lib/content.ts`'s `listSiteChangelog` tie-break.
  flat.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const items = flat.slice(0, MAX_ITEMS);

  const itemXml = items
    .map((entry) => {
      const link = `${config.url}/${entry.topicSlug}/changelog/#v${entry.version}`;
      return [
        '    <item>',
        `      <title>${escapeXml(`${entry.topicTitle} v${entry.version}`)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        // Non-permalink: the URL is real and fetchable, but it addresses a
        // fragment on a page whose surrounding content changes as later
        // entries append above it (03-api-design.md, `buildRss` design
        // rationale).
        `      <guid isPermaLink="false">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822(entry.date)}</pubDate>`,
        `      <author>${escapeXml(config.author)}</author>`,
        // `description` carries `entry.bodyHtml` VERBATIM (the same HTML the
        // changelog page renders) — CDATA, not entity-escaping, is what makes
        // "verbatim" literally true here while still producing well-formed XML.
        //
        // A CDATA section ends at its FIRST literal `]]>`, wherever it falls —
        // a body containing that sequence (e.g. a code span like
        // `a[b[i]]> 0`) would close the section early and corrupt every byte
        // after it, silently, with the build still exiting 0. The standard
        // escape splits that run into two adjacent CDATA sections
        // (`]]` + `]]>` + `<![CDATA[` + `>`) which a parser concatenates back
        // into the exact original text, so "verbatim" holds even then.
        `      <description><![CDATA[${entry.bodyHtml.replaceAll(']]>', ']]]]><![CDATA[>')}]]></description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(config.name)}</title>`,
    `    <link>${escapeXml(config.url)}</link>`,
    `    <description>${escapeXml(config.description)}</description>`,
    itemXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
