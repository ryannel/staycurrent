import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig, getTopic, getTopicCutDate, getTopicSlugs } from '@/lib/content';
import { formatDisplayDate } from '@/lib/format-date';
import { InstallBlock } from '@/components/skill/install-block';

type PageParams = { topic: string };
type PageProps = { params: Promise<PageParams> };

/**
 * Site Build Data Flow (02-data-flows.md): one `/[topic]/skill/` route per
 * topic — the fourth and last of the trust-apparatus faces, alongside the
 * article/changelog/history routes' own `getTopicSlugs` enumeration.
 */
export function generateStaticParams(): PageParams[] {
  return getTopicSlugs().map((topic) => ({ topic }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  return { title: `${frontmatter.title} — Install Skill` };
}

/**
 * `/[topic]/skill/` — Skill Install Page (01-ui-design.md). Distributes the
 * topic's companion skill: the canonical install one-liner (origin resolved
 * from `site.config.json`'s `url` via `getSiteConfig` — engine code never
 * names the instance), the payload's `article_version` binding stated in
 * plain prose, and — per change-proposal-2 — the honest placeholder label:
 * skill authoring is deferred until the article format settles, so the
 * shipped payload states plainly that it is not yet authored and the
 * article is the stance's only rendering.
 *
 * Only state at MVP (01-ui-design.md's States table: "Current (only state at
 * MVP)") — this route regenerates at every cut and always reflects the live
 * `article_version`, so there is no separate archived variant of this page
 * itself (the archived-version page's own superseded-skill pointer,
 * `app/[topic]/v/[n]/page.tsx`, is what tells a reader an OLDER snapshot's
 * skill is out of date and links back here).
 */
export default async function TopicSkillPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  const config = getSiteConfig();
  const cutDate = getTopicCutDate(slug, frontmatter.version);
  const command =
    `curl -fsSL ${config.url}/skills/${slug}.zip -o /tmp/${slug}-skill.zip` +
    ` && unzip -o /tmp/${slug}-skill.zip -d ~/.claude/skills/`;

  return (
    <div className="doc-shell-content no-toc">
      <article className="reading-column">
        <h1 className="page-title">{`Install the ${frontmatter.title} skill`}</h1>
        <p className="skill-version-binding">
          {`This skill renders v${frontmatter.version} of the stance, cut `}
          <time dateTime={cutDate}>{formatDisplayDate(cutDate)}</time>
          {'.'}
        </p>
        {/* Honest placeholder labelling (change-proposal-2, verbatim intent):
            the reader is told plainly the skill is not yet authored and the
            article is the stance's only rendering — the same wording the
            shipped payload's own SKILL.md carries. */}
        <p className="skill-placeholder-note">
          Placeholder — this topic&apos;s companion skill is not yet authored. Skill design is
          deferred until the article format settles; the published article is the current and
          only rendering of the stance.
        </p>
        <InstallBlock command={command} />
        <p className="skill-back-link">
          <Link href={`/${slug}/`}>{'← Back to the article'}</Link>
        </p>
      </article>
    </div>
  );
}
