import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllCaseStudies } from '../data/content';
import { site } from '../lib/site';
import { withBase } from '../lib/url';

export async function GET(context: APIContext) {
  const studies = await getAllCaseStudies();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? 'https://seanjdgill.github.io',
    items: studies.map((study) => ({
      title: study.title,
      description: study.excerpt,
      pubDate: study.publishDate,
      link: withBase(`/case-studies/${study.slug}/`),
      categories: study.topics,
    })),
    customData: `<language>en</language>`,
  });
}
