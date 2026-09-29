import rss from '@astrojs/rss';
import { getSiteChangelog } from '../lib/content';

export async function GET(context) {
  const entries = await getSiteChangelog();
  return rss({
    title: 'Stay Current',
    description: 'One place to look to stay current on the major topics and fields of software engineering.',
    site: context.site,
    items: entries.map((e) => ({
      title: `${e.title} v${e.version}`,
      pubDate: e.date,
      link: `/${e.slug}/changelog/#v${e.version}`,
      content: e.html,
    })),
    trailingSlash: false,
    customData: '<language>en-gb</language>',
  });
}
