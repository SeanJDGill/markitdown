import { getCollection, render, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';
import type {
  CaseStudy,
  Cheatsheet,
  ContentImage,
  ContentSource,
  Tooltip,
  UxBite,
} from '../types';

/**
 * The current content source: Astro content collections backed by local
 * Markdown/MDX. This is the ONLY module that knows about `astro:content`.
 * It maps Astro's `CollectionEntry` objects onto our domain types.
 */

const isProd = import.meta.env.PROD;

function toImage(src: string | undefined, alt: string): ContentImage | undefined {
  if (!src) return undefined;
  return { src, alt };
}

/**
 * Reading time, computed from the raw body. We do this here rather than via a
 * remark plugin because remark-injected frontmatter only reaches `render()`'s
 * output, never the collection's parsed `data`.
 */
function readingMinutes(body: string | undefined): number | undefined {
  if (!body) return undefined;
  return Math.max(1, Math.round(getReadingTime(body).minutes));
}

function mapCaseStudy(entry: CollectionEntry<'caseStudies'>): CaseStudy {
  const d = entry.data;
  return {
    slug: entry.id,
    title: d.title,
    company: d.company,
    excerpt: d.excerpt,
    topics: d.topics,
    category: d.category,
    hero: toImage(d.heroImage, d.heroImageAlt)!,
    publishDate: d.publishDate,
    updatedDate: d.updatedDate,
    author: d.author,
    featured: d.featured,
    rating: d.rating,
    readingTime: d.readingTime ?? readingMinutes(entry.body),
    seo: d.seo,
    render: () => render(entry),
  };
}

function mapUxBite(entry: CollectionEntry<'uxBites'>): UxBite {
  const d = entry.data;
  return {
    slug: entry.id,
    title: d.title,
    company: d.company,
    insight: d.insight,
    topics: d.topics,
    image: toImage(d.image, d.imageAlt ?? d.title),
    publishDate: d.publishDate,
    render: () => render(entry),
  };
}

function mapCheatsheet(entry: CollectionEntry<'cheatsheets'>): Cheatsheet {
  const d = entry.data;
  return {
    slug: entry.id,
    title: d.title,
    summary: d.summary,
    topics: d.topics,
    publishDate: d.publishDate,
    render: () => render(entry),
  };
}

function mapTooltip(entry: CollectionEntry<'tooltips'>): Tooltip {
  const d = entry.data;
  return {
    slug: entry.id,
    term: d.term,
    aliases: d.aliases,
    definition: d.definition,
    relatedTopics: d.relatedTopics,
    render: () => render(entry),
  };
}

/** Hide drafts in production builds, keep them visible while authoring. */
const visible = <T extends { data: { draft?: boolean } }>(entries: T[]): T[] =>
  isProd ? entries.filter((e) => !e.data.draft) : entries;

export const astroAdapter: ContentSource = {
  async getAllCaseStudies() {
    return visible(await getCollection('caseStudies')).map(mapCaseStudy);
  },
  async getAllUxBites() {
    return visible(await getCollection('uxBites')).map(mapUxBite);
  },
  async getAllCheatsheets() {
    return visible(await getCollection('cheatsheets')).map(mapCheatsheet);
  },
  async getAllTooltips() {
    return (await getCollection('tooltips')).map(mapTooltip);
  },
};
