import { astroAdapter } from './adapters/astroCollections';
import { cmsAdapter } from './adapters/cms';
import type { CaseStudy, Cheatsheet, ContentSource, Tooltip, UxBite } from './types';

/**
 * The stable, public content API. Every page and component reads content from
 * here — never from `astro:content` directly. The active adapter is selected
 * by the CONTENT_SOURCE env flag, so swapping to a CMS is a one-line change.
 */
const source: ContentSource =
  import.meta.env.CONTENT_SOURCE === 'cms' ? cmsAdapter : astroAdapter;

const byDateDesc = (a: { publishDate: Date }, b: { publishDate: Date }) =>
  b.publishDate.getTime() - a.publishDate.getTime();

// ---- Case studies -----------------------------------------------------------

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return (await source.getAllCaseStudies()).sort(byDateDesc);
}

export async function getFeaturedCaseStudies(limit?: number): Promise<CaseStudy[]> {
  const featured = (await getAllCaseStudies()).filter((c) => c.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return (await getAllCaseStudies()).find((c) => c.slug === slug) ?? null;
}

/** Previous (newer) and next (older) case study, ordered by publish date. */
export async function getAdjacent(
  slug: string,
): Promise<{ prev: CaseStudy | null; next: CaseStudy | null }> {
  const all = await getAllCaseStudies();
  const i = all.findIndex((c) => c.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}

// ---- Other content types ----------------------------------------------------

export async function getAllUxBites(): Promise<UxBite[]> {
  return (await source.getAllUxBites()).sort(byDateDesc);
}

export async function getAllCheatsheets(): Promise<Cheatsheet[]> {
  return (await source.getAllCheatsheets()).sort(byDateDesc);
}

export async function getAllTooltips(): Promise<Tooltip[]> {
  return (await source.getAllTooltips()).sort((a, b) => a.term.localeCompare(b.term));
}

// ---- Cross-cutting queries --------------------------------------------------

export async function getAllTopics(): Promise<string[]> {
  const [studies, bites] = await Promise.all([getAllCaseStudies(), getAllUxBites()]);
  const topics = new Set<string>();
  for (const item of [...studies, ...bites]) item.topics.forEach((t) => topics.add(t));
  return [...topics].sort();
}

export async function getAllCompanies(): Promise<string[]> {
  const studies = await getAllCaseStudies();
  return [...new Set(studies.map((c) => c.company))].sort();
}

export async function getContentByTopic(
  topic: string,
): Promise<{ caseStudies: CaseStudy[]; uxBites: UxBite[] }> {
  const [studies, bites] = await Promise.all([getAllCaseStudies(), getAllUxBites()]);
  return {
    caseStudies: studies.filter((c) => c.topics.includes(topic)),
    uxBites: bites.filter((b) => b.topics.includes(topic)),
  };
}
