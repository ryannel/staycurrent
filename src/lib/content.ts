import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';

export type Article = CollectionEntry<'articles'>;

/** The slug is the topic directory name; every collection's id starts with it. */
export const slugOf = (id: string) => id.split('/')[0];

export async function getTopics(): Promise<Article[]> {
  const all = await getCollection('articles');
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getTopic(slug: string): Promise<Article> {
  const entry = await getEntry('articles', `${slug}/article`);
  if (!entry) throw new Error(`no topic at topics/${slug}/article.md`);
  return entry;
}

export interface VersionRow {
  version: number;
  cut: Date;
}

export async function getVersions(slug: string): Promise<VersionRow[]> {
  const all = await getCollection('versions', (v) => slugOf(v.id) === slug);
  return all.map((v) => ({ version: v.data.version, cut: v.data.cut })).sort((a, b) => b.version - a.version);
}

export async function getVersion(slug: string, n: number) {
  return getEntry('versions', `${slug}/versions/v${n}/article`);
}

export async function getProvenance(slug: string, n: number) {
  return getEntry('provenance', `${slug}/versions/v${n}/provenance`);
}

export interface ChangelogEntry {
  slug: string;
  version: number;
  date: Date;
  bodyMd: string;
  html: string;
  stance: 'held' | 'bent' | 'reversed' | null;
}

const ENTRY_HEADING = /^##\s+v(\d+)\s+—\s+(\d{4}-\d{2}-\d{2})\s*$/;

/** Splits a changelog body on its "## vN — date" headings, newest first as written. */
export function parseChangelog(slug: string, body: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let current: { version: number; date: Date; lines: string[] } | null = null;
  const flush = () => {
    if (!current) return;
    const bodyMd = current.lines.join('\n').trim();
    const stanceMatch = /^\*\*Stance:\*\*\s*(held|bent|reversed)\b/m.exec(bodyMd);
    entries.push({
      slug,
      version: current.version,
      date: current.date,
      bodyMd,
      html: marked.parse(bodyMd, { gfm: true }) as string,
      stance: stanceMatch ? (stanceMatch[1] as ChangelogEntry['stance']) : null,
    });
  };
  for (const line of body.split('\n')) {
    const m = ENTRY_HEADING.exec(line.trim());
    if (m) {
      flush();
      current = { version: Number(m[1]), date: new Date(`${m[2]}T00:00:00Z`), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  flush();
  return entries;
}

export async function getChangelog(slug: string): Promise<ChangelogEntry[]> {
  const entry = await getEntry('changelogs', `${slug}/changelog`);
  return entry ? parseChangelog(slug, entry.body ?? '') : [];
}

/** Every entry across every topic, newest first. */
export async function getSiteChangelog(): Promise<(ChangelogEntry & { title: string })[]> {
  const topics = await getTopics();
  const all = await Promise.all(
    topics.map(async (t) => (await getChangelog(t.id.split('/')[0])).map((e) => ({ ...e, title: t.data.title })))
  );
  return all.flat().sort((a, b) => b.date.getTime() - a.date.getTime() || b.version - a.version);
}

export async function getResearchLog(slug: string) {
  return getEntry('researchLogs', `${slug}/research-log`);
}

/** "29 Jul 2026", from a UTC date, the same on every machine that builds the site. */
export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getUTCMonth()];
  return `${day} ${month} ${date.getUTCFullYear()}`;
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Groups topics for the library. Topics that carry an `area` are listed under it:
 * the hub first, then foundations in reading order (grouped by movement), then
 * profiles. Topics with no area are listed on their own.
 */
export interface AreaGroup {
  area: string;
  hub?: Article;
  movements: { name: string; topics: Article[] }[];
  profiles: Article[];
}

export function groupTopics(topics: Article[]): { areas: AreaGroup[]; ungrouped: Article[] } {
  const byArea = new Map<string, Article[]>();
  const ungrouped: Article[] = [];
  for (const t of topics) {
    if (t.data.area) {
      byArea.set(t.data.area, [...(byArea.get(t.data.area) ?? []), t]);
    } else {
      ungrouped.push(t);
    }
  }
  const byOrder = (a: Article, b: Article) =>
    (a.data.reading_order ?? 0) - (b.data.reading_order ?? 0) || a.data.title.localeCompare(b.data.title);
  const areas: AreaGroup[] = [];
  for (const [area, members] of byArea) {
    const hub = members.find((m) => m.data.register === 'hub');
    const foundations = members.filter((m) => m.data.register === 'foundation').sort(byOrder);
    const movements: AreaGroup['movements'] = [];
    for (const f of foundations) {
      const name = f.data.movement ?? '';
      const existing = movements.find((m) => m.name === name);
      if (existing) existing.topics.push(f);
      else movements.push({ name, topics: [f] });
    }
    const profiles = members.filter((m) => m.data.register === 'profile').sort(byOrder);
    areas.push({ area, hub, movements, profiles });
  }
  return { areas: areas.sort((a, b) => a.area.localeCompare(b.area)), ungrouped };
}
