import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/**
 * Source-agnostic domain types. Pages and components depend ONLY on these,
 * never on `astro:content` directly. Swapping to a headless CMS later means
 * writing a new adapter that returns these same shapes — nothing else changes.
 */

export interface ContentImage {
  src: string;
  width?: number;
  height?: number;
  alt: string;
}

/** An opaque, source-agnostic way to render a body. The Astro adapter wraps
 *  `entry.render()`; a CMS adapter would compile portable text / MDX. */
export type ContentRenderer = () => Promise<{ Content: AstroComponentFactory }>;

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  excerpt: string;
  topics: string[];
  category?: string;
  hero: ContentImage;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
  featured: boolean;
  rating?: number;
  readingTime?: number;
  seo?: { title?: string; description?: string; ogImage?: string };
  render: ContentRenderer;
}

export interface UxBite {
  slug: string;
  title: string;
  company?: string;
  insight: string;
  topics: string[];
  image?: ContentImage;
  publishDate: Date;
  render: ContentRenderer;
}

export interface Cheatsheet {
  slug: string;
  title: string;
  summary: string;
  topics: string[];
  publishDate: Date;
  render: ContentRenderer;
}

export interface Tooltip {
  slug: string;
  term: string;
  aliases: string[];
  definition: string;
  relatedTopics: string[];
  render: ContentRenderer;
}

export interface ContentSource {
  getAllCaseStudies(): Promise<CaseStudy[]>;
  getAllUxBites(): Promise<UxBite[]>;
  getAllCheatsheets(): Promise<Cheatsheet[]>;
  getAllTooltips(): Promise<Tooltip[]>;
}
